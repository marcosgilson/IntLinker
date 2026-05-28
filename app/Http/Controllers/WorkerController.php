<?php

namespace App\Http\Controllers;

use App\Http\Requests\BecomeWorkerRequest;
use App\Models\Company;
use App\Models\CompanyApplication;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class WorkerController extends Controller
{
    public function store(BecomeWorkerRequest $request): RedirectResponse
    {
        $user = $request->user();

        // Block if already verified worker in any company
        if ($user->companies()->wherePivot('verified', true)->exists()) {
            return back()->withErrors(['company_name' => 'Ya eres trabajador verificado en una empresa. Debes abandonarla antes de unirte a otra.']);
        }

        // Block if already has a pending pivot or pending application
        $hasPendingPivot = $user->companies()->wherePivot('verified', false)->exists();
        $hasPendingApp   = CompanyApplication::where('user_id', $user->id)->where('status', 'pending')->exists();

        if ($hasPendingPivot || $hasPendingApp) {
            return back()->withErrors(['company_name' => 'Ya tienes una solicitud pendiente de verificacion. Espera a que el administrador la revise o cancela la actual.']);
        }

        $companyName  = $request->validated('company_name');
        $position     = $request->validated('position');

        $user->update(['name' => $request->validated('name')]);

        $imagePath    = $request->file('work_card_image')->store('work_cards', 'public');
        $idTrabajador = 'TRB-' . strtoupper(Str::random(8));

        $company = Company::where('name', $companyName)->first();

        if ($company) {
            $user->companies()->attach($company->id, [
                'position'        => $position,
                'work_card_image' => $imagePath,
                'id_trabajador'   => $idTrabajador,
                'verified'        => false,
            ]);
            return back()->with('status', 'Solicitud enviada. Pendiente de verificacion por el administrador.');
        }

        CompanyApplication::create([
            'user_id'         => $user->id,
            'company_name'    => $companyName,
            'position'        => $position,
            'work_card_image' => $imagePath,
            'id_trabajador'   => $idTrabajador,
            'status'          => 'pending',
        ]);

        return back()->with('status', 'Solicitud enviada. El administrador la revisara pronto.');
    }

    /**
     * Worker voluntarily leaves their company (removes pivot or cancels application).
     */
    public function leave(Request $request): RedirectResponse
    {
        $user = $request->user();

        $companies = $user->companies()->get();
        foreach ($companies as $company) {
            $user->companies()->detach($company->id);
        }

        CompanyApplication::where('user_id', $user->id)
            ->where('status', 'pending')
            ->update(['status' => 'rejected']);

        return back()->with('status', 'Has abandonado tu empresa. Ya puedes unirte a otra.');
    }

    /**
     * Worker voluntarily leaves a specific company.
     */
    public function leaveCompany(Request $request, \App\Models\Company $company): RedirectResponse
    {
        $user = $request->user();
        $user->companies()->detach($company->id);

        return back()->with('status', 'Has abandonado la empresa. Ya puedes unirte a otra.');
    }
}
