<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class RenewStudentRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name'               => ['required', 'string', 'max:255', 'not_regex:/<[^>]*>/'],
            'student_card_image' => ['required', 'file', 'mimes:jpg,jpeg,png,webp', 'max:5120'],
        ];
    }
}
