<?php

namespace App\Http\Controllers;

use App\Helpers\ImageHelper;
use App\Models\Company;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class CompanyController extends Controller
{
    public function index(Request $request): Response
    {
        $cities           = array_values(array_filter(array_map('trim', (array) $request->query('cities', []))));
        $companies_filter = array_values(array_filter(array_map('trim', (array) $request->query('companies', []))));

        $query = Company::withCount(['activeEnrollments as pending_count']);

        if (!empty($companies_filter)) {
            $query->where(function ($q) use ($companies_filter) {
                foreach ($companies_filter as $name) {
                    $q->orWhere('name', 'like', '%' . $name . '%');
                }
            });
        }

        if (!empty($cities)) {
            $placeholders = implode(',', array_fill(0, count($cities), '?'));
            $query->orderByRaw("CASE WHEN city IN ($placeholders) THEN 0 ELSE 1 END", $cities);
        }

        $query->orderBy('name');

        $paginated       = $query->paginate(20)->withQueryString();
        $allCities       = Company::select('city')->whereNotNull('city')->where('city', '!=', '')->distinct()->orderBy('city')->pluck('city');
        $allCompanyNames = Company::select('id', 'name')->orderBy('name')->get();

        return Inertia::render('Companies/Index', [
            'companies'         => $paginated,
            'allCities'         => $allCities,
            'allCompanyNames'   => $allCompanyNames,
            'selectedCities'    => $cities,
            'selectedCompanies' => $companies_filter,
        ]);
    }

    public function show(Company $company): Response
    {
        $company->load(['employees' => function ($q) {
            $q->select('users.id', 'users.name', 'users.profile_photo')->where('users.is_admin', false);
        }]);

        $user = Auth::user();

        return Inertia::render('Companies/Show', [
            'company'            => $company,
            'canManageLogo'      => $user?->can('update', $company) ?? false,
            'canManagePortfolio' => $user?->can('update', $company) ?? false,
        ]);
    }

    public function myCompany(Request $request): Response|RedirectResponse
    {
        $user      = $request->user();
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
                if ($e->student?->user) {
                    $e->student->user->photo_url = $e->student->user->photo_url;
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
        $this->authorize('update', $company);

        $request->validate([
            'logo' => 'required|image|mimes:jpg,jpeg,png,webp|max:4096',
        ]);

        $base64 = ImageHelper::compressToBase64($request->file('logo'), 600, 80);
        $company->update(['logo' => $base64]);

        return back()->with('status', 'Logo actualizado correctamente.');
    }

    public function updatePortfolio(Request $request, Company $company): RedirectResponse
    {
        $this->authorize('update', $company);

        $request->validate(['portfolio' => ['required', 'array']]);
        $company->update(['portfolio' => $request->portfolio]);

        return back()->with('status', 'portfolio-updated');
    }
}
