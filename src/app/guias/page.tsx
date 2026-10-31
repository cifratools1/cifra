import Link from 'next/link';
import type { Metadata } from 'next';
import { GUIDES, formatDateSpanish } from '@/lib/guides';
import { getToolBySlug } from '@/lib/tools';

export const metadata: Metadata = {
  title: 'Guías y Tutoriales Técnicos',
  description:
    'Artículos prácticos y fundamentados sobre redes, cálculo de subredes, arquitectura de datos, criptografía y optimización informática.',
  alternates: {
    canonical: 'https://cifra.tools/guias',
  },
};

export default function GuidesIndexPage() {
  return (
    <main className="flex-1 bg-background text-foreground transition-colors">
      <div className="mx-auto max-w-4xl px-4 py-12">
        <header className="mb-10 pb-6 border-b border-card-border">
          <span className="text-xs font-mono text-muted block mb-2">
            Documentación editorial
          </span>
          <h1 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
            Centro de Guías y Recursos Técnicos
          </h1>
          <p className="mt-3 text-base text-muted max-w-2xl leading-relaxed">
            Explicaciones directas fundamentadas en estándares oficiales (RFC, IEC, NIST, W3C) y
            vinculadas a nuestras herramientas interactivas para contrastar cada cálculo en tiempo real.
          </p>
        </header>

        <div className="space-y-6">
          {GUIDES.map((guide) => (
            <article
              key={guide.slug}
              className="p-6 border border-card-border rounded-lg bg-card card-interactive transition-colors"
            >
              <div className="flex flex-wrap items-center gap-2 text-xs text-muted mb-2 font-mono">
                <span className="bg-card-subtle text-foreground border border-card-border font-medium px-2 py-0.5 rounded text-[11px]">
                  {guide.category}
                </span>
                <span>·</span>
                <span>{guide.readTime}</span>
                <span>·</span>
                <time dateTime={guide.publishDate}>{formatDateSpanish(guide.publishDate)}</time>
              </div>

              <h2 className="text-xl font-bold text-foreground">
                <Link
                  href={`/guias/${guide.slug}`}
                  className="hover:text-accent transition-colors block"
                >
                  {guide.title}
                </Link>
              </h2>

              <p className="mt-2 text-sm text-muted leading-relaxed font-sans">{guide.description}</p>

              {/* Herramientas vinculadas sin flechas decorativas */}
              {guide.relatedToolSlugs.length > 0 && (
                <div className="mt-4 pt-4 border-t border-card-border flex flex-wrap items-center gap-2">
                  <span className="text-xs font-mono text-muted">
                    Herramientas relacionadas:
                  </span>
                  {guide.relatedToolSlugs.map((toolSlug) => {
                    const tool = getToolBySlug(toolSlug);
                    if (!tool) return null;
                    return (
                      <Link
                        key={toolSlug}
                        href={`/herramientas/${toolSlug}`}
                        className="text-xs bg-card-subtle border border-card-border px-2.5 py-1 rounded text-foreground hover:text-accent hover:border-accent transition-colors font-medium"
                      >
                        {tool.shortName}
                      </Link>
                    );
                  })}
                </div>
              )}
            </article>
          ))}
        </div>
      </div>
    </main>
  );
}
