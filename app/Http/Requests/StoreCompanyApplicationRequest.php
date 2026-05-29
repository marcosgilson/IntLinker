<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreCompanyApplicationRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'company_name' => ['required', 'string', 'max:255', 'not_regex:/<[^>]*>/'],
            'description'  => ['nullable', 'string', 'max:2000', 'not_regex:/<[^>]*>/'],
            'position'     => ['nullable', 'string', 'max:255', 'not_regex:/<[^>]*>/'],
        ];
    }
}
