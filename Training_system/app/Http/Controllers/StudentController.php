<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Student;

class StudentController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
         $students = Student::with('user', 'supervisor', 'training_Requests', 'training_Reports')->get();
        return response()->json([
            'status' => 'success',
            'data' => $students
        ]);
    }


    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
        'user_id' => 'required|exists:users,id|unique:students,user_id',
        'university_number' => 'required|unique:students',
        'major' => 'required|string',
        'academic_year' => 'required|string',
        'phone' => 'nullable|string',
        'gpa' => 'nullable|numeric|between:0,4',
        'completed_hours' => 'nullable|integer'
        ]);
        $student = Student::create($request->only([
            'user_id',
            'university_number',
            'major',
            'academic_year',
            'phone',
            'gpa',
            'completed_hours'
            ]));
            
              return response()->json([
                'status' => 'success',
                'data' => $student
                ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $student = Student::with('user', 'supervisor', 'trainingRequests.company', 'trainingReports')->find($id);
        if(!$student){
           return response()->json([
                'status' => 'error',
                'message' => 'Student not found'
                ], 404);
        }
         return response()->json([
            'status' => 'success',
            'data' => $student
            ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
         $student = Student::find($id);
         if (!$student) {
              return response()->json([
                'status' => 'error',
                'message' => 'Student not found'
                ], 404);
            }
               $request->validate([
                'university_number' => 'sometimes|unique:students,university_number,' . $id,
                'major' => 'sometimes|string',
                'academic_year' => 'sometimes|string',
                'phone' => 'nullable|string',
                'gpa' => 'nullable|numeric|between:0,4',
                'completed_hours' => 'nullable|integer'
                ]);
               $student->update($request->only([
                'university_number',
                'major',
                'academic_year',
                'phone',
                'gpa',
                'completed_hours'
                ]));

                  return response()->json([
                    'status' => 'success',
                    'data' => $student
                    ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $student = Student::find($id);
        if (!$student) {
        return response()->json([
            'status' => 'error',
            'message' => 'Student not found'
            ], 404);

        }
        $student->delete();
        return response()->json([
            'status' => 'success',
            'data' => $student
            ]);

    }
}
