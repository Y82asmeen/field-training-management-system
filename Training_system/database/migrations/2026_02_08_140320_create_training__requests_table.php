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
        Schema::create('training__requests', function (Blueprint $table) {
            $table->id('request_id');
            $table->unsignedBigInteger('student_id');
            $table->unsignedBigInteger('supervisor_id');
            $table->unsignedBigInteger('training_company_id');
            $table->string('training_type');
            $table->string('training_description');
            $table->date('proposed_start_date');
            $table->date('proposed_end_date');
            $table->date('actual_start_date')->nullable();
            $table->date('actual_end_date')->nullable();
            $table->text('rejection_reason')->nullable();
            $table->timestamps();

            $table->foreign('student_id')->references('id')->on('students')->onDelete('cascade');
            $table->foreign('supervisor_id')->references('supervisor_id')->on('supervisors')->onDelete('cascade');
            $table->foreign('training_company_id')->references('company_id')->on('training_companies')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('training_requests');
    }
};
