<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class TrainingReportResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'report_number' => $this->report_number,
            'total_hours' => $this->total_hours,
            'project_description' => $this->project_description,
            'overall_evaluation' => $this->overall_evaluation,
            'student_reflection' => $this->student_reflection,
            'submission_date' => $this->submission_date,
            'supervisor_review_date' => $this->supervisor_review_date,

            'student' => $this->whenLoaded('student'),
            'training_request' => $this->whenLoaded('request'),
        ];
    }
}
