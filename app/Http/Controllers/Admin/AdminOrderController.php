<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\ActivityLog;
use App\Models\Order;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class AdminOrderController extends Controller
{
    public function index(Request $request)
    {
        $query = Order::with('user');

        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        if ($request->filled('search')) {
            $query->where(function ($builder) use ($request) {
                $builder->where('order_number', 'like', '%' . $request->search . '%')
                    ->orWhereHas('user', fn($q) => $q
                        ->where('first_name', 'like', '%' . $request->search . '%')
                        ->orWhere('last_name', 'like', '%' . $request->search . '%'));
            });
        }

        $orders = $query->latest()->paginate(10)->withQueryString();

        return Inertia::render('Admin/Orders', [
            'orders' => $orders->through(fn($o) => [
                'id' => $o->id,
                'order_number' => $o->order_number,
                'customer' => $o->user->first_name . ' ' . $o->user->last_name,
                'email' => $o->user->email,
                'total' => $o->total,
                'status' => $o->status,
                'payment_method' => $o->payment_method,
                'payment_channel' => $o->payment_channel,
                'tracking_courier' => $o->tracking_courier,
                'tracking_number' => $o->tracking_number,
                'created_at' => $o->created_at->format('M d, Y'),
            ]),
            'filters' => $request->only(['status', 'search']),
        ]);
    }

    public function show(Order $order)
    {
        $order->load(['user', 'items', 'address', 'payment']);

        return response()->json([
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
            'order_note' => $order->order_note,
            'created_at' => $order->created_at->format('M d, Y h:i A'),
            'customer' => [
                'name' => $order->user->first_name . ' ' . $order->user->last_name,
                'email' => $order->user->email,
                'phone' => $order->user->phone,
            ],
            'address' => $order->address,
            'items' => $order->items->map(fn($i) => [
                'product_name' => $i->product_name,
                'unit_price' => $i->unit_price,
                'quantity' => $i->quantity,
                'subtotal' => $i->subtotal,
            ]),
        ]);
    }

    public function updateStatus(Request $request, Order $order)
    {
        $validated = $request->validate([
            'status' => ['required', 'in:Pending,Paid,Shipped,Completed'],
            'tracking_courier' => ['nullable', 'string', 'max:100'],
            'tracking_number' => ['nullable', 'string', 'max:120'],
        ]);

        if ($validated['status'] === 'Shipped') {
            $request->validate([
                'tracking_courier' => ['required', 'string', 'max:100'],
                'tracking_number' => ['required', 'string', 'max:120'],
            ]);
        }

        $updates = ['status' => $validated['status']];

        if ($request->filled('tracking_courier')) {
            $updates['tracking_courier'] = $validated['tracking_courier'];
        }

        if ($request->filled('tracking_number')) {
            $updates['tracking_number'] = $validated['tracking_number'];
        }

        $order->update($updates);

        ActivityLog::log(
            'order',
            'status_updated',
            "Order {$order->order_number} status changed to {$validated['status']}",
            [
                'order_number' => $order->order_number,
                'status' => $validated['status'],
                'tracking_courier' => $updates['tracking_courier'] ?? $order->tracking_courier,
                'tracking_number' => $updates['tracking_number'] ?? $order->tracking_number,
            ],
            Auth::guard('admin')->id()
        );

        if ($validated['status'] === 'Paid' && $order->payment) {
            $order->payment->update([
                'status' => 'Confirmed',
                'paid_at' => now(),
            ]);
        }

        return response()->json([
            'success' => true,
            'status' => $order->fresh()->status,
            'tracking_courier' => $order->fresh()->tracking_courier,
            'tracking_number' => $order->fresh()->tracking_number,
        ]);
    }
}
