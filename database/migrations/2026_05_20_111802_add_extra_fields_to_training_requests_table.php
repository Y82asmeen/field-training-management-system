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
    Schema::table('training__requests', function (Blueprint $table) {

        $table->string('semester')->nullable();

        $table->integer('remaining_hours')->nullable();

        $table->date('expected_graduation')->nullable();

        $table->string('company_name')->nullable();

        $table->string('company_address')->nullable();

        $table->string('company_email')->nullable();

        $table->text('company_description')->nullable();

    });
}

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('training_requests', function (Blueprint $table) {
            //
        });
    }
};
