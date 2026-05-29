<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreEnrollmentRequest;
use App\Models\Company;
use App\Models\Enrollment;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class EnrollmentController extends Controller
{
    /**
     * List the authenticated student's own enrollments.
     * Enrollments are private: only the student can see their own.
     */
    public function index(Request $request): Response
    {
        $student = $request->user()->student;

        if (! $student) {
            abort(403, 'Necesitas una cuenta de alumno.');
        }

        $enrollments = $student->enrollments()
            ->with('company:id,name,logo')
            ->latest()
            ->get();

        return Inertia::render('Enrollments/Index', [
            'enrollments' => $enrollments,
            'activeSlots' => $student->activeEnrollments()->count(),
            'maxSlots'    => 5,
        ]);
    }

    /**
     * Apply to a company (create enrollment).
     */
    public function store(StoreEnrollmentRequest $request): RedirectResponse
    {
        $user    = $request->user();
        $student = $user->student;

        if (! $student || ! $student->isActive()) {
            return back()->withErrors(['enrollment' => 'Necesitas una cuenta de alumno activa.']);
        }

        $company = Company::findOrFail($request->validated('company_id'));

        if ($student->hasEnrolledIn($company->id)) {
            $existing = $student->enrollments()->where('company_id', $company->id)->first();

            if ($existing->isCancelled()) {
                return back()->withErrors(['enrollment' => 'No puedes volver a postularte a esta empresa.']);
            }

            return back()->withErrors(['enrollment' => 'Ya tienes una postulación activa en esta empresa.']);
        }

        if (! $student->hasActiveEnrollmentSlots()) {
            return back()->withErrors(['enrollment' => 'Has alcanzado el limite de 5 postulaciónes activas.']);
        }

        Enrollment::create([
            'student_id' => $student->id,
            'company_id' => $company->id,
            'status'     => 'waiting',
        ]);

        return back()->with('status', 'Postulación enviada correctamente.');
    }

    /**
     * Cancel an enrollment (student-initiated).
     */
    public function destroy(Request $request, Enrollment $enrollment): RedirectResponse
    {
        $this->authorize('delete', $enrollment);

        if ($enrollment->isCancelled()) {
            return back()->withErrors(['enrollment' => 'Esta postulación ya estaba cancelada.']);
        }

        $enrollment->update([
            'status'       => 'cancelled',
            'cancelled_by' => 'student',
        ]);

        return back()->with('status', 'Postulación cancelada. Se ha liberado un cupo.');
    }
}
