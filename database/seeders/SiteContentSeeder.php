<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class SiteContentSeeder extends Seeder
{
    public function run(): void
    {
        $contents = [
            // Home page
            ['page' => 'home', 'key' => 'hero_title',     'type' => 'text',     'value' => 'LEVEL UP YOUR GAME',                                              'label' => 'Hero Title'],
            ['page' => 'home', 'key' => 'hero_subtitle',  'type' => 'textarea', 'value' => 'Premium consoles, accessories, and controllers — all in one place. The best brands, the lowest prices, delivered fast.', 'label' => 'Hero Subtitle'],
            ['page' => 'home', 'key' => 'hero_image',     'type' => 'image',    'value' => 'https://images.unsplash.com/photo-1593305841991-05c297ba4575?w=1400&q=80', 'label' => 'Hero Background Image'],
            ['page' => 'home', 'key' => 'brands_title',   'type' => 'text',     'value' => "Check out what's in store!",                                       'label' => 'Brands Section Title'],
            ['page' => 'home', 'key' => 'brands_caption', 'type' => 'text',     'value' => 'We give you the best of the best!',                                'label' => 'Brands Section Caption'],
            ['page' => 'home', 'key' => 'xbox_image',     'type' => 'image',    'value' => 'https://images.unsplash.com/photo-1605901309584-818e25960a8f?w=600&q=80', 'label' => 'Xbox Card Image'],
            ['page' => 'home', 'key' => 'ps_image',       'type' => 'image',    'value' => 'https://images.unsplash.com/photo-1493711662062-fa541adb3fc8?w=600&q=80', 'label' => 'PlayStation Card Image'],
            ['page' => 'home', 'key' => 'nintendo_image', 'type' => 'image',    'value' => 'https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?w=600&q=80', 'label' => 'Nintendo Card Image'],

            // About page
            ['page' => 'about', 'key' => 'hero_image',      'type' => 'image',    'value' => 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=1400&q=80', 'label' => 'Hero Background Image'],
            ['page' => 'about', 'key' => 'hero_title',      'type' => 'text',     'value' => 'ABOUT US',                                                        'label' => 'Hero Title'],
            ['page' => 'about', 'key' => 'hero_subtitle',   'type' => 'text',     'value' => 'We are cool gamers',                                               'label' => 'Hero Subtitle'],
            ['page' => 'about', 'key' => 'stat_sales',      'type' => 'text',     'value' => '676,676',                                                          'label' => 'Total Sales Number'],
            ['page' => 'about', 'key' => 'stat_customers',  'type' => 'text',     'value' => '676,676',                                                          'label' => 'Total Customers Number'],
            ['page' => 'about', 'key' => 'founder_name',    'type' => 'text',     'value' => 'Kent Augustine Concha',                                            'label' => 'Founder Name'],
            ['page' => 'about', 'key' => 'founder_bio',     'type' => 'textarea', 'value' => 'His name is Kent Augustine Concha. He likes to eat a lot, and I mean a lot. yes.', 'label' => 'Founder Bio'],
            ['page' => 'about', 'key' => 'founder_image',   'type' => 'image',    'value' => '',                                                                 'label' => 'Founder Photo'],

            // Shop page
            ['page' => 'shop', 'key' => 'hero_image', 'type' => 'image', 'value' => 'https://images.unsplash.com/photo-1593305841991-05c297ba4575?w=1400&q=80', 'label' => 'Shop Hero Background'],
        ];

        foreach ($contents as $c) {
            DB::table('site_contents')->updateOrInsert(
                ['page' => $c['page'], 'key' => $c['key']],
                array_merge($c, ['created_at' => now(), 'updated_at' => now()])
            );
        }
    }
}