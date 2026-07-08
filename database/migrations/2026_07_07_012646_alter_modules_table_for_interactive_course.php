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
        Schema::table('modules', function (Blueprint $table) {
            $table->dropColumn(['description', 'document_url']);
            $table->string('hashtag')->nullable()->after('title');
            $table->text('introduction')->nullable()->after('hashtag');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('modules', function (Blueprint $table) {
            $table->dropColumn(['hashtag', 'introduction']);
            $table->text('description')->nullable();
            $table->string('document_url')->nullable();
        });
    }
};
