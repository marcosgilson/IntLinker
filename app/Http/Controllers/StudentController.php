<?php

namespace App\Http\Controllers;

use App\Helpers\ImageHelper;
use App\Http\Requests\AddSchoolRequest;
use App\Http\Requests\BecomeStudentRequest;
use App\Models\School;
use App\Models\Student;
use App\Services\OcrService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;

class StudentController extends Controller
{
    public function store(BecomeStudentRequest $request): RedirectResponse
    {
        $user = $request->user();

        if ($user->student) {
            return back()->withErrors(['student' => 'Ya eres alumno. Usa la renovacion si tu cuenta ha caducado.']);
        }

        $user->update(['name' => $request->validated('name')]);

        $file     = $request->file('student_card_image');
        $idAlumno = (new OcrService())->extractText($file);
        $base64   = ImageHelper::compressToBase64($file, 800, 85);

        Student::create([
            'user_id'            => $user->id,
            'school_name'        => $request->validated('school_name'),
            'school_email'       => $request->validated('school_email'),
            'expires_at'         => Carbon::now()->addYear(),
            'student_card_image' => $base64,
            'id_alumno'          => $idAlumno,
            'verified'           => false,
        ]);

        return back()->with('status', 'Cuenta de alumno creada. Pendiente de verificacion.');
    }

    public function renew(BecomeStudentRequest $request): RedirectResponse
    {
        $student = $request->user()->student;

        if (! $student) {
            return back()->withErrors(['student' => 'No tienes cuenta de alumno.']);
        }

        $request->user()->update(['name' => $request->validated('name')]);

        $file     = $request->file('student_card_image');
        $idAlumno = (new OcrService())->extractText($file);
        $base64   = ImageHelper::compressToBase64($file, 800, 85);

        $student->update([
            'expires_at'         => Carbon::now()->addYear(),
            'student_card_image' => $base64,
            'id_alumno'          => $idAlumno,
            'verified'           => false,
        ]);

        return back()->with('status', 'Cuenta de alumno renovada. Pendiente de verificacion.');
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

        // Base64 stored in DB — nothing to delete from disk
        $student->schools()->detach($school->id);

        return back()->with('status', 'Escuela eliminada del perfil.');
    }
}
