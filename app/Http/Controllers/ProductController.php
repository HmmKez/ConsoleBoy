<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use App\Models\Product;

class ProductController extends Controller
{
    public function show(Product $product)
    {
        // Related products — same brand, exclude current
        $related = Product::where('brand', $product->brand)
            ->where('id', '!=', $product->id)
            ->where('is_available', true)
            ->limit(4)
            ->get();

        return Inertia::render('ProductDetail', [
            'product' => $product,
            'related' => $related,
        ]);
    }
}