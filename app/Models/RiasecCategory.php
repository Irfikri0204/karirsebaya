<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class RiasecCategory extends Model
{
    public $incrementing = false;
    protected $primaryKey = 'code';
    protected $keyType = 'string';

    protected $fillable = ['code', 'name', 'description', 'recommendations', 'inspiring_figures'];

    protected $casts = [
        'inspiring_figures' => 'array',
    ];

    public function questions()
    {
        return $this->hasMany(RiasecQuestion::class, 'category_code', 'code');
    }

    public function professions()
    {
        return $this->hasMany(RiasecProfession::class, 'category_code', 'code');
    }

    public function figures()
    {
        return $this->hasMany(RiasecFigure::class, 'category_code', 'code');
    }
}
