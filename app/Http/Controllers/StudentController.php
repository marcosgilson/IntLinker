<?php

namespace App\Http\Controllers;

use App\Http\Requests\AddSchoolRequest;
use App\Http\Requests\BecomeStudentRequest;
use App\Helpers\ImageHelper;
use App\Jobs\ProcessStudentCard;
use App\Models\School;
use App\Models\Student;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

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
        $contents = base64_encode(file_get_contents($file->getRealPath()));

        ProcessStudentCard::dispatch(
            $user->id,
            $contents,
            $file->getClientOriginalName(),
            $file->getMimeType(),
            false,
        );

        return back()->with('status', 'Carnet recibido. Te notificaremos por correo cuando se complete la verificacion.');
    }

    public function renew(BecomeStudentRequest $request): RedirectResponse
    {
        $user = $request->user();

        if (! $user->student) {
            return back()->withErrors(['student' => 'No tienes cuenta de alumno.']);
        }

        $user->update(['name' => $request->validated('name')]);

        $file     = $request->file('student_card_image');
        $contents = base64_encode(file_get_contents($file->getRealPath()));

        ProcessStudentCard::dispatch(
            $user->id,
            $contents,
            $file->getClientOriginalName(),
            $file->getMimeType(),
            true,
        );

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
}