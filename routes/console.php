<?php

use App\Console\Commands\CheckDocuPipeStatus;
use Illuminate\Support\Facades\Schedule;

Schedule::command(CheckDocuPipeStatus::class)->everyMinute();