<?php

namespace Tests\Feature;

use App\Models\PatientAccount;
use App\Models\PregnancyHistory;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class PregnancyHistoryControllerTest extends TestCase
{
    use RefreshDatabase;

    public function test_index()
    {
        PregnancyHistory::factory()->count(3)->create();

        $response = $this->getJson('/api/pregnancy-histories');

        $response->assertStatus(200);
        $response->assertJsonCount(3);
    }

    public function test_store()
    {
        $patient = PatientAccount::factory()->create();
        $data = PregnancyHistory::factory()->make(['patient_id' => $patient->id])->toArray();

        $response = $this->postJson('/api/pregnancy-histories', $data);

        $response->assertStatus(201);
        $this->assertDatabaseHas('pregnancy_histories', $data);
    }

    public function test_show()
    {
        $pregnancyHistory = PregnancyHistory::factory()->create();

        $response = $this->getJson("/api/pregnancy-histories/{$pregnancyHistory->id}");

        $response->assertStatus(200);
        $response->assertJson($pregnancyHistory->toArray());
    }

    public function test_update()
    {
        $pregnancyHistory = PregnancyHistory::factory()->create();
        $patient = PatientAccount::factory()->create();
        $data = PregnancyHistory::factory()->make(['patient_id' => $patient->id])->toArray();

        $response = $this->putJson("/api/pregnancy-histories/{$pregnancyHistory->id}", $data);

        $response->assertStatus(200);
        $this->assertDatabaseHas('pregnancy_histories', $data);
    }

    public function test_destroy()
    {
        $pregnancyHistory = PregnancyHistory::factory()->create();

        $response = $this->deleteJson("/api/pregnancy-histories/{$pregnancyHistory->id}");

        $response->assertStatus(204);
        $this->assertDatabaseMissing('pregnancy_histories', ['id' => $pregnancyHistory->id]);
    }
}