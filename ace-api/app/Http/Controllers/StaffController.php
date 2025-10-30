<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\DB;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Carbon\Carbon; // added

class StaffController extends Controller
{
    public function getAllStaff()
    {
        try {
            $staff = DB::table('staffs_account')
                ->select(
                    'staff_id',
                    'staffs_firs',
                    'staffs_sur',
                    'position',
                    'date_created' // return raw timestamp to PHP
                )
                ->orderBy('staff_id', 'asc')
                ->get()
                ->map(function ($row) {
                    // format in PHP to avoid SQL type mismatches
                    $row->date_created = $row->date_created
                        ? Carbon::parse($row->date_created)->format('m/d/Y')
                        : null; // or 'N/A' if you prefer a string
                    return $row;
                });

            return response()->json([
                'success' => true,
                'staff' => $staff
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch staff: ' . $e->getMessage()
            ], 500);
        }
    }

    public function register(Request $request)
    {
        $request->validate([
            'firstName' => 'required|string|max:255',
            'lastName' => 'required|string|max:255',
            'middleInitial' => 'required|string|max:1',
            'position' => 'required|string|max:255',
            'password' => 'required|string|min:4'
        ]);

        try {
            $nextId = (int) (DB::table('staffs_account')->max('staff_id') ?? 0) + 1;
            DB::table('staffs_account')->insert([
                'staff_id' => $nextId,
                'staffs_firs' => $request->firstName,
                'staffs_sur' => $request->lastName,
                'staffs_mi' => $request->middleInitial,
                'position' => $request->position,
                'password' => Hash::make($request->password),
                'date_created' => now(),
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Staff account created successfully',
                'staff' => [
                    'staff_id' => $nextId,
                    'staffs_firs' => $request->firstName,
                    'staffs_sur' => $request->lastName,
                    'position' => $request->position,
                ]
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to create staff: ' . $e->getMessage(),
            ], 500);
        }
    }

    public function update(Request $request, $id)
    {
        $request->validate([
            'firstName' => 'required|string|max:255',
            'lastName' => 'required|string|max:255',
            'middleInitial' => 'required|string|max:1',
            'position' => 'required|string|max:255',
        ]);

        try {
            DB::table('staffs_account')
                ->where('staff_id', $id)
                ->update([
                    'staffs_firs' => $request->firstName,
                    'staffs_sur' => $request->lastName,
                    'staffs_mi' => $request->middleInitial,
                    'position' => $request->position,
                ]);
            return response()->json(['success' => true, 'message' => 'Staff updated']);
        } catch (\Exception $e) {
            return response()->json(['success' => false, 'message' => 'Failed to update staff: ' . $e->getMessage()], 500);
        }
    }

    public function destroy($id)
    {
        try {
            DB::table('staffs_account')->where('staff_id', $id)->delete();
            return response()->json(['success' => true, 'message' => 'Staff deleted']);
        } catch (\Exception $e) {
            return response()->json(['success' => false, 'message' => 'Failed to delete staff: ' . $e->getMessage()], 500);
        }
    }
}


