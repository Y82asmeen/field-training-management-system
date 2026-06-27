<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class TrainingRequestResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->request_id,
            'training_type' => $this->training_type,
            'training_description' => $this->training_description,

            'proposed_start_date' => $this->proposed_start_date,
            'proposed_end_date' => $this->proposed_end_date,

            'actual_start_date' => $this->actual_start_date,
            'actual_end_date' => $this->actual_end_date,

            'rejection_reason' => $this->rejection_reason,

            'student' => [
                'id' => $this->student?->student_id,
                'name' => $this->student?->user?->name,
            ],

            'supervisor' => [
                'id' => $this->supervisor?->supervisor_id,
                'name' => $this->supervisor?->user?->name,
            ],

            'company' => [
                'id' => $this->company?->company_id,
                'name' => $this->company?->company_name,
            ],

            'created_at' => $this->created_at,
        ];
    }
}