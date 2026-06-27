<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

use App\Models\Supervisor;
use App\Models\Student;
use App\Models\Training_Request;
use App\Models\Training_Report;

use App\Http\Resources\SupervisorResource;
use App\Http\Requests\StoreSupervisorRequest;
use App\Http\Requests\UpdateSupervisorRequest;

class SupervisorController extends Controller
{

    /**
     * Display a listing of supervisors
     */
    public function index()
    {
        $user = Auth::user();

        if ($user->user_type != 'admin') {
            abort(403);
        }

        $supervisors = Supervisor::with('user')
            ->withCount('students')
            ->paginate(20);

        return SupervisorResource::collection($supervisors);
    }


    /**
     * Store supervisor profile
     */
    public function store(StoreSupervisorRequest $request)
    {
        $user = $request->user();

        if ($user->user_type !== 'supervisor') {
            abort(403);
        }

        $supervisor = Supervisor::where(
            'user_id',
            $user->id
        )->first();

        if (!$supervisor) {

            return response()->json([
                'message' => 'Supervisor not found'
            ], 404);
        }

        $data = $request->validated();

        $data['user_id'] = $user->id;

        $supervisor->update($data);

        return new SupervisorResource($supervisor);
    }


    /**
     * Show single supervisor
     */
    public function show(Supervisor $supervisor)
    {
        $user = Auth::user();

        if ($user->user_type != 'admin') {
            abort(403);
        }

        $supervisor->load('user')
            ->loadCount('students');

        return new SupervisorResource($supervisor);
    }


    /**
     * Update supervisor
     */
    public function update(
        UpdateSupervisorRequest $request,
        Supervisor $supervisor
    ) {

        $user = Auth::user();

        if ($user->user_type != 'admin') {
            abort(403);
        }

        $supervisor->update(
            $request->validated()
        );

        return (new SupervisorResource($supervisor))
            ->additional([
                'message' =>
                    'Supervisor updated successfully'
            ]);
    }


    /**
     * Delete supervisor
     */
    public function destroy(Supervisor $supervisor)
    {
        $user = Auth::user();

        if ($user->user_type != 'admin') {
            abort(403);
        }

        if ($supervisor->students()->count() > 0) {

            return response()->json([
                'message' =>
                    'Cannot delete supervisor with assigned students'
            ], 422);
        }

        $supervisor->delete();

        return response()->json([
            'message' =>
                'Supervisor deleted successfully'
        ]);
    }


    /**
     * Available supervisors
     */
    public function available()
    {
        $user = Auth::user();

        if ($user->user_type != 'admin') {
            abort(403);
        }

        $supervisors = Supervisor::with('user')
            ->withCount('students')
            ->havingRaw('students_count < max_students')
            ->paginate(20);

        return SupervisorResource::collection($supervisors);
    }


    /**
     * Supervisor dashboard stats
     */
   public function stats()
{
    try {
        $user = Auth::user();
        $supervisor = Supervisor::where('user_id', $user->id)->first();

        if (!$supervisor) {
            return response()->json(['message' => 'Supervisor not found'], 404);
        }

        // التعديل هنا: جلب الطلبات الخاصة بطلاب هذا المشرف والتي قبلتها الشركة (approved)
        $pendingRequests = Training_Request::whereHas('student', function($query) use ($supervisor) {
                $query->where('supervisor_id', $supervisor->supervisor_id);
            })
            ->where('status', 'pending_supervisor')// الحالة بعد موافقة الشركة
            ->count();

        return response()->json([
            'supervisor_name' => $user->name ?? 'Supervisor',
            'pending_requests_count' => $pendingRequests,
            'pending_reports_count' => Training_Report::whereHas('student', function($q) use ($supervisor) {
                $q->where('supervisor_id', $supervisor->supervisor_id);
            })->where('status', 'pending')->count(),
            'reviewed_reports_count' => Training_Report::whereHas('student', function($q) use ($supervisor) {
                $q->where('supervisor_id', $supervisor->supervisor_id);
            })->where('status', 'reviewed')->count(),
            'total_students_count' => Student::where('supervisor_id', $supervisor->supervisor_id)->count(),
        ]);

    } catch (\Throwable $e) {
        return response()->json(['message' => 'Server Error', 'error' => $e->getMessage()], 500);
    }
}

    /**
     * Supervisor students
     */
public function students()
{
    try {
        $user = Auth::user();
        $supervisor = Supervisor::where('user_id', $user->id)->first();

        // نستخدم with لجلب الشركة واليوزر الخاص بها
        // تأكدي أن موديل Student فيه علاقة اسمها trainingCompany
        $students = Student::with(['user', 'trainingCompany.user']) 
            ->where('supervisor_id', $supervisor->supervisor_id)
            ->get();

        $data = $students->map(function ($student) {
            $reportsCount = \App\Models\Training_Report::where('student_id', $student->id)->count();

            // منطق "صياد" الأسماء: يبحث عن الاسم في كل مكان محتمل
            $nameOfCompany = 'لا توجد شركة حالياً';

            if ($student->trainingCompany) {
                if ($student->trainingCompany->user && !empty($student->trainingCompany->user->name)) {
                    // الاحتمال الأول: الاسم موجود في جدول users المرتبط بالشركة
                    $nameOfCompany = $student->trainingCompany->user->name;
                } elseif (!empty($student->trainingCompany->name)) {
                    // الاحتمال الثاني: الاسم موجود في عمود name مباشرة في جدول الشركات
                    $nameOfCompany = $student->trainingCompany->name;
                } elseif (!empty($student->trainingCompany->company_name)) {
                    // الاحتمال الثالث: العمود اسمه company_name
                    $nameOfCompany = $student->trainingCompany->company_name;
                }
            }

            return [
                'id' => $student->id,
                'name' => $student->user->name ?? 'طالب',
                'company_name' => $nameOfCompany,
                'reports_submitted_count' => $reportsCount,
                'progress_percentage' => min(($reportsCount / 5) * 100, 100),
            ];
        });

        return response()->json($data);

    } catch (\Throwable $e) {
        return response()->json(['error' => $e->getMessage()], 500);
    }
}}