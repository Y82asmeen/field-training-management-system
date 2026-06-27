<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class SupervisorResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     */
public function toArray(Request $request): array
{
    return [
        // 1. تغيير id إلى supervisor_id ليتطابق مع قاعدة البيانات
        'supervisor_id' => $this->supervisor_id, 
        
        // 2. إرجاع الاسم مباشرة لتسهيل الأمر على الجافا سكريبت
        'name' => $this->user ? $this->user->name : 'N/A',

        'department' => $this->department,
        'max_students' => $this->max_students,
        'students_count' => $this->students_count,
        'phone' => $this->phone,

        // إرجاع بيانات المستخدم كاملة إذا تم تحميلها
        'user' => $this->user, // أو $this->whenLoaded('user')

        'created_at' => $this->created_at, 
    ];
}
}
