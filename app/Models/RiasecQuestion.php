<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class RiasecQuestion extends Model
{
    protected $fillable = ['category_code', 'question_text', 'options'];

    protected $casts = [
        'options' => 'array',
    ];

    public function category()
    {
        return $this->belongsTo(RiasecCategory::class, 'category_code', 'code');
    }
}
