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

    Route::get('iniciar-sesión', [AuthenticatedSessionController::class, 'create'])
        ->name('iniciar-sesión');

    Route::post('iniciar-sesión', [AuthenticatedSessionController::class, 'store']);

    Route::get('recuperar-contraseña', [PasswordResetLinkController::class, 'create'])
        ->name('password.request');

    Route::post('recuperar-contraseña', [PasswordResetLinkController::class, 'store'])
        ->name('password.email');

    Route::get('restablecer-contraseña/{token}', [NewPasswordController::class, 'create'])
        ->name('password.reset');

    Route::post('restablecer-contraseña', [NewPasswordController::class, 'store'])
        ->name('password.store');
});

Route::middleware('auth')->group(function () {
    Route::get('verificar-email', EmailVerificationPromptController::class)
        ->name('verification.notice');

    Route::get('verificar-email/{id}/{hash}', VerifyEmailController::class)
        ->middleware(['signed', 'throttle:6,1'])
        ->name('verification.verify');

    Route::post('email/notificación-verificación', [EmailVerificationNotificationController::class, 'store'])
        ->middleware('throttle:6,1')
        ->name('verification.send');

    Route::get('confirmar-contraseña', [ConfirmablePasswordController::class, 'show'])
        ->name('password.confirm');

    Route::post('confirmar-contraseña', [ConfirmablePasswordController::class, 'store']);

    Route::put('contraseña', [PasswordController::class, 'update'])->name('password.update');

    Route::post('cerrar-sesión', [AuthenticatedSessionController::class, 'destroy'])
        ->name('cerrar-sesión');
});
