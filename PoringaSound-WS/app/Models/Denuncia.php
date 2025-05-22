<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Denuncia extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'denunciable_id',
        'denunciable_type',
        'motivo',
        'estado',
    ];

    public function usuario()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function denunciable()
    {
        return $this->morphTo();
    }
}
