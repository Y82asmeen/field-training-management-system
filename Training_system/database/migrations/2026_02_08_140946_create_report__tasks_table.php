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
        Schema::create('report__tasks', function (Blueprint $table) {
            $table->id('task_id');
            $table->unsignedBigInteger('report_id');
            $table->string('task_name');
            $table->string('task_type');
            $table->string('task_description');
            $table->text('technologies_used')->nullable();
            $table->text('input_data')->nullable();
            $table->text('output_data')->nullable();
            $table->timestamps();

            $table->foreign('report_id')->references('report_id')->on('training__reports')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('report__tasks');
    }
};
