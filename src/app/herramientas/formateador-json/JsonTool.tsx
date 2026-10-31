'use client';

import { useState, useRef, useId, useMemo } from 'react';
import { CopyButton } from '@/components/ToolComponents';

type IndentOption = '2' | '4' | 'tab';

interface JsonStats {
  totalKeys: number;
  maxDepth: number;
  objectsCount: number;
  arraysCount: number;
  stringsCount: number;
  numbersCount: number;
  booleansCount: number;
  nullsCount: number;
  originalBytes: number;
  minifiedBytes: number;
  formattedBytes: number;
  bytesSaved: number;
  percentSaved: string;
}

interface JsonErrorInfo {
  message: string;
  line: number;
  column: number;
  snippet?: string;
  tip?: string;
}

const EXAMPLES = [
  {
    label: 'Usuario y perfil',
    value: JSON.stringify(
      {
        id: 1042,
        nombre: 'Elena Morales',
        email: 'elena@ejemplo.com',
        activo: true,
        roles: ['admin', 'desarrollador'],
        configuracion: {
          tema: 'oscuro',
          notificaciones: { email: true, push: false },
          idioma: 'es-ES',
        },
        ultimo_acceso: null,
      },
      null,
      2
    ),
    description: 'Estructura típica de API con tipos mixtos (objetos, arrays, null, booleanos).',
  },
  {
    label: 'Catálogo de productos',
    value: JSON.stringify(
      {
        tienda: 'Cifra Tech Store',
        moneda: 'EUR',
        articulos: [
          { sku: 'KBD-01', nombre: 'Teclado Mecánico', precio: 89.99, stock: 15 },
          { sku: 'MOU-02', nombre: 'Ratón Ergonómico', precio: 45.5, stock: 32 },
          { sku: 'MON-03', nombre: 'Monitor 4K 27"', precio: 349.0, stock: 8 },
        ],
        paginacion: { pagina: 1, por_pagina: 10, total: 3 },
      },
      null,
      2
    ),
    description: 'Array de objetos con números flotantes, enteros y atributos anidados.',
  },
  {
    label: 'JSON con errores comunes',
    value: `{\n  'nombre': 'Carlos',\n  edad: 28,\n  hobbies: [\n    "programación",\n    "música",\n  ],\n  // Comentario no permitido en JSON estándar\n}`,
    description: 'Demuestra detección de comillas simples, claves sin comillas y trailing commas.',
  },
];

export default function JsonTool() {
  const [input, setInput] = useState<string>('');
  const [output, setOutput] = useState<string>('');
  const [indent, setIndent] = useState<IndentOption>('2');
  const [isValid, setIsValid] = useState<boolean | null>(null);
  const [errorInfo, setErrorInfo] = useState<JsonErrorInfo | null>(null);
  const [activeTab, setActiveTab] = useState<'formatted' | 'minified'>('formatted');

  const fileInputRef = useRef<HTMLInputElement>(null);
  const inputId = useId();
  const outputId = useId();

  // Helper to diagnose specific syntax errors and suggest fixes
  const analyzeSyntaxError = (raw: string, err: Error): JsonErrorInfo => {
    let line = 1;
    let column = 1;
    let position = -1;

    // Try extracting line and column directly from error message
    // e.g. "at line 3 column 5" or "line 3 column 5"
    const lineColMatch = err.message.match(/line\s+(\d+)\s+column\s+(\d+)/i);
    if (lineColMatch) {
      line = parseInt(lineColMatch[1], 10);
      column = parseInt(lineColMatch[2], 10);
    } else {
      // e.g. "at position 45"
      const posMatch = err.message.match(/position\s+(\d+)/i);
      if (posMatch) {
        position = parseInt(posMatch[1], 10);
        const textBefore = raw.slice(0, position);
        const lines = textBefore.split('\n');
        line = lines.length;
        column = lines[lines.length - 1].length + 1;
      }
    }

    // Build snippet
    const rawLines = raw.split('\n');
    let snippet = '';
    if (line >= 1 && line <= rawLines.length) {
      const targetLine = rawLines[line - 1];
      const pointer = ' '.repeat(Math.max(0, column - 1)) + '^';
      snippet = `${targetLine}\n${pointer}`;
    }

    // Diagnostic tips in Spanish
    let tip = 'Verifica la puntuación, llaves o comillas alrededor de esta posición.';
    if (raw.includes('//') || raw.includes('/*')) {
      tip = 'Se detectaron comentarios (// o /* */). La especificación estándar de JSON no admite comentarios.';
    } else if (/,\s*[}\]]/.test(raw)) {
      tip = 'Se detectó una coma sobrante (trailing comma) antes de cerrar "}" o "]". En JSON estándar esto no es válido.';
    } else if (raw.includes("'")) {
      tip = 'Se detectaron comillas simples (\'). En JSON todos los nombres de propiedades y textos deben usar comillas dobles (").';
    } else if (/([{,]\s*)([a-zA-Z0-9_$]+)\s*:/.test(raw)) {
      tip = 'Se detectaron claves de objeto sin comillas. En JSON cada clave debe ir entre comillas dobles obligatoriamente.';
    } else if (err.message.toLowerCase().includes('unexpected end')) {
      tip = 'El JSON terminó de forma prematura. Asegúrate de cerrar todas las llaves { } y corchetes [ ] abiertos.';
    }

    return {
      message: err.message,
      line,
      column,
      snippet,
      tip,
    };
  };

  // Format JSON
  const handleFormat = () => {
    if (!input.trim()) {
      setOutput('');
      setIsValid(null);
      setErrorInfo(null);
      return;
    }

    try {
      const parsed = JSON.parse(input);
      const indentValue = indent === 'tab' ? '\t' : Number(indent);
      const formatted = JSON.stringify(parsed, null, indentValue);
      setOutput(formatted);
      setIsValid(true);
      setErrorInfo(null);
      setActiveTab('formatted');
    } catch (err: unknown) {
      setIsValid(false);
      setOutput('');
      if (err instanceof Error) {
        setErrorInfo(analyzeSyntaxError(input, err));
      }
    }
  };

  // Minify JSON
  const handleMinify = () => {
    if (!input.trim()) {
      setOutput('');
      setIsValid(null);
      setErrorInfo(null);
      return;
    }

    try {
      const parsed = JSON.parse(input);
      const minified = JSON.stringify(parsed);
      setOutput(minified);
      setIsValid(true);
      setErrorInfo(null);
      setActiveTab('minified');
    } catch (err: unknown) {
      setIsValid(false);
      setOutput('');
      if (err instanceof Error) {
        setErrorInfo(analyzeSyntaxError(input, err));
      }
    }
  };

  // Validate only
  const handleValidate = () => {
    if (!input.trim()) {
      setIsValid(null);
      setErrorInfo(null);
      return;
    }

    try {
      JSON.parse(input);
      setIsValid(true);
      setErrorInfo(null);
    } catch (err: unknown) {
      setIsValid(false);
      if (err instanceof Error) {
        setErrorInfo(analyzeSyntaxError(input, err));
      }
    }
  };

  // Compute statistics recursively if valid
  const stats: JsonStats | null = useMemo(() => {
    if (!isValid || !input.trim()) return null;

    try {
      const parsed = JSON.parse(input);

      let totalKeys = 0;
      let objectsCount = 0;
      let arraysCount = 0;
      let stringsCount = 0;
      let numbersCount = 0;
      let booleansCount = 0;
      let nullsCount = 0;

      const traverse = (val: unknown, currentDepth: number): number => {
        if (val === null) {
          nullsCount++;
          return currentDepth;
        }
        if (typeof val === 'boolean') {
          booleansCount++;
          return currentDepth;
        }
        if (typeof val === 'number') {
          numbersCount++;
          return currentDepth;
        }
        if (typeof val === 'string') {
          stringsCount++;
          return currentDepth;
        }
        if (Array.isArray(val)) {
          arraysCount++;
          let maxD = currentDepth;
          for (const item of val) {
            maxD = Math.max(maxD, traverse(item, currentDepth + 1));
          }
          return maxD;
        }
        if (typeof val === 'object') {
          objectsCount++;
          const keys = Object.keys(val as object);
          totalKeys += keys.length;
          let maxD = currentDepth;
          for (const k of keys) {
            maxD = Math.max(maxD, traverse((val as Record<string, unknown>)[k], currentDepth + 1));
          }
          return maxD;
        }
        return currentDepth;
      };

      const maxDepth = traverse(parsed, 1);
      const encoder = new TextEncoder();
      const originalBytes = encoder.encode(input).length;
      const minifiedString = JSON.stringify(parsed);
      const minifiedBytes = encoder.encode(minifiedString).length;
      const indentValue = indent === 'tab' ? '\t' : Number(indent);
      const formattedBytes = encoder.encode(JSON.stringify(parsed, null, indentValue)).length;

      const saved = originalBytes > minifiedBytes ? originalBytes - minifiedBytes : 0;
      const pct = originalBytes > 0 ? ((saved / originalBytes) * 100).toFixed(1) : '0';

      return {
        totalKeys,
        maxDepth,
        objectsCount,
        arraysCount,
        stringsCount,
        numbersCount,
        booleansCount,
        nullsCount,
        originalBytes,
        minifiedBytes,
        formattedBytes,
        bytesSaved: saved,
        percentSaved: pct,
      };
    } catch {
      return null;
    }
  }, [input, isValid, indent]);

  // Handle file upload
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      setErrorInfo({
        message: 'El archivo supera los 10 MB. Para evitar que el navegador se congele, sube archivos JSON de hasta 10 MB.',
        line: 1,
        column: 1,
        tip: 'Para archivos más grandes, utiliza herramientas de línea de comandos como jq.',
      });
      setIsValid(false);
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      setInput(content || '');
      setIsValid(null);
      setErrorInfo(null);
      setOutput('');
    };
    reader.readAsText(file);
  };

  // Download output
  const handleDownload = () => {
    const textToDownload = output || input;
    if (!textToDownload) return;
    const blob = new Blob([textToDownload], { type: 'application/json;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = activeTab === 'minified' ? 'archivo.min.json' : 'archivo.formateado.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Line count for output code block
  const outputLines = output ? output.split('\n') : [];

  return (
    <div className="space-y-6">
      {/* Action toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-card-border pb-4">
        {/* Main action buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={handleFormat}
            disabled={!input.trim()}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium rounded-lg bg-accent text-white hover:bg-accent-hover disabled:opacity-40 disabled:cursor-not-allowed shadow-sm transition-colors"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M2 3h12M2 7h8M2 11h12M2 15h6" />
            </svg>
            Formatear (Beautify)
          </button>

          <button
            type="button"
            onClick={handleMinify}
            disabled={!input.trim()}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-sm font-medium rounded-lg border border-card-border bg-card text-foreground hover:bg-card-border/30 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M1 8h14M4 4l-3 4 3 4M12 4l3 4-3 4" />
            </svg>
            Minificar
          </button>

          <button
            type="button"
            onClick={handleValidate}
            disabled={!input.trim()}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-sm font-medium rounded-lg border border-card-border bg-card text-foreground hover:bg-card-border/30 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M13.5 4.5l-7 7-3.5-3.5" />
            </svg>
            Validar
          </button>
        </div>

        {/* Secondary options: file & clear */}
        <div className="flex items-center gap-2">
          <input
            ref={fileInputRef}
            type="file"
            accept=".json,application/json,text/plain"
            onChange={handleFileUpload}
            className="hidden"
            aria-label="Cargar archivo JSON"
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md border border-card-border bg-card text-foreground hover:bg-card-border/30 transition-colors"
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M7 9V2m0 0l-2.5 2.5M7 2l2.5 2.5M2 10v1.5A1.5 1.5 0 003.5 13h7a1.5 1.5 0 001.5-1.5V10" />
            </svg>
            Cargar .json
          </button>

          <button
            type="button"
            onClick={() => {
              setInput('');
              setOutput('');
              setIsValid(null);
              setErrorInfo(null);
            }}
            disabled={!input && !output}
            className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium rounded-md border border-card-border bg-card text-muted hover:text-danger hover:border-danger/40 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            Limpiar
          </button>
        </div>
      </div>

      {/* Indentation configuration */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-card border border-card-border rounded-lg p-3 text-xs">
        <div className="flex items-center gap-3">
          <span className="font-semibold text-foreground">Sangría de formateo:</span>
          <div className="inline-flex items-center gap-2">
            {(['2', '4', 'tab'] as IndentOption[]).map((opt) => (
              <label key={opt} className="inline-flex items-center gap-1.5 cursor-pointer">
                <input
                  type="radio"
                  name="indent"
                  value={opt}
                  checked={indent === opt}
                  onChange={() => setIndent(opt)}
                  className="text-accent focus:ring-accent"
                />
                <span className="text-foreground">
                  {opt === 'tab' ? 'Tabulador (Tab)' : `${opt} espacios`}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Validation status badge */}
        {isValid === true && (
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-success-light text-success border border-success/30 font-medium">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 7l3 3 5-5" />
            </svg>
            JSON Sintácticamente Válido
          </div>
        )}
        {isValid === false && (
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-danger-light text-danger border border-danger/30 font-medium">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 3l8 8M11 3l-8 8" />
            </svg>
            JSON Inválido (Revisa el error)
          </div>
        )}
      </div>

      {/* Two panel layout: Input Left/Top, Output Right/Bottom */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input panel */}
        <div className="flex flex-col space-y-2">
          <div className="flex items-center justify-between">
            <label htmlFor={inputId} className="text-sm font-semibold text-foreground">
              JSON de entrada:
            </label>
            <span className="text-xs text-muted font-mono">{input.length} caracteres</span>
          </div>

          <div className="relative flex-1">
            <textarea
              id={inputId}
              value={input}
              onChange={(e) => {
                setInput(e.target.value);
                setIsValid(null);
                setErrorInfo(null);
              }}
              placeholder="Pega o escribe aquí tu código JSON..."
              rows={14}
              className="w-full h-96 p-3 font-mono text-xs sm:text-sm bg-card border border-card-border rounded-lg text-foreground placeholder:text-muted/60 focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent resize-y transition-colors"
              spellCheck={false}
            />
          </div>
        </div>

        {/* Output panel */}
        <div className="flex flex-col space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-foreground">Resultado procesado:</span>
              {output && (
                <span className="text-xs text-muted font-mono">
                  {outputLines.length} {outputLines.length === 1 ? 'línea' : 'líneas'} · {output.length} caracteres
                </span>
              )}
            </div>

            {output && (
              <div className="flex items-center gap-2">
                <CopyButton text={output} label="Copiar" />
                <button
                  type="button"
                  onClick={handleDownload}
                  className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium rounded-md border border-card-border bg-card text-muted hover:text-foreground transition-colors"
                  title="Descargar archivo JSON"
                >
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M7 2v7m0 0l2.5-2.5M7 9L4.5 6.5M2 11h10" />
                  </svg>
                  Descargar
                </button>
              </div>
            )}
          </div>

          <div className="relative flex-1">
            <textarea
              id={outputId}
              value={output}
              readOnly
              placeholder="Haz clic en Formatear o Minificar para ver el código resultante aquí..."
              rows={14}
              className="w-full h-96 p-3 font-mono text-xs sm:text-sm bg-code-bg border border-card-border rounded-lg text-foreground placeholder:text-muted/60 focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent resize-y transition-colors"
              spellCheck={false}
            />
          </div>
        </div>
      </div>

      {/* Error alert with line/col and suggestion pointer */}
      {errorInfo && (
        <div
          role="alert"
          className="p-4 rounded-lg bg-danger-light border border-danger/30 text-danger text-sm space-y-3"
        >
          <div className="flex items-start gap-2.5">
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
            <div>
              <p className="font-semibold text-danger">
                Error de sintaxis JSON en Línea {errorInfo.line}, Columna {errorInfo.column}:
              </p>
              <p className="text-xs text-danger/90 mt-0.5">{errorInfo.message}</p>
            </div>
          </div>

          {/* Code snippet showing error location */}
          {errorInfo.snippet && (
            <div className="bg-card/70 border border-danger/20 rounded p-2.5 font-mono text-xs text-foreground overflow-x-auto">
              <pre className="whitespace-pre">{errorInfo.snippet}</pre>
            </div>
          )}

          {/* Diagnostic tip */}
          {errorInfo.tip && (
            <div className="flex items-center gap-2 text-xs text-foreground/80 bg-card/40 p-2 rounded">
              <span className="font-semibold text-danger font-mono text-xs">Sugerencia:</span>
              <span>{errorInfo.tip}</span>
            </div>
          )}
        </div>
      )}

      {/* JSON Statistics Card */}
      {stats && (
        <div className="border border-card-border rounded-lg bg-card p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-card-border pb-3">
            <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-accent shrink-0" aria-hidden="true">
                <line x1="18" y1="20" x2="18" y2="10" />
                <line x1="12" y1="20" x2="12" y2="4" />
                <line x1="6" y1="20" x2="6" y2="14" />
              </svg>
              <span>Métricas y estructura del JSON</span>
            </h3>
            {Number(stats.percentSaved) > 0 && (
              <span className="text-xs px-2 py-0.5 rounded-full font-mono bg-accent/10 text-accent font-semibold">
                Ahorro al minificar: {stats.percentSaved}% (-{stats.bytesSaved} bytes)
              </span>
            )}
          </div>

          {/* Quick stats grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="p-3 rounded-lg border border-card-border bg-background">
              <span className="text-muted block text-[11px]">Total Claves (Keys)</span>
              <span className="text-lg font-bold text-foreground font-mono mt-1 block">
                {stats.totalKeys}
              </span>
            </div>

            <div className="p-3 rounded-lg border border-card-border bg-background">
              <span className="text-muted block text-[11px]">Profundidad máxima</span>
              <span className="text-lg font-bold text-foreground font-mono mt-1 block">
                {stats.maxDepth} niveles
              </span>
            </div>

            <div className="p-3 rounded-lg border border-card-border bg-background">
              <span className="text-muted block text-[11px]">Tamaño original</span>
              <span className="text-lg font-bold text-foreground font-mono mt-1 block">
                {stats.originalBytes > 1024
                  ? `${(stats.originalBytes / 1024).toFixed(1)} KB`
                  : `${stats.originalBytes} B`}
              </span>
            </div>

            <div className="p-3 rounded-lg border border-card-border bg-background">
              <span className="text-muted block text-[11px]">Tamaño minificado</span>
              <span className="text-lg font-bold text-accent font-mono mt-1 block">
                {stats.minifiedBytes > 1024
                  ? `${(stats.minifiedBytes / 1024).toFixed(1)} KB`
                  : `${stats.minifiedBytes} B`}
              </span>
            </div>
          </div>

          {/* Types breakdown chips */}
          <div className="pt-1">
            <span className="text-xs font-semibold text-muted block mb-2">Desglose de valores:</span>
            <div className="flex flex-wrap gap-2 text-xs">
              <span className="px-2.5 py-1 rounded-md bg-background border border-card-border text-foreground">
                <strong>{stats.objectsCount}</strong> {stats.objectsCount === 1 ? 'Objeto' : 'Objetos'}
              </span>
              <span className="px-2.5 py-1 rounded-md bg-background border border-card-border text-foreground">
                <strong>{stats.arraysCount}</strong> {stats.arraysCount === 1 ? 'Array' : 'Arrays'}
              </span>
              <span className="px-2.5 py-1 rounded-md bg-background border border-card-border text-foreground">
                <strong>{stats.stringsCount}</strong> Textos (Strings)
              </span>
              <span className="px-2.5 py-1 rounded-md bg-background border border-card-border text-foreground">
                <strong>{stats.numbersCount}</strong> Números
              </span>
              <span className="px-2.5 py-1 rounded-md bg-background border border-card-border text-foreground">
                <strong>{stats.booleansCount}</strong> Booleanos
              </span>
              <span className="px-2.5 py-1 rounded-md bg-background border border-card-border text-foreground">
                <strong>{stats.nullsCount}</strong> Nulos (null)
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Examples section */}
      <div className="border border-card-border rounded-lg bg-card p-4">
        <h3 className="text-xs font-semibold text-muted mb-2">
          Ejemplos prácticos para probar:
        </h3>
        <div className="grid gap-2 sm:grid-cols-3">
          {EXAMPLES.map((ex, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => {
                setInput(ex.value);
                setOutput('');
                setIsValid(null);
                setErrorInfo(null);
              }}
              className="text-left p-2.5 rounded-md border border-card-border bg-background hover:border-accent/40 hover:bg-card transition-colors group"
            >
              <div className="text-xs font-semibold text-foreground group-hover:text-accent transition-colors">
                {ex.label}
              </div>
              <div className="text-[11px] text-muted mt-0.5 line-clamp-2">{ex.description}</div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
