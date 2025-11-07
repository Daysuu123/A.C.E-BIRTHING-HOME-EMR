<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\PregnancyHistory;
use Illuminate\Http\Request;

class PregnancyHistoryController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    // ... existing code ...

    public function index()
    {
        return PregnancyHistory::all();
    }

// ... existing code ...

    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'patient_id' => 'required|exists:patient_acc,id',
            'gravida' => 'required|integer',
            'para' => 'required|integer',
            'full_term_pregnancies' => 'required|integer',
            'preterm_deliveries' => 'required|integer',
            'abortions' => 'required|integer',
            'living_children' => 'required|integer',
            'last_menstrual_period' => 'required|date',
        ]);

        $pregnancyHistory = PregnancyHistory::create($validatedData);

        return response()->json($pregnancyHistory, 201);
    }

// ... existing code ...

    public function show(string $id)
    {
        return PregnancyHistory::findOrFail($id);
    }

// ... existing code ...

    public function update(Request $request, string $id)
    {
        $pregnancyHistory = PregnancyHistory::findOrFail($id);

        $validatedData = $request->validate([
            'patient_id' => 'required|exists:patient_acc,id',
            'gravida' => 'required|integer',
            'para' => 'required|integer',
            'full_term_pregnancies' => 'required|integer',
            'preterm_deliveries' => 'required|integer',
            'abortions' => 'required|integer',
            'living_children' => 'required|integer',
            'last_menstrual_period' => 'required|date',
        ]);

        $pregnancyHistory->update($validatedData);

        return response()->json($pregnancyHistory, 200);
    }

// ... existing code ...

    public function destroy(string $id)
    {
        PregnancyHistory::destroy($id);

        return response()->json(null, 204);
    }
}
