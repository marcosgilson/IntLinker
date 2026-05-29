<?php

use App\Console\Commands\CheckDocuPipeStatus;
use App\Models\User;
use Illuminate\Support\Facades\Schedule;

Schedule::command(CheckDocuPipeStatus::class)->everyMinute();

// Eliminar usuarios no verificados con más de 48h
Schedule::call(function () {
    User::whereNull('email_verified_at')
        ->where('created_at', '<', now()->subHours(48))
        ->delete();
})->hourly();