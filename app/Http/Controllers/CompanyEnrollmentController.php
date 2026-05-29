<?php

namespace App\Http\Controllers;

use App\Models\Company;
use App\Models\Enrollment;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class CompanyEnrollmentController extends Controller
{
    public function index(Request $request, Company $company): Response
    {
        $this->authorize('manageEnrollments', $company);

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

    public function accept(Request $request, Company $company, Enrollment $enrollment): RedirectResponse
    {
        $this->authorize('manageEnrollments', $company);
        $this->checkEnrollmentBelongsToCompany($enrollment, $company);

        if ($enrollment->status !== 'waiting') {
            return back()->withErrors(['enrollment' => 'Solo se pueden aceptar postulaciónes en espera.']);
        }

        $enrollment->update(['status' => 'accepted']);

        return back()->with('status', 'Candidato aceptado.');
    }

    public function remove(Request $request, Company $company, Enrollment $enrollment): RedirectResponse
    {
        $this->authorize('manageEnrollments', $company);
        $this->checkEnrollmentBelongsToCompany($enrollment, $company);

        if ($enrollment->isCancelled()) {
            return back()->withErrors(['enrollment' => 'Esta postulación ya estaba cancelada.']);
        }

        $enrollment->update([
            'status'       => 'cancelled',
            'cancelled_by' => 'company',
        ]);

        return back()->with('status', 'Candidato eliminado del proceso.');
    }

    private function checkEnrollmentBelongsToCompany(Enrollment $enrollment, Company $company): void
    {
        if ($enrollment->company_id !== $company->id) {
            abort(404);
        }
    }
}
