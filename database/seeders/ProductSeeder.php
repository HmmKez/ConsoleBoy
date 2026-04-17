<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Product;

class ProductSeeder extends Seeder
{
    public function run(): void
    {
        $products = [
            ['sku'=>'PS5-001','name'=>'PlayStation 5 Pro Console','brand'=>'PlayStation','category'=>'Console','price'=>27995,'stock'=>5,'is_available'=>true],
            ['sku'=>'PS4-001','name'=>'PlayStation 4 Console','brand'=>'PlayStation','category'=>'Console','price'=>14995,'stock'=>8,'is_available'=>true],
            ['sku'=>'PS3-001','name'=>'PlayStation 3 Console','brand'=>'PlayStation','category'=>'Console','price'=>7995,'stock'=>3,'is_available'=>true],
            ['sku'=>'XBX-001','name'=>'Xbox Series X','brand'=>'Xbox','category'=>'Console','price'=>32995,'stock'=>5,'is_available'=>true],
            ['sku'=>'XBS-001','name'=>'Xbox Series S','brand'=>'Xbox','category'=>'Console','price'=>24995,'stock'=>14,'is_available'=>true],
            ['sku'=>'NSW-001','name'=>'Nintendo Switch OLED','brand'=>'Nintendo','category'=>'Console','price'=>19995,'stock'=>7,'is_available'=>true],
            ['sku'=>'NSW-002','name'=>'Nintendo Switch Lite','brand'=>'Nintendo','category'=>'Console','price'=>12995,'stock'=>10,'is_available'=>true],
        ];

        foreach ($products as $p) {
            Product::create($p);
        }
    }
}