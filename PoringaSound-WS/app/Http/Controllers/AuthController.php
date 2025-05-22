<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{

    public function getMe(Request $request)
    {
        return response()->json($request->user());
    }

    public function getAllArtistas(Request $request)
    {
        $perPage = $request->query('per_page', 10);
        $query = $request->query('query');
        $orden = $request->query('orden', 'nombre');
        $direccion = $request->query('direccion', 'asc');

        $usersQuery = User::whereHas('canciones', function ($q) {
            $q->where('active', true);
        })
            ->with(['canciones' => function ($q) {
                $q->where('active', true);
            }])
            ->withCount(['canciones' => function ($q) {
                $q->where('active', true);
            }]);

        if ($query) {
            $usersQuery->where('nombre', 'like', "%$query%");
        }

        if (in_array($orden, ['nombre', 'canciones_count', 'created_at'])) {
            $usersQuery->orderBy($orden, $direccion);
        } else {
            $usersQuery->orderBy('nombre', 'asc');
        }

        $users = $usersQuery->paginate($perPage);

        return response()->json($users, 200);
    }

    public function getUserById(Request $request, $id)
    {
        $perPage = $request->query('per_page', 10);
        $user = User::find($id);

        if (!$user) {
            return response()->json(['message' => 'Usuario no encontrado'], 404);
        }

        $canciones = $user->canciones()
            ->where('active', true)
            ->with('user')
            ->paginate($perPage);

        $user->canciones = $canciones;
        return response()->json($user, 200);
    }

    public function register(Request $request)
    {
        $messages = [
            'email.unique' => 'This email is already registered.',
        ];

        $request->validate([
            'nombre' => 'required|string|max:255',
            'email' => 'required|string|email|unique:users',
            'password' => 'required|string|min:6',
            'tipo' => 'in:usuario',
            'imagen_perfil' => 'nullable|image|mimes:jpeg,png,jpg',
        ], $messages);

        $image = $this->guardarImagenPerfil($request);

        $user = User::create([
            'nombre' => $request->nombre,
            'email' => $request->email,
            'password' => \Illuminate\Support\Facades\Hash::make($request->password),
            'tipo' => $request->tipo ?? 'usuario',
            'imagen_perfil' => $image,
        ]);
        $token = $user->createToken('api-token')->plainTextToken;
        return response()->json(['user' => $user, 'token' => $token], 201);
    }

    public function guardarImagenPerfil(Request $request)
    {
        $imagePath = null;
        if ($request->hasFile('imagen_perfil')) {
            $timestamp = time();
            $imageExtension = $request->file('imagen_perfil')->getClientOriginalExtension();
            $imageName = $timestamp . '.' . $imageExtension;
            $imagePath = $request->file('imagen_perfil')->storeAs('profile_images', $imageName, 'public');
        }
        return $imagePath ? 'storage/' . $imagePath : null;
    }

    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|string|email',
            'password' => 'required|string',
        ]);

        $user = User::where('email', $request->email)->first();

        if (!$user || !Hash::check($request->password, $user->password)) {
            return response()->json(['message' => 'Credenciales incorrectas'], 401);
        }

        $token = $user->createToken('api-token')->plainTextToken;

        return response()->json([
            'user' => $user,
            'token' => $token
        ], 200);
    }

    public function logout(Request $request)
    {
        $request->user()->tokens()->delete();
        return response()->json(['message' => 'Sesión cerrada'], 200);
    }

    public function updateUser(Request $request, $id)
    {
        $user = User::find($id);

        if (!$user) {
            return response()->json(['message' => 'Usuario no encontrado'], 404);
        }

        if ($user->id != auth()->user()->id) {
            return response()->json(['message' => 'No autorizado'], 401);
        }

        $request->validate([
            'nombre' => 'string|max:255',
            'email' => 'string|email|unique:users,email,' . $user->id,
            'password' => 'string|min:6',
            'tipo' => 'in:usuario',
            'imagen_perfil' => 'image|mimes:jpeg,png,jpg|max:2048',
        ]);

        if ($request->has('password')) {
            $user->password = Hash::make($request->password);
        }

        if ($request->hasFile('imagen_perfil')) {
            $imagePath = $this->guardarImagenPerfil($request);
            if ($imagePath) {
                $user->imagen_perfil = $imagePath;
            }
        }

        $user->update($request->only(['nombre', 'email', 'tipo']));

        return response()->json(['user' => $user], 200);
    }
}
