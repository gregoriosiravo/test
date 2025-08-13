<?php

namespace Database\Seeders;

use App\Models\Order;
use App\Models\Product;
use Illuminate\Database\Seeder;

class OrderProductSeeder extends Seeder
{
    public function run(): void
    {
        $orders = Order::all();
        $products = Product::all();

        foreach ($orders as $order) {
            $randomProducts = $products->random(rand(2, 5));
            
            foreach ($randomProducts as $product) {
                $order->products()->attach($product->id, [
                    'quantity' => rand(1, 3), 
                ]);
            }
        }
    }
}