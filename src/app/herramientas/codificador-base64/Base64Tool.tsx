'use client';

import { useState, useEffect, useRef, useId } from 'react';
import { CopyButton } from '@/components/ToolComponents';
import { encodeBase64Utf8 as encodeText, decodeBase64Utf8 as decodeText } from '@/lib/encoding';

type Mode = 'encode' | 'decode';

interface ExampleItem {
  label: string;
  value: string;
  description: string;
}

const ENCODE_EXAMPLES: ExampleItem[] = [
  {
    label: 'Texto UTF-8 con emojis',
    value: '¡Hola desde Cifra! Herramientas 100% en tu navegador 🚀✨',
    description: 'Comprueba el soporte completo de acentos, eñes y emojis.',
  },
  {
    label: 'Objeto JSON',
    value: '{\n  "servicio": "Cifra",\n  "version": "1.0",\n  "seguro": true\n}',
    description: 'Estructura JSON comúnmente transmitida en Base64.',
  },
  {
    label: 'Credenciales HTTP Basic',
    value: 'usuario_admin:ClaveSuperSecreta2026!',
    description: 'Formato estándar usuario:contraseña para cabeceras Authorization.',
  },
];

const DECODE_EXAMPLES: ExampleItem[] = [
  {
    label: 'Texto UTF-8 decodificable',
    value: 'wqFIb2xhIGRlc2RlIENpZnJhISBIZXJyYW1pZW50YXMgMTAwJSBlbiB0dSBuYXZlZ2Fkb3Ig8J+agOKckyA=',
    description: 'Cadena Base64 estándar generada con codificación UTF-8.',
  },
  {
    label: 'Base64 URL-safe (sin padding)',
    value: 'eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6Ikp1YW4gUMOpcmV6IiwiaWF0IjoxNTE2MjM5MDIyfQ',
    description: 'Payload típico de un token JWT en formato URL-safe (- y _).',
  },
  {
    label: 'Basic Auth codificado',
    value: 'YWRtaW46Y29udHJhc2XDsWExMjM=',
    description: 'admin:contraseña123 codificado en Base64.',
  },
];

export default function Base64Tool() {
  const [mode, setMode] = useState<Mode>('encode');
  const [input, setInput] = useState<string>('');
  const [output, setOutput] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  // Options
  const [urlSafe, setUrlSafe] = useState<boolean>(false);
  const [lineBreakAfter, setLineBreakAfter] = useState<number>(0); // 0 = none, 64, 76
  const [dataUriPrefix, setDataUriPrefix] = useState<string>('');
  const [fileName, setFileName] = useState<string>('');

  const fileInputRef = useRef<HTMLInputElement>(null);
  const inputId = useId();
  const outputId = useId();

  // Recalculate output on state change
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!input.trim()) {
        setOutput('');
        setError(null);
        return;
      }

      try {
        if (mode === 'encode') {
          const result = encodeText(input, urlSafe, lineBreakAfter);
          setOutput(result);
          setError(null);
        } else {
          const result = decodeText(input);
          setOutput(result);
          setError(null);
        }
      } catch (err: unknown) {
        setOutput('');
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError('Ocurrió un error inesperado al procesar la solicitud.');
        }
      }
    }, 0);

    return () => clearTimeout(timer);
  }, [input, mode, urlSafe, lineBreakAfter]);

  // Handle file upload
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.size > 25 * 1024 * 1024) {
      setError('El archivo supera los 25 MB. Para garantizar fluidez en el navegador, selecciona un archivo de hasta 25 MB.');
      return;
    }

    setFileName(file.name);

    if (mode === 'encode') {
      // For encoding, read as Data URL to support any file (binary or text)
      const reader = new FileReader();
      reader.onload = (e) => {
        const dataUrl = e.target?.result as string;
        if (!dataUrl) return;

        const parts = dataUrl.split(',');
        const mimeMatch = parts[0]?.match(/:(.*?);/);
        const mime = mimeMatch ? mimeMatch[1] : file.type || 'application/octet-stream';
        const base64Data = parts[1] || '';

        setDataUriPrefix(`data:${mime};base64,`);

        // If it's a text file, we can also put its text into input
        if (file.type.startsWith('text/') || file.name.endsWith('.txt') || file.name.endsWith('.json')) {
          const textReader = new FileReader();
          textReader.onload = (te) => {
            const textContent = te.target?.result as string;
            setInput(textContent || '');
          };
          textReader.readAsText(file);
        } else {
          // Binary file: put placeholder or notice in input, and directly base64 in output
          setInput(`[Archivo binario cargado: ${file.name} (${(file.size / 1024).toFixed(1)} KB)]`);
          setOutput(base64Data);
        }
      };
      reader.readAsDataURL(file);
    } else {
      // For decoding, read file as text
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        setInput(content || '');
      };
      reader.readAsText(file);
    }
  };

  // Swap input and output
  const handleSwap = () => {
    if (!output && !input) return;
    const newMode: Mode = mode === 'encode' ? 'decode' : 'encode';
    setMode(newMode);
    setInput(output);
    setOutput('');
    setError(null);
  };

  // Download output
  const handleDownload = () => {
    if (!output) return;
    const blob = new Blob([output], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = mode === 'encode' ? 'archivo_codificado.b64.txt' : 'archivo_decodificado.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Compute metrics
  const inputByteLength = new TextEncoder().encode(input).length;
  const outputByteLength = new TextEncoder().encode(output).length;
  const sizeDiffPercent =
    inputByteLength > 0 && outputByteLength > 0
      ? (((outputByteLength - inputByteLength) / inputByteLength) * 100).toFixed(1)
      : null;

  return (
    <div className="space-y-6">
      {/* Mode selector & quick actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-card-border pb-4">
        {/* Toggle tabs */}
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
            Codificar (Texto → Base64)
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
            Decodificar (Base64 → Texto)
          </button>
        </div>

        {/* Options & Upload */}
        <div className="flex flex-wrap items-center gap-2">
          <input
            ref={fileInputRef}
            type="file"
            onChange={handleFileUpload}
            className="hidden"
            aria-label="Subir archivo para procesar"
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md border border-card-border bg-card text-foreground hover:bg-card-border/30 transition-colors"
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M7 9V2m0 0l-2.5 2.5M7 2l2.5 2.5M2 10v1.5A1.5 1.5 0 003.5 13h7a1.5 1.5 0 001.5-1.5V10" />
            </svg>
            Cargar archivo
          </button>

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
              setFileName('');
              setDataUriPrefix('');
            }}
            disabled={!input && !output}
            className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium rounded-md border border-card-border bg-card text-muted hover:text-danger hover:border-danger/40 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            Limpiar
          </button>
        </div>
      </div>

      {/* Mode-specific configurations */}
      {mode === 'encode' && (
        <div className="flex flex-wrap items-center gap-4 text-xs text-muted bg-card border border-card-border rounded-lg p-3">
          <span className="font-semibold text-foreground">Opciones de codificación:</span>
          <label className="inline-flex items-center gap-1.5 cursor-pointer">
            <input
              type="checkbox"
              checked={urlSafe}
              onChange={(e) => setUrlSafe(e.target.checked)}
              className="rounded border-card-border text-accent focus:ring-accent"
            />
            <span>URL-safe (reemplaza + por - y / por _)</span>
          </label>

          <div className="inline-flex items-center gap-2">
            <span>Salto de línea:</span>
            <select
              value={lineBreakAfter}
              onChange={(e) => setLineBreakAfter(Number(e.target.value))}
              className="text-xs bg-background border border-card-border rounded px-2 py-1 text-foreground"
            >
              <option value={0}>Sin saltos de línea</option>
              <option value={64}>Cada 64 caracteres (MIME)</option>
              <option value={76}>Cada 76 caracteres (PEM/RFC 2045)</option>
            </select>
          </div>
        </div>
      )}

      {fileName && (
        <div className="flex items-center justify-between text-xs bg-accent-light text-foreground border border-accent/20 rounded-lg px-3 py-2">
          <span className="flex items-center gap-1.5">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2" className="text-accent">
              <path d="M3 2h5l3 3v7a1 1 0 01-1 1H3a1 1 0 01-1-1V3a1 1 0 011-1z" />
            </svg>
            Archivo activo: <strong>{fileName}</strong>
          </span>
          <button
            type="button"
            onClick={() => setFileName('')}
            className="text-muted hover:text-foreground text-xs"
          >
            Quitar
          </button>
        </div>
      )}

      {/* Two panel layout: Input left/top, Output right/bottom */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input panel */}
        <div className="flex flex-col space-y-2">
          <div className="flex items-center justify-between">
            <label htmlFor={inputId} className="text-sm font-semibold text-foreground">
              {mode === 'encode' ? 'Texto o contenido a codificar:' : 'Cadena Base64 a decodificar:'}
            </label>
            <span className="text-xs text-muted">
              {input.length} caracteres ({inputByteLength} B)
            </span>
          </div>

          <div className="relative flex-1">
            <textarea
              id={inputId}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={
                mode === 'encode'
                  ? 'Escribe o pega aquí el texto que deseas convertir a Base64...'
                  : 'Pega aquí la cadena Base64 (ej: SG9sYSBNdW5kbyE=)...'
              }
              rows={12}
              className="w-full h-80 p-3 font-mono text-xs sm:text-sm bg-card border border-card-border rounded-lg text-foreground placeholder:text-muted/60 focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent resize-y transition-colors"
              spellCheck={false}
            />
          </div>
        </div>

        {/* Output panel */}
        <div className="flex flex-col space-y-2">
          <div className="flex items-center justify-between">
            <label htmlFor={outputId} className="text-sm font-semibold text-foreground">
              {mode === 'encode' ? 'Resultado en Base64:' : 'Texto decodificado (UTF-8):'}
            </label>
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted">
                {output.length} caracteres ({outputByteLength} B)
              </span>
              {sizeDiffPercent && (
                <span
                  className={`text-xs px-1.5 py-0.5 rounded font-mono ${
                    Number(sizeDiffPercent) > 0
                      ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400'
                      : 'bg-emerald-500/10 text-accent'
                  }`}
                  title="Diferencia de tamaño respecto a la entrada"
                >
                  {Number(sizeDiffPercent) > 0 ? `+${sizeDiffPercent}%` : `${sizeDiffPercent}%`}
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
                  ? 'El resultado codificado en Base64 aparecerá aquí en tiempo real...'
                  : 'El texto decodificado aparecerá aquí en tiempo real...'
              }
              rows={12}
              className="w-full h-80 p-3 font-mono text-xs sm:text-sm bg-code-bg border border-card-border rounded-lg text-foreground placeholder:text-muted/60 focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent resize-y transition-colors"
              spellCheck={false}
            />

            {/* Floating actions over output */}
            {output && (
              <div className="absolute top-2 right-2 flex items-center gap-1.5 bg-card/90 backdrop-blur-sm p-1 rounded-md border border-card-border shadow-sm">
                <CopyButton text={output} label="Copiar" />
                {dataUriPrefix && (
                  <CopyButton text={dataUriPrefix + output} label="Data URI" />
                )}
                <button
                  type="button"
                  onClick={handleDownload}
                  className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium rounded-md border border-card-border bg-card text-muted hover:text-foreground transition-colors"
                  title="Descargar resultado como archivo"
                >
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M7 2v7m0 0l2.5-2.5M7 9L4.5 6.5M2 11h10" />
                  </svg>
                  Descargar
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Error message */}
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
            <p className="font-semibold">Error al procesar:</p>
            <p className="text-xs leading-relaxed">{error}</p>
          </div>
        </div>
      )}

      {/* Examples section */}
      <div className="border border-card-border rounded-lg bg-card p-4">
        <h3 className="text-xs font-semibold text-muted mb-2">
          Ejemplos prácticos para probar:
        </h3>
        <div className="grid gap-2 sm:grid-cols-3">
          {(mode === 'encode' ? ENCODE_EXAMPLES : DECODE_EXAMPLES).map((ex, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => {
                setInput(ex.value);
                setError(null);
              }}
              className="text-left p-2.5 rounded-md border border-card-border bg-background hover:border-accent/40 hover:bg-card transition-colors group"
            >
              <div className="text-xs font-semibold text-foreground group-hover:text-accent transition-colors">
                {ex.label}
              </div>
              <div className="text-[11px] text-muted mt-0.5 line-clamp-1">{ex.description}</div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
