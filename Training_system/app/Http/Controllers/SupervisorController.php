<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Supervisor;

class SupervisorController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $supervisors = Supervisor::with('user', 'students')->get();
        return response()->json($supervisors);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
           $request->validate([
            'user_id' => 'required|exists:users,id|unique:supervisors,user_id',
            'department' => 'required|string',
            'max_students' => 'required|integer|min:1',
        ]);
        $supervisor = Supervisor::create($request->only([
            'user_id',
            'department',
            'max_students'
        ]));
        return response()->json($supervisor, 201);



    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
         $supervisor = Supervisor::with('user', 'students')->find($id);

        if (!$supervisor) {
            return response()->json(['message' => 'Supervisor not found'], 404);
        }

        return response()->json($supervisor);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
         $supervisor = Supervisor::find($id);
        if (!$supervisor) {
            return response()->json(['message' => 'Supervisor not found'], 404);
        }

        $request->validate([
            'department' => 'sometimes|string',
            'max_students' => 'sometimes|integer|min:1',
        ]);

        $supervisor->update($request->all());

        return response()->json($supervisor);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
          $supervisor = Supervisor::find($id);
        if (!$supervisor) {
            return response()->json(['message' => 'Supervisor not found'], 404);
        }

        $supervisor->delete();
        return response()->json(['message' => 'Supervisor deleted successfully']);
    }
    
}
