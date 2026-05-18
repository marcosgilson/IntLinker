<?php

namespace App\Http\Controllers;

use App\Models\Company;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Support\Facades\Storage;

class CompanyController extends Controller
{
    public function index(Request $request): Response
    {
        $cities    = array_values(array_filter(array_map('trim', (array) $request->query('cities', []))));
        $companies_filter = array_values(array_filter(array_map('trim', (array) $request->query('companies', []))));

        $query = Company::withCount(['activeEnrollments as pending_count']);

        // Hard filter by company names (OR between each)
        if (!empty($companies_filter)) {
            $query->where(function ($q) use ($companies_filter) {
                foreach ($companies_filter as $name) {
                    $q->orWhere('name', 'like', '%' . $name . '%');
                }
            });
        }

        // Sort: selected cities first, then alphabetical
        if (!empty($cities)) {
            $placeholders = implode(',', array_fill(0, count($cities), '?'));
            $query->orderByRaw("CASE WHEN city IN ($placeholders) THEN 0 ELSE 1 END", $cities);
        }

        $query->orderBy('name');

        $paginated = $query->paginate(20)->withQueryString();

        $allCities = Company::select('city')
            ->whereNotNull('city')->where('city', '!=', '')
            ->distinct()->orderBy('city')->pluck('city');

        $allCompanyNames = Company::select('id', 'name')->orderBy('name')->get();

        return Inertia::render('Companies/Index', [
            'companies'        => $paginated,
            'allCities'        => $allCities,
            'allCompanyNames'  => $allCompanyNames,
            'selectedCities'   => $cities,
            'selectedCompanies'=> $companies_filter,
        ]);
    }

    public function show(Company $company): Response
    {
        $company->load(['employees' => function ($q) {
            $q->select('users.id', 'users.name', 'users.profile_photo')->where('users.is_admin', false);
        }]);
        $user = \Illuminate\Support\Facades\Auth::user();
        $canManageLogo = $user && ($user->is_admin || $user->companies()->where('companies.id', $company->id)->exists());
        return Inertia::render('Companies/Show', [
            'company'       => $company,
            'canManageLogo' => $canManageLogo,
        ]);
    }

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
            return redirect()->route('home')->with('status', 'No perteneces a ninguna empresa.');
        }

        foreach ($companies as $company) {
            $company->setRelation('enrollments', $company->enrollments()
                ->with('student:id,user_id', 'student.user:id,name,email,profile_photo')
                ->whereIn('status', ['waiting', 'accepted'])
                ->latest()->get());
            $company->enrollments->each(function ($e) {
                if ($e->student?->user?->profile_photo) {
                    $e->student->user->photo_url = \Illuminate\Support\Facades\Storage::disk('public')->url($e->student->user->profile_photo);
                } elseif ($e->student?->user) {
                    $e->student->user->photo_url = null;
                }
            });
        }

        return Inertia::render('Company/MyCompany', ['companies' => $companies]);
    }

    public function join(Request $request, Company $company): RedirectResponse
    {
        return back()->withErrors(['company' => 'Para unirte como trabajador, completa la verificacion en tu perfil.']);
    }

    public function leave(Request $request, Company $company): RedirectResponse
    {
        return back()->withErrors(['company' => 'Accion no disponible.']);
    }

    public function updateLogo(Request $request, Company $company): RedirectResponse
    {
        $user = $request->user();
        $isWorker = $user->companies()->where('companies.id', $company->id)->exists();
        abort_unless($isWorker || $user->is_admin, 403);

        $request->validate([
            'logo' => 'required|image|mimes:jpg,jpeg,png,webp|max:4096',
        ]);

        if ($company->logo) {
            Storage::disk('public')->delete($company->logo);
        }

        $path = $request->file('logo')->store('company-logos', 'public');
        $company->update(['logo' => $path]);

        return back()->with('status', 'Logo actualizado correctamente.');
    }
}