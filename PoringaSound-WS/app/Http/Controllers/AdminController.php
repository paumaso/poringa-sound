<?php

namespace App\Http\Controllers;
use Illuminate\Http\Request;
use App\Models\User;
use App\Models\Interaccion;
use App\Models\Cancion;
use App\Models\Album;
use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class AdminController extends Controller
{
    public function deleteUser($id)
    {
        if(auth()->user()->tipo_usuario != 'admin') {
            return response()->json(['message' => 'No autorizado'], 401);
        } else {
            $user = User::find($id);
            $user->delete();
            return response()->json(['message' => 'Usuario eliminado'], 200);
        }
    }

    public function deleteCancion($id)
    {
        if(auth()->user()->tipo_usuario != 'admin') {
            return response()->json(['message' => 'No autorizado'], 401);
        } else {
            $cancion = Cancion::find($id);
            $cancion->delete();
            return response()->json(['message' => 'Canción eliminada'], 200);
        }
    }

    public function deleteAlbum($id)
    {
        if(auth()->user()->tipo_usuario != 'admin') {
            return response()->json(['message' => 'No autorizado'], 401);
        } else {
            $album = Album::find($id);
            $album->delete();
            return response()->json(['message' => 'Álbum eliminado'], 200);
        }
    }   

    public function deleteInteracion($id)
    {
        if(auth()->user()->tipo_usuario != 'admin') {
            return response()->json(['message' => 'No autorizado'], 401);
        } else {
            $interaccion = Interaccion::find($id);
            $interaccion->delete();
            return response()->json($interaccion, 200);
        }
    }

    private function validateRequest(Request $request): array
    {
        return $request->validate([
            'nombre' => 'required|string',
            'email' => 'required|string|email|unique:users,email',
            'password' => 'required|string',
            'tipo' => 'in:usuario,artista,admin',
            'imagen_perfil' => 'nullable|string',
        ]);
    }

    public function createUser(Request $request)
    {
        if(auth()->user()->tipo_usuario != 'admin') {
            return response()->json(['message' => 'No autorizado'], 401);
        } else {
            $validated = $this->validateRequest($request);
            $user = User::create($validated);
            return response()->json($user, 201);
        }
    }

    public function editUser(Request $request, $id)
    {
        if(auth()->user()->tipo_usuario != 'admin') {
            return response()->json(['message' => 'No autorizado'], 401);
        } else {
            $user = User::find($id);
            $this->validateRequest($request);
            $user->update($request->all());
            return response()->json($user, 200);
        }
    }

    private function validateCancion(Request $request)
    {
        $request->validate([
            'titulo' => 'required|string|max:255',
            'album_id' => 'required|exists:albums,id',
            'duracion' => 'required',
            'archivo' => 'required|file|mimes:mp3,wav,ogg|max:10240',
            'genero' => 'required|string|max:255',
        ]);
    }

    public function editCancion(Request $request, $id)
    {
        if(auth()->user()->tipo_usuario != 'admin') {
            return response()->json(['message' => 'No autorizado'], 401);
        } else {
            $cancion = Cancion::find($id);
            $this->validateCancion($request);
            $cancion->update($request->all());
            return response()->json($cancion, 200);
        }
    }

    private function validateAlbum(Request $request)
    {
        $request->validate([
            'titulo' => 'required|string|max:255',
            'artista_id' => 'required|exists:artistas,id',
            'fecha_lanzamiento' => 'required|date',
            'portada' => 'required|image|mimes:jpeg,png,jpg|max:2048',
        ]);
    }

    public function editAlbum(Request $request, $id)
    {
        if(auth()->user()->tipo_usuario != 'admin') {
            return response()->json(['message' => 'No autorizado'], 401);
        } else {
            $album = Album::find($id);
            $this->validateAlbum($request);
            $album->update($request->all());
            return response()->json($album, 200);
        }
    }

    private function validateInteraccion(Request $request)
    {
        $request->validate([
            'cancion_id' => 'required|exists:canciones,id',
            'comentario' => 'nullable|string',
            'puntuacion' => 'nullable|integer|between:1,5',
        ]);
    }

    public function editInteraccion(Request $request, $id)
    {
        if(auth()->user()->tipo_usuario != 'admin') {
            return response()->json(['message' => 'No autorizado'], 401);
        } else {
            $interaccion = Interaccion::find($id);
            $this->validateInteraccion($request);
            $interaccion->update($request->all());
            return response()->json($interaccion, 200);
        }
    }
}