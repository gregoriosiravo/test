<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class CorsMiddleware
{
    public function handle(Request $request, Closure $next)
    {
        $corsConfig = config('cors');
        
        // Handle preflight OPTIONS request
        if ($request->isMethod('OPTIONS')) {
            return response('', 200, [
                'Access-Control-Allow-Origin' => implode(', ', $corsConfig['allowed_origins']),
                'Access-Control-Allow-Methods' => implode(', ', $corsConfig['allowed_methods']),
                'Access-Control-Allow-Headers' => implode(', ', $corsConfig['allowed_headers']),
                'Access-Control-Max-Age' => $corsConfig['max_age'],
            ]);
        }

        $response = $next($request);

        // Add CORS headers to response
        $response->headers->set('Access-Control-Allow-Origin', implode(', ', $corsConfig['allowed_origins']));
        $response->headers->set('Access-Control-Allow-Methods', implode(', ', $corsConfig['allowed_methods']));
        $response->headers->set('Access-Control-Allow-Headers', implode(', ', $corsConfig['allowed_headers']));

        return $response;
    }
}