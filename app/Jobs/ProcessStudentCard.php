<?php

namespace App\Jobs;

use App\Helpers\ImageHelper;
use App\Models\Student;
use App\Models\User;
use App\Services\DocuPipeService;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Http\UploadedFile;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Log;

class ProcessStudentCard implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public int $timeout = 120;
    public int $tries   = 2;

    public function __construct(
        private readonly int    $userId,
        private readonly string $fileContents,
        private readonly string $originalName,
        private readonly string $mimeType,
        private readonly bool   $isRenewal = false,
    ) {}

    public function handle(DocuPipeService $docuPipe): void
    {
        Log::info("ProcessStudentCard: start for user {$this->userId}");

        $user = User::findOrFail($this->userId);

        $tmpPath = tempnam(sys_get_temp_dir(), 'student_card_');
        file_put_contents($tmpPath, base64_decode($this->fileContents));

        Log::info("ProcessStudentCard: temp file written to {$tmpPath}, size=" . filesize($tmpPath));

        try {
            $file = new UploadedFile($tmpPath, $this->originalName, $this->mimeType, null, true);

            Log::info("ProcessStudentCard: calling DocuPipe...");
            $data = $docuPipe->extractStudentCard($file);
            Log::info("ProcessStudentCard: DocuPipe response", $data);

            $isStudent   = (bool) ($data['isStudent'] ?? false);
            $firstName   = trim($data['firstName'] ?? '');
            $surname1    = trim($data['surname1'] ?? '');
            $surname2    = trim($data['surname2'] ?? '');
            $institution = trim($data['institution'] ?? '');
            $yearStart   = (int) ($data['academicYearStart'] ?? 0);
            $yearEnd     = (int) ($data['academicYearEnd'] ?? 0);

            Log::info("ProcessStudentCard: parsed fields", compact('isStudent','firstName','surname1','surname2','yearStart','yearEnd'));

            if (! $isStudent) {
                $this->reject($user, 'El documento no identifica al portador como estudiante.');
                return;
            }

            $fullNameFromCard = $this->normalize("{$firstName} {$surname1} {$surname2}");
            $userFullName     = $this->normalize($user->name);

            Log::info("ProcessStudentCard: name comparison", ['card' => $fullNameFromCard, 'user' => $userFullName]);

            if ($fullNameFromCard !== $userFullName) {
                $this->reject($user, "El nombre del carnet ({$firstName} {$surname1} {$surname2}) no coincide con el nombre de tu cuenta ({$user->name}).");
                return;
            }

            if (! $yearEnd) {
                $this->reject($user, 'No se pudo determinar el periodo académico del carnet.');
                return;
            }

            $expiresAt = Carbon::create($yearEnd, 12, 31, 23, 59, 59);

            if ($expiresAt->isPast()) {
                $this->reject($user, "El carnet ha caducado (ano académico {$yearStart}-{$yearEnd}).");
                return;
            }

            $base64 = ImageHelper::compressToBase64($file, 800, 85);

            if ($this->isRenewal && $user->student) {
                $user->student->update([
                    'expires_at'         => $expiresAt,
                    'student_card_image' => $base64,
                    'verified'           => true,
                    'school_name'        => $institution ?: $user->student->school_name,
                ]);
            } else {
                Student::create([
                    'user_id'            => $user->id,
                    'school_name'        => $institution,
                    'school_email'       => '',
                    'expires_at'         => $expiresAt,
                    'student_card_image' => $base64,
                    'verified'           => true,
                    'id_alumno'          => null,
                ]);
            }

            Log::info("ProcessStudentCard: user {$this->userId} verified successfully");
            // Email deshabilitado: $user->notify(new StudentVerifiedNotification());

        } catch (\Throwable $e) {
            Log::error("ProcessStudentCard failed for user {$this->userId}: " . $e->getMessage(), [
                'exception' => $e->getTraceAsString(),
            ]);
            // Email deshabilitado: $user->notify(new StudentRejectedNotification(...));
        } finally {
            if (file_exists($tmpPath)) {
                @unlink($tmpPath);
            }
        }
    }

    private function reject(User $user, string $reason): void
    {
        Log::warning("ProcessStudentCard: rejected user {$user->id} â€” {$reason}");
        if (! $this->isRenewal) {
            $user->student?->delete();
        }
        // Email deshabilitado: $user->notify(new StudentRejectedNotification($reason));
    }

    private function normalize(string $name): string
    {
        $name = mb_strtolower(trim($name));
        $map  = ['a'=>'a','e'=>'e','i'=>'i','o'=>'o','u'=>'u','u'=>'u','n'=>'n',
                 'a'=>'a','e'=>'e','i'=>'i','o'=>'o','u'=>'u'];
        $name = strtr($name, $map);
        return preg_replace('/\s+/', ' ', $name);
    }
}