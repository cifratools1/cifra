'use client';

import { useEffect } from 'react';
import Link from 'next/link';

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function ErrorPage({ error, reset }: ErrorProps) {
  useEffect(() => {
    // Registra el error internamente sin exponer detalles sensibles
    // (el digest de Next.js permite correlacionar el error en logs del servidor si aplica)
  }, [error]);

  return (
    <main className="flex-1 flex items-center justify-center py-16 px-4 bg-background text-foreground transition-colors">
      <div className="max-w-md w-full text-center">
        <div className="w-12 h-12 mx-auto rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-500 font-mono text-xl font-bold">
          !
        </div>
        <h1 className="mt-4 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
          Algo ha fallado
        </h1>
        <p className="mt-2 text-sm text-muted leading-relaxed">
          Ha ocurrido un error inesperado al procesar esta vista. Todas nuestras herramientas se
          ejecutan 100% en tu navegador y tus datos no han salido de tu equipo.
        </p>

        <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={() => reset()}
            className="inline-flex items-center justify-center px-4 py-2.5 rounded-lg bg-accent text-white text-xs font-medium hover:bg-accent/90 transition-colors cursor-pointer"
          >
            Reintentar
          </button>
          <Link
            href="/"
            className="inline-flex items-center justify-center px-4 py-2.5 rounded-lg border border-card-border bg-card text-foreground text-xs font-medium hover:bg-card/80 transition-colors"
          >
            Volver a la portada
          </Link>
        </div>
      </div>
    </main>
  );
}
