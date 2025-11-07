<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PregnancyHistory extends Model
{
    use HasFactory;

    public $incrementing = false;

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

    public function getKeyName()
    {
        $table = $this->getTable();
        // Prefer conventional 'id' if present; otherwise fallback to 'pregnancy_history_id'
        if (\Illuminate\Support\Facades\Schema::hasColumn($table, 'id')) {
            return 'id';
        }
        if (\Illuminate\Support\Facades\Schema::hasColumn($table, 'pregnancy_history_id')) {
            return 'pregnancy_history_id';
        }
        return parent::getKeyName();
    }
}
