<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use App\Models\PatientAccount;
use App\Models\StaffAccount;
use App\Models\AdminAccount;

class AuthController extends Controller
{
    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|string',
            'password' => 'required|string'
        ]);

        $email = $request->email;
        $password = $request->password;

        // Check admin accounts first (Admin Name field)
        $admin = AdminAccount::where('Admin Name', $email)->first();

        if ($admin && Hash::check($password, $admin->password)) {
            return response()->json([
                'success' => true,
                'message' => 'Login successful',
                'user' => [
                    'id' => $admin->id,
                    'email' => $admin->{'Admin Name'},
                    'name' => $admin->{'Admin Name'},
                    'role' => 'admin',
                    'type' => 'admin'
                ]
            ]);
        }

        // Check patient accounts
        $patient = PatientAccount::where('email', $email)->first();

        if ($patient && Hash::check($password, $patient->password)) {
            return response()->json([
                'success' => true,
                'message' => 'Login successful',
                'user' => [
                    'id' => $patient->patient_id,
                    'email' => $patient->email,
                    'name' => $patient->first_name . ' ' . $patient->last_name,
                    'role' => 'patient',
                    'type' => 'patient'
                ]
            ]);
        }

        // Check staff accounts by Name (supports "First Last" or "Last, First"),
        // with fallback to staff_id for backward compatibility.
        $normalized = trim($email);
        $normalizedLower = mb_strtolower(preg_replace('/\s+/', ' ', $normalized));

        $staff = StaffAccount::whereRaw("LOWER(CONCAT(staffs_firs, ' ', staffs_sur)) = ?", [$normalizedLower])->first();

        if (!$staff) {
            // Try "Last, First" format
            $staff = StaffAccount::whereRaw("LOWER(CONCAT(staffs_sur, ', ', staffs_firs)) = ?", [$normalizedLower])->first();
        }

        if (!$staff) {
            // Fallback: allow legacy login using staff_id entered in the username field
            $staff = StaffAccount::where('staff_id', $normalized)->first();
        }

        if ($staff && Hash::check($password, $staff->password)) {
            return response()->json([
                'success' => true,
                'message' => 'Login successful',
                'user' => [
                    'id' => $staff->staff_id,
                    'email' => $staff->email ?? $staff->staff_id,
                    'name' => $staff->staffs_firs . ' ' . $staff->staffs_sur,
                    'role' => 'staff',
                    'type' => 'staff',
                    'position' => $staff->position
                ]
            ]);
        }

        return response()->json([
            'success' => false,
            'message' => 'Invalid credentials'
        ], 401);
    }
}
