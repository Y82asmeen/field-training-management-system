<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
public function up()
{
    Schema::create('training__requests', function (Blueprint $table) {
        // 1. الحقول الأصلية الخاصة بكِ (تم الإبقاء عليها بالكامل)
        $table->id('request_id');
        $table->unsignedBigInteger('student_id');
        $table->unsignedBigInteger('supervisor_id')->nullable(); // جعلناه nullable في حال سجل الطالب قبل تعيين المشرف
        $table->unsignedBigInteger('training_company_id')->nullable(); // جعلناه nullable في حال سجل الطالب قبل موافقة الشركة
        $table->string('training_type')->default('Field Training');
        $table->text('training_description')->nullable(); // حولناه لـ text ليتسع لأي ملاحظات طويلة
        $table->date('proposed_start_date');
        $table->date('proposed_end_date');
        $table->date('actual_start_date')->nullable();
        $table->date('actual_end_date')->nullable();
        $table->text('rejection_reason')->nullable();

        // 2. 🔥 إضافة حقول الـ Checkboxes (التاب الأول)
        $table->boolean('system_programming')->default(0);
        $table->boolean('db_programming')->default(0);
        $table->boolean('computerized_system')->default(0);

        // 3. 🔥 إضافة حقول المراحل الأربعة (التاب الثاني - 20 حقل للمهام)
        for ($s = 1; $s <= 4; $s++) {
            for ($t = 1; $t <= 5; $t++) {
                $table->text("stage{$s}_task{$t}")->nullable();
            }
        }

        $table->timestamps();

        // 4. العلاقات الأصلية الخاصة بكِ (مع الإبقاء عليها كاملة)
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
