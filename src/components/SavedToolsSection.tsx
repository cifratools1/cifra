'use client';

import Link from 'next/link';
import { useFavorites } from '@/lib/useFavorites';
import { getToolBySlug } from '@/lib/tools';
import { getToolIcon, StarIcon, ClockIcon } from '@/components/Icons';

export default function SavedToolsSection() {
  const { favorites, recents, isLoaded, pinFavoriteToTop } = useFavorites();

  if (!isLoaded) return null;

  const favTools = favorites
    .map((slug) => getToolBySlug(slug))
    .filter((t): t is NonNullable<typeof t> => t !== undefined);

  const recentTools = recents
    .filter((slug) => !favorites.includes(slug))
    .map((slug) => getToolBySlug(slug))
    .filter((t): t is NonNullable<typeof t> => t !== undefined)
    .slice(0, 4);

  if (favTools.length === 0 && recentTools.length === 0) {
    return null;
  }

  return (
    <section className="mb-10 space-y-4">
      {/* Favoritos */}
      {favTools.length > 0 && (
        <div className="p-4 rounded-lg border border-card-border bg-card">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <StarIcon size={15} className="text-amber-500 fill-amber-500" />
              <h2 className="text-sm font-semibold text-foreground">
                Herramientas favoritas
              </h2>
            </div>
            <span className="text-xs text-muted font-mono">{favTools.length} fijada{favTools.length > 1 ? 's' : ''}</span>
          </div>

          <div className="grid gap-2.5 sm:grid-cols-2 lg:grid-cols-4">
            {favTools.map((tool, idx) => (
              <div
                key={tool.slug}
                className="group relative flex items-center justify-between p-2.5 rounded-md border border-card-border bg-card-subtle hover:border-accent transition-colors"
              >
                <Link
                  href={`/herramientas/${tool.slug}`}
                  className="flex items-center gap-2.5 min-w-0 flex-1"
                >
                  <div className="w-6 h-6 rounded bg-card border border-card-border flex items-center justify-center text-foreground shrink-0">
                    {getToolIcon(tool.slug, 'w-3.5 h-3.5')}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">
                      {tool.shortName}
                    </p>
                    <span className="text-xs text-muted font-mono block truncate">
                      {tool.technicalTag}
                    </span>
                  </div>
                </Link>

                {idx > 0 && (
                  <button
                    type="button"
                    onClick={() => pinFavoriteToTop(tool.slug)}
                    title="Fijar en primer lugar"
                    className="opacity-0 group-hover:opacity-100 p-1 text-muted hover:text-foreground text-xs font-mono transition-opacity ml-1 rounded bg-card border border-card-border"
                  >
                    ↑
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recientemente Usadas */}
      {recentTools.length > 0 && (
        <div className="p-4 rounded-lg border border-card-border bg-card">
          <div className="flex items-center gap-2 mb-3">
            <ClockIcon size={15} className="text-muted" />
            <h2 className="text-sm font-semibold text-foreground">
              Usadas recientemente
            </h2>
          </div>

          <div className="grid gap-2.5 sm:grid-cols-2 lg:grid-cols-4">
            {recentTools.map((tool) => (
              <Link
                key={tool.slug}
                href={`/herramientas/${tool.slug}`}
                className="flex items-center gap-2.5 p-2.5 rounded-md border border-card-border bg-card-subtle hover:border-accent transition-colors group"
              >
                <div className="w-6 h-6 rounded bg-card border border-card-border flex items-center justify-center text-foreground shrink-0">
                  {getToolIcon(tool.slug, 'w-3.5 h-3.5')}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-foreground truncate group-hover:text-accent transition-colors">
                    {tool.shortName}
                  </p>
                  <span className="text-xs text-muted font-mono block truncate">
                    {tool.technicalTag}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
