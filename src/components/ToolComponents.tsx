'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { CopyIcon, CheckIcon, StarIcon, ShareIcon } from '@/components/Icons';
import { useFavorites } from '@/lib/useFavorites';
import { CATEGORIES, ToolCategory, getToolBySlug } from '@/lib/tools';

interface CopyButtonProps {
  text: string;
  label?: string;
  className?: string;
}

export function CopyButton({ text, label = 'Copiar', className = '' }: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
      const textarea = document.createElement('textarea');
      textarea.value = text;
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }, [text]);

  return (
    <button
      type="button"
      onClick={handleCopy}
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-md border transition-colors ${
        copied
          ? 'bg-success text-white border-success'
          : 'bg-card text-muted border-card-border hover:text-foreground hover:border-accent'
      } ${className}`}
      aria-label={copied ? 'Copiado al portapapeles' : label}
    >
      {copied ? (
        <>
          <CheckIcon className="w-3.5 h-3.5" />
          <span>Copiado</span>
        </>
      ) : (
        <>
          <CopyIcon className="w-3.5 h-3.5" />
          <span>{label}</span>
        </>
      )}
    </button>
  );
}

interface ResultCardProps {
  title: string;
  children: React.ReactNode;
  copyValue?: string;
  className?: string;
}

export function ResultCard({ title, children, copyValue, className = '' }: ResultCardProps) {
  return (
    <div className={`border border-card-border rounded-lg bg-card p-4 transition-colors ${className}`}>
      <div className="flex items-center justify-between mb-2.5 pb-2 border-b border-card-border">
        <h3 className="text-xs font-medium text-muted font-mono">{title}</h3>
        {copyValue && <CopyButton text={copyValue} />}
      </div>
      <div className="font-mono text-foreground font-semibold">{children}</div>
    </div>
  );
}

interface ToolLayoutProps {
  title: string;
  description: string;
  slug?: string;
  category?: ToolCategory;
  children: React.ReactNode;
  educationalContent?: React.ReactNode;
  faq?: Array<{ question: string; answer: string }>;
  relatedTools?: Array<{ slug: string; name: string; shortName: string }>;
}

export function ToolLayout({
  title,
  description,
  slug: propSlug,
  category: propCategory,
  children,
  educationalContent,
  faq,
  relatedTools,
}: ToolLayoutProps) {
  const pathname = usePathname();
  const inferredSlug = propSlug || (pathname?.startsWith('/herramientas/') ? pathname.split('/herramientas/')[1]?.split('/')[0]?.split('?')[0] : '');
  const toolData = inferredSlug ? getToolBySlug(inferredSlug) : undefined;

  const slug = inferredSlug;
  const category = propCategory || toolData?.category;

  const { isFavorite, toggleFavorite, addRecent, isLoaded } = useFavorites();
  const hasRecordedSlug = useRef<string | null>(null);
  const [copiedShare, setCopiedShare] = useState(false);

  useEffect(() => {
    if (slug && hasRecordedSlug.current !== slug) {
      hasRecordedSlug.current = slug;
      addRecent(slug);
    }
  }, [slug, addRecent]);

  const favoriteActive = isLoaded && slug ? isFavorite(slug) : false;

  const handleToggleFav = () => {
    if (slug) {
      toggleFavorite(slug);
    }
  };

  const handleShare = async () => {
    try {
      if (typeof window !== 'undefined') {
        await navigator.clipboard.writeText(window.location.href);
        setCopiedShare(true);
        setTimeout(() => setCopiedShare(false), 2000);
      }
    } catch {
      // Ignore
    }
  };

  const categoryData = category ? CATEGORIES[category as ToolCategory] : null;

  return (
    <main className="flex-1 bg-background text-foreground transition-colors">
      <div className="mx-auto max-w-4xl px-4 py-8">
        {/* Breadcrumb Navigation - simple, discreet */}
        <nav aria-label="Miga de pan" className="mb-4 flex items-center gap-1.5 text-xs text-muted">
          <Link href="/" className="hover:text-foreground transition-colors">
            Inicio
          </Link>
          <span className="text-muted-light">/</span>
          <Link href="/herramientas" className="hover:text-foreground transition-colors">
            Herramientas
          </Link>
          {categoryData && (
            <>
              <span className="text-muted-light">/</span>
              <Link href={`/herramientas#${category}`} className="hover:text-foreground transition-colors">
                {categoryData.name}
              </Link>
            </>
          )}
          <span className="text-muted-light">/</span>
          <span className="text-foreground font-medium truncate max-w-[200px]">{title}</span>
        </nav>

        {/* Compact Tool Header: tool directly at top, zero clutter */}
        <div className="mb-6 pb-4 border-b border-card-border flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              {toolData?.technicalTag && (
                <span className="text-xs font-mono px-2 py-0.5 rounded bg-card-subtle border border-card-border text-muted">
                  {toolData.technicalTag}
                </span>
              )}
              <span className="text-xs font-mono px-2 py-0.5 rounded bg-success-light text-success border border-success/30 font-medium">
                100% en cliente
              </span>
            </div>
            <h1 className="text-2xl font-bold text-foreground tracking-tight sm:text-3xl">
              {title}
            </h1>
            <p className="mt-2 text-sm text-muted leading-relaxed max-w-2xl">
              {description}
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={handleShare}
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-md border border-card-border bg-card text-xs font-medium text-muted hover:text-foreground hover:border-accent transition-colors"
              title="Copiar enlace directo"
              aria-label="Compartir enlace de herramienta"
            >
              {copiedShare ? (
                <>
                  <CheckIcon size={14} className="text-success" />
                  <span>Enlace copiado</span>
                </>
              ) : (
                <>
                  <ShareIcon size={14} />
                  <span>Compartir</span>
                </>
              )}
            </button>

            {slug && (
              <button
                type="button"
                onClick={handleToggleFav}
                className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-md border text-xs font-medium transition-colors ${
                  favoriteActive
                    ? 'bg-warning-light border-warning/30 text-warning'
                    : 'bg-card border-card-border text-muted hover:text-foreground hover:border-accent'
                }`}
                aria-label={favoriteActive ? 'Quitar de favoritos' : 'Añadir a favoritos'}
              >
                <StarIcon className={`w-3.5 h-3.5 ${favoriteActive ? 'fill-current text-warning' : 'text-muted'}`} />
                <span>{favoriteActive ? 'Favorita' : 'Guardar'}</span>
              </button>
            )}
          </div>
        </div>

        {/* Interactive Tool Form/Component: Immediate Utility */}
        <div className="space-y-6">{children}</div>

        {/* Ad container middle (obligatorio: cifra-ad-mid con altura reservada) */}
        <div className="ad-slot-shell" id="cifra-ad-mid" aria-hidden="true" />

        {/* Educational Content Area: Tipografía técnica editorial */}
        {educationalContent && (
          <section className="mt-12 pt-8 border-t border-card-border text-foreground leading-relaxed max-w-none">
            {educationalContent}
          </section>
        )}

        {/* FAQ Section */}
        {faq && faq.length > 0 && (
          <section className="mt-12 pt-8 border-t border-card-border">
            <h2 className="text-lg font-bold text-foreground mb-4 tracking-tight">Preguntas frecuentes</h2>
            <div className="space-y-3">
              {faq.map((item, i) => (
                <div key={i} className="border border-card-border rounded-lg p-4 bg-card">
                  <h3 className="text-sm font-semibold text-foreground">{item.question}</h3>
                  <p className="mt-1.5 text-xs text-muted leading-relaxed">{item.answer}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Related Tools Section */}
        {relatedTools && relatedTools.length > 0 && (
          <section className="mt-12 pt-8 border-t border-card-border">
            <h2 className="text-base font-semibold text-foreground mb-3">
              Herramientas relacionadas
            </h2>
            <div className="grid gap-3 sm:grid-cols-2">
              {relatedTools.map((tool) => (
                <Link
                  key={tool.slug}
                  href={`/herramientas/${tool.slug}`}
                  className="flex items-center justify-between p-3.5 border border-card-border rounded-lg bg-card hover:border-accent transition-colors group"
                >
                  <span className="text-sm font-medium text-foreground group-hover:text-accent transition-colors">
                    {tool.name}
                  </span>
                  <span className="text-xs text-muted font-mono">
                    Abrir
                  </span>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Ad container bottom (obligatorio: cifra-ad-bottom con altura reservada) */}
        <div className="ad-slot-shell" id="cifra-ad-bottom" aria-hidden="true" />
      </div>
    </main>
  );
}
