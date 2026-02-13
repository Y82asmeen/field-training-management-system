<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Training_Request;

class TrainingRequestController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
         $requests = Training_Request::with('student.user', 'supervisor.user', 'company')->get();
        return response()->json($requests);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
         $request->validate([
            'student_id' => 'required|exists:students,id',
            'supervisor_id' => 'required|exists:supervisors,supervisor_id',
            'training_company_id' => 'required|exists:training_companies,company_id',
            'training_type' => 'required|string',
            'training_description' => 'nullable|string',
            'proposed_start_date' => 'required|date',
            'proposed_end_date' => 'required|date|after_or_equal:proposed_start_date',
            'actual_start_date' => 'nullable|date',
            'actual_end_date' => 'nullable|date|after_or_equal:actual_start_date',
            'rejection_reason' => 'nullable|string'
        ]);

        $requestModel = Training_Request::create($request->all());
        return response()->json($requestModel, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $requestModel = Training_Request::with('student.user', 'supervisor.user', 'company')->find($id);
        if(!$requestModel){
            return response()->json(['message'=>'Training Request not found'],404);
        }
        return response()->json($requestModel);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
         $requestModel = Training_Request::find($id);
        if(!$requestModel){
            return response()->json(['message'=>'Training Request not found'],404);
        }

        $request->validate([
            'training_type' => 'sometimes|string',
            'training_description' => 'nullable|string',
            'proposed_start_date' => 'sometimes|date',
            'proposed_end_date' => 'sometimes|date|after_or_equal:proposed_start_date',
            'actual_start_date' => 'nullable|date',
            'actual_end_date' => 'nullable|date|after_or_equal:actual_start_date',
            'rejection_reason' => 'nullable|string'
        ]);

        $requestModel->update($request->all());
        return response()->json($requestModel);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
           $requestModel = Training_Request::find($id);
        if(!$requestModel){
            return response()->json(['message'=>'Training Request not found'],404);
        }

        $requestModel->delete();
        return response()->json(['message'=>'Training Request deleted successfully']);
    
    }
}
