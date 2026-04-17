<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\Product;
use App\Models\User;
use Inertia\Inertia;

class AdminDashboardController extends Controller
{
    public function index()
    {
        $totalSales     = Order::whereIn('status', ['Paid','Shipped','Completed'])->sum('total');
        $totalOrders    = Order::count();
        $totalCustomers = User::where('role', 'customer')->count();
        $lowStock       = Product::where('stock', '<=', 10)->where('is_available', true)->get();

        $recentOrders = Order::with('user')
            ->latest()
            ->limit(5)
            ->get()
            ->map(fn($o) => [
                'id'           => $o->id,
                'order_number' => $o->order_number,
                'customer'     => $o->user->first_name . ' ' . $o->user->last_name,
                'total'        => $o->total,
                'status'       => $o->status,
                'created_at'   => $o->created_at->format('M d, Y'),
            ]);

        return Inertia::render('Admin/Dashboard', [
            'stats' => [
                'totalSales'     => $totalSales,
                'totalOrders'    => $totalOrders,
                'totalCustomers' => $totalCustomers,
            ],
            'lowStock'     => $lowStock,
            'recentOrders' => $recentOrders,
        ]);
    }
}