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
      Schema::create('training_request_days', function (Blueprint $table) {
            $table->id();
            
            // 🔥 الربط بجدولك الأصلي عن طريق الـ Foreign Key
            $table->unsignedBigInteger('training_request_id');
            
            // حقول التقرير والأيام الأربعين بالتفصيل كما هي في الـ HTML عندكِ
            $table->integer('report_number');      // رقم التقرير (1 للـ 10 أيام الأولى، 2 للثانية...)
            $table->integer('day_number');         // رقم اليوم متسلسل من 1 إلى 40
            $table->string('training_day_name');   // اسم اليوم (الأحد، الإثنين...) القادم من d22_name
            $table->date('training_date');         // التاريخ القادم من d22_date
            $table->text('task_description')->nullable(); // وصف مهام اليوم القادم من d22_task
            $table->time('start_time');            // وقت بدء الدوام من d22_time_from
            $table->time('end_time');              // وقت نهاية الدوام إلى d22_time_to
            
            $table->timestamps();

            // 🔥 الربط الخارجي مع مراعاة اسم جدولك الأصلي (training__requests) بـ 2 أندر سكور
            $table->foreign('training_request_id')
                  ->references('request_id')
                  ->on('training__requests')
                  ->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('training_request_days');    }
};
