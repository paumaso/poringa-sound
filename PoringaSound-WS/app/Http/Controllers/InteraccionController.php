<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Interaccion;

class InteraccionController extends Controller
{
    public function totalLikes($cancionId)
    {
        $total = Interaccion::where('cancion_id', $cancionId)
            ->where('tipo', 'like')
            ->count();

        return response()->json(['likes' => $total]);
    }

    public function mediaPuntuacion($cancionId)
    {
        $media = Interaccion::where('cancion_id', $cancionId)
            ->where('tipo', 'puntuacion')
            ->avg('puntuacion');

        return response()->json(['media_puntuacion' => round($media, 2)]);
    }

    public function comentariosCancion($cancionId)
    {
        $comentarios = Interaccion::with('usuario:id,nombre')
            ->where('cancion_id', $cancionId)
            ->where('tipo', 'comentario')
            ->whereNotNull('comentario')
            ->get(['comentario', 'user_id', 'created_at']);

        return response()->json($comentarios);
    }

    public function likeCancion(Request $request)
    {
        $this->validateInteraccion($request, 'like');

        $userId = auth()->id();
        $cancionId = $request->cancion_id;

        $existingLike = Interaccion::where('user_id', $userId)
            ->where('cancion_id', $cancionId)
            ->where('tipo', 'like')
            ->first();

        if ($existingLike) {
            return response()->json([
                'message' => 'Ya has dado like a esta canción.'
            ], 409);
        }

        $interaccion = Interaccion::create([
            'user_id' => $userId,
            'cancion_id' => $cancionId,
            'tipo' => 'like',
        ]);

        return response()->json($interaccion, 201);
    }

    public function quitarLike(Request $request)
    {
        $this->validateInteraccion($request, 'like');

        $userId = auth()->id();
        $cancionId = $request->cancion_id;

        $existingLike = Interaccion::where('user_id', $userId)
            ->where('cancion_id', $cancionId)
            ->where('tipo', 'like')
            ->first();

        if (!$existingLike) {
            return response()->json([
                'message' => 'No has dado like a esta canción.'
            ], 404);
        }

        $existingLike->delete();

        return response()->json([
            'message' => 'Like eliminado correctamente.',
        ], 200);
    }

    public function comentarCancion(Request $request)
    {
        $this->validateInteraccion($request, 'comentario');

        $interaccion = Interaccion::create([
            'user_id' => auth()->id(),
            'cancion_id' => $request->cancion_id,
            'comentario' => $request->comentario,
            'tipo' => 'comentario',
        ]);

        return response()->json($interaccion, 201);
    }

    public function puntuarCancion(Request $request)
    {
        $this->validateInteraccion($request, 'puntuacion');

        $userId = auth()->id();
        $cancionId = $request->cancion_id;

        $interaccion = Interaccion::where('user_id', $userId)
            ->where('cancion_id', $cancionId)
            ->where('tipo', 'puntuacion')
            ->first();

        if ($interaccion) {
            $interaccion->puntuacion = $request->puntuacion;
            $interaccion->save();
        } else {
            $interaccion = Interaccion::create([
                'user_id' => $userId,
                'cancion_id' => $cancionId,
                'puntuacion' => $request->puntuacion,
                'tipo' => 'puntuacion',
            ]);
        }

        return response()->json($interaccion, 200);
    }



    private function validateInteraccion(Request $request, $tipo = null)
    {
        $rules = [
            'cancion_id' => 'required|exists:canciones,id',
        ];

        if ($tipo === 'comentario') {
            $rules['comentario'] = 'required|string';
        }

        if ($tipo === 'puntuacion') {
            $rules['puntuacion'] = 'required|integer|between:1,5';
        }

        $request->validate($rules);
    }
}
