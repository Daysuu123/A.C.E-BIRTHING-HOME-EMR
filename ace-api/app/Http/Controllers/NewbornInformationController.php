<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\NewbornInformation;
use Illuminate\Http\Request;

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
            'patient_id' => 'required|exists:patient_acc,id',
            'delivery_record_id' => 'required|exists:delivery_records,id',
            'gender' => 'required|string',
            'weight' => 'required|numeric',
            'length' => 'required|numeric',
            'complications' => 'nullable|string',
        ]);

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
            'patient_id' => 'required|exists:patient_acc,id',
            'delivery_record_id' => 'required|exists:delivery_records,id',
            'gender' => 'required|string',
            'weight' => 'required|numeric',
            'length' => 'required|numeric',
            'complications' => 'nullable|string',
        ]);

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
