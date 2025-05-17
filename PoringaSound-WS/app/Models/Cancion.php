<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Cancion extends Model
{
    use HasFactory;

    protected $table = 'canciones';

    protected $fillable = [
        'titulo',
        'user_id',
        'album_id',
        'duracion',
        'archivo',
        'genero_id',
        'active',
        'portada',
    ];

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id', 'id');
    }

    public function genero()
    {
        return $this->belongsTo(Genero::class, 'genero_id', 'id');
    }

    public function albumes()
    {
        return $this->belongsToMany(Album::class, 'album_cancion', 'cancion_id', 'album_id');
    }

    public function listasReproduccion()
    {
        return $this->belongsToMany(ListaReproduccion::class, 'cancion_lista_reproduccion');
    }

    public function interacciones()
    {
        return $this->hasMany(\App\Models\Interaccion::class, 'cancion_id');
    }

    public function comentarios()
    {
        return $this->hasMany(Interaccion::class)->where('tipo', 'comentario')->with('user:id,nombre,imagen_perfil');
    }
}
