<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\Product;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class ProductController extends Controller
{
    public function show(Product $product)
    {
        $product->load([
            'reviews' => fn($query) => $query->with('user')->latest(),
        ]);

        $related = Product::where('brand', $product->brand)
            ->where('id', '!=', $product->id)
            ->where('is_available', true)
            ->limit(4)
            ->get();

        $reviewCount = $product->reviews->count();
        $reviewAverage = $reviewCount > 0
            ? round((float) $product->reviews->avg('rating'), 1)
            : 0;

        $canReview = Auth::check() && Order::where('user_id', Auth::id())
            ->whereHas('items', fn($query) => $query->where('product_id', $product->id))
            ->exists();

        return Inertia::render('ProductDetail', [
            'product' => $product,
            'related' => $related,
            'reviews' => $product->reviews->map(fn($review) => [
                'id' => $review->id,
                'rating' => $review->rating,
                'comment' => $review->comment,
                'created_at' => $review->created_at->format('M d, Y'),
                'user' => [
                    'name' => trim($review->user->first_name . ' ' . $review->user->last_name),
                ],
            ]),
            'reviewStats' => [
                'count' => $reviewCount,
                'average' => $reviewAverage,
            ],
            'canReview' => $canReview,
        ]);
    }
}
