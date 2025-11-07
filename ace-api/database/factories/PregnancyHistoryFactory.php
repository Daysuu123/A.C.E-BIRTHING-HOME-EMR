<?php

namespace Database\Factories;

use App\Models\PatientAccount;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\PregnancyHistory>
 */
class PregnancyHistoryFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'patient_id' => PatientAccount::factory(),
            'gravida' => $this->faker->numberBetween(1, 10),
            'para' => $this->faker->numberBetween(0, 10),
            'full_term_pregnancies' => $this->faker->numberBetween(0, 10),
            'preterm_deliveries' => $this->faker->numberBetween(0, 10),
            'abortions' => $this->faker->numberBetween(0, 10),
            'living_children' => $this->faker->numberBetween(0, 10),
            'last_menstrual_period' => $this->faker->date(),
        ];
    }
}
