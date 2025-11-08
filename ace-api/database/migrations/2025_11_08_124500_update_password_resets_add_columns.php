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
        // Add missing columns to password_resets if they don't exist
        if (!Schema::hasTable('password_resets')) {
            return; // table missing; another migration should create it
        }

        Schema::table('password_resets', function (Blueprint $table) {
            if (!Schema::hasColumn('password_resets', 'code')) {
                $table->string('code', 10)->nullable();
            }
            if (!Schema::hasColumn('password_resets', 'token')) {
                $table->string('token', 128)->nullable();
            }
            if (!Schema::hasColumn('password_resets', 'account_type')) {
                $table->string('account_type')->nullable();
            }
            if (!Schema::hasColumn('password_resets', 'expires_at')) {
                $table->timestamp('expires_at')->nullable();
            }
            if (!Schema::hasColumn('password_resets', 'created_at')) {
                $table->timestamp('created_at')->nullable();
            }
            if (!Schema::hasColumn('password_resets', 'updated_at')) {
                $table->timestamp('updated_at')->nullable();
            }
        });

        // Add unique index on token if not present
        try {
            Schema::table('password_resets', function (Blueprint $table) {
                $table->unique('token', 'password_resets_token_unique');
            });
        } catch (\Throwable $e) {
            // ignore if index already exists
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        if (!Schema::hasTable('password_resets')) {
            return;
        }

        Schema::table('password_resets', function (Blueprint $table) {
            if (Schema::hasColumn('password_resets', 'code')) {
                $table->dropColumn('code');
            }
            if (Schema::hasColumn('password_resets', 'token')) {
                $table->dropUnique('password_resets_token_unique');
                $table->dropColumn('token');
            }
            if (Schema::hasColumn('password_resets', 'account_type')) {
                $table->dropColumn('account_type');
            }
            if (Schema::hasColumn('password_resets', 'expires_at')) {
                $table->dropColumn('expires_at');
            }
            // do not drop timestamps in down to avoid losing metadata
        });
    }
};

