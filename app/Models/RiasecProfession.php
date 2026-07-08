<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class RiasecProfession extends Model
{
    protected $fillable = ['category_code', 'title', 'description'];

    public function category()
    {
        return $this->belongsTo(RiasecCategory::class, 'category_code', 'code');
    }
}
