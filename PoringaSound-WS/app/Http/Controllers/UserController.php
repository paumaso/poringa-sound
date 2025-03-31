<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;

class UserController extends Controller
{
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

    public function getAllUsers()
    {
        return response()->json(User::all(), 200);
    }

    public function getUserById($id)
    {
        $user = User::find($id);
        if ($user) {
            return response()->json($user, 200);
        } else {
            return response()->json(['message' => 'User not found'], 404);
        }
    }

    public function createUser(Request $request)
    {
        $validated = $this->validateRequest($request);
        $user = User::create($validated);
        return response()->json($user, 201);
    }

}
