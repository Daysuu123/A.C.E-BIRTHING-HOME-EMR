<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\NewbornInformation;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

class NewbornInformationController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    // ... existing code ...

    public function index()
    {
        return NewbornInformation::all();
    }

// ... existing code ...

    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'patient_id' => 'required|integer',
            'delivery_record_id' => 'required|integer',
            'gender' => 'required|string',
            'weight' => 'required|numeric',
            'length' => 'required|numeric',
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

        $did = (int) $validatedData['delivery_record_id'];
        $deliveryQuery = DB::table('delivery_records');
        $hasDeliveryId = Schema::hasColumn('delivery_records', 'id');
        $hasDeliveryIdAlt = Schema::hasColumn('delivery_records', 'delivery_id');
        $hasDeliveryRecordId = Schema::hasColumn('delivery_records', 'delivery_record_id');
        if ($hasDeliveryId) {
            $deliveryQuery->orWhere('id', $did);
        }
        if ($hasDeliveryIdAlt) {
            $deliveryQuery->orWhere('delivery_id', $did);
        }
        if ($hasDeliveryRecordId) {
            $deliveryQuery->orWhere('delivery_record_id', $did);
        }
        $deliveryExists = ($hasDeliveryId || $hasDeliveryIdAlt || $hasDeliveryRecordId) ? $deliveryQuery->exists() : false;

        if (!$deliveryExists) {
            return response()->json(['message' => 'Invalid delivery_record_id'], 422);
        }

        $newbornInformation = NewbornInformation::create($validatedData);

        return response()->json($newbornInformation, 201);
    }

// ... existing code ...

    public function show(string $id)
    {
        return NewbornInformation::findOrFail($id);
    }

// ... existing code ...

    public function update(Request $request, string $id)
    {
        $newbornInformation = NewbornInformation::findOrFail($id);

        $validatedData = $request->validate([
            'patient_id' => 'required|integer',
            'delivery_record_id' => 'required|integer',
            'gender' => 'required|string',
            'weight' => 'required|numeric',
            'length' => 'required|numeric',
            'complications' => 'nullable|string',
        ]);

        $pid = (int) $validatedData['patient_id'];
        $patientQuery = DB::table('patient_acc');
        $hasId = Schema::hasColumn('patient_acc', 'id');
        $hasPatientId = Schema::hasColumn('patient_acc', 'patient_id');
        if ($hasId) {
            $patientQuery->orWhere('id', $pid);
        }
        if ($hasPatientId) {
            $patientQuery->orWhere('patient_id', $pid);
        }
        $patientExists = ($hasId || $hasPatientId) ? $patientQuery->exists() : false;

        if (!$patientExists) {
            return response()->json(['message' => 'Invalid patient_id'], 422);
        }

        $did = (int) $validatedData['delivery_record_id'];
        $deliveryQuery = DB::table('delivery_records');
        $hasDeliveryId = Schema::hasColumn('delivery_records', 'id');
        $hasDeliveryIdAlt = Schema::hasColumn('delivery_records', 'delivery_id');
        $hasDeliveryRecordId = Schema::hasColumn('delivery_records', 'delivery_record_id');
        if ($hasDeliveryId) {
            $deliveryQuery->orWhere('id', $did);
        }
        if ($hasDeliveryIdAlt) {
            $deliveryQuery->orWhere('delivery_id', $did);
        }
        if ($hasDeliveryRecordId) {
            $deliveryQuery->orWhere('delivery_record_id', $did);
        }
        $deliveryExists = ($hasDeliveryId || $hasDeliveryIdAlt || $hasDeliveryRecordId) ? $deliveryQuery->exists() : false;

        if (!$deliveryExists) {
            return response()->json(['message' => 'Invalid delivery_record_id'], 422);
        }

        $newbornInformation->update($validatedData);

        return response()->json($newbornInformation, 200);
    }

// ... existing code ...

    public function destroy(string $id)
    {
        NewbornInformation::destroy($id);

        return response()->json(null, 204);
    }
}
