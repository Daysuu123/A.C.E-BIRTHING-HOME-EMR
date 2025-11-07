<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class PatientAccount extends Authenticatable
{
    use Notifiable;

    protected $table = 'patient_acc';
    protected $primaryKey = 'patient_id';
    public $incrementing = false;
    protected $keyType = 'string';
    public $timestamps = false;

    protected $fillable = [
        'patient_id',
        'email',
        'password',
        'first_name',
        'last_name',
        'middle_ini',
        'date_created',
        'email_verification_token',
        'email_verified_at',
        'is_email_verified'
    ];

    protected $hidden = [
        'password',
    ];

    protected function casts(): array
    {
        return [
            'password' => 'hashed',
            'date_created' => 'datetime',
        ];
    }
}
