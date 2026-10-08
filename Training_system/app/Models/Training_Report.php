<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Training_Report extends Model
{
      protected $primaryKey = 'report_id';
    protected $fillable = [
        'request_id', 'student_id', 'report_number', 'project_description',
        'total_hours', 'overall_evaluation', 'student_reflection',
        'submission_date', 'supervisor_review_date'
    ];

    public function request() {
        return $this->belongsTo(Training_Request::class, 'request_id');
    }

    public function student() {
        return $this->belongsTo(Student::class, 'student_id');
    }
}
