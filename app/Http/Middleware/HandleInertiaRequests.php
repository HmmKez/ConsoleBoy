<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Middleware;
use App\Models\CartItem;

class HandleInertiaRequests extends Middleware
{
    protected $rootView = 'app';

    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    public function share(Request $request): array
    {
        $cartCount = 0;
        if (Auth::guard('web')->check()) {
            $cartCount = CartItem::where('user_id', Auth::guard('web')->id())->sum('quantity');
        }

        return [
            ...parent::share($request),
            'auth' => [
                'user' => Auth::guard('web')->check() ? [
                    'id'         => Auth::guard('web')->user()->id,
                    'first_name' => Auth::guard('web')->user()->first_name,
                    'last_name'  => Auth::guard('web')->user()->last_name,
                    'email'      => Auth::guard('web')->user()->email,
                    'phone'      => Auth::guard('web')->user()->phone,
                    'role'       => Auth::guard('web')->user()->role,
                    'created_at' => Auth::guard('web')->user()->created_at->format('M d, Y'),
                ] : null,
                'admin' => Auth::guard('admin')->check() ? [
                    'id'   => Auth::guard('admin')->user()->id,
                    'name' => Auth::guard('admin')->user()->name,
                    'role' => Auth::guard('admin')->user()->role,
                ] : null,
            ],
            'cartCount' => $cartCount,
            'flash' => [
                'success' => $request->session()->get('success'),
                'error'   => $request->session()->get('error'),
            ],
        ];
    }

}