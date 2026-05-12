<?php

namespace App\Http\Controllers;

use App\Http\Requests\BecomeWorkerRequest;
use App\Models\Company;
use App\Models\CompanyApplication;
use App\Services\OcrService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Storage;

class WorkerController extends Controller
{
    public function store(BecomeWorkerRequest $request): RedirectResponse
    {
        $user        = $request->user();
        $companyName = $request->validated('company_name');
        $position    = $request->validated('position');

        $user->update(['name' => $request->validated('name')]);

        $imagePath    = $request->file('work_card_image')->store('work_cards', 'public');
        $idTrabajador = (new OcrService())->extractText($request->file('work_card_image'));

        $company = Company::where('name', $companyName)->first();

        if ($company) {
            if ($user->isEmployeeOf($company->id)) {
                return back()->withErrors(['company_name' => 'Ya eres empleado de esta empresa.']);
            }

            $user->companies()->attach($company->id, [
                'position'        => $position,
                'work_card_image' => $imagePath,
                'id_trabajador'   => $idTrabajador,
                'verified'        => false,
            ]);

            return back()->with('status', 'Te has unido a la empresa. Pendiente de verificacion por el administrador.');
        }

        $alreadyPending = CompanyApplication::where('user_id', $user->id)
            ->where('company_name', $companyName)
            ->where('status', 'pending')
            ->exists();

        if ($alreadyPending) {
            return back()->withErrors(['company_name' => 'Ya tienes una solicitud pendiente para esta empresa.']);
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
}