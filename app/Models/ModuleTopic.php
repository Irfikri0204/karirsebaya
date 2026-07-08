<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ModuleTopic extends Model
{
    protected $fillable = [
        'module_id',
        'title',
        'order',
    ];

    public function module()
    {
        return $this->belongsTo(Module::class);
    }

    public function contents()
    {
        return $this->hasMany(TopicContent::class)->orderBy('order');
    }
}
