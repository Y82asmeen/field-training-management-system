<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateTrainingReportRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
        'report_number' => 'sometimes|integer',
        'project_description' => 'nullable|string',
        'total_hours' => 'sometimes|integer|min:1',
        'overall_evaluation' => 'nullable|string',
        'student_reflection' => 'nullable|string',
        'submission_date' => 'sometimes|date',
        'supervisor_review_date' => 'nullable|date|after_or_equal:submission_date'
        ];
    }
}
