<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Notification;
use Illuminate\Support\Facades\Auth;

class NotificationController extends Controller
{
    /**
     * Display a listing of the resource.
     */
public function index()
{
    $user = Auth::user();

    $notifications = Notification::where('user_id', $user->id)
        ->orderBy('created_at', 'desc')
        ->get();

    return response()->json([
        'success' => true,
        'data' => $notifications
    ]);
}

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
         $request->validate([
            'user_id' => 'nullable|exists:users,id',
            'admin_id' => 'nullable|exists:admins,id',
            'title' => 'required|string',
            'message' => 'required|string',
            'is_read' => 'boolean'
        ]);

        $notification = Notification::create($request->only([
            'user_id', 'admin_id', 'title', 'message', 'is_read'
        ]));

        return response()->json($notification, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $notification = Notification::with('user', 'admin')->find($id);
        if (!$notification) {
            return response()->json(['message' => 'Notification not found'], 404);
        }
        return response()->json($notification);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $notification = Notification::find($id);
        if (!$notification) {
            return response()->json(['message' => 'Notification not found'], 404);
        }

        $request->validate([
            'title' => 'sometimes|string',
            'message' => 'sometimes|string',
            'is_read' => 'boolean'
        ]);

        $notification->update($request->all());
        return response()->json($notification);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
                $notification = Notification::find($id);
        if (!$notification) {
            return response()->json(['message' => 'Notification not found'], 404);
        }

        $notification->delete();
        return response()->json(['message' => 'Notification deleted successfully']);

    }
    public function myNotifications()
{
    $user = Auth::user();

    return \App\Models\Notification::where('user_id', $user->id)
        ->orderBy('created_at', 'desc')
        ->get();
}
}
