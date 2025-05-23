<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use Illuminate\Support\Facades\Log;

class AdminMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @return \Symfony\Component\HttpFoundation\Response
     */
    public function handle(Request $request, Closure $next): Response
    {
        $user = auth()->user();

        Log::warning('AdminMiddleware: Usuario sin permisos. Tipo: ' . $user->tipo);

        if (!$user || $user->tipo != 'admin') {
            Log::warning('AdminMiddleware: Usuario sin permisos. Tipo: ' . $user->tipo);
            return response()->json(['error' => 'No autorizado'], 403);
        }

        return $next($request);
    }
}
