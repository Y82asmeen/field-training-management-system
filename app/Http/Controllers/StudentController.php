<?php

namespace App\Http\Controllers;

use App\Models\Student;
use App\Http\Resources\StudentResource;
use App\Http\Requests\StoreStudentRequest;
use App\Http\Requests\UpdateStudentRequest;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;

class StudentController extends Controller
{
   public function index()
{
    $user = Auth::user();
    if ($user->user_type == 'supervisor') {
        $students = Student::where('supervisor_id', $user->id)
            ->with(['user','supervisor','training_Requests.company','training_Reports'])
            ->paginate(20);
    } else {
        $students = Student::with([
            'user',
            'supervisor',
            'training_Requests.company',
            'training_Reports'
        ])->paginate(20);
    }

    return StudentResource::collection($students);
}

    public function store(StoreStudentRequest $request)
{
    $user = $request->user();

    $student = Student::where('user_id', $user->id)->first();

    if (!$student) {
        return response()->json(['message' => 'Student not found'], 404);
    }

    $student->update($request->validated());

    return new StudentResource($student);
}

    public function show(Student $student)
{
    $user = Auth::user();

    // الطالب يشوف نفسه فقط
    if ($user->user_type == 'student' && $user->id != $student->user_id) {
        abort(403);
    }

    // المشرف يشوف طلابه فقط
    if ($user->user_type == 'supervisor' && $student->supervisor_id != $user->id) {
        abort(403);
    }

    $student->load([
        'user',
        'supervisor',
        'training_Requests.company',
        'training_Reports'
    ]);

    return new StudentResource($student);
}

   public function update(UpdateStudentRequest $request, Student $student)
{
    $user = Auth::user();

    if ($user->user_type == 'student' && $user->id != $student->user_id) {
        abort(403);
    }

    if ($user->user_type == 'supervisor' && $student->supervisor_id != $user->id) {
        abort(403);
    }

    $student->update($request->validated());

    return new StudentResource($student);
}

   public function destroy(Student $student)
{
     $user = Auth::user();

    if ($user->user_type != 'admin') {
        abort(403);
    }

    $student->delete();

    return response()->json([
        'message' => 'Student deleted successfully'
    ]);
}
public function assignSupervisor(Request $request, $id)
{
    $request->validate([
        // يجب أن نخبر Laravel أن يبحث في عمود supervisor_id داخل جدول supervisors
        'supervisor_id' => 'required|exists:supervisors,supervisor_id'
    ]);

    $student = Student::findOrFail($id);
    $student->supervisor_id = $request->supervisor_id;
    $student->save();

    return response()->json([
        'message' => 'تم تعيين المشرف بنجاح'
    ]);
}
public function me()
{
    $user = Auth::user();

    // جلب بيانات الطالب مع المشرف والشركات المرتبطة بطلباته
    $student = \App\Models\Student::where('user_id', $user->id)
        ->with(['user', 'supervisor.user', 'training_requests.company','training_Reports'])
        ->first();

    if (!$student) {
        return response()->json(['message' => 'Student data not found'], 404);
    }

    // نستخدم الـ StudentResource لضمان وصول البيانات بنفس تنسيق الجافا سكريبت
    return new StudentResource($student);
}
public function myNotifications()
{
    $user = Auth::user();

    return \App\Models\Notification::where('user_id', $user->id)
        ->orderBy('created_at', 'desc')
        ->get();
}
}