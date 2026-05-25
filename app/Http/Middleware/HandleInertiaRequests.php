<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    protected $rootView = 'app';

    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    public function share(Request $request): array
    {
        $user     = $request->user();
        $photoUrl = null;

        if ($user) {
            $urlKey = 'photo_url_' . $user->id;
            $tagKey = 'photo_tag_' . $user->id;
            $tag    = $user->updated_at?->timestamp;

            // Invalidate cache when the user record changes (e.g. new photo uploaded)
            if (! session()->has($urlKey) || session($tagKey) !== $tag) {
                session([$urlKey => $user->photo_url, $tagKey => $tag]);
            }

            $photoUrl = session($urlKey);
        }

        return [
            ...parent::share($request),
            'flash' => [
                'status'           => session('status'),
                'docupipe_result'  => session('docupipe_result'),
            ],
            'auth' => [
                'user'  => $user ? array_merge($user->toArray(), ['photo_url' => $photoUrl]) : null,
                'roles' => $user ? [
                    'is_admin'           => (bool) $user->is_admin,
                    'is_student'         => $user->isStudent(),
                    'is_worker'          => $user->isWorker(),
                    'is_pending_student' => $user->isPendingStudent(),
                    'is_pending_worker'  => $user->isPendingWorker(),
                ] : null,
            ],
        ];
    }
}
