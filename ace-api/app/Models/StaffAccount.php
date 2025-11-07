<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class StaffAccount extends Authenticatable
{
    use Notifiable;

    protected $table = 'staffs_account';
    protected $primaryKey = 'staff_id';
    public $incrementing = false;
    protected $keyType = 'string';
    public $timestamps = false;

    protected $fillable = [
        'staff_id',
        'password',
        'staffs_firs',
        'staffs_sur',
        'staffs_mi',
        'position',
        'email',
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
        ];
    }
}
