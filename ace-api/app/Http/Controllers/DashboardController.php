<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class DashboardController extends Controller
{
    public function getMonthlyPatients()
    {
        try {
            $monthlyPatients = DB::table('patient_acc')
                ->select(
                    DB::raw("TO_CHAR(date_created, 'Mon') as month"),
                    DB::raw('COUNT(*) as patients'),
                    DB::raw('EXTRACT(MONTH FROM date_created) as month_num')
                )
                ->groupBy(DB::raw("TO_CHAR(date_created, 'Mon')"))
                ->groupBy(DB::raw('EXTRACT(MONTH FROM date_created)'))
                ->orderBy(DB::raw('EXTRACT(MONTH FROM date_created)'))
                ->get();

            return response()->json([
                'success' => true,
                'data' => $monthlyPatients
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch monthly patients: ' . $e->getMessage()
            ], 500);
        }
    }

    public function getMonthlyCheckups()
    {
        try {
            $monthlyCheckups = DB::table('checkup_records')
                ->select(
                    DB::raw("TO_CHAR(date, 'Mon') as month"),
                    DB::raw('COUNT(*) as checkups'),
                    DB::raw('EXTRACT(MONTH FROM date) as month_num')
                )
                ->groupBy(DB::raw("TO_CHAR(date, 'Mon')"))
                ->groupBy(DB::raw('EXTRACT(MONTH FROM date)'))
                ->orderBy(DB::raw('EXTRACT(MONTH FROM date)'))
                ->get();

            return response()->json([
                'success' => true,
                'data' => $monthlyCheckups
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch monthly checkups: ' . $e->getMessage()
            ], 500);
        }
    }

    public function getCheckupTypes()
    {
        try {
            $checkupTypes = DB::table('checkup_records')
                ->select(
                    'record_type as label',
                    DB::raw('COUNT(*) as value')
                )
                ->groupBy('record_type')
                ->get();

            return response()->json([
                'success' => true,
                'data' => $checkupTypes
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch checkup types: ' . $e->getMessage()
            ], 500);
        }
    }
}