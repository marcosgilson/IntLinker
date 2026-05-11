<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class School extends Model
{
    protected $fillable = [
        'name',
        'country',
    ];

    public function students(): BelongsToMany
    {
        return $this->belongsToMany(Student::class, 'student_schools')
            ->withPivot(['student_card_image', 'verified'])
            ->withTimestamps();
    }
}
