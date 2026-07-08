<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class TopicContent extends Model
{
    protected $fillable = [
        'module_topic_id',
        'type',
        'content',
        'order',
    ];

    public function topic()
    {
        return $this->belongsTo(ModuleTopic::class, 'module_topic_id');
    }
}
