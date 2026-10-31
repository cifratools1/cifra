'use client';

import { useState, useId } from 'react';
import { CopyButton } from '@/components/ToolComponents';

interface LimitConfig {
  name: string;
  limit: number;
  description: string;
  tag: string;
}

const LIMITS: LimitConfig[] = [
  {
    name: 'Twitter / X',
    limit: 280,
    description: 'Límite de publicación estándar',
    tag: 'Redes',
  },
  {
    name: 'Google Title Tag',
    limit: 60,
    description: 'Longitud recomendada para resultados de búsqueda',
    tag: 'SEO',
  },
  {
    name: 'Google Meta Description',
    limit: 160,
    description: 'Snippet óptimo en motores de búsqueda',
    tag: 'SEO',
  },
  {
    name: 'Instagram (Pie de foto)',
    limit: 2200,
    description: 'Longitud máxima para captions en publicaciones',
    tag: 'Redes',
  },
  {
    name: 'LinkedIn (Publicación)',
    limit: 3000,
    description: 'Límite por publicación en el feed',
    tag: 'Redes',
  },
  {
    name: 'SMS Estándar (GSM-7)',
    limit: 160,
    description: 'Límite de un único mensaje de texto tradicional',
    tag: 'Mensajería',
  },
];

const SAMPLES = [
  {
    label: 'Publicación Twitter / X',
    text: 'Descubre Cifra: herramientas técnicas gratuitas, privadas y de código abierto. Calcula subredes IPv4, convierte colores y formatos sin que tus datos salgan jamás de tu navegador. 🚀 #TechTools #WebDev #Privacidad',
  },
  {
    label: 'Meta Descripción SEO',
    text: 'Contador de caracteres y palabras online gratuito. Analiza texto en tiempo real con estadísticas de lectura, párrafos y límites para Twitter, SEO e Instagram.',
  },
  {
    label: 'Párrafo Editorial',
    text: 'La optimización de contenidos digitales exige un balance riguroso entre síntesis argumental y precisión técnica. Cuando un texto se redacta con métricas claras de legibilidad, el lector asimila la información con menor fatiga cognitiva y mayor tasa de retención.\n\nEl análisis sistemático del conteo de palabras, la extensión de las oraciones y el ritmo de los párrafos permite a redactores y desarrolladores comunicar ideas complejas de forma directa y efectiva.',
  },
];

export default function CharacterCounter() {
  const [text, setText] = useState('');
  const textareaId = useId();

  // Metrics calculation
  const charsTotal = text.length;
  const charsNoSpaces = text.replace(/\s/g, '').length;
  
  const trimmed = text.trim();
  const words = trimmed === '' ? 0 : trimmed.split(/\s+/).length;

  const sentences = (() => {
    if (!trimmed) return 0;
    const matches = trimmed.match(/[^.!?…]+(?:[.!?…]+|$)/g);
    return matches ? matches.filter(s => s.trim().length > 0).length : 0;
  })();

  const paragraphs = (() => {
    if (!trimmed) return 0;
    return trimmed.split(/\n\s*\n/).filter(p => p.trim().length > 0).length;
  })();

  const lines = text.length === 0 ? 0 : text.split(/\r\n|\r|\n/).length;

  // Reading time (200 words / minute)
  const readingTimeText = (() => {
    if (words === 0) return '0 s';
    const totalSeconds = Math.round((words / 200) * 60);
    if (totalSeconds < 60) return `${Math.max(1, totalSeconds)} s`;
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return seconds > 0 ? `${minutes} min ${seconds} s` : `${minutes} min`;
  })();

  // Speaking time (130 words / minute)
  const speakingTimeText = (() => {
    if (words === 0) return '0 s';
    const totalSeconds = Math.round((words / 130) * 60);
    if (totalSeconds < 60) return `${Math.max(1, totalSeconds)} s`;
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return seconds > 0 ? `${minutes} min ${seconds} s` : `${minutes} min`;
  })();

  // Average word length
  const avgWordLength = words > 0 ? (charsNoSpaces / words).toFixed(1) : '0';

  const handleClear = () => {
    setText('');
  };

  const handlePaste = async () => {
    try {
      const clipboardText = await navigator.clipboard.readText();
      setText(clipboardText);
    } catch {
      // Fallback
    }
  };

  return (
    <div className="space-y-6">
      {/* Input container */}
      <div className="border border-card-border rounded-xl bg-card p-4 sm:p-6 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
          <label
            htmlFor={textareaId}
            className="text-sm font-semibold text-foreground flex items-center gap-2"
          >
            <span>Texto para analizar</span>
            <span className="text-xs font-normal text-muted">
              (Escribe o pega tu contenido)
            </span>
          </label>

          {/* Quick actions bar */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePaste}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-md border border-card-border bg-card text-muted hover:text-foreground hover:border-input-border transition-colors"
              title="Pegar contenido del portapapeles"
            >
              <svg width="13" height="13" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5">
                <rect x="3" y="4" width="8" height="9" rx="1.5" />
                <path d="M5 4V2.5A1.5 1.5 0 016.5 1h1A1.5 1.5 0 019 2.5V4" />
              </svg>
              Pegar
            </button>
            <CopyButton text={text} label="Copiar texto" />
            {text && (
              <button
                type="button"
                onClick={handleClear}
                className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-md border border-card-border text-danger hover:bg-danger-light transition-colors"
                title="Borrar todo el texto"
              >
                <svg width="13" height="13" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M3 3l8 8M11 3l-8 8" />
                </svg>
                Limpiar
              </button>
            )}
          </div>
        </div>

        {/* Large Textarea */}
        <textarea
          id={textareaId}
          rows={9}
          value={text}
          onChange={e => setText(e.target.value)}
          placeholder="Escribe o pega aquí tu texto para analizar en tiempo real: caracteres, palabras, oraciones, tiempos de lectura y límites para redes sociales..."
          className="w-full resize-y rounded-lg border border-input-border bg-background p-4 text-foreground placeholder:text-muted/60 focus:border-accent focus:outline-none transition-colors text-base leading-relaxed"
          autoFocus
        />

        {/* Example templates */}
        <div className="mt-3 pt-3 border-t border-card-border/60 flex flex-wrap items-center gap-2">
          <span className="text-xs text-muted font-medium">Ejemplos rápidos:</span>
          {SAMPLES.map((sample, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setText(sample.text)}
              className="text-xs px-2.5 py-1 rounded-md bg-background border border-card-border text-muted hover:text-accent hover:border-accent/40 transition-colors"
            >
              {sample.label}
            </button>
          ))}
        </div>
      </div>

      {/* Primary Metrics Grid */}
      <div>
        <h2 className="text-base font-semibold text-foreground mb-3">
          Estadísticas en tiempo real
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          <div className="border border-card-border rounded-xl bg-card p-3.5 text-center">
            <span className="block text-2xl sm:text-3xl font-bold text-foreground tracking-tight">
              {charsTotal.toLocaleString('es-ES')}
            </span>
            <span className="text-xs font-medium text-muted mt-1 block">
              Caracteres
            </span>
            <span className="text-[10px] text-muted/70 block">con espacios</span>
          </div>

          <div className="border border-card-border rounded-xl bg-card p-3.5 text-center">
            <span className="block text-2xl sm:text-3xl font-bold text-foreground tracking-tight">
              {charsNoSpaces.toLocaleString('es-ES')}
            </span>
            <span className="text-xs font-medium text-muted mt-1 block">
              Caracteres
            </span>
            <span className="text-[10px] text-muted/70 block">sin espacios</span>
          </div>

          <div className="border border-card-border rounded-xl bg-card p-3.5 text-center">
            <span className="block text-2xl sm:text-3xl font-bold text-accent tracking-tight">
              {words.toLocaleString('es-ES')}
            </span>
            <span className="text-xs font-medium text-muted mt-1 block">
              Palabras
            </span>
            <span className="text-[10px] text-muted/70 block">totales</span>
          </div>

          <div className="border border-card-border rounded-xl bg-card p-3.5 text-center">
            <span className="block text-2xl sm:text-3xl font-bold text-foreground tracking-tight">
              {sentences.toLocaleString('es-ES')}
            </span>
            <span className="text-xs font-medium text-muted mt-1 block">
              Oraciones
            </span>
            <span className="text-[10px] text-muted/70 block">frases completas</span>
          </div>

          <div className="border border-card-border rounded-xl bg-card p-3.5 text-center">
            <span className="block text-2xl sm:text-3xl font-bold text-foreground tracking-tight">
              {paragraphs.toLocaleString('es-ES')}
            </span>
            <span className="text-xs font-medium text-muted mt-1 block">
              Párrafos
            </span>
            <span className="text-[10px] text-muted/70 block">bloques de texto</span>
          </div>

          <div className="border border-card-border rounded-xl bg-card p-3.5 text-center">
            <span className="block text-2xl sm:text-3xl font-bold text-foreground tracking-tight">
              {lines.toLocaleString('es-ES')}
            </span>
            <span className="text-xs font-medium text-muted mt-1 block">
              Líneas
            </span>
            <span className="text-[10px] text-muted/70 block">con saltos</span>
          </div>
        </div>
      </div>

      {/* Reading / Speaking times & Text dynamics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="border border-card-border rounded-xl bg-card p-4 flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-lg bg-accent-light text-accent flex items-center justify-center shrink-0">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.75">
              <circle cx="10" cy="10" r="7.5" />
              <path d="M10 6v4l2.5 2.5" />
            </svg>
          </div>
          <div>
            <span className="text-xs text-muted font-medium block">Tiempo de lectura</span>
            <span className="text-lg font-bold text-foreground">{readingTimeText}</span>
            <span className="text-[11px] text-muted/70 block">Promedio 200 palabras/min</span>
          </div>
        </div>

        <div className="border border-card-border rounded-xl bg-card p-4 flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-lg bg-warning-light text-warning flex items-center justify-center shrink-0">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.75">
              <path d="M10 2.5a3.5 3.5 0 00-3.5 3.5v4a3.5 3.5 0 007 0V6a3.5 3.5 0 00-3.5-3.5z" />
              <path d="M4 8.5v1.5a6 6 0 0012 0V8.5" />
              <path d="M10 16v2.5" />
            </svg>
          </div>
          <div>
            <span className="text-xs text-muted font-medium block">Tiempo de locución</span>
            <span className="text-lg font-bold text-foreground">{speakingTimeText}</span>
            <span className="text-[11px] text-muted/70 block">Promedio 130 palabras/min</span>
          </div>
        </div>

        <div className="border border-card-border rounded-xl bg-card p-4 flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-lg bg-code-bg text-muted flex items-center justify-center shrink-0">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.75">
              <path d="M4 6h12M4 10h8M4 14h10" />
            </svg>
          </div>
          <div>
            <span className="text-xs text-muted font-medium block">Longitud media palabra</span>
            <span className="text-lg font-bold text-foreground">{avgWordLength} car.</span>
            <span className="text-[11px] text-muted/70 block">densidad del vocabulario</span>
          </div>
        </div>
      </div>

      {/* Social Media & SEO Limits with Progress Bars */}
      <div className="border border-card-border rounded-xl bg-card p-5 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-base font-bold text-foreground">
              Límites para redes sociales y SEO
            </h2>
            <p className="text-xs text-muted mt-0.5">
              Supervisión de longitud máxima recomendada según la plataforma de publicación
            </p>
          </div>
          <span className="text-xs font-semibold px-2 py-0.5 rounded bg-code-bg text-muted">
            {charsTotal} caracteres
          </span>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {LIMITS.map((item, idx) => {
            const percentage = Math.round((charsTotal / item.limit) * 100);
            const isExceeded = charsTotal > item.limit;
            const isNear = !isExceeded && percentage >= 85;

            // Bar color
            let barColor = 'bg-accent';
            let badgeStyle = 'text-accent bg-accent-light';

            if (isExceeded) {
              barColor = 'bg-danger';
              badgeStyle = 'text-danger bg-danger-light';
            } else if (isNear) {
              barColor = 'bg-warning';
              badgeStyle = 'text-warning bg-warning-light';
            }

            return (
              <div
                key={idx}
                className="border border-card-border/70 rounded-lg p-3.5 bg-background flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-sm font-semibold text-foreground">
                      {item.name}
                    </span>
                    <span
                      className={`text-[11px] font-semibold px-2 py-0.5 rounded ${badgeStyle}`}
                    >
                      {isExceeded
                        ? `+${charsTotal - item.limit} excedido`
                        : `${item.limit - charsTotal} restantes`}
                    </span>
                  </div>
                  <p className="text-xs text-muted mt-0.5">{item.description}</p>
                </div>

                <div className="mt-3">
                  <div className="flex items-center justify-between text-xs text-muted mb-1.5">
                    <span>
                      {charsTotal} / {item.limit.toLocaleString('es-ES')}
                    </span>
                    <span className="font-medium">{percentage}%</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-card-border overflow-hidden">
                    <div
                      className={`h-full transition-all duration-200 ${barColor}`}
                      style={{ width: `${Math.min(percentage, 100)}%` }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
