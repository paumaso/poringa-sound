<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

use App\Http\Controllers\AuthController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\ArtistaController;
use App\Http\Controllers\AdminController;
use App\Http\Controllers\AlbumController;
use App\Http\Controllers\CancionController;
/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

//Get artistas
Route::get('artistas', [ArtistaController::class, 'getAllArtistas']);
Route::get('canciones/random', [CancionController::class, 'getRandomCancion']);

Route::post('register', [AuthController::class, 'register']);
Route::post('login', [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {
    Route::post('logout', [AuthController::class, 'logout']);
});

//Admin routes
Route::middleware('auth:sanctum')->group(function() {
    Route::delete('/admin/user/{id}', [AdminController::class, 'deleteUser']);
    Route::delete('/admin/cancion/{id}', [AdminController::class, 'deleteCancion']);
    Route::delete('/admin/album/{id}', [AdminController::class, 'deleteAlbum']);
    Route::delete('/admin/interaccion/{id}', [AdminController::class, 'deleteInteraccion']);
    Route::put('/user/{id}', [AdminController::class, 'editUser']);
    Route::put('/cancion/{id}', [AdminController::class, 'editCancion']);
    Route::put('/album/{id}', [AdminController::class, 'editAlbum']);
    Route::put('/interaccion/{id}', [AdminController::class, 'editInteraccion']);
});

//Artista routes
Route::middleware('auth:sanctum')->group(function () {
    Route::post('artistas', [ArtistaController::class, 'createArtista']);
    Route::put('artistas/{id}', [ArtistaController::class, 'updateArtista']);
    Route::delete('artistas/{id}', [ArtistaController::class, 'deleteArtista']);
});

//Album routes
Route::middleware('auth:sanctum')->group(function () {
    Route::get('albums', [AlbumController::class, 'getAllAlbums']);
    Route::get('albums/{id}', [AlbumController::class, 'getAlbumById']);
    Route::get('albums/artist/{id}', [AlbumController::class, 'getAlbumsByArtistId']);
    Route::get('albums/songs/{id}', [AlbumController::class, 'getAlbumSongs']);
    Route::post('albums', [AlbumController::class, 'createAlbum']);
    Route::put('albums/{id}', [AlbumController::class, 'updateAlbum']);
    Route::delete('albums/{id}', [AlbumController::class, 'deleteAlbum']);
});

//Cancion routes
Route::middleware('auth:sanctum')->group(function () {
    Route::get('canciones', [CancionController::class, 'getAllCanciones']);
    Route::get('canciones/{id}', [CancionController::class, 'getCancionById']);
    Route::get('canciones/album/{id}', [CancionController::class, 'getCancionesByAlbumId']);
    Route::get('canciones/genero/{genero}', [CancionController::class, 'getCancionesByGenero']);
    Route::post('canciones', [CancionController::class, 'createCancion']);
    Route::put('canciones/{id}', [CancionController::class, 'actualizarCancion']);
    Route::delete('canciones/{id}', [CancionController::class, 'deleteCancion']);
});
