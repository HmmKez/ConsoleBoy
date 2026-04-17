<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Order;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\ActivityLog;
use Illuminate\Support\Facades\Auth;

class AdminOrderController extends Controller
{
    public function index(Request $request)
    {
        $query = Order::with('user');

        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        if ($request->filled('search')) {
            $query->where('order_number', 'like', '%' . $request->search . '%')
                  ->orWhereHas('user', fn($q) =>
                      $q->where('first_name', 'like', '%' . $request->search . '%')
                        ->orWhere('last_name',  'like', '%' . $request->search . '%')
                  );
        }

        $orders = $query->latest()->paginate(10)->withQueryString();

        return Inertia::render('Admin/Orders', [
            'orders'  => $orders->through(fn($o) => [
                'id'           => $o->id,
                'order_number' => $o->order_number,
                'customer'     => $o->user->first_name . ' ' . $o->user->last_name,
                'email'        => $o->user->email,
                'total'        => $o->total,
                'status'       => $o->status,
                'payment_method' => $o->payment_method,
                'created_at'   => $o->created_at->format('M d, Y'),
            ]),
            'filters' => $request->only(['status', 'search']),
        ]);
    }

    public function show(Order $order)
    {
        $order->load(['user', 'items', 'address', 'payment']);

        return response()->json([
            'id'             => $order->id,
            'order_number'   => $order->order_number,
            'status'         => $order->status,
            'payment_method' => $order->payment_method,
            'subtotal'       => $order->subtotal,
            'shipping_fee'   => $order->shipping_fee,
            'total'          => $order->total,
            'order_note'     => $order->order_note,
            'created_at'     => $order->created_at->format('M d, Y · h:i A'),
            'customer'       => [
                'name'  => $order->user->first_name . ' ' . $order->user->last_name,
                'email' => $order->user->email,
                'phone' => $order->user->phone,
            ],
            'address' => $order->address,
            'items'   => $order->items->map(fn($i) => [
                'product_name' => $i->product_name,
                'unit_price'   => $i->unit_price,
                'quantity'     => $i->quantity,
                'subtotal'     => $i->subtotal,
            ]),
        ]);
    }

    public function updateStatus(Request $request, Order $order)
    {
        $request->validate([
            'status' => ['required', 'in:Pending,Paid,Shipped,Completed'],
        ]);

        $order->update(['status' => $request->status]);

        ActivityLog::log(
            'order', 'status_updated',
            "Order {$order->order_number} status changed to {$request->status}",
            ['order_number' => $order->order_number, 'status' => $request->status],
            Auth::guard('admin')->id()
        );

        // Update payment status when paid
        if ($request->status === 'Paid' && $order->payment) {
            $order->payment->update([
                'status'  => 'Confirmed',
                'paid_at' => now(),
            ]);
        }

        return back()->with('success', 'Order status updated.');
    }
}