'use client'

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import Image from 'next/image';

export default function UnauthorizedPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-black">
      {/* Más ancho para la imagen en desktop y unión sin separación visual */}
      <div className="relative min-h-screen grid grid-cols-1 lg:grid-cols-[1.35fr_1fr] overflow-hidden">
        {/* Columna izquierda: imagen */}
        <section className="relative min-h-[44vh] sm:min-h-[52vh] md:min-h-[60vh] lg:min-h-screen">
          <Image
            src="/Alien-Unauthorized.png"
            alt="Acceso Denegado"
            fill
            priority
            sizes="(min-width: 1024px) 57vw, 100vw"
            className="object-cover scale-[1.03] object-[22%_center] lg:object-[18%_center] rounded-b-2xl sm:rounded-b-3xl lg:rounded-none"
          />

          <div className="absolute inset-0 bg-gradient-to-br from-black/10 via-black/5 to-black/35" />

          {/* Viñeta */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(0,0,0,0)_0%,rgba(0,0,0,0.22)_55%,rgba(0,0,0,0.60)_100%)]" />

          {/* Mobile: fade hacia abajo para integrar con el aviso */}
          <div className="absolute inset-0 lg:hidden bg-gradient-to-b from-transparent via-transparent to-black/85" />
        </section>

        {/* Columna derecha: aviso */}
        <section className="relative flex items-center justify-center px-4 py-8 sm:px-6 sm:py-10 lg:p-12">
          {/* Fondo base derecho */}
          <div className="absolute inset-0 bg-black" />

          {/* Seam (desktop): el difuminado sale desde el borde izquierdo del panel para que nunca haya gap */}
          <div className="pointer-events-none absolute inset-y-0 -left-24 hidden w-48 lg:block">
            <div className="absolute inset-0 backdrop-blur-3xl" />
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-black/25 to-black/70" />
            <div className="absolute inset-y-0 left-0 w-20 bg-[radial-gradient(closest-side,rgba(0,0,0,0.55),rgba(0,0,0,0))]" />
            <div className="absolute inset-y-0 right-0 w-20 bg-[radial-gradient(closest-side,rgba(0,0,0,0.80),rgba(0,0,0,0))]" />
          </div>

          {/* Halo suave detrás del panel (evita que el panel se vea pegado al fondo) */}
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.06)_0%,rgba(255,255,255,0.02)_35%,rgba(0,0,0,0)_70%)]" />

          <div className="relative z-10 w-full max-w-md sm:max-w-lg text-center">
            <div className="relative rounded-3xl lg:rounded-l-none border border-white/10 bg-black/25 backdrop-blur-xl px-6 py-9 sm:px-8 sm:py-10 md:px-10 md:py-12 space-y-8">
              {/* Sombras solo en bordes del panel (centro limpio) */}
              <div className="pointer-events-none absolute inset-0 rounded-3xl lg:rounded-l-none overflow-hidden">
                {/* Borde izquierdo más oscuro para fundir con el seam */}
                <div className="absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-black/65 via-black/25 to-transparent" />
                {/* Borde derecho sutil */}
                <div className="absolute inset-y-0 right-0 w-10 bg-gradient-to-l from-black/45 via-black/20 to-transparent" />
                {/* Borde inferior (profundidad) */}
                <div className="absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-black/55 via-black/25 to-transparent" />
                {/* Viñeta periférica muy sutil (para volumen sin ensuciar el centro) */}
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(0,0,0,0)_58%,rgba(0,0,0,0.18)_82%,rgba(0,0,0,0.42)_100%)]" />
                {/* Un pelín de glow superior para dar volumen */}
                <div className="absolute -top-12 left-1/2 h-28 w-[120%] -translate-x-1/2 rounded-full bg-white/5 blur-2xl" />
              </div>

              {/* Fade exterior para evitar el rectángulo duro */}
              <div className="pointer-events-none absolute -inset-6 -z-10 rounded-[2.75rem] lg:rounded-l-[0rem] bg-[radial-gradient(circle_at_center,rgba(0,0,0,0.42)_0%,rgba(0,0,0,0.22)_35%,rgba(0,0,0,0)_72%)]" />

              <div className="relative z-10 space-y-8">
                {/* Icono de candado */}
                <div className="flex justify-center">
                  <div className="w-20 h-20 rounded-full bg-red-500/20 backdrop-blur-sm flex items-center justify-center border-2 border-red-500/50">
                    <svg
                      className="w-10 h-10 text-red-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                      />
                    </svg>
                  </div>
                </div>

                {/* Título principal */}
                <div className="space-y-3">
                  <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-red-500">
                    Acceso Denegado
                  </h1>
                  <div className="h-1 w-32 bg-red-500 mx-auto rounded-full"></div>
                </div>

                {/* Descripción */}
                <div className="space-y-3">
                  <p className="text-base sm:text-lg text-gray-200 leading-relaxed">
                    No tienes autorización para acceder a esta página.
                  </p>
                  <p className="text-sm sm:text-base text-gray-300">
                    Por favor, inicia sesión con una cuenta válida para continuar.
                  </p>
                </div>

                {/* Código de error decorativo */}
                <div className="pt-2">
                  <span className="inline-block px-4 py-2 bg-red-500/20 backdrop-blur-sm border border-red-500/30 text-red-400 rounded-full text-sm font-mono">
                    ERROR 401 - UNAUTHORIZED
                  </span>
                </div>

                {/* Botones de acción */}
                <div className="space-y-3 pt-4">
                  <Button
                    onClick={() => router.push('/login')}
                    className="w-full bg-red-600 hover:bg-red-700 text-white py-5 sm:py-6 text-base sm:text-lg font-semibold rounded-lg shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-[1.02] cursor-pointer"
                  >
                    Ir al Login
                  </Button>

                  <Button
                    onClick={() => router.push('/')}
                    variant="outline"
                    className="w-full py-5 sm:py-6 text-base sm:text-lg font-semibold rounded-lg border-2 border-gray-400/50 bg-black/20 backdrop-blur-sm text-gray-200 hover:bg-black/40 hover:border-gray-300 transition-all duration-300"
                  >
                    Volver al Inicio
                  </Button>
                </div>

                {/* Información adicional */}
                <div className="pt-4">
                  <p className="text-sm text-gray-400">
                    ¿Necesitas ayuda? Contacta con nuestro{' '}
                    <a
                      href="/about"
                      className="text-red-500 hover:text-red-400 hover:underline font-medium transition-colors"
                    >
                      equipo de soporte
                    </a>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
