<?php

namespace App\Http\Controllers;

use App\Models\Company;
use App\Models\Enrollment;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class CompanyController extends Controller
{
    /**
     * List all companies (publicly accessible).
     */
    public function index(): Response
    {
        $companies = Company::withCount(['activeEnrollments as pending_count'])
            ->latest()
            ->paginate(20);

        return Inertia::render('Companies/Index', [
            'companies' => $companies,
        ]);
    }

    /**
     * Show a single company profile (publicly accessible).
     */
    public function show(Company $company): Response
    {
        $company->load(['employees:id,name']);

        return Inertia::render('Companies/Show', [
            'company' => $company,
        ]);
    }

    /**
     * Worker dashboard: show companies the authenticated user belongs to
     * and their enrollment lists.
     */
    public function myCompany(Request $request): Response|RedirectResponse
    {
        $user = $request->user();

        $companies = $user->companies()
            ->withCount([
                'enrollments as waiting_count'  => fn ($q) => $q->where('status', 'waiting'),
                'enrollments as accepted_count' => fn ($q) => $q->where('status', 'accepted'),
            ])
            ->get(['companies.id', 'companies.name', 'companies.description', 'companies.logo', 'companies.applications_email']);

        if ($companies->isEmpty()) {
            return redirect()->route('home')->with('status', 'No perteneces a ninguna empresa. Únete a una desde la lista de empresas.');
        }

        // Load enrollments for each company (only non-cancelled so the page is useful)
        foreach ($companies as $company) {
            $company->setRelation('enrollments', $company->enrollments()
                ->with('student:id,user_id', 'student.user:id,name,email')
                ->whereIn('status', ['waiting', 'accepted'])
                ->latest()
                ->get());
        }

        return Inertia::render('Company/MyCompany', [
            'companies' => $companies,
        ]);
    }

    /**
     * Join an existing company as an employee.
     */
    public function join(Request $request, Company $company): RedirectResponse
    {
        $user = $request->user();

        if ($company->hasEmployee($user->id)) {
            return back()->withErrors(['company' => 'Ya eres empleado de esta empresa.']);
        }

        $company->employees()->attach($user->id);

        return back()->with('status', "Te has unido a {$company->name} como empleado.");
    }

    /**
     * Leave a company (remove self as employee).
     */
    public function leave(Request $request, Company $company): RedirectResponse
    {
        $user = $request->user();

        if (! $company->hasEmployee($user->id)) {
            return back()->withErrors(['company' => 'No eres empleado de esta empresa.']);
        }

        $company->employees()->detach($user->id);

        return back()->with('status', "Has abandonado {$company->name}.");
    }
}
