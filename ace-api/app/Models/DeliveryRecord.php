<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Support\Facades\Schema;

class DeliveryRecord extends Model
{
    use HasFactory;

    public $incrementing = false;

    protected $fillable = [
        'patient_id',
        'delivery_date_time',
        'delivery_type',
        'complications',
    ];

    public function getKeyName()
    {
        $table = $this->getTable();
        if (Schema::hasColumn($table, 'id')) {
            return 'id';
        }
        if (Schema::hasColumn($table, 'delivery_id')) {
            return 'delivery_id';
        }
        if (Schema::hasColumn($table, 'delivery_record_id')) {
            return 'delivery_record_id';
        }
        return parent::getKeyName();
    }
}
