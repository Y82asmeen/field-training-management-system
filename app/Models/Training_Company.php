<?php

namespace App\Models;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\User;
use App\Models\Notification;
use App\Models\Training_Request;

class Training_Company extends Model
{
    use HasFactory;
    protected $table = 'training_companies';

    protected $primaryKey = 'company_id';
    protected $fillable = [
         'address', 'industry', 'contact_person','user_id',
        'phone', 'contact_email', 'is_approved', 'approval_date','seats'
    ];
   public function user()
{
    return $this->belongsTo(User::class, 'user_id');
}
      public function training_Requests()
    {
        return $this->hasMany(Training_Request::class);
    }
    public function notifications()
{
    return $this->hasMany(Notification::class, 'user_id', 'user_id');
}
public function announcements()
{
    // هنا نخبر لارافيل أن المفتاح الأساسي في هذا الجدول هو company_id وليس id
    return $this->hasMany(Announcement::class, 'company_id', 'company_id');
}
}
