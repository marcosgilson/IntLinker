<?php

namespace App\Models;

use App\Helpers\ImageHelper;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Facades\Storage;

class Company extends Model
{
    protected $fillable = ['name', 'city', 'description', 'logo', 'applications_email', 'portfolio'];

    protected $casts = ['portfolio' => 'array'];

    protected $hidden = ['logo'];

    protected $appends = ['logo_url'];

    public function getLogoUrlAttribute(): ?string
    {
        if (! $this->logo) return null;

        if (ImageHelper::isBase64($this->logo)) {
            return $this->logo;
        }

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

