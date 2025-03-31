<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateCancionesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('canciones', function (Blueprint $table) {
            $table->id();
            $table->string('titulo', 255);
            $table->foreignId('artista_id')->nullable()->constrained('artistas')->onDelete('set null');
            $table->foreignId('album_id')->nullable()->constrained('albumes')->onDelete('set null');
            $table->string('archivo');
            $table->string('portada')->nullable();
            $table->integer('duracion')->nullable();
            $table->string('genero');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('canciones');
    }
}
