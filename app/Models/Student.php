<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Student extends Model
{
    protected $fillable = [
        'user_id',
        'school_name',
        'school_email',
        'expires_at',
        'student_card_image',
        'verified',
        'id_alumno',
    ];

    protected function casts(): array
    {
        return [
            'expires_at' => 'datetime',
            'verified' => 'boolean',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function schools(): BelongsToMany
    {
        return $this->belongsToMany(School::class, 'student_schools')
            ->withPivot(['student_card_image', 'verified'])
            ->withTimestamps();
    }

    public function enrollments(): HasMany
    {
        return $this->hasMany(Enrollment::class);
    }

    public function activeEnrollments(): HasMany
    {
        return $this->hasMany(Enrollment::class)->whereIn('status', ['waiting', 'accepted']);
    }

    public function isActive(): bool
    {
        return $this->verified && ($this->expires_at === null || $this->expires_at->isFuture());
    }

    public function isPending(): bool
    {
        return !$this->verified;
    }

    public function hasActiveEnrollmentSlots(): bool
    {
        return $this->activeEnrollments()->count() < 5;
    }

    public function hasEnrolledIn(int $companyId): bool
    {
        return $this->enrollments()->where('company_id', $companyId)->exists();
    }
}