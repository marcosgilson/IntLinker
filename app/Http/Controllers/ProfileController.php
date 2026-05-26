<?php

namespace App\Http\Controllers;

use App\Http\Requests\ProfileUpdateRequest;
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
        $user = $request->user();

        return Inertia::render('Profile/Show', [
            'banner_color'      => $user->banner_color ?? '#9ca3af',
            'profile_photo_url' => $user->photo_url,
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
        $request->validate(['portfolio' => ['required', 'array']]);
        $request->user()->update(['portfolio' => $request->portfolio]);
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
