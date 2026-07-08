<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Module extends Model
{
    protected $fillable = [
        'title',
        'hashtag',
        'introduction',
        'cover_image',
        'is_active',
        'order',
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'order' => 'integer',
    ];

    public function topics()
    {
        return $this->hasMany(ModuleTopic::class)->orderBy('order');
    }
}
