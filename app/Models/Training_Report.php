<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\Activity;

class Training_Report extends Model
{
    protected $primaryKey = 'report_id';
    protected $fillable = [
        'request_id', 'student_id', 'report_number', 'project_description',
        'total_hours', 'overall_evaluation', 'student_reflection',
        'submission_date', 'supervisor_review_date','report_data',
        'rating', 
    'feedback',
    ];

    public function request() {
        return $this->belongsTo(Training_Request::class, 'request_id');
    }

    public function student() {
        return $this->belongsTo(Student::class, 'student_id');
    }
    protected static function boot()
{
    parent::boot();

    // أ. عندما يرفع الطالب تقريراً يومياً جديداً
    static::created(function ($report) {
        Activity::create([
            'type' => 'blue',
            'message' => "قام الطالب (" . ($report->student->user->name ?? 'طالب') . ") برفع تقرير التدريب الميداني اليومي"
        ]);
    });

    // ب. عندما يقوم المشرف بالموافقة على التقرير أو رفضه
    static::updated(function ($report) {
        if ($report->isDirty('status')) {
            $studentName = $report->student->user->name ?? 'طالب';
            if ($report->status === 'approved') {
                Activity::create([
                    'type' => 'success',
                    'message' => "وافق المشرف على التقرير اليومي المرفوع من الطالب: {$studentName}"
                ]);
            } elseif ($report->status === 'rejected') {
                Activity::create([
                    'type' => 'danger',
                    'message' => "رفض المشرف التقرير اليومي المرفوع من الطالب: {$studentName} (يرجى التعديل)"
                ]);
            }
        }
    });
}
}
