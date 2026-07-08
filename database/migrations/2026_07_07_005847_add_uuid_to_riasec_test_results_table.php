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
        Schema::table('riasec_test_results', function (Blueprint $table) {
            $table->uuid('uuid')->nullable()->after('id');
        });

        // Populate existing rows
        $results = \App\Models\RiasecTestResult::all();
        foreach ($results as $result) {
            $result->uuid = (string) \Illuminate\Support\Str::uuid();
            $result->save();
        }

        Schema::table('riasec_test_results', function (Blueprint $table) {
            $table->uuid('uuid')->nullable(false)->unique()->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('riasec_test_results', function (Blueprint $table) {
            $table->dropColumn('uuid');
        });
    }
};
