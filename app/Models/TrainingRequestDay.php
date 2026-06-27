<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class TrainingRequestDay extends Model
{
    protected $table = 'training_request_days';
    
    // الحقول المسموح بحفظ البيانات داخلها تلقائياً
    protected $fillable = [
        'training_request_id', 
        'report_number', 
        'day_number', 
        'training_day_name', 
        'training_date', 
        'task_description', 
        'start_time', 
        'end_time'
    ];
    public function trainingRequest()
    {
        return $this->belongsTo(Training_Request::class, 'training_request_id', 'request_id');
    }
}
