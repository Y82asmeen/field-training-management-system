<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Report_Task extends Model
{
    protected $primaryKey = 'task_id';
    protected $fillable = [
        'report_id', 'task_name', 'task_type', 'task_description',
        'technologies_used', 'input_data', 'output_data'
    ];

    public function report() {
        return $this->belongsTo(Training_Report::class, 'report_id');
    }
}
