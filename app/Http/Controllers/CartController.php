<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use App\Models\CartItem;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class CartController extends Controller
{
    // Show cart page
    public function index()
    {
        $items = CartItem::with('product')
            ->where('user_id', Auth::id())
            ->get()
            ->map(function ($item) {
                return [
                    'id'       => $item->id,
                    'quantity' => $item->quantity,
                    'product'  => [
                        'id'        => $item->product->id,
                        'name'      => $item->product->name,
                        'brand'     => $item->product->brand,
                        'price'     => $item->product->price,
                        'stock'     => $item->product->stock,
                        'image_url' => $item->product->image_url,
                    ],
                ];
            });

        return Inertia::render('Cart', ['cartItems' => $items]);
    }

    // Add item to cart
    public function store(Request $request)
    {
        $request->session()->token();

        $request->validate([
            'product_id' => ['required', 'exists:products,id'],
            'quantity'   => ['required', 'integer', 'min:1'],
        ]);

        $product = Product::findOrFail($request->product_id);

        if ($product->stock < $request->quantity) {
            return response()->json(['message' => 'Not enough stock.'], 422);
        }

        // Check if item already exists in cart
        $cartItem = CartItem::where('user_id', Auth::id())
            ->where('product_id', $request->product_id)
            ->first();

        if ($cartItem) {
            // Add to existing quantity
            $newQty = $cartItem->quantity + $request->quantity;

            // Cap at stock limit
            if ($newQty > $product->stock) {
                $newQty = $product->stock;
            }

            $cartItem->update(['quantity' => $newQty]);
        } else {
            // Create new cart item
            CartItem::create([
                'user_id'    => Auth::id(),
                'product_id' => $request->product_id,
                'quantity'   => $request->quantity,
            ]);
        }

        $count = CartItem::where('user_id', Auth::id())->sum('quantity');

        return response()->json(['success' => true, 'cart_count' => $count]);
    }

    // Update quantity
    public function update(Request $request, CartItem $cartItem)
    {
        if ($cartItem->user_id !== Auth::id()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $request->validate(['quantity' => ['required', 'integer', 'min:1']]);

        if ($request->quantity > $cartItem->product->stock) {
            return response()->json(['message' => 'Not enough stock.'], 422);
        }

        $cartItem->update(['quantity' => $request->quantity]);

        return response()->json(['success' => true]);
    }

    // Remove item
    public function destroy(CartItem $cartItem)
    {
        if ($cartItem->user_id !== Auth::id()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $cartItem->delete();

        return response()->json(['success' => true]);
    }

    // Get cart count for navbar
    public function count()
    {
        $count = CartItem::where('user_id', Auth::id())->sum('quantity');
        return response()->json(['count' => $count]);
    }
}