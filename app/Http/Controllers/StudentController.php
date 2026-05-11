<?php

namespace App\Http\Controllers;

use App\Http\Requests\AddSchoolRequest;
use App\Http\Requests\BecomeStudentRequest;
use App\Models\School;
use App\Models\Student;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class StudentController extends Controller
{
    /**
     * Register the authenticated user as a student.
     * Stores the student card image and creates the student record (1-year validity).
     */
    public function store(BecomeStudentRequest $request): RedirectResponse
    {
        $user = $request->user();

        if ($user->student) {
            return back()->withErrors(['student' => 'Ya eres alumno. Usa la renovación si tu cuenta ha caducado.']);
        }

        $imagePath = $request->file('student_card_image')->store('student_cards', 'public');

        Student::create([
            'user_id'            => $user->id,
            'expires_at'         => Carbon::now()->addYear(),
            'student_card_image' => $imagePath,
            'verified'           => false,
        ]);

        return back()->with('status', 'Cuenta de alumno creada. Pendiente de verificación.');
    }

    /**
     * Renew the student account for another year.
     * Requires a new student card image for re-verification.
     */
    public function renew(BecomeStudentRequest $request): RedirectResponse
    {
        $student = $request->user()->student;

        if (! $student) {
            return back()->withErrors(['student' => 'No tienes cuenta de alumno.']);
        }

        // Delete old image
        if ($student->student_card_image) {
            Storage::disk('public')->delete($student->student_card_image);
        }

        $imagePath = $request->file('student_card_image')->store('student_cards', 'public');

        $student->update([
            'expires_at'         => Carbon::now()->addYear(),
            'student_card_image' => $imagePath,
            'verified'           => false,
        ]);

        return back()->with('status', 'Cuenta de alumno renovada. Pendiente de verificación.');
    }

    /**
     * Add a school to the student profile.
     */
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

        $imagePath = $request->file('student_card_image')->store('student_cards', 'public');

        $student->schools()->attach($school->id, [
            'student_card_image' => $imagePath,
            'verified'           => false,
        ]);

        return back()->with('status', 'Escuela añadida. Pendiente de verificación.');
    }

    /**
     * Remove a school from the student profile.
     */
    public function removeSchool(Request $request, School $school): RedirectResponse
    {
        $student = $request->user()->student;

        if (! $student) {
            return back()->withErrors(['student' => 'No tienes cuenta de alumno.']);
        }

        $pivot = $student->schools()->where('school_id', $school->id)->first();

        if (! $pivot) {
            return back()->withErrors(['school_id' => 'No tienes esta escuela en tu perfil.']);
        }

        // Delete card image for this school
        Storage::disk('public')->delete($pivot->pivot->student_card_image);

        $student->schools()->detach($school->id);

        return back()->with('status', 'Escuela eliminada del perfil.');
    }
}
