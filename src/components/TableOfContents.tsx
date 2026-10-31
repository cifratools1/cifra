'use client';

import { useEffect, useState } from 'react';

interface TocItem {
  id: string;
  text: string;
}

export default function TableOfContents() {
  const [headings, setHeadings] = useState<TocItem[]>([]);
  const [activeId, setActiveId] = useState<string>('');

  useEffect(() => {
    let observer: IntersectionObserver | null = null;
    const timer = setTimeout(() => {
      // Buscar todos los h2 dentro de la etiqueta article
      const article = document.querySelector('article');
      if (!article) return;

      const elements = Array.from(article.querySelectorAll('h2'));
      const items: TocItem[] = elements.map((el, index) => {
        if (!el.id) {
          el.id = `seccion-${index + 1}`;
        }
        return {
          id: el.id,
          text: el.textContent || `Sección ${index + 1}`,
        };
      });

      setHeadings(items);

      observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              setActiveId(entry.target.id);
            }
          });
        },
        { rootMargin: '-80px 0px -60% 0px' }
      );

      elements.forEach((el) => observer?.observe(el));
    }, 0);

    return () => {
      clearTimeout(timer);
      observer?.disconnect();
    };
  }, []);

  if (headings.length === 0) return null;

  return (
    <nav
      aria-label="Índice de la guía"
      className="my-8 p-4 rounded-lg bg-card border border-card-border"
    >
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-mono font-semibold text-muted">
          Índice de contenidos
        </span>
        <span className="text-xs font-mono text-muted">
          {headings.length} secciones
        </span>
      </div>
      <ol className="space-y-1.5 text-sm font-sans">
        {headings.map((h, i) => (
          <li key={h.id}>
            <a
              href={`#${h.id}`}
              className={`block py-0.5 transition-colors ${
                activeId === h.id
                  ? 'text-accent font-semibold'
                  : 'text-muted hover:text-foreground'
              }`}
            >
              <span className="text-muted-light font-mono mr-2">{String(i + 1).padStart(2, '0')}.</span>
              {h.text}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}
