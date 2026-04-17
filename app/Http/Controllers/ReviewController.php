<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\Product;
use App\Models\ProductReview;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ReviewController extends Controller
{
    public function store(Request $request, Product $product)
    {
        $validated = $request->validate([
            'rating' => ['required', 'integer', 'min:1', 'max:5'],
            'comment' => ['required', 'string', 'min:5', 'max:1200'],
        ]);

        $hasPurchased = Order::where('user_id', Auth::id())
            ->whereHas('items', fn($query) => $query->where('product_id', $product->id))
            ->exists();

        abort_unless($hasPurchased, 403, 'Only customers who purchased this product can leave reviews.');

        $review = ProductReview::create([
            'product_id' => $product->id,
            'user_id' => Auth::id(),
            'rating' => $validated['rating'],
            'comment' => $validated['comment'],
        ])->load('user');

        return response()->json([
            'success' => true,
            'review' => [
                'id' => $review->id,
                'rating' => $review->rating,
                'comment' => $review->comment,
                'created_at' => $review->created_at->format('M d, Y'),
                'user' => [
                    'name' => trim($review->user->first_name . ' ' . $review->user->last_name),
                ],
            ],
        ], 201);
    }
}
