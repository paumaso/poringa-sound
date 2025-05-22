<?php

namespace App\Http\Controllers;

use App\Models\Denuncia;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class DenunciaController extends Controller
{
    public function getDenuncias()
    {
        $this->authorize('admin-only');

        $denuncias = Denuncia::with(['usuario', 'denunciable'])->get();

        return response()->json($denuncias);
    }

    public function createDenuncia(Request $request)
    {
        $request->validate([
            'denunciable_id' => 'required|integer',
            'denunciable_type' => 'required|string',
            'motivo' => 'required|string|max:1000',
        ]);

        $denuncia = Denuncia::create([
            'user_id' => Auth::id(),
            'denunciable_id' => $request->denunciable_id,
            'denunciable_type' => $request->denunciable_type,
            'motivo' => $request->motivo,
            'estado' => 'pendiente',
        ]);

        return response()->json($denuncia, 201);
    }

    public function aceptarDenuncia($id)
    {
        $this->authorize('admin-only');

        $denuncia = Denuncia::findOrFail($id);
        $denunciado = $denuncia->denunciable;

        $denunciado->delete();

        $denuncia->estado = 'aceptada';
        $denuncia->save();

        return response()->json(['message' => 'Denuncia aceptada y contenido eliminado.']);
    }

    public function rechazarDenuncia($id)
    {
        $this->authorize('admin-only');

        $denuncia = Denuncia::findOrFail($id);
        $denuncia->estado = 'rechazada';
        $denuncia->save();

        return response()->json(['message' => 'Denuncia rechazada.']);
    }
}

