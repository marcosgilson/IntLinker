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
        $validated = $request->validate([
            'portfolio'                              => ['required', 'array'],
            'portfolio.education'                    => ['sometimes', 'array', 'max:10'],
            'portfolio.education.*.id'               => ['required', 'string', 'max:64'],
            'portfolio.education.*.institution'      => ['required', 'string', 'max:200'],
            'portfolio.education.*.degree'           => ['nullable', 'string', 'max:200'],
            'portfolio.education.*.field'            => ['nullable', 'string', 'max:200'],
            'portfolio.education.*.start_year'       => ['nullable', 'integer', 'min:1900', 'max:2100'],
            'portfolio.education.*.end_year'         => ['nullable', 'integer', 'min:1900', 'max:2100'],
            'portfolio.education.*.current'          => ['sometimes', 'boolean'],
            'portfolio.education.*.description'      => ['nullable', 'string', 'max:1000'],
            'portfolio.projects'                     => ['sometimes', 'array', 'max:8'],
            'portfolio.projects.*.id'                => ['required', 'string', 'max:64'],
            'portfolio.projects.*.title'             => ['required', 'string', 'max:200'],
            'portfolio.projects.*.description'       => ['nullable', 'string', 'max:1000'],
            'portfolio.projects.*.url'               => ['nullable', 'url', 'max:500'],
            'portfolio.projects.*.image_url'         => ['nullable', 'string', 'max:2000000'],
            'portfolio.gallery'                      => ['sometimes', 'array', 'max:12'],
            'portfolio.gallery.*.id'                 => ['required', 'string', 'max:64'],
            'portfolio.gallery.*.url'                => ['required', 'string', 'max:2000000'],
            'portfolio.gallery.*.type'               => ['nullable', 'string', 'in:image,video,link'],
            'portfolio.gallery.*.caption'            => ['nullable', 'string', 'max:500'],
        ]);

        $portfolio = $validated['portfolio'];
        // Strip HTML tags from all text fields
        if (isset($portfolio['education'])) {
            foreach ($portfolio['education'] as &$edu) {
                foreach (['institution', 'degree', 'field', 'description'] as $f) {
                    if (isset($edu[$f])) $edu[$f] = strip_tags($edu[$f]);
                }
            }
        }
        if (isset($portfolio['projects'])) {
            foreach ($portfolio['projects'] as &$proj) {
                foreach (['title', 'description'] as $f) {
                    if (isset($proj[$f])) $proj[$f] = strip_tags($proj[$f]);
                }
            }
        }
        if (isset($portfolio['gallery'])) {
            foreach ($portfolio['gallery'] as &$item) {
                if (isset($item['caption'])) $item['caption'] = strip_tags($item['caption']);
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
