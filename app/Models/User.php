<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Database\Factories\UserFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    /** @use HasFactory<UserFactory> */
    use HasFactory, Notifiable;

    protected $fillable = [
        'name',
        'email',
        'password',
        'is_admin',
        'profile_photo',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'is_admin' => 'boolean',
        ];
    }

    // --- Relationships ---

    public function student(): HasOne
    {
        return $this->hasOne(Student::class);
    }

    public function companies(): BelongsToMany
    {
        return $this->belongsToMany(Company::class, 'company_employees')
            ->withPivot(['position', 'work_card_image', 'id_trabajador', 'verified'])
            ->withTimestamps();
    }

    public function companyApplications(): HasMany
    {
        return $this->hasMany(CompanyApplication::class);
    }

    // --- Helper methods ---

    public function isStudent(): bool
    {
        return $this->student !== null && $this->student->isActive();
    }

    public function isWorker(): bool
    {
        return $this->companies()->wherePivot('verified', true)->exists();
    }

    public function isPendingWorker(): bool
    {
        return !$this->isWorker() && (
            $this->companies()->wherePivot('verified', false)->exists() ||
            $this->companyApplications()->where('status', 'pending')->exists()
        );
    }

    public function isPendingStudent(): bool
    {
        return $this->student !== null && $this->student->isPending();
    }

    public function isEmployeeOf(int $companyId): bool
    {
        return $this->companies()->where('company_id', $companyId)->exists();
    }
}