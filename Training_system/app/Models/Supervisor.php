<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Supervisor extends Model
{
     protected $primaryKey = 'supervisor_id';
    protected $fillable = ['user_id', 'department', 'max_students'];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
      public function students()
    {
        return $this->hasMany(Student::class);
    }
    public function notifications()
{
    return $this->hasMany(Notification::class, 'user_id', 'user_id');
}

}
