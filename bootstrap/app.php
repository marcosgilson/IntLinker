<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware): void {
        $middleware->trustProxies(at: '*');

        $middleware->web(append: [
            \App\Http\Middleware\HandleInertiaRequests::class,
            \Illuminate\Http\Middleware\AddLinkHeadersForPreloadedAssets::class,
        ]);

        $middleware->redirectGuestsTo(fn () => route('iniciar-sesion'));

        $middleware->alias([
            'admin' => \App\Http\Middleware\AdminMiddleware::class,
        ]);
    })
    ->withExceptions(function (Exceptions $exceptions): void {
        $exceptions->report(function (\Throwable $e): void {
            if (app()->runningUnitTests()) {
                return;
            }

            try {
                $statusCode = method_exists($e, 'getStatusCode') ? $e->getStatusCode() : 500;

                // Don't log 404s or authentication redirects as errors
                if (in_array($statusCode, [404, 401, 403])) {
                    return;
                }

                \App\Models\ErrorLog::create([
                    'type'        => get_class($e),
                    'message'     => mb_substr($e->getMessage(), 0, 1000),
                    'file'        => mb_substr($e->getFile(), 0, 500),
                    'line'        => $e->getLine(),
                    'trace'       => mb_substr($e->getTraceAsString(), 0, 5000),
                    'url'         => mb_substr(request()->fullUrl(), 0, 1000),
                    'method'      => request()->method(),
                    'ip'          => request()->ip(),
                    'user_id'     => auth()->id(),
                    'status_code' => $statusCode,
                ]);
            } catch (\Throwable) {
                // Never crash the app trying to log an error
            }
        });
    })->create();
