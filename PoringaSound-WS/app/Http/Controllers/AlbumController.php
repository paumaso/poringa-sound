<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Storage;
use Illuminate\Http\Request;
use App\Models\Album;
use Illuminate\Support\Facades\Date;

class AlbumController extends Controller
{
    public function getAllAlbums()
    {
        return response()->json(Album::with('artista')->get(), 200);
    }

    public function getAlbumById($id)
    {
        return response()->json(Album::find($id), 200);
    }

    public function getAlbumsByArtistId($id)
    {
        return response()->json(Album::where('artista_id', $id)->get(), 200);
    }

    public function getAlbumSongs($id)
    {
        $album = Album::find($id);
        return response()->json($album->canciones, 200);
    }

    public function createAlbum(Request $request)
    {
        $this->validateAlbum($request);
        $portada = $this->guardarPortada($request);

        $album = Album::create([
            'titulo' => $request->titulo,
            'artista_id' => $request->artista_id,
            'fecha_lanzamiento' => $request->fecha_lanzamiento,
            'portada' => $portada,
        ]);

        return response()->json($album, 201);
    }


    public function updateAlbum(Request $request, $id)
    {
        $this->validateAlbum($request);
        $album = Album::find($id);

        if ($album->artista_id != auth()->user()->id) {
            return response()->json(['message' => 'No autorizado'], 401);
        }

        if($album->portada && $request->hasFile('portada')) {
            if (Storage::disk('public')->exists($album->portada)) {
                Storage::disk('public')->delete($album->portada);
            }
        }

        $portada = $this->guardarPortada($request);
        $album->update([
            'titulo' => $request->titulo,
            'artista_id' => $request->artista_id,
            'fecha_lanzamiento' => $request->fecha_lanzamiento ?? new Date(),
            'portada' => $portada,
        ]);

        return response()->json($album, 200);
    }

    public function updateAlbumCancion(Request $request, $id)
    {
        $album = Album::find($id);

        if ($album->artista_id != auth()->user()->id) {
            return response()->json(['message' => 'No autorizado'], 401);
        }

        $album->canciones = $request->canciones;
        $album->save();

        return response()->json($album, 200);
    }


    public function deleteAlbum($id)
    {
        $album = Album::find($id);

        if ($album->artista_id != auth()->user()->id) {
            return response()->json(['message' => 'No autorizado'], 401);
        }

        if ($album->portada) {
            if (Storage::disk('public')->exists($album->portada)) {
                Storage::disk('public')->delete($album->portada);
            }
        }

        $album->delete();
        return response()->json(['message' => 'Album eliminado'], 200);
    }
    
    private function validateAlbum(Request $request)
    {
        $request->validate([
            'titulo' => 'required|string|max:255',
            'artista_id' => 'required|exists:artistas,id',
            'fecha_lanzamiento' => 'date',
            'portada' => 'required|image|mimes:jpeg,png,jpg|max:2048',
        ]);
    }

    private function guardarPortada(Request $request)
    {
        $imagePath = null;
        if ($request->hasFile('portada')) {
            $imageName = $request->titulo . '.jpg';
            $imagePath = $request->file('portada')->storeAs('album_covers', $imageName, 'public');
        }
        return $imagePath ? 'storage/' . $imagePath : null;
    }
}
