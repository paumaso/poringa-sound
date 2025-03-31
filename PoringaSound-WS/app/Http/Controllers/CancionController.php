<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Storage;
use Illuminate\Http\Request;
use App\Models\Cancion;

class CancionController extends Controller
{
    public function getAllCanciones()
    {
        return response()->json(Cancion::all(), 200);
    }

    public function getCancionById($id)
    {
        return response()->json(Cancion::find($id), 200);
    }

    public function getRandomCancion()
    {
        return response()->json(Cancion::inRandomOrder()->first(), 200);
    }

    public function getCancionesByAlbumId($id)
    {
        return response()->json(Cancion::where('album_id', $id)->get(), 200);
    }

    public function getCancionesByGenero($genero)
    {
        return response()->json(Cancion::where('genero', $genero)->get(), 200);
    }

    public function createCancion(Request $request)
    {
        $this->validateCancion($request);
        $archivo = $this->guardarArchivo($request);

        $cancion = Cancion::create([
            'titulo' => $request->titulo,
            'album_id' => $request->album_id,
            'duracion' => $request->duracion,
            'archivo' => $archivo,
            'genero' => $request->genero,
        ]);

        return response()->json($cancion, 201);
    }

    public function actualizarCancion(Request $request, $id)
    {
        $this->validateCancion($request);
        $cancion = Cancion::find($id);

        if ($cancion->album->artista->user_id != auth()->user()->id) {
            return response()->json(['message' => 'No autorizado'], 401);
        }

        if ($cancion->archivo && $request->hasFile('archivo')) {
            if (Storage::disk('public')->exists($cancion->archivo)) {
                Storage::disk('public')->delete($cancion->archivo);
            }
        }

        $archivo = $this->guardarArchivo($request);
        $cancion->update([
            'titulo' => $request->titulo,
            'album_id' => $request->album_id,
            'duracion' => $request->duracion,
            'archivo' => $archivo,
            'genero' => $request->genero,
        ]);

        return response()->json($cancion, 200);
    }

    public function deleteCancion($id)
    {
        $cancion = Cancion::find($id);

        if ($cancion->album->artista->user_id != auth()->user()->id) {
            return response()->json(['message' => 'No autorizado'], 401);
        }

        if ($cancion->archivo) {
            if (Storage::disk('public')->exists($cancion->archivo)) {
                Storage::disk('public')->delete($cancion->archivo);
            }
        }

        $cancion->delete();
        return response()->json(['message' => 'Canción eliminada'], 200);
    }

    private function validateCancion(Request $request)
    {
        $request->validate([
            'titulo' => 'required|string|max:255',
            'album_id' => 'exists:albums,id',
            'duracion' => 'integer',
            'archivo' => 'required|file|mimes:mp3,wav,ogg|max:10240',
            'genero' => 'required|string|max:255',
        ]);
    }

    private function guardarArchivo(Request $request)
    {
        if (!$request->hasFile('archivo')) {
            return null;
        }

        $cancion = $request->file('archivo');
        $nombreSanitizado = preg_replace('/[^A-Za-z0-9\-]/', '-', $request->titulo);
        $nombreCancion = $nombreSanitizado . '-' . time() . '.' . $cancion->getClientOriginalExtension();
        $cancion->storeAs('canciones', $nombreCancion, 'public');

        return 'storage/canciones/' . $nombreCancion;
    }
}
