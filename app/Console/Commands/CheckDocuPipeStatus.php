<?php

namespace App\Console\Commands;

use App\Models\Student;
use App\Notifications\StudentRejectedNotification;
use App\Notifications\StudentVerifiedNotification;
use App\Services\DocuPipeService;
use Illuminate\Console\Command;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Log;

class CheckDocuPipeStatus extends Command
{
    protected $signature   = 'docupipe:check';
    protected $description = 'Poll DocuPipe for pending student card verifications';

    public function handle(DocuPipeService $docuPipe): int
    {
        $schemaId = config('services.docupipe.student_schema_id');

        $pending = Student::where('verified', false)
            ->whereNotNull('docupipe_document_id')
            ->whereIn('docupipe_status', ['uploaded', 'parsed'])
            ->orWhere(function ($q) {
                $q->where('verified', false)
                  ->whereNotNull('docupipe_document_id')
                  ->whereNull('docupipe_status');
            })
            ->with('user')
            ->get();

        Log::info("docupipe:check found {$pending->count()} pending students");

        foreach ($pending as $student) {
            Log::info("docupipe:check processing student {$student->id}, status={$student->docupipe_status}, jobId={$student->docupipe_job_id}, stdId={$student->docupipe_standardization_id}");

            try {
                $this->processStudent($student, $docuPipe, $schemaId);
            } catch (\Throwable $e) {
                Log::error("docupipe:check error for student {$student->id}: " . $e->getMessage());
            }
        }

        return self::SUCCESS;
    }

    private function processStudent(Student $student, DocuPipeService $docuPipe, string $schemaId): void
    {
        // Phase: have standardization result â†’ verify
        if ($student->docupipe_standardization_id && $student->docupipe_status === 'parsed') {
            $status = $docuPipe->checkJob($student->docupipe_job_id);
            Log::info("docupipe:check std job status for student {$student->id}: {$status}");
            if ($status === 'completed') {
                $data = $docuPipe->getStandardization($student->docupipe_standardization_id);
                Log::info("docupipe:check std result for student {$student->id}", $data);
                $this->processResult($student, $data);
            } elseif ($status === 'failed') {
                $this->failStudent($student, 'Error en la estandarizaciÃ³n del documento.');
            }
            return;
        }

        // Phase: have document but no standardization yet â†’ start it
        // (covers: status='uploaded' with or without jobId, and status=null with documentId)
        if ($student->docupipe_document_id) {
            // If we have a parsing jobId, check it first
            if ($student->docupipe_job_id && $student->docupipe_status === 'uploaded') {
                $parseStatus = $docuPipe->checkJob($student->docupipe_job_id);
                Log::info("docupipe:check parse job status for student {$student->id}: {$parseStatus}");
                if ($parseStatus === 'failed') {
                    $this->failStudent($student, 'Error al procesar el documento en DocuPipe.');
                    return;
                }
                if ($parseStatus !== 'completed') {
                    return; // still processing
                }
            }

            // Parsing done (or we don't have jobId â€” try standardize anyway)
            Log::info("docupipe:check starting standardization for student {$student->id}");
            try {
                $std = $docuPipe->startStandardize($student->docupipe_document_id, $schemaId);
                $student->update([
                    'docupipe_status'             => 'parsed',
                    'docupipe_job_id'             => $std['jobId'],
                    'docupipe_standardization_id' => $std['standardizationId'],
                ]);
                Log::info("docupipe:check standardization started for student {$student->id}, stdId={$std['standardizationId']}");
            } catch (\Throwable $e) {
                Log::warning("docupipe:check standardize failed for student {$student->id}: " . $e->getMessage() . " â€” will retry next minute");
            }
        }
    }

    private function processResult(Student $student, array $data): void
    {
        $user = $student->user;

        $isStudent   = (bool) ($data['isStudent'] ?? $data['data']['isStudent'] ?? false);
        $firstName   = trim($data['firstName'] ?? $data['data']['firstName'] ?? '');
        $surname1    = trim($data['surname1']   ?? $data['data']['surname1']   ?? '');
        $surname2    = trim($data['surname2']   ?? $data['data']['surname2']   ?? '');
        $institution = trim($data['institution'] ?? $data['data']['institution'] ?? '');
        $yearStart   = (int) ($data['academicYearStart'] ?? $data['data']['academicYearStart'] ?? 0);
        $yearEnd     = (int) ($data['academicYearEnd']   ?? $data['data']['academicYearEnd']   ?? 0);

        Log::info("docupipe:check parsed data", compact('isStudent','firstName','surname1','surname2','yearStart','yearEnd'));

        if (! $isStudent) {
            $this->failStudent($student, 'El documento no identifica al portador como estudiante.');
            return;
        }

        $cardName = $this->normalize("{$firstName} {$surname1} {$surname2}");
        $userName = $this->normalize($user->name);
        Log::info("docupipe:check name comparison: card='{$cardName}' user='{$userName}'");

        if ($cardName !== $userName) {
            $this->failStudent($student, "El nombre del carnet ({$firstName} {$surname1} {$surname2}) no coincide con el nombre de tu cuenta ({$user->name}).");
            return;
        }

        // Anti-fraud: check if another verified student already owns this card name
        $duplicate = Student::where('verified', true)
            ->where('user_id', '!=', $student->user_id)
            ->with('user')
            ->get()
            ->first(fn($s) => $this->normalize($s->user->name) === $cardName);

        if ($duplicate) {
            $this->failStudent($student, 'Este carnet ya ha sido verificado por otro usuario. Si crees que es un error, contacta con soporte.');
            return;
        }

        if (! $yearEnd) {
            $this->failStudent($student, 'No se pudo determinar el periodo academico del carnet.');
            return;
        }

        $expiresAt = Carbon::create($yearEnd, 12, 31, 23, 59, 59);

        if ($expiresAt->isPast()) {
            $this->failStudent($student, "El carnet ha caducado (curso {$yearStart}-{$yearEnd}).");
            return;
        }

        $student->update([
            'verified'                    => true,
            'expires_at'                  => $expiresAt,
            'school_name'                 => $institution ?: $student->school_name,
            'docupipe_status'             => null,
            'docupipe_job_id'             => null,
            'docupipe_document_id'        => null,
            'docupipe_standardization_id' => null,
        ]);

        Log::info("docupipe:check student {$student->id} (user {$user->id}) VERIFIED");
        // Email deshabilitado: $user->notify(new StudentVerifiedNotification());
    }

    private function failStudent(Student $student, string $reason): void
    {
        Log::warning("docupipe:check rejecting student {$student->id}: {$reason}");
        $student->update([
            'docupipe_status'         => 'failed',
            'docupipe_failure_reason' => $reason,
            'verified'                => false,
        ]);
        // Email deshabilitado: $student->user->notify(new StudentRejectedNotification($reason));
        // No se borra el registro para que el usuario pueda ver el motivo del rechazo en la UI
    }

    private function normalize(string $name): string
    {
        $name = mb_strtolower(trim($name));
        $map  = ['Ã¡'=>'a','Ã©'=>'e','Ã­'=>'i','Ã³'=>'o','Ãº'=>'u','Ã¼'=>'u','Ã±'=>'n',
                 'Ã '=>'a','Ã¨'=>'e','Ã¬'=>'i','Ã²'=>'o','Ã¹'=>'u'];
        return preg_replace('/\s+/', ' ', strtr($name, $map));
    }
}