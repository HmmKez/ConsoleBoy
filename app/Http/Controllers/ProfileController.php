<?php

namespace App\Http\Controllers;

use App\Models\Order;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;

class ProfileController extends Controller
{
    public function index()
    {
        $user = Auth::user();

        $orders = Order::with(['items'])
            ->where('user_id', $user->id)
            ->latest()
            ->get()
            ->map(fn($o) => [
                'id' => $o->id,
                'order_number' => $o->order_number,
                'status' => $o->status,
                'total' => $o->total,
                'items_count' => $o->items->count(),
                'payment_method' => $o->payment_method,
                'payment_channel' => $o->payment_channel,
                'tracking_courier' => $o->tracking_courier,
                'tracking_number' => $o->tracking_number,
                'created_at' => $o->created_at->format('M d, Y'),
            ]);

        $stats = [
            'total_orders' => $orders->count(),
            'total_spent' => $orders->sum('total'),
            'pending' => $orders->where('status', 'Pending')->count(),
            'completed' => $orders->where('status', 'Completed')->count(),
        ];

        return Inertia::render('Profile', [
            'orders' => $orders,
            'stats' => $stats,
        ]);
    }

    public function updateInfo(Request $request)
    {
        $user = Auth::user();

        $validated = $request->validate([
            'first_name' => ['required', 'string', 'max:255'],
            'last_name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'unique:users,email,' . $user->id],
            'phone' => ['nullable', 'string', 'max:20'],
        ]);

        $user->update($validated);

        return back()->with('success', 'Profile updated.');
    }

    public function updatePassword(Request $request)
    {
        $request->validate([
            'current_password' => ['required'],
            'password' => ['required', 'min:8', 'confirmed'],
        ]);

        $user = Auth::user();

        if (!Hash::check($request->current_password, $user->password)) {
            return back()->withErrors(['current_password' => 'Current password is incorrect.']);
        }

        $user->update(['password' => Hash::make($request->password)]);

        return back()->with('success', 'Password updated.');
    }
}
