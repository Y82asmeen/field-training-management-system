<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('training__reports', function (Blueprint $table) {

            $table->text('project_description')->nullable()->change();

            $table->text('total_hours')->nullable()->change();

            $table->text('overall_evaluation')->nullable()->change();

            $table->dateTime('submission_date')->nullable()->change();
        });
    }

    public function down(): void
    {
        Schema::table('training__reports', function (Blueprint $table) {

            $table->text('project_description')->nullable(false)->change();

            $table->text('total_hours')->nullable(false)->change();

            $table->text('overall_evaluation')->nullable(false)->change();

            $table->dateTime('submission_date')->nullable(false)->change();
        });
    }
};