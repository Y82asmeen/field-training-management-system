<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class AdminUserController extends Controller
{
public function index(Request $request)
{
    $query = User::query();

    if ($request->search) {
        $query->where(function ($q) use ($request) {
            $q->where('name', 'like', "%{$request->search}%")
              ->orWhere('email', 'like', "%{$request->search}%")
              ->orWhere('user_type', 'like', "%{$request->search}%");
        });
    }

    return response()->json([
        'data' => $query->latest()->get()
    ]);
}
public function show($id)
{
    $user = User::findOrFail($id);
    return response()->json($user);
}
public function store(Request $request)
{
    $request->validate([
        'name' => 'required',
        'email' => 'required|email|unique:users',
        'password' => 'required|min:6',
        'user_type' => 'required'
    ]);

    $user = User::create([
        'name' => $request->name,
        'email' => $request->email,
        'user_type' => $request->user_type,
        'password' => Hash::make($request->password),
    ]);

return response()->json([
    'message' => 'تم إنشاء المستخدم بنجاح',
    'user' => $user
]);
}
public function update(Request $request, $id)
{
    $user = User::findOrFail($id);

    $request->validate([
        'name' => 'required',
        'email' => "required|email|unique:users,email,$id",
        'user_type' => 'required'
    ]);

    $user->update([
        'name' => $request->name,
        'email' => $request->email,
        'user_type' => $request->user_type,
    ]);

return response()->json([
    'message' => 'تم تحديث بيانات المستخدم بنجاح',
    'user' => $user
]);
}
public function destroy($id)
{
    $user = User::findOrFail($id);
    $user->delete();

return response()->json([
    'message' => 'تم حذف المستخدم بنجاح'
]);
}
}
