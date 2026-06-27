<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreTrainingRequestRequest extends FormRequest
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
        // الحقول القادمة من الـ JS (ضرورية)
        'company_id' => 'required|exists:training_companies,company_id',
        'notes'      => 'nullable|string',

        // الحقول التي يحتاجها النظام (نجعلها nullable هنا لتجنب خطأ 422)
        'student_id'           => 'nullable|exists:students,id',
        'supervisor_id'        => 'nullable|exists:supervisors,supervisor_id',
        'training_type'        => 'nullable|string',
        'training_description' => 'nullable|string',
        'proposed_start_date'  => 'nullable|date',
        'proposed_end_date'    => 'nullable|date|after_or_equal:proposed_start_date',
        
        // حقول التواريخ الفعلية والرفض (دائماً nullable في البداية)
        'actual_start_date'    => 'nullable|date',
        'actual_end_date'      => 'nullable|date',
        'rejection_reason'     => 'nullable|string',
    ];
}
}

