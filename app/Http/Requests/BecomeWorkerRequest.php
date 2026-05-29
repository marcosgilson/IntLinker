<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class BecomeWorkerRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name'            => ['required', 'string', 'max:255', 'not_regex:/<[^>]*>/'],
            'company_name'    => ['required', 'string', 'max:255', 'not_regex:/<[^>]*>/'],
            'position'        => ['required', 'string', 'max:255', 'not_regex:/<[^>]*>/'],
            'work_card_image' => ['required', 'file', 'mimes:jpg,jpeg,png,pdf', 'max:5120'],
        ];
    }
}