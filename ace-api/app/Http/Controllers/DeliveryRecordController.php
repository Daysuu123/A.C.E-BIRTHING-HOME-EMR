<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\DeliveryRecord;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

class DeliveryRecordController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    // ... existing code ...

    public function index()
    {
        return DeliveryRecord::all();
    }

// ... existing code ...

    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'patient_id' => 'required|integer',
            'delivery_date_time' => 'required|date',
            'delivery_type' => 'required|string',
            'complications' => 'nullable|string',
        ]);

        $pid = (int) $validatedData['patient_id'];
        $query = DB::table('patient_acc');
        $hasId = Schema::hasColumn('patient_acc', 'id');
        $hasPatientId = Schema::hasColumn('patient_acc', 'patient_id');
        if ($hasId) {
            $query->orWhere('id', $pid);
        }
        if ($hasPatientId) {
            $query->orWhere('patient_id', $pid);
        }
        $patientExists = ($hasId || $hasPatientId) ? $query->exists() : false;

        if (!$patientExists) {
            return response()->json(['message' => 'Invalid patient_id'], 422);
        }

        $deliveryRecord = DeliveryRecord::create($validatedData);

        return response()->json($deliveryRecord, 201);
    }

// ... existing code ...

    public function show(string $id)
    {
        return DeliveryRecord::findOrFail($id);
    }

// ... existing code ...

    public function update(Request $request, string $id)
    {
        $deliveryRecord = DeliveryRecord::findOrFail($id);

        $validatedData = $request->validate([
            'patient_id' => 'required|integer',
            'delivery_date_time' => 'required|date',
            'delivery_type' => 'required|string',
            'complications' => 'nullable|string',
        ]);

        $pid = (int) $validatedData['patient_id'];
        $query = DB::table('patient_acc');
        $hasId = Schema::hasColumn('patient_acc', 'id');
        $hasPatientId = Schema::hasColumn('patient_acc', 'patient_id');
        if ($hasId) {
            $query->orWhere('id', $pid);
        }
        if ($hasPatientId) {
            $query->orWhere('patient_id', $pid);
        }
        $patientExists = ($hasId || $hasPatientId) ? $query->exists() : false;

        if (!$patientExists) {
            return response()->json(['message' => 'Invalid patient_id'], 422);
        }

        $deliveryRecord->update($validatedData);

        return response()->json($deliveryRecord, 200);
    }

// ... existing code ...

    public function destroy(string $id)
    {
        DeliveryRecord::destroy($id);

        return response()->json(null, 204);
    }
}
