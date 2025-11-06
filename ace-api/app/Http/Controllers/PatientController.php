<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;
use App\Models\PatientAccount;

class PatientController extends Controller
{
    public function registerAccount(Request $request)
    {
        $request->validate([
            'lastName' => 'required|string|max:255',
            'firstName' => 'required|string|max:255',
            'middleInitial' => 'required|string|max:1',
            'email' => 'required|email|unique:patient_acc,email',
            'password' => 'required|string|min:8'
        ]);

        try {
            // Generate patient_id (you can customize this logic)
            $patientId = DB::table('patient_acc')->max('patient_id') + 1;

            $patient = PatientAccount::create([
                'patient_id' => $patientId,
                'last_name' => $request->lastName,
                'first_name' => $request->firstName,
                'middle_ini' => $request->middleInitial,
                'email' => $request->email,
                'password' => Hash::make($request->password),
                'date_created' => now()
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Patient account created successfully',
                'patient_id' => $patientId,
                'patient' => [
                    'id' => $patient->patient_id,
                    'name' => $patient->first_name . ' ' . $patient->last_name,
                    'email' => $patient->email
                ]
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to create patient account: ' . $e->getMessage()
            ], 500);
        }
    }

    public function registerInfo(Request $request)
    {
        $request->validate([
            'patient_id' => 'required|integer',
            'lastName' => 'required|string|max:255',
            'firstName' => 'required|string|max:255',
            'middleName' => 'required|string|max:255',
            'dob' => 'required|date',
            'address' => 'required|string|max:255',
            'province' => 'required|string|max:255',
            'nationality' => 'required|string|max:255',
            'contact' => 'required|string|max:20',
            'emergencyContact' => 'required|string|max:20',
            'fatherName' => 'required|string|max:255',
            'fatherContact' => 'required|string|max:20',
            'fatherOccupation' => 'required|string|max:255',
            'fatherAddress' => 'required|string|max:255',
            'motherName' => 'required|string|max:255',
            'motherContact' => 'required|string|max:20',
            'motherOccupation' => 'required|string|max:255',
            'motherAddress' => 'required|string|max:255',
            'spouseName' => 'nullable|string|max:255',
            'spouseContact' => 'nullable|string|max:20',
            'spouseOccupation' => 'nullable|string|max:255'
        ]);

        try {
            // Generate info_id
            $infoId = DB::table('patient_info')->max('info_id') + 1;

            DB::table('patient_info')->insert([
                'info_id' => $infoId,
                'patient_id' => $request->patient_id,
                'last_name' => $request->lastName,
                'first_name' => $request->firstName,
                'middle_ini' => $request->middleName,
                'bday' => $request->dob,
                'address' => $request->address,
                'province' => $request->province,
                'nationality' => $request->nationality,
                'contact' => $request->contact,
                'emergency' => $request->emergencyContact,
                'fathers_name' => $request->fatherName,
                'fathers_con' => $request->fatherContact,
                'fathers_ocu' => $request->fatherOccupation,
                'fathers_add' => $request->fatherAddress,
                'mother_name' => $request->motherName,
                'mother_con' => $request->motherContact,
                'mother_ocu' => $request->motherOccupation,
                'mother_add' => $request->motherAddress,
                'spouse_name' => $request->spouseName,
                'spouse_contact' => $request->spouseContact,
                'spouse_ocu' => $request->spouseOccupation
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Patient information saved successfully',
                'info_id' => $infoId
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to save patient information: ' . $e->getMessage()
            ], 500);
        }
    }

    public function getAllPatients()
    {
        try {
            $patients = DB::table('patient_acc')
                ->select('patient_id', 'last_name', 'first_name', 'middle_ini', 'email', 'date_created')
                ->orderBy('date_created', 'desc')
                ->get();

            return response()->json([
                'success' => true,
                'patients' => $patients
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch patients: ' . $e->getMessage()
            ], 500);
        }
    }

    public function getPatientInfo($id)
    {
        try {
            $patient = DB::table('patient_info')
                ->where('patient_id', $id)
                ->first();

            if (!$patient) {
                return response()->json([
                    'success' => false,
                    'message' => 'Patient information not found'
                ], 404);
            }

            return response()->json([
                'success' => true,
                'patient' => $patient
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch patient information: ' . $e->getMessage()
            ], 500);
        }
    }

    public function updatePatientInfo(Request $request, $id)
    {
        $request->validate([
            'lastName' => 'required|string|max:255',
            'firstName' => 'required|string|max:255',
            'middleName' => 'required|string|max:255',
            'dob' => 'required|date',
            'address' => 'required|string|max:255',
            'province' => 'required|string|max:255',
            'nationality' => 'required|string|max:255',
            'contact' => 'required|string|max:20',
            'emergencyContact' => 'required|string|max:20',
            'fatherName' => 'required|string|max:255',
            'fatherContact' => 'required|string|max:20',
            'fatherOccupation' => 'required|string|max:255',
            'fatherAddress' => 'required|string|max:255',
            'motherName' => 'required|string|max:255',
            'motherContact' => 'required|string|max:20',
            'motherOccupation' => 'required|string|max:255',
            'motherAddress' => 'required|string|max:255',
            'spouseName' => 'nullable|string|max:255',
            'spouseContact' => 'nullable|string|max:20',
            'spouseOccupation' => 'nullable|string|max:255'
        ]);

        try {
            DB::table('patient_info')
                ->where('patient_id', $id)
                ->update([
                    'last_name' => $request->lastName,
                    'first_name' => $request->firstName,
                    'middle_ini' => $request->middleName,
                    'bday' => $request->dob,
                    'address' => $request->address,
                    'province' => $request->province,
                    'nationality' => $request->nationality,
                    'contact' => $request->contact,
                    'emergency' => $request->emergencyContact,
                    'fathers_name' => $request->fatherName,
                    'fathers_con' => $request->fatherContact,
                    'fathers_ocu' => $request->fatherOccupation,
                    'fathers_add' => $request->fatherAddress,
                    'mother_name' => $request->motherName,
                    'mother_con' => $request->motherContact,
                    'mother_ocu' => $request->motherOccupation,
                    'mother_add' => $request->motherAddress,
                    'spouse_name' => $request->spouseName,
                    'spouse_contact' => $request->spouseContact,
                    'spouse_ocu' => $request->spouseOccupation
                ]);

            return response()->json([
                'success' => true,
                'message' => 'Patient information updated successfully'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to update patient information: ' . $e->getMessage()
            ], 500);
        }
    }

    public function getMonthlyPatients()
    {
        try {
            $monthlyPatients = DB::table('patient_acc')
                ->select(
                    DB::raw('EXTRACT(MONTH FROM date_created) as month'),
                    DB::raw('COUNT(*) as count')
                )
                ->whereYear('date_created', now()->year)
                ->groupBy(DB::raw('EXTRACT(MONTH FROM date_created)'))
                ->orderBy(DB::raw('EXTRACT(MONTH FROM date_created)'))
                ->get();

            // Format data for chart
            $months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
            $formattedData = [];
            
            foreach ($months as $index => $month) {
                $monthData = $monthlyPatients->where('month', $index + 1)->first();
                $formattedData[] = [
                    'month' => $month,
                    'patients' => $monthData ? $monthData->count : 0
                ];
            }

            return response()->json([
                'success' => true,
                'data' => $formattedData
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch monthly patients: ' . $e->getMessage()
            ], 500);
        }
    }
}
