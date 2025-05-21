<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Album;
use App\Models\Cancion;
use Illuminate\Support\Facades\Storage;

class AlbumController extends Controller
{
    public function getAllAlbums(Request $request)
    {
        $query =  Album::with('user');

        if ($request->has('titulo') && $request->titulo !== '') {
            $query->where('titulo', 'like', '%' . $request->titulo . '%');
        }

        if ($request->has('artista') && $request->artista !== '') {
            $query->whereHas('user', function ($q) use ($request) {
                $q->where('nombre', 'like', '%' . $request->artista . '%');
            });
        }

        $orden = $request->get('orden', 'titulo');
        $direccion = $request->get('direccion', 'asc');
        $query->orderBy($orden, $direccion);

        $perPage = $request->get('perPage', 10);
        $albums = $query->paginate($perPage);

        return response()->json(['albums' => $albums]);
    }

    public function getAlbumById(Request $request, $id)
    {
        $perPage = $request->query('per_page', 10);
        $album = Album::with('user')->find($id);

        if (!$album) {
            return response()->json(['message' => 'Álbum no encontrado'], 404);
        }

        $canciones = $album->canciones()->with('user')->paginate($perPage);
        $album->canciones = $canciones;
        return response()->json($album, 200);
    }

    public function getAlbumByUserId(Request $request, $userId)
    {
        $perPage = $request->query('per_page', 10);
        $titulo = $request->query('titulo');

        $query = Album::with('canciones')->where('user_id', $userId);

        if ($titulo) {
            $query->where('titulo', 'like', '%' . $titulo . '%');
        }

        $albums = $query->paginate($perPage);

        return response()->json($albums, 200);
    }

    public function createAlbum(Request $request)
    {
        $request->validate([
            'titulo' => 'required|string|max:255',
            'fecha_lanzamiento' => 'nullable|date',
            'active' => 'nullable|boolean',
            'portada' => 'nullable|image|mimes:jpeg,png,jpg|max:2048',
            'canciones' => 'nullable|array',
            'canciones.*' => 'exists:canciones,id'
        ]);

        $portada = null;
        if ($request->hasFile('portada')) {
            $portadaPath = $request->file('portada')->store('album_covers', 'public');
            $portada = 'storage/' . $portadaPath;
        }

        $album = Album::create([
            'user_id' => auth()->id(),
            'titulo' => $request->titulo,
            'fecha_lanzamiento' => $request->fecha_lanzamiento,
            'active' => $request->active ?? false,
            'portada' => $portada,
        ]);

        if ($request->has('canciones')) {
            $album->canciones()->sync($request->canciones);
        }

        return response()->json($album->load('canciones'), 201);
    }

    public function updateAlbum(Request $request, $id)
    {
        $album = Album::find($id);

        if (!$album) {
            return response()->json(['message' => 'Álbum no encontrado'], 404);
        }

        if ($album->user_id !== auth()->id()) {
            return response()->json(['message' => 'No autorizado'], 403);
        }

        $request->validate([
            'titulo' => 'sometimes|required|string|max:255',
            'fecha_lanzamiento' => 'nullable|date',
            'active' => 'nullable|boolean',
            'portada' => 'nullable|image|mimes:jpeg,png,jpg',
            'canciones' => 'nullable|array',
            'canciones.*' => 'exists:canciones,id'
        ]);

        if ($request->hasFile('portada')) {
            if ($album->portada && Storage::disk('public')->exists(str_replace('storage/', '', $album->portada))) {
                Storage::disk('public')->delete(str_replace('storage/', '', $album->portada));
            }
            $portadaPath = $request->file('portada')->store('album_covers', 'public');
            $album->portada = 'storage/' . $portadaPath;
        }

        $album->fill($request->only(['titulo', 'fecha_lanzamiento', 'active']));
        $album->save();

        if ($request->has('canciones')) {
            $album->canciones()->sync($request->canciones);
        }

        return response()->json($album->load('canciones'), 200);
    }

    public function deleteAlbum($id)
    {
        $album = Album::find($id);

        if (!$album) {
            return response()->json(['message' => 'Álbum no encontrado'], 404);
        }

        if ($album->user_id !== auth()->id()) {
            return response()->json(['message' => 'No autorizado'], 403);
        }

        if ($album->portada && Storage::disk('public')->exists(str_replace('storage/', '', $album->portada))) {
            Storage::disk('public')->delete(str_replace('storage/', '', $album->portada));
        }

        $album->canciones()->detach();

        $album->delete();

        return response()->json(['message' => 'Álbum eliminado'], 200);
    }
}
