<?php

use App\Http\Controllers\Auth\AuthenticatedSessionController;
use App\Http\Controllers\Auth\ConfirmablePasswordController;
use App\Http\Controllers\Auth\EmailVerificationNotificationController;
use App\Http\Controllers\Auth\EmailVerificationPromptController;
use App\Http\Controllers\Auth\NewPasswordController;
use App\Http\Controllers\Auth\PasswordController;
use App\Http\Controllers\Auth\PasswordResetLinkController;
use App\Http\Controllers\Auth\RegisteredUserController;
use App\Http\Controllers\Auth\VerifyEmailController;
use Illuminate\Support\Facades\Route;

Route::middleware('guest')->group(function () {
    Route::get('registro', [RegisteredUserController::class, 'create'])
        ->name('registro');

    Route::post('registro', [RegisteredUserController::class, 'store']);

    Route::get('iniciar-sesion', [AuthenticatedSessionController::class, 'create'])
        ->name('iniciar-sesion');

    Route::post('iniciar-sesion', [AuthenticatedSessionController::class, 'store']);

    Route::get('recuperar-contrasena', [PasswordResetLinkController::class, 'create'])
        ->name('password.request');

    Route::post('recuperar-contrasena', [PasswordResetLinkController::class, 'store'])
        ->name('password.email');

    Route::get('restablecer-contrasena/{token}', [NewPasswordController::class, 'create'])
        ->name('password.reset');

    Route::post('restablecer-contrasena', [NewPasswordController::class, 'store'])
        ->name('password.store');
});

Route::middleware('auth')->group(function () {
    Route::get('verificar-email', EmailVerificationPromptController::class)
        ->name('verification.notice');

    Route::get('verificar-email/{id}/{hash}', VerifyEmailController::class)
        ->middleware(['signed', 'throttle:6,1'])
        ->name('verification.verify');

    Route::post('email/notificacion-verificacion', [EmailVerificationNotificationController::class, 'store'])
        ->middleware('throttle:6,1')
        ->name('verification.send');

    Route::get('confirmar-contrasena', [ConfirmablePasswordController::class, 'show'])
        ->name('password.confirm');

    Route::post('confirmar-contrasena', [ConfirmablePasswordController::class, 'store']);

    Route::put('contrasena', [PasswordController::class, 'update'])->name('password.update');

    Route::post('cerrar-sesion', [AuthenticatedSessionController::class, 'destroy'])
        ->name('cerrar-sesion');
});
