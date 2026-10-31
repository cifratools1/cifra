'use client';

import { useState, useMemo, useRef, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { TOOLS } from '@/lib/tools';
import { getToolIcon, SearchIcon, CrossIcon } from '@/components/Icons';

interface ToolSearchBarProps {
  placeholder?: string;
  autoFocus?: boolean;
  className?: string;
  onSelectTool?: () => void;
}

export default function ToolSearchBar({
  placeholder = 'Buscar por nombre o estándar RFC (Ctrl+K)...',
  autoFocus = false,
  className = '',
  onSelectTool,
}: ToolSearchBarProps) {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const filteredTools = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return TOOLS.filter(
      (tool) =>
        tool.name.toLowerCase().includes(q) ||
        tool.shortName.toLowerCase().includes(q) ||
        tool.description.toLowerCase().includes(q) ||
        tool.technicalTag.toLowerCase().includes(q) ||
        tool.taskHint.toLowerCase().includes(q) ||
        tool.keywords.some((k) => k.toLowerCase().includes(q))
    ).slice(0, 6);
  }, [query]);

  // Global keyboard shortcut: Ctrl+K or /
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        inputRef.current?.focus();
        setIsOpen(true);
      } else if (
        e.key === '/' &&
        document.activeElement?.tagName !== 'INPUT' &&
        document.activeElement?.tagName !== 'TEXTAREA'
      ) {
        e.preventDefault();
        inputRef.current?.focus();
        setIsOpen(true);
      }
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleInputKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (!isOpen || filteredTools.length === 0) return;

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev + 1) % filteredTools.length);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev - 1 + filteredTools.length) % filteredTools.length);
      } else if (e.key === 'Enter') {
        e.preventDefault();
        const selected = filteredTools[selectedIndex];
        if (selected) {
          router.push(`/herramientas/${selected.slug}`);
          setIsOpen(false);
          setQuery('');
          if (onSelectTool) onSelectTool();
          inputRef.current?.blur();
        }
      } else if (e.key === 'Escape') {
        setIsOpen(false);
        inputRef.current?.blur();
      }
    },
    [filteredTools, isOpen, onSelectTool, router, selectedIndex]
  );

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div ref={containerRef} className={`relative w-full ${className}`}>
      <div className="relative group">
        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-muted">
          <SearchIcon className="w-4 h-4" />
        </div>
        <input
          ref={inputRef}
          type="search"
          value={query}
          autoFocus={autoFocus}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
            setSelectedIndex(0);
          }}
          onFocus={() => setIsOpen(true)}
          onKeyDown={handleInputKeyDown}
          placeholder={placeholder}
          className="w-full pl-10 pr-20 py-2.5 bg-card border border-card-border rounded-lg text-foreground placeholder:text-muted focus:border-accent focus:ring-1 focus:ring-accent focus:outline-none text-sm transition-colors"
          aria-label="Buscar herramienta"
        />
        <div className="absolute inset-y-0 right-0 pr-3 flex items-center gap-1.5 pointer-events-auto">
          {query ? (
            <button
              type="button"
              onClick={() => {
                setQuery('');
                setIsOpen(false);
                inputRef.current?.focus();
              }}
              className="p-1 text-muted hover:text-foreground rounded transition-colors"
              aria-label="Limpiar búsqueda"
            >
              <CrossIcon className="w-3.5 h-3.5" />
            </button>
          ) : (
            <span className="hidden sm:inline kbd text-[10px]">Ctrl + K</span>
          )}
        </div>
      </div>

      {/* Results Dropdown */}
      {isOpen && query.trim() !== '' && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-card border border-card-border rounded-lg shadow-md z-50 overflow-hidden divide-y divide-card-border">
          {filteredTools.length > 0 ? (
            <div>
              <div className="px-3.5 py-1.5 bg-card-subtle flex items-center justify-between text-[11px] text-muted font-mono">
                <span>Resultados ({filteredTools.length})</span>
                <span className="hidden sm:inline">↑↓ navegar · Enter seleccionar</span>
              </div>
              <div className="divide-y divide-card-border">
                {filteredTools.map((tool, idx) => {
                  const isCurrent = idx === selectedIndex;
                  return (
                    <Link
                      key={tool.slug}
                      href={`/herramientas/${tool.slug}`}
                      onClick={() => {
                        setIsOpen(false);
                        setQuery('');
                        if (onSelectTool) onSelectTool();
                      }}
                      onMouseEnter={() => setSelectedIndex(idx)}
                      className={`flex items-start gap-3 p-3 transition-colors text-left ${
                        isCurrent ? 'bg-card-hover' : 'hover:bg-card-hover'
                      }`}
                    >
                      <div className="w-7 h-7 rounded bg-card-subtle border border-card-border flex items-center justify-center shrink-0 mt-0.5 text-foreground">
                        {getToolIcon(tool.slug, 'w-3.5 h-3.5')}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-sm font-semibold text-foreground truncate">
                            {tool.name}
                          </span>
                          <span className="text-[10px] text-muted font-mono px-1.5 py-0.2 rounded bg-card-subtle shrink-0">
                            {tool.technicalTag}
                          </span>
                        </div>
                        <p className="text-xs text-muted truncate mt-0.5">{tool.description}</p>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="p-5 text-center text-xs text-muted">
              <p>No se encontraron herramientas para &quot;<strong>{query}</strong>&quot;.</p>
              <div className="mt-2">
                <Link
                  href="/herramientas"
                  onClick={() => {
                    setIsOpen(false);
                    if (onSelectTool) onSelectTool();
                  }}
                  className="text-accent hover:underline font-medium"
                >
                  Ver el catálogo completo de {TOOLS.length} herramientas
                </Link>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
