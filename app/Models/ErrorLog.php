<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ErrorLog extends Model
{
    protected $fillable = [
        'type',
        'message',
        'file',
        'line',
        'trace',
        'url',
        'method',
        'ip',
        'user_id',
        'status_code',
        'resolved',
    ];

    protected $casts = [
        'resolved' => 'boolean',
        'line'     => 'integer',
        'status_code' => 'integer',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function scopeUnresolved($query)
    {
        return $query->where('resolved', false);
    }

    public function scopeRecent($query)
    {
        return $query->latest()->limit(100);
    }
}
