import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    // Verificar si está intentando acceder a rutas protegidas
    if (request.nextUrl.pathname.startsWith('/homePersonal')) {
        // En el middleware no podemos acceder a localStorage
        // Pero podemos usar cookies para verificar autenticación
        const hasAuthCookie = request.cookies.get('isAuthenticated');

        if (!hasAuthCookie) {
            // Redirigir a login o unauthorized
            return NextResponse.redirect(new URL('/unauthorized', request.url));
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/homePersonal/:path*']
};
