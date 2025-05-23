<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ListaReproduccion extends Model
{
    use HasFactory;
    protected $table = 'listas_reproduccion';

    protected $fillable = [
        'user_id',
        'nombre',
        'canciones_ids',
    ];

    protected $casts = [
        'canciones_ids' => 'array',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function canciones()
    {
        return $this->belongsToMany(Cancion::class, 'cancion_lista_reproduccion');
    }
}
