<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\AlbumController;
use App\Http\Controllers\CancionController;
use App\Http\Controllers\InteraccionController;
use App\Http\Controllers\ListaReproduccionController;
use App\Http\Controllers\GenerosController;

// Rutas públicas
Route::post('register', [AuthController::class, 'register']);
Route::post('login', [AuthController::class, 'login']);
Route::get('public/canciones/random-list', [CancionController::class, 'getCancionesOrdenRandom']);
Route::get('public/canciones/random', [CancionController::class, 'getRandomCancion']);

Route::get('public/canciones/{id}', [CancionController::class, 'getCancionById']);

// Rutas protegidas por autenticación
Route::middleware('auth:sanctum')->group(function () {
    // Rutas de autenticación
    Route::post('logout', [AuthController::class, 'logout']);

    // user
    Route::prefix('user')->group(function () {
        Route::put('/{id}', [AuthController::class, 'updateUser']);
    });

    // Rutas de álbumes
    Route::prefix('albums')->group(function () {
        Route::get('/', [AlbumController::class, 'getAllAlbums']);
        Route::get('/user/{id}', [AlbumController::class, 'getAlbumByUserId']);
        Route::get('/{id}', [AlbumController::class, 'getAlbumById']);
        Route::get('/artist/{id}', [AlbumController::class, 'getAlbumsByArtistId']);
        Route::get('/songs/{id}', [AlbumController::class, 'getAlbumSongs']);
        Route::post('/', [AlbumController::class, 'createAlbum']);
        Route::put('/{id}', [AlbumController::class, 'updateAlbum']);
        Route::delete('/{id}', [AlbumController::class, 'deleteAlbum']);
    });

    // Rutas de canciones
    Route::prefix('canciones')->group(function () {
        Route::get('/', [CancionController::class, 'getAllCanciones']);
        Route::get('/preferencia', [CancionController::class, 'getCancionesOrdenadasPorPreferencia']);
        Route::post('/', [CancionController::class, 'createCancion']);
        Route::get('/{id}', [CancionController::class, 'getCancionById']);
        Route::put('/{id}', [CancionController::class, 'actualizarCancion']);
        Route::delete('/{id}', [CancionController::class, 'deleteCancion']);
        Route::get('/user/{id}', [CancionController::class, 'getCancionesByUserId']);
    });

    Route::prefix('interacciones')->group(function () {
        Route::post('/like', [InteraccionController::class, 'likeCancion']);
        Route::delete('/like', [InteraccionController::class, 'quitarLike']);
        Route::post('/puntuacion', [InteraccionController::class, 'puntuarCancion']);
        Route::post('/comentario', [InteraccionController::class, 'comentarCancion']);
    });

    // Rutas de listas de reproducción
    Route::prefix('listasReproduccion')->group(function () {
        Route::get('/user/{id}', [ListaReproduccionController::class, 'getListasReproduccionByUserId']);
    });

    Route::prefix('generos')->group(function () {
        Route::get('/', [GenerosController::class, 'getAllGeneros']);
    });
});
