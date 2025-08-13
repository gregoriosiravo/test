<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Item>
 */
class ItemFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'title' => [
                'it' => $this->faker->sentence(3),
                'pt' => $this->faker->sentence(3),
            ],
            'image' => 'https://cdn.getyourguide.com/img/tour/a3e320826b60d981.jpeg/132.webp', // Puoi aggiornare con immagini reali
            'description' => [
                'it' => $this->faker->paragraph(),
                'pt' => $this->faker->paragraph(),
            ],
            'duration' => $this->faker->randomElement(['30m', '1h', '2h', '3h']),
            'rating' => $this->faker->randomFloat(1, 0, 5),
            'price' => [
                'it' => $this->faker->randomFloat(2, 10, 100),
                'pt' => $this->faker->randomFloat(2, 50, 500),
            ],
            'tag' => $this->faker->optional()->word(),
            'soldOut' => $this->faker->boolean(20), // 20% di possibilità che sia esaurito
        ];
    }
}
