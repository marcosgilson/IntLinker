<?php

namespace App\Http\Controllers;

use App\Models\Company;
use App\Models\Student;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class HomeController extends Controller
{
    public function index(): Response
    {
        $companies = Company::withCount([
            'activeEnrollments as open_spots',
            'employees',
        ])
        ->latest()
        ->take(6)
        ->get(['id', 'name', 'description', 'logo']);

        $stats = [
            'students'  => Student::where('expires_at', '>', now())->count(),
            'companies' => Company::count(),
        ];

        return Inertia::render('Home', [
            'companies' => $companies,
            'stats'     => $stats,
        ]);
    }
}
