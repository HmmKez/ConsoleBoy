<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\SiteContent;
use App\Models\ActivityLog;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class AdminContentController extends Controller
{
    public function index()
    {
        $pages   = ['home', 'about', 'shop'];
        $content = [];

        foreach ($pages as $page) {
            $rows = SiteContent::where('page', $page)->get();
            $content[$page] = $rows->map(fn($c) => [
                'id'    => $c->id,
                'page'  => $c->page,
                'key'   => $c->key,
                'type'  => $c->type,
                'value' => $c->value ?? '',
                'label' => $c->label,
            ])->values()->toArray();
        }

        return Inertia::render('Admin/Content', [
            'content' => $content,
        ]);
    }

    public function update(Request $request)
    {
        try {
            $request->validate([
                'page'  => ['required', 'string'],
                'key'   => ['required', 'string'],
                'value' => ['nullable', 'string'],
                'image' => ['nullable', 'image', 'max:10240'],
            ]);

            $page = $request->input('page');
            $key  = $request->input('key');

            // Find the record — log what we're looking for
            Log::info("Content update attempt", ['page' => $page, 'key' => $key]);

            $record = SiteContent::where('page', $page)
                ->where('key', $key)
                ->first();

            if (!$record) {
                Log::error("Content record not found", ['page' => $page, 'key' => $key]);
                return response()->json([
                    'success' => false,
                    'message' => "Not found: page='{$page}' key='{$key}'",
                ], 404);
            }

            $value = $request->input('value', $record->value);

            if ($request->hasFile('image')) {
                $file = $request->file('image');
                $path = $file->store('site', 'public');
                $value = '/storage/' . $path;
                Log::info("Image stored", ['path' => $value]);
            }

            $record->value = $value;
            $record->save();

            Log::info("Content updated", ['page' => $page, 'key' => $key, 'value' => $value]);

            ActivityLog::log(
                'content',
                'updated',
                "Site content updated: [{$page}] {$key}",
                ['page' => $page, 'key' => $key],
                Auth::guard('admin')->id()
            );

            return response()->json([
                'success' => true,
                'value'   => $value,
                'message' => 'Saved successfully.',
            ]);

        } catch (\Exception $e) {
            Log::error("Content update error", ['error' => $e->getMessage()]);
            return response()->json([
                'success' => false,
                'message' => $e->getMessage(),
            ], 500);
        }
    }
}