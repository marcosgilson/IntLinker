<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class AddSchoolRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'school_id'          => ['required', 'integer', 'exists:schools,id'],
            'student_card_image' => ['required', 'image', 'max:5120'], // max 5 MB
        ];
    }
}
