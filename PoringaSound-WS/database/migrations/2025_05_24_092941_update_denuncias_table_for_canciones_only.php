<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class UpdateDenunciasTableForCancionesOnly extends Migration
{
    public function up()
    {
        Schema::table('denuncias', function (Blueprint $table) {
            $table->dropIndex(['denunciable_id', 'denunciable_type']);
            $table->dropColumn(['denunciable_id', 'denunciable_type']);

            $table->foreignId('cancion_id')->constrained('canciones')->onDelete('cascade');
        });
    }

    public function down()
    {
        Schema::table('denuncias', function (Blueprint $table) {
            $table->dropForeign(['cancion_id']);
            $table->dropColumn('cancion_id');

            $table->unsignedBigInteger('denunciable_id');
            $table->string('denunciable_type');
            $table->index(['denunciable_id', 'denunciable_type']);
        });
    }
}

