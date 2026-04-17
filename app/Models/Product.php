<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    protected $fillable = [
        'sku', 'name', 'brand', 'category',
        'description', 'price', 'stock',
        'image_url', 'is_available', 'perks', 'colors',
    ];

    protected $casts = [
        'price'        => 'decimal:2',
        'is_available' => 'boolean',
        'perks'        => 'array',
        'colors'       => 'array',
    ];

    public function reviews()
    {
        return $this->hasMany(ProductReview::class);
    }
}
