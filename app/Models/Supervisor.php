<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\Activity;

class Supervisor extends Model
{
     protected $primaryKey = 'supervisor_id';
    protected $fillable = ['user_id', 'department', 'max_students','employee_number','phone'];

    public function user()
    {
       return $this->belongsTo(User::class, 'user_id', 'id');
    }
public function students()
{
    return $this->hasMany(Student::class, 'supervisor_id');
}
    public function notifications()
{
    return $this->hasMany(Notification::class, 'user_id', 'user_id');
}


protected static function boot()
{
    parent::boot();

    static::created(function ($supervisor) {
        Activity::create([
            'type' => 'blue',
            'message' => "تم تسجيل مشرف أكاديمي جديد بالنظام: " . ($supervisor->user->name ?? 'مشرف')
        ]);
    });
}

}
