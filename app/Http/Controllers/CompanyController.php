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
