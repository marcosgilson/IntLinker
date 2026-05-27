<?php

namespace App\Policies;

use App\Models\Student;
use App\Models\User;

class StudentPolicy
{
    /**
     * Only admins can verify or reject students.
     */
    public function verify(User $user, Student $student): bool
    {
        return $user->is_admin;
    }

    public function reject(User $user, Student $student): bool
    {
        return $user->is_admin;
    }
}
