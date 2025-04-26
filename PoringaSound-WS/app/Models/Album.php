<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Album extends Model
{
    use HasFactory;

    protected $table = 'albumes';

    protected $fillable = [
        'titulo',
        'user_id',
        'active',
        'portada',
        'fecha_lanzamiento',
    ];

    protected $casts = [
        'canciones' => 'array',
    ];

    public function canciones()
    {
        return $this->hasMany(Cancion::class);
    }
}
