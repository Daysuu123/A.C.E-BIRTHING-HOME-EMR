<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PregnancyHistory extends Model
{
    use HasFactory;

    protected $fillable = [
        'patient_id',
        'gravida',
        'para',
        'full_term_pregnancies',
        'preterm_deliveries',
        'abortions',
        'living_children',
        'last_menstrual_period',
    ];
}
