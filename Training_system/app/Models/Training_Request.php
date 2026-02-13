<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Training_Request extends Model
{
    protected $primaryKey = 'request_id';
    protected $fillable = [
        'student_id', 'supervisor_id', 'training_company_id',
        'training_type', 'training_description',
        'proposed_start_date', 'proposed_end_date',
        'actual_start_date', 'actual_end_date', 'rejection_reason'
    ];

    public function student() {
        return $this->belongsTo(Student::class);
    }

    public function supervisor() {
        return $this->belongsTo(Supervisor::class);
    }

    public function company() {
        return $this->belongsTo(Training_Company::class, 'training_company_id');
    }
}
