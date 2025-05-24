<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class UpdateEstadoAndDenunciableTypeInDenunciasTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        
        Schema::table('denuncias', function (Blueprint $table) {
            $table->enum('estado', ['pendiente', 'aceptada', 'rechazada'])->default('pendiente')->change();
            $table->string('denunciable_type', 255)->change();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('denuncias', function (Blueprint $table) {
            $table->enum('estado', ['pendiente', 'revisado'])->default('pendiente')->change();
            $table->string('denunciable_type', 191)->change();
        });
    }
}
