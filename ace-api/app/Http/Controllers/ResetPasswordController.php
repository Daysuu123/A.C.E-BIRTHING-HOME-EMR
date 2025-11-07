<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Str;
use Carbon\Carbon;
use App\Mail\ResetPasswordMail;
use App\Models\PatientAccount;
use App\Models\StaffAccount;
use App\Models\AdminAccount;

class ResetPasswordController extends Controller
{
    public function sendResetCode(Request $request)
    {
        $request->validate([
            'email' => 'required|email'
        ]);

        $email = trim($request->email);

        // Find account by email (patients or staff). Admin may not have email.
        $accountType = null;
        $user = PatientAccount::where('email', $email)->first();
        if ($user) {
            $accountType = 'patient';
        } else {
            $user = StaffAccount::where('email', $email)->first();
            if ($user) {
                $accountType = 'staff';
            }
        }

        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'Email not found.'
            ], 404);
        }

        $code = str_pad((string)random_int(0, 999999), 6, '0', STR_PAD_LEFT);
        $token = Str::random(64);
        $expiresAt = Carbon::now()->addMinutes(15);

        // Upsert password reset record
        DB::table('password_resets')->updateOrInsert(
            ['email' => $email],
            [
                'code' => $code,
                'token' => $token,
                'account_type' => $accountType,
                'expires_at' => $expiresAt,
                'updated_at' => Carbon::now(),
                'created_at' => Carbon::now(),
            ]
        );

        try {
            Mail::to($email)->send(new ResetPasswordMail($code, $expiresAt));
        } catch (\Throwable $mailEx) {
            // Log but still return success to not block dev
            \Log::error('Failed to send reset mail: ' . $mailEx->getMessage());
        }

        return response()->json([
            'success' => true,
            'message' => 'Reset code sent to your email.'
        ]);
    }

    public function confirmResetCode(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'code' => 'required|string'
        ]);

        $email = trim($request->email);
        $code = trim($request->code);

        $row = DB::table('password_resets')->where('email', $email)->where('code', $code)->first();
        if (!$row) {
            return response()->json([
                'success' => false,
                'message' => 'Invalid code.'
            ], 422);
        }
        if (Carbon::parse($row->expires_at)->isPast()) {
            return response()->json([
                'success' => false,
                'message' => 'Code expired.'
            ], 422);
        }

        return response()->json([
            'success' => true,
            'message' => 'Code verified.',
            'token' => $row->token,
        ]);
    }

    public function changePassword(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'token' => 'required|string',
            'newPassword' => 'required|string|min:8'
        ]);

        $email = trim($request->email);
        $token = trim($request->token);
        $newPassword = $request->newPassword;

        $row = DB::table('password_resets')->where('email', $email)->where('token', $token)->first();
        if (!$row) {
            return response()->json([
                'success' => false,
                'message' => 'Invalid or expired token.'
            ], 422);
        }
        if (Carbon::parse($row->expires_at)->isPast()) {
            return response()->json([
                'success' => false,
                'message' => 'Token expired.'
            ], 422);
        }

        // Update password in appropriate account table
        $updated = false;
        $patient = PatientAccount::where('email', $email)->first();
        if ($patient) {
            $patient->password = Hash::make($newPassword);
            $patient->save();
            $updated = true;
        } else {
            $staff = StaffAccount::where('email', $email)->first();
            if ($staff) {
                $staff->password = Hash::make($newPassword);
                $staff->save();
                $updated = true;
            }
        }

        if (!$updated) {
            return response()->json([
                'success' => false,
                'message' => 'Account not found for this email.'
            ], 404);
        }

        // Clean up reset record
        DB::table('password_resets')->where('email', $email)->delete();

        return response()->json([
            'success' => true,
            'message' => 'Password changed successfully.'
        ]);
    }
}
