<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\PatientController;
use App\Http\Controllers\StaffController;
use App\Http\Controllers\RecordsController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\PregnancyHistoryController;
use App\Http\Controllers\DeliveryRecordController;
use App\Http\Controllers\NewbornInformationController;
use App\Http\Controllers\ResetPasswordController;

// Resource routes
Route::apiResource('pregnancy-histories', PregnancyHistoryController::class);
Route::apiResource('delivery-records', DeliveryRecordController::class);
Route::apiResource('newborn-information', NewbornInformationController::class);

Route::post('/login', [AuthController::class, 'login']);

// Auth password reset routes
Route::post('/auth/send-reset-code', [ResetPasswordController::class, 'sendResetCode']);
Route::post('/auth/confirm-reset-code', [ResetPasswordController::class, 'confirmResetCode']);
Route::post('/auth/change-password', [ResetPasswordController::class, 'changePassword']);

// Test route
Route::get('/test', function() {
    return response()->json(['message' => 'API is working']);
});

// Patient routes
Route::post('/patients/register-account', [PatientController::class, 'registerAccount']);
Route::post('/patients/register-info', [PatientController::class, 'registerInfo']);
Route::get('/patients/verify-email/{token}', [PatientController::class, 'verifyEmail']);
Route::get('/patients', [PatientController::class, 'getAllPatients']);
Route::get('/patients/{id}/info', [PatientController::class, 'getPatientInfo']);
Route::put('/patients/{id}/info', [PatientController::class, 'updatePatientInfo']);

// Staff routes
Route::get('/staffs', [StaffController::class, 'getAllStaff']);
Route::post('/staffs/register', [StaffController::class, 'register']);
Route::get('/staffs/verify-email/{token}', [StaffController::class, 'verifyEmail']);
Route::put('/staffs/{id}', [StaffController::class, 'update']);
Route::delete('/staffs/{id}', [StaffController::class, 'destroy']);

// Records routes
Route::get('/records', [RecordsController::class, 'index']);
Route::post('/records', [RecordsController::class, 'store']);
Route::put('/records/{id}', [RecordsController::class, 'update']);
Route::delete('/records/{id}', [RecordsController::class, 'destroy']);

// Dashboard routes
Route::get('/dashboard/monthly-patients', [DashboardController::class, 'getMonthlyPatients']);
Route::get('/dashboard/monthly-checkups', [DashboardController::class, 'getMonthlyCheckups']);
Route::get('/dashboard/checkup-types', [DashboardController::class, 'getCheckupTypes']);





