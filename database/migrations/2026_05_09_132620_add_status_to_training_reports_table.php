<?php

 /**
     * Run the migrations.
     */
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('training__reports', function (Blueprint $table) {

            $table->string('status')
                ->default('pending')
                ->after('report_id'); // أو بعد أي عمود مناسب عندك

        });
    }

    public function down(): void
    {
        Schema::table('training__reports', function (Blueprint $table) {

            $table->dropColumn('status');

        });
    }
};
