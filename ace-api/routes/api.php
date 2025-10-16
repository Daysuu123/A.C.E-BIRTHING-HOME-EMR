<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\PatientController;

Route::post('/login', [AuthController::class, 'login']);

// Patient routes
Route::post('/patients/register-account', [PatientController::class, 'registerAccount']);
Route::post('/patients/register-info', [PatientController::class, 'registerInfo']);
Route::get('/patients', [PatientController::class, 'getAllPatients']);
Route::get('/patients/{id}/info', [PatientController::class, 'getPatientInfo']);
Route::put('/patients/{id}/info', [PatientController::class, 'updatePatientInfo']);



