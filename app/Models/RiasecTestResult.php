<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class RiasecTestResult extends Model
{
    protected $fillable = ['user_id', 'scores', 'primary_category_code'];

    protected $casts = [
        'scores' => 'array',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function primaryCategory()
    {
        return $this->belongsTo(RiasecCategory::class, 'primary_category_code', 'code');
    }

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($model) {
            if (empty($model->uuid)) {
                $model->uuid = (string) \Illuminate\Support\Str::uuid();
            }
        });
    }

    public function getRouteKeyName()
    {
        return 'uuid';
    }
}
