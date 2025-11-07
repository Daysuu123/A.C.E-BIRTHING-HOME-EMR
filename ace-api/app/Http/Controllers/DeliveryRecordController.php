<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\DeliveryRecord;
use Illuminate\Http\Request;

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
            'patient_id' => 'required|exists:patient_acc,id',
            'delivery_date_time' => 'required|date',
            'delivery_type' => 'required|string',
            'complications' => 'nullable|string',
        ]);

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
            'patient_id' => 'required|exists:patient_acc,id',
            'delivery_date_time' => 'required|date',
            'delivery_type' => 'required|string',
            'complications' => 'nullable|string',
        ]);

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
