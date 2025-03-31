<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use App\Models\Artista;

class ArtistaController extends Controller
{
    public function getAllArtistas()
    {
        return response()->json(Artista::with('user')->get(), 200);
    }

    public function getArtistaById($id)
    {
        return response()->json(Artista::find($id), 200);
    }

    public function createArtista(Request $request)
    {
        $this->validateArtista($request);
        $imagePath = $this->guardarImagenPortada($request);

        $artista = Artista::create([
            'users_id' => auth()->user()->id,
            'nombre_artistico' => $request->nombre_artistico,
            'descripcion' => $request->descripcion,
            'imagen_portada' => $imagePath,
        ]);

        return response()->json($artista, 201);
    }

    public function updateArtista(Request $request, $id)
    {
        $this->validateArtista($request);
        $artista = Artista::find($id);

        if ($artista->user_id != auth()->user()->id) {
            return response()->json(['message' => 'No autorizado'], 401);
        }

        if ($artista->imagen_portada && $request->hasFile('imagen_portada')) {
            if (Storage::disk('public')->exists($artista->imagen_portada)) {
                Storage::disk('public')->delete($artista->imagen_portada);
            }
        }

        $imagePath = $this->guardarImagenPortada($request);
        $artista->update([
            'nombre_artistico' => $request->nombre_artistico,
            'descripcion' => $request->descripcion,
            'imagen_portada' => $imagePath,
        ]);

        return response()->json($artista, 200);
    }

    public function deleteArtista($id)
    {
        $artista = Artista::find($id);

        if ($artista->user_id != auth()->user()->id) {
            return response()->json(['message' => 'No autorizado'], 401);
        }

        if ($artista->imagen_portada) {
            if (Storage::disk('public')->exists($artista->imagen_portada)) {
                Storage::disk('public')->delete($artista->imagen_portada);
            }
        }

        $artista->delete();
        return response()->json(['message' => 'Artista eliminado'], 200);
    }



    private function validateArtista(Request $request)
    {
        $request->validate([
            'nombre_artistico' => 'required|string|max:255',
            'descripcion' => 'nullable|string',
            'imagen_portada' => 'nullable|image|mimes:jpeg,png,jpg|max:2048',
        ]);
    }

    private function guardarImagenPortada(Request $request)
    {
        $imagePath = null;

        if ($request->hasFile('imagen_portada')) {
            $extension = $request->file('imagen_portada')->getClientOriginalExtension();
            $sanitizedFileName = preg_replace('/[^A-Za-z0-9\-]/', '-', $request->nombre_artistico);
            $imageName = $sanitizedFileName . '-' . time() . '.' . $extension;
            $imagePath = $request->file('imagen_portada')->storeAs('artista_portadas', $imageName, 'public');
        }
        return $imagePath ? 'storage/' . $imagePath : null;
    }
}
