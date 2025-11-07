<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Support\Facades\Schema;

class NewbornInformation extends Model
{
    use HasFactory;

    public $incrementing = false;

    protected $fillable = [
        'patient_id',
        'delivery_record_id',
        'gender',
        'weight',
        'length',
        'complications',
    ];

    public function getKeyName()
    {
        $table = $this->getTable();
        if (Schema::hasColumn($table, 'id')) {
            return 'id';
        }
        if (Schema::hasColumn($table, 'newborn_information_id')) {
            return 'newborn_information_id';
        }
        return parent::getKeyName();
    }
}
