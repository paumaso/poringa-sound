<?php

namespace App\Http\Controllers;

use App\Models\Generos;
use Illuminate\Http\Request;

class GenerosController extends Controller
{
    public function getAllGeneros()
    {
        return response()->json(Generos::all(), 200);
    }

    public function getGeneroById($id)
    {
        return response()->json(Generos::find($id), 200);
    }

    public function getGeneroByNombre($nombre)
    {
        return response()->json(Generos::where('nombre', $nombre)->first(), 200);
    }

    public function createGenero(Request $request)
    {
        $this->validate($request, [
            'nombre' => 'required|string|max:255',
        ]);

        $genero = Generos::create([
            'nombre' => $request->nombre,
        ]);

        return response()->json($genero, 201);
    }

    public function deleteGenero($id)
    {
        $genero = Generos::find($id);
        if (!$genero) {
            return response()->json(['message' => 'Genero not found'], 404);
        }

        $genero->delete();

        return response()->json(['message' => 'Genero deleted successfully'], 200);
    }
    
}
