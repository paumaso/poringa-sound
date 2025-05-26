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
    public function getAllCanciones(Request $request)
    {
        $perPage = $request->query('per_page', 10);
        $queryParam = $request->query('query');
        $generoId = $request->query('genero_id');
        $albumId = $request->query('album_id');
        $artista = $request->query('artista');
        $orden = $request->query('orden', 'nombre');
        $direccion = $request->query('direccion', 'asc');

        $canciones = Cancion::with([
            'genero:id,nombre',
            'user:id,nombre,imagen_perfil',
            'interacciones'
        ])
            ->where('active', 1);

        if ($queryParam) {
            $canciones->where('titulo', 'like', "%$queryParam%");
        }
        if ($generoId) {
            $canciones->where('genero_id', $generoId);
        }
        if ($artista) {
            $canciones->whereHas('user', function ($q) use ($artista) {
                $q->where('nombre', 'like', "%$artista%");
            });
        }

        if ($albumId) {
            $canciones->orderByRaw("
        CASE 
            WHEN EXISTS (
                SELECT 1 FROM album_cancion 
                WHERE album_cancion.cancion_id = canciones.id 
                AND album_cancion.album_id = ?
            ) THEN 0 ELSE 1 END,
        COALESCE((SELECT album_cancion.orden FROM album_cancion WHERE album_cancion.cancion_id = canciones.id AND album_cancion.album_id = ?), 99999) ASC
    ", [$albumId, $albumId]);
        }

        if ($orden === 'nombre') {
            $canciones->orderBy('titulo', $direccion);
        } elseif ($orden === 'artista') {
            $canciones->orderBy(
                \App\Models\User::select('nombre')
                    ->whereColumn('users.id', 'canciones.user_id')
                    ->limit(1),
                $direccion
            );
        } elseif ($orden === 'likes') {
            $canciones->withCount(['interacciones as likes_count' => function ($q) {
                $q->where('tipo', 'like');
            }])->orderBy('likes_count', $direccion);
        } elseif ($orden === 'interacciones') {
            $canciones->withCount(['interacciones as interacciones_count'])
                ->orderBy('interacciones_count', $direccion);
        }

        $canciones = $canciones->paginate($perPage);

        $canciones->getCollection()->transform(function ($cancion) {
            $totalLikes = $cancion->interacciones->where('tipo', 'like')->count();
            $mediaPuntuacion = $cancion->interacciones
                ->where('tipo', 'puntuacion')
                ->avg('puntuacion');

            $cancion->total_likes = $totalLikes;
            $cancion->media_puntuacion = round($mediaPuntuacion, 2);

            return $cancion;
        });

        return response()->json([
            'canciones' => $canciones,
        ], 200);
    }

    public function discover(Request $request)
    {
        $authUserId = auth()->id();
        $perPage = $request->query('per_page', 10);

        $generoFavorito = Interaccion::select('canciones.genero_id', DB::raw('count(*) as total'))
            ->join('canciones', 'interacciones.cancion_id', '=', 'canciones.id')
            ->where('interacciones.user_id', $authUserId)
            ->groupBy('canciones.genero_id')
            ->orderByDesc('total')
            ->value('genero_id');

        $canciones = Cancion::with([
            'genero:id,nombre',
            'user:id,nombre,imagen_perfil',
            'interacciones' => function ($query) use ($authUserId) {
                $query->where('user_id', $authUserId);
            }
        ])
            ->where('active', 1)
            ->orderByRaw("
            CASE 
                WHEN genero_id = ? THEN 0 
                ELSE 1 
            END", [$generoFavorito])
            ->paginate($perPage);

        $canciones->getCollection()->transform(function ($cancion) use ($authUserId) {
            $totalLikes = $cancion->interacciones()->where('tipo', 'like')->count();
            $mediaPuntuacion = $cancion->interacciones()->where('tipo', 'puntuacion')->avg('puntuacion');

            $cancion->total_likes = $totalLikes;
            $cancion->media_puntuacion = round($mediaPuntuacion, 2);

            if ($authUserId) {
                $interacciones = $cancion->interacciones;
                $cancion->has_liked = $interacciones->firstWhere('tipo', 'like') !== null;
                $cancion->puntuacion_usuario = optional($interacciones->firstWhere('tipo', 'puntuacion'))->puntuacion;
                unset($cancion->interacciones);
            } else {
                $cancion->has_liked = false;
                $cancion->puntuacion_usuario = null;
            }
            return $cancion;
        });

        return response()->json([
            'genero_favorito' => $generoFavorito,
            'canciones' => $canciones,
        ], 200);
    }

    public function getCancionesByUserId(Request $request, $userId)
    {
        $perPage = $request->query('per_page', 10);
        $authUserId = auth()->id();

        $query = Cancion::where('user_id', $userId)
            ->with([
                'genero:id,nombre',
                'user:id,nombre',
                'interacciones' => function ($query) use ($authUserId) {
                    $query->where('user_id', $authUserId);
                }
            ]);

        $queryParam = $request->query('query');
        if ($queryParam) {
            $query->where('titulo', 'like', "%$queryParam%");
        }

        $generoId = $request->query('genero_id');
        if ($generoId) {
            $query->where('genero_id', $generoId);
        }

        $orden = $request->query('orden', 'nombre');
        $direccion = $request->query('direccion', 'asc');
        if ($orden === 'nombre') {
            $query->orderBy('titulo', $direccion);
        } elseif ($orden === 'likes') {
            $query->withCount(['interacciones as likes_count' => function ($q) {
                $q->where('tipo', 'like');
            }])->orderBy('likes_count', $direccion);
        } elseif ($orden === 'interacciones') {
            $query->withCount(['interacciones as interacciones_count'])
                ->orderBy('interacciones_count', $direccion);
        }

        $canciones = $query->paginate($perPage);

        return response()->json($canciones, 200);
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

        $totalLikes = $cancion->interacciones()
            ->where('tipo', 'like')
            ->count();

        $mediaPuntuacion = $cancion->interacciones()
            ->where('tipo', 'puntuacion')
            ->avg('puntuacion');

        $cancion->total_likes = $totalLikes;
        $cancion->media_puntuacion = round($mediaPuntuacion, 2);

        if ($authUserId) {
            $interacciones = $cancion->interacciones;

            $cancion->has_liked = $interacciones->firstWhere('tipo', 'like') !== null;
            $cancion->puntuacion_usuario = optional($interacciones->firstWhere('tipo', 'puntuacion'))->puntuacion;

            unset($cancion->interacciones);
        } else {
            $cancion->has_liked = false;
            $cancion->puntuacion_usuario = null;
        }

        return response()->json($cancion);
    }

    public function getCancionById($cancionId)
    {
        $authUserId = auth()->id();

        $withRelations = [
            'genero:id,nombre',
            'user:id,nombre,imagen_perfil',
            'comentarios.user:id,nombre,imagen_perfil',
        ];

        if ($authUserId) {
            $withRelations['interacciones'] = function ($query) use ($authUserId) {
                $query->where('user_id', $authUserId);
            };
        }

        $cancion = \App\Models\Cancion::with($withRelations)->find($cancionId);

        if (!$cancion) {
            return response()->json(['message' => 'Canción no encontrada'], 404);
        }

        $totalLikes = $cancion->interacciones()->where('tipo', 'like')->count();
        $mediaPuntuacion = $cancion->interacciones()->where('tipo', 'puntuacion')->avg('puntuacion');

        $cancion->total_likes = $totalLikes;
        $cancion->media_puntuacion = $mediaPuntuacion ? round($mediaPuntuacion, 2) : null;

        if ($authUserId) {
            $interacciones = $cancion->interacciones ?? collect();

            $cancion->has_liked = $interacciones->firstWhere('tipo', 'like') !== null;
            $cancion->puntuacion_usuario = optional($interacciones->firstWhere('tipo', 'puntuacion'))->puntuacion;

            unset($cancion->interacciones);
        } else {
            $cancion->has_liked = false;
            $cancion->puntuacion_usuario = null;
        }

        return response()->json($cancion, 200);
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
        $cancion = Cancion::find($id);
        if (!$cancion) return response()->json(['message' => 'Canción no encontrada'], 404);

        try {
            $this->validateCancion($request);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json(['errors' => $e->errors()], 422);
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

        $data = [
            'titulo' => $request->titulo,
            'user_id' => auth()->user()->id,
            'album_id' => $request->album_id,
            'duracion' => $request->duracion,
            'genero_id' => $request->genero_id,
            'active' => $request->active,
        ];

        if ($archivo !== null) {
            $data['archivo'] = $archivo;
        }

        if ($portada !== null) {
            $data['portada'] = $portada;
        }

        $cancion->update($data);
        $cancion->load('genero');

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
            'archivo' => 'nullable|file|mimes:mp3', 
            'genero_id' => 'nullable|exists:generos,id',
            'active' => 'nullable|boolean',
            'portada' => 'nullable|image|mimes:jpeg,png,jpg,gif,webp',
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
