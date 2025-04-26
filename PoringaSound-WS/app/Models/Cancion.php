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
        'genero',
        'active',
        'portada',
    ];

    public function album()
    {
        return $this->belongsTo(Album::class);
    }

    public function listasReproduccion()
    {
        return $this->belongsToMany(ListaReproduccion::class, 'cancion_lista_reproduccion');
    }
}
