<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use App\Models\Product;
use Illuminate\Http\Request;

class ShopController extends Controller
{
    public function index(Request $request)
    {
        $brand = $request->input('brand', '');
        $search = $request->input('search', '');
        $sort = $request->input('sort', 'low');
        $category = $request->input('category', '');
        $inStock = $request->input('in_stock', '');
        $catalogMaxPrice = (int) ceil((Product::where('is_available', true)->max('price') ?? 50000) / 1000) * 1000;
        $catalogMaxPrice = max($catalogMaxPrice, 50000);
        $maxPrice = (int) $request->input('max_price', $catalogMaxPrice);

        $query = Product::where('is_available', true);

        // Brand
        if (!empty($brand)) {
            $query->where('brand', $brand);
        }

        // Category
        if (!empty($category)) {
            $query->where('category', $category);
        }

        // Search
        if (!empty($search)) {
            $query->where('name', 'like', '%' . $search . '%');
        }

        // Price
        $query->where('price', '<=', $maxPrice);

        // In stock only
        if ($inStock === '1') {
            $query->where('stock', '>', 0);
        }

        // Sort
        match ($sort) {
            'high' => $query->orderBy('price', 'desc'),
            'name' => $query->orderBy('name', 'asc'),
            default => $query->orderBy('price', 'asc'),
        };

        $products = $query->paginate(6)->withQueryString();

        $content = \App\Models\SiteContent::where('page', 'shop')
            ->get()
            ->pluck('value', 'key')
            ->toArray();

        return Inertia::render('Shop', [
            'products'    => $products,
            'activeBrand' => $brand,
            'filters'     => [
                'brand'     => $brand,
                'category'  => $category,
                'search'    => $search,
                'sort'      => $sort,
                'max_price' => $maxPrice,
                'in_stock'  => $inStock,
            ],
            'priceBounds' => [
                'min' => 0,
                'max' => $catalogMaxPrice,
            ],
            'content' => $content,
        ]);
    }
}
