<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use App\Models\Student;
use App\Models\Supervisor;
use App\Models\Training_Company;
use Illuminate\Support\Facades\Hash;

class UserController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $users = User::all();
        return response()->json($users);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string',
            'email' => 'required|email|unique:users,email',
            'password' => 'required|string|min:6',
            'user_type' => 'required|in:student,supervisor,training_companies,admin'
        ]);

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'user_type' => $request->user_type
        ]);
          switch($request->user_type) {
            case 'student':
                Student::create([
                    'user_id' => $user->id,
                    'university_number' => 'UN_' . $user->id,
                    'major' => '',
                    'academic_year' => '',
                ]);
                break;
            case 'supervisor':
                Supervisor::create([
                    'user_id' => $user->id,
                    'department' => '',
                    'max_students' => 5
                ]);
                break;
            case 'training_companies':
                Training_Company::create([
                    'user_id' => $user->id,
                    'company_name' => '',
                    'address' => '',
                    'industry' => '',
                    'contact_person' => '',
                    'contact_phone' => '',
                    'contact_email' => ''
                ]);
                break;
        }

        return response()->json($user, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $user = User::find($id);
        if(!$user) return response()->json(['message'=>'User not found'],404);
        return response()->json($user);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
          $user = User::find($id);
        if(!$user) return response()->json(['message'=>'User not found'],404);

        $request->validate([
            'name' => 'sometimes|string',
            'email' => 'sometimes|email|unique:users,email,'.$id,
            'password' => 'sometimes|string|min:6'
        ]);

        if($request->has('password')) {
            $request->merge(['password' => Hash::make($request->password)]);
        }

        $user->update($request->only(['name','email','password']));

        return response()->json($user);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
           $user = User::find($id);
        if(!$user) return response()->json(['message'=>'User not found'],404);

        $user->delete(); 

        return response()->json(['message'=>'User deleted successfully']);
    
    }
}
