<?php

namespace App\Providers;

use App\Observers\CompanyObserver;
use App\Models\Company;
use App\Models\User;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Vite;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        //
    }

    public function boot(): void
    {
        Vite::prefetch(concurrency: 3);
        Company::observe(CompanyObserver::class);

        Gate::define('admin', fn (User $user) => $user->is_admin);
    }
}
