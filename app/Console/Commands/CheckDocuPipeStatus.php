<?php

namespace App\Console\Commands;

use App\Models\Student;
use App\Models\User;
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

        // Phase 1: uploaded → check if parsing done → start standardization
        $uploaded = Student::where('docupipe_status', 'uploaded')
            ->whereNotNull('docupipe_job_id')
            ->with('user')
            ->get();

        foreach ($uploaded as $student) {
            try {
                $status = $docuPipe->checkJob($student->docupipe_job_id);
                Log::info("docupipe:check parsing status for student {$student->id}: {$status}");

                if ($status === 'completed') {
                    $std = $docuPipe->startStandardize($student->docupipe_document_id, $schemaId);
                    $student->update([
                        'docupipe_status'            => 'parsed',
                        'docupipe_job_id'            => $std['jobId'],
                        'docupipe_standardization_id' => $std['standardizationId'],
                    ]);
                    Log::info("docupipe:check student {$student->id} parsed, standardization started");
                } elseif ($status === 'failed') {
                    $this->failStudent($student, 'Error al procesar el documento en DocuPipe.');
                }
            } catch (\Throwable $e) {
                Log::error("docupipe:check error for student {$student->id}: " . $e->getMessage());
            }
        }

        // Phase 2: parsed → check if standardization done → verify
        $parsed = Student::where('docupipe_status', 'parsed')
            ->whereNotNull('docupipe_job_id')
            ->with('user')
            ->get();

        foreach ($parsed as $student) {
            try {
                $status = $docuPipe->checkJob($student->docupipe_job_id);
                Log::info("docupipe:check standardization status for student {$student->id}: {$status}");

                if ($status === 'completed') {
                    $data = $docuPipe->getStandardization($student->docupipe_standardization_id);
                    Log::info("docupipe:check standardization result for student {$student->id}", $data);
                    $this->processResult($student, $data);
                } elseif ($status === 'failed') {
                    $this->failStudent($student, 'Error en la standardizacion del documento.');
                }
            } catch (\Throwable $e) {
                Log::error("docupipe:check error for student {$student->id}: " . $e->getMessage());
            }
        }

        return self::SUCCESS;
    }

    private function processResult(Student $student, array $data): void
    {
        $user = $student->user;

        $isStudent   = (bool) ($data['isStudent'] ?? false);
        $firstName   = trim($data['firstName'] ?? '');
        $surname1    = trim($data['surname1'] ?? '');
        $surname2    = trim($data['surname2'] ?? '');
        $institution = trim($data['institution'] ?? '');
        $yearStart   = (int) ($data['academicYearStart'] ?? 0);
        $yearEnd     = (int) ($data['academicYearEnd'] ?? 0);

        if (! $isStudent) {
            $this->failStudent($student, 'El documento no identifica al portador como estudiante.');
            return;
        }

        $cardName = $this->normalize("{$firstName} {$surname1} {$surname2}");
        $userName = $this->normalize($user->name);

        if ($cardName !== $userName) {
            $this->failStudent($student, "El nombre del carnet ({$firstName} {$surname1} {$surname2}) no coincide con el nombre de tu cuenta ({$user->name}).");
            return;
        }

        if (! $yearEnd) {
            $this->failStudent($student, 'No se pudo determinar el periodo academico del carnet.');
            return;
        }

        $expiresAt = Carbon::create($yearEnd, 12, 31, 23, 59, 59);

        if ($expiresAt->isPast()) {
            $this->failStudent($student, "El carnet ha caducado (ano academico {$yearStart}-{$yearEnd}).");
            return;
        }

        $student->update([
            'verified'                   => true,
            'expires_at'                 => $expiresAt,
            'school_name'                => $institution ?: $student->school_name,
            'docupipe_status'            => null,
            'docupipe_job_id'            => null,
            'docupipe_document_id'       => null,
            'docupipe_standardization_id' => null,
        ]);

        Log::info("docupipe:check student {$student->id} (user {$user->id}) verified successfully");
        $user->notify(new StudentVerifiedNotification());
    }

    private function failStudent(Student $student, string $reason): void
    {
        Log::warning("docupipe:check rejecting student {$student->id}: {$reason}");
        $student->update([
            'docupipe_status'         => 'failed',
            'docupipe_failure_reason' => $reason,
        ]);
        $student->user->notify(new StudentRejectedNotification($reason));
        $student->delete();
    }

    private function normalize(string $name): string
    {
        $name = mb_strtolower(trim($name));
        $map  = ['á'=>'a','é'=>'e','í'=>'i','ó'=>'o','ú'=>'u','ü'=>'u','ñ'=>'n',
                 'à'=>'a','è'=>'e','ì'=>'i','ò'=>'o','ù'=>'u'];
        $name = strtr($name, $map);
        return preg_replace('/\s+/', ' ', $name);
    }
}