<?php

namespace App\Http\Controllers;

use App\Models\Training_Request;
use App\Http\Resources\TrainingRequestResource;
use App\Http\Requests\StoreTrainingRequestRequest;
use App\Http\Requests\UpdateTrainingRequestRequest;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;

class TrainingRequestController extends Controller
{
    public function index()
    {
        $user = Auth::user();
        $query = \App\Models\Training_Request::query();

        if ($user->user_type == 'student') {
            $student = \App\Models\Student::where('user_id', $user->id)->first();
            if ($student) {
                $query->where('student_id', $student->id);
            } else {
                return response()->json(['data' => []]);
            }
        } 

        // جلب الشركة واليوزر الخاص بها لضمان ظهور الاسم في الجداول والواجهات
        $requests = $query->with(['company.user', 'student.user'])->get(); 

        return response()->json(['data' => $requests]);
    }

    public function store(StoreTrainingRequestRequest $request)
    {
        $user = Auth::user();
        $student = \App\Models\Student::where('user_id', $user->id)->first();

        if (!$student) {
            return response()->json(['message' => 'لم يتم العثور على ملف طالب'], 404);
        }

        $trainingRequest = \App\Models\Training_Request::create([
            'student_id'           => $student->id,
            'supervisor_id'        => $student->supervisor_id, 
            'training_company_id'  => $request->company_id,
            'training_type'        => 'Field Training',        
            'training_description' =>$request->training_description?? $request->notes?? 'طلب تدريب جديد الميداني',
            'proposed_start_date'  => now()->addDays(7),       
            'proposed_end_date'    => now()->addMonths(2),
            'status' => 'pending_company',    
        ]);

        return response()->json([
            'message' => 'تم إرسال طلبك بنجاح ✅ وهو بانتظار موافقة المشرف الأكاديمي',
            'data'    => $trainingRequest
        ], 201);
    }

    // تم إبقاء نسخة واحدة فقط مخصصة ومحمية من الـ Intelephense تمنع تعارض النظام
    public function show(int $id)
    {
        try {
            $trainingRequest = \App\Models\Training_Request::with([
                'student.user', 
                'company.user'
            ])->findOrFail($id);

            return response()->json([
                'success' => true,
                'data' => $trainingRequest
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'الطلب المطلوب غير موجود أو تم حذفه'
            ], 404);
        }
    }

    public function update(UpdateTrainingRequestRequest $request, Training_Request $training_request)
    {
        $user = Auth::user();

        if ($user->user_type == 'student') {
            abort(403); 
        }

        if ($user->user_type == 'supervisor' && $training_request->student->supervisor_id != $user->id) {
            abort(403);
        }

        if ($user->user_type == 'training_company' && $training_request->company_id != $user->id) {
            abort(403);
        }

        $training_request->update($request->validated());

        return (new TrainingRequestResource($training_request))
            ->additional([
                'message' => 'Training request updated successfully'
            ]);
    }

    public function destroy(Training_Request $training_request)
    {
        $user = Auth::user();

        if ($user->user_type != 'admin') {
            abort(403);
        }

        $training_request->delete();

        return response()->json([
            'message' => 'Training request deleted successfully'
        ], 200);
    }

    public function getCompanyRequests()
    {
        $user = Auth::user();
        $company = \App\Models\Training_Company::where('user_id', $user->id)->first();

        if (!$company) {
            return response()->json(['message' => 'سجل الشركة غير موجود'], 404);
        }

       $requests = \App\Models\Training_Request::where('training_company_id', $company->company_id)
    ->where('status', 'pending_company')
    ->with(['student.user']) 
    ->orderBy('created_at', 'desc')
    ->get();

        return response()->json(['data' => $requests]);
    }

    public function handleRequestAction($id, $action)
    {
        $trainingRequest = \App\Models\Training_Request::where('request_id', $id)->firstOrFail();
        $company = \App\Models\Training_Company::where('user_id', Auth::id())->first();

        if ($trainingRequest->training_company_id !== $company->company_id) {
            return response()->json(['message' => 'غير مصرح لك'], 403);
        }
$status = ($action === 'accept')
    ? 'company_approved'
    : 'rejected';

$trainingRequest->update([
    'status' => $status
]);


        return response()->json([
            'message' => $action === 'accept' ? 'تم القبول بنجاح ✅' : 'تم الرفض ✖'
        ]);
    }

    public function myRequests()
    {
        $studentId = Auth::user()->student->id;
        $requests = Training_Request::with('company.user')
                    ->where('student_id', $studentId)
                    ->get();

        return response()->json($requests);
    }

    public function createStudentRequest(Request $request)
{
    $user = Auth::user();
    $student = \App\Models\Student::where('user_id', $user->id)->first();

    if (!$student) {
        return response()->json(['message' => 'Student not found'], 404);
    }

    try {
        // 1. تجهيز وحفظ بيانات الطلب الأساسية (التاب الأول والثاني)
        $insertData = [
    'student_id'           => $student->id,
    'supervisor_id'        => $student->supervisor_id,

    // ⚠️ انتبهي هون (ممكن تكون null عندك)
    'training_company_id' => $request->input('company_id'),

    'training_type'        => $request->input('training_type', 'Field Training'),
    'training_description' => $request->input('companyDescription') ?? $request->input('notes') ?? 'طلب جديد',

    'proposed_start_date'  => $request->input('proposed_start_date'),
    'proposed_end_date'    => $request->input('proposed_end_date'),

    'status'               => 'pending_supervisor',


    // ✅ الإضافات الجديدة المهمة
    'semester'             => $request->input('semester'),
    'remaining_hours'      => $request->input('remainingHours'),
    'expected_graduation'  => $request->input('expectedGraduation'),

    'company_name'         => $request->input('companyName'),
    'company_address'      => $request->input('companyAddress'),
    'company_email'        => $request->input('companyEmail'),
    'company_description'  => $request->input('companyDescription'),
];

        // لقط حقول الـ Checkboxes (التاب الأول)
        $insertData['system_programming']  = $request->input('systemProgramming') ? 1 : 0;
        $insertData['db_programming']      = $request->input('dbProgramming') ? 1 : 0;
        $insertData['computerized_system'] = $request->input('computerizedSystem') ? 1 : 0;

        // لقط حقول المهام للمراحل الأربعة (التاب الثاني - 20 حقل)
        for ($s = 1; $s <= 4; $s++) {
            for ($t = 1; $t <= 5; $t++) {
                $fieldName = "stage{$s}_task{$t}";
                $insertData[$fieldName] = $request->input($fieldName) ?? null;
            }
        }

        // إنشاء الطلب في الجدول الرئيسي
        $trainingRequest = \App\Models\Training_Request::create($insertData);

        // 2. لقط مصفوفة الـ 40 يوم (التاب الثالث) القادمة من الجافا سكريبت وحفظها في الجدول الجديد
        $daysPlan = $request->input('forty_days_plan'); 

        if (is_array($daysPlan)) {
            foreach ($daysPlan as $dayRow) {
                \App\Models\TrainingRequestDay::create([
                    'training_request_id' => $trainingRequest->request_id, // ربط بالجدول الرئيسي
                    'report_number'       => $dayRow['report_number'],
                    'day_number'          => $dayRow['day_number'],
                    'training_day_name'   => $dayRow['day_name'] ?? null,
                    'training_date'       => $dayRow['date'] ?? null,
                    'task_description'    => $dayRow['task_description'] ?? null,
                    'start_time'          => $dayRow['start_time'] ?? null,
                    'end_time'            => $dayRow['end_time'] ?? null,
                ]);
            }
        }

        return response()->json([
            'success' => true,
            'message' => 'تم حفظ الطلب وخطة الـ 40 يوماً بنجاح تفصيلي ✅',
            'data' => $trainingRequest
        ], 201);

    } catch (\Exception $e) {
        return response()->json([
            'success' => false,
            'error' => $e->getMessage()
        ], 500);
    }

    }

  public function getSupervisorStudentsRequests()
{
    $user = Auth::user();

    $supervisor = \App\Models\Supervisor::where('user_id', $user->id)->first();

    if (!$supervisor) {
        return response()->json([
            'success' => false,
            'message' => 'سجل المشرف غير موجود'
        ], 404);
    }

$requests = \App\Models\Training_Request::where('status', 'pending_supervisor')
    ->whereHas('student', function($query) use ($supervisor) {

        $query->where(
            'supervisor_id',
            $supervisor->supervisor_id
        );

    })
    ->with([
        'student.user',
        'company.user',
        'days'
    ])
    ->orderBy('created_at', 'desc')
    ->get();

    $formatted = $requests->map(function ($req) {

        return [
            'id' => $req->request_id,

            'student' => $req->student,

            'company' => $req->company,

            'training_type' => $req->training_type,

            'status' => $req->status,
            'semester' => $req->semester,
            'remaining_hours' => $req->remaining_hours,
            'expected_graduation' => $req->expected_graduation,
            'system_programming' => $req->system_programming,
            'db_programming' => $req->db_programming,
            'computerized_system' => $req->computerized_system,
            'company_name' => $req->company_name,
            'company_address' => $req->company_address,
            'company_email' => $req->company_email,
            'company_description' => $req->company_description,

            'stages' => [
                [
                    'tasks' => [
                        $req->stage1_task1,
                        $req->stage1_task2,
                        $req->stage1_task3,
                        $req->stage1_task4,
                        $req->stage1_task5,
                    ]
                ],
                [
                    'tasks' => [
                        $req->stage2_task1,
                        $req->stage2_task2,
                        $req->stage2_task3,
                        $req->stage2_task4,
                        $req->stage2_task5,
                    ]
                ],
                [
                    'tasks' => [
                        $req->stage3_task1,
                        $req->stage3_task2,
                        $req->stage3_task3,
                        $req->stage3_task4,
                        $req->stage3_task5,
                    ]
                ],
                [
                    'tasks' => [
                        $req->stage4_task1,
                        $req->stage4_task2,
                        $req->stage4_task3,
                        $req->stage4_task4,
                        $req->stage4_task5,
                    ]
                ],
            ],

            'days' => $req->days->map(function ($day) {
                return [
                    'report_number' => $day->report_number,
                    'day_number' => $day->day_number,
                    'training_day_name' => $day->training_day_name,
                    'training_date' => $day->training_date,
                    'task_description' => $day->task_description,
                    'start_time' => $day->start_time,
                    'end_time' => $day->end_time,
                ];
            }),

        ];
    });

    return response()->json([
        'success' => true,
        'data' => $formatted
    ]);
}

    public function supervisorHandleAction(Request $request, $id)
    {
        $user = Auth::user();
        $supervisor = \App\Models\Supervisor::where('user_id', $user->id)->first();
        
        if (!$supervisor) {
            return response()->json(['message' => 'سجل المشرف غير موجود'], 403);
        }

        $trainingRequest = \App\Models\Training_Request::with('student')->findOrFail($id);

        if ($trainingRequest->student->supervisor_id != $supervisor->supervisor_id) {
            return response()->json([
                'message' => 'هذا الطالب لا يتبع لك',
                'debug_info' => [
                    'student_supervisor' => $trainingRequest->student->supervisor_id,
                    'current_supervisor' => $supervisor->supervisor_id
                ]
            ], 403);
        }

        $validated = $request->validate([
            'status' => 'required|in:approved,rejected,pending'
        ]);

        $trainingRequest->update(['status' => $validated['status']]);
        if ($validated['status'] === 'approved') {

    $trainingRequest->student->update([

        'company_id' => $trainingRequest->training_company_id

    ]);

}
        if ($validated['status'] === 'approved') {

    $company = \App\Models\Training_Company::where(
        'company_id',
        $trainingRequest->training_company_id
    )->first();

    if ($company && $company->seats > 0) {
        $company->seats--;
        $company->save();
    }
}
        $studentUserId = $trainingRequest->student->user_id;

\App\Models\Notification::create([
    'user_id' => $studentUserId,
    'title' => 'تحديث طلب التدريب',
    'message' => $validated['status'] === 'approved'
        ? 'تم قبول طلبك من المشرف الأكاديمي 🎉 وبدأ التدريب'
        : 'تم رفض طلبك من المشرف الأكاديمي ❌',
    'is_read' => false
]);

        return response()->json([
            'success' => true,
            'message' => 'تم تحديث حالة الطلب بنجاح',
        ]);
    }
}