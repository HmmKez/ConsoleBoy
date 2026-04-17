<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\ActivityLog;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AdminLogsController extends Controller
{
    public function index(Request $request)
    {
        $query = ActivityLog::with(['admin', 'user'])->latest();

        if ($request->filled('type')) {
            $query->where('type', $request->type);
        }

        if ($request->filled('action')) {
            $query->where('action', $request->action);
        }

        if ($request->filled('search')) {
            $query->where('description', 'like', '%' . $request->search . '%');
        }

        $logs = $query->paginate(20)->withQueryString();

        return Inertia::render('Admin/Logs', [
            'logs'    => $logs->through(fn($l) => [
                'id'          => $l->id,
                'type'        => $l->type,
                'action'      => $l->action,
                'description' => $l->description,
                'ip_address'  => $l->ip_address,
                'meta'        => $l->meta,
                'admin'       => $l->admin?->name,
                'user'        => $l->user ? $l->user->first_name . ' ' . $l->user->last_name : null,
                'created_at'  => $l->created_at->format('M d, Y · h:i A'),
                'time_ago'    => $l->created_at->diffForHumans(),
            ]),
            'filters' => $request->only(['type', 'action', 'search']),
        ]);
    }

    public function clear()
    {
        ActivityLog::where('created_at', '<', now()->subDays(30))->delete();
        return back()->with('success', 'Logs older than 30 days cleared.');
    }
}