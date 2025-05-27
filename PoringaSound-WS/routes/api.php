<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\AlbumController;
use App\Http\Controllers\CancionController;
use App\Http\Controllers\InteraccionController;
use App\Http\Controllers\DenunciaController;
use App\Http\Controllers\GenerosController;

// Rutas públicas
Route::post('register', [AuthController::class, 'register']);
Route::post('login', [AuthController::class, 'login']);
Route::get('public/canciones/all', [CancionController::class, 'getAllCanciones']);
Route::get('public/canciones/random', [CancionController::class, 'getRandomCancion']);
Route::get('public/albums/all', [AlbumController::class, 'getAllAlbums']);
Route::get('public/artistas/all', [AuthController::class, 'getAllArtistas']);

Route::get('public/canciones/{id}', [CancionController::class, 'getCancionById']);
Route::get('public/albums/{id}', [AlbumController::class, 'getAlbumById']);
Route::get('public/artistas/{id}', [AuthController::class, 'getUserById']);

Route::prefix('generos')->group(function () {
    Route::get('/', [GenerosController::class, 'getAllGeneros']);
});

// Rutas protegidas por autenticación
Route::middleware('auth:sanctum')->group(function () {
    // Rutas de autenticación
    Route::post('logout', [AuthController::class, 'logout']);
    Route::get('me', [AuthController::class, 'getMe']);

    // user
    Route::prefix('user')->group(function () {
        Route::post('/{id}', [AuthController::class, 'updateUser']);
    });

    // Rutas de canciones
    Route::prefix('canciones')->group(function () {
        Route::get('/', [CancionController::class, 'getAllCanciones']);
        Route::get('/discover', [CancionController::class, 'discover']);
        Route::post('/', [CancionController::class, 'createCancion']);
        Route::get('/{id}', [CancionController::class, 'getCancionById']);
        Route::get('/user/{id}', [CancionController::class, 'getCancionesByUserId']);

        Route::post('/{id}', [CancionController::class, 'actualizarCancion']);
        Route::delete('/{id}', [CancionController::class, 'deleteCancion']);
    });

    // Rutas de álbumes
    Route::prefix('albums')->group(function () {
        Route::get('/', [AlbumController::class, 'getAllAlbums']);
        Route::post('/', [AlbumController::class, 'createAlbum']);
        Route::get('/user/{id}', [AlbumController::class, 'getAlbumByUserId']);
        Route::get('/songs/{id}', [AlbumController::class, 'getAlbumSongs']);
        Route::put('/canciones/{id}', [AlbumController::class, 'updateAlbumCancion']);
        Route::get('/{id}', [AlbumController::class, 'getAlbumById']);
        Route::put('/{id}', [AlbumController::class, 'updateAlbum']);
        Route::delete('/{id}', [AlbumController::class, 'deleteAlbum']);
    });

    Route::prefix('interacciones')->group(function () {
        Route::post('/like', [InteraccionController::class, 'likeCancion']);
        Route::delete('/like', [InteraccionController::class, 'quitarLike']);
        Route::post('/puntuacion', [InteraccionController::class, 'puntuarCancion']);
        Route::post('/comentario', [InteraccionController::class, 'comentarCancion']);
    });

    Route::prefix('denuncias')->group(function () {
        Route::post('/', [DenunciaController::class, 'createDenuncia']);

        Route::middleware('admin-only')->group(function () {
            Route::get('/', [DenunciaController::class, 'getDenuncias']);
            Route::get('/pendientes', [DenunciaController::class, 'getDenunciasPendientes']);
            Route::post('/{id}/aceptar', [DenunciaController::class, 'aceptarDenuncia']);
            Route::post('/{id}/rechazar', [DenunciaController::class, 'rechazarDenuncia']);
        });
    });
});
