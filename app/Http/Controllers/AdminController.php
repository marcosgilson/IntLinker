<?php

namespace App\Http\Controllers;

use App\Models\Company;
use App\Models\CompanyApplication;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class AdminController extends Controller
{
    /**
     * Admin dashboard: create company form + pending applications.
     */
    public function dashboard(): Response
    {
        $applications = CompanyApplication::with('user:id,name,email')
            ->orderByRaw("FIELD(status, 'pending', 'approved', 'rejected')")
            ->latest()
            ->paginate(20);

        return Inertia::render('Admin/Dashboard', [
            'applications' => $applications,
        ]);
    }

    /**
     * Admin: create a company directly (no review needed).
     */
    public function storeCompany(Request $request): RedirectResponse
    {
        $request->validate([
            'name'               => 'required|string|max:255|unique:companies,name',
            'description'        => 'nullable|string|max:2000',
            'applications_email' => 'nullable|email|max:255',
        ]);

        Company::create([
            'name'               => $request->name,
            'description'        => $request->description,
            'applications_email' => $request->applications_email,
        ]);

        return back()->with('status', "Empresa '{$request->name}' creada correctamente.");
    }

    /**
     * List all pending company creation requests.
     */
    public function companyApplications(Request $request): Response
    {
        $applications = CompanyApplication::with('user:id,name,email')
            ->orderByRaw("FIELD(status, 'pending', 'approved', 'rejected')")
            ->latest()
            ->paginate(20);

        return Inertia::render('Admin/CompanyApplications', [
            'applications' => $applications,
        ]);
    }

    /**
     * Approve a company creation request.
     * Creates the Company entity and adds the requester as first employee.
     */
    public function approveApplication(Request $request, CompanyApplication $application): RedirectResponse
    {
        $request->validate([
            'admin_notes' => ['nullable', 'string', 'max:1000'],
        ]);

        if (! $application->isPending()) {
            return back()->withErrors(['application' => 'Esta solicitud ya fue procesada.']);
        }

        if (Company::where('name', $application->company_name)->exists()) {
            return back()->withErrors(['application' => "Ya existe una empresa con el nombre '{$application->company_name}'.'"]);
        }

        DB::transaction(function () use ($application, $request) {
            $company = Company::create([
                'name'        => $application->company_name,
                'description' => $application->description,
            ]);

            // Add requester as first employee
            $company->employees()->attach($application->user_id);

            $application->update([
                'status'      => 'approved',
                'admin_notes' => $request->admin_notes,
            ]);
        });

        return back()->with('status', "Empresa '{$application->company_name}' creada y solicitud aprobada.");
    }

    /**
     * Reject a company creation request.
     */
    public function rejectApplication(Request $request, CompanyApplication $application): RedirectResponse
    {
        $request->validate([
            'admin_notes' => ['nullable', 'string', 'max:1000'],
        ]);

        if (! $application->isPending()) {
            return back()->withErrors(['application' => 'Esta solicitud ya fue procesada.']);
        }

        $application->update([
            'status'      => 'rejected',
            'admin_notes' => $request->admin_notes,
        ]);

        return back()->with('status', 'Solicitud rechazada.');
    }
}
