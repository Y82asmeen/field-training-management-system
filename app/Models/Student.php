<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\Supervisor;
use App\Models\User;
use App\Models\Training_Report;
use App\Models\Training_Request;
use App\Models\Notification;


class Student extends Model
{
     protected $fillable = [
        'user_id',
        'university_number',
        'major',
        'academic_year',
        'phone',
        'gpa',
        'completed_hours',
    ];

        public function getRouteKeyName()
        {
            return 'university_number';
    }

     
 public function user() {
    return $this->belongsTo(User::class);
}

public function supervisor() {
    return $this->belongsTo(Supervisor::class, 'supervisor_id');
}

public function training_Requests() {
    return $this->hasMany(Training_Request::class);
}

public function training_Reports() {
    return $this->hasMany(Training_Report::class, 'student_id');
}
public function notifications()
    {
        return $this->hasMany(Notification::class, 'user_id', 'user_id');
    }
    public function trainingCompany()
{
    return $this->belongsTo(
        \App\Models\Training_Company::class,
       'company_id',
        'company_id'
    );
}


protected static function boot()
{
    parent::boot();

    // 1. عند تسجيل طالب جديد بالنظام
    static::created(function ($student) {
        Activity::create([
            'type' => 'blue',
            'message' => "تم تسجيل طالب جديد في النظام باسم: " . ($student->user->name ?? 'طالب جديد')
        ]);
    });

    // 2. عند تعيين مشرف للطالب (تحديث حقل supervisor_id)
    static::updated(function ($student) {
        if ($student->isDirty('supervisor_id') && !is_null($student->supervisor_id)) {
            Activity::create([
                'type' => 'success',
                'message' => "تم تعيين المشرف (" . ($student->supervisor->user->name ?? 'مشرف') . ") للطالب (" . ($student->user->name ?? 'طالب') . ")"
            ]);
        }
    });
}
};
