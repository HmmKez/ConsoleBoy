<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Product;

class ProductSeeder extends Seeder
{
    public function run(): void
    {
        $products = [
            // ── PlayStation ─────────────────────────────────────────────────
            [
                'sku'          => 'PS-CON-001',
                'name'         => 'PlayStation 5 Pro Console',
                'brand'        => 'PlayStation',
                'category'     => 'Console',
                'description'  => 'The PS5 Pro delivers next-gen gaming with a custom AMD Zen 2 CPU, RDNA 2 GPU, and ultra-high-speed SSD. Experience games in stunning 4K at up to 120fps with ray tracing support.',
                'price'        => 27995.00,
                'stock'        => 15,
                'is_available' => true,
                'image_url'    => 'https://images.unsplash.com/photo-1607853202273-797f1c22a38e?w=600&q=80',
                'perks'        => [
                    ['label' => 'Free Shipping',   'value' => 'On orders over ₱2,000'],
                    ['label' => '1-Year Warranty', 'value' => 'Official Sony coverage'],
                    ['label' => '100% Authentic',  'value' => 'Authorized dealer'],
                    ['label' => '7-Day Returns',   'value' => 'Hassle-free policy'],
                ],
                'colors' => ['#E8E8E8', '#1A1A1A'],
            ],
            [
                'sku'          => 'PS-CON-002',
                'name'         => 'PlayStation 4 Console',
                'brand'        => 'PlayStation',
                'category'     => 'Console',
                'description'  => 'The PS4 offers an expansive library of games and entertainment. Perfect for casual and hardcore gamers alike.',
                'price'        => 14995.00,
                'stock'        => 10,
                'is_available' => true,
                'image_url'    => 'https://images.unsplash.com/photo-1486401899868-0e435ed85128?w=600&q=80',
                'perks'        => [
                    ['label' => 'Free Shipping',   'value' => 'On orders over ₱2,000'],
                    ['label' => '1-Year Warranty', 'value' => 'Official Sony coverage'],
                    ['label' => '100% Authentic',  'value' => 'Authorized dealer'],
                ],
                'colors' => ['#1A1A1A'],
            ],
            [
                'sku'          => 'PS-CON-003',
                'name'         => 'PlayStation 3 Console',
                'brand'        => 'PlayStation',
                'category'     => 'Console',
                'description'  => 'The classic PS3 with a massive game library. Great for retro gaming enthusiasts.',
                'price'        => 7995.00,
                'stock'        => 5,
                'is_available' => true,
                'image_url'    => 'https://images.unsplash.com/photo-1493711662062-fa541adb3fc8?w=600&q=80',
                'perks'        => [
                    ['label' => 'Free Shipping',  'value' => 'On orders over ₱2,000'],
                    ['label' => '100% Authentic', 'value' => 'Authorized dealer'],
                ],
                'colors' => ['#1A1A1A'],
            ],
            [
                'sku'          => 'PS-CTR-001',
                'name'         => 'DualSense Wireless Controller',
                'brand'        => 'PlayStation',
                'category'     => 'Controller',
                'description'  => 'Experience haptic feedback and adaptive triggers for a more immersive gaming experience. Compatible with PS5.',
                'price'        => 4995.00,
                'stock'        => 30,
                'is_available' => true,
                'image_url'    => 'https://images.unsplash.com/photo-1592840496694-26d035b52b48?w=600&q=80',
                'perks'        => [
                    ['label' => 'Free Shipping',   'value' => 'On orders over ₱2,000'],
                    ['label' => '1-Year Warranty', 'value' => 'Official Sony coverage'],
                    ['label' => '100% Authentic',  'value' => 'Authorized dealer'],
                ],
                'colors' => ['#E8E8E8', '#1A1A1A', '#D0111A', '#1A4ED8'],
            ],
            [
                'sku'          => 'PS-CTR-002',
                'name'         => 'DualShock 4 Controller',
                'brand'        => 'PlayStation',
                'category'     => 'Controller',
                'description'  => 'The iconic DualShock 4 controller for PS4. Features a built-in touchpad, speaker, and light bar.',
                'price'        => 2995.00,
                'stock'        => 25,
                'is_available' => true,
                'image_url'    => 'https://images.unsplash.com/photo-1542549237-9b44cdb98e74?w=600&q=80',
                'perks'        => [
                    ['label' => 'Free Shipping',   'value' => 'On orders over ₱2,000'],
                    ['label' => '1-Year Warranty', 'value' => 'Official Sony coverage'],
                ],
                'colors' => ['#1A1A1A', '#E8E8E8', '#D0111A'],
            ],

            // ── Xbox ─────────────────────────────────────────────────────────
            [
                'sku'          => 'XB-CON-001',
                'name'         => 'Xbox Series X',
                'brand'        => 'Xbox',
                'category'     => 'Console',
                'description'  => 'The fastest, most powerful Xbox ever. Play thousands of titles from four generations of Xbox at up to 4K 120fps.',
                'price'        => 32995.00,
                'stock'        => 12,
                'is_available' => true,
                'image_url'    => 'https://images.unsplash.com/photo-1621259182978-fbf93132d53d?w=600&q=80',
                'perks'        => [
                    ['label' => 'Free Shipping',   'value' => 'On orders over ₱2,000'],
                    ['label' => '1-Year Warranty', 'value' => 'Official Microsoft coverage'],
                    ['label' => '100% Authentic',  'value' => 'Authorized dealer'],
                    ['label' => '7-Day Returns',   'value' => 'Hassle-free policy'],
                ],
                'colors' => ['#1A1A1A'],
            ],
            [
                'sku'          => 'XB-CON-002',
                'name'         => 'Xbox Series S',
                'brand'        => 'Xbox',
                'category'     => 'Console',
                'description'  => 'The smallest, sleekest Xbox ever. Go all-digital and enjoy next-gen performance in a compact form.',
                'price'        => 24995.00,
                'stock'        => 18,
                'is_available' => true,
                'image_url'    => 'https://images.unsplash.com/photo-1622297845775-5ff3fef71d13?w=600&q=80',
                'perks'        => [
                    ['label' => 'Free Shipping',   'value' => 'On orders over ₱2,000'],
                    ['label' => '1-Year Warranty', 'value' => 'Official Microsoft coverage'],
                    ['label' => '100% Authentic',  'value' => 'Authorized dealer'],
                ],
                'colors' => ['#E8E8E8'],
            ],
            [
                'sku'          => 'XB-CTR-001',
                'name'         => 'Xbox Wireless Controller',
                'brand'        => 'Xbox',
                'category'     => 'Controller',
                'description'  => 'Experience the modernized Xbox Wireless Controller featuring textured grip, a dedicated Share button, and USB-C.',
                'price'        => 3295.00,
                'stock'        => 35,
                'is_available' => true,
                'image_url'    => 'https://images.unsplash.com/photo-1600080972464-8e5f35f63d08?w=600&q=80',
                'perks'        => [
                    ['label' => 'Free Shipping',   'value' => 'On orders over ₱2,000'],
                    ['label' => '1-Year Warranty', 'value' => 'Official Microsoft coverage'],
                ],
                'colors' => ['#1A1A1A', '#E8E8E8', '#D0111A', '#6B7280'],
            ],

            // ── Nintendo ──────────────────────────────────────────────────────
            [
                'sku'          => 'NT-CON-001',
                'name'         => 'Nintendo Switch OLED',
                'brand'        => 'Nintendo',
                'category'     => 'Console',
                'description'  => 'Features a vivid 7-inch OLED screen, a wide adjustable stand, a dock with a wired LAN port, 64GB of internal storage, and enhanced audio.',
                'price'        => 19995.00,
                'stock'        => 20,
                'is_available' => true,
                'image_url'    => 'https://images.unsplash.com/photo-1612036782180-6f0b6cd846fe?w=600&q=80',
                'perks'        => [
                    ['label' => 'Free Shipping',   'value' => 'On orders over ₱2,000'],
                    ['label' => '1-Year Warranty', 'value' => 'Official Nintendo coverage'],
                    ['label' => '100% Authentic',  'value' => 'Authorized dealer'],
                    ['label' => '7-Day Returns',   'value' => 'Hassle-free policy'],
                ],
                'colors' => ['#E8E8E8', '#1A1A1A'],
            ],
            [
                'sku'          => 'NT-CON-002',
                'name'         => 'Nintendo Switch Lite',
                'brand'        => 'Nintendo',
                'category'     => 'Console',
                'description'  => 'A compact, lightweight Nintendo Switch system designed for handheld play. Supports all Nintendo Switch games that can be played in handheld mode.',
                'price'        => 12995.00,
                'stock'        => 22,
                'is_available' => true,
                'image_url'    => 'https://images.unsplash.com/photo-1578303512597-81e6cc155b3e?w=600&q=80',
                'perks'        => [
                    ['label' => 'Free Shipping',   'value' => 'On orders over ₱2,000'],
                    ['label' => '1-Year Warranty', 'value' => 'Official Nintendo coverage'],
                    ['label' => '100% Authentic',  'value' => 'Authorized dealer'],
                ],
                'colors' => ['#E8E8E8', '#6B7280', '#D0111A', '#1A4ED8', '#F59E0B'],
            ],
            [
                'sku'          => 'NT-CTR-001',
                'name'         => 'Joy-Con Pair (Neon)',
                'brand'        => 'Nintendo',
                'category'     => 'Controller',
                'description'  => 'Neon Red and Neon Blue Joy-Con controllers. Compatible with Nintendo Switch and Switch OLED.',
                'price'        => 3995.00,
                'stock'        => 28,
                'is_available' => true,
                'image_url'    => 'https://images.unsplash.com/photo-1640955785023-1854685dae55?w=600&q=80',
                'perks'        => [
                    ['label' => 'Free Shipping',   'value' => 'On orders over ₱2,000'],
                    ['label' => '1-Year Warranty', 'value' => 'Official Nintendo coverage'],
                ],
                'colors' => ['#D0111A', '#1A4ED8'],
            ],
            [
                'sku'          => 'NT-ACC-001',
                'name'         => 'Nintendo Switch Pro Controller',
                'brand'        => 'Nintendo',
                'category'     => 'Controller',
                'description'  => 'The Nintendo Switch Pro Controller features a traditional design with motion controls, HD rumble, and built-in amiibo functionality.',
                'price'        => 4495.00,
                'stock'        => 15,
                'is_available' => true,
                'image_url'    => 'https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=600&q=80',
                'perks'        => [
                    ['label' => 'Free Shipping',   'value' => 'On orders over ₱2,000'],
                    ['label' => '1-Year Warranty', 'value' => 'Official Nintendo coverage'],
                    ['label' => '100% Authentic',  'value' => 'Authorized dealer'],
                ],
                'colors' => ['#1A1A1A'],
            ],
        ];

        foreach ($products as $p) {
            Product::updateOrCreate(
                ['sku' => $p['sku']],
                $p
            );
        }
    }
}
