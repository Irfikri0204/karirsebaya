<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class RiasecFigure extends Model
{
    protected $fillable = ['category_code', 'name', 'image_path', 'description'];

    public function category()
    {
        return $this->belongsTo(RiasecCategory::class, 'category_code', 'code');
    }
}
