<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\ActivityLog;

class LoginController extends Controller
{
    public function store(Request $request)
    {
        $request->validate([
            'email'    => ['required', 'email'],
            'password' => ['required'],
        ]);

        if (Auth::attempt(['email' => $request->email, 'password' => $request->password], false)) {
            $request->session()->regenerate();

            ActivityLog::log(
                'auth', 'login',
                "Customer logged in: {$request->email}",
                ['email' => $request->email],
                null,
                Auth::id()
            );

            return response()->json(['success' => true, 'user' => Auth::user()]);
        }

        return response()->json(['success' => false, 'message' => 'These credentials do not match our records.'], 422);
    }
}