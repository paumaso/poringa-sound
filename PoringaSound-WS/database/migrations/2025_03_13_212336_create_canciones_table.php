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
            $table->foreignId('user_id')->nullable()->constrained('users')->onDelete('set null');
            $table->foreignId('album_id')->nullable()->constrained('albumes')->onDelete('cascade');
            $table->boolean('active')->nullable()->default(false);
            $table->string('archivo');
            $table->string('portada')->nullable();
            $table->integer('duracion')->nullable();
            $table->foreignId('genero_id')->constrained('generos')->onDelete('cascade');
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
