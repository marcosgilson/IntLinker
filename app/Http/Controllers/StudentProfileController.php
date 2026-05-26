<?php

namespace App\Http\Controllers;

use App\Models\Student;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Support\Facades\Storage;

class StudentProfileController extends Controller
{
    /**
     * Show a student profile to a verified worker whose company
     * has a pending or accepted enrollment from that student.
     */
    public function show(Request $request, Student $student): Response
    {
        $user = $request->user();

        // Admin always has access
        if (!$user->is_admin) {
            // Worker must belong to at least one company that has this student's enrollment
            $workerCompanyIds = $user->companies()
                ->wherePivot('verified', true)
                ->pluck('companies.id');

            $hasEnrollment = $student->enrollments()
                ->whereIn('company_id', $workerCompanyIds)
                ->whereIn('status', ['waiting', 'accepted'])
                ->exists();

            if (!$hasEnrollment) {
                abort(403, 'No tienes permiso para ver este perfil.');
            }
        }

        $student->load('user:id,name,email,portfolio,profile_photo');

        // Enrollments only for this worker's companies
        $workerCompanyIds = $user->is_admin
            ? null
            : $user->companies()->wherePivot('verified', true)->pluck('companies.id');

        $enrollmentsQuery = $student->enrollments()->with('company:id,name,city,logo');
        if ($workerCompanyIds !== null) {
            $enrollmentsQuery->whereIn('company_id', $workerCompanyIds)
                             ->whereIn('status', ['waiting', 'accepted']);
        }
        $enrollments = $enrollmentsQuery->get();

        return Inertia::render('Students/Profile', [
            'student'     => [
                'id'          => $student->id,
                'name'        => $student->user->name,
                'email'       => $student->user->email,
                'school_name' => $student->school_name,
                'school_email'=> $student->school_email,
                'verified'    => $student->verified,
                'expires_at'   => $student->expires_at,
                'photo_url'    => $student->user->profile_photo
                                    ? Storage::disk('public')->url($student->user->profile_photo)
                                    : null,
            ],
            'portfolio'   => $student->user->portfolio,
            'enrollments' => $enrollments,
        ]);
    }
}
