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
        Schema::table('training__requests', function (Blueprint $table) {
           
                $table->enum('status', [
                    'pending_company',
                    'rejected_by_company',
                    'pending_supervisor',
                    'rejected_by_supervisor',
                    'approved',
                    'in_training',
                    'completed'
                    ])->default('pending_company')->after('training_company_id');
                    });

    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
    

    Schema::table('training__requests', function (Blueprint $table) {
        $table->dropColumn('status');
    });


    }
};
