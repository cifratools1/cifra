'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { TOOLS, CATEGORIES, getAllCategories } from '@/lib/tools';
import { getToolIcon, getCategoryIcon, StarIcon, SearchIcon } from '@/components/Icons';
import { useFavorites } from '@/lib/useFavorites';

interface ToolCatalogProps {
  initialCategory?: string;
}

export default function ToolCatalog({ initialCategory = 'all' }: ToolCatalogProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory);
  const [filterQuery, setFilterQuery] = useState('');
  const { favorites, isLoaded, toggleFavorite, isFavorite } = useFavorites();

  const categories = getAllCategories();

  const filteredTools = useMemo(() => {
    let list = TOOLS;

    if (selectedCategory === 'favorites') {
      list = isLoaded ? list.filter((t) => favorites.includes(t.slug)) : [];
    } else if (selectedCategory !== 'all') {
      list = list.filter((t) => t.category === selectedCategory);
    }

    if (filterQuery.trim()) {
      const q = filterQuery.toLowerCase().trim();
      list = list.filter(
        (t) =>
          t.name.toLowerCase().includes(q) ||
          t.shortName.toLowerCase().includes(q) ||
          t.description.toLowerCase().includes(q) ||
          t.technicalTag.toLowerCase().includes(q) ||
          t.keywords.some((k) => k.toLowerCase().includes(q))
      );
    }

    return list;
  }, [selectedCategory, filterQuery, favorites, isLoaded]);

  return (
    <div className="w-full">
      {/* Category Tabs & Filter Toolbar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-4 border-b border-card-border mb-6">
        {/* Category Pills con scroll horizontal fluido y visual hint */}
        <div className="relative w-full md:w-auto">
          <div
            className="flex items-center gap-1.5 overflow-x-auto pb-2.5 md:pb-1.5 scroll-smooth custom-scrollbar"
            role="tablist"
            aria-label="Filtro de categorías de herramientas"
          >
            <button
              type="button"
              role="tab"
              aria-selected={selectedCategory === 'all'}
              onClick={() => setSelectedCategory('all')}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors shrink-0 flex items-center gap-1.5 ${
                selectedCategory === 'all'
                  ? 'bg-foreground text-background shadow-sm'
                  : 'text-muted hover:text-foreground hover:bg-card-hover border border-card-border'
              }`}
            >
              <span>Todas</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded font-mono ${
                  selectedCategory === 'all'
                    ? 'bg-background/20 text-background'
                    : 'bg-card-subtle text-muted'
                }`}
              >
                {TOOLS.length}
              </span>
            </button>

            {categories.map((catKey) => {
              const cat = CATEGORIES[catKey];
              const isSelected = selectedCategory === catKey;
              return (
                <button
                  key={catKey}
                  type="button"
                  role="tab"
                  aria-selected={isSelected}
                  onClick={() => setSelectedCategory(catKey)}
                  className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors shrink-0 flex items-center gap-1.5 ${
                    isSelected
                      ? 'bg-foreground text-background shadow-sm'
                      : 'text-muted hover:text-foreground hover:bg-card-hover border border-card-border'
                  }`}
                >
                  <span>{getCategoryIcon(catKey, 'w-3.5 h-3.5')}</span>
                  <span>{cat.name}</span>
                </button>
              );
            })}

            {isLoaded && favorites.length > 0 && (
              <button
                type="button"
                role="tab"
                aria-selected={selectedCategory === 'favorites'}
                onClick={() => setSelectedCategory('favorites')}
                className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors shrink-0 flex items-center gap-1.5 ${
                  selectedCategory === 'favorites'
                    ? 'bg-amber-600 text-white shadow-sm'
                    : 'text-muted hover:text-foreground hover:bg-card-hover border border-card-border'
                }`}
              >
                <StarIcon className="w-3.5 h-3.5 fill-current" />
                <span>Favoritas</span>
                <span className="text-[10px] px-1.5 py-0.2 rounded font-mono bg-black/15">
                  {favorites.length}
                </span>
              </button>
            )}
          </div>
        </div>

        {/* Filter Input */}
        <div className="relative w-full md:w-64 shrink-0">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-muted">
            <SearchIcon className="w-3.5 h-3.5" />
          </div>
          <input
            type="text"
            value={filterQuery}
            onChange={(e) => setFilterQuery(e.target.value)}
            placeholder="Filtrar por nombre o RFC..."
            className="w-full pl-9 pr-3 py-1.5 bg-card border border-card-border rounded-md text-xs text-foreground placeholder:text-muted focus:border-accent focus:outline-none transition-colors"
            aria-label="Filtrar herramientas"
          />
        </div>
      </div>

      {/* Grid: Alta jerarquía visual y tarjetas de ingeniería */}
      {filteredTools.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredTools.map((tool) => {
            const fav = isFavorite(tool.slug);
            return (
              <div
                key={tool.slug}
                className="group relative flex flex-col justify-between p-5 bg-card border border-card-border rounded-lg card-interactive"
              >
                <div>
                  <div className="flex items-center justify-between gap-3 mb-3">
                    <div className="w-8 h-8 rounded-md bg-card-subtle border border-card-border flex items-center justify-center text-foreground group-hover:text-accent transition-colors shrink-0">
                      {getToolIcon(tool.slug, 'w-4 h-4')}
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-muted font-mono px-2 py-0.5 rounded bg-card-subtle border border-card-border">
                        {tool.technicalTag}
                      </span>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          toggleFavorite(tool.slug);
                        }}
                        className={`p-1.5 rounded-md hover:bg-card-subtle transition-colors ${
                          fav ? 'text-amber-500' : 'text-muted-light hover:text-muted'
                        }`}
                        aria-label={fav ? 'Quitar de favoritos' : 'Añadir a favoritos'}
                        title={fav ? 'Quitar de favoritos' : 'Añadir a favoritos'}
                      >
                        <StarIcon className={`w-4 h-4 ${fav ? 'fill-amber-500' : ''}`} />
                      </button>
                    </div>
                  </div>

                  <Link href={`/herramientas/${tool.slug}`} className="block focus:outline-none">
                    <h3 className="text-base font-semibold text-foreground group-hover:text-accent transition-colors">
                      {tool.name}
                    </h3>
                    <p className="mt-2 text-sm text-muted line-clamp-2 leading-relaxed">
                      {tool.description}
                    </p>
                  </Link>
                </div>

                <div className="mt-4 pt-3 border-t border-card-border flex items-center justify-between text-xs">
                  <span className="text-xs text-muted truncate">
                    {tool.taskHint}
                  </span>
                  <Link
                    href={`/herramientas/${tool.slug}`}
                    className="text-xs font-semibold text-accent hover:underline shrink-0"
                  >
                    Usar herramienta
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="py-12 text-center border border-dashed border-card-border rounded-lg p-8 bg-card-subtle">
          <p className="text-xs text-muted">
            No se encontraron herramientas que coincidan con &quot;{filterQuery}&quot;.
          </p>
          <button
            type="button"
            onClick={() => {
              setSelectedCategory('all');
              setFilterQuery('');
            }}
            className="mt-3 text-xs font-semibold text-accent hover:underline inline-block"
          >
            Restablecer filtros
          </button>
        </div>
      )}
    </div>
  );
}
