<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Admin;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use App\Models\ActivityLog;

class AdminAuthController extends Controller
{
    public function showLogin()
    {
        if (Auth::guard('admin')->check()) {
            return redirect()->route('admin.dashboard');
        }
        return Inertia::render('Admin/Login');
    }

    public function login(Request $request)
    {
        $credentials = $request->validate([
            'email'    => ['required', 'email'],
            'password' => ['required'],
        ]);

        if (Auth::guard('admin')->attempt($credentials)) {
            $request->session()->regenerate();
            Auth::guard('admin')->user()->update(['last_login' => now()]);
            ActivityLog::log(
                'auth', 'admin_login',
                "Admin logged in: " . Auth::guard('admin')->user()->email,
                [],
                Auth::guard('admin')->id()
            );
            return response()->json(['success' => true]);
        }

        return response()->json([
            'success' => false,
            'message' => 'Invalid admin credentials.',
        ], 422);
    }

    public function logout(Request $request)
    {
        ActivityLog::log(
            'auth', 'admin_logout',
            "Admin logged out",
            [],
            Auth::guard('admin')->user()?->id
        );
        Auth::guard('admin')->logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();
        return redirect()->route('admin.login');
    }
}