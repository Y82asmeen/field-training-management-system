<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreTrainingCompanyRequest extends FormRequest
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
        //'user_id' => 'required|exists:users,id|unique:training_companies,user_id',
        //'name' => 'required|string|max:255',
        'address' => 'nullable|string',
        'industry' => 'nullable|string',
        'contact_person' => 'nullable|string',
        'phone' => 'nullable|string',
        'contact_email' => 'nullable|email'
    ];
}
}
