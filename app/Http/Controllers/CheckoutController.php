<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Payment;
use App\Models\Address;
use App\Models\CartItem;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use App\Models\ActivityLog;

class CheckoutController extends Controller
{
    public function index()
    {
        $cartItems = CartItem::with('product')
            ->where('user_id', Auth::id())
            ->get();

        if ($cartItems->isEmpty()) {
            return redirect()->route('cart');
        }

        $subtotal    = $cartItems->sum(fn($i) => $i->product->price * $i->quantity);
        $shippingFee = $subtotal >= 2000 ? 0 : 150;
        $total       = $subtotal + $shippingFee;

        return Inertia::render('Checkout', [
            'cartItems'   => $cartItems->map(fn($i) => [
                'id'       => $i->id,
                'quantity' => $i->quantity,
                'product'  => [
                    'id'        => $i->product->id,
                    'name'      => $i->product->name,
                    'brand'     => $i->product->brand,
                    'price'     => $i->product->price,
                    'image_url' => $i->product->image_url,
                ],
            ]),
            'subtotal'    => $subtotal,
            'shippingFee' => $shippingFee,
            'total'       => $total,
        ]);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'first_name'     => ['required', 'string'],
            'last_name'      => ['required', 'string'],
            'email'          => ['required', 'email'],
            'phone'          => ['required', 'string'],
            'street'         => ['required', 'string'],
            'barangay'       => ['required', 'string'],
            'city'           => ['required', 'string'],
            'province'       => ['required', 'string'],
            'zip_code'       => ['required', 'string'],
            'payment_method' => ['required', 'in:Cash on Delivery,Bank Transfer'],
            'order_note'     => ['nullable', 'string'],
        ]);

        $cartItems = CartItem::with('product')
            ->where('user_id', Auth::id())
            ->get();

        if ($cartItems->isEmpty()) {
            return response()->json(['message' => 'Cart is empty.'], 422);
        }

        DB::beginTransaction();
        try {
            // Save address
            $address = Address::create([
                'user_id'  => Auth::id(),
                'street'   => $data['street'],
                'barangay' => $data['barangay'],
                'city'     => $data['city'],
                'province' => $data['province'],
                'zip_code' => $data['zip_code'],
            ]);

            $subtotal    = $cartItems->sum(fn($i) => $i->product->price * $i->quantity);
            $shippingFee = $subtotal >= 2000 ? 0 : 150;
            $total       = $subtotal + $shippingFee;

            // Create order
            $order = Order::create([
                'order_number'   => 'CB-' . date('Y') . '-' . str_pad(rand(1, 99999), 5, '0', STR_PAD_LEFT),
                'user_id'        => Auth::id(),
                'address_id'     => $address->id,
                'status'         => 'Pending',
                'payment_method' => $data['payment_method'],
                'subtotal'       => $subtotal,
                'shipping_fee'   => $shippingFee,
                'total'          => $total,
                'order_note'     => $data['order_note'] ?? null,
            ]);

            // Create order items
            foreach ($cartItems as $item) {
                OrderItem::create([
                    'order_id'     => $order->id,
                    'product_id'   => $item->product->id,
                    'product_name' => $item->product->name,
                    'unit_price'   => $item->product->price,
                    'quantity'     => $item->quantity,
                    'subtotal'     => $item->product->price * $item->quantity,
                ]);

                // Deduct stock
                $item->product->decrement('stock', $item->quantity);
            }

            // Create payment record
            Payment::create([
                'order_id' => $order->id,
                'method'   => $data['payment_method'],
                'status'   => 'Pending',
                'amount'   => $total,
            ]);

            // Clear cart
            CartItem::where('user_id', Auth::id())->delete();

            DB::commit();

            ActivityLog::log(
                'order', 'created',
                "New order placed: {$order->order_number}",
                ['total' => $total, 'payment' => $data['payment_method']],
                null,
                Auth::id()
            );

            return response()->json([
                'success'      => true,
                'order_number' => $order->order_number,
                'order_id'     => $order->id,
            ]);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['message' => 'Order failed. Please try again.'], 500);
        }
    }

    public function confirmation(Order $order)
    {
        if ($order->user_id !== Auth::id()) {
            abort(403);
        }

        $order->load(['items', 'address', 'payment']);

        return Inertia::render('OrderConfirmation', [
            'order' => [
                'id'             => $order->id,
                'order_number'   => $order->order_number,
                'status'         => $order->status,
                'payment_method' => $order->payment_method,
                'subtotal'       => $order->subtotal,
                'shipping_fee'   => $order->shipping_fee,
                'total'          => $order->total,
                'created_at'     => $order->created_at->format('M d, Y · h:i A'),
                'address'        => $order->address,
                'items'          => $order->items->map(fn($i) => [
                    'product_name' => $i->product_name,
                    'unit_price'   => $i->unit_price,
                    'quantity'     => $i->quantity,
                    'subtotal'     => $i->subtotal,
                ]),
            ],
        ]);
    }
}