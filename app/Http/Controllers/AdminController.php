<?php

namespace App\Http\Controllers;

use App\Models\Company;
use App\Models\CompanyApplication;
use App\Models\Student;
use App\Models\User;
use App\Notifications\StudentVerifiedNotification;
use App\Notifications\WorkerVerifiedNotification;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class AdminController extends Controller
{
    public function dashboard(): Response
    {
        $pendingEmailUsers = User::whereNull('email_verified_at')->latest()->get(['id', 'name', 'email', 'created_at']);

        $pendingStudents = Student::with('user:id,name,email')
            ->where('verified', false)
            ->latest()
            ->get();

        $pendingWorkers = DB::table('company_employees')
            ->join('users', 'company_employees.user_id', '=', 'users.id')
            ->join('companies', 'company_employees.company_id', '=', 'companies.id')
            ->where('company_employees.verified', false)
            ->select(
                'company_employees.user_id',
                'company_employees.company_id',
                'company_employees.position',
                'company_employees.created_at',
                'users.name as user_name',
                'users.email as user_email',
                'companies.name as company_name'
            )
            ->latest('company_employees.created_at')
            ->get();

        $applications = CompanyApplication::with('user:id,name,email')
            ->orderByRaw("CASE status WHEN 'pending' THEN 1 WHEN 'approved' THEN 2 WHEN 'rejected' THEN 3 ELSE 4 END")
            ->latest()
            ->paginate(20);

        return Inertia::render('Admin/Dashboard', [
            'pendingEmailUsers' => $pendingEmailUsers,
            'pendingStudents' => $pendingStudents,
            'pendingWorkers'  => $pendingWorkers,
            'applications'    => $applications,
        ]);
    }

    public function storeCompany(Request $request): RedirectResponse
    {
        $request->validate([
            'name'               => 'required|string|max:255|unique:companies,name',
            'description'        => 'nullable|string|max:2000',
            'city'               => 'nullable|string|max:255',
            'applications_email' => 'nullable|email|max:255',
        ]);

        Company::create([
            'name'               => $request->name,
            'description'        => $request->description,
            'city'               => $request->city,
            'applications_email' => $request->applications_email,
        ]);

        return back()->with('status', "Empresa '{$request->name}' creada correctamente.");
    }

    public function companyApplications(Request $request): Response
    {
        $applications = CompanyApplication::with('user:id,name,email')
            ->orderByRaw("CASE status WHEN 'pending' THEN 1 WHEN 'approved' THEN 2 WHEN 'rejected' THEN 3 ELSE 4 END")
            ->latest()
            ->paginate(20);

        return Inertia::render('Admin/CompanyApplications', [
            'applications' => $applications,
        ]);
    }

    public function approveApplication(Request $request, CompanyApplication $application): RedirectResponse
    {
        $request->validate(['admin_notes' => ['nullable', 'string', 'max:1000']]);

        if (! $application->isPending()) {
            return back()->withErrors(['application' => 'Esta solicitud ya fue procesada.']);
        }

        if (Company::where('name', $application->company_name)->exists()) {
            return back()->withErrors(['application' => "Ya existe una empresa con el nombre '{$application->company_name}'."]);
        }

        DB::transaction(function () use ($application, $request) {
            $company = Company::create([
                'name'        => $application->company_name,
                'description' => $application->description,
            ]);

            // Add requester as first employee â”€ already verified since admin approved
            $company->employees()->attach($application->user_id, [
                'position'  => $application->position,
                'verified'  => true,
            ]);

            $application->update([
                'status'      => 'approved',
                'admin_notes' => $request->admin_notes,
            ]);
        });

        return back()->with('status', "Empresa '{$application->company_name}' creada y trabajador verificado.");
    }

    public function rejectApplication(Request $request, CompanyApplication $application): RedirectResponse
    {
        $request->validate(['admin_notes' => ['nullable', 'string', 'max:1000']]);

        if (! $application->isPending()) {
            return back()->withErrors(['application' => 'Esta solicitud ya fue procesada.']);
        }

        $application->update([
            'status'      => 'rejected',
            'admin_notes' => $request->admin_notes,
        ]);

        return back()->with('status', 'Solicitud rechazada.');
    }

    
    public function updateCompanyEmail(Request $request, Company $company): RedirectResponse
    {
        $request->validate([
            'applications_email' => 'nullable|email|max:255',
        ]);
        $company->update(['applications_email' => $request->applications_email]);
        return back()->with('status', "Correo de '{$company->name}' actualizado.");
    }

    // â”€ Student verification â”€

        public function verifyStudent(Student $student): RedirectResponse
    {
        $student->update(['verified' => true]);
        // Email deshabilitado: $student->user->notify(new StudentVerifiedNotification());
        return back()->with('status', "Alumno '{$student->user->name}' verificado correctamente.");
    }

    public function rejectStudent(Request $request, Student $student): RedirectResponse
    {
        $request->validate(['admin_notes' => ['nullable', 'string', 'max:500']]);
        // Delete the record so the user can re-apply with corrected info
        $student->delete();
        return back()->with('status', 'Registro de alumno rechazado y eliminado. El usuario puede volver a solicitarlo.');
    }

    // â”€ Worker (company_employees pivot) verification â”€

    public function verifyWorker(Request $request): RedirectResponse
    {
        $request->validate([
            'user_id'    => 'required|integer|exists:users,id',
            'company_id' => 'required|integer|exists:companies,id',
        ]);

        DB::table('company_employees')
            ->where('user_id', $request->user_id)
            ->where('company_id', $request->company_id)
            ->update(['verified' => true]);

        $user    = User::find($request->user_id);
        $company = Company::find($request->company_id);

        // Email deshabilitado: $user->notify(new WorkerVerifiedNotification($company->name));

        return back()->with('status', "Trabajador '{$user->name}' verificado en '{$company->name}'.");
    }


    public function deleteUnverifiedUser(User $user): RedirectResponse
    {
        if ($user->email_verified_at !== null) {
            return back()->withErrors(['user' => 'Este usuario ya tiene el email verificado.']);
        }
        $name = $user->name;
        $user->delete();
        return back()->with('status', "Cuenta de \"{$name}\" eliminada correctamente.");
    }

    public function verifyUser(User $user): RedirectResponse
    {
        $user->update(['email_verified_at' => now()]);
        return back()->with('status', "Usuario \"{$user->name}\" verificado correctamente. Ya puede acceder a la plataforma.");
    }
    public function rejectWorker(Request $request): RedirectResponse
    {
        $request->validate([
            'user_id'    => 'required|integer|exists:users,id',
            'company_id' => 'required|integer|exists:companies,id',
        ]);

        DB::table('company_employees')
            ->where('user_id', $request->user_id)
            ->where('company_id', $request->company_id)
            ->delete();

        return back()->with('status', 'Registro de trabajador rechazado y eliminado.');
    }
}


