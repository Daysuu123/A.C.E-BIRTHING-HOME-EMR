<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\PregnancyHistory;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

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
            'patient_id' => 'required|integer',
            'gravida' => 'required|integer',
            'para' => 'required|integer',
            'full_term_pregnancies' => 'required|integer',
            'preterm_deliveries' => 'required|integer',
            'abortions' => 'required|integer',
            'living_children' => 'required|integer',
            'last_menstrual_period' => 'required|date',
        ]);

        // Accept patient_id from either 'id' or 'patient_id' column in patient_acc
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
            'patient_id' => 'required|integer',
            'gravida' => 'required|integer',
            'para' => 'required|integer',
            'full_term_pregnancies' => 'required|integer',
            'preterm_deliveries' => 'required|integer',
            'abortions' => 'required|integer',
            'living_children' => 'required|integer',
            'last_menstrual_period' => 'required|date',
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
