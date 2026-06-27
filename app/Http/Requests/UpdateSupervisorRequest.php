<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateSupervisorRequest extends FormRequest
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
        'department' => 'sometimes|string|max:255',
         'employee_number' => [
            'sometimes',
            'digits:10',
           Rule::unique('supervisors', 'employee_number')->ignore($this->supervisor->supervisor_id, 'supervisor_id')
        ],
    ];
}
}
