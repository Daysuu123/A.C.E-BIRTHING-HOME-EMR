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
        Schema::table('staffs_account', function (Blueprint $table) {
            $table->string('email_verification_token')->nullable()->after('email');
            $table->timestamp('email_verified_at')->nullable()->after('email_verification_token');
            $table->boolean('is_email_verified')->default(false)->after('email_verified_at');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('staffs_account', function (Blueprint $table) {
            $table->dropColumn(['email_verification_token', 'email_verified_at', 'is_email_verified']);
        });
    }
};
