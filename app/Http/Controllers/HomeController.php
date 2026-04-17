<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use App\Models\Product;
use App\Models\SiteContent;

class HomeController extends Controller
{
    public function index()
    {
        $featured = Product::where('is_available', true)
            ->latest()
            ->limit(4)
            ->get()
            ->map(fn($p) => [
                'id'        => $p->id,
                'name'      => $p->name,
                'brand'     => $p->brand,
                'price'     => $p->price,
                'image_url' => $p->image_url,
            ]);

        // Always pull fresh from DB — no caching
        $content = SiteContent::where('page', 'home')
            ->get()
            ->pluck('value', 'key')
            ->toArray();

        return Inertia::render('Home', [
            'featured' => $featured,
            'content'  => $content,
        ]);
    }

    public function about()
    {
        $content = SiteContent::where('page', 'about')
            ->get()
            ->pluck('value', 'key')
            ->toArray();

        return Inertia::render('About', [
            'content' => $content,
        ]);
    }
}