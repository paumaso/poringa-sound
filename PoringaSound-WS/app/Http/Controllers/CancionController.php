<?php

namespace App\Http\Controllers;

use App\Models\Interaccion;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use App\Models\Cancion;

class CancionController extends Controller
{
    public function getCancionesOrdenRandom(Request $request)
    {
        $perPage = $request->query('per_page', 10);

        $canciones = Cancion::with([
            'genero:id,nombre',
            'user:id,nombre',
        ])->where('active', 1)->inRandomOrder()->paginate($perPage);

        return response()->json($canciones, 200);
    }

    public function getCancionesOrdenadasPorPreferencia(Request $request)
    {
        $authUserId = auth()->id();
        $perPage = $request->query('per_page', 20);

        $generoFavorito = Interaccion::select('canciones.genero_id', DB::raw('count(*) as total'))
            ->join('canciones', 'interacciones.cancion_id', '=', 'canciones.id')
            ->where('interacciones.user_id', $authUserId)
            ->groupBy('canciones.genero_id')
            ->orderByDesc('total')
            ->value('genero_id');

        $canciones = Cancion::with(['genero:id,nombre', 'user:id,nombre'])
            ->where('active', 1)
            ->orderByRaw("
            CASE 
                WHEN genero_id = ? THEN 0 
                ELSE 1 
            END, RAND()
        ", [$generoFavorito])
            ->paginate($perPage);

        return response()->json([
            'genero_favorito' => $generoFavorito,
            'canciones' => $canciones,
        ],);
    }

    public function getRandomCancion()
    {
        $authUserId = auth()->id();

        $cancion = Cancion::where('active', 1)
            ->inRandomOrder()
            ->with([
                'genero:id,nombre',
                'user:id,nombre',
                'comentarios',
                'interacciones' => function ($query) use ($authUserId) {
                    $query->where('user_id', $authUserId);
                }
            ])
            ->first();

        if (!$cancion) {
            return response()->json(['message' => 'No hay canciones disponibles'], 404);
        }

        $interacciones = $cancion->interacciones;

        $cancion->has_liked = $interacciones->firstWhere('tipo', 'like') !== null;
        $cancion->puntuacion_usuario = optional($interacciones->firstWhere('tipo', 'puntuacion'))->puntuacion;

        unset($cancion->interacciones);

        return response()->json($cancion);
    }

    public function getCancionById($cancionId)
    {
        Log::info('Entrando a getCancionById', ['cancion_id' => $cancionId]);

        $authUserId = auth()->id();
        Log::info('Auth user ID', ['user_id' => $authUserId]);

        $withRelations = [
            'genero:id,nombre',
            'user:id,nombre',
            'comentarios',
        ];

        if ($authUserId) {
            $withRelations['interacciones'] = function ($query) use ($authUserId) {
                $query->where('user_id', $authUserId);
            };
        }

        $cancion = Cancion::where('id', $cancionId)
            ->with($withRelations)
            ->first();

        if ($authUserId) {
            $interacciones = $cancion->interacciones;

            $cancion->has_liked = $interacciones->firstWhere('tipo', 'like') !== null;
            $cancion->puntuacion_usuario = optional($interacciones->firstWhere('tipo', 'puntuacion'))->puntuacion;

            unset($cancion->interacciones);
        } else {
            $cancion->has_liked = false;
            $cancion->puntuacion_usuario = null;
        }

        if (!$cancion) {
            return response()->json(['message' => 'Canción no encontrada'], 404);
        }


        return response()->json($cancion, 200);
    }


    public function getCancionesByUserId(Request $request, $userId)
    {
        $perPage = $request->query('per_page', 10);
        $authUserId = auth()->id();

        $canciones = Cancion::where('user_id', $userId)
            ->with(['genero:id,nombre', 'user:id,nombre', 'interacciones' => function ($query) use ($authUserId) {
                $query->where('user_id', $authUserId);
            }])
            ->paginate($perPage);

        return response()->json($canciones, 200);
    }

    public function createCancion(Request $request)
    {
        try {
            $this->validateCancion($request);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json(['errors' => $e->errors()], 422);
        }

        $archivo = $this->guardarArchivo($request);
        $portada = $this->guardarPortada($request);

        $cancion = Cancion::create([
            'titulo' => $request->titulo,
            'user_id' => auth()->user()->id,
            'album_id' => $request->album_id,
            'duracion' => $request->duracion,
            'archivo' => $archivo,
            'genero_id' => $request->genero_id,
            'active' => $request->active,
            'portada' => $portada,
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

        if ($cancion->portada && $request->hasFile('portada')) {
            if (Storage::disk('public')->exists($cancion->portada)) {
                Storage::disk('public')->delete($cancion->portada);
            }
        }

        $archivo = $this->guardarArchivo($request);
        $portada = $this->guardarPortada($request);

        $cancion->update([
            'titulo' => $request->titulo,
            'user_id' => auth()->user()->id,
            'album_id' => $request->album_id,
            'duracion' => $request->duracion,
            'archivo' => $archivo,
            'genero_id' => $request->genero_id,
            'active' => $request->active,
            'portada' => $portada,
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
            'archivo' => 'nullable|file',
            'genero_id' => 'nullable|exists:genero,id',
            'active' => 'nullable|boolean',
            'portada' => 'nullable|image',
        ]);
    }

    private function guardarArchivo(Request $request)
    {
        if (!$request->hasFile('archivo')) {
            return null;
        }

        $archivo = $request->file('archivo');
        $nombreSanitizado = preg_replace('/[^A-Za-z0-9\-]/', '-', $request->titulo);
        $nombreArchivo = $nombreSanitizado . '-' . time() . '.' . $archivo->getClientOriginalExtension();
        $archivo->storeAs('canciones/audios', $nombreArchivo, 'public');

        return 'storage/canciones/audios/' . $nombreArchivo;
    }

    private function guardarPortada(Request $request)
    {
        if (!$request->hasFile('portada')) {
            return null;
        }

        $portada = $request->file('portada');
        $nombreSanitizado = preg_replace('/[^A-Za-z0-9\-]/', '-', $request->titulo);
        $nombrePortada = $nombreSanitizado . '-portada-' . time() . '.' . $portada->getClientOriginalExtension();
        $portada->storeAs('canciones/portadas', $nombrePortada, 'public');

        return 'storage/canciones/portadas/' . $nombrePortada;
    }
}
