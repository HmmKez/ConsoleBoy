<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Product;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Storage;
use App\Models\ActivityLog;
use Illuminate\Support\Facades\Auth;

class AdminProductController extends Controller
{
    public function index(Request $request)
    {
        $query = Product::query();

        if ($request->filled('search')) {
            $query->where(function ($q) use ($request) {
                $q->where('name', 'like', '%' . $request->search . '%')
                  ->orWhere('brand', 'like', '%' . $request->search . '%');
            });
        }

        if ($request->filled('brand')) {
            $query->where('brand', $request->brand);
        }

        $products = $query->latest()->paginate(10)->withQueryString();

        return Inertia::render('Admin/Products', [
            'products' => $products,
            'filters'  => $request->only(['search', 'brand']),
        ]);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'name'         => ['required', 'string', 'max:255'],
            'brand'        => ['required', 'string'],
            'category'     => ['required', 'string'],
            'description'  => ['nullable', 'string'],
            'price'        => ['required', 'numeric', 'min:0'],
            'stock'        => ['required', 'integer', 'min:0'],
            'is_available' => ['nullable'],
            'image'        => ['nullable', 'image', 'max:5120'],
            'perks'        => ['nullable', 'string'],
            'colors'       => ['nullable', 'string'],
        ]);

        $imageUrl = null;
        if ($request->hasFile('image')) {
            $path     = $request->file('image')->store('products', 'public');
            $imageUrl = Storage::url($path);
        }

        $count = Product::count();
        $brand = strtoupper(substr($data['brand'], 0, 3));
        $sku   = 'CB-' . $brand . '-' . str_pad($count + 1, 3, '0', STR_PAD_LEFT);

        // is_available: '1' means true, anything else means false
        $isAvailable = $request->input('is_available') === '1' || $request->input('is_available') === 1 || $request->input('is_available') === true;

        Product::create([
            'sku'          => $sku,
            'name'         => $data['name'],
            'brand'        => $data['brand'],
            'category'     => $data['category'],
            'description'  => $data['description'] ?? null,
            'price'        => $data['price'],
            'stock'        => $data['stock'],
            'is_available' => $isAvailable,
            'image_url'    => $imageUrl,
            'perks'        => isset($data['perks'])   ? json_decode($data['perks'],  true) : [],
            'colors'       => isset($data['colors'])  ? json_decode($data['colors'], true) : [],
        ]);

        ActivityLog::log(
            'product', 'created',
            "Product created: {$data['name']}",
            ['brand' => $data['brand'], 'price' => $data['price']],
            Auth::guard('admin')->id()
        );

        return back()->with('success', 'Product created.');
    }

    public function update(Request $request, Product $product)
    {
        $data = $request->validate([
            'name'         => ['required', 'string', 'max:255'],
            'brand'        => ['required', 'string'],
            'category'     => ['required', 'string'],
            'description'  => ['nullable', 'string'],
            'price'        => ['required', 'numeric', 'min:0'],
            'stock'        => ['required', 'integer', 'min:0'],
            'is_available' => ['nullable'],
            'image'        => ['nullable', 'image', 'max:5120'],
            'perks'        => ['nullable', 'string'],
            'colors'       => ['nullable', 'string'],
        ]);

        $isAvailable = $request->input('is_available') === '1' || $request->input('is_available') === 1 || $request->input('is_available') === true;

        $updateData = [
            'name'         => $data['name'],
            'brand'        => $data['brand'],
            'category'     => $data['category'],
            'description'  => $data['description'] ?? null,
            'price'        => $data['price'],
            'stock'        => $data['stock'],
            'is_available' => $isAvailable,
            'perks'        => isset($data['perks'])  ? json_decode($data['perks'],  true) : [],
            'colors'       => isset($data['colors']) ? json_decode($data['colors'], true) : [],
        ];

        if ($request->hasFile('image')) {
            $path                    = $request->file('image')->store('products', 'public');
            $updateData['image_url'] = Storage::url($path);
        }

        $product->update($updateData);

        ActivityLog::log(
            'product', 'updated',
            "Product updated: {$product->name}",
            ['brand' => $product->brand],
            Auth::guard('admin')->id()
        );

        return back()->with('success', 'Product updated.');
    }

    public function destroy(Product $product)
    {
        ActivityLog::log(
            'product', 'deleted',
            "Product deleted: {$product->name}",
            ['brand' => $product->brand, 'price' => $product->price],
            Auth::guard('admin')->id()
        );
        $product->delete();
        return back()->with('success', 'Product deleted.');
    }

    public function toggleAvailability(Product $product)
    {
        $product->update(['is_available' => !$product->is_available]);
        return back();
    }
}