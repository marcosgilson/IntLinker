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
     *
     * Rules:
     * - Must be an active student
     * - Max 5 active enrollments at a time
     * - Cannot re-apply to a company where the enrollment was cancelled
     */
    public function store(StoreEnrollmentRequest $request): RedirectResponse
    {
        $user    = $request->user();
        $student = $user->student;

        if (! $student || ! $student->isActive()) {
            return back()->withErrors(['enrollment' => 'Necesitas una cuenta de alumno activa.']);
        }

        $company = Company::findOrFail($request->validated('company_id'));

        // Check if an enrollment already exists (including cancelled ones)
        if ($student->hasEnrolledIn($company->id)) {
            $existing = $student->enrollments()->where('company_id', $company->id)->first();

            if ($existing->isCancelled()) {
                return back()->withErrors(['enrollment' => 'No puedes volver a postularte a esta empresa.']);
            }

            return back()->withErrors(['enrollment' => 'Ya tienes una postulación activa en esta empresa.']);
        }

        if (! $student->hasActiveEnrollmentSlots()) {
            return back()->withErrors(['enrollment' => 'Has alcanzado el límite de 5 postulaciones activas.']);
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
     * Status changes to "cancelled", token is freed.
     */
    public function destroy(Request $request, Enrollment $enrollment): RedirectResponse
    {
        $student = $request->user()->student;

        if (! $student || $enrollment->student_id !== $student->id) {
            abort(403);
        }

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
