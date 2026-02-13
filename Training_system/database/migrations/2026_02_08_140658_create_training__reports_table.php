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
        Schema::create('training__reports', function (Blueprint $table) {
            $table->id('report_id');
            $table->unsignedBigInteger('request_id');
            $table->unsignedBigInteger('student_id');
            $table->integer('report_number');
            $table->text('project_description');
            $table->text('total_hours');
            $table->text('overall_evaluation');
            $table->text('student_reflection')->nullable();
            $table->dateTime('submission_date');
            $table->dateTime('supervisor_review_date')->nullable();
            $table->timestamps();

            $table->foreign('request_id')->references('request_id')->on('training__requests')->onDelete('cascade');
            $table->foreign('student_id')->references('id')->on('students')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('training__reports');
    }
};
