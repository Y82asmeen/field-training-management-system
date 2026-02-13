<?php

namespace App\Models;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Training_Company extends Model
{
    use HasFactory;
    protected $table = 'training_companies';

    protected $primaryKey = 'company_id';
    protected $fillable = [
        'company_name', 'address', 'industry', 'contact_person', 
        'contact_phone', 'contact_email', 'is_approved', 'approval_date'
    ];
     public function user()
    {
        return $this->belongsTo(User::class);
    }
      public function trainingRequests()
    {
        return $this->hasMany(Training_Request::class);
    }
    public function notifications()
{
    return $this->hasMany(Notification::class, 'user_id', 'user_id');
}

}
