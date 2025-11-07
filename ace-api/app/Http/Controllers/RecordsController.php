<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class RecordsController extends Controller
{
    public function index()
    {
        try {
            $rows = DB::table('checkup_records')
                ->leftJoin('staffs_account', 'staffs_account.staff_id', '=', 'checkup_records.attending_staff')
                ->select(
                    'checkup_records.record_id',
                    'checkup_records.patient_name',
                    'checkup_records.record_type',
                    'checkup_records.date',
                    'checkup_records.attending_staff',
                    DB::raw("COALESCE(staffs_account.staffs_sur || ', ' || staffs_account.staffs_firs, '') as attending_staff_name"),
                    'checkup_records.notes',
                    'checkup_records.outcome'
                )
                ->orderBy('checkup_records.date', 'desc')
                ->get();

            return response()->json(['success' => true, 'records' => $rows]);
        } catch (\Exception $e) {
            return response()->json(['success' => false, 'message' => 'Failed to fetch records: ' . $e->getMessage()], 500);
        }
    }

    public function store(Request $request)
    {
        $request->validate([
            'patient_name' => 'required|string|max:255',
            'record_type' => 'required|string|max:50',
            'date' => 'required|date',
            'attending_staff' => 'required|integer',
            'notes' => 'nullable|string',
            'outcome' => 'nullable|string',
        ]);

        try {
            $nextId = (int) (DB::table('checkup_records')->max('record_id') ?? 0) + 1;
            DB::table('checkup_records')->insert([
                'record_id' => $nextId,
                'patient_name' => $request->patient_name,
                'record_type' => $request->record_type,
                'date' => $request->date,
                'attending_staff' => $request->attending_staff,
                'notes' => $request->notes,
                'outcome' => $request->outcome,
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Record created',
                'id' => $nextId,
            ]);
        } catch (\Exception $e) {
            return response()->json(['success' => false, 'message' => 'Failed to create record: ' . $e->getMessage()], 500);
        }
    }

    public function update(Request $request, $id)
    {
        $request->validate([
            'patient_name' => 'required|string|max:255',
            'record_type' => 'required|string|max:50',
            'date' => 'required|date',
            'attending_staff' => 'required|integer',
            'notes' => 'nullable|string',
            'outcome' => 'nullable|string',
        ]);

        try {
            DB::table('checkup_records')
                ->where('record_id', $id)
                ->update([
                    'patient_name' => $request->patient_name,
                    'record_type' => $request->record_type,
                    'date' => $request->date,
                    'attending_staff' => $request->attending_staff,
                    'notes' => $request->notes,
                    'outcome' => $request->outcome,
                ]);

            return response()->json(['success' => true, 'message' => 'Record updated']);
        } catch (\Exception $e) {
            return response()->json(['success' => false, 'message' => 'Failed to update record: ' . $e->getMessage()], 500);
        }
    }

    public function destroy($id)
    {
        try {
            DB::table('checkup_records')->where('record_id', $id)->delete();
            return response()->json(['success' => true, 'message' => 'Record deleted']);
        } catch (\Exception $e) {
            return response()->json(['success' => false, 'message' => 'Failed to delete record: ' . $e->getMessage()], 500);
        }
    }
}


