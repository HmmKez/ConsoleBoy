<?php

namespace App\Http\Controllers;

use App\Models\Order;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class OrderController extends Controller
{
    public function index()
    {
        $orders = Order::with(['items', 'address'])
            ->where('user_id', Auth::id())
            ->latest()
            ->paginate(10);

        return Inertia::render('MyOrders', [
            'orders' => $orders->through(fn($o) => [
                'id' => $o->id,
                'order_number' => $o->order_number,
                'status' => $o->status,
                'total' => $o->total,
                'items_count' => $o->items->count(),
                'created_at' => $o->created_at->format('M d, Y'),
                'payment_method' => $o->payment_method,
                'payment_channel' => $o->payment_channel,
                'tracking_courier' => $o->tracking_courier,
                'tracking_number' => $o->tracking_number,
            ]),
        ]);
    }

    public function show(Order $order)
    {
        if ($order->user_id !== Auth::id()) {
            abort(403);
        }

        $order->load(['items.product', 'address', 'payment']);

        return Inertia::render('OrderConfirmation', [
            'order' => [
                'id' => $order->id,
                'order_number' => $order->order_number,
                'status' => $order->status,
                'payment_method' => $order->payment_method,
                'payment_channel' => $order->payment_channel,
                'tracking_courier' => $order->tracking_courier,
                'tracking_number' => $order->tracking_number,
                'subtotal' => $order->subtotal,
                'shipping_fee' => $order->shipping_fee,
                'total' => $order->total,
                'created_at' => $order->created_at->format('F d, Y'),
                'address' => $order->address,
                'items' => $order->items->map(fn($i) => [
                    'product_name' => $i->product_name,
                    'unit_price' => $i->unit_price,
                    'quantity' => $i->quantity,
                    'subtotal' => $i->subtotal,
                    'image_url' => $i->product?->image_url,
                ]),
            ],
        ]);
    }
}
