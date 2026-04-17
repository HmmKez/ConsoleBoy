<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('site_contents', function (Blueprint $table) {
            $table->id();
            $table->string('page');       // home | about | shop
            $table->string('key');        // unique key e.g. hero_title
            $table->string('type');       // text | image | textarea
            $table->text('value')->nullable();
            $table->string('label');      // Human readable label for admin UI
            $table->timestamps();

            $table->unique(['page', 'key']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('site_contents');
    }
};
