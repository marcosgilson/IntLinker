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
        $user = $request->user();

        return [
            ...parent::share($request),
            'flash' => [
                'status'          => session('status'),
                'docupipe_result' => session('docupipe_result'),
            ],
            'auth' => [
                'user'  => $user ? array_merge($user->toArray(), ['photo_url' => $user->photo_url]) : null,
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
