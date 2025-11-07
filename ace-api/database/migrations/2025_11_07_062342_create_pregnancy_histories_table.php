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
        Schema::create('pregnancy_histories', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('patient_id');
            $table->integer('gravida');
            $table->integer('para');
            $table->integer('full_term_pregnancies');
            $table->integer('preterm_deliveries');
            $table->integer('abortions');
            $table->integer('living_children');
            $table->date('last_menstrual_period');
            $table->timestamps();

            $table->foreign('patient_id')->references('id')->on('patient_acc')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('pregnancy_histories');
    }
};
