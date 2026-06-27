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
       Schema::table('training__reports', function (Blueprint $table) {
           $table->integer('rating')->nullable()->after('status');
           $table->text('feedback')->nullable()->after('rating');
       });
   }

   public function down()
   {
       Schema::table('training__reports', function (Blueprint $table) {
           $table->dropColumn(['rating', 'feedback']);
       });
   }
};
