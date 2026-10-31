'use client';

import Link from 'next/link';
import { useState, useRef, useEffect } from 'react';
import { TOOLS, CATEGORIES, getAllCategories, getToolsByCategory, getToolBySlug } from '@/lib/tools';
import {
  CifraLogoIcon,
  getCategoryIcon,
  SearchIcon,
  ChevronDownIcon,
  MenuIcon,
  CrossIcon,
  StarIcon,
} from '@/components/Icons';
import ToolSearchBar from '@/components/ToolSearchBar';
import ThemeToggle from '@/components/ThemeToggle';
import { useFavorites } from '@/lib/useFavorites';

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const [categoryDropdownOpen, setCategoryDropdownOpen] = useState(false);
  const [favoritesDropdownOpen, setFavoritesDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const favDropdownRef = useRef<HTMLDivElement>(null);

  const { favorites, isLoaded } = useFavorites();

  // Close dropdowns on click outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setCategoryDropdownOpen(false);
      }
      if (favDropdownRef.current && !favDropdownRef.current.contains(e.target as Node)) {
        setFavoritesDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Global keyboard shortcut for search (Ctrl+K or Cmd+K)
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setSearchModalOpen(true);
      }
      if (e.key === 'Escape') {
        setSearchModalOpen(false);
        setCategoryDropdownOpen(false);
        setFavoritesDropdownOpen(false);
      }
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-card-border bg-card/90 backdrop-blur-md">
        <div className="mx-auto max-w-6xl px-4">
          <div className="flex h-14 items-center justify-between gap-3">
            {/* Logo and Brand Identity */}
            <div className="flex items-center gap-6">
              <Link
                href="/"
                className="flex items-center gap-2.5 text-foreground hover:opacity-90 transition-opacity"
                aria-label="Cifra — Portada"
              >
                <div className="w-7 h-7 rounded-md bg-foreground text-background flex items-center justify-center shrink-0">
                  <CifraLogoIcon className="w-4 h-4" />
                </div>
                <div className="flex items-baseline gap-1">
                  <span className="text-lg font-bold tracking-tight text-foreground font-sans">cifra</span>
                  <span className="text-[11px] text-muted font-mono font-medium">.tools</span>
                </div>
              </Link>

              {/* Desktop Navigation */}
              <nav className="hidden md:flex items-center gap-1" aria-label="Navegación principal">
                {/* Herramientas Dropdown */}
                <div className="relative" ref={dropdownRef}>
                  <button
                    type="button"
                    onClick={() => {
                      setCategoryDropdownOpen(!categoryDropdownOpen);
                      setFavoritesDropdownOpen(false);
                    }}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-muted hover:text-foreground hover:bg-card-hover transition-colors rounded-md"
                    aria-expanded={categoryDropdownOpen}
                  >
                    <span>Herramientas</span>
                    <ChevronDownIcon
                      className={`w-3.5 h-3.5 transition-transform duration-150 ${
                        categoryDropdownOpen ? 'rotate-180' : ''
                      }`}
                    />
                  </button>

                  {categoryDropdownOpen && (
                    <div
                      onMouseLeave={() => setCategoryDropdownOpen(false)}
                      className="absolute top-full left-0 mt-1 w-72 bg-card border border-card-border rounded-lg shadow-md p-1.5 z-50"
                    >
                      <div className="px-2.5 py-1.5 border-b border-card-border mb-1 flex items-center justify-between">
                        <span className="text-xs font-semibold text-muted">
                          Categorías
                        </span>
                        <Link
                          href="/herramientas"
                          onClick={() => setCategoryDropdownOpen(false)}
                          className="text-xs text-accent hover:underline font-medium"
                        >
                          Ver todas ({TOOLS.length})
                        </Link>
                      </div>
                      <div className="space-y-0.5">
                        {getAllCategories().map((catKey) => {
                          const cat = CATEGORIES[catKey];
                          const tools = getToolsByCategory(catKey);
                          return (
                            <Link
                              key={catKey}
                              href={`/herramientas#${catKey}`}
                              onClick={() => setCategoryDropdownOpen(false)}
                              className="flex items-center justify-between p-2 rounded-md hover:bg-card-hover transition-colors group"
                            >
                              <div className="flex items-center gap-2.5">
                                <div className="text-muted group-hover:text-accent transition-colors">
                                  {getCategoryIcon(catKey, 'w-4 h-4')}
                                </div>
                                <span className="text-sm font-medium text-foreground">
                                  {cat.name}
                                </span>
                              </div>
                              <span className="text-xs text-muted px-1.5 py-0.5 rounded bg-card-subtle font-mono">
                                {tools.length}
                              </span>
                            </Link>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>

                <Link
                  href="/guias"
                  className="px-3 py-1.5 text-sm font-medium text-muted hover:text-foreground hover:bg-card-hover transition-colors rounded-md"
                >
                  Guías
                </Link>

                <Link
                  href="/acerca"
                  className="px-3 py-1.5 text-sm font-medium text-muted hover:text-foreground hover:bg-card-hover transition-colors rounded-md"
                >
                  Acerca de
                </Link>
              </nav>
            </div>

            {/* Right Controls: Search, Favorites, Theme Toggle, Mobile Menu */}
            <div className="flex items-center gap-2">
              {/* Quick Search Trigger (Desktop) */}
              <button
                type="button"
                onClick={() => setSearchModalOpen(true)}
                className="hidden sm:flex items-center gap-2 px-3 py-1.5 text-xs text-muted bg-card-subtle hover:bg-card-hover border border-card-border rounded-md transition-colors w-48 justify-between"
                aria-label="Buscar herramienta"
              >
                <span className="flex items-center gap-2">
                  <SearchIcon className="w-3.5 h-3.5" />
                  <span>Buscar...</span>
                </span>
                <span className="kbd text-[10px]">Ctrl + K</span>
              </button>

              {/* Quick Search Trigger (Mobile icon only) */}
              <button
                type="button"
                onClick={() => setSearchModalOpen(true)}
                className="sm:hidden p-2 text-muted hover:text-foreground rounded-md hover:bg-card-hover"
                aria-label="Buscar herramienta"
              >
                <SearchIcon className="w-4 h-4" />
              </button>

              {/* Favorites Shortcut (Desktop) */}
              {isLoaded && favorites.length > 0 && (
                <div className="relative hidden md:block" ref={favDropdownRef}>
                  <button
                    type="button"
                    onClick={() => {
                      setFavoritesDropdownOpen(!favoritesDropdownOpen);
                      setCategoryDropdownOpen(false);
                    }}
                    className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-muted hover:text-foreground hover:bg-card-hover rounded-md transition-colors"
                    aria-label="Herramientas favoritas"
                    aria-expanded={favoritesDropdownOpen}
                  >
                    <StarIcon size={14} className="text-amber-500 fill-amber-500" />
                    <span>Favoritos</span>
                    <span className="text-[10px] px-1 py-0.2 rounded bg-card-subtle font-mono text-muted">
                      {favorites.length}
                    </span>
                  </button>

                  {favoritesDropdownOpen && (
                    <div className="absolute top-full right-0 mt-1 w-64 bg-card border border-card-border rounded-lg shadow-md p-1.5 z-50">
                      <div className="px-2 py-1 border-b border-card-border mb-1 text-xs font-semibold text-muted">
                        Tus herramientas favoritas
                      </div>
                      <div className="space-y-0.5 max-h-60 overflow-y-auto">
                        {favorites.map((slug) => {
                          const tool = getToolBySlug(slug);
                          if (!tool) return null;
                          return (
                            <Link
                              key={slug}
                              href={`/herramientas/${slug}`}
                              onClick={() => setFavoritesDropdownOpen(false)}
                              className="flex items-center justify-between p-2 rounded-md hover:bg-card-hover transition-colors text-xs text-foreground font-medium"
                            >
                              <span>{tool.shortName}</span>
                              <span className="text-[10px] text-muted font-mono">{tool.technicalTag}</span>
                            </Link>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Theme Toggle Button */}
              <ThemeToggle />

              {/* Mobile Menu Button */}
              <button
                type="button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 text-muted hover:text-foreground hover:bg-card-hover rounded-md"
                aria-label="Abrir menú"
                aria-expanded={mobileMenuOpen}
              >
                {mobileMenuOpen ? <CrossIcon className="w-5 h-5" /> : <MenuIcon className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-card-border bg-card px-4 py-4 space-y-3">
            <div className="space-y-1">
              <Link
                href="/herramientas"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-between p-2.5 rounded-md text-sm font-medium text-foreground hover:bg-card-hover"
              >
                <span>Todas las herramientas ({TOOLS.length})</span>
              </Link>
              <Link
                href="/guias"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-between p-2.5 rounded-md text-sm font-medium text-foreground hover:bg-card-hover"
              >
                <span>Guías técnicas</span>
              </Link>
              <Link
                href="/acerca"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-between p-2.5 rounded-md text-sm font-medium text-foreground hover:bg-card-hover"
              >
                <span>Acerca de Cifra</span>
              </Link>
            </div>

            {/* Mobile Categories Accordion */}
            <div className="pt-2 border-t border-card-border">
              <span className="block px-2.5 py-1 text-xs font-semibold text-muted">
                Categorías
              </span>
              <div className="grid grid-cols-2 gap-1 mt-1">
                {getAllCategories().map((catKey) => {
                  const cat = CATEGORIES[catKey];
                  return (
                    <Link
                      key={catKey}
                      href={`/herramientas#${catKey}`}
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center gap-2 p-2 rounded-md text-xs font-medium text-muted hover:text-foreground hover:bg-card-hover"
                    >
                      {getCategoryIcon(catKey, 'w-3.5 h-3.5')}
                      <span>{cat.name}</span>
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Global Search Modal overlay */}
      {searchModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Búsqueda rápida de herramientas"
          className="fixed inset-0 z-50 bg-background/80 backdrop-blur-xs flex items-start justify-center pt-20 px-4"
          onClick={() => setSearchModalOpen(false)}
        >
          <div
            className="w-full max-w-xl bg-card border border-card-border rounded-xl shadow-md p-4 animate-in fade-in zoom-in-95 duration-100"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-card-border mb-3">
              <span className="text-xs font-semibold text-muted uppercase tracking-wider">
                Búsqueda Rápida
              </span>
              <button
                type="button"
                onClick={() => setSearchModalOpen(false)}
                className="p-1 text-muted hover:text-foreground rounded"
                aria-label="Cerrar búsqueda"
              >
                <CrossIcon className="w-4 h-4" />
              </button>
            </div>

            <ToolSearchBar
              autoFocus
              onSelectTool={() => setSearchModalOpen(false)}
              placeholder="Escribe el nombre o RFC (ej. subredes, md5, json, base64...)"
            />
          </div>
        </div>
      )}
    </>
  );
}
