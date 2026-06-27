<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\Student;
use App\Models\Supervisor;
use App\Models\Training_Company;

class Training_Request extends Model
{
    protected $primaryKey = 'request_id';
    public $incrementing = true;
protected $fillable = [

    'student_id',
    'supervisor_id',
    'training_company_id',

    'training_type',
    'training_description',

    'actual_start_date',
    'actual_end_date',

    'rejection_reason',
    'status',

    'proposed_start_date',
    'proposed_end_date',

    'training_days',
    'company_description' ,
    'company_email' ,
    'semester',
    'remaining_hours',
    'expected_graduation' ,
    'company_name',
    'company_address',

    // checkboxes
    'system_programming',
    'db_programming',
    'computerized_system',

    // stage 1
    'stage1_task1',
    'stage1_task2',
    'stage1_task3',
    'stage1_task4',
    'stage1_task5',

    // stage 2
    'stage2_task1',
    'stage2_task2',
    'stage2_task3',
    'stage2_task4',
    'stage2_task5',

    // stage 3
    'stage3_task1',
    'stage3_task2',
    'stage3_task3',
    'stage3_task4',
    'stage3_task5',

    // stage 4
    'stage4_task1',
    'stage4_task2',
    'stage4_task3',
    'stage4_task4',
    'stage4_task5',
];
    protected $casts = [
    'training_days' => 'array',
];

    public function student() {
        return $this->belongsTo(Student::class,'student_id','id');
    }

    public function supervisor() {
        return $this->belongsTo(Supervisor::class);
    }

public function company() {
    return $this->belongsTo(Training_Company::class, 'training_company_id', 'company_id');
}
public function days()
{
    return $this->hasMany(
        \App\Models\TrainingRequestDay::class,
        'training_request_id',
        'request_id'
    );
}
protected static function boot()
{
    parent::boot();

    // عند إنشاء طلب تدريب جديد
    static::created(function ($request) {
        Activity::create([
            'type' => 'pending',
            'message' => "قدّم الطالب (" . ($request->student->user->name ?? 'طالب') . ") طلب تدريب جديد لدى شركة (" . ($request->company->name ?? 'مؤسسة') . ")"
        ]);
    });

    // عند تغيير حالة الطلب (قبول / رفض / إكمال)
    static::updated(function ($request) {
        if ($request->isDirty('status')) {
            $status = $request->status;
            $studentName = $request->student->user->name ?? 'طالب';
            $companyName = $request->company->name ?? 'المؤسسة';

            if ($status === 'active' || $status === 'approved') {
                Activity::create([
                    'type' => 'success',
                    'message' => "وافقت شركة ({$companyName}) على تدريب الطالب: {$studentName} (متدرب نشط)"
                ]);
            } elseif ($status === 'rejected') {
                Activity::create([
                    'type' => 'danger',
                    'message' => "تم رفض طلب تدريب الطالب {$studentName} من قبل شركة ({$companyName})"
                ]);
            } elseif ($status === 'completed') {
                Activity::create([
                    'type' => 'success',
                    'message' => "أتمّ الطالب {$studentName} فترة التدريب الميداني بنجاح لدى ({$companyName})"
                ]);
            }
        }
    });
}
}
