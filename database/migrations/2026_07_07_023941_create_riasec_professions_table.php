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
        Schema::create('riasec_professions', function (Blueprint $table) {
            $table->id();
            $table->string('category_code');
            $table->string('title');
            $table->text('description')->nullable();
            $table->timestamps();

            $table->foreign('category_code')->references('code')->on('riasec_categories')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('riasec_professions');
    }
};
