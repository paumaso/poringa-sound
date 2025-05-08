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

    public function album()
    {
        return $this->belongsTo(Album::class);
    }

    public function listasReproduccion()
    {
        return $this->belongsToMany(ListaReproduccion::class, 'cancion_lista_reproduccion');
    }
}
