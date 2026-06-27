<?php

use Illuminate\Support\Facades\Route;

// استدعاء جميع الكنترولرز
use App\Http\Controllers\SupervisorController;
use App\Http\Controllers\TrainingCompanyController;
use App\Http\Controllers\TrainingRequestController;
use App\Http\Controllers\TrainingReportController;
use App\Http\Controllers\NotificationController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\StudentController;
use App\Http\Controllers\AnnouncementController;
use App\Http\Controllers\AdminUserController;

/*
|--------------------------------------------------------------------------
| مسار الصفحة الرئيسية للنظام
|--------------------------------------------------------------------------
*/
Route::get('/', function () {
    // إذا كان اسم ملف الصفحة الرئيسية عندك index.html وموجود في مجلد public
    if (file_exists(public_path('index.html'))) {
        return file_get_contents(public_path('index.html'));
    }

    // أما إذا كنتِ بتستخدمي نظام الـ Blade (index.blade.php)
    // return view('index'); 

    // خيار احتياطي: إذا لسا ما جهزت الصفحة الرئيسية بدك يفتح الإعلانات مباشرة
    return redirect('/announcements'); 
});

/*
|--------------------------------------------------------------------------
| Public Routes (المسارات العامة)
|--------------------------------------------------------------------------
*/
Route::post('/login', [UserController::class, 'login']);
Route::post('/register', [UserController::class, 'register']);
Route::get('/announcements', [AnnouncementController::class, 'index']); 

/*
|--------------------------------------------------------------------------
| Authenticated Routes (المسارات المحمية بتوكن)
|--------------------------------------------------------------------------
*/
Route::middleware(['auth:sanctum'])->group(function () {

    // ==========================================
    // 📌 مسارات مشتركة للتقارير (الطالب والمشرف)
    // ==========================================
    // 1. جلب التقارير (عند فتح الصفحة لـ Load البيانات)
    Route::get('/training-reports', [TrainingReportController::class, 'index']);
    
    Route::post('/training-reports', [TrainingReportController::class, 'store']);
    
    
    // 3. إرسال التقرير النهائي للمشرف لتقييمه
    Route::post('/training-reports/submit', [TrainingReportController::class, 'submit']);
    Route::get('/training-reports/{id}', [TrainingReportController::class, 'show']);
    // ==========================================
    // 📌 باقي المسارات المشتركة الأخرى
    // ==========================================
    Route::get('/training-requests', [TrainingRequestController::class, 'index']);
    Route::get('/training-requests/{id}', [TrainingRequestController::class, 'show']);
    Route::apiResource('notifications', NotificationController::class);
    
    // مسارات إنشاء البروفايل الأولي (تستخدم مرة واحدة عند التسجيل)
    Route::post('/student', [StudentController::class, 'store']);
    Route::post('/supervisor', [SupervisorController::class, 'store']);
    Route::post('/company', [TrainingCompanyController::class, 'store']);
    Route::get('/notifications', [NotificationController::class, 'myNotifications']);
   
    Route::post('training-reports/{id}/evaluate', [TrainingReportController::class, 'evaluate']);


    /*
    |--------------------------------------------------------------------------
    | Student Routes 🎓 (خاص بالطلاب)
    |--------------------------------------------------------------------------
    */
    Route::middleware(['role:student'])->group(function () {
        Route::get('/me', [StudentController::class, 'me']); // لجلب بيانات بروفايل الطالب
        Route::get('student/{id}', [StudentController::class, 'show']);
        Route::post('training-requests', [TrainingRequestController::class, 'store']); // إرسال طلب جديد
        Route::get('/companies/public', [TrainingCompanyController::class, 'publicIndex']);
        Route::post('/student/training-request', [TrainingRequestController::class, 'createStudentRequest']);
    });


    /*
    |--------------------------------------------------------------------------
    | Training Company Routes 🏢 (خاص بالشركات)
    |--------------------------------------------------------------------------
    */
    Route::middleware(['role:training_companies'])->group(function () {
        Route::get('/company/dashboard', [TrainingCompanyController::class, 'getDashboardStats']);
        Route::get('/company/requests', [TrainingRequestController::class, 'getCompanyRequests']);
        Route::post('/company/requests/{id}/{action}', [TrainingRequestController::class, 'handleRequestAction']);
        Route::post('/company/announcement', [AnnouncementController::class, 'store']); // إضافة إعلان جديد
        Route::put('training-requests/{id}', [TrainingRequestController::class, 'update']);
    });


    /*
    |--------------------------------------------------------------------------
    | Supervisor Routes 👨‍🏫 (خاص بالمشرفين)
    |--------------------------------------------------------------------------
    */
    Route::middleware(['role:supervisor'])->group(function () {
        Route::get('supervisor/students', [StudentController::class, 'index']);
        Route::get('supervisor/reports', [TrainingReportController::class, 'index']);
        Route::get('/supervisor/stats', [SupervisorController::class, 'stats']);
        Route::get('/supervisor/students', [SupervisorController::class, 'students']);
        Route::get('/supervisor/students-requests', [TrainingRequestController::class, 'getSupervisorStudentsRequests']);
        Route::put('/supervisor/training-requests/{id}', [TrainingRequestController::class, 'supervisorHandleAction']);
        Route::get('/supervisor/pending-count', [TrainingRequestController::class, 'getSupervisorPendingCount']);
        Route::get('/supervisor/students/{id}/reports',[TrainingReportController::class, 'studentReports']);
        Route::post('/reports/{id}/approve',[TrainingReportController::class, 'approve']);
        Route::post('/reports/{id}/reject',[TrainingReportController::class, 'reject']);
    });


    /*
    |--------------------------------------------------------------------------
    | Admin Routes 👑 (خاص بالمسؤول)
    |--------------------------------------------------------------------------
    */
    Route::middleware(['role:admin'])->group(function () {
        
        Route::apiResource('training_companies', TrainingCompanyController::class);
        Route::delete('admin/training-reports/{id}', [TrainingReportController::class, 'destroy']); 
        Route::get('/admin/students', [StudentController::class, 'index']);
        Route::get('/admin/supervisors', [SupervisorController::class, 'index']);
        Route::put('/students/{id}/assign-supervisor', [StudentController::class, 'assignSupervisor']);
        Route::get('/admin/dashboard', [UserController::class, 'adminDashboard']);
        Route::get('/users/{id}', [AdminUserController::class, 'show']);    
        Route::post('/users', [AdminUserController::class, 'store']);       
        Route::put('/users/{id}', [AdminUserController::class, 'update']);  
        Route::delete('/users/{id}', [AdminUserController::class, 'destroy']); 
        Route::get('/users', [AdminUserController::class, 'index']);
    });

});