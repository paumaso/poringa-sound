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

    private function validateListaReproduccion(Request $request)
    {
        $request->validate([
            'nombre' => 'required',
            'user_id' => 'required',
            'canciones_ids' => 'required',
        ]);
    }
}
