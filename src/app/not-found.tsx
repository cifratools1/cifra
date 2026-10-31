import Link from 'next/link';
import { TOOLS } from '@/lib/tools';
import { GUIDES } from '@/lib/guides';

export default function NotFound() {
  return (
    <main className="flex-1 flex items-center justify-center py-16 px-4 bg-background text-foreground transition-colors">
      <div className="max-w-2xl text-center">
        <span className="text-4xl font-mono font-bold text-accent">404</span>
        <h1 className="mt-2 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
          Página no encontrada
        </h1>
        <p className="mt-3 text-sm text-muted leading-relaxed">
          La ruta que buscas no existe o ha sido movida. Puedes explorar nuestras herramientas técnicas
          más utilizadas o consultar nuestras guías de referencia:
        </p>

        {/* Herramientas destacadas */}
        <div className="mt-8 text-left">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-muted mb-3">
            Herramientas populares
          </h2>
          <div className="grid gap-2 sm:grid-cols-2">
            {TOOLS.slice(0, 4).map((tool) => (
              <Link
                key={tool.slug}
                href={`/herramientas/${tool.slug}`}
                className="p-3 rounded-lg border border-card-border bg-card hover:border-accent transition-colors"
              >
                <span className="text-xs font-semibold text-foreground block">{tool.shortName}</span>
                <span className="text-xs text-muted truncate block">{tool.name}</span>
              </Link>
            ))}
          </div>
        </div>

        {/* Guías técnicas */}
        <div className="mt-6 text-left">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-muted mb-3">
            Guías técnicas recomendadas
          </h2>
          <div className="grid gap-2 sm:grid-cols-2">
            {GUIDES.slice(0, 2).map((guide) => (
              <Link
                key={guide.slug}
                href={`/guias/${guide.slug}`}
                className="p-3 rounded-lg border border-card-border bg-card hover:border-accent transition-colors"
              >
                <span className="text-xs font-semibold text-foreground line-clamp-1 block">
                  {guide.title}
                </span>
                <span className="text-xs text-muted line-clamp-1 block">{guide.category}</span>
              </Link>
            ))}
          </div>
        </div>

        <div className="mt-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-foreground text-background text-xs font-medium hover:opacity-90 transition-opacity"
          >
            Volver a la portada de Cifra
          </Link>
        </div>
      </div>
    </main>
  );
}
