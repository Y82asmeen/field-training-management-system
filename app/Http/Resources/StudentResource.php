<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class StudentResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->user ? $this->user->name : 'N/A',
            'university_number' => $this->university_number,
            'major' => $this->major,
            'academic_year' => $this->academic_year,
            'phone' => $this->phone,
            'gpa' => $this->gpa,
            'completed_hours' => $this->completed_hours,
            'user' => $this->whenLoaded('user'),
            'supervisor' => $this->whenLoaded('supervisor'),
            'training_requests' => $this->whenLoaded('training_Requests'),
            'training_reports' => $this->whenLoaded('training_Reports'),
            'created_at' => $this->created_at,
        ];
    }
}
