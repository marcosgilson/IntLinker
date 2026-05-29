<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreCompanyApplicationRequest;
use App\Models\CompanyApplication;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class CompanyApplicationController extends Controller
{
    /**
     * Request the creation of a new company.
     * The request goes to the admin for manual review.
     */
    public function store(StoreCompanyApplicationRequest $request): RedirectResponse
    {
        $user = $request->user();

        // Prevent duplicate pending requests for the same company name
        $alreadyPending = CompanyApplication::where('user_id', $user->id)
            ->where('company_name', $request->validated('company_name'))
            ->where('status', 'pending')
            ->exists();

        if ($alreadyPending) {
            return back()->withErrors(['company_name' => 'Ya tienes una solicitud pendiente para esta empresa.']);
        }

        CompanyApplication::create([
            'user_id'      => $user->id,
            'company_name' => $request->validated('company_name'),
            'description'  => $request->validated('description'),
            'status'       => 'pending',
        ]);

        return back()->with('status', 'Solicitud enviada. Recibiras una respuesta en breve.');
    }
}
