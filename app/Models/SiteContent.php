<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SiteContent extends Model
{
    protected $fillable = ['page', 'key', 'type', 'value', 'label'];

    public static function forPage(string $page): array
    {
        return static::where('page', $page)
            ->get()
            ->pluck('value', 'key')
            ->toArray();
    }
}