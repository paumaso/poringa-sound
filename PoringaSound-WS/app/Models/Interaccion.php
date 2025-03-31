<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Interaccion extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id', 'cancion_id', 'tipo', 'comentario', 'puntuacion',
    ];

    public function usuario()
    {
        return $this->belongsTo(User::class);
    }

    public function cancion()
    {
        return $this->belongsTo(Cancion::class);
    }
}
