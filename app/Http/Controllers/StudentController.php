<?php

namespace App\Http\Controllers;

use App\Helpers\ImageHelper;
use App\Http\Requests\AddSchoolRequest;
use App\Http\Requests\BecomeStudentRequest;
use App\Models\School;
use App\Models\Student;
use App\Services\DocuPipeService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class StudentController extends Controller
{
    public function store(BecomeStudentRequest $request, DocuPipeService $docuPipe): RedirectResponse
    {
        $user = $request->user();

        if ($user->student) {
            // Allow re-submission if previous verification failed
            if ($user->student->docupipe_status === 'failed') {
                $user->student->delete();
            } else {
                return back()->withErrors(['student' => 'Ya tienes una solicitud de alumno en proceso o activa.']);
            }
        }

        $user->update(['name' => $request->validated('name')]);

        $file = $request->file('student_card_image');

        Log::info("StudentController: uploading card to DocuPipe for user {$user->id}");

        try {
            $upload = $docuPipe->uploadDocument($file);
        } catch (\Throwable $e) {
            Log::error("StudentController: DocuPipe upload failed for user {$user->id}: " . $e->getMessage());
            return back()->withErrors(['student' => 'Error al enviar el carnet a DocuPipe: ' . $e->getMessage()]);
        }

        $base64 = ImageHelper::compressToBase64($file, 800, 85);

        Student::create([
            'user_id'                    => $user->id,
            'school_name'                => $request->validated('school_name'),
            'school_email'               => $request->validated('school_email'),
            'verified'                   => false,
            'student_card_image'         => $base64,
            'docupipe_document_id'       => $upload['documentId'],
            'docupipe_job_id'            => $upload['jobId'],
            'docupipe_status'            => 'uploaded',
        ]);

        Log::info("StudentController: student record created for user {$user->id}, documentId={$upload['documentId']}");

        return back()->with('status', 'Carnet recibido. Te notificaremos por correo cuando se complete la verificacion.');
    }

    public function renew(BecomeStudentRequest $request, DocuPipeService $docuPipe): RedirectResponse
    {
        $user = $request->user();

        if (! $user->student) {
            return back()->withErrors(['student' => 'No tienes cuenta de alumno.']);
        }

        $user->update(['name' => $request->validated('name')]);

        $file = $request->file('student_card_image');

        Log::info("StudentController: uploading renewal card to DocuPipe for user {$user->id}");

        try {
            $upload = $docuPipe->uploadDocument($file);
        } catch (\Throwable $e) {
            Log::error("StudentController: DocuPipe upload failed for user {$user->id}: " . $e->getMessage());
            return back()->withErrors(['student' => 'Error al enviar el carnet: ' . $e->getMessage()]);
        }

        $base64 = ImageHelper::compressToBase64($file, 800, 85);

        $user->student->update([
            'verified'                   => false,
            'student_card_image'         => $base64,
            'docupipe_document_id'       => $upload['documentId'],
            'docupipe_job_id'            => $upload['jobId'],
            'docupipe_status'            => 'uploaded',
            'docupipe_standardization_id' => null,
            'docupipe_failure_reason'    => null,
        ]);

        Log::info("StudentController: renewal uploaded for user {$user->id}, documentId={$upload['documentId']}");

        return back()->with('status', 'Carnet recibido. Te notificaremos por correo cuando se complete la verificacion.');
    }

    public function addSchool(AddSchoolRequest $request): RedirectResponse
    {
        $student = $request->user()->student;

        if (! $student || ! $student->isActive()) {
            return back()->withErrors(['student' => 'Necesitas una cuenta de alumno activa.']);
        }

        $school = School::findOrFail($request->validated('school_id'));

        if ($student->schools()->where('school_id', $school->id)->exists()) {
            return back()->withErrors(['school_id' => 'Ya tienes esta escuela en tu perfil.']);
        }

        $base64 = ImageHelper::compressToBase64($request->file('student_card_image'), 800, 85);

        $student->schools()->attach($school->id, [
            'student_card_image' => $base64,
            'verified'           => false,
        ]);

        return back()->with('status', 'Escuela anadida. Pendiente de verificacion.');
    }

    public function removeSchool(Request $request, School $school): RedirectResponse
    {
        $student = $request->user()->student;

        if (! $student) {
            return back()->withErrors(['student' => 'No tienes cuenta de alumno.']);
        }

        if (! $student->schools()->where('school_id', $school->id)->exists()) {
            return back()->withErrors(['school_id' => 'No tienes esta escuela en tu perfil.']);
        }

        $student->schools()->detach($school->id);

        return back()->with('status', 'Escuela eliminada del perfil.');
    }

    public function resetFailed(Request $request): RedirectResponse
    {
        $user = $request->user();
        $student = $user->student;

        if (! $student) {
            return back()->withErrors(['student' => 'No tienes ninguna solicitud activa.']);
        }

        // Force delete regardless of status (user wants to start over)
        $student->enrollments()->delete();
        $student->schools()->detach();
        $student->delete();

        return back()->with('status', 'Solicitud eliminada. Puedes enviar un nuevo carnet.');
    }

    public function status(Request $request): JsonResponse
    {
        $student = $request->user()->student;

        if (! $student) {
            return response()->json(['status' => 'none']);
        }

        if ($student->verified) {
            return response()->json(['status' => 'verified']);
        }

        if ($student->docupipe_status === 'failed') {
            return response()->json([
                'status' => 'failed',
                'reason' => $student->docupipe_failure_reason,
            ]);
        }

        return response()->json(['status' => 'pending']);
    }
}
