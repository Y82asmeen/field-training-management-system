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
        Schema::create('announcements', function (Blueprint $table) {
            $table->id();

            // الربط اليدوي ليتناسب مع جدول الشركة بدون تعديله
            $table->unsignedBigInteger('company_id');
            $table->foreign('company_id')
                  ->references('company_id') // اسم العمود في جدول الشركات
                  ->on('training_companies') // تأكدي من عدد الشرطات هنا (واحدة أم اثنتان)
                  ->onDelete('cascade');

            $table->string('title');
            $table->text('description');
            $table->string('location');
            $table->integer('weeks');
            $table->integer('seats');
            $table->timestamps();
        }); // القوس هنا كان غالباً مفقوداً أو بعده خطأ
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('announcements');
    }
};