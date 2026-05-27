<?php

namespace App\Policies;

use App\Models\Company;
use App\Models\User;

class CompanyPolicy
{
    /**
     * Admins bypass all policy checks automatically.
     */
    public function before(User $user): ?bool
    {
        if ($user->is_admin) {
            return true;
        }

        return null;
    }

    /**
     * Who can update company assets (logo, portfolio, email).
     * Only verified employees of the company.
     */
    public function update(User $user, Company $company): bool
    {
        return $company->hasEmployee($user->id);
    }

    /**
     * Who can view and manage enrollments of a company.
     * Only verified employees of the company.
     */
    public function manageEnrollments(User $user, Company $company): bool
    {
        return $company->hasEmployee($user->id);
    }
}
