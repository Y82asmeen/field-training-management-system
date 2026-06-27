<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
    use App\Models\Activity;
    use Illuminate\Support\Str;

class Announcement extends Model
{
    // الحقول التي سيتم إرسالها من صفحة الشركة
    protected $fillable = [
        'company_id', 
        'title', 
        'description', 
        'location', 
        'weeks', 
        'seats'
    ];

    // علاقة: الإعلان ينتمي لشركة
    public function company()
    {
        return $this->belongsTo(Training_Company::class, 'company_id');
    }


protected static function boot()
{
    parent::boot();

    static::created(function ($announcement) {
        Activity::create([
            'type' => 'orange',
            'message' => "تم نشر إعلان تدريب جديد بالنظام بعنوان: " . Str::limit($announcement->title, 30)
        ]);
    });
}
}
