<?php

namespace App\Http\Controllers;

use App\Models\Company;
use App\Models\Enrollment;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class CompanyEnrollmentController extends Controller
{
    /**
     * List all enrollments for a company.
     * Only accessible by employees of that company.
     */
    public function index(Request $request, Company $company): Response
    {
        if (! $company->hasEmployee($request->user()->id) && ! $request->user()->is_admin) {
            abort(403);
        }

        $enrollments = $company->enrollments()
            ->with('student.user:id,name,email,profile_photo')
            ->latest()
            ->get();
        $enrollments->each(function ($e) {
            if ($e->student?->user?->profile_photo) {
                $e->student->user->photo_url = Storage::disk('public')->url($e->student->user->profile_photo);
            } else {
                $e->student?->user && $e->student->user->photo_url = null;
            }
        });

        return Inertia::render('Companies/Enrollments/Index', [
            'company'     => $company->only('id', 'name'),
            'enrollments' => $enrollments,
        ]);
    }

    /**
     * Accept a student as a candidate (green status).
     * The student is still in the process but not yet hired.
     */
    public function accept(Request $request, Company $company, Enrollment $enrollment): RedirectResponse
    {
        $this->authorizeEmployeeAction($request, $company, $enrollment);

        if ($enrollment->status !== 'waiting') {
            return back()->withErrors(['enrollment' => 'Solo se pueden aceptar postulaciones en espera.']);
        }

        $enrollment->update(['status' => 'accepted']);

        return back()->with('status', 'Candidato aceptado.');
    }

    /**
     * Remove a student from the process (company-initiated cancellation → red status).
     * The student recovers their slot but cannot re-apply to this company.
     */
    public function remove(Request $request, Company $company, Enrollment $enrollment): RedirectResponse
    {
        $this->authorizeEmployeeAction($request, $company, $enrollment);

        if ($enrollment->isCancelled()) {
            return back()->withErrors(['enrollment' => 'Esta postulación ya estaba cancelada.']);
        }

        $enrollment->update([
            'status'       => 'cancelled',
            'cancelled_by' => 'company',
        ]);

        return back()->with('status', 'Candidato eliminado del proceso.');
    }

    private function authorizeEmployeeAction(Request $request, Company $company, Enrollment $enrollment): void
    {
        if (! $company->hasEmployee($request->user()->id) && ! $request->user()->is_admin) {
            abort(403);
        }

        if ($enrollment->company_id !== $company->id) {
            abort(404);
        }
    }
}
