<?php

namespace App\Http\Controllers;

use App\Models\Genero;
use Illuminate\Http\Request;

class GenerosController extends Controller
{
    public function getAllGeneros()
    {
        return response()->json(Genero::all(), 200);
    }

    public function getGeneroById($id)
    {
        return response()->json(Genero::find($id), 200);
    }

    public function getGeneroByNombre($nombre)
    {
        return response()->json(Genero::where('nombre', $nombre)->first(), 200);
    }

    public function createGenero(Request $request)
    {
        $this->validate($request, [
            'nombre' => 'required|string|max:255',
        ]);

        $genero = Genero::create([
            'nombre' => $request->nombre,
        ]);

        return response()->json($genero, 201);
    }

    public function deleteGenero($id)
    {
        $genero = Genero::find($id);
        if (!$genero) {
            return response()->json(['message' => 'Genero not found'], 404);
        }

        $genero->delete();

        return response()->json(['message' => 'Genero deleted successfully'], 200);
    }
    
}
