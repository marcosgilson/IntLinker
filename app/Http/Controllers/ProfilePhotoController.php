<?php

namespace App\Http\Controllers;

use App\Helpers\ImageHelper;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class ProfilePhotoController extends Controller
{
    public function update(Request $request): RedirectResponse
    {
        $request->validate([
            'photo' => ['required', 'image', 'mimes:jpg,jpeg,png,webp', 'max:4096'],
        ]);

        $user   = $request->user();
        $base64 = ImageHelper::compressToBase64($request->file('photo'));

        $user->update(['profile_photo' => $base64]);

        // Refresh session cache so the new photo shows immediately
        session(['photo_url_' . $user->id => $base64, 'photo_tag_' . $user->id => $user->fresh()->updated_at?->timestamp]);

        return back()->with('status', 'Foto de perfil actualizada.');
    }

    public function destroy(Request $request): RedirectResponse
    {
        $user = $request->user();

        $user->update(['profile_photo' => null]);

        session()->forget(['photo_url_' . $user->id, 'photo_tag_' . $user->id]);

        return back()->with('status', 'Foto de perfil eliminada.');
    }
}
