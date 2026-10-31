'use client';

import Link from 'next/link';

interface GlobalErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function GlobalError({ reset }: GlobalErrorProps) {
  return (
    <html lang="es">
      <body className="min-h-screen flex items-center justify-center p-4 bg-slate-900 text-slate-100 font-sans antialiased">
        <div className="max-w-md w-full text-center">
          <div className="w-12 h-12 mx-auto rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400 font-mono text-xl font-bold">
            !
          </div>
          <h1 className="mt-4 text-2xl font-bold tracking-tight">Error crítico del sistema</h1>
          <p className="mt-2 text-sm text-slate-400 leading-relaxed">
            Se ha producido una interrupción a nivel global. Puedes reiniciar la aplicación o
            regresar a la página de inicio.
          </p>

          <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={() => reset()}
              className="inline-flex items-center justify-center px-4 py-2.5 rounded-lg bg-blue-600 text-white text-xs font-medium hover:bg-blue-500 transition-colors cursor-pointer"
            >
              Reintentar
            </button>
            <Link
              href="/"
              className="inline-flex items-center justify-center px-4 py-2.5 rounded-lg border border-slate-700 bg-slate-800 text-slate-200 text-xs font-medium hover:bg-slate-700 transition-colors"
            >
              Volver al inicio
            </Link>
          </div>
        </div>
      </body>
    </html>
  );
}
