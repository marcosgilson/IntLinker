<?php

namespace App\Policies;

use App\Models\Enrollment;
use App\Models\User;

class EnrollmentPolicy
{
    /**
     * Who can cancel (delete) an enrollment.
     * Only the student who owns it.
     */
    public function delete(User $user, Enrollment $enrollment): bool
    {
        return $user->student !== null
            && $enrollment->student_id === $user->student->id;
    }
}
