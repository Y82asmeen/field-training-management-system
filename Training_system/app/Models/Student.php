<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Student extends Model
{
     protected $fillable = [
        'id',
        'university_number',
        'major',
        'academic_year',
        'phone',
        'gpa',
        'completed_hours',
    ];
     
 public function user() {
    return $this->belongsTo(User::class);
}

public function supervisor() {
    return $this->belongsTo(Supervisor::class);
}

public function trainingRequests() {
    return $this->hasMany(Training_Request::class);
}

public function trainingReports() {
    return $this->hasMany(Training_Report::class);
}
public function notifications()
    {
        return $this->hasMany(Notification::class, 'user_id', 'user_id');
    }
};