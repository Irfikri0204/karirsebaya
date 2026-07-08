<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Testimonial extends Model
{
    protected $fillable = ['user_id', 'name', 'institution', 'message', 'rating', 'is_hidden', 'is_featured', 'avatar_initials', 'avatar_color'];
}
