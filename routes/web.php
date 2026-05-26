<?php

use App\Http\Controllers\AdminController;
use App\Http\Controllers\CompanyApplicationController;
use App\Http\Controllers\CompanyController;
use App\Http\Controllers\CompanyEnrollmentController;
use App\Http\Controllers\EnrollmentController;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\ProfilePhotoController;
use App\Http\Controllers\StudentController;
use App\Http\Controllers\StudentProfileController;
use App\Http\Controllers\WorkerController;
use Illuminate\Support\Facades\Route;

Route::get('/', fn () => redirect('/IntLinker'));

Route::get('/IntLinker', [HomeController::class, 'index'])->name('home');

// ─── Public routes ───────────────────────────────────────────────────────────
Route::get('/companies', [CompanyController::class, 'index'])->name('companies.index');
Route::get('/companies/{company}', [CompanyController::class, 'show'])->name('companies.show');

// ─── Authenticated routes ────────────────────────────────────────────────────
Route::middleware(['auth', 'verified'])->group(function () {

    // Profile
    Route::get('/profile', [ProfileController::class, 'show'])->name('profile.show');
    Route::get('/profile/edit', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
    Route::post('profile/photo', [ProfilePhotoController::class, 'update'])->name('profile.photo.update');
    Route::post('profile/banner', [ProfileController::class, 'updateBanner'])->name('profile.banner.update');
    Route::delete('profile/photo', [ProfilePhotoController::class, 'destroy'])->name('profile.photo.destroy');
    Route::patch('profile/portfolio', [ProfileController::class, 'updatePortfolio'])->name('profile.portfolio.update');

    // Student role
    Route::get('/student/status', [StudentController::class, 'status'])->name('student.status');
    Route::post('/student', [StudentController::class, 'store'])->name('student.store');
    Route::post('/student/renew', [StudentController::class, 'renew'])->name('student.renew');

    // Worker role
    Route::post('/worker', [WorkerController::class, 'store'])->name('worker.store');
    Route::delete('/worker/leave', [WorkerController::class, 'leave'])->name('worker.leave');
    Route::post('/student/schools', [StudentController::class, 'addSchool'])->name('student.schools.add');
    Route::delete('/student/schools/{school}', [StudentController::class, 'removeSchool'])->name('student.schools.remove');

    // Enrollments (student perspective – private)
    Route::get('/enrollments', [EnrollmentController::class, 'index'])->name('enrollments.index');
    Route::post('/enrollments', [EnrollmentController::class, 'store'])->name('enrollments.store');
    Route::delete('/enrollments/{enrollment}', [EnrollmentController::class, 'destroy'])->name('enrollments.destroy');

    // Company membership

    // Worker dashboard — my company
    Route::get('/my-company', [CompanyController::class, 'myCompany'])->name('companies.mine');
    Route::post('/companies/{company}/logo', [CompanyController::class, 'updateLogo'])->name('companies.logo.update');
    Route::patch('/companies/{company}/portfolio', [CompanyController::class, 'updatePortfolio'])->name('companies.portfolio.update');

    // Company enrollment management (employee/admin perspective)
    Route::get('/companies/{company}/enrollments', [CompanyEnrollmentController::class, 'index'])->name('companies.enrollments.index');
    Route::patch('/companies/{company}/enrollments/{enrollment}/accept', [CompanyEnrollmentController::class, 'accept'])->name('companies.enrollments.accept');
    Route::delete('/companies/{company}/enrollments/{enrollment}', [CompanyEnrollmentController::class, 'remove'])->name('companies.enrollments.remove');
    Route::get('/students/{student}/profile', [StudentProfileController::class, 'show'])->name('students.profile');

    // Request creation of a new company
    Route::post('/company-applications', [CompanyApplicationController::class, 'store'])->name('company-applications.store');

    // ─── Admin routes ────────────────────────────────────────────────────────
    Route::middleware('admin')->prefix('admin')->name('admin.')->group(function () {
        Route::get('/', [AdminController::class, 'dashboard'])->name('dashboard');
        Route::post('/companies', [AdminController::class, 'storeCompany'])->name('companies.store');
        Route::get('/company-applications', [AdminController::class, 'companyApplications'])->name('company-applications.index');
        Route::patch('/company-applications/{application}/approve', [AdminController::class, 'approveApplication'])->name('company-applications.approve');
        Route::patch('/company-applications/{application}/reject', [AdminController::class, 'rejectApplication'])->name('company-applications.reject');
        // DocuPipe test (temporary)
        Route::get('/test-docupipe', function () {
            return inertia('Admin/TestDocuPipe');
        })->name('admin.test-docupipe');
        Route::post('/test-docupipe', function (\Illuminate\Http\Request $request, \App\Services\DocuPipeService $docuPipe) {
            $request->validate(['image' => ['required', 'image', 'max:10240']]);
            try {
                $file   = $request->file('image');
                $result = $docuPipe->extractStudentCard($file);
                return back()->with('docupipe_result', json_encode($result, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
            } catch (\Throwable $e) {
                return back()->withErrors(['image' => 'DocuPipe error: ' . $e->getMessage()]);
            }
        })->name('admin.test-docupipe.post');
        // Student verification
        Route::patch('/students/{student}/verify', [AdminController::class, 'verifyStudent'])->name('students.verify');
        Route::delete('/students/{student}/reject', [AdminController::class, 'rejectStudent'])->name('students.reject');
        // Worker verification
        Route::patch('/workers/verify', [AdminController::class, 'verifyWorker'])->name('workers.verify');
        Route::delete('/workers/reject', [AdminController::class, 'rejectWorker'])->name('workers.reject');
    });
});

require __DIR__ . '/auth.php';




