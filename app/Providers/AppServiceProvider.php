<?php
namespace App\Providers;

use App\Observers\CompanyObserver;
use App\Models\Company;
use App\Models\User;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Vite;
use Illuminate\Support\ServiceProvider;
use Symfony\Component\Mailer\Bridge\Brevo\Transport\BrevoApiTransport;

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

        Mail::extend('brevo', function () {
            return new BrevoApiTransport(config('services.brevo.key'));
        });

        // Redirigir todos los correos a una direccion fija si MAIL_TO_OVERRIDE esta definido
        if ($override = env('MAIL_TO_OVERRIDE')) {
            Mail::alwaysTo($override);
        }
    }
}