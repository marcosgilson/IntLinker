<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreEnrollmentRequest;
use App\Models\Company;
use App\Models\Enrollment;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
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

        $error = DB::transaction(function () use ($student, $company) {
            // Lock the student row so concurrent requests queue here
            $locked = $student->newQuery()->lockForUpdate()->find($student->id);

            if ($locked->hasEnrolledIn($company->id)) {
                $existing = $locked->enrollments()->where('company_id', $company->id)->first();

                return $existing->isCancelled()
                    ? 'No puedes volver a postularte a esta empresa.'
                    : 'Ya tienes una postulación activa en esta empresa.';
            }

            if ($locked->activeEnrollments()->count() >= 5) {
                return 'Has alcanzado el límite de 5 postulaciones activas.';
            }

            Enrollment::create([
                'student_id' => $locked->id,
                'company_id' => $company->id,
                'status'     => 'waiting',
            ]);

            return null;
        });

        if ($error) {
            return back()->withErrors(['enrollment' => $error]);
        }

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
