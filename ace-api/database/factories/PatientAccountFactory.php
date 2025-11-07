<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\PatientAccount>
 */
class PatientAccountFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'email' => $this->faker->unique()->safeEmail,
            'password' => bcrypt('password'),
            'role' => 'patient',
            'first_name' => $this->faker->firstName,
            'last_name' => $this->faker->lastName,
            'phone' => $this->faker->optional()->phoneNumber,
            'birth_date' => $this->faker->optional()->date(),
            'address' => $this->faker->optional()->address,
        ];
    }
}
