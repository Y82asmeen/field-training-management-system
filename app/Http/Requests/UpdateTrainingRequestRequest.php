<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateTrainingRequestRequest extends FormRequest
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
        'training_type' => 'sometimes|string',
        'training_description' => 'nullable|string',
        'proposed_start_date' => 'sometimes|date',
        'proposed_end_date' => 'sometimes|date|after_or_equal:proposed_start_date',
        'actual_start_date' => 'nullable|date',
        'actual_end_date' => 'nullable|date|after_or_equal:actual_start_date',
        'rejection_reason' => 'nullable|string'
    ];
}
}
