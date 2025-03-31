<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateAlbumesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('albumes', function (Blueprint $table) {
            $table->id();
            $table->foreignId('artista_id')->constrained('artistas')->onDelete('cascade');
            $table->string('titulo', 255);
            $table->json('canciones')->nullable();
            $table->string('portada')->nullable();
            $table->date('fecha_lanzamiento')->nullable();
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
        Schema::dropIfExists('albumes');
    }
}
