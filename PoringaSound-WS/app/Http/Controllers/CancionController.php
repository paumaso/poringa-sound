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
        $cancion = Cancion::find($id);

        if (!$cancion) {
            return response()->json(['message' => 'Canción no encontrada'], 404);
        }

        return response()->json($cancion, 200);
    }

    public function getRandomCancion()
    {
        $cancion = Cancion::inRandomOrder()->first();

        if (!$cancion) {
            return response()->json(['message' => 'No hay canciones disponibles'], 404);
        }

        return response()->json($cancion, 200);
    }

    public function getCancionesByAlbumId($id)
    {
        $canciones = Cancion::where('album_id', $id)->get();

        if ($canciones->isEmpty()) {
            return response()->json(['message' => 'No se encontraron canciones para este álbum'], 404);
        }

        return response()->json($canciones, 200);
    }

    public function getCancionesByGenero($genero)
    {
        $canciones = Cancion::where('genero', $genero)->get();

        if ($canciones->isEmpty()) {
            return response()->json(['message' => 'No se encontraron canciones para este género'], 404);
        }

        return response()->json($canciones, 200);
    }

    public function getCancionesByUserId(Request $request, $userId)
    {
        $perPage = $request->query('per_page', 10);
        $canciones = Cancion::where('user_id', $userId)->paginate($perPage);

        return response()->json($canciones, 200);
    }

    public function createCancion(Request $request)
    {
        $this->validateCancion($request);
        $archivo = $this->guardarArchivo($request);

        $cancion = Cancion::create([
            'titulo' => $request->titulo,
            'user_id' => auth()->user()->id,
            'album_id' => $request->album_id,
            'duracion' => $request->duracion,
            'archivo' => $archivo,
            'genero' => $request->genero,
            'active' => $request->active ?? false,
            'portada' => $request->portada,
        ]);

        return response()->json($cancion, 201);
    }

    public function actualizarCancion(Request $request, $id)
    {
        $this->validateCancion($request);
        $cancion = Cancion::find($id);

        if (!$cancion) {
            return response()->json(['message' => 'Canción no encontrada'], 404);
        }

        if ($cancion->user_id != auth()->user()->id) {
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
            'user_id' => auth()->user()->id,
            'album_id' => $request->album_id,
            'duracion' => $request->duracion,
            'archivo' => $archivo,
            'genero' => $request->genero,
            'active' => $request->active ?? false,
            'portada' => $request->portada,
        ]);

        return response()->json($cancion, 200);
    }

    public function deleteCancion($id)
    {
        $cancion = Cancion::find($id);

        if (!$cancion) {
            return response()->json(['message' => 'Canción no encontrada'], 404);
        }

        if ($cancion->user_id != auth()->user()->id) {
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
            'album_id' => 'nullable|exists:albumes,id',
            'duracion' => 'nullable|integer',
            'archivo' => 'required|file|mimes:mp3,wav,ogg|max:10240',
            'genero' => 'nullable|exists:generos,id',
            'active' => 'nullable|boolean',
            'portada' => 'nullable|image|mimes:jpeg,png,jpg|max:2048',
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