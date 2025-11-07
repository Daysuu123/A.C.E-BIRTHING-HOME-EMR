<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class PatientAccount extends Authenticatable
{
    use Notifiable, HasFactory;

    protected $table = 'patient_acc';
    protected $primaryKey = 'patient_id';
    public $incrementing = false;
    protected $keyType = 'integer';
    public $timestamps = false;

    // Allow mass assignment for existing legacy columns
    protected $guarded = [];

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
