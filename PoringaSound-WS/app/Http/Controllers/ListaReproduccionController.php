<?php

namespace App\Http\Controllers;

use App\Models\ListaReproduccion;
use Illuminate\Http\Request;

class ListaReproduccionController extends Controller
{
    public function getAllListasReproduccion()
    {
        return response()->json(ListaReproduccion::with('user')->get(), 200);
    }

    public function getListaReproduccionById($id)
    {
        return response()->json(ListaReproduccion::find($id), 200);
    }

    public function getLlistaReproducionsByUserId($id)
    {
        return response()->json(ListaReproduccion::where('user_id', $id)->get(), 200);
    }

    public function createListaReproduccion(Request $request)
    {
        $this->validateListaReproduccion($request);

        $lista = ListaReproduccion::create([
            'user_id' => auth()->user()->id,
            'nombre' => $request->nombre,
            'canciones' => $request->canciones,
            'active' => $request->active ?? false, // Manejo del campo active
        ]);

        return response()->json($lista, 201);
    }

    public function updateListaReproduccion(Request $request, $id)
    {
        $this->validateListaReproduccion($request);
        $lista = ListaReproduccion::find($id);

        if ($lista->user_id != auth()->user()->id) {
            return response()->json(['message' => 'No autorizado'], 401);
        }

        $lista->update([
            'nombre' => $request->nombre,
            'canciones' => $request->canciones,
            'active' => $request->active ?? $lista->active, // Manejo del campo active
        ]);

        return response()->json($lista, 200);
    }

    private function validateListaReproduccion(Request $request)
    {
        $request->validate([
            'nombre' => 'required',
            'user_id' => 'required',
            'canciones_ids' => 'required',
            'active' => 'boolean',
        ]);
    }
}
