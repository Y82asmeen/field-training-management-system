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
    Schema::table('students', function (Blueprint $table) {
        // 1. تعريف العمود (تأكدي أنه unsignedBigInteger)
        $table->unsignedBigInteger('supervisor_id')->nullable()->after('user_id');

        // 2. الربط الصحيح مع الإشارة لاسم العمود المرجعي الفعلي
        $table->foreign('supervisor_id')
              ->references('supervisor_id') // التعديل هنا: اسم العمود في جدول المشرفين
              ->on('supervisors')
              ->onDelete('set null');
    });
}

public function down(): void
{
    Schema::table('students', function (Blueprint $table) {
        $table->dropForeign(['supervisor_id']);
        $table->dropColumn('supervisor_id');
    });
}

};