<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use App\Models\AdminAccount;
use App\Models\StaffAccount;
use App\Models\PatientAccount;

class AccountSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create admin account
        AdminAccount::create([
            'email' => 'admin@example.com',
            'password' => Hash::make('12345678'),
            'first_name' => 'Admin',
            'last_name' => 'User',
            'phone' => '1234567890',
            'role' => 'admin',
            'status' => 'active'
        ]);

        // Create staff account
        StaffAccount::create([
            'email' => 'staff@example.com',
            'password' => Hash::make('12345678'),
            'first_name' => 'Staff',
            'last_name' => 'User',
            'phone' => '1234567891',
            'position' => 'Midwife',
            'department' => 'Maternity',
            'status' => 'active'
        ]);

        // Create patient account
        PatientAccount::create([
            'email' => 'patient@example.com',
            'password' => Hash::make('12345678'),
            'first_name' => 'Patient',
            'last_name' => 'User',
            'phone' => '1234567892',
            'birth_date' => '1990-01-01',
            'address' => '123 Main St, City',
            'status' => 'active'
        ]);
    }
}
