<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::post('/login', function (Request $request) {
    $email = (string) $request->input('email', '');
    $password = (string) $request->input('password', '');

    // Simple demo auth; replace with real logic/controller
    if ($email === 'admin@example.com' && $password === '12345678') {
        return response()->json([
            'success' => true,
            'message' => 'Login successful',
            'user' => ['email' => $email, 'role' => 'admin'],
        ]);
    }

    return response()->json([
        'success' => false,
        'message' => 'Invalid credentials',
    ], 401);
});



