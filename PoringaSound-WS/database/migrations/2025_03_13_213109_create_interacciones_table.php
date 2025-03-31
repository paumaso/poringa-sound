<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateInteraccionesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('interacciones', function (Blueprint $table) {
            $table->id();
            $table->foreignId('users_id')->constrained('users')->onDelete('cascade');
            $table->foreignId('cancion_id')->constrained('canciones')->onDelete('cascade');
            $table->enum('tipo', ['like', 'comentario', 'puntuacion']);
            $table->text('comentario')->nullable();
            $table->integer('puntuacion')->nullable()->check('puntuacion BETWEEN 1 AND 5');
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
        Schema::dropIfExists('interacciones');
    }
}
