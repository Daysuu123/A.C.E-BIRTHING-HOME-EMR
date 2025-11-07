<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class PatientAccount extends Authenticatable
{
    use Notifiable, HasFactory;

    protected $table = 'patient_acc';
    // Use default incrementing integer primary key 'id' with timestamps
    // so tests and controllers referencing 'id' work correctly.
    protected $fillable = [
        'email',
        'password',
        'role',
        'first_name',
        'last_name',
        'phone',
        'birth_date',
        'address',
    ];

    protected $hidden = [
        'password',
    ];

    protected function casts(): array
    {
        return [
            'password' => 'hashed',
        ];
    }
}
