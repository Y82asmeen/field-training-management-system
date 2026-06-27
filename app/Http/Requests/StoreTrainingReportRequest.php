<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreTrainingReportRequest extends FormRequest
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
        'request_id' => 'required|exists:training_requests,id',
        'student_id' => 'required|exists:students,id',
        'report_number' => 'required|integer',
        'project_description' => 'nullable|string',
        'total_hours' => 'required|integer|min:1',
        'overall_evaluation' => 'nullable|string',
        'student_reflection' => 'nullable|string',
        'submission_date' => 'required|date',
        'supervisor_review_date' => 'nullable|date|after_or_equal:submission_date'
        ];
    }
}
