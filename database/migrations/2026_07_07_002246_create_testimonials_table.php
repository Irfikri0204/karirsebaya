<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('testimonials', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('institution');
            $table->text('message');
            $table->integer('rating')->default(5);
            $table->boolean('is_hidden')->default(false);
            $table->boolean('is_featured')->default(false);
            $table->string('avatar_initials', 2)->nullable();
            $table->string('avatar_color')->default('blue');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('testimonials');
    }
};
