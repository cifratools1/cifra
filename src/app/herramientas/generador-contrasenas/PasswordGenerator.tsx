'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { getToolPreference, setToolPreference } from '@/lib/useFavorites';

// Conjuntos de caracteres
const CHAR_SETS = {
  lower: 'abcdefghijklmnopqrstuvwxyz',
  lowerNoAmbiguous: 'abcdefghijkmnpqrstuvwxyz', // sin 'l', 'o'
  upper: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
  upperNoAmbiguous: 'ABCDEFGHJKLMNPQRSTUVWXYZ', // sin 'I', 'O'
  numbers: '0123456789',
  numbersNoAmbiguous: '23456789', // sin '0', '1'
  symbols: '!@#$%^&*()_+-=[]{}|;:,.<>?~',
  symbolsNoAmbiguous: '!@#$%^&*()_+-=[]{};:,.<>?~', // sin '|'
};

interface Options {
  length: number;
  useUpper: boolean;
  useLower: boolean;
  useNumbers: boolean;
  useSymbols: boolean;
  avoidAmbiguous: boolean;
  count: number;
}

function getSecureRandomInt(max: number): number {
  if (max <= 1) return 0;
  const array = new Uint32Array(1);
  const maxUint = 0x100000000;
  const limit = maxUint - (maxUint % max);
  let rand: number;
  do {
    window.crypto.getRandomValues(array);
    rand = array[0];
  } while (rand >= limit);
  return rand % max;
}

function secureShuffle<T>(arr: T[]): T[] {
  const result = [...arr];
  for (let i = result.length - 1; i > 0; i--) {
    const j = getSecureRandomInt(i + 1);
    const temp = result[i];
    result[i] = result[j];
    result[j] = temp;
  }
  return result;
}

function generateSinglePassword(options: Options): string {
  const lower = options.avoidAmbiguous ? CHAR_SETS.lowerNoAmbiguous : CHAR_SETS.lower;
  const upper = options.avoidAmbiguous ? CHAR_SETS.upperNoAmbiguous : CHAR_SETS.upper;
  const numbers = options.avoidAmbiguous ? CHAR_SETS.numbersNoAmbiguous : CHAR_SETS.numbers;
  const symbols = options.avoidAmbiguous ? CHAR_SETS.symbolsNoAmbiguous : CHAR_SETS.symbols;

  const activeSets: string[] = [];
  if (options.useLower) activeSets.push(lower);
  if (options.useUpper) activeSets.push(upper);
  if (options.useNumbers) activeSets.push(numbers);
  if (options.useSymbols) activeSets.push(symbols);

  if (activeSets.length === 0) return '';

  const requiredChars: string[] = [];
  let combinedPool = '';

  for (const set of activeSets) {
    const idx = getSecureRandomInt(set.length);
    requiredChars.push(set[idx]);
    combinedPool += set;
  }

  const remainingLength = Math.max(0, options.length - requiredChars.length);
  const passwordChars = [...requiredChars];

  for (let i = 0; i < remainingLength; i++) {
    const idx = getSecureRandomInt(combinedPool.length);
    passwordChars.push(combinedPool[idx]);
  }

  return secureShuffle(passwordChars).join('');
}

function estimateCrackTime(entropyBits: number): string {
  if (entropyBits < 30) return 'Menos de 1 segundo';
  // log2(10^11) ≈ 36.54 (suponiendo 100 mil millones de hashes/segundo en cluster de GPU)
  const log2Seconds = entropyBits - 1 - 36.54;
  if (log2Seconds <= 0) return 'Menos de 1 segundo';

  const seconds = Math.pow(2, log2Seconds);
  if (seconds < 60) return `${Math.max(1, Math.round(seconds))} segundos`;
  const minutes = seconds / 60;
  if (minutes < 60) return `${Math.round(minutes)} minutos`;
  const hours = minutes / 60;
  if (hours < 24) return `${Math.round(hours)} horas`;
  const days = hours / 24;
  if (days < 365) return `${Math.round(days)} días`;
  const years = days / 365.25;
  if (years < 1000) return `${Math.round(years).toLocaleString('es-ES')} años`;
  if (years < 1_000_000) return `${Math.round(years / 1000).toLocaleString('es-ES')} milenios`;
  return 'Millones de siglos';
}

function getEntropyInfo(options: Options) {
  let poolSize = 0;
  if (options.useLower) poolSize += options.avoidAmbiguous ? 24 : 26;
  if (options.useUpper) poolSize += options.avoidAmbiguous ? 24 : 26;
  if (options.useNumbers) poolSize += options.avoidAmbiguous ? 8 : 10;
  if (options.useSymbols) poolSize += options.avoidAmbiguous ? 26 : 27;

  if (poolSize === 0) {
    return {
      bits: 0,
      poolSize: 0,
      label: 'Inválida',
      textColor: 'text-red-500',
      bgColor: 'bg-red-500',
      percent: 0,
      crackTime: 'Instantáneo',
      description: 'Selecciona al menos una categoría de caracteres.',
    };
  }

  const bits = Math.round(options.length * Math.log2(poolSize) * 10) / 10;
  const crackTime = estimateCrackTime(bits);

  if (bits < 40) {
    return {
      bits,
      poolSize,
      label: 'Muy débil',
      textColor: 'text-red-500',
      bgColor: 'bg-red-500',
      percent: Math.min(25, Math.max(10, Math.round((bits / 40) * 25))),
      crackTime,
      description: 'Fácilmente descifrable en segundos por fuerza bruta o ataque de diccionario.',
    };
  }
  if (bits < 60) {
    return {
      bits,
      poolSize,
      label: 'Débil',
      textColor: 'text-warning',
      bgColor: 'bg-warning',
      percent: Math.round(25 + ((bits - 40) / 20) * 25),
      crackTime,
      description: 'Vulnerable a ataques automatizados con GPUs modernas. Aumenta la longitud.',
    };
  }
  if (bits < 80) {
    return {
      bits,
      poolSize,
      label: 'Aceptable',
      textColor: 'text-warning',
      bgColor: 'bg-warning',
      percent: Math.round(50 + ((bits - 60) / 20) * 25),
      crackTime,
      description: 'Nivel estándar para registros no críticos o foros públicos.',
    };
  }
  if (bits < 100) {
    return {
      bits,
      poolSize,
      label: 'Fuerte',
      textColor: 'text-success',
      bgColor: 'bg-success',
      percent: Math.round(75 + ((bits - 80) / 20) * 20),
      crackTime,
      description: 'Excelente seguridad. Recomendada para correos personales y banca online.',
    };
  }
  return {
    bits,
    poolSize,
    label: 'Muy fuerte',
    textColor: 'text-success',
    bgColor: 'bg-success',
    percent: 100,
    crackTime,
    description: 'Seguridad de grado criptográfico militar. Invulnerable a fuerza bruta.',
  };
}

const DEFAULT_OPTIONS: Options = {
  length: 16,
  useUpper: true,
  useLower: true,
  useNumbers: true,
  useSymbols: true,
  avoidAmbiguous: false,
  count: 1,
};

export default function PasswordGenerator() {
  const [options, setOptions] = useState<Options>(DEFAULT_OPTIONS);

  const [passwords, setPasswords] = useState<string[]>([]);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [copiedAll, setCopiedAll] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);
  const hasInitialized = useRef(false);

  // Cargar preferencias guardadas en cliente tras el montaje (evita fallos de hidratación)
  useEffect(() => {
    const timer = setTimeout(() => {
      const savedLength = getToolPreference<number>('generador-contrasenas', 'length', 16);
      const savedUpper = getToolPreference<boolean>('generador-contrasenas', 'useUpper', true);
      const savedLower = getToolPreference<boolean>('generador-contrasenas', 'useLower', true);
      const savedNumbers = getToolPreference<boolean>('generador-contrasenas', 'useNumbers', true);
      const savedSymbols = getToolPreference<boolean>('generador-contrasenas', 'useSymbols', true);
      const savedAvoid = getToolPreference<boolean>('generador-contrasenas', 'avoidAmbiguous', false);

      setOptions((prev) => ({
        ...prev,
        length: savedLength,
        useUpper: savedUpper,
        useLower: savedLower,
        useNumbers: savedNumbers,
        useSymbols: savedSymbols,
        avoidAmbiguous: savedAvoid,
      }));
      hasInitialized.current = true;
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  const generatePasswords = useCallback((opts: Options) => {
    const hasAtLeastOne = opts.useUpper || opts.useLower || opts.useNumbers || opts.useSymbols;
    if (!hasAtLeastOne) {
      setValidationError('Debes activar al menos un tipo de carácter.');
      setPasswords([]);
      return;
    }
    setValidationError(null);

    const newPasswords: string[] = [];
    for (let i = 0; i < opts.count; i++) {
      newPasswords.push(generateSinglePassword(opts));
    }
    setPasswords(newPasswords);
  }, []);

  // Regenerar y persistir preferencias no sensibles
  useEffect(() => {
    const timer = setTimeout(() => {
      generatePasswords(options);
    }, 0);

    if (hasInitialized.current) {
      setToolPreference('generador-contrasenas', 'length', options.length);
      setToolPreference('generador-contrasenas', 'useUpper', options.useUpper);
      setToolPreference('generador-contrasenas', 'useLower', options.useLower);
      setToolPreference('generador-contrasenas', 'useNumbers', options.useNumbers);
      setToolPreference('generador-contrasenas', 'useSymbols', options.useSymbols);
      setToolPreference('generador-contrasenas', 'avoidAmbiguous', options.avoidAmbiguous);
    }

    return () => clearTimeout(timer);
  }, [options, generatePasswords]);

  const handleCopySingle = async (text: string, index: number) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 2000);
    } catch {
      // Fallback
      const textarea = document.createElement('textarea');
      textarea.value = text;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 2000);
    }
  };

  const handleCopyAll = async () => {
    if (passwords.length === 0) return;
    const allText = passwords.join('\n');
    try {
      await navigator.clipboard.writeText(allText);
      setCopiedAll(true);
      setTimeout(() => setCopiedAll(false), 2000);
    } catch {
      const textarea = document.createElement('textarea');
      textarea.value = allText;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setCopiedAll(true);
      setTimeout(() => setCopiedAll(false), 2000);
    }
  };

  const toggleOption = (key: keyof Options) => {
    const newOptions = { ...options, [key]: !options[key] };
    const hasAtLeastOne =
      newOptions.useUpper ||
      newOptions.useLower ||
      newOptions.useNumbers ||
      newOptions.useSymbols;

    if (!hasAtLeastOne) {
      setValidationError('Se requiere al menos un tipo de carácter.');
      return;
    }
    setValidationError(null);
    setOptions(newOptions);
  };

  const setLength = (len: number) => {
    const clamped = Math.min(128, Math.max(8, len));
    setOptions(prev => ({ ...prev, length: clamped }));
  };

  const setCount = (c: number) => {
    const clamped = Math.min(10, Math.max(1, c));
    setOptions(prev => ({ ...prev, count: clamped }));
  };

  const entropyInfo = getEntropyInfo(options);
  const primaryPassword = passwords[0] || '';

  return (
    <div className="space-y-6">
      {/* Contenedor principal de la contraseña generada */}
      <div className="border border-card-border rounded-xl bg-card p-5 shadow-sm">
        <div className="flex items-center justify-between gap-2 mb-2">
          <label className="text-xs font-semibold text-muted">
            Contraseña generada (Web Crypto API)
          </label>
          <span className="inline-flex items-center gap-1 text-xs text-accent font-medium bg-accent-light/30 px-2 py-0.5 rounded-full">
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M6 1v4m0 6v-2m5-3H9m-6 0H1" />
              <circle cx="6" cy="6" r="4.5" />
            </svg>
            CSPRNG Seguro
          </span>
        </div>

        {/* Campo visual principal de la contraseña */}
        <div className="relative flex flex-col sm:flex-row items-stretch sm:items-center gap-3 p-3 bg-code-bg rounded-lg border border-input-border">
          <div className="flex-1 font-mono text-lg sm:text-xl font-bold tracking-wider text-foreground break-all select-all px-2 py-1">
            {primaryPassword ? (
              <span>{primaryPassword}</span>
            ) : (
              <span className="text-muted font-normal text-sm">
                Selecciona al menos un conjunto de caracteres para generar
              </span>
            )}
          </div>

          <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
            {/* Botón copiar principal */}
            <button
              onClick={() => handleCopySingle(primaryPassword, 0)}
              disabled={!primaryPassword}
              className={`inline-flex items-center gap-1.5 px-4 py-2 text-sm font-semibold rounded-lg transition-colors shadow-sm ${
                copiedIndex === 0
                  ? 'bg-success text-white'
                  : 'bg-accent text-white hover:bg-accent-hover disabled:opacity-50'
              }`}
              aria-label="Copiar contraseña al portapapeles"
            >
              {copiedIndex === 0 ? (
                <>
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M3 8.5l3.5 3.5 6.5-7" />
                  </svg>
                  <span>¡Copiada!</span>
                </>
              ) : (
                <>
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="5" y="5" width="9" height="9" rx="1.5" />
                    <path d="M11 5V3a1.5 1.5 0 00-1.5-1.5H3A1.5 1.5 0 001.5 3v6.5A1.5 1.5 0 003 11h2" />
                  </svg>
                  <span>Copiar</span>
                </>
              )}
            </button>

            {/* Botón regenerar */}
            <button
              onClick={() => generatePasswords(options)}
              className="inline-flex items-center justify-center p-2 text-muted hover:text-foreground bg-card border border-input-border hover:border-accent rounded-lg transition-colors"
              title="Generar nueva contraseña"
              aria-label="Generar otra contraseña"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M1 4v5h5" />
                <path d="M3.51 15a9 9 0 102.13-9.36L1 9" />
              </svg>
            </button>
          </div>
        </div>

        {/* Indicador de fuerza y entropía */}
        <div className="mt-4 pt-4 border-t border-card-border space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium text-muted">Fortaleza:</span>
              <span className={`text-sm font-bold ${entropyInfo.textColor}`}>
                {entropyInfo.label}
              </span>
            </div>
            <div className="flex items-center gap-3 text-xs">
              <span className="font-mono text-muted bg-code-bg px-2 py-0.5 rounded border border-card-border">
                {entropyInfo.bits} bits de entropía
              </span>
              <span className="text-muted hidden sm:inline">
                Espacio: <span className="font-mono">{entropyInfo.poolSize}</span> car.
              </span>
            </div>
          </div>

          {/* Barra de progreso visual */}
          <div className="w-full bg-code-bg h-2.5 rounded-full overflow-hidden border border-card-border/50">
            <div
              className={`h-full transition-all duration-300 ${entropyInfo.bgColor}`}
              style={{ width: `${entropyInfo.percent}%` }}
              role="progressbar"
              aria-valuenow={entropyInfo.percent}
              aria-valuemin={0}
              aria-valuemax={100}
            />
          </div>

          {/* Diagnóstico y tiempo estimado de crackeo */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs pt-1">
            <p className="text-muted leading-relaxed">
              {entropyInfo.description}
            </p>
            <p className="sm:text-right text-muted">
              Tiempo estimado de fuerza bruta:{' '}
              <span className="font-semibold text-foreground">{entropyInfo.crackTime}</span>
            </p>
          </div>
        </div>
      </div>

      {/* Mensaje de validación si desmarcan todas las casillas */}
      {validationError && (
        <div className="p-3 bg-danger-light border border-danger/40 rounded-lg text-xs text-danger font-medium flex items-center gap-2">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="8" cy="8" r="7" />
            <path d="M8 4v5m0 2v1" />
          </svg>
          {validationError}
        </div>
      )}

      {/* Controles de personalización */}
      <div className="border border-card-border rounded-xl bg-card p-5 space-y-6">
        <h2 className="text-base font-semibold text-foreground">
          Configuración y opciones
        </h2>

        {/* Control de longitud */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label htmlFor="length-slider" className="text-sm font-semibold text-foreground">
              Longitud de la contraseña
            </label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                id="length-number"
                min="8"
                max="128"
                value={options.length}
                onChange={e => setLength(parseInt(e.target.value) || 8)}
                className="w-16 px-2 py-1 text-center font-mono text-sm font-bold bg-code-bg border border-input-border rounded-md text-foreground focus:border-accent focus:outline-none"
                aria-label="Número de caracteres de la contraseña"
              />
              <span className="text-xs text-muted">caracteres</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-xs font-mono text-muted">8</span>
            <input
              type="range"
              id="length-slider"
              min="8"
              max="128"
              value={options.length}
              onChange={e => setLength(parseInt(e.target.value))}
              className="flex-1 accent-accent cursor-pointer h-2 bg-code-bg rounded-lg"
              aria-label="Deslizador de longitud"
            />
            <span className="text-xs font-mono text-muted">128</span>
          </div>

          {/* Accesos rápidos a longitudes típicas */}
          <div className="flex flex-wrap gap-2 pt-1">
            <span className="text-xs text-muted self-center mr-1">Rápidos:</span>
            {[12, 16, 20, 32, 64].map(len => (
              <button
                key={len}
                onClick={() => setLength(len)}
                className={`px-2.5 py-1 text-xs font-mono rounded border transition-colors ${
                  options.length === len
                    ? 'bg-accent text-white border-accent'
                    : 'bg-card border-card-border text-muted hover:text-foreground hover:border-input-border'
                }`}
              >
                {len} car.
              </button>
            ))}
          </div>
        </div>

        {/* Conjuntos de caracteres (Casillas de verificación) */}
        <div className="space-y-3 pt-2 border-t border-card-border">
          <span className="text-xs font-semibold text-muted block">
            Tipos de caracteres incluidos
          </span>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Mayúsculas */}
            <label className="flex items-center gap-3 p-3 rounded-lg border border-card-border hover:border-input-border bg-card cursor-pointer transition-colors select-none">
              <input
                type="checkbox"
                checked={options.useUpper}
                onChange={() => toggleOption('useUpper')}
                className="w-4 h-4 accent-accent rounded cursor-pointer"
              />
              <div className="flex-1">
                <span className="text-sm font-medium text-foreground block">Mayúsculas</span>
                <span className="text-xs font-mono text-muted block">A, B, C, D...</span>
              </div>
            </label>

            {/* Minúsculas */}
            <label className="flex items-center gap-3 p-3 rounded-lg border border-card-border hover:border-input-border bg-card cursor-pointer transition-colors select-none">
              <input
                type="checkbox"
                checked={options.useLower}
                onChange={() => toggleOption('useLower')}
                className="w-4 h-4 accent-accent rounded cursor-pointer"
              />
              <div className="flex-1">
                <span className="text-sm font-medium text-foreground block">Minúsculas</span>
                <span className="text-xs font-mono text-muted block">a, b, c, d...</span>
              </div>
            </label>

            {/* Números */}
            <label className="flex items-center gap-3 p-3 rounded-lg border border-card-border hover:border-input-border bg-card cursor-pointer transition-colors select-none">
              <input
                type="checkbox"
                checked={options.useNumbers}
                onChange={() => toggleOption('useNumbers')}
                className="w-4 h-4 accent-accent rounded cursor-pointer"
              />
              <div className="flex-1">
                <span className="text-sm font-medium text-foreground block">Números</span>
                <span className="text-xs font-mono text-muted block">0, 1, 2, 3, 4, 5...</span>
              </div>
            </label>

            {/* Símbolos especiales */}
            <label className="flex items-center gap-3 p-3 rounded-lg border border-card-border hover:border-input-border bg-card cursor-pointer transition-colors select-none">
              <input
                type="checkbox"
                checked={options.useSymbols}
                onChange={() => toggleOption('useSymbols')}
                className="w-4 h-4 accent-accent rounded cursor-pointer"
              />
              <div className="flex-1">
                <span className="text-sm font-medium text-foreground block">Símbolos especiales</span>
                <span className="text-xs font-mono text-muted block">! @ # $ % & * _ - + ?</span>
              </div>
            </label>
          </div>
        </div>

        {/* Opciones avanzadas y cantidad múltiple */}
        <div className="space-y-4 pt-2 border-t border-card-border">
          {/* Excluir ambiguos */}
          <label className="flex items-start gap-3 p-3 rounded-lg border border-card-border hover:border-input-border bg-card cursor-pointer transition-colors select-none">
            <input
              type="checkbox"
              checked={options.avoidAmbiguous}
              onChange={() => toggleOption('avoidAmbiguous')}
              className="w-4 h-4 mt-0.5 accent-accent rounded cursor-pointer"
            />
            <div>
              <span className="text-sm font-medium text-foreground block">
                Excluir caracteres ambiguos
              </span>
              <span className="text-xs text-muted block mt-0.5">
                Omite caracteres fácilmente confundibles como <code className="font-mono bg-code-bg px-1 rounded">0, O, o, 1, l, I, |</code>. Recomendado si escribirás la contraseña manualmente.
              </span>
            </div>
          </label>

          {/* Generación múltiple */}
          <div className="p-4 rounded-lg border border-card-border bg-code-bg/40 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-sm font-semibold text-foreground block">
                  Generar lote múltiple
                </span>
                <span className="text-xs text-muted block">
                  Genera entre 1 y 10 contraseñas simultáneas con los mismos criterios
                </span>
              </div>
              <div className="flex items-center gap-2">
                <select
                  value={options.count}
                  onChange={e => setCount(parseInt(e.target.value))}
                  className="px-3 py-1.5 text-sm font-semibold bg-card border border-input-border rounded-lg text-foreground focus:border-accent focus:outline-none"
                  aria-label="Cantidad de contraseñas a generar"
                >
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(n => (
                    <option key={n} value={n}>
                      {n} {n === 1 ? 'contraseña' : 'contraseñas'}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Lista de contraseñas si count > 1 */}
      {passwords.length > 1 && (
        <div className="border border-card-border rounded-xl bg-card p-5 space-y-4 shadow-sm">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-foreground">
              Lote de {passwords.length} contraseñas generadas
            </h3>
            <button
              onClick={handleCopyAll}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md border transition-colors ${
                copiedAll
                  ? 'bg-success text-white border-success'
                  : 'bg-card text-foreground border-input-border hover:border-accent'
              }`}
            >
              {copiedAll ? '¡Todas copiadas!' : 'Copiar todas (con saltos)'}
            </button>
          </div>

          <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
            {passwords.map((pwd, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between gap-3 p-2.5 rounded-lg bg-code-bg border border-card-border hover:border-input-border transition-colors"
              >
                <div className="flex items-center gap-3 overflow-hidden">
                  <span className="text-xs font-mono text-muted w-5 shrink-0 text-right">
                    {idx + 1}.
                  </span>
                  <span className="font-mono text-sm font-semibold text-foreground truncate select-all">
                    {pwd}
                  </span>
                </div>
                <button
                  onClick={() => handleCopySingle(pwd, idx)}
                  className={`shrink-0 px-2.5 py-1 text-xs font-medium rounded transition-colors ${
                    copiedIndex === idx
                      ? 'bg-success text-white'
                      : 'bg-card text-muted hover:text-foreground border border-input-border'
                  }`}
                  aria-label={`Copiar contraseña número ${idx + 1}`}
                >
                  {copiedIndex === idx ? 'Copiado' : 'Copiar'}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
