<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\ShopController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\CartController;
use App\Http\Controllers\Auth\LoginController;
use App\Http\Controllers\Auth\RegisterController;
use App\Http\Controllers\Auth\LogoutController;
use App\Http\Controllers\CheckoutController;
use App\Http\Controllers\Admin\AdminAuthController;
use App\Http\Controllers\Admin\AdminDashboardController;
use App\Http\Controllers\Admin\AdminProductController;
use App\Http\Controllers\Admin\AdminOrderController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\Admin\AdminContentController;
use App\Http\Controllers\Admin\AdminLogsController;

// Public
Route::get('/',                   [HomeController::class,    'index'])->name('home');
Route::get('/about',              [HomeController::class,    'about'])->name('about');
Route::get('/shop',               [ShopController::class,   'index'])->name('shop');
Route::get('/products/{product}', [ProductController::class,'show'])->name('products.show');

// Auth
Route::post('/login',    [LoginController::class,    'store'])->name('login');
Route::post('/register', [RegisterController::class, 'store'])->name('register');
Route::post('/logout',   [LogoutController::class,   'destroy'])->name('logout');

// Cart — must be logged in
Route::middleware('auth')->group(function () {
    Route::get('/cart',               [CartController::class,     'index'])->name('cart');
    Route::post('/cart',              [CartController::class,     'store'])->name('cart.store');
    Route::patch('/cart/{cartItem}',  [CartController::class,     'update'])->name('cart.update');
    Route::delete('/cart/{cartItem}', [CartController::class,     'destroy'])->name('cart.destroy');

    Route::get('/checkout',           [CheckoutController::class, 'index'])->name('checkout');
    Route::post('/checkout',          [CheckoutController::class, 'store'])->name('checkout.store');
    Route::get('/orders/{order}/confirmation', [CheckoutController::class, 'confirmation'])->name('orders.confirmation');

    Route::get('/my-orders',          [OrderController::class, 'index'])->name('orders.index');
    Route::get('/my-orders/{order}',  [OrderController::class, 'show'])->name('orders.show'); 

    Route::get('/profile',                  [ProfileController::class, 'index'])->name('profile');
    Route::patch('/profile/info',           [ProfileController::class, 'updateInfo'])->name('profile.info');
    Route::patch('/profile/password',       [ProfileController::class, 'updatePassword'])->name('profile.password');

});

// Admin auth
Route::prefix('admin')->name('admin.')->group(function () {
    Route::get('/login',  [AdminAuthController::class, 'showLogin'])->name('login');
    Route::post('/login', [AdminAuthController::class, 'login'])->name('login.post');
    Route::post('/logout',[AdminAuthController::class, 'logout'])->name('logout');

    // Protected admin routes
    Route::middleware('admin.auth')->group(function () {
        Route::get('/',          [AdminDashboardController::class, 'index'])->name('dashboard');
        Route::get('/dashboard', [AdminDashboardController::class, 'index']);

        // Products
        Route::get('/products',                          [AdminProductController::class, 'index'])->name('products');
        Route::post('/products',                         [AdminProductController::class, 'store'])->name('products.store');
        Route::post('/products/{product}',               [AdminProductController::class, 'update'])->name('products.update');
        Route::delete('/products/{product}',             [AdminProductController::class, 'destroy'])->name('products.destroy');
        Route::patch('/products/{product}/availability', [AdminProductController::class, 'toggleAvailability'])->name('products.toggle');

        // Orders
        Route::get('/orders',                         [AdminOrderController::class, 'index'])->name('orders');
        Route::get('/orders/{order}',                 [AdminOrderController::class, 'show'])->name('orders.show');
        Route::patch('/orders/{order}/status',        [AdminOrderController::class, 'updateStatus'])->name('orders.status');
    
        // Site Content
        Route::get('/content',        [AdminContentController::class, 'index'])->name('content');
        Route::post('/content/update',[AdminContentController::class, 'update'])->name('content.update');
    
        // Activity Logs
        Route::get('/logs',  [AdminLogsController::class, 'index'])->name('logs');
        Route::delete('/logs/clear', [AdminLogsController::class, 'clear'])->name('logs.clear');
        });
});