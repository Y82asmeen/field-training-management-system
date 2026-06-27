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
        Schema::create('students', function (Blueprint $table) {
           $table->id();
           $table->unsignedBigInteger('user_id')->unique();
           $table->string('university_number')->unique()->nullable();
           $table->string('major')->nullable();
           $table->string('academic_year')->nullable();
           $table->string('phone')->nullable();
           $table->decimal('gpa', 3, 2)->nullable();
           $table->integer('completed_hours')->nullable();
           $table->timestamps(); 

           $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');

        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('students');
    }
};
