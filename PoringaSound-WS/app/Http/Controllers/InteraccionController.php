<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Interaccion;

class InteraccionController extends Controller
{
    public function getAllInteracciones()
    {
        return response()->json(Interaccion::all(), 200);
    }

    public function getInteraccionById($id)
    {
        return response()->json(Interaccion::find($id), 200);
    }

    public function getInteraccionesByUserId($id)
    {
        return response()->json(Interaccion::where('user_id', $id)->get(), 200);
    }

    public function getComentariosByCancionId($id)
    {
        return response()->json(Interaccion::where('cancion_id', $id)->where('tipo', 'comentario')->whereNotNull('comentario')->get(), 200);
    }

    public function getLikesByCancionId($id)
    {
        return response()->json(Interaccion::where('cancion_id', $id)->where('tipo', 'like')->get(), 200);
    }

    public function getMediaPuntuacionByCancionId($id)
    {
        return response()->json(Interaccion::where('cancion_id', $id)->where('tipo', 'puntuacion')->avg('puntuacion'), 200);
    }

    public function likeCnacion(Request $request){
        $this->validateInteraccion($request);
        $interaccion = Interaccion::create([
            'user_id' => auth()->user()->id,
            'cancion_id' => $request->cancion_id,
            'tipo' => 'like',
        ]);

        return response()->json($interaccion, 201);
    }

    public function comentarCancion(Request $request){
        $this->validateInteraccion($request);
        $interaccion = Interaccion::create([
            'user_id' => auth()->user()->id,
            'cancion_id' => $request->cancion_id,
            'comentario' => $request->comentario,
            'tipo' => 'comentario',
        ]);

        return response()->json($interaccion, 201);
    }

    public function puntuarCancion(Request $request){
        $this->validateInteraccion($request);
        $interaccion = Interaccion::create([
            'user_id' => auth()->user()->id,
            'cancion_id' => $request->cancion_id,
            'puntuacion' => $request->puntuacion,
            'tipo' => 'puntuacion',
        ]);

        return response()->json($interaccion, 201);
    }

    

    private function validateInteraccion(Request $request)
    {
        $request->validate([
            'cancion_id' => 'required|exists:canciones,id',
            'comentario' => 'nullable|string',
            'puntuacion' => 'nullable|integer|between:1,5',
        ]);
    }
}
