<?php

namespace App\Http\Controllers;

use App\Models\Training_Report;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;
use Carbon\Carbon;

class TrainingReportController extends Controller
{

    /* ===================================================
        📌 GET REPORTS
    =================================================== */
    public function index(Request $request)
    {
        $user = Auth::user();

        // السماح فقط للطالب
        if ($user->user_type !== 'student') {
            return response()->json([
                'message' => 'Unauthorized'
            ], 403);
        }

        $student = $user->student;

        // التحقق من وجود تدريب معتمد
        $training = $student->training_Requests()
            ->where('status', 'approved')
            ->first();

        if (!$training) {
            return response()->json([
                'message' => 'No active training'
            ], 404);
        }

        /* =========================================
            📌 جلب تقرير واحد حسب الرقم
        ========================================= */
        if ($request->has('report_number')) {

            $report = Training_Report::where('student_id', $student->id)
                ->where('request_id', $training->request_id)
                ->where('report_number', $request->report_number)
                ->first();

            // إذا التقرير غير موجود
            if (!$report) {
                return response()->json([
                    'report_number' => $request->report_number,
                    'status' => 'not_uploaded'
                ]);
            }

            return response()->json($report);
        }

        /* =========================================
            📌 جلب جميع التقارير
        ========================================= */
        $reports = Training_Report::where('student_id', $student->id)
            ->where('request_id', $training->request_id)
            ->orderBy('report_number')
            ->get();

        return response()->json($reports);
    }


    /* ===================================================
        📌 STORE (SAVE / DRAFT)
    =================================================== */
    public function store(Request $request)
{
    $user = Auth::user();

    if ($user->user_type !== 'student') {
        return response()->json([
            'message' => 'Unauthorized'
        ], 403);
    }

    $student = $user->student;

    $training = $student->training_Requests()
        ->where('status', 'approved')
        ->first();

    if (!$training) {
        return response()->json([
            'message' => 'No active training'
        ], 404);
    }

    // =========================
    // 📌 التحقق من رقم التقرير
    // =========================
    if (!$request->report_number) {
        return response()->json([
            'message' => 'report_number is required'
        ], 422);
    }

    $reportNumber = $request->report_number;

    // =========================
    // 📁 رفع الصور
    // =========================
    $upload = function ($key) use ($request) {

        $paths = [];

        if ($request->hasFile($key)) {

            foreach ($request->file($key) as $file) {

                $paths[] = asset(
                    'storage/' . $file->store('reports', 'public')
                );
            }
        }

        return $paths;
    };

    $files = [

        "task1" => [
            "code_images"   => $upload('task1_code_images'),
            "output_images" => $upload('task1_output_images'),
        ],

        "task2" => [
            "code_images"   => $upload('task2_code_images'),
            "output_images" => $upload('task2_output_images'),
        ],

        "task3" => [
            "code_images"   => $upload('task3_code_images'),
            "output_images" => $upload('task3_output_images'),
        ],

        "task4" => [
            "code_images"   => $upload('task4_code_images'),
            "output_images" => $upload('task4_output_images'),
        ],
    ];

    // =========================
    // 📌 بيانات الفورم
    // =========================
    $formData = [

        "student_name"    => $request->student_name,
        "studentId"       => $request->studentId,
        "company_name"    => $request->company_name,
        "supervisor_name" => $request->supervisor_name,
        "phone"           => $request->phone,

        "trainingType"    => $request->trainingType ?? [],
        "workType"        => $request->workType,

        "start_date"      => $request->start_date,
        "end_date"        => $request->end_date,

        "days"            => $request->days,
        "hours"           => $request->hours,

        "summary_text"    => $request->summary_text,
        "work_summary"    => $request->work_summary,

        "tasks" => [
            $request->task_1,
            $request->task_2,
            $request->task_3,
            $request->task_4,
            $request->task_5,
        ],

        "task_1" => $request->task_1,
        "task_2" => $request->task_2,
        "task_3" => $request->task_3,
        "task_4" => $request->task_4,
        "task_5" => $request->task_5,

        "task1_name"        => $request->task1_name,
        "task1_description" => $request->task1_description,
        "task1_clients"     => $request->task1_clients,
        "task1_tools"       => $request->task1_tools,
        "task1_data"        => $request->task1_data,

        "task2_name"        => $request->task2_name,
        "task2_description" => $request->task2_description,
        "task2_clients"     => $request->task2_clients,
        "task2_tools"       => $request->task2_tools,
        "task2_data"        => $request->task2_data,

        "task3_name"        => $request->task3_name,
        "task3_description" => $request->task3_description,
        "task3_clients"     => $request->task3_clients,
        "task3_tools"       => $request->task3_tools,
        "task3_data"        => $request->task3_data,

        "task4_name"        => $request->task4_name,
        "task4_description" => $request->task4_description,
        "task4_clients"     => $request->task4_clients,
        "task4_tools"       => $request->task4_tools,
        "task4_data"        => $request->task4_data,
    ];

    // =========================
    // 📌 البيانات النهائية
    // =========================
    $finalReportData = [
        'form'  => $formData,
        'files' => $files
    ];

    // =========================
    // 📌 البحث عن التقرير
    // =========================
    $report = Training_Report::where('student_id', $student->id)
        ->where('request_id', $training->request_id)
        ->where('report_number', $reportNumber)
        ->first();

    // =========================
    // 📌 تحديث
    // =========================
    if ($report) {

        $report->update([
            'status'      => $request->status ?? 'draft',
            'report_data' => $finalReportData
        ]);

    } else {

        // =========================
        // 📌 إنشاء
        // =========================
        $report = Training_Report::create([

            'student_id'    => $student->id,
            'request_id'    => $training->request_id,
            'report_number' => $reportNumber,

            'status'        => $request->status ?? 'draft',

            'report_data'   => $finalReportData
        ]);
    }

    return response()->json([

        'message' => 'Report saved successfully',
        'data'    => $report

    ], 200);
}

    /* ===================================================
        📌 SUBMIT REPORT
    =================================================== */
    public function submit(Request $request)
    {
        $user = Auth::user();

        if ($user->user_type !== 'student') {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $student = $user->student;

        $training = $student->training_Requests()
            ->where('status', 'approved')
            ->first();

        if (!$training) {
            return response()->json(['message' => 'No active training'], 404);
        }

        if (!$request->report_number) {
            return response()->json(['message' => 'report_number is required'], 422);
        }

        $report = Training_Report::where('student_id', $student->id)
            ->where('request_id', $training->request_id)
            ->where('report_number', $request->report_number)
            ->first();

        if (!$report) {
            return response()->json(['message' => 'Report not found'], 404);
        }

        $report->status = 'pending';
        $report->save();

        return response()->json([
            'message' => 'Report submitted successfully'
        ]);
    }


    /* ===================================================
        📌 SHOW REPORT (تم تعديلها لترجع حقول التقييم الجديدة)
    =================================================== */
    public function show($id)
    {
        $report = Training_Report::where('report_id', $id)->first();

        if (!$report) {
            return response()->json(['message' => 'Report not found'], 404);
        }

        return response()->json([
            'report_id'     => $report->report_id,
            'report_number' => $report->report_number,
            'status'        => $report->status,
            'rating'        => $report->rating,       // 🌟 مضاف قسراً
            'feedback'      => $report->feedback,     // 🌟 مضاف قسراً
            'report_data'   => json_decode($report->report_data)
        ]);
    }


    /* ===================================================
        📌 CURRENT WEEK CALC
    =================================================== */
    private function getCurrentWeek($startDate)
    {
        $start = Carbon::parse($startDate);
        $days = $start->diffInDays(now());
        return floor($days / 10) + 1;
    }

    /* ===================================================
        📌 SUPERVISOR - STUDENT REPORTS
    =================================================== */
    public function studentReports($id)
    {
        $user = Auth::user();

        if ($user->user_type !== 'supervisor') {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $student = \App\Models\Student::find($id);

        if (!$student) {
            return response()->json(['message' => 'Student not found'], 404);
        }

        $reports = Training_Report::where('student_id', $student->id)
            ->orderBy('report_number')
            ->get();

        return response()->json([
            'student_name' => $student->user->name,
            'reports' => $reports
        ]);
    }

    /* ===================================================
        📌 APPROVE REPORT
    =================================================== */
    public function approve($id)
    {
        $user = Auth::user();

        if ($user->user_type !== 'supervisor') {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $report = Training_Report::where('report_id', $id)->first();

        if (!$report) {
            return response()->json(['message' => 'Report not found'], 404);
        }

        $report->status = 'approved';
        $report->save();

        return response()->json([
            'message' => 'Report approved successfully'
        ]);
    }


    /* ===================================================
        📌 REJECT REPORT
    =================================================== */
    public function reject($id)
    {
        $user = Auth::user();

        if ($user->user_type !== 'supervisor') {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $report = Training_Report::where('report_id', $id)->first();

        if (!$report) {
            return response()->json(['message' => 'Report not found'], 404);
        }

        $report->status = 'rejected';
        $report->save();

        return response()->json([
            'message' => 'Report rejected successfully'
        ]);
    }



    /* ===================================================
        📌 EVALUATE (دالة التقييم الفورية وحفظ البيانات)
    =================================================== */
    public function evaluate(Request $request, $id)
    {
        // 1. التحقق من البيانات القادمة من الجافاسكريبت
        $request->validate([
            'rating' => 'required|integer|min:1|max:5',
            'feedback' => 'nullable|string'
        ]);

        // 2. البحث عن التقرير المطلوب
        $report = Training_Report::findOrFail($id);

        // 3. تحديث البيانات مباشرة في الأعمدة المستقلة
        $report->update([
            'rating' => $request->rating,
            'feedback' => $request->feedback,
            'status' => 'reviewed' 
        ]);

        // 4. إرجاع رد نجاح للجافاسكريبت
        return response()->json([
            'message' => 'تم حفظ التقييم والملاحظات بنجاح ✅',
            'data' => $report
        ], 200);
    }
    
}