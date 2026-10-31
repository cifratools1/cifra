'use client';

import React, { useState, useMemo, useCallback } from 'react';
import Link from 'next/link';
import {
  EyeIcon,
  EyeOffIcon,
  CopyIcon,
  CheckIcon,
  CrossIcon,
  ShieldCheckIcon,
  LockIcon,
  ZapIcon,
} from '@/components/Icons';

interface StrengthResult {
  score: number; // 0 to 5
  label: string;
  percent: number;
  textColor: string;
  barColor: string;
  bgLight: string;
  crackTime: string;
  entropy: number;
  rawEntropy: number;
  poolSize: number;
  combinationsStr: string;
  description: string;
  checks: {
    length12: boolean;
    length16: boolean;
    hasLower: boolean;
    hasUpper: boolean;
    hasNumber: boolean;
    hasSymbol: boolean;
    noSequences: boolean;
    noRepetitions: boolean;
  };
  warnings: string[];
}

// Lista de secuencias comunes y patrones de teclado
const COMMON_SEQUENCES = [
  '01234567890',
  'abcdefghijklmnopqrstuvwxyz',
  'qwertyuiop',
  'asdfghjkl',
  'zxcvbnm',
  '1234567890',
  'qazwsxedcrfv',
];

const COMMON_PASSWORDS = new Set([
  'password',
  '123456',
  '12345678',
  '123456789',
  '12345',
  '1234',
  'qwerty',
  'admin',
  'welcome',
  'iloveyou',
  'contraseña',
  'contrasena',
  'secret',
  'superman',
  'dragon',
  'master',
  'football',
  'monkey',
  'shadow',
  'computer',
  'access',
  'solo',
  'starwars',
  'princesa',
  'barcelona',
  'realmadrid',
]);

function formatCombinations(comb: number): string {
  if (comb === 0) return '0';
  if (!isFinite(comb) || comb > 1e100) return '> 10^100';
  if (comb < 1e6) return comb.toLocaleString('es-ES');
  const exp = Math.floor(Math.log10(comb));
  const base = (comb / Math.pow(10, exp)).toFixed(2);
  return `${base} × 10^${exp}`;
}

function calculateCrackTime(entropy: number): string {
  if (entropy <= 0) return '—';
  if (entropy < 28) return 'Instantáneo (< 1 milisegundo)';

  // 10^11 intentos por segundo en clúster de GPU para hashing offline (SHA-256 / MD5 / NTLM)
  // Promedio de intentos requeridos: 2^(entropy - 1)
  const log10Seconds = (entropy - 1) * Math.LOG10E - 11;

  if (log10Seconds < -1) return 'Menos de 1 segundo';

  const seconds = Math.pow(10, log10Seconds);

  if (seconds < 60) {
    const s = Math.max(1, Math.round(seconds));
    return `~${s} segundo${s > 1 ? 's' : ''}`;
  }

  const minutes = seconds / 60;
  if (minutes < 60) {
    const m = Math.round(minutes);
    return `~${m} minuto${m > 1 ? 's' : ''}`;
  }

  const hours = minutes / 60;
  if (hours < 24) {
    const h = Math.round(hours);
    return `~${h} hora${h > 1 ? 's' : ''}`;
  }

  const days = hours / 24;
  if (days < 30) {
    const d = Math.round(days);
    return `~${d} día${d > 1 ? 's' : ''}`;
  }

  const months = days / 30.4375;
  if (months < 12) {
    const mo = Math.round(months);
    return `~${mo} mes${mo > 1 ? 'es' : ''}`;
  }

  const years = days / 365.25;
  if (years < 1000) {
    const y = Math.round(years);
    return `~${y.toLocaleString('es-ES')} año${y > 1 ? 's' : ''}`;
  }

  const millennia = years / 1000;
  if (millennia < 1000) {
    const mil = Math.round(millennia);
    return `~${mil.toLocaleString('es-ES')} milenios`;
  }

  const millions = years / 1e6;
  if (millions < 1000) {
    return `~${millions.toFixed(1)} millones de años`;
  }

  const billions = years / 1e9;
  if (billions < 100) {
    return `~${billions.toFixed(1)} mil millones de años`;
  }

  return 'Más de 100.000 millones de años (superior a la edad del universo)';
}

function evaluatePassword(pwd: string): StrengthResult {
  const len = pwd.length;

  if (len === 0) {
    return {
      score: 0,
      label: 'Sin contraseña',
      percent: 0,
      textColor: 'text-muted',
      barColor: 'bg-card-border',
      bgLight: 'bg-card-subtle',
      crackTime: '—',
      entropy: 0,
      rawEntropy: 0,
      poolSize: 0,
      combinationsStr: '0',
      description: 'Escribe o pega una clave para auditar su espacio muestral y resistencia criptográfica.',
      checks: {
        length12: false,
        length16: false,
        hasLower: false,
        hasUpper: false,
        hasNumber: false,
        hasSymbol: false,
        noSequences: true,
        noRepetitions: true,
      },
      warnings: [],
    };
  }

  // 1. Detección de clases de caracteres y pool
  const hasLower = /[a-z]/.test(pwd);
  const hasUpper = /[A-Z]/.test(pwd);
  const hasNumber = /[0-9]/.test(pwd);
  const hasSymbol = /[^a-zA-Z0-9\s]/.test(pwd) || /[\s]/.test(pwd);
  const hasExtended = /[^\x00-\x7F]/.test(pwd);

  let poolSize = 0;
  if (hasLower) poolSize += 26;
  if (hasUpper) poolSize += 26;
  if (hasNumber) poolSize += 10;
  if (hasSymbol) poolSize += 33;
  if (hasExtended) poolSize += 30;

  // 2. Entropía matemática pura: E = L * log2(Pool)
  const rawEntropy = poolSize > 0 ? len * Math.log2(poolSize) : 0;
  let penalty = 0;
  const warnings: string[] = [];

  // Detección de contraseñas de diccionario muy comunes
  const lowerPwd = pwd.toLowerCase();
  if (COMMON_PASSWORDS.has(lowerPwd)) {
    penalty += 60;
    warnings.push('Coincide exactamente con una de las contraseñas más filtradas en internet.');
  }

  // Detección de repeticiones consecutivas (ej: "aaa", "1111")
  const hasConsecutiveRepetitions = /(.)\1{2,}/.test(pwd);
  if (hasConsecutiveRepetitions) {
    penalty += 12;
    warnings.push('Contiene caracteres idénticos repetidos consecutivamente.');
  }

  // Detección de caracteres únicos vs longitud total
  const uniqueChars = new Set(pwd).size;
  if (len > 4 && uniqueChars <= len / 2) {
    penalty += 14;
    warnings.push('Poca variedad de caracteres distintos respecto a su longitud.');
  }

  // Detección de secuencias alfabéticas o numéricas comunes
  let hasSequence = false;
  for (const seq of COMMON_SEQUENCES) {
    for (let i = 0; i < seq.length - 2; i++) {
      const sub = seq.slice(i, i + 3);
      const revSub = sub.split('').reverse().join('');
      if (lowerPwd.includes(sub) || lowerPwd.includes(revSub)) {
        hasSequence = true;
        break;
      }
    }
    if (hasSequence) break;
  }

  if (hasSequence) {
    penalty += 14;
    warnings.push('Contiene secuencias obvias de teclado o numéricas (ej. 123, abc, qwerty).');
  }

  // Penalización si solo usa una única clase de caracteres
  const classesCount = [hasLower, hasUpper, hasNumber, hasSymbol].filter(Boolean).length;
  if (classesCount === 1 && len > 5) {
    penalty += 10;
    warnings.push('Utiliza únicamente un tipo de carácter (ej. solo números o solo minúsculas).');
  }

  // Entropía efectiva ajustada
  const entropy = Math.max(0, Math.round((rawEntropy - penalty) * 10) / 10);
  const crackTime = calculateCrackTime(entropy);

  // Combinaciones aproximadas
  const approxCombinations = poolSize > 0 ? Math.pow(poolSize, Math.min(len, 40)) : 0;
  const combinationsStr = formatCombinations(approxCombinations);

  // Clasificación de fortaleza según NIST y estándares de ciberseguridad
  let score = 1;
  let label = 'Muy débil';
  let percent = 20;
  let textColor = 'text-danger';
  let barColor = 'bg-danger';
  let bgLight = 'bg-danger-light';
  let description = 'Extremadamente vulnerable. Puede ser descifrada en milisegundos mediante ataques automatizados.';

  if (entropy < 28 || len < 6) {
    score = 1;
    label = 'Muy débil';
    percent = Math.max(12, Math.min(25, (entropy / 28) * 25));
    textColor = 'text-danger';
    barColor = 'bg-danger';
    bgLight = 'bg-danger-light';
    description = 'Peligro crítico. Un atacante con herramientas estándar tardará menos de un segundo en quebrarla.';
  } else if (entropy < 45 || len < 10) {
    score = 2;
    label = 'Débil';
    percent = 25 + ((entropy - 28) / 17) * 25;
    textColor = 'text-danger';
    barColor = 'bg-danger';
    bgLight = 'bg-danger-light';
    description = 'Seguridad insuficiente. Vulnerable a ataques de fuerza bruta rápidos y tablas precomputadas.';
  } else if (entropy < 65 || len < 12) {
    score = 3;
    label = 'Aceptable';
    percent = 50 + ((entropy - 45) / 20) * 20;
    textColor = 'text-warning';
    barColor = 'bg-warning';
    bgLight = 'bg-warning-light';
    description = 'Nivel moderado. Suficiente para servicios sin datos críticos, pero mejorable para cuentas principales.';
  } else if (entropy < 85) {
    score = 4;
    label = 'Fuerte';
    percent = 70 + ((entropy - 65) / 20) * 20;
    textColor = 'text-accent';
    barColor = 'bg-accent';
    bgLight = 'bg-accent-light';
    description = 'Excelente robustez. Muy resistente a fuerza bruta masiva offline y ataques de diccionario con reglas.';
  } else {
    score = 5;
    label = 'Muy segura';
    percent = 100;
    textColor = 'text-success';
    barColor = 'bg-success';
    bgLight = 'bg-success-light';
    description = 'Grado criptográfico óptimo. Invulnerable ante supercomputadoras y clústeres modernos de GPU.';
  }

  return {
    score,
    label,
    percent: Math.round(percent),
    textColor,
    barColor,
    bgLight,
    crackTime,
    entropy,
    rawEntropy: Math.round(rawEntropy * 10) / 10,
    poolSize,
    combinationsStr,
    description,
    checks: {
      length12: len >= 12,
      length16: len >= 16,
      hasLower,
      hasUpper,
      hasNumber,
      hasSymbol,
      noSequences: !hasSequence,
      noRepetitions: !hasConsecutiveRepetitions,
    },
    warnings,
  };
}

const PRESET_EXAMPLES = [
  { name: '123456', tip: 'Típica vulnerable' },
  { name: 'verano2024!', tip: 'Patrón de diccionario' },
  { name: 'Tr0ub4dor&3', tip: 'Compleja pero predecible' },
  { name: 'Xk9#vL2$mQ8@wZ', tip: 'Alta entropía (14 chars)' },
  { name: 'correct-horse-battery-staple-99', tip: 'Frase de paso (Diceware)' },
];

export default function PasswordCheckerClient() {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [copied, setCopied] = useState(false);

  const result = useMemo(() => evaluatePassword(password), [password]);

  const handleCopy = useCallback(async () => {
    if (!password) return;
    try {
      await navigator.clipboard.writeText(password);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback seguro
      const textarea = document.createElement('textarea');
      textarea.value = password;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }, [password]);

  const handleClear = useCallback(() => {
    setPassword('');
  }, []);

  return (
    <div className="space-y-6">
      {/* 1. Input principal grande e interactivo */}
      <div className="p-6 bg-card border border-card-border rounded-xl shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <label htmlFor="password-checker-input" className="text-sm font-semibold text-foreground flex items-center gap-2">
            <LockIcon size={16} className="text-accent" />
            <span>Introduce la contraseña a evaluar</span>
          </label>
          <div className="flex items-center gap-3 text-xs text-muted">
            <span className="font-mono">
              Longitud: <strong className="text-foreground">{password.length}</strong> caracteres
            </span>
            {password.length > 0 && (
              <button
                type="button"
                onClick={handleClear}
                className="text-muted hover:text-danger transition-colors underline flex items-center gap-1"
              >
                <CrossIcon size={12} />
                <span>Borrar</span>
              </button>
            )}
          </div>
        </div>

        {/* Campo de contraseña con botones de acción embebidos */}
        <div className="relative flex items-center">
          <input
            id="password-checker-input"
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Escribe o pega una contraseña..."
            autoComplete="off"
            spellCheck="false"
            className="w-full pl-4 pr-24 py-3.5 bg-input-bg border border-input-border rounded-lg text-base font-mono text-foreground placeholder:text-muted focus:border-accent focus:outline-none transition-colors"
          />

          <div className="absolute right-2 flex items-center gap-1">
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="p-2 rounded-md text-muted hover:text-foreground hover:bg-card-hover transition-colors"
              title={showPassword ? 'Ocultar contraseña' : 'Ver contraseña'}
              aria-label={showPassword ? 'Ocultar contraseña' : 'Ver contraseña'}
            >
              {showPassword ? <EyeOffIcon size={18} /> : <EyeIcon size={18} />}
            </button>
            <button
              type="button"
              onClick={handleCopy}
              disabled={!password}
              className={`p-2 rounded-md transition-colors ${
                !password
                  ? 'text-muted-light cursor-not-allowed opacity-40'
                  : copied
                    ? 'text-success bg-success-light'
                    : 'text-muted hover:text-foreground hover:bg-card-hover'
              }`}
              title="Copiar contraseña"
              aria-label="Copiar contraseña"
            >
              {copied ? <CheckIcon size={18} /> : <CopyIcon size={18} />}
            </button>
          </div>
        </div>

        {/* Barra de progreso de fortaleza */}
        <div className="space-y-2 pt-1">
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted">Nivel de seguridad:</span>
            <span className={`font-semibold ${result.textColor}`}>
              {result.label}
              {password.length > 0 && ` (${result.percent}%)`}
            </span>
          </div>

          <div
            className="w-full h-2.5 bg-card-subtle border border-card-border rounded-full overflow-hidden p-0.5"
            role="progressbar"
            aria-valuenow={result.percent}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label="Barra de nivel de seguridad de contraseña"
          >
            <div
              className={`h-full rounded-full transition-all duration-300 ${result.barColor}`}
              style={{ width: `${password.length === 0 ? 0 : Math.max(5, result.percent)}%` }}
            />
          </div>

          <p className="text-xs text-muted leading-relaxed">
            {result.description}
          </p>
        </div>

        {/* Ejemplos predefinidos rápidos */}
        <div className="pt-2 border-t border-card-border">
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="text-muted text-[11px] font-mono">Probar ejemplos:</span>
            {PRESET_EXAMPLES.map((ex) => (
              <button
                key={ex.name}
                type="button"
                onClick={() => setPassword(ex.name)}
                className="px-2 py-1 rounded bg-card-subtle border border-card-border hover:border-accent hover:text-accent font-mono text-[11px] transition-colors"
                title={ex.tip}
              >
                {ex.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 2. Resultados principales: Tiempo de Fuerza Bruta y Métricas Criptográficas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Tarjeta Destacada: Tiempo de Descifrado */}
        <div className="md:col-span-2 p-5 bg-card border border-card-border rounded-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-muted flex items-center gap-1.5">
                <ZapIcon size={14} className="text-accent" />
                Resistencia a ataque de fuerza bruta
              </span>
              <span className="text-xs font-mono px-2 py-0.5 rounded bg-card-subtle border border-card-border text-muted">
                10¹¹ hashes/segundo
              </span>
            </div>

            <div className="my-3">
              <div className="text-xs text-muted mb-1">Tiempo estimado para quebrar con GPU moderna:</div>
              <div className={`text-xl sm:text-2xl font-bold tracking-tight font-sans ${result.textColor}`}>
                {result.crackTime}
              </div>
            </div>

            <p className="text-xs text-muted leading-relaxed">
              Estimación basada en un ataque offline exhaustivo mediante clústeres de GPUs modernas realizando 100.000 millones de pruebas por segundo contra algoritmos rápidos (MD5/SHA-256).
            </p>
          </div>

          {result.warnings.length > 0 && (
            <div className="mt-4 pt-3 border-t border-card-border space-y-1.5">
              <span className="text-xs font-semibold text-danger block">
                Vulnerabilidades detectadas:
              </span>
              <ul className="text-xs text-danger space-y-1">
                {result.warnings.map((w, idx) => (
                  <li key={idx} className="flex items-start gap-1.5">
                    <span className="text-danger shrink-0 font-bold">•</span>
                    <span>{w}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Tarjeta Métricas: Entropía y Espacio muestral */}
        <div className="p-5 bg-card border border-card-border rounded-xl flex flex-col justify-between">
          <div>
            <span className="text-xs font-semibold text-muted block mb-3">
              Métricas criptográficas
            </span>

            <div className="space-y-3 font-mono text-xs">
              <div className="flex items-center justify-between pb-2 border-b border-card-border">
                <span className="text-muted">Entropía efectiva:</span>
                <span className={`font-bold ${result.textColor}`}>
                  {result.entropy} bits
                </span>
              </div>

              <div className="flex items-center justify-between pb-2 border-b border-card-border">
                <span className="text-muted">Repertorio (Pool N):</span>
                <span className="text-foreground font-semibold">
                  {result.poolSize} caracteres
                </span>
              </div>

              <div className="flex items-center justify-between pb-2 border-b border-card-border">
                <span className="text-muted">Combinaciones:</span>
                <span className="text-foreground font-semibold truncate max-w-[140px]" title={result.combinationsStr}>
                  {result.combinationsStr}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-muted">Longitud (L):</span>
                <span className="text-foreground font-semibold">
                  {password.length} caracteres
                </span>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-card-border text-[11px] text-muted">
            Fórmula NIST:{' '}
            <code className="text-accent bg-code-bg px-1 py-0.5 rounded font-mono">
              E = L × log₂(N)
            </code>
          </div>
        </div>
      </div>

      {/* 3. Lista de Verificación de Requisitos y Buenas Prácticas */}
      <div className="p-5 bg-card border border-card-border rounded-xl space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-foreground flex items-center gap-2">
            <ShieldCheckIcon size={16} className="text-accent" />
            <span>Auditoría de Requisitos y Complejidad</span>
          </h2>
          <span className="text-xs text-muted font-mono">
            {[
              result.checks.length12,
              result.checks.hasLower,
              result.checks.hasUpper,
              result.checks.hasNumber,
              result.checks.hasSymbol,
              result.checks.noSequences,
            ].filter(Boolean).length}{' '}
            de 6 superados
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {/* Requisito 1: Longitud 12+ */}
          <div
            className={`p-3 rounded-lg border flex items-center gap-2.5 transition-colors ${
              result.checks.length12
                ? 'bg-card-subtle border-card-border text-foreground'
                : 'bg-card border-card-border text-muted'
            }`}
          >
            <div
              className={`w-5 h-5 rounded flex items-center justify-center shrink-0 text-xs font-bold ${
                result.checks.length12
                  ? 'bg-success text-white'
                  : 'bg-card-subtle border border-card-border text-muted-light'
              }`}
            >
              {result.checks.length12 ? '✓' : '—'}
            </div>
            <div className="min-w-0 text-xs">
              <span className="font-medium block">Longitud mínima (12+ car.)</span>
              <span className="text-[10px] text-muted-light">
                {result.checks.length16 ? 'Excelente (16+ recomendado)' : result.checks.length12 ? 'Cumplido (12+)' : 'Recomendado ≥ 12'}
              </span>
            </div>
          </div>

          {/* Requisito 2: Minúsculas */}
          <div
            className={`p-3 rounded-lg border flex items-center gap-2.5 transition-colors ${
              result.checks.hasLower
                ? 'bg-card-subtle border-card-border text-foreground'
                : 'bg-card border-card-border text-muted'
            }`}
          >
            <div
              className={`w-5 h-5 rounded flex items-center justify-center shrink-0 text-xs font-bold ${
                result.checks.hasLower
                  ? 'bg-success text-white'
                  : 'bg-card-subtle border border-card-border text-muted-light'
              }`}
            >
              {result.checks.hasLower ? '✓' : '—'}
            </div>
            <div className="min-w-0 text-xs">
              <span className="font-medium block">Letras minúsculas</span>
              <span className="text-[10px] text-muted-light">Conjunto a-z (+26 pool)</span>
            </div>
          </div>

          {/* Requisito 3: Mayúsculas */}
          <div
            className={`p-3 rounded-lg border flex items-center gap-2.5 transition-colors ${
              result.checks.hasUpper
                ? 'bg-card-subtle border-card-border text-foreground'
                : 'bg-card border-card-border text-muted'
            }`}
          >
            <div
              className={`w-5 h-5 rounded flex items-center justify-center shrink-0 text-xs font-bold ${
                result.checks.hasUpper
                  ? 'bg-success text-white'
                  : 'bg-card-subtle border border-card-border text-muted-light'
              }`}
            >
              {result.checks.hasUpper ? '✓' : '—'}
            </div>
            <div className="min-w-0 text-xs">
              <span className="font-medium block">Letras mayúsculas</span>
              <span className="text-[10px] text-muted-light">Conjunto A-Z (+26 pool)</span>
            </div>
          </div>

          {/* Requisito 4: Números */}
          <div
            className={`p-3 rounded-lg border flex items-center gap-2.5 transition-colors ${
              result.checks.hasNumber
                ? 'bg-card-subtle border-card-border text-foreground'
                : 'bg-card border-card-border text-muted'
            }`}
          >
            <div
              className={`w-5 h-5 rounded flex items-center justify-center shrink-0 text-xs font-bold ${
                result.checks.hasNumber
                  ? 'bg-success text-white'
                  : 'bg-card-subtle border border-card-border text-muted-light'
              }`}
            >
              {result.checks.hasNumber ? '✓' : '—'}
            </div>
            <div className="min-w-0 text-xs">
              <span className="font-medium block">Dígitos numéricos</span>
              <span className="text-[10px] text-muted-light">Conjunto 0-9 (+10 pool)</span>
            </div>
          </div>

          {/* Requisito 5: Símbolos */}
          <div
            className={`p-3 rounded-lg border flex items-center gap-2.5 transition-colors ${
              result.checks.hasSymbol
                ? 'bg-card-subtle border-card-border text-foreground'
                : 'bg-card border-card-border text-muted'
            }`}
          >
            <div
              className={`w-5 h-5 rounded flex items-center justify-center shrink-0 text-xs font-bold ${
                result.checks.hasSymbol
                  ? 'bg-success text-white'
                  : 'bg-card-subtle border border-card-border text-muted-light'
              }`}
            >
              {result.checks.hasSymbol ? '✓' : '—'}
            </div>
            <div className="min-w-0 text-xs">
              <span className="font-medium block">Símbolos especiales</span>
              <span className="text-[10px] text-muted-light">!@#$%^&*... (+33 pool)</span>
            </div>
          </div>

          {/* Requisito 6: Sin secuencias obvias */}
          <div
            className={`p-3 rounded-lg border flex items-center gap-2.5 transition-colors ${
              result.checks.noSequences && result.checks.noRepetitions && password.length > 0
                ? 'bg-card-subtle border-card-border text-foreground'
                : 'bg-card border-card-border text-muted'
            }`}
          >
            <div
              className={`w-5 h-5 rounded flex items-center justify-center shrink-0 text-xs font-bold ${
                result.checks.noSequences && result.checks.noRepetitions && password.length > 0
                  ? 'bg-success text-white'
                  : 'bg-card-subtle border border-card-border text-muted-light'
              }`}
            >
              {result.checks.noSequences && result.checks.noRepetitions && password.length > 0 ? '✓' : '—'}
            </div>
            <div className="min-w-0 text-xs">
              <span className="font-medium block">Sin secuencias ni patrones</span>
              <span className="text-[10px] text-muted-light">Evita 1234, qwerty, aaa</span>
            </div>
          </div>
        </div>
      </div>

      {/* 4. Declaración de privacidad en caja destacada */}
      <div className="p-4 rounded-xl bg-card border border-card-border flex items-start gap-3">
        <div className="p-2 rounded-lg bg-card-subtle text-accent border border-card-border shrink-0 mt-0.5">
          <ShieldCheckIcon size={18} />
        </div>
        <div className="text-xs text-muted leading-relaxed">
          <p className="font-semibold text-foreground mb-0.5">
            Garantía de Privacidad 100% Client-Side
          </p>
          <p>
            El análisis matemático y la auditoría de tu clave se ejecutan de forma <strong>estricta en la memoria RAM de tu navegador web</strong>. Tu contraseña <strong>nunca se transmite por internet, no se guarda en ningún servidor ni deja rastro en cookies</strong>. Puedes desconectar tu conexión a internet y la herramienta seguirá funcionando con total precisión.
          </p>
        </div>
      </div>

      {/* Enlace directo al generador */}
      <div className="pt-2 flex items-center justify-between text-xs text-muted border-t border-card-border">
        <span>¿Necesitas una contraseña nueva e inquebrantable?</span>
        <Link
          href="/herramientas/generador-contrasenas"
          className="text-accent hover:underline font-medium inline-flex items-center gap-1"
        >
          <span>Abrir Generador Criptográfico CSPRNG</span>
          <span>→</span>
        </Link>
      </div>
    </div>
  );
}
