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
        Schema::create('newborn_information', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('patient_id');
            $table->unsignedBigInteger('delivery_record_id');
            $table->string('gender');
            $table->decimal('weight', 5, 2);
            $table->decimal('length', 5, 2);
            $table->text('complications')->nullable();
            $table->timestamps();

            $table->foreign('patient_id')->references('id')->on('patient_acc')->onDelete('cascade');
            $table->foreign('delivery_record_id')->references('id')->on('delivery_records')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('newborn_information');
    }
};
