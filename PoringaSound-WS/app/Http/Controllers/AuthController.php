<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    public function register(Request $request)
    {
        $request->validate([
            'nombre' => 'required|string|max:255',
            'email' => 'required|string|email|unique:users',
            'password' => 'required|string|min:6',
            'tipo' => 'in:usuario',
            'imagen_perfil' => 'nullable|image|mimes:jpeg,png,jpg',
        ]);

        $image = $this->guardarImagenPerfil($request);

        $user = User::create([
            'nombre' => $request->nombre,
            'email' => $request->email,
            'password' => Hash::make($request->password),
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
