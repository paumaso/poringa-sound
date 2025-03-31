<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Album extends Model
{
    use HasFactory;

    protected $fillable = [
        'titulo',
        'artista_id',
        'fecha_lanzamiento',
        'portada',
    ];

    protected $casts = [
        'canciones' => 'array',
    ];

    public function canciones()
    {
        return $this->hasMany(Cancion::class);
    }

    public function artista()
    {
        return $this->belongsTo(Artista::class);
    }
}
