<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Storage;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Company extends Model
{
    protected $fillable = [
        'name',
        'city',
        'description',
        'logo',
        'applications_email',
    ];

    protected $appends = ['logo_url'];

    public function getLogoUrlAttribute(): ?string
    {
        if (!$this->logo) return null;
        return Storage::disk('public')->url($this->logo);
    }

    public function employees(): BelongsToMany
    {
        return $this->belongsToMany(User::class, 'company_employees')
            ->withPivot(['position', 'work_card_image', 'id_trabajador', 'verified'])
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

    public function hasEmployee(int $userId): bool
    {
        return $this->employees()->where('user_id', $userId)->exists();
    }
}
