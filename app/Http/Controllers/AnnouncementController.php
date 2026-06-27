<?php

namespace App\Http\Controllers;

use App\Models\Announcement;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\Training_Company;

class AnnouncementController extends Controller
{
    // دالة حفظ الإعلان الجديد
public function store(Request $request)
{
    $request->validate([
        'title'       => 'required|string',
        'description' => 'required|string',
        'location'    => 'required|string',
        'weeks'       => 'required|integer',
        'seats'       => 'required|integer',
    ]);

    // جلب الشركة الخاصة بالمستخدم المسجل
    $company = Training_Company::where('user_id', Auth::id())->firstOrFail();

    // استخدام الفنكشن announcements() للحفظ
    // لارافيل سيقوم بوضع قيمة الـ company_id تلقائياً في جدول الإعلانات
    $announcement = $company->announcements()->create($request->all());

    return response()->json([
        'message' => '✅ تم نشر الإعلان بنجاح',
        'data'    => $announcement
    ], 201);
}

    // دالة جلب الإعلانات للطلاب
    public function index()
    {
        return response()->json([
            'data' => Announcement::with('company')->where('seats', '>', 0)->get()
        ]);
    }
}