<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('orders', function (Blueprint $table) {
            $table->string('payment_channel')->nullable()->after('payment_method');
            $table->string('tracking_courier')->nullable()->after('order_note');
            $table->string('tracking_number')->nullable()->after('tracking_courier');
        });

        Schema::table('payments', function (Blueprint $table) {
            $table->string('payment_channel')->nullable()->after('method');
        });
    }

    public function down(): void
    {
        Schema::table('payments', function (Blueprint $table) {
            $table->dropColumn('payment_channel');
        });

        Schema::table('orders', function (Blueprint $table) {
            $table->dropColumn(['payment_channel', 'tracking_courier', 'tracking_number']);
        });
    }
};
