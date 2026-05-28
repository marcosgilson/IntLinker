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

Route::get('/', fn () => redirect('/inicio'));

Route::get('/inicio', [HomeController::class, 'index'])->name('home');

// ─── Public routes ───────────────────────────────────────────────────────────
Route::get('/empresas', [CompanyController::class, 'index'])->name('companies.index');
Route::get('/empresas/{company}', [CompanyController::class, 'show'])->name('companies.show');

// ─── Authenticated routes ────────────────────────────────────────────────────
Route::middleware(['auth', 'verified'])->group(function () {

    // Profile
    Route::get('/perfil', [ProfileController::class, 'show'])->name('profile.show');
    Route::get('/perfil/editar', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/perfil', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/perfil', [ProfileController::class, 'destroy'])->name('profile.destroy');
    Route::post('perfil/foto', [ProfilePhotoController::class, 'update'])->name('profile.photo.update');
    Route::post('perfil/banner', [ProfileController::class, 'updateBanner'])->name('profile.banner.update');
    Route::delete('perfil/foto', [ProfilePhotoController::class, 'destroy'])->name('profile.photo.destroy');
    Route::patch('perfil/portafolio', [ProfileController::class, 'updatePortfolio'])->name('profile.portfolio.update');
    Route::get('/usuarios/{user}', [ProfileController::class, 'showUser'])->name('profile.user');

    // Student role
    Route::get('/alumno/estado', [StudentController::class, 'status'])->name('student.status');
    Route::post('/alumno', [StudentController::class, 'store'])->name('student.store');
    Route::post('/alumno/renovar', [StudentController::class, 'renew'])->name('student.renew');

    // Worker role
    Route::post('/trabajador', [WorkerController::class, 'store'])->name('worker.store');
    Route::delete('/trabajador/salir', [WorkerController::class, 'leave'])->name('worker.leave');
    Route::post('/alumno/escuelas', [StudentController::class, 'addSchool'])->name('student.schools.add');
    Route::delete('/alumno/escuelas/{school}', [StudentController::class, 'removeSchool'])->name('student.schools.remove');

    // Enrollments (student perspective – private)
    Route::get('/postulaciones', [EnrollmentController::class, 'index'])->name('enrollments.index');
    Route::post('/postulaciones', [EnrollmentController::class, 'store'])->name('enrollments.store');
    Route::delete('/postulaciones/{enrollment}', [EnrollmentController::class, 'destroy'])->name('enrollments.destroy');

    // Company membership

    // Worker dashboard — my company
    Route::get('/mi-empresa', [CompanyController::class, 'myCompany'])->name('companies.mine');
    Route::post('/empresas/{company}/logo', [CompanyController::class, 'updateLogo'])->name('companies.logo.update');
    Route::patch('/empresas/{company}/portafolio', [CompanyController::class, 'updatePortfolio'])->name('companies.portfolio.update');

    // Company enrollment management (employee/admin perspective)
    Route::get('/empresas/{company}/postulaciones', [CompanyEnrollmentController::class, 'index'])->name('companies.enrollments.index');
    Route::patch('/empresas/{company}/postulaciones/{enrollment}/aceptar', [CompanyEnrollmentController::class, 'accept'])->name('companies.enrollments.accept');
    Route::delete('/empresas/{company}/postulaciones/{enrollment}', [CompanyEnrollmentController::class, 'remove'])->name('companies.enrollments.remove');
    Route::get('/alumnos/{student}/perfil', [StudentProfileController::class, 'show'])->name('students.profile');

    // Request creation of a new company
    Route::post('/solicitudes-empresa', [CompanyApplicationController::class, 'store'])->name('company-applications.store');

    // ─── Admin routes ────────────────────────────────────────────────────────
    Route::middleware('admin')->prefix('admin')->name('admin.')->group(function () {
        Route::get('/', [AdminController::class, 'dashboard'])->name('dashboard');
        Route::post('/empresas', [AdminController::class, 'storeCompany'])->name('companies.store');
        Route::get('/solicitudes-empresa', [AdminController::class, 'companyApplications'])->name('company-applications.index');
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




