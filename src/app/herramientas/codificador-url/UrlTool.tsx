'use client';

import { useState, useEffect, useId, useMemo } from 'react';
import { CopyButton } from '@/components/ToolComponents';
import { SearchIcon } from '@/components/Icons';

type Mode = 'encode' | 'decode';
type Scope = 'component' | 'full'; // component = encodeURIComponent, full = encodeURI
type SpaceFormat = 'percent' | 'plus'; // %20 vs +

interface CharTransformation {
  original: string;
  encoded: string;
  count: number;
  description: string;
}

const COMMON_CHAR_DESCRIPTIONS: Record<string, string> = {
  ' ': 'Espacio en blanco',
  '/': 'Barra diagonal (separador de ruta)',
  ':': 'Dos puntos (separador de protocolo)',
  '?': 'Signo de interrogación (inicio de query)',
  '&': 'Ampersand (separador de parámetros)',
  '=': 'Signo igual (asignación de parámetro)',
  '#': 'Almohadilla (fragmento / ancla)',
  '@': 'Arroba (usuario en URL)',
  '+': 'Signo más',
  '%': 'Signo de porcentaje (delimitador de escape)',
  $: 'Signo de dólar',
  ',': 'Coma',
  ';': 'Punto y coma',
  '!': 'Signo de exclamación',
  "'": 'Comilla simple',
  '(': 'Paréntesis de apertura',
  ')': 'Paréntesis de cierre',
  '*': 'Asterisco',
};

interface ExampleItem {
  label: string;
  value: string;
  description: string;
  recommendedScope: Scope;
}

const EXAMPLES: ExampleItem[] = [
  {
    label: 'Parámetros de consulta (Query)',
    value: 'buscar=análisis de redes & seguridad?&orden=fecha asc&filtro=año:2026',
    description: 'Valores de búsqueda con espacios, ampersands e interrogaciones.',
    recommendedScope: 'component',
  },
  {
    label: 'URL completa con tildes y espacios',
    value: 'https://ejemplo.com/guía técnica/introducción al cifrado.html?tema=seguridad web',
    description: 'URL que necesita conservar el protocolo y las rutas estructurales.',
    recommendedScope: 'full',
  },
  {
    label: 'URL como parámetro de redirección',
    value: 'https://login.servicio.com/auth?continue=https://app.servicio.com/dashboard?view=resumen&tab=2',
    description: 'URL anidada dentro de otro parámetro que requiere codificación total.',
    recommendedScope: 'component',
  },
  {
    label: 'Texto multilingüe y símbolos',
    value: 'Café & té por $4.50 — España (100% natural) / ¿Preguntas? ¡Escríbenos!',
    description: 'Caracteres especiales en español, moneda y signos ortográficos.',
    recommendedScope: 'component',
  },
];

export default function UrlTool() {
  const [mode, setMode] = useState<Mode>('encode');
  const [scope, setScope] = useState<Scope>('component');
  const [spaceFormat, setSpaceFormat] = useState<SpaceFormat>('percent');
  const [decodePlusAsSpace, setDecodePlusAsSpace] = useState<boolean>(true);
  const [input, setInput] = useState<string>('');
  const [output, setOutput] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  const inputId = useId();
  const outputId = useId();

  // Perform transformation
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!input) {
        setOutput('');
        setError(null);
        return;
      }

      if (input.length > 5 * 1024 * 1024) {
        setError('El texto supera los 5 MB. Para garantizar un rendimiento óptimo en el navegador, reduce el tamaño del texto.');
        setOutput('');
        return;
      }

      try {
        if (mode === 'encode') {
          let result: string;
          if (scope === 'component') {
            result = encodeURIComponent(input);
          } else {
            result = encodeURI(input);
          }

          // Handle space format if plus is requested
          if (spaceFormat === 'plus') {
            // Replace %20 with +
            result = result.replace(/%20/g, '+');
          }

          setOutput(result);
          setError(null);
        } else {
          let textToDecode = input;
          if (decodePlusAsSpace) {
            textToDecode = textToDecode.replace(/\+/g, ' ');
          }

          let result: string;
          if (scope === 'component') {
            result = decodeURIComponent(textToDecode);
          } else {
            result = decodeURI(textToDecode);
          }

          setOutput(result);
          setError(null);
        }
      } catch (err: unknown) {
        setOutput('');
        if (err instanceof URIError) {
          setError(
            'Error URI: La cadena contiene una secuencia de escape en porcentaje mal formada (ejemplo: un "%" incompleto como "%2" o caracteres hexadecimales no válidos).'
          );
        } else {
          setError('Ocurrió un error inesperado al procesar la URL.');
        }
      }
    }, 0);

    return () => clearTimeout(timer);
  }, [input, mode, scope, spaceFormat, decodePlusAsSpace]);

  // Compute character transformations to display
  const transformations = useMemo(() => {
    if (!input || !output || error) return [];

    // Limitar el análisis del desglose a 20.000 caracteres para evitar bloquear el hilo principal
    const textToAnalyze = input.length > 20000 ? input.slice(0, 20000) : input;
    const map = new Map<string, CharTransformation>();

    if (mode === 'encode') {
      // Analyze input characters and their encoded version
      for (const char of textToAnalyze) {
        let encodedChar: string;
        if (scope === 'component') {
          encodedChar = encodeURIComponent(char);
        } else {
          encodedChar = encodeURI(char);
        }

        if (spaceFormat === 'plus' && char === ' ') {
          encodedChar = '+';
        }

        if (encodedChar !== char) {
          const key = `${char}->${encodedChar}`;
          const existing = map.get(key);
          if (existing) {
            existing.count += 1;
          } else {
            map.set(key, {
              original: char,
              encoded: encodedChar,
              count: 1,
              description: COMMON_CHAR_DESCRIPTIONS[char] || `Carácter especial (U+${char.charCodeAt(0).toString(16).toUpperCase().padStart(4, '0')})`,
            });
          }
        }
      }
    } else {
      // In decode mode: find percent sequences in input
      const percentRegex = /%[0-9A-Fa-f]{2}/g;
      const matches = input.match(percentRegex) || [];

      // Also check for '+' if decodePlusAsSpace is active
      if (decodePlusAsSpace) {
        const plusMatches = input.match(/\+/g) || [];
        if (plusMatches.length > 0) {
          map.set('+-> ', {
            original: '+',
            encoded: '(espacio)',
            count: plusMatches.length,
            description: 'Signo más interpretado como espacio en blanco',
          });
        }
      }

      // Group percent tokens
      const tokenCounts = new Map<string, number>();
      for (const token of matches) {
        const normalized = token.toUpperCase();
        tokenCounts.set(normalized, (tokenCounts.get(normalized) || 0) + 1);
      }

      tokenCounts.forEach((count, token) => {
        try {
          const decoded = decodeURIComponent(token);
          map.set(`${token}->${decoded}`, {
            original: token,
            encoded: decoded,
            count,
            description: COMMON_CHAR_DESCRIPTIONS[decoded] || `Secuencia de escape decodificada`,
          });
        } catch {
          // Ignore incomplete multi-byte sequences in single token preview
        }
      });
    }

    return Array.from(map.values()).sort((a, b) => b.count - a.count);
  }, [input, output, mode, scope, spaceFormat, decodePlusAsSpace, error]);

  // Swap input & output
  const handleSwap = () => {
    if (!input && !output) return;
    const newMode: Mode = mode === 'encode' ? 'decode' : 'encode';
    setMode(newMode);
    setInput(output);
    setOutput('');
    setError(null);
  };

  const totalTransformedCount = transformations.reduce((sum, item) => sum + item.count, 0);

  return (
    <div className="space-y-6">
      {/* Mode selection tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-card-border pb-4">
        <div className="inline-flex rounded-lg border border-card-border bg-card p-1">
          <button
            type="button"
            onClick={() => {
              setMode('encode');
              setError(null);
            }}
            className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md transition-all ${
              mode === 'encode'
                ? 'bg-accent text-white shadow-sm'
                : 'text-muted hover:text-foreground'
            }`}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M2 5h12M9 2l3 3-3 3" />
            </svg>
            Codificar (URL Encode)
          </button>
          <button
            type="button"
            onClick={() => {
              setMode('decode');
              setError(null);
            }}
            className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md transition-all ${
              mode === 'decode'
                ? 'bg-accent text-white shadow-sm'
                : 'text-muted hover:text-foreground'
            }`}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M14 11H2M7 14l-3-3 3-3" />
            </svg>
            Decodificar (URL Decode)
          </button>
        </div>

        {/* Quick action buttons */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleSwap}
            disabled={!input && !output}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md border border-card-border bg-card text-foreground hover:bg-card-border/30 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            title="Invertir entrada y salida"
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M2 4h10M9 1.5L12 4l-3 2.5M12 10H2M5 7.5L2 10l3 2.5" />
            </svg>
            Invertir
          </button>

          <button
            type="button"
            onClick={() => {
              setInput('');
              setOutput('');
              setError(null);
            }}
            disabled={!input && !output}
            className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium rounded-md border border-card-border bg-card text-muted hover:text-danger hover:border-danger/40 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            Limpiar
          </button>
        </div>
      </div>

      {/* Configuration toolbar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-card border border-card-border rounded-lg p-4">
        {/* Scope selector */}
        <div className="space-y-2">
          <span className="text-xs font-semibold text-foreground block">
            Método de codificación:
          </span>
          <div className="space-y-1.5">
            <label className="flex items-start gap-2 cursor-pointer">
              <input
                type="radio"
                name="scope"
                value="component"
                checked={scope === 'component'}
                onChange={() => setScope('component')}
                className="mt-0.5 text-accent focus:ring-accent"
              />
              <div className="text-xs">
                <span className="font-semibold text-foreground">
                  Componente de URL (encodeURIComponent)
                </span>
                <p className="text-muted text-[11px] mt-0.5">
                  Codifica todo excepto letras, números y - _ . ! ~ * &apos; ( ). Ideal para valores de parámetros (?q=valor).
                </p>
              </div>
            </label>

            <label className="flex items-start gap-2 cursor-pointer pt-1">
              <input
                type="radio"
                name="scope"
                value="full"
                checked={scope === 'full'}
                onChange={() => setScope('full')}
                className="mt-0.5 text-accent focus:ring-accent"
              />
              <div className="text-xs">
                <span className="font-semibold text-foreground">
                  URL completa (encodeURI)
                </span>
                <p className="text-muted text-[11px] mt-0.5">
                  Conserva caracteres estructurales (: / ? # & = @). Ideal para URLs enteras (https://...).
                </p>
              </div>
            </label>
          </div>
        </div>

        {/* Space formatting & decode options */}
        <div className="space-y-2">
          <span className="text-xs font-semibold text-foreground block">
            {mode === 'encode' ? 'Formato para espacios:' : 'Opciones de decodificación:'}
          </span>

          {mode === 'encode' ? (
            <div className="space-y-1.5">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="spaceFormat"
                  value="percent"
                  checked={spaceFormat === 'percent'}
                  onChange={() => setSpaceFormat('percent')}
                  className="text-accent focus:ring-accent"
                />
                <span className="text-xs text-foreground font-mono">
                  %20 <span className="text-muted font-sans">(Estándar RFC 3986 — Recomendado)</span>
                </span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="spaceFormat"
                  value="plus"
                  checked={spaceFormat === 'plus'}
                  onChange={() => setSpaceFormat('plus')}
                  className="text-accent focus:ring-accent"
                />
                <span className="text-xs text-foreground font-mono">
                  + <span className="text-muted font-sans">(Formato application/x-www-form-urlencoded)</span>
                </span>
              </label>
            </div>
          ) : (
            <div className="space-y-1.5 pt-1">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={decodePlusAsSpace}
                  onChange={(e) => setDecodePlusAsSpace(e.target.checked)}
                  className="rounded border-card-border text-accent focus:ring-accent"
                />
                <span className="text-xs text-foreground">
                  Tratar el signo más (+) como espacio
                </span>
              </label>
              <p className="text-[11px] text-muted pl-6">
                Habitual en cadenas de consulta (query strings) de formularios web y motores de búsqueda.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Two panel layout: Input & Output */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input panel */}
        <div className="flex flex-col space-y-2">
          <div className="flex items-center justify-between">
            <label htmlFor={inputId} className="text-sm font-semibold text-foreground">
              {mode === 'encode' ? 'Texto o URL original:' : 'URL o texto codificado (%XX):'}
            </label>
            <span className="text-xs text-muted font-mono">{input.length} caracteres</span>
          </div>

          <div className="relative flex-1">
            <textarea
              id={inputId}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={
                mode === 'encode'
                  ? 'Escribe o pega aquí el texto o la URL que deseas codificar...'
                  : 'Pega aquí la URL o texto codificado con secuencias %XX o +...'
              }
              rows={10}
              className="w-full h-72 p-3 font-mono text-xs sm:text-sm bg-card border border-card-border rounded-lg text-foreground placeholder:text-muted/60 focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent resize-y transition-colors"
              spellCheck={false}
            />
          </div>
        </div>

        {/* Output panel */}
        <div className="flex flex-col space-y-2">
          <div className="flex items-center justify-between">
            <label htmlFor={outputId} className="text-sm font-semibold text-foreground">
              {mode === 'encode' ? 'Resultado codificado:' : 'Texto o URL decodificada:'}
            </label>
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted font-mono">{output.length} caracteres</span>
              {input.length > 0 && output.length > 0 && (
                <span className="text-xs px-1.5 py-0.5 rounded font-mono bg-accent/10 text-accent">
                  {output.length >= input.length ? `+${output.length - input.length} ch` : `${output.length - input.length} ch`}
                </span>
              )}
            </div>
          </div>

          <div className="relative flex-1">
            <textarea
              id={outputId}
              value={output}
              readOnly
              placeholder={
                mode === 'encode'
                  ? 'El texto codificado aparecerá aquí en tiempo real...'
                  : 'El texto decodificado aparecerá aquí en tiempo real...'
              }
              rows={10}
              className="w-full h-72 p-3 font-mono text-xs sm:text-sm bg-code-bg border border-card-border rounded-lg text-foreground placeholder:text-muted/60 focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent resize-y transition-colors"
              spellCheck={false}
            />

            {output && (
              <div className="absolute top-2 right-2">
                <CopyButton text={output} label="Copiar" />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Error alert */}
      {error && (
        <div
          role="alert"
          className="flex items-start gap-3 p-4 rounded-lg bg-danger-light border border-danger/30 text-danger text-sm"
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 18 18"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="flex-shrink-0 mt-0.5"
          >
            <circle cx="9" cy="9" r="7.5" />
            <path d="M9 5.5v4M9 12.5h.01" />
          </svg>
          <div className="space-y-1">
            <p className="font-semibold">Error al decodificar URL:</p>
            <p className="text-xs leading-relaxed">{error}</p>
          </div>
        </div>
      )}

      {/* Character breakdown section (Show which characters were encoded/decoded) */}
      {transformations.length > 0 && (
        <div className="border border-card-border rounded-lg bg-card p-4 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <SearchIcon size={16} className="text-muted" />
              <h3 className="text-sm font-semibold text-foreground">
                Caracteres {mode === 'encode' ? 'codificados' : 'decodificados'} ({totalTransformedCount} apariciones en total)
              </h3>
            </div>
            <span className="text-xs text-muted">
              {transformations.length} {transformations.length === 1 ? 'carácter distinto' : 'caracteres distintos'}
            </span>
          </div>

          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3 pt-1">
            {transformations.map((item, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-2.5 rounded-md border border-card-border bg-background text-xs"
              >
                <div className="flex items-center gap-2">
                  <span className="font-mono px-2 py-0.5 rounded bg-card border border-card-border font-semibold text-foreground">
                    {item.original === ' ' ? '␣' : item.original}
                  </span>
                  <span className="text-muted">→</span>
                  <span className="font-mono px-2 py-0.5 rounded bg-accent/10 border border-accent/20 font-semibold text-accent">
                    {item.encoded}
                  </span>
                </div>
                <div className="flex items-center gap-1.5 ml-2">
                  <span className="text-[10px] text-muted max-w-[90px] truncate" title={item.description}>
                    {item.description}
                  </span>
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded-full bg-card border border-card-border text-foreground">
                    ×{item.count}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Examples */}
      <div className="border border-card-border rounded-lg bg-card p-4">
        <h3 className="text-xs font-semibold text-muted mb-2">
          Ejemplos prácticos para probar:
        </h3>
        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
          {EXAMPLES.map((ex, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => {
                setMode('encode');
                setScope(ex.recommendedScope);
                setInput(ex.value);
                setError(null);
              }}
              className="text-left p-2.5 rounded-md border border-card-border bg-background hover:border-accent/40 hover:bg-card transition-colors group"
            >
              <div className="text-xs font-semibold text-foreground group-hover:text-accent transition-colors">
                {ex.label}
              </div>
              <div className="text-[11px] text-muted mt-0.5 line-clamp-2">{ex.description}</div>
              <span className="inline-block mt-2 text-[10px] font-mono px-1.5 py-0.5 rounded bg-card border border-card-border text-accent">
                {ex.recommendedScope === 'component' ? 'encodeURIComponent' : 'encodeURI'}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
