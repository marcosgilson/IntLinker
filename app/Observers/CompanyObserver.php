<?php

namespace App\Observers;

use App\Models\Company;
use App\Models\User;

class CompanyObserver
{
    public function created(Company $company): void
    {
        $admins = User::where('is_admin', true)->pluck('id');
        foreach ($admins as $adminId) {
            $company->employees()->syncWithoutDetaching([
                $adminId => ['verified' => true],
            ]);
        }
    }
}
