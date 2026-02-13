<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Training_Report;

class TrainingReportController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $reports = Training_Report::with('student.user', 'request.company', 'request.supervisor.user')->get();
        return response()->json($reports);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
         $request->validate([
            'request_id' => 'required|exists:training_requests,request_id',
            'student_id' => 'required|exists:students,id',
            'report_number' => 'required|integer',
            'project_description' => 'nullable|string',
            'total_hours' => 'required|integer',
            'overall_evaluation' => 'nullable|string',
            'student_reflection' => 'nullable|string',
            'submission_date' => 'required|date',
            'supervisor_review_date' => 'nullable|date|after_or_equal:submission_date'
        ]);

        $report = Training_Report::create($request->all());
        return response()->json($report, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
          $report = Training_Report::with('student.user', 'request.company', 'request.supervisor.user')->find($id);
        if(!$report){
            return response()->json(['message'=>'Training Report not found'],404);
        }
        return response()->json($report);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
           $report = Training_Report::find($id);
        if(!$report){
            return response()->json(['message'=>'Training Report not found'],404);
        }

        $request->validate([
            'report_number' => 'sometimes|integer',
            'project_description' => 'nullable|string',
            'total_hours' => 'sometimes|integer',
            'overall_evaluation' => 'nullable|string',
            'student_reflection' => 'nullable|string',
            'submission_date' => 'sometimes|date',
            'supervisor_review_date' => 'nullable|date|after_or_equal:submission_date'
        ]);

        $report->update($request->all());
        return response()->json($report);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
         $report = Training_Report::find($id);
        if(!$report){
            return response()->json(['message'=>'Training Report not found'],404);
        }

        $report->delete();
        return response()->json(['message'=>'Training Report deleted successfully']);
    }
}
