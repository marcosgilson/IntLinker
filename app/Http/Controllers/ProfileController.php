<?php

namespace App\Http\Controllers;

use App\Http\Requests\ProfileUpdateRequest;
use App\Models\User;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Redirect;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class ProfileController extends Controller
{
    public function show(Request $request): Response
    {
        $user    = $request->user();
        $student = $user->student;

        return Inertia::render('Profile/Show', [
            'profileUser'       => ['id' => $user->id, 'name' => $user->name, 'email' => $user->email],
            'profileRoles'      => [
                'is_admin'           => $user->is_admin,
                'is_student'         => $student && $student->verified,
                'is_pending_student' => $student && !$student->verified,
                'is_worker'          => $user->isWorker(),
                'is_pending_worker'  => $user->isPendingWorker(),
            ],
            'banner_color'      => $user->banner_color ?? '#9ca3af',
            'profile_photo_url' => $user->photo_url,
            'portfolio'         => $user->portfolio,
            'is_student'        => $student && $student->verified,
            'is_owner'          => true,
        ]);
    }

    public function showUser(User $user): Response
    {
        $student          = $user->student;
        $isVerifiedWorker = $user->companies()->wherePivot('verified', true)->exists();

        return Inertia::render('Profile/Show', [
            'profileUser'       => ['id' => $user->id, 'name' => $user->name, 'email' => $user->email],
            'profileRoles'      => [
                'is_admin'           => $user->is_admin,
                'is_student'         => $student && $student->verified,
                'is_pending_student' => false,
                'is_worker'          => $isVerifiedWorker,
                'is_pending_worker'  => false,
            ],
            'banner_color'      => $user->banner_color ?? '#9ca3af',
            'profile_photo_url' => $user->photo_url,
            'portfolio'         => $user->portfolio,
            'is_student'        => $student && $student->verified,
            'is_owner'          => false,
        ]);
    }

    public function edit(Request $request): Response
    {
        $user = $request->user();

        return Inertia::render('Profile/Edit', [
            'status'            => session('status'),
            'student'           => $user->student,
            'companies'         => $user->companies()->select('companies.id', 'companies.name', 'companies.logo')->get(),
            'banner_color'      => $user->banner_color ?? '#9ca3af',
            'profile_photo_url' => $user->photo_url,
        ]);
    }

    public function update(ProfileUpdateRequest $request): RedirectResponse
    {
        $request->user()->fill($request->validated());
        $request->user()->save();

        return Redirect::route('profile.show');
    }

    public function updateBanner(Request $request): RedirectResponse
    {
        $request->validate(['banner_color' => ['required', 'string', 'regex:/^#[0-9a-fA-F]{6}$/']]);
        $request->user()->update(['banner_color' => $request->banner_color]);
        return back();
    }

    public function updatePortfolio(Request $request): RedirectResponse
    {
        $request->validate([
            'portfolio'                         => ['required', 'array'],
            'portfolio.bio'                     => ['nullable', 'string', 'max:1000'],
            'portfolio.links'                   => ['sometimes', 'array'],
            'portfolio.links.github'            => ['nullable', 'string', 'max:500'],
            'portfolio.links.linkedin'          => ['nullable', 'string', 'max:500'],
            'portfolio.links.website'           => ['nullable', 'string', 'max:500'],
            'portfolio.links.twitter'           => ['nullable', 'string', 'max:500'],
            'portfolio.education'               => ['sometimes', 'array', 'max:10'],
            'portfolio.education.*.id'          => ['required', 'string', 'max:64'],
            'portfolio.education.*.institution' => ['required', 'string', 'max:200'],
            'portfolio.education.*.degree'      => ['nullable', 'string', 'max:200'],
            'portfolio.education.*.field'       => ['nullable', 'string', 'max:200'],
            'portfolio.education.*.start_year'  => ['nullable', 'integer', 'min:1900', 'max:2100'],
            'portfolio.education.*.end_year'    => ['nullable', 'integer', 'min:1900', 'max:2100'],
            'portfolio.education.*.current'     => ['sometimes', 'boolean'],
            'portfolio.education.*.description' => ['nullable', 'string', 'max:1000'],
            'portfolio.projects'                => ['sometimes', 'array', 'max:8'],
            'portfolio.projects.*.id'           => ['required', 'string', 'max:64'],
            'portfolio.projects.*.title'        => ['required', 'string', 'max:200'],
            'portfolio.projects.*.description'  => ['nullable', 'string', 'max:1000'],
            'portfolio.projects.*.url'          => ['nullable', 'string', 'max:500'],
            'portfolio.projects.*.image_url'    => ['nullable', 'string', 'max:2000000'],
            'portfolio.gallery'                 => ['sometimes', 'array', 'max:12'],
            'portfolio.gallery.*'               => ['nullable', 'string', 'max:2000000'],
        ]);

        $raw = $request->input('portfolio', []);

        // Build portfolio from only the known fields to prevent mass injection
        $portfolio = [
            'bio'       => isset($raw['bio'])   ? strip_tags($raw['bio'])   : null,
            'links'     => [
                'github'   => $raw['links']['github']   ?? null,
                'linkedin' => $raw['links']['linkedin']  ?? null,
                'website'  => $raw['links']['website']   ?? null,
                'twitter'  => $raw['links']['twitter']   ?? null,
            ],
            'education' => [],
            'projects'  => [],
            'gallery'   => [],
        ];

        foreach ($raw['education'] ?? [] as $edu) {
            $portfolio['education'][] = [
                'id'          => $edu['id'] ?? null,
                'institution' => strip_tags($edu['institution'] ?? ''),
                'degree'      => strip_tags($edu['degree'] ?? ''),
                'field'       => strip_tags($edu['field'] ?? ''),
                'start_year'  => $edu['start_year'] ?? null,
                'end_year'    => $edu['end_year'] ?? null,
                'current'     => (bool) ($edu['current'] ?? false),
                'description' => strip_tags($edu['description'] ?? ''),
            ];
        }

        foreach ($raw['projects'] ?? [] as $proj) {
            $portfolio['projects'][] = [
                'id'          => $proj['id'] ?? null,
                'title'       => strip_tags($proj['title'] ?? ''),
                'description' => strip_tags($proj['description'] ?? ''),
                'url'         => $proj['url'] ?? null,
                'image_url'   => $proj['image_url'] ?? null,
            ];
        }

        foreach ($raw['gallery'] ?? [] as $img) {
            if (is_string($img) && strlen($img) <= 2000000) {
                $portfolio['gallery'][] = $img;
            }
        }

        $request->user()->update(['portfolio' => $portfolio]);
        return back();
    }

    public function destroy(Request $request): RedirectResponse
    {
        $request->validate(['password' => ['required', 'current_password']]);

        $user = $request->user();

        Auth::logout();
        $user->delete();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return Redirect::to('/');
    }
}
