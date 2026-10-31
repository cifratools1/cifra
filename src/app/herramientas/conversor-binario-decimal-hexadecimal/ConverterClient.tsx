'use client';

import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { CopyButton } from '@/components/ToolComponents';

type BaseType = 'bin' | 'oct' | 'dec' | 'hex';

interface BaseConfig {
  id: BaseType;
  name: string;
  base: number;
  prefix: string;
  charsDescription: string;
  validator: RegExp;
  placeholder: string;
  tag: string;
  helperText: string;
}

const BASES: Record<BaseType, BaseConfig> = {
  bin: {
    id: 'bin',
    name: 'Binario',
    base: 2,
    prefix: '0b',
    charsDescription: '0 y 1',
    validator: /^[01]+$/,
    placeholder: 'Ej: 101010',
    tag: 'Base 2',
    helperText: 'Solo admite los dígitos 0 y 1.',
  },
  oct: {
    id: 'oct',
    name: 'Octal',
    base: 8,
    prefix: '0o',
    charsDescription: '0 al 7',
    validator: /^[0-7]+$/,
    placeholder: 'Ej: 52',
    tag: 'Base 8',
    helperText: 'Solo admite los dígitos del 0 al 7.',
  },
  dec: {
    id: 'dec',
    name: 'Decimal',
    base: 10,
    prefix: '',
    charsDescription: '0 al 9',
    validator: /^[0-9]+$/,
    placeholder: 'Ej: 42',
    tag: 'Base 10',
    helperText: 'Solo admite los dígitos del 0 al 9.',
  },
  hex: {
    id: 'hex',
    name: 'Hexadecimal',
    base: 16,
    prefix: '0x',
    charsDescription: '0 - 9, A - F',
    validator: /^[0-9a-fA-F]+$/,
    placeholder: 'Ej: 2A',
    tag: 'Base 16',
    helperText: 'Admite dígitos 0-9 y letras A-F (mayúsculas o minúsculas).',
  },
};

// Common presets for quick testing
const PRESETS = [
  { label: '0', value: '0', base: 'dec' as BaseType },
  { label: '42', value: '42', base: 'dec' as BaseType },
  { label: '255 (1 Byte)', value: '255', base: 'dec' as BaseType },
  { label: '1024 (1 KiB)', value: '1024', base: 'dec' as BaseType },
  { label: '65535 (16-bit)', value: '65535', base: 'dec' as BaseType },
  { label: '16.7M (#FFFFFF)', value: '16777215', base: 'dec' as BaseType },
  { label: '32-bit Máx', value: '4294967295', base: 'dec' as BaseType },
];

// Helper to format numbers with spacing / separators
function formatGrouped(val: string, base: BaseType): string {
  if (!val) return '';
  switch (base) {
    case 'bin': {
      // Group by 4 bits from right to left
      const rev = val.split('').reverse().join('');
      const parts = rev.match(/.{1,4}/g) || [];
      return parts.join(' ').split('').reverse().join('');
    }
    case 'hex': {
      // Group by 2 chars (1 byte) from right to left
      const rev = val.split('').reverse().join('');
      const parts = rev.match(/.{1,2}/g) || [];
      return parts.join(' ').split('').reverse().join('');
    }
    case 'oct': {
      // Group by 3 digits from right to left
      const rev = val.split('').reverse().join('');
      const parts = rev.match(/.{1,3}/g) || [];
      return parts.join(' ').split('').reverse().join('');
    }
    case 'dec': {
      // Group by 3 digits
      const rev = val.split('').reverse().join('');
      const parts = rev.match(/.{1,3}/g) || [];
      return parts.join('.').split('').reverse().join('');
    }
  }
}

// ASCII descriptions for 0-255
function getAsciiInfo(code: number): { char: string; desc: string } {
  if (code === 0) return { char: 'NUL', desc: 'Carácter nulo' };
  if (code === 9) return { char: '\\t', desc: 'Tabulación horizontal' };
  if (code === 10) return { char: '\\n', desc: 'Salto de línea (LF)' };
  if (code === 13) return { char: '\\r', desc: 'Retorno de carro (CR)' };
  if (code === 27) return { char: 'ESC', desc: 'Escape' };
  if (code === 32) return { char: 'SP', desc: 'Espacio en blanco' };
  if (code > 32 && code < 127) return { char: String.fromCharCode(code), desc: 'Carácter imprimible' };
  if (code === 127) return { char: 'DEL', desc: 'Suprimir / Borrado' };
  if (code >= 128 && code <= 255) {
    return { char: String.fromCharCode(code), desc: 'ASCII extendido' };
  }
  return { char: 'CTRL', desc: 'Carácter de control' };
}

// Generate the 0-255 reference table items once
const REFERENCE_TABLE_DATA = Array.from({ length: 256 }, (_, i) => {
  const ascii = getAsciiInfo(i);
  return {
    dec: i,
    bin: i.toString(2).padStart(8, '0'),
    oct: i.toString(8).padStart(3, '0'),
    hex: i.toString(16).toUpperCase().padStart(2, '0'),
    asciiChar: ascii.char,
    asciiDesc: ascii.desc,
  };
});

const DEFAULT_CONVERTER_STATE: { base: BaseType; values: Record<BaseType, string> } = {
  base: 'dec',
  values: {
    bin: '101010',
    oct: '52',
    dec: '42',
    hex: '2A',
  },
};

export default function ConverterClient() {
  const [activeBase, setActiveBase] = useState<BaseType>(DEFAULT_CONVERTER_STATE.base);
  const [values, setValues] = useState<Record<BaseType, string>>(DEFAULT_CONVERTER_STATE.values);
  const [errorMessage, setErrorMessage] = useState<{ base: BaseType; message: string } | null>(null);
  const [useGrouping, setUseGrouping] = useState(false);
  const [usePrefix, setUsePrefix] = useState(false);

  // Cargar estado inicial de la URL en el cliente (garantiza coincidencia exacta SSR/hidratación)
  useEffect(() => {
    const timer = setTimeout(() => {
      try {
        const params = new URLSearchParams(window.location.search);
        const qVal = params.get('val');
        const qBase = params.get('base') as BaseType | null;
        if (!qVal || !qBase || !BASES[qBase]) return;

        let clean = qVal.replace(/\s+/g, '');
        if (qBase === 'bin' && clean.toLowerCase().startsWith('0b')) clean = clean.slice(2);
        else if (qBase === 'oct' && clean.toLowerCase().startsWith('0o')) clean = clean.slice(2);
        else if (qBase === 'hex' && clean.toLowerCase().startsWith('0x')) clean = clean.slice(2);

        if (!clean || !BASES[qBase].validator.test(clean)) return;

        let parsed: bigint;
        if (qBase === 'bin') parsed = BigInt('0b' + clean);
        else if (qBase === 'oct') parsed = BigInt('0o' + clean);
        else if (qBase === 'dec') parsed = BigInt(clean);
        else parsed = BigInt('0x' + clean);

        setActiveBase(qBase);
        setValues({
          bin: qBase === 'bin' ? clean : parsed.toString(2),
          oct: qBase === 'oct' ? clean : parsed.toString(8),
          dec: qBase === 'dec' ? clean : parsed.toString(10),
          hex: qBase === 'hex' ? clean.toUpperCase() : parsed.toString(16).toUpperCase(),
        });
      } catch {
        // Ignore
      }
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  // Step-by-step state
  const [divisionTargetBase, setDivisionTargetBase] = useState<2 | 8 | 16>(2);
  const [activeTab, setActiveTab] = useState<'polynomial' | 'division' | 'nibbles'>('polynomial');

  // Reference table search & filter
  const [tableSearch, setTableSearch] = useState('');
  const [tableCategory, setTableCategory] = useState<'all' | 'nibble' | 'powers' | 'ascii'>('all');

  // Parse current number as BigInt safely
  const currentBigInt = useMemo<bigint | null>(() => {
    const raw = values[activeBase].replace(/\s+/g, '');
    if (!raw) return null;
    try {
      switch (activeBase) {
        case 'bin':
          return BigInt('0b' + raw);
        case 'oct':
          return BigInt('0o' + raw);
        case 'dec':
          return BigInt(raw);
        case 'hex':
          return BigInt('0x' + raw);
      }
    } catch {
      return null;
    }
  }, [values, activeBase]);

  // Handle user typing in any of the 4 inputs
  const handleInputChange = useCallback((newText: string, base: BaseType) => {
    setActiveBase(base);

    // Remove user-inserted whitespace
    let clean = newText.replace(/\s+/g, '');

    // Allow user to paste or type standard programming prefixes gracefully
    if (base === 'bin' && clean.toLowerCase().startsWith('0b')) {
      clean = clean.slice(2);
    } else if (base === 'oct' && clean.toLowerCase().startsWith('0o')) {
      clean = clean.slice(2);
    } else if (base === 'hex' && clean.toLowerCase().startsWith('0x')) {
      clean = clean.slice(2);
    }

    // If field is cleared
    if (!clean) {
      setErrorMessage(null);
      setValues({
        bin: '',
        oct: '',
        dec: '',
        hex: '',
      });
      return;
    }

    // Validate characters
    if (!BASES[base].validator.test(clean)) {
      setErrorMessage({
        base,
        message: `Entrada inválida para base ${BASES[base].name.toLowerCase()}. ${BASES[base].helperText}`,
      });
      // Keep whatever text user typed in current field, but don't propagate to others
      setValues(prev => ({ ...prev, [base]: newText }));
      return;
    }

    // Parse with BigInt
    try {
      let parsed: bigint;
      if (base === 'bin') parsed = BigInt('0b' + clean);
      else if (base === 'oct') parsed = BigInt('0o' + clean);
      else if (base === 'dec') parsed = BigInt(clean);
      else parsed = BigInt('0x' + clean);

      setErrorMessage(null);
      setValues({
        bin: base === 'bin' ? clean : parsed.toString(2),
        oct: base === 'oct' ? clean : parsed.toString(8),
        dec: base === 'dec' ? clean : parsed.toString(10),
        hex: base === 'hex' ? clean.toUpperCase() : parsed.toString(16).toUpperCase(),
      });
    } catch {
      setErrorMessage({
        base,
        message: 'No se pudo interpretar el número ingresado.',
      });
      setValues(prev => ({ ...prev, [base]: newText }));
    }
  }, []);

  // Quick Preset Click
  const handleSelectPreset = useCallback((presetVal: string, presetBase: BaseType) => {
    handleInputChange(presetVal, presetBase);
  }, [handleInputChange]);

  // Clear all fields
  const handleClear = useCallback(() => {
    setErrorMessage(null);
    setValues({ bin: '', oct: '', dec: '', hex: '' });
  }, []);

  // Actualizar URL con valor actual
  useEffect(() => {
    try {
      if (typeof window !== 'undefined' && values[activeBase]) {
        const url = new URL(window.location.href);
        if (url.searchParams.get('val') !== values[activeBase] || url.searchParams.get('base') !== activeBase) {
          url.searchParams.set('val', values[activeBase]);
          url.searchParams.set('base', activeBase);
          window.history.replaceState({}, '', url.toString());
        }
      }
    } catch {
      // Ignore
    }
  }, [values, activeBase]);

  // Number Properties / Insights
  const numberInsights = useMemo(() => {
    if (currentBigInt === null) return null;
    const val = currentBigInt;
    const zero = BigInt(0);
    const one = BigInt(1);
    const two = BigInt(2);
    const maxAscii = BigInt(255);

    const bitLength = val === zero ? 1 : val.toString(2).length;
    const byteLength = Math.ceil(bitLength / 8);

    // Check powers of 2
    let powerOfTwo: number | null = null;
    let powerOfTwoMinusOne: number | null = null;
    if (val > zero) {
      if ((val & (val - one)) === zero) {
        powerOfTwo = val.toString(2).length - 1;
      } else if (((val + one) & val) === zero) {
        powerOfTwoMinusOne = (val + one).toString(2).length - 1;
      }
    }

    const isEven = val % two === zero;

    // ASCII check (0-255)
    let ascii: { char: string; desc: string } | null = null;
    if (val >= zero && val <= maxAscii) {
      ascii = getAsciiInfo(Number(val));
    }

    // Fixed bit widths with leading zeros (if it fits)
    const binStr = val.toString(2);
    const pad8 = bitLength <= 8 ? binStr.padStart(8, '0') : null;
    const pad16 = bitLength <= 16 ? binStr.padStart(16, '0') : null;
    const pad32 = bitLength <= 32 ? binStr.padStart(32, '0') : null;
    const pad64 = bitLength <= 64 ? binStr.padStart(64, '0') : null;

    return {
      bitLength,
      byteLength,
      powerOfTwo,
      powerOfTwoMinusOne,
      isEven,
      ascii,
      pad8,
      pad16,
      pad32,
      pad64,
    };
  }, [currentBigInt]);

  // Polynomial Expansion Steps (Base to Decimal)
  const polynomialSteps = useMemo(() => {
    if (currentBigInt === null) return null;
    const sourceBase = activeBase;
    const raw = values[sourceBase].replace(/\s+/g, '').toUpperCase();
    if (!raw) return null;

    const baseVal = BigInt(BASES[sourceBase].base);
    const terms: Array<{
      char: string;
      digitValue: bigint;
      power: number;
      termResult: bigint;
    }> = [];

    const len = raw.length;
    for (let i = 0; i < len; i++) {
      const char = raw[i];
      let digitVal: bigint;
      if (sourceBase === 'hex') {
        digitVal = BigInt(parseInt(char, 16));
      } else {
        digitVal = BigInt(char);
      }
      const power = len - 1 - i;
      const termResult = digitVal * (baseVal ** BigInt(power));
      terms.push({ char, digitValue: digitVal, power, termResult });
    }

    // Truncate display terms if number is massive (more than 12 digits)
    const isTruncated = terms.length > 12;
    const displayTerms = isTruncated
      ? [...terms.slice(0, 6), ...terms.slice(-3)]
      : terms;

    return {
      sourceBase,
      raw,
      baseNumber: BASES[sourceBase].base,
      baseName: BASES[sourceBase].name,
      terms,
      displayTerms,
      isTruncated,
      totalDec: currentBigInt.toString(10),
    };
  }, [currentBigInt, activeBase, values]);

  // Successive Division Steps (Decimal to Target Base)
  const divisionSteps = useMemo(() => {
    if (currentBigInt === null) return null;
    const targetBase = divisionTargetBase;
    const bigBase = BigInt(targetBase);
    let current = currentBigInt;
    const zero = BigInt(0);

    if (current === zero) {
      return {
        targetBase,
        steps: [
          {
            dividend: '0',
            quotient: '0',
            remainder: '0',
            hexSymbol: '0',
          },
        ],
        isTruncated: false,
        result: '0',
      };
    }

    const steps: Array<{
      dividend: string;
      quotient: string;
      remainder: string;
      hexSymbol?: string;
    }> = [];

    let count = 0;
    const maxSteps = 24; // Keep UI fast and readable

    while (current > zero && count < maxSteps) {
      const quotient = current / bigBase;
      const rem = current % bigBase;
      const hexSymbol = targetBase === 16 ? Number(rem).toString(16).toUpperCase() : undefined;

      steps.push({
        dividend: current.toString(),
        quotient: quotient.toString(),
        remainder: rem.toString(),
        hexSymbol,
      });

      current = quotient;
      count++;
    }

    let finalStr = '';
    if (targetBase === 2) finalStr = currentBigInt.toString(2);
    else if (targetBase === 8) finalStr = currentBigInt.toString(8);
    else finalStr = currentBigInt.toString(16).toUpperCase();

    return {
      targetBase,
      steps,
      isTruncated: current > zero,
      result: finalStr,
    };
  }, [currentBigInt, divisionTargetBase]);

  // Bit grouping breakdown (Binary -> Hex/Octal direct mapping)
  const bitGroupingData = useMemo(() => {
    if (currentBigInt === null) return null;
    const binStr = currentBigInt.toString(2);

    // Nibbles for Hex (groups of 4)
    const hexPadLength = Math.ceil(binStr.length / 4) * 4;
    const hexPaddedBin = binStr.padStart(hexPadLength, '0');
    const hexChunks: Array<{ bits: string; hexChar: string; decVal: number }> = [];
    for (let i = 0; i < hexPaddedBin.length; i += 4) {
      const chunk = hexPaddedBin.slice(i, i + 4);
      const dec = parseInt(chunk, 2);
      hexChunks.push({
        bits: chunk,
        hexChar: dec.toString(16).toUpperCase(),
        decVal: dec,
      });
    }

    // Octal groups of 3
    const octPadLength = Math.ceil(binStr.length / 3) * 3;
    const octPaddedBin = binStr.padStart(octPadLength, '0');
    const octChunks: Array<{ bits: string; octChar: string; decVal: number }> = [];
    for (let i = 0; i < octPaddedBin.length; i += 3) {
      const chunk = octPaddedBin.slice(i, i + 3);
      const dec = parseInt(chunk, 2);
      octChunks.push({
        bits: chunk,
        octChar: dec.toString(8),
        decVal: dec,
      });
    }

    return {
      rawBin: binStr,
      hexChunks,
      octChunks,
      hexResult: currentBigInt.toString(16).toUpperCase(),
      octResult: currentBigInt.toString(8),
    };
  }, [currentBigInt]);

  // Filtered Reference Table
  const filteredReferenceTable = useMemo(() => {
    let list = REFERENCE_TABLE_DATA;

    if (tableCategory === 'nibble') {
      list = list.slice(0, 16);
    } else if (tableCategory === 'powers') {
      list = list.filter(item => item.dec > 0 && (item.dec & (item.dec - 1)) === 0);
    } else if (tableCategory === 'ascii') {
      list = list.filter(item => item.dec >= 32 && item.dec <= 126);
    }

    if (!tableSearch.trim()) return list;

    const query = tableSearch.toLowerCase().trim();
    return list.filter(item => {
      return (
        item.dec.toString().includes(query) ||
        item.hex.toLowerCase().includes(query) ||
        item.bin.includes(query) ||
        item.oct.includes(query) ||
        item.asciiChar.toLowerCase().includes(query) ||
        item.asciiDesc.toLowerCase().includes(query)
      );
    });
  }, [tableSearch, tableCategory]);

  return (
    <div className="space-y-8">
      {/* Action / Presets Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-lg border border-card-border bg-card">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-semibold text-muted mr-1">
            Ejemplos:
          </span>
          {PRESETS.map(preset => (
            <button
              key={preset.label}
              type="button"
              onClick={() => handleSelectPreset(preset.value, preset.base)}
              className="px-2.5 py-1 text-xs font-medium rounded-md border border-card-border bg-background text-foreground hover:border-accent hover:text-accent transition-colors"
            >
              {preset.label}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto justify-end">
          <button
            type="button"
            onClick={() => setUseGrouping(prev => !prev)}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md border transition-colors ${
              useGrouping
                ? 'bg-accent-light text-accent border-accent/40 font-semibold'
                : 'border-card-border bg-background text-muted hover:text-foreground'
            }`}
            title="Agrupa bits de 4 en 4, bytes en pares y miles con puntos"
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M2 4h10M2 7h10M2 10h10" />
            </svg>
            Agrupar dígitos
          </button>

          <button
            type="button"
            onClick={() => setUsePrefix(prev => !prev)}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md border transition-colors ${
              usePrefix
                ? 'bg-accent-light text-accent border-accent/40 font-semibold'
                : 'border-card-border bg-background text-muted hover:text-foreground'
            }`}
            title="Añadir prefijos de código 0b, 0o, 0x"
          >
            <span className="font-mono text-[10px] font-bold">0x</span>
            Prefijos
          </button>

          <button
            type="button"
            onClick={handleClear}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md border border-card-border bg-background text-danger hover:bg-danger-light hover:border-danger/30 transition-colors"
            title="Borrar todos los campos"
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M2 3.5h10M5.5 3.5V2a.5.5 0 01.5-.5h2a.5.5 0 01.5.5v1.5M3.5 3.5l.5 8a1 1 0 001 1h4a1 1 0 001-1l.5-8" />
            </svg>
            Limpiar
          </button>
        </div>
      </div>

      {/* Global Error Banner if any */}
      {errorMessage && (
        <div
          role="alert"
          className="p-4 rounded-lg border border-danger/30 bg-danger-light text-danger text-sm flex items-start gap-3"
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 18 18"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="shrink-0 mt-0.5"
          >
            <circle cx="9" cy="9" r="7.5" />
            <path d="M9 5.5v4M9 12.5h.01" />
          </svg>
          <div className="flex-1">
            <p className="font-semibold">{errorMessage.message}</p>
            <p className="text-xs mt-1 text-danger/80">
              Corrige los caracteres del campo activo para actualizar el resto de bases numéricas.
            </p>
          </div>
        </div>
      )}

      {/* Main 2x2 Grid for the 4 Bases */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {(Object.keys(BASES) as BaseType[]).map(baseKey => {
          const cfg = BASES[baseKey];
          const isActive = activeBase === baseKey;
          const isErr = errorMessage?.base === baseKey;
          const rawVal = values[baseKey];

          // Determine display string according to options
          let displayVal = rawVal;
          if (rawVal && useGrouping) {
            displayVal = formatGrouped(rawVal, baseKey);
          }
          if (rawVal && usePrefix && cfg.prefix) {
            displayVal = `${cfg.prefix}${displayVal}`;
          }

          return (
            <div
              key={baseKey}
              className={`rounded-lg border bg-card p-4 transition-all duration-200 ${
                isErr
                  ? 'border-danger ring-1 ring-danger/40'
                  : isActive
                  ? 'border-accent ring-1 ring-accent/30 shadow-sm'
                  : 'border-card-border hover:border-input-border'
              }`}
            >
              {/* Card Header */}
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <label
                    htmlFor={`input-${baseKey}`}
                    className="text-base font-bold text-foreground cursor-pointer flex items-center gap-2"
                  >
                    {cfg.name}
                    <span className="text-xs font-normal px-2 py-0.5 rounded-full bg-background border border-card-border text-muted">
                      {cfg.tag}
                    </span>
                  </label>
                  {isActive && (
                    <span className="text-[11px] font-semibold text-accent bg-accent-light px-2 py-0.5 rounded-full animate-fade-in">
                      Editando
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-1.5">
                  <CopyButton text={displayVal || rawVal} label="Copiar" />
                </div>
              </div>

              {/* Sub-label info */}
              <p className="text-xs text-muted mb-2">
                Dígitos válidos: <span className="font-mono text-foreground">{cfg.charsDescription}</span>
              </p>

              {/* Input Area */}
              <div className="relative">
                <input
                  id={`input-${baseKey}`}
                  type="text"
                  value={rawVal}
                  onChange={e => handleInputChange(e.target.value, baseKey)}
                  onFocus={() => setActiveBase(baseKey)}
                  placeholder={cfg.placeholder}
                  spellCheck={false}
                  autoComplete="off"
                  className={`w-full font-mono text-lg font-medium px-3.5 py-2.5 rounded-lg border bg-background text-foreground transition-colors placeholder:text-muted/50 focus:outline-none ${
                    isErr
                      ? 'border-danger focus:border-danger ring-1 ring-danger/30'
                      : isActive
                      ? 'border-accent focus:border-accent ring-1 ring-accent/40'
                      : 'border-card-border focus:border-accent'
                  }`}
                />
                {rawVal && (
                  <button
                    type="button"
                    onClick={() => handleInputChange('', baseKey)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-foreground p-1"
                    title="Limpiar campo"
                    aria-label={`Limpiar ${cfg.name}`}
                  >
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M3 3l8 8M11 3l-8 8" />
                    </svg>
                  </button>
                )}
              </div>

              {/* Formatted Preview below input if grouping or prefix is active */}
              {(useGrouping || usePrefix) && rawVal && (
                <div className="mt-2.5 pt-2 border-t border-card-border/60 flex items-center justify-between text-xs">
                  <span className="text-muted">Vista con formato:</span>
                  <span className="font-mono text-accent font-semibold tracking-wide break-all text-right">
                    {displayVal}
                  </span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Number Properties / Metrics Box */}
      {numberInsights && currentBigInt !== null && (
        <div className="rounded-lg border border-card-border bg-card p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-bold text-foreground flex items-center gap-2">
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-accent">
                <circle cx="9" cy="9" r="7.5" />
                <path d="M9 5.5v.01M9 8v4.5" />
              </svg>
              Propiedades del número
            </h2>
            <span className="text-xs text-muted font-mono">
              Decimal: {currentBigInt.toString(10)}
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
            <div className="p-3 rounded-md bg-background border border-card-border">
              <span className="text-xs text-muted block mb-1">Longitud de bits</span>
              <span className="font-mono font-bold text-foreground text-base">
                {numberInsights.bitLength} {numberInsights.bitLength === 1 ? 'bit' : 'bits'}
              </span>
            </div>

            <div className="p-3 rounded-md bg-background border border-card-border">
              <span className="text-xs text-muted block mb-1">Bytes requeridos</span>
              <span className="font-mono font-bold text-foreground text-base">
                {numberInsights.byteLength} {numberInsights.byteLength === 1 ? 'byte' : 'bytes'}
              </span>
            </div>

            <div className="p-3 rounded-md bg-background border border-card-border">
              <span className="text-xs text-muted block mb-1">Paridad</span>
              <span className="font-mono font-bold text-foreground text-base">
                {numberInsights.isEven ? 'Número par' : 'Número impar'}
              </span>
            </div>

            <div className="p-3 rounded-md bg-background border border-card-border">
              <span className="text-xs text-muted block mb-1">Potencia de 2</span>
              <span className="font-mono font-bold text-accent text-base">
                {numberInsights.powerOfTwo !== null
                  ? `2^${numberInsights.powerOfTwo}`
                  : numberInsights.powerOfTwoMinusOne !== null
                  ? `2^${numberInsights.powerOfTwoMinusOne} - 1`
                  : 'No exacta'}
              </span>
            </div>
          </div>

          {/* ASCII & Fixed Bit Width representations */}
          <div className="mt-4 pt-4 border-t border-card-border grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* ASCII interpretation */}
            <div className="p-3 rounded-md bg-background border border-card-border">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-muted font-semibold">Interpretación ASCII (0-255)</span>
                {numberInsights.ascii && (
                  <span className="text-xs px-2 py-0.5 rounded bg-accent-light text-accent font-medium">
                    {numberInsights.ascii.desc}
                  </span>
                )}
              </div>
              {numberInsights.ascii ? (
                <div className="flex items-center gap-3 mt-2">
                  <span className="font-mono text-xl font-bold px-3 py-1 rounded bg-card border border-card-border text-foreground">
                    {numberInsights.ascii.char}
                  </span>
                  <span className="text-xs text-muted">
                    Código decimal {currentBigInt.toString(10)} corresponde al carácter{' '}
                    <strong className="text-foreground">{numberInsights.ascii.char}</strong>
                  </span>
                </div>
              ) : (
                <p className="text-xs text-muted mt-2">
                  El número es superior a 255 o negativo, por lo que excede el rango estándar de 1 byte ASCII.
                </p>
              )}
            </div>

            {/* Fixed Bit Padding */}
            <div className="p-3 rounded-md bg-background border border-card-border">
              <span className="text-xs text-muted font-semibold block mb-2">
                Alineación a tamaños estándar
              </span>
              <div className="space-y-1.5 font-mono text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-muted">8-bit (1 byte):</span>
                  <span className="text-foreground font-semibold">
                    {numberInsights.pad8 ? formatGrouped(numberInsights.pad8, 'bin') : 'Excede 8 bits'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted">16-bit (2 bytes):</span>
                  <span className="text-foreground font-semibold">
                    {numberInsights.pad16 ? formatGrouped(numberInsights.pad16, 'bin') : 'Excede 16 bits'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted">32-bit (4 bytes):</span>
                  <span className="text-foreground font-semibold">
                    {numberInsights.pad32 ? formatGrouped(numberInsights.pad32, 'bin') : 'Excede 32 bits'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Step-by-Step Explanation Section */}
      <div className="rounded-lg border border-card-border bg-card p-5">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6">
          <div>
            <h2 className="text-lg font-bold text-foreground">Explicación paso a paso</h2>
            <p className="text-xs text-muted mt-0.5">
              Aprende el método matemático exacto detrás de cada conversión.
            </p>
          </div>

          {/* Tab Selector */}
          <div className="flex p-1 rounded-lg bg-background border border-card-border text-xs font-medium">
            <button
              type="button"
              onClick={() => setActiveTab('polynomial')}
              className={`px-3 py-1.5 rounded-md transition-colors ${
                activeTab === 'polynomial'
                  ? 'bg-accent text-white shadow-sm'
                  : 'text-muted hover:text-foreground'
              }`}
            >
              Potencias a Decimal
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('division')}
              className={`px-3 py-1.5 rounded-md transition-colors ${
                activeTab === 'division'
                  ? 'bg-accent text-white shadow-sm'
                  : 'text-muted hover:text-foreground'
              }`}
            >
              Divisiones sucesivas
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('nibbles')}
              className={`px-3 py-1.5 rounded-md transition-colors ${
                activeTab === 'nibbles'
                  ? 'bg-accent text-white shadow-sm'
                  : 'text-muted hover:text-foreground'
              }`}
            >
              Agrupación de bits
            </button>
          </div>
        </div>

        {/* TAB 1: Polynomial Expansion */}
        {activeTab === 'polynomial' && polynomialSteps && (
          <div className="space-y-4">
            <div className="p-4 rounded-lg bg-background border border-card-border text-sm">
              <h3 className="font-semibold text-foreground mb-1">
                Fórmula de descomposición polinómica ({polynomialSteps.baseName} a Decimal)
              </h3>
              <p className="text-xs text-muted mb-3">
                Cada dígito se multiplica por la base ({polynomialSteps.baseNumber}) elevada a su posición (de derecha a izquierda, comenzando en 0):
              </p>
              <div className="font-mono text-xs bg-code-bg p-3 rounded border border-card-border overflow-x-auto text-foreground">
                Valor = ∑ (dígito × {polynomialSteps.baseNumber}
                <sup className="text-accent">posición</sup>)
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-card-border text-muted">
                    <th className="py-2 px-3 font-semibold">Dígito</th>
                    <th className="py-2 px-3 font-semibold">Valor</th>
                    <th className="py-2 px-3 font-semibold">Posición (Potencia)</th>
                    <th className="py-2 px-3 font-semibold">Operación</th>
                    <th className="py-2 px-3 font-semibold text-right">Resultado parcial</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-card-border font-mono">
                  {polynomialSteps.displayTerms.map((t, idx) => (
                    <tr key={idx} className="hover:bg-background/80 transition-colors">
                      <td className="py-2 px-3 font-bold text-accent">{t.char}</td>
                      <td className="py-2 px-3 text-muted">{t.digitValue.toString()}</td>
                      <td className="py-2 px-3 text-muted">
                        {polynomialSteps.baseNumber}
                        <sup>{t.power}</sup> = {(BigInt(polynomialSteps.baseNumber) ** BigInt(t.power)).toString()}
                      </td>
                      <td className="py-2 px-3 text-muted">
                        {t.digitValue.toString()} × {(BigInt(polynomialSteps.baseNumber) ** BigInt(t.power)).toString()}
                      </td>
                      <td className="py-2 px-3 text-right font-bold text-foreground">
                        {t.termResult.toString()}
                      </td>
                    </tr>
                  ))}
                  {polynomialSteps.isTruncated && (
                    <tr>
                      <td colSpan={5} className="py-2 px-3 text-center text-muted italic">
                        ... (términos intermedios omitidos por brevedad) ...
                      </td>
                    </tr>
                  )}
                </tbody>
                <tfoot>
                  <tr className="border-t-2 border-card-border font-mono font-bold text-sm bg-background">
                    <td colSpan={4} className="py-2.5 px-3 text-foreground">
                      Suma total en Decimal:
                    </td>
                    <td className="py-2.5 px-3 text-right text-accent font-bold">
                      {polynomialSteps.totalDec}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        )}

        {/* TAB 2: Successive Divisions */}
        {activeTab === 'division' && divisionSteps && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-lg bg-background border border-card-border text-sm">
              <div>
                <h3 className="font-semibold text-foreground mb-1">
                  Algoritmo de divisiones sucesivas desde Decimal
                </h3>
                <p className="text-xs text-muted">
                  Se divide el número entre la base destino sucesivamente. Los residuos leídos de abajo hacia arriba forman el número final.
                </p>
              </div>

              {/* Target base pills */}
              <div className="flex items-center gap-1.5 shrink-0">
                <span className="text-xs font-medium text-muted mr-1">Convertir a:</span>
                {[
                  { base: 2 as const, label: 'Binario (÷2)' },
                  { base: 8 as const, label: 'Octal (÷8)' },
                  { base: 16 as const, label: 'Hex (÷16)' },
                ].map(item => (
                  <button
                    key={item.base}
                    type="button"
                    onClick={() => setDivisionTargetBase(item.base)}
                    className={`px-2.5 py-1 text-xs rounded border transition-colors ${
                      divisionTargetBase === item.base
                        ? 'bg-accent text-white border-accent font-semibold'
                        : 'border-card-border bg-card text-muted hover:text-foreground'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-card-border text-muted">
                    <th className="py-2 px-3 font-semibold">Paso</th>
                    <th className="py-2 px-3 font-semibold">División</th>
                    <th className="py-2 px-3 font-semibold">Cociente entero</th>
                    <th className="py-2 px-3 font-semibold">Residuo</th>
                    <th className="py-2 px-3 font-semibold text-right">Dígito resultante</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-card-border font-mono">
                  {divisionSteps.steps.map((s, idx) => (
                    <tr key={idx} className="hover:bg-background/80 transition-colors">
                      <td className="py-2 px-3 text-muted">#{idx + 1}</td>
                      <td className="py-2 px-3 text-foreground font-semibold">
                        {s.dividend} ÷ {divisionSteps.targetBase}
                      </td>
                      <td className="py-2 px-3 text-muted">{s.quotient}</td>
                      <td className="py-2 px-3 text-accent font-bold">{s.remainder}</td>
                      <td className="py-2 px-3 text-right font-bold text-foreground">
                        {s.hexSymbol || s.remainder}
                      </td>
                    </tr>
                  ))}
                  {divisionSteps.isTruncated && (
                    <tr>
                      <td colSpan={5} className="py-2 px-3 text-center text-muted italic">
                        ... pasos adicionales omitidos por longitud ...
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <div className="p-3 rounded-lg bg-accent-light/40 border border-accent/20 flex items-center justify-between text-xs">
              <span className="text-foreground">
                Leyendo los residuos en orden inverso (del último al primero):
              </span>
              <span className="font-mono font-bold text-accent text-sm">
                {divisionSteps.result}
              </span>
            </div>
          </div>
        )}

        {/* TAB 3: Bit Grouping Direct Mapping */}
        {activeTab === 'nibbles' && bitGroupingData && (
          <div className="space-y-6">
            <div className="p-4 rounded-lg bg-background border border-card-border text-sm">
              <h3 className="font-semibold text-foreground mb-1">
                Conversión directa sin pasar por decimal
              </h3>
              <p className="text-xs text-muted leading-relaxed">
                Dado que 16 = 2⁴ y 8 = 2³, no es necesario multiplicar ni dividir: cada grupo de bits binarios corresponde exactamente a un dígito en hexadecimal o en octal.
              </p>
            </div>

            {/* Binary to Hex (4-bit nibbles) */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-semibold text-muted">
                  Binario a Hexadecimal (Grupos de 4 bits / Nibbles)
                </h4>
                <span className="text-xs font-mono text-accent font-semibold">
                  Hex: {bitGroupingData.hexResult}
                </span>
              </div>

              <div className="flex flex-wrap gap-2 p-3 rounded-lg bg-background border border-card-border">
                {bitGroupingData.hexChunks.map((chunk, i) => (
                  <div
                    key={i}
                    className="flex flex-col items-center justify-center p-2 rounded border border-card-border bg-card min-w-[70px]"
                  >
                    <span className="font-mono text-xs text-muted">{chunk.bits}</span>
                    <span className="text-xs text-muted/60 my-0.5">↓</span>
                    <span className="font-mono text-base font-bold text-accent">
                      {chunk.hexChar}
                    </span>
                    <span className="text-[10px] text-muted">({chunk.decVal})</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Binary to Octal (3-bit groups) */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-semibold text-muted">
                  Binario a Octal (Grupos de 3 bits)
                </h4>
                <span className="text-xs font-mono text-accent font-semibold">
                  Octal: {bitGroupingData.octResult}
                </span>
              </div>

              <div className="flex flex-wrap gap-2 p-3 rounded-lg bg-background border border-card-border">
                {bitGroupingData.octChunks.map((chunk, i) => (
                  <div
                    key={i}
                    className="flex flex-col items-center justify-center p-2 rounded border border-card-border bg-card min-w-[60px]"
                  >
                    <span className="font-mono text-xs text-muted">{chunk.bits}</span>
                    <span className="text-xs text-muted/60 my-0.5">↓</span>
                    <span className="font-mono text-base font-bold text-accent">
                      {chunk.octChar}
                    </span>
                    <span className="text-[10px] text-muted">({chunk.decVal})</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Reference Table Section (0-255 in all bases) */}
      <div className="rounded-lg border border-card-border bg-card p-5">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
          <div>
            <h2 className="text-lg font-bold text-foreground">
              Tabla de equivalencias (0 a 255)
            </h2>
            <p className="text-xs text-muted mt-0.5">
              Haz clic en cualquier fila para cargarla directamente en el conversor interactivo.
            </p>
          </div>

          {/* Search Input for table */}
          <div className="relative w-full sm:w-64">
            <input
              type="text"
              value={tableSearch}
              onChange={e => setTableSearch(e.target.value)}
              placeholder="Buscar (ej: 255, FF, 1010)..."
              className="w-full text-xs font-mono px-3 py-1.5 rounded-md border border-card-border bg-background text-foreground placeholder:text-muted/60 focus:outline-none focus:border-accent"
            />
            {tableSearch && (
              <button
                type="button"
                onClick={() => setTableSearch('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted hover:text-foreground text-xs"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* Filter categories */}
        <div className="flex flex-wrap items-center gap-1.5 mb-4 text-xs">
          {[
            { id: 'all' as const, label: 'Todos (256)' },
            { id: 'nibble' as const, label: '0 al 15 (1 Nibble)' },
            { id: 'powers' as const, label: 'Potencias de 2' },
            { id: 'ascii' as const, label: 'ASCII Imprimible (32-126)' },
          ].map(cat => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setTableCategory(cat.id)}
              className={`px-2.5 py-1 rounded-md border transition-colors ${
                tableCategory === cat.id
                  ? 'bg-accent text-white border-accent font-semibold'
                  : 'bg-background border-card-border text-muted hover:text-foreground'
              }`}
            >
              {cat.label}
            </button>
          ))}
          <span className="ml-auto text-xs text-muted">
            {filteredReferenceTable.length} filas encontradas
          </span>
        </div>

        {/* Scrollable table container */}
        <div className="max-h-[380px] overflow-y-auto border border-card-border rounded-lg">
          <table className="w-full text-left border-collapse text-xs font-mono">
            <thead className="sticky top-0 bg-background border-b border-card-border z-10 shadow-xs">
              <tr className="text-muted">
                <th className="py-2.5 px-3 font-semibold">Decimal</th>
                <th className="py-2.5 px-3 font-semibold">Binario (8 bits)</th>
                <th className="py-2.5 px-3 font-semibold">Octal</th>
                <th className="py-2.5 px-3 font-semibold">Hexadecimal</th>
                <th className="py-2.5 px-3 font-semibold">ASCII</th>
                <th className="py-2.5 px-3 font-semibold text-right">Acción</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-card-border/60 bg-card">
              {filteredReferenceTable.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-6 text-center text-muted italic font-sans text-sm">
                    No se encontraron valores que coincidan con &ldquo;{tableSearch}&rdquo;.
                  </td>
                </tr>
              ) : (
                filteredReferenceTable.map(item => (
                  <tr
                    key={item.dec}
                    onClick={() => handleSelectPreset(item.dec.toString(), 'dec')}
                    className="hover:bg-accent-light/30 cursor-pointer transition-colors group"
                  >
                    <td className="py-2 px-3 font-bold text-foreground group-hover:text-accent">
                      {item.dec}
                    </td>
                    <td className="py-2 px-3 text-muted">{item.bin}</td>
                    <td className="py-2 px-3 text-muted">{item.oct}</td>
                    <td className="py-2 px-3 font-semibold text-accent">{item.hex}</td>
                    <td className="py-2 px-3 text-foreground font-sans text-xs">
                      <span className="font-mono font-bold bg-background px-1.5 py-0.5 rounded border border-card-border inline-block mr-1.5">
                        {item.asciiChar}
                      </span>
                      <span className="text-[11px] text-muted hidden sm:inline">
                        {item.asciiDesc}
                      </span>
                    </td>
                    <td className="py-2 px-3 text-right">
                      <span className="text-[11px] text-muted group-hover:text-accent transition-colors font-sans">
                        Cargar →
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
