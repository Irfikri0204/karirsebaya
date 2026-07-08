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
        Schema::create('riasec_categories', function (Blueprint $table) {
            $table->string('code')->primary(); // e.g. R, I, A, S, E, C
            $table->string('name');
            $table->text('description')->nullable();
            $table->text('recommendations')->nullable();
            $table->json('inspiring_figures')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('riasec_categories');
    }
};
