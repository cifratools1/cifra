'use client';

import { useState, useEffect, useRef, useTransition, useCallback } from 'react';
import { md5 } from '@/lib/md5';

type HashAlgorithm = 'md5' | 'sha1' | 'sha256' | 'sha512';

interface HashResults {
  md5: string;
  sha1: string;
  sha256: string;
  sha512: string;
}

const ALGORITHMS: Array<{
  id: HashAlgorithm;
  name: string;
  bits: number;
  hexLength: number;
  statusBadge: string;
  statusColor: string;
  description: string;
}> = [
  {
    id: 'md5',
    name: 'MD5',
    bits: 128,
    hexLength: 32,
    statusBadge: 'Checksums / No seguro para claves',
    statusColor: 'bg-warning-light text-warning border-warning/30',
    description: 'Rápido y ampliamente usado para verificar integridad de descargas y deduplicación.',
  },
  {
    id: 'sha1',
    name: 'SHA-1',
    bits: 160,
    hexLength: 40,
    statusBadge: 'Legado / Usado en Git',
    statusColor: 'bg-warning-light text-warning border-warning/30',
    description: 'Estándar histórico de Git y firmas previas. Obsoleto para certificados SSL/TLS.',
  },
  {
    id: 'sha256',
    name: 'SHA-256',
    bits: 256,
    hexLength: 64,
    statusBadge: 'Estándar de la industria',
    statusColor: 'bg-success-light text-success border-success/30',
    description: 'Familia SHA-2. El estándar global para firmas digitales, HTTPS/TLS y Bitcoin.',
  },
  {
    id: 'sha512',
    name: 'SHA-512',
    bits: 512,
    hexLength: 128,
    statusBadge: 'Máxima seguridad',
    statusColor: 'bg-success-light text-success border-success/30',
    description: 'Máxima longitud de bloque y entropía. Muy eficiente en arquitecturas de 64 bits.',
  },
];

async function calculateHashes(bytes: Uint8Array): Promise<HashResults> {
  // MD5 calculado en TypeScript puro
  const md5Hex = md5(bytes);

  // SHA-1, SHA-256, SHA-512 mediante Web Crypto API SubtleCrypto nativa
  let sha1Hex = '';
  let sha256Hex = '';
  let sha512Hex = '';

  if (typeof window !== 'undefined' && window.crypto && window.crypto.subtle) {
    try {
      const [sha1Buf, sha256Buf, sha512Buf] = await Promise.all([
        window.crypto.subtle.digest('SHA-1', bytes as unknown as BufferSource),
        window.crypto.subtle.digest('SHA-256', bytes as unknown as BufferSource),
        window.crypto.subtle.digest('SHA-512', bytes as unknown as BufferSource),
      ]);

      const toHex = (buf: ArrayBuffer) =>
        Array.from(new Uint8Array(buf))
          .map(b => b.toString(16).padStart(2, '0'))
          .join('');

      sha1Hex = toHex(sha1Buf);
      sha256Hex = toHex(sha256Buf);
      sha512Hex = toHex(sha512Buf);
    } catch {
      // Manejo de error si subtle digest falla
    }
  }

  return {
    md5: md5Hex,
    sha1: sha1Hex,
    sha256: sha256Hex,
    sha512: sha512Hex,
  };
}

function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

export default function HashGenerator() {
  const [mode, setMode] = useState<'text' | 'file'>('text');
  const [inputText, setInputText] = useState('Hola Mundo');
  const [uppercase, setUppercase] = useState(false);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [, startTransition] = useTransition();
  const [isCalculating, setIsCalculating] = useState(false);

  // Archivo seleccionado
  const [fileInfo, setFileInfo] = useState<{
    name: string;
    size: number;
    type: string;
  } | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  // Resultados
  const [results, setResults] = useState<HashResults>({
    md5: '',
    sha1: '',
    sha256: '',
    sha512: '',
  });

  // Campo de verificación de checksum
  const [verifyChecksum, setVerifyChecksum] = useState('');

  // Cálculo para texto plano
  useEffect(() => {
    if (mode !== 'text') return;

    let isMounted = true;
    const encoder = new TextEncoder();
    const bytes = encoder.encode(inputText);

    calculateHashes(bytes).then(hashes => {
      if (isMounted) {
        startTransition(() => {
          setResults(hashes);
        });
      }
    });

    return () => {
      isMounted = false;
    };
  }, [inputText, mode]);

  // Manejo de selección de archivo
  const handleFileProcess = useCallback(async (file: File) => {
    setFileError(null);
    if (file.size > 200 * 1024 * 1024) {
      setFileError('Por favor selecciona un archivo inferior a 200 MB para calcular su hash de forma fluida en el navegador.');
      return;
    }

    setFileInfo({
      name: file.name,
      size: file.size,
      type: file.type || 'Archivo binario',
    });
    setIsCalculating(true);

    try {
      // Breve pausa para pintar estado de carga en UI
      await new Promise(resolve => setTimeout(resolve, 30));
      const arrayBuffer = await file.arrayBuffer();
      const bytes = new Uint8Array(arrayBuffer);
      const hashes = await calculateHashes(bytes);
      setResults(hashes);
    } catch {
      setFileError('No se pudo leer o procesar el archivo seleccionado.');
    } finally {
      setIsCalculating(false);
    }
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileProcess(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleFileProcess(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const clearFile = () => {
    setFileInfo(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
    setResults({ md5: '', sha1: '', sha256: '', sha512: '' });
  };

  const copyToClipboard = async (text: string, key: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedKey(key);
      setTimeout(() => setCopiedKey(null), 2000);
    } catch {
      const textarea = document.createElement('textarea');
      textarea.value = text;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setCopiedKey(key);
      setTimeout(() => setCopiedKey(null), 2000);
    }
  };

  // Comparador de checksum
  const normalizedVerify = verifyChecksum.trim().toLowerCase();
  const matchAlgorithm = normalizedVerify
    ? (['md5', 'sha1', 'sha256', 'sha512'] as HashAlgorithm[]).find(
        key => results[key]?.toLowerCase() === normalizedVerify
      )
    : null;

  return (
    <div className="space-y-6">
      {/* Pestañas de modo: Texto vs Archivo */}
      <div className="flex border-b border-card-border gap-2">
        <button
          onClick={() => {
            setMode('text');
            setVerifyChecksum('');
          }}
          className={`flex items-center gap-2 px-4 py-2.5 text-sm font-semibold border-b-2 transition-colors ${
            mode === 'text'
              ? 'border-accent text-accent'
              : 'border-transparent text-muted hover:text-foreground'
          }`}
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8">
            <path d="M2.5 3.5h11M2.5 8h11M2.5 12.5h7" />
          </svg>
          Texto plano
        </button>

        <button
          onClick={() => {
            setMode('file');
            setVerifyChecksum('');
            if (fileInfo === null) {
              setResults({ md5: '', sha1: '', sha256: '', sha512: '' });
            }
          }}
          className={`flex items-center gap-2 px-4 py-2.5 text-sm font-semibold border-b-2 transition-colors ${
            mode === 'file'
              ? 'border-accent text-accent'
              : 'border-transparent text-muted hover:text-foreground'
          }`}
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8">
            <path d="M3 2.5A1.5 1.5 0 014.5 1h5l4 4v8.5a1.5 1.5 0 01-1.5 1.5h-7.5A1.5 1.5 0 013 13.5v-11z" />
            <path d="M9.5 1v4h4" />
          </svg>
          Archivo local (Checksum)
        </button>
      </div>

      {/* Panel de entrada según modo */}
      {mode === 'text' ? (
        <div className="border border-card-border rounded-xl bg-card p-5 space-y-3">
          <div className="flex items-center justify-between">
            <label htmlFor="hash-input-text" className="text-sm font-semibold text-foreground">
              Texto de entrada
            </label>
            <div className="flex items-center gap-3 text-xs text-muted">
              <span>{inputText.length} caracteres</span>
              <span>•</span>
              <span>{new TextEncoder().encode(inputText).length} bytes (UTF-8)</span>
            </div>
          </div>

          <textarea
            id="hash-input-text"
            rows={4}
            value={inputText}
            onChange={e => setInputText(e.target.value)}
            placeholder="Escribe o pega aquí el texto para calcular sus hashes..."
            className="w-full p-3 font-mono text-sm bg-code-bg border border-input-border rounded-lg text-foreground focus:border-accent focus:outline-none transition-colors resize-y"
          />

          {/* Ejemplos prácticos y botón de limpieza */}
          <div className="flex flex-wrap items-center justify-between gap-2 pt-1 text-xs">
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="text-muted mr-1">Probar con:</span>
              <button
                type="button"
                onClick={() => setInputText('Hola Mundo')}
                className="px-2 py-1 rounded bg-code-bg hover:bg-card-border text-foreground transition-colors"
              >
                Hola Mundo
              </button>
              <button
                type="button"
                onClick={() =>
                  setInputText('El veloz murciélago hindú comía feliz cardillo y kiwi.')
                }
                className="px-2 py-1 rounded bg-code-bg hover:bg-card-border text-foreground transition-colors"
              >
                Pangrama español
              </button>
              <button
                type="button"
                onClick={() =>
                  setInputText('{"usuario": "alice", "rol": "admin", "activo": true}')
                }
                className="px-2 py-1 rounded bg-code-bg hover:bg-card-border text-foreground transition-colors"
              >
                JSON
              </button>
            </div>

            {inputText && (
              <button
                type="button"
                onClick={() => setInputText('')}
                className="text-muted hover:text-danger transition-colors font-medium"
              >
                Limpiar texto
              </button>
            )}
          </div>
        </div>
      ) : (
        /* Modo Archivo */
        <div className="border border-card-border rounded-xl bg-card p-5 space-y-4">
          {fileError && (
            <div className="p-3 rounded-lg bg-danger-light text-danger text-xs border border-danger/30 flex items-center justify-between">
              <span>{fileError}</span>
              <button
                type="button"
                onClick={() => setFileError(null)}
                className="text-danger hover:underline ml-2"
              >
                Cerrar
              </button>
            </div>
          )}

          <input
            ref={fileInputRef}
            type="file"
            onChange={handleFileChange}
            className="hidden"
            id="file-hash-upload"
          />

          {!fileInfo ? (
            <div
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors ${
                isDragging
                  ? 'border-accent bg-accent-light/10'
                  : 'border-card-border hover:border-accent bg-code-bg/30'
              }`}
            >
              <div className="flex flex-col items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-accent-light/30 flex items-center justify-center text-accent">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
                    <polyline points="17 8 12 3 7 8" />
                    <line x1="12" y1="3" x2="12" y2="15" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">
                    Haz clic para seleccionar un archivo o arrástralo aquí
                  </p>
                  <p className="text-xs text-muted mt-1">
                    Cálculo local en tu navegador. Tus archivos no se suben a ningún servidor.
                  </p>
                </div>
                <span className="inline-flex px-3 py-1.5 rounded-lg text-xs font-semibold bg-accent text-white hover:bg-accent-hover transition-colors">
                  Examinar archivos
                </span>
              </div>
            </div>
          ) : (
            <div className="p-4 rounded-xl bg-code-bg border border-card-border flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3 overflow-hidden">
                <div className="w-10 h-10 rounded-lg bg-card border border-card-border flex items-center justify-center text-accent shrink-0">
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8">
                    <path d="M4 2.5A1.5 1.5 0 015.5 1h5l4 4v12.5a1.5 1.5 0 01-1.5 1.5h-8A1.5 1.5 0 014 17.5v-15z" />
                  </svg>
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-bold text-foreground truncate">{fileInfo.name}</p>
                  <p className="text-xs text-muted">
                    {formatBytes(fileInfo.size)} • {fileInfo.type}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 self-end sm:self-center">
                {isCalculating && (
                  <span className="text-xs text-accent flex items-center gap-1.5 font-medium">
                    <span className="animate-spin inline-block w-3.5 h-3.5 border-2 border-accent border-t-transparent rounded-full" />
                    Calculando hashes...
                  </span>
                )}
                <button
                  type="button"
                  onClick={clearFile}
                  className="px-3 py-1.5 text-xs font-semibold rounded-lg border border-input-border bg-card text-muted hover:text-danger hover:border-danger transition-colors"
                >
                  Cambiar archivo
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Barra de opciones de visualización */}
      <div className="flex items-center justify-between px-1">
        <span className="text-xs font-semibold text-muted">
          Hashes calculados simultáneamente
        </span>
        <button
          type="button"
          onClick={() => setUppercase(!uppercase)}
          className="text-xs font-medium text-muted hover:text-foreground flex items-center gap-1.5 transition-colors"
        >
          Formato:
          <span className="font-semibold text-accent underline underline-offset-2">
            {uppercase ? 'MAYÚSCULAS' : 'minúsculas'}
          </span>
        </button>
      </div>

      {/* Grid de resultados de Hashes */}
      <div className="grid grid-cols-1 gap-4">
        {ALGORITHMS.map(algo => {
          let hashValue = results[algo.id] || '';
          if (uppercase) hashValue = hashValue.toUpperCase();

          const isCopied = copiedKey === algo.id;
          const isMatched = matchAlgorithm === algo.id;

          return (
            <div
              key={algo.id}
              className={`border rounded-xl bg-card p-4 transition-all ${
                isMatched
                  ? 'border-accent ring-2 ring-accent/30 shadow-md'
                  : 'border-card-border shadow-sm'
              }`}
            >
              <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold text-foreground">{algo.name}</h3>
                  <span className="text-xs font-mono text-muted bg-code-bg px-2 py-0.5 rounded border border-card-border">
                    {algo.bits} bits
                  </span>
                  <span
                    className={`text-[11px] font-medium px-2 py-0.5 rounded-full border ${algo.statusColor}`}
                  >
                    {algo.statusBadge}
                  </span>
                </div>

                <button
                  onClick={() => copyToClipboard(hashValue, algo.id)}
                  disabled={!hashValue}
                  className={`inline-flex items-center gap-1 px-3 py-1 text-xs font-semibold rounded-md border transition-colors ${
                    isCopied
                      ? 'bg-success text-white border-success'
                      : 'bg-card text-muted hover:text-foreground border-input-border hover:border-accent disabled:opacity-40'
                  }`}
                  aria-label={`Copiar hash ${algo.name}`}
                >
                  {isCopied ? (
                    <>
                      <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M2.5 6.5l2.5 2.5 4.5-5" />
                      </svg>
                      ¡Copiado!
                    </>
                  ) : (
                    <>
                      <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.6">
                        <rect x="3.5" y="3.5" width="7" height="7" rx="1.5" />
                        <path d="M8.5 3.5V2.5A1 1 0 007.5 1.5H2.5A1 1 0 001.5 2.5v5a1 1 0 001 1h1" />
                      </svg>
                      Copiar
                    </>
                  )}
                </button>
              </div>

              {/* Valor del hash */}
              <div className="p-2.5 bg-code-bg rounded-lg border border-input-border font-mono text-xs sm:text-sm text-foreground break-all select-all tracking-wide">
                {isCalculating ? (
                  <span className="text-muted italic flex items-center gap-2">
                    <span className="inline-block w-3 h-3 border-2 border-accent border-t-transparent rounded-full animate-spin" />
                    Calculando...
                  </span>
                ) : hashValue ? (
                  hashValue
                ) : (
                  <span className="text-muted italic">Sin datos disponibles</span>
                )}
              </div>

              <div className="mt-2 flex items-center justify-between text-xs text-muted">
                <span>{algo.description}</span>
                <span className="font-mono shrink-0 ml-2">{algo.hexLength} caracteres hex</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Herramienta integrada: Verificador / Comparador de Checksum */}
      <div className="border border-card-border rounded-xl bg-card p-5 space-y-3">
        <div className="flex items-center justify-between">
          <label htmlFor="verify-checksum-input" className="text-sm font-bold text-foreground flex items-center gap-2">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M8 1v14M1 8h14" />
            </svg>
            Verificar o Comparar Hash (Checksum)
          </label>
          <span className="text-xs text-muted">Opcional</span>
        </div>

        <p className="text-xs text-muted leading-relaxed">
          Pega un hash esperado (por ejemplo, el facilitado por el creador del archivo o descarga)
          para comprobar de forma automática si coincide con alguno de los hashes generados arriba.
        </p>

        <input
          id="verify-checksum-input"
          type="text"
          value={verifyChecksum}
          onChange={e => setVerifyChecksum(e.target.value)}
          placeholder="Ej: e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855..."
          className="w-full p-2.5 font-mono text-xs sm:text-sm bg-code-bg border border-input-border rounded-lg text-foreground focus:border-accent focus:outline-none"
        />

        {/* Feedback visual del comparador */}
        {normalizedVerify && (
          <div className="pt-1">
            {matchAlgorithm ? (
              <div className="p-3 bg-success-light border border-success/40 rounded-lg flex items-center gap-2 text-xs font-semibold text-success">
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M3.5 9.5l3.5 3.5 7.5-8" />
                </svg>
                <span>
                  ¡Coincidencia exacta encontrada con{' '}
                  <strong className="underline uppercase">{matchAlgorithm}</strong>! El archivo o texto es íntegro y auténtico.
                </span>
              </div>
            ) : (
              <div className="p-3 bg-danger-light border border-danger/40 rounded-lg flex items-center gap-2 text-xs font-semibold text-danger">
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <circle cx="9" cy="9" r="7.5" />
                  <path d="M6 6l6 6M12 6l-6 6" />
                </svg>
                <span>
                  No coincide con ninguno de los hashes generados. Revisa si el archivo está dañado o fue modificado.
                </span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
