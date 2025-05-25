<?php

namespace App\Http\Controllers;

use App\Models\Denuncia;
use App\Models\Cancion;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class DenunciaController extends Controller
{
    public function getDenuncias(Request $request)
    {
        $perPage = $request->get('per_page', 10);
        $denuncias = Denuncia::with(['usuario', 'cancion'])
            ->orderBy('created_at', 'desc')
            ->paginate($perPage);

        return response()->json($denuncias);
    }

    public function getDenunciasPendientes(Request $request)
    {
        $perPage = $request->get('per_page', 10);
        $denuncias = Denuncia::with(['usuario', 'cancion'])
            ->where('estado', 'pendiente')
            ->orderBy('created_at', 'desc')
            ->paginate($perPage);

        return response()->json($denuncias);
    }

    public function createDenuncia(Request $request)
    {
        $request->validate([
            'cancion_id' => 'required|integer|exists:canciones,id',
            'motivo' => 'required|string|max:1000',
        ]);

        $denuncia = Denuncia::create([
            'user_id' => Auth::id(),
            'cancion_id' => $request->cancion_id,
            'motivo' => $request->motivo,
            'estado' => 'pendiente',
        ]);

        return response()->json($denuncia, 201);
    }

    public function aceptarDenuncia($id)
    {
        $denuncia = Denuncia::findOrFail($id);
        $cancion = $denuncia->cancion;

        if ($cancion) {
            $cancion->delete();
        }

        $denuncia->estado = 'aceptado';
        $denuncia->save();

        return response()->json(['message' => 'Denuncia aceptada y canción eliminada.']);
    }

    public function rechazarDenuncia($id)
    {
        $denuncia = Denuncia::findOrFail($id);
        $denuncia->estado = 'denegado';
        $denuncia->save();

        return response()->json(['message' => 'Denuncia denegada.']);
    }
}
