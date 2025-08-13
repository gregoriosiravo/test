<?php

namespace App\Http\Controllers;

use App\Models\Order;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class OrderController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $orders = Order::all();
        return response()->json($orders);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        $order = Order::with('products')->find($id);

        if (!$order) {
            return response()->json([
                'message' => 'Order not found'
            ], 404);
        }

        return response()->json([
            'id' => $order->id,
            'name' => $order->name,
            'description' => $order->description,
            'date' => $order->date->format('Y-m-d'),
            'products' => $order->products->map(function ($product) {
                return [
                    'id' => $product->id,
                    'name' => $product->name,
                    'price' => (float) $product->price,
                    'quantity' => $product->pivot->quantity,
                ];
            })
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        $validated = $request->validate([
            'name' => 'sometimes|string|max:255',
            'description' => 'sometimes|string',
            'date' => 'sometimes|date',
            'products' => 'sometimes|array',
            'products.*.id' => 'required_with:products|exists:products,id',
            'products.*.quantity' => 'required_with:products|integer|min:1',
        ]);

        $order = Order::find($id);

        if (!$order) {
            return response()->json(['message' => 'Order not found'], 404);
        }

        DB::beginTransaction();

        try {
            if (isset($validated['name']))
                $order->name = $validated['name'];
            if (isset($validated['description']))
                $order->description = $validated['description'];
            if (isset($validated['date']))
                $order->date = $validated['date'];

            $order->save();

            if (isset($validated['products'])) {
                $this->updateOrderProducts($order, $validated['products']);
            }

            DB::commit();

            $order->load('products');

            return response()->json([
                'id' => $order->id,
                'name' => $order->name,
                'description' => $order->description,
                'date' => $order->date->format('Y-m-d'),
                'products' => $order->products->map(function ($product) {
                    return [
                        'id' => $product->id,
                        'name' => $product->name,
                        'price' => (float) $product->price,
                        'quantity' => $product->pivot->quantity,
                    ];
                })
            ]);

        } catch (\Exception $e) {
            DB::rollback();
            return response()->json(['message' => 'Update failed: ' . $e->getMessage()], 500);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        $order = Order::find($id);

        if (!$order) {
            return response()->json([
                'message' => 'Order not found'
            ], 404);
        }

        $order->delete();

        return response()->json([
            'message' => 'Order deleted successfully'
        ]);
    }

    private function updateOrderProducts(Order $order, array $products)
    {
        $syncData = [];

        foreach ($products as $product) {
            $syncData[$product['id']] = ['quantity' => $product['quantity']];
        }
        $order->products()->sync($syncData);
    }
}
