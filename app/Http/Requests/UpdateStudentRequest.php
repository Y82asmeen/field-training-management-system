<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateStudentRequest extends FormRequest
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
        'university_number' => 'nullabe|string|unique:students,university_number,' . $this->student->id,
        'major' => 'nullabe|string|max:255',
        'academic_year' => 'nullabe|string|max:50',
        'phone' => 'nullable|string|max:20',
        'gpa' => 'nullable|numeric|between:0,4',
        'completed_hours' => 'nullable|integer|min:90'
    ];
}

}
