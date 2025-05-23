<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Interaccion extends Model
{
    use HasFactory;
    protected $table = 'interacciones';

    protected $fillable = [
        'user_id',
        'cancion_id',
        'tipo',
        'comentario',
        'puntuacion',
    ];

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id', 'id');
    }

    public function cancion()
    {
        return $this->belongsTo(Cancion::class);
    }

    public function denuncias()
    {
        return $this->morphMany(Denuncia::class, 'denunciable');
    }
}
