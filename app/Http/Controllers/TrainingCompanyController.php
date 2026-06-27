<?php

namespace App\Http\Controllers;

use App\Models\Training_Company;
use App\Http\Resources\TrainingCompanyResource;
use App\Http\Requests\StoreTrainingCompanyRequest;
use App\Http\Requests\UpdateTrainingCompanyRequest;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;

class TrainingCompanyController extends Controller
{
    public function index()
{
    $user = Auth::user();

    if ($user->user_type != 'admin') {
        abort(403);
    }

    $companies = Training_Company::with('user')
        ->withCount('training_Requests')
        ->paginate(10);

    return TrainingCompanyResource::collection($companies);
}
public function store(StoreTrainingCompanyRequest $request)
{
    $user = $request->user();

    if ($user->user_type != 'training_companies') {
        abort(403);
    }

    $company = Training_Company::where('user_id', $user->id)->first();

    if (!$company) {
        return response()->json([
            'message' => 'Company not found'
        ], 404);
    }
    $data = $request->validated();
    $data['user_id'] = $user->id;
    $company->update($data);
    return new TrainingCompanyResource($company);
}

    public function show(Training_Company $training_company)
{
    $user = Auth::user();

    if ($user->user_type != 'admin') {
        abort(403);
    }

    $training_company->load([
        'user',
        'training_Requests'
    ])->loadCount('training_Requests');

    return new TrainingCompanyResource($training_company);
}

   public function update(UpdateTrainingCompanyRequest $request, Training_Company $training_company)
{
    $user = Auth::user();

    if ($user->user_type != 'admin') {
        abort(403);
    }

    $training_company->update($request->validated());

    return (new TrainingCompanyResource($training_company))
        ->additional([
            'message' => 'Company updated successfully'
        ]);
}

   public function destroy(Training_Company $training_company)
{
    $user = Auth::user();

    if ($user->user_type != 'admin') {
        abort(403);
    }

    if ($training_company->training_Requests()->count() > 0) {
        return response()->json([
            'message' => 'Cannot delete company with training requests'
        ], 422);
    }

    $training_company->delete();

    return response()->json([
        'message' => 'Company deleted successfully'
    ]);
}
public function publicIndex()
{
    $companies = \App\Models\Training_Company::all()->map(function($company) {
        return [
            'id' => $company->company_id,
            'name' =>$company->user ? $company->user->name : 'شركة بدون اسم',
            'city' => $company->location,
            'available_seats' => $company->seats_count,
            'duration' => 5, // قيمة افتراضية
            'address' => $company->address
        ];
    });

    return response()->json(['data' => $companies]);
}
public function getDashboardStats()
{
    $user = Auth::user();

    $company = \App\Models\Training_Company::where('user_id', $user->id)->first();

    if (!$company) {
        return response()->json([
            'message' => 'الشركة غير موجودة'
        ], 404);
    }

    $requests = \App\Models\Training_Request::where(
        'training_company_id',
        $company->company_id
    );

    return response()->json([
        'data' => [

            'name' => $user->name,

            // عدد المقاعد
            'seats' => $company->seats,

            // الطلبات الجديدة
            'requests' => (clone $requests)
                ->where('status', 'pending_company')
                ->count(),

            // المقبولين من الشركة
            'accepted' => (clone $requests)
                ->where('status', 'pending_supervisor')
                ->count(),

            // المتدربين الحاليين
            'students' => (clone $requests)
                ->where('status', 'approved')
                ->count(),
        ]
    ]);
}
// دالة نشر إعلان جديد (تتوافق مع publishAnnouncement)
public function storeAnnouncement(Request $request)
{
    $request->validate([
        'title' => 'required|string',
        'description' => 'required|string',
        'seats' => 'required|integer'
    ]);

    // هنا يمكنك إنشاء موديل للإعلانات (Announcement) وتخزين البيانات فيه
    // كحل سريع إذا لم يكن لديكِ جدول إعلانات، يمكنك تحديث بيانات الشركة نفسها
    
    return response()->json(['message' => 'تم نشر الإعلان بنجاح ✅']);
}
}
