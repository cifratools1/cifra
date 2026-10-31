'use client';

import { useState, useId, useEffect } from 'react';
import { CopyButton } from '@/components/ToolComponents';
import {
  type RgbColor,
  type HslColor,
  rgbToHex,
  hexToRgb,
  rgbToHsl,
  hslToRgb,
  parseRgbString,
  parseHslString,
  getRelativeLuminance,
} from '@/lib/colors';

const PRESETS = [
  { name: 'Esmeralda Cifra', hex: '#059669' },
  { name: 'Ámbar Cálido', hex: '#F59E0B' },
  { name: 'Índigo Moderno', hex: '#6366F1' },
  { name: 'Rojo Coral', hex: '#FF5733' },
  { name: 'Azul Celeste', hex: '#0284C7' },
  { name: 'Rosa Fucsia', hex: '#E11D48' },
  { name: 'Pizarra Oscuro', hex: '#1E293B' },
  { name: 'Verde Menta', hex: '#10B981' },
];

export default function ColorConverter() {
  const [color, setColor] = useState<RgbColor>({ r: 255, g: 87, b: 51 }); // #FF5733
  
  // Local input string buffers for typing
  const [hexInput, setHexInput] = useState('#FF5733');
  const [rgbInput, setRgbInput] = useState('rgb(255, 87, 51)');
  const [hslInput, setHslInput] = useState('hsl(11, 100%, 60%)');

  // Input errors
  const [hexError, setHexError] = useState<string | null>(null);
  const [rgbError, setRgbError] = useState<string | null>(null);
  const [hslError, setHslError] = useState<string | null>(null);

  const hexId = useId();
  const rgbId = useId();
  const hslId = useId();
  const pickerId = useId();

  // Cargar color inicial desde URL al montar en el cliente (evita desincronización de hidratación)
  useEffect(() => {
    const timer = setTimeout(() => {
      try {
        const qHex = new URLSearchParams(window.location.search).get('hex');
        if (qHex) {
          const parsed = hexToRgb(qHex);
          if (parsed) setColor(parsed);
        }
      } catch {
        // Ignore
      }
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  // Sync inputs when canonical color changes
  const currentHex = rgbToHex(color.r, color.g, color.b);
  const currentHsl = rgbToHsl(color.r, color.g, color.b);
  const currentRgbString = `rgb(${color.r}, ${color.g}, ${color.b})`;
  const currentHslString = `hsl(${currentHsl.h}, ${currentHsl.s}%, ${currentHsl.l}%)`;

  // Sync inputs when canonical color changes without triggering cascading render warnings
  useEffect(() => {
    const timer = setTimeout(() => {
      setHexInput(currentHex);
      setHexError(null);
      setRgbInput(currentRgbString);
      setRgbError(null);
      setHslInput(currentHslString);
      setHslError(null);
    }, 0);
    return () => clearTimeout(timer);
  }, [color.r, color.g, color.b, currentHex, currentHslString, currentRgbString]);

  // Sync shareable URL with current hex
  useEffect(() => {
    try {
      if (typeof window !== 'undefined') {
        const url = new URL(window.location.href);
        url.searchParams.set('hex', currentHex.replace('#', ''));
        window.history.replaceState({}, '', url.toString());
      }
    } catch {
      // Ignore
    }
  }, [currentHex]);

  // Handle Hex typing
  const handleHexChange = (value: string) => {
    setHexInput(value);
    const parsed = hexToRgb(value);
    if (parsed) {
      setColor(parsed);
      setHexError(null);
    } else {
      if (value.trim().length > 0) {
        setHexError('Formato inválido. Ejemplo: #FF5733 o #F53');
      } else {
        setHexError('Introduce un código HEX');
      }
    }
  };

  // Handle RGB typing
  const handleRgbChange = (value: string) => {
    setRgbInput(value);
    const parsed = parseRgbString(value);
    if (parsed) {
      setColor(parsed);
      setRgbError(null);
    } else {
      if (value.trim().length > 0) {
        setRgbError('Formato inválido. Ejemplo: rgb(255, 87, 51) o 255, 87, 51');
      } else {
        setRgbError('Introduce valores RGB (0 a 255)');
      }
    }
  };

  // Handle HSL typing
  const handleHslChange = (value: string) => {
    setHslInput(value);
    const parsed = parseHslString(value);
    if (parsed) {
      setColor(hslToRgb(parsed.h, parsed.s, parsed.l));
      setHslError(null);
    } else {
      if (value.trim().length > 0) {
        setHslError('Formato inválido. Ejemplo: hsl(11, 100%, 60%)');
      } else {
        setHslError('Introduce valores HSL (H: 0-360, S: 0-100%, L: 0-100%)');
      }
    }
  };

  // Native color picker
  const handlePickerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const parsed = hexToRgb(e.target.value);
    if (parsed) {
      setColor(parsed);
    }
  };

  const handleApplyColor = (rgb: RgbColor) => {
    setColor(rgb);
  };

  const handleRandomColor = () => {
    const r = Math.floor(Math.random() * 256);
    const g = Math.floor(Math.random() * 256);
    const b = Math.floor(Math.random() * 256);
    setColor({ r, g, b });
  };

  // WCAG Contrast Ratios
  const lum = getRelativeLuminance(color.r, color.g, color.b);
  const contrastWhite = (1.0 + 0.05) / (lum + 0.05);
  const contrastBlack = (lum + 0.05) / (0.0 + 0.05);

  // Harmonies
  const complementaryHsl: HslColor = { ...currentHsl, h: (currentHsl.h + 180) % 360 };
  const complementaryRgb = hslToRgb(complementaryHsl.h, complementaryHsl.s, complementaryHsl.l);

  const analogous1Hsl: HslColor = { ...currentHsl, h: (currentHsl.h - 30 + 360) % 360 };
  const analogous2Hsl: HslColor = { ...currentHsl, h: (currentHsl.h + 30) % 360 };
  const analogous1Rgb = hslToRgb(analogous1Hsl.h, analogous1Hsl.s, analogous1Hsl.l);
  const analogous2Rgb = hslToRgb(analogous2Hsl.h, analogous2Hsl.s, analogous2Hsl.l);

  const triadic1Hsl: HslColor = { ...currentHsl, h: (currentHsl.h + 120) % 360 };
  const triadic2Hsl: HslColor = { ...currentHsl, h: (currentHsl.h + 240) % 360 };
  const triadic1Rgb = hslToRgb(triadic1Hsl.h, triadic1Hsl.s, triadic1Hsl.l);
  const triadic2Rgb = hslToRgb(triadic2Hsl.h, triadic2Hsl.s, triadic2Hsl.l);

  // Monochromatic lightness scale (20%, 40%, 60%, 80%, 90%)
  const shades = [15, 30, 50, 70, 85].map(lightness => {
    const rgb = hslToRgb(currentHsl.h, currentHsl.s, lightness);
    return {
      lightness,
      rgb,
      hex: rgbToHex(rgb.r, rgb.g, rgb.b),
    };
  });

  // Determine text color inside main swatch for readability
  const isLight = lum > 0.45;
  const swatchTextColor = isLight ? '#0f172a' : '#ffffff';

  return (
    <div className="space-y-6">
      {/* Top Banner: Swatch + Native Picker + Quick presets */}
      <div className="border border-card-border rounded-xl bg-card p-5 sm:p-6 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
          {/* Large Color Swatch */}
          <div
            className="md:col-span-5 h-44 sm:h-52 rounded-xl border border-black/10 dark:border-white/10 p-5 flex flex-col justify-between transition-colors shadow-inner relative overflow-hidden"
            style={{ backgroundColor: currentHex }}
          >
            <div className="flex items-center justify-between">
              <span
                className="text-xs font-semibold px-2.5 py-1 rounded-md backdrop-blur-md bg-black/20 text-white"
              >
                Vista previa
              </span>

              {/* Native picker overlay button */}
              <label
                htmlFor={pickerId}
                className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md backdrop-blur-md bg-white/90 text-slate-900 text-xs font-semibold shadow hover:bg-white transition-colors"
                title="Abrir selector de color nativo del sistema"
              >
                <input
                  id={pickerId}
                  type="color"
                  value={currentHex}
                  onChange={handlePickerChange}
                  className="sr-only"
                />
                <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
                  <path d="M13.354.646a1.207 1.207 0 0 0-1.708 0L8.5 3.793l-.646-.647a.5.5 0 1 0-.708.708L8.293 5l-7.147 7.146A.5.5 0 0 0 1 12.5v2a.5.5 0 0 0 .5.5h2a.5.5 0 0 0 .354-.146L11 7.707l1.146 1.147a.5.5 0 0 0 .708-.708l-.647-.646 3.147-3.146a1.207 1.207 0 0 0 0-1.708l-2-2z" />
                </svg>
                Selector visual
              </label>
            </div>

            <div style={{ color: swatchTextColor }}>
              <div className="text-2xl sm:text-3xl font-extrabold tracking-tight font-mono">
                {currentHex}
              </div>
              <div className="text-xs font-medium opacity-90 font-mono mt-0.5">
                {currentRgbString} · {currentHslString}
              </div>
            </div>
          </div>

          {/* Quick presets and randomizer */}
          <div className="md:col-span-7 flex flex-col justify-between space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-muted">
                  Paleta de colores rápidos
                </span>
                <button
                  type="button"
                  onClick={handleRandomColor}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-md border border-card-border bg-background text-foreground hover:border-accent hover:text-accent transition-colors"
                  title="Generar un color aleatorio"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                    <path d="M16 8h.01" />
                    <path d="M8 8h.01" />
                    <path d="M8 16h.01" />
                    <path d="M16 16h.01" />
                    <path d="M12 12h.01" />
                  </svg>
                  <span>Color aleatorio</span>
                </button>
              </div>

              <div className="grid grid-cols-4 gap-2">
                {PRESETS.map((p, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => {
                      const rgb = hexToRgb(p.hex);
                      if (rgb) handleApplyColor(rgb);
                    }}
                    className="group flex flex-col items-center p-2 rounded-lg border border-card-border bg-background hover:border-accent/40 transition-colors"
                    title={`${p.name} (${p.hex})`}
                  >
                    <span
                      className="w-full h-7 rounded border border-black/10 dark:border-white/10 block mb-1 group-hover:scale-105 transition-transform"
                      style={{ backgroundColor: p.hex }}
                    />
                    <span className="text-[11px] font-medium text-foreground truncate w-full text-center">
                      {p.name}
                    </span>
                    <span className="text-[10px] text-muted font-mono">{p.hex}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Quick copy CSS variable */}
            <div className="pt-2 border-t border-card-border flex items-center justify-between">
              <span className="text-xs text-muted">Variable CSS lista:</span>
              <div className="flex items-center gap-2">
                <code className="text-xs bg-code-bg px-2 py-1 rounded text-foreground font-mono">
                  --color: {currentHex};
                </code>
                <CopyButton text={`--color: ${currentHex};`} label="Copiar CSS" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Synchronized Inputs: HEX, RGB, HSL */}
      <div>
        <h2 className="text-base font-semibold text-foreground mb-3">
          Conversión simultánea en tres formatos
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* HEX Input */}
          <div className="border border-card-border rounded-xl bg-card p-4 sm:p-5 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <label htmlFor={hexId} className="text-sm font-bold text-foreground">
                  Hexadecimal (HEX)
                </label>
                <CopyButton text={currentHex} label="Copiar" />
              </div>
              <p className="text-xs text-muted mb-3">Formato estándar web (#RRGGBB)</p>

              <div className="relative">
                <input
                  id={hexId}
                  type="text"
                  value={hexInput}
                  onChange={e => handleHexChange(e.target.value)}
                  placeholder="#FF5733"
                  className={`w-full rounded-lg border px-3 py-2.5 font-mono text-sm uppercase text-foreground bg-background focus:outline-none transition-colors ${
                    hexError
                      ? 'border-danger focus:border-danger'
                      : 'border-input-border focus:border-accent'
                  }`}
                />
              </div>

              {hexError && (
                <p className="mt-1.5 text-xs text-danger font-medium">{hexError}</p>
              )}
            </div>

            <div className="mt-4 pt-3 border-t border-card-border text-[11px] text-muted flex items-center justify-between">
              <span>Soporta formatos #RGB y #RRGGBB</span>
              <span className="font-mono">{currentHex}</span>
            </div>
          </div>

          {/* RGB Input */}
          <div className="border border-card-border rounded-xl bg-card p-4 sm:p-5 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <label htmlFor={rgbId} className="text-sm font-bold text-foreground">
                  Rojo, Verde, Azul (RGB)
                </label>
                <CopyButton text={currentRgbString} label="Copiar" />
              </div>
              <p className="text-xs text-muted mb-3">Valores de 0 a 255 por canal</p>

              <div className="relative">
                <input
                  id={rgbId}
                  type="text"
                  value={rgbInput}
                  onChange={e => handleRgbChange(e.target.value)}
                  placeholder="rgb(255, 87, 51)"
                  className={`w-full rounded-lg border px-3 py-2.5 font-mono text-sm text-foreground bg-background focus:outline-none transition-colors ${
                    rgbError
                      ? 'border-danger focus:border-danger'
                      : 'border-input-border focus:border-accent'
                  }`}
                />
              </div>

              {rgbError && (
                <p className="mt-1.5 text-xs text-danger font-medium">{rgbError}</p>
              )}
            </div>

            <div className="mt-4 pt-3 border-t border-card-border text-[11px] text-muted flex items-center justify-between">
              <span>R: {color.r} · G: {color.g} · B: {color.b}</span>
              <span className="font-mono">{currentRgbString}</span>
            </div>
          </div>

          {/* HSL Input */}
          <div className="border border-card-border rounded-xl bg-card p-4 sm:p-5 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <label htmlFor={hslId} className="text-sm font-bold text-foreground">
                  Matiz, Saturación, Luz (HSL)
                </label>
                <CopyButton text={currentHslString} label="Copiar" />
              </div>
              <p className="text-xs text-muted mb-3">H: 0-360°, S: 0-100%, L: 0-100%</p>

              <div className="relative">
                <input
                  id={hslId}
                  type="text"
                  value={hslInput}
                  onChange={e => handleHslChange(e.target.value)}
                  placeholder="hsl(11, 100%, 60%)"
                  className={`w-full rounded-lg border px-3 py-2.5 font-mono text-sm text-foreground bg-background focus:outline-none transition-colors ${
                    hslError
                      ? 'border-danger focus:border-danger'
                      : 'border-input-border focus:border-accent'
                  }`}
                />
              </div>

              {hslError && (
                <p className="mt-1.5 text-xs text-danger font-medium">{hslError}</p>
              )}
            </div>

            <div className="mt-4 pt-3 border-t border-card-border text-[11px] text-muted flex items-center justify-between">
              <span>H: {currentHsl.h}° · S: {currentHsl.s}% · L: {currentHsl.l}%</span>
              <span className="font-mono">{currentHslString}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Color Harmonies (Click to load!) */}
      <div className="border border-card-border rounded-xl bg-card p-5 shadow-sm">
        <div className="mb-4">
          <h2 className="text-base font-bold text-foreground">Armonías cromáticas</h2>
          <p className="text-xs text-muted mt-0.5">
            Paletas calculadas matemáticamente a partir del matiz (Hue). Haz clic en cualquier color para seleccionarlo.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Complementary */}
          <div className="border border-card-border rounded-lg p-3 bg-background">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-foreground">Color complementario</span>
              <span className="text-[10px] text-muted font-mono">+180°</span>
            </div>
            <div className="flex gap-2 items-center">
              <button
                type="button"
                onClick={() => handleApplyColor(complementaryRgb)}
                className="w-12 h-12 rounded-lg border border-black/10 dark:border-white/10 shrink-0 hover:scale-105 transition-transform"
                style={{ backgroundColor: rgbToHex(complementaryRgb.r, complementaryRgb.g, complementaryRgb.b) }}
                title="Cargar color complementario"
              />
              <div className="overflow-hidden text-xs">
                <span className="font-mono font-bold text-foreground block">
                  {rgbToHex(complementaryRgb.r, complementaryRgb.g, complementaryRgb.b)}
                </span>
                <span className="text-muted text-[11px] font-mono block">
                  hsl({complementaryHsl.h}, {complementaryHsl.s}%, {complementaryHsl.l}%)
                </span>
              </div>
            </div>
          </div>

          {/* Analogous */}
          <div className="border border-card-border rounded-lg p-3 bg-background">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-foreground">Colores análogos</span>
              <span className="text-[10px] text-muted font-mono">-30° / +30°</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleApplyColor(analogous1Rgb)}
                className="p-1.5 rounded-lg border border-card-border bg-card flex items-center gap-2 hover:border-accent/50 transition-colors"
                title="Cargar análogo -30°"
              >
                <span
                  className="w-7 h-7 rounded shrink-0 border border-black/10"
                  style={{ backgroundColor: rgbToHex(analogous1Rgb.r, analogous1Rgb.g, analogous1Rgb.b) }}
                />
                <span className="text-[11px] font-mono font-medium truncate text-foreground">
                  {rgbToHex(analogous1Rgb.r, analogous1Rgb.g, analogous1Rgb.b)}
                </span>
              </button>
              <button
                type="button"
                onClick={() => handleApplyColor(analogous2Rgb)}
                className="p-1.5 rounded-lg border border-card-border bg-card flex items-center gap-2 hover:border-accent/50 transition-colors"
                title="Cargar análogo +30°"
              >
                <span
                  className="w-7 h-7 rounded shrink-0 border border-black/10"
                  style={{ backgroundColor: rgbToHex(analogous2Rgb.r, analogous2Rgb.g, analogous2Rgb.b) }}
                />
                <span className="text-[11px] font-mono font-medium truncate text-foreground">
                  {rgbToHex(analogous2Rgb.r, analogous2Rgb.g, analogous2Rgb.b)}
                </span>
              </button>
            </div>
          </div>

          {/* Triadic */}
          <div className="border border-card-border rounded-lg p-3 bg-background">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-foreground">Colores triádicos</span>
              <span className="text-[10px] text-muted font-mono">+120° / +240°</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleApplyColor(triadic1Rgb)}
                className="p-1.5 rounded-lg border border-card-border bg-card flex items-center gap-2 hover:border-accent/50 transition-colors"
                title="Cargar triádico +120°"
              >
                <span
                  className="w-7 h-7 rounded shrink-0 border border-black/10"
                  style={{ backgroundColor: rgbToHex(triadic1Rgb.r, triadic1Rgb.g, triadic1Rgb.b) }}
                />
                <span className="text-[11px] font-mono font-medium truncate text-foreground">
                  {rgbToHex(triadic1Rgb.r, triadic1Rgb.g, triadic1Rgb.b)}
                </span>
              </button>
              <button
                type="button"
                onClick={() => handleApplyColor(triadic2Rgb)}
                className="p-1.5 rounded-lg border border-card-border bg-card flex items-center gap-2 hover:border-accent/50 transition-colors"
                title="Cargar triádico +240°"
              >
                <span
                  className="w-7 h-7 rounded shrink-0 border border-black/10"
                  style={{ backgroundColor: rgbToHex(triadic2Rgb.r, triadic2Rgb.g, triadic2Rgb.b) }}
                />
                <span className="text-[11px] font-mono font-medium truncate text-foreground">
                  {rgbToHex(triadic2Rgb.r, triadic2Rgb.g, triadic2Rgb.b)}
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* Monochromatic Shades Bar */}
        <div className="mt-4 pt-4 border-t border-card-border">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-foreground">Escala monocromática (variación de luminosidad)</span>
            <span className="text-xs text-muted">Haz clic para seleccionar</span>
          </div>
          <div className="grid grid-cols-5 gap-2">
            {shades.map((s, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleApplyColor(s.rgb)}
                className="group flex flex-col items-center p-2 rounded-lg border border-card-border bg-background hover:border-accent/40 transition-colors"
              >
                <span
                  className="w-full h-8 rounded border border-black/10 dark:border-white/10 block mb-1 group-hover:scale-105 transition-transform"
                  style={{ backgroundColor: s.hex }}
                />
                <span className="text-[11px] font-mono font-medium text-foreground">{s.hex}</span>
                <span className="text-[10px] text-muted">{s.lightness}% luz</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* WCAG 2.1 Contrast Ratio Verification */}
      <div className="border border-card-border rounded-xl bg-card p-5 shadow-sm">
        <div className="mb-4">
          <h2 className="text-base font-bold text-foreground">
            Accesibilidad Web: Ratio de contraste (WCAG 2.1)
          </h2>
          <p className="text-xs text-muted mt-0.5">
            Verifica si tu color cumple con los estándares internacionales de legibilidad sobre fondos oscuros o claros.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Against White text */}
          <div className="border border-card-border rounded-lg p-4 bg-background flex flex-col justify-between">
            <div>
              <div
                className="rounded-lg p-4 text-center mb-3 shadow-inner"
                style={{ backgroundColor: currentHex, color: '#ffffff' }}
              >
                <span className="text-base font-bold block">Texto blanco (#FFFFFF)</span>
                <span className="text-xs opacity-90 block">
                  Así se ve el texto con este contraste
                </span>
              </div>

              <div className="flex items-center justify-between mb-3">
                <span className="text-xs text-muted font-medium">Ratio de contraste</span>
                <span className="text-lg font-bold font-mono text-foreground">
                  {contrastWhite.toFixed(2)}:1
                </span>
              </div>

              <div className="space-y-1.5 text-xs">
                <div className="flex items-center justify-between p-1.5 rounded bg-card border border-card-border/60">
                  <span>Texto normal AA (mínimo 4.5:1)</span>
                  <span
                    className={`font-semibold px-2 py-0.5 rounded text-[11px] ${
                      contrastWhite >= 4.5
                        ? 'bg-success-light text-success'
                        : 'bg-danger-light text-danger'
                    }`}
                  >
                    {contrastWhite >= 4.5 ? '✓ Pasa' : '✗ Falla'}
                  </span>
                </div>
                <div className="flex items-center justify-between p-1.5 rounded bg-card border border-card-border/60">
                  <span>Texto grande AA / normal AAA (mínimo 3.0:1 / 7.0:1)</span>
                  <span
                    className={`font-semibold px-2 py-0.5 rounded text-[11px] ${
                      contrastWhite >= 7.0
                        ? 'bg-success-light text-success'
                        : contrastWhite >= 3.0
                        ? 'bg-warning-light text-warning'
                        : 'bg-danger-light text-danger'
                    }`}
                  >
                    {contrastWhite >= 7.0
                      ? '✓ AAA Pasa'
                      : contrastWhite >= 3.0
                      ? '✓ AA Grande'
                      : '✗ Falla'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Against Black text */}
          <div className="border border-card-border rounded-lg p-4 bg-background flex flex-col justify-between">
            <div>
              <div
                className="rounded-lg p-4 text-center mb-3 shadow-inner"
                style={{ backgroundColor: currentHex, color: '#000000' }}
              >
                <span className="text-base font-bold block">Texto negro (#000000)</span>
                <span className="text-xs opacity-90 block">
                  Así se ve el texto con este contraste
                </span>
              </div>

              <div className="flex items-center justify-between mb-3">
                <span className="text-xs text-muted font-medium">Ratio de contraste</span>
                <span className="text-lg font-bold font-mono text-foreground">
                  {contrastBlack.toFixed(2)}:1
                </span>
              </div>

              <div className="space-y-1.5 text-xs">
                <div className="flex items-center justify-between p-1.5 rounded bg-card border border-card-border/60">
                  <span>Texto normal AA (mínimo 4.5:1)</span>
                  <span
                    className={`font-semibold px-2 py-0.5 rounded text-[11px] ${
                      contrastBlack >= 4.5
                        ? 'bg-success-light text-success'
                        : 'bg-danger-light text-danger'
                    }`}
                  >
                    {contrastBlack >= 4.5 ? '✓ Pasa' : '✗ Falla'}
                  </span>
                </div>
                <div className="flex items-center justify-between p-1.5 rounded bg-card border border-card-border/60">
                  <span>Texto grande AA / normal AAA (mínimo 3.0:1 / 7.0:1)</span>
                  <span
                    className={`font-semibold px-2 py-0.5 rounded text-[11px] ${
                      contrastBlack >= 7.0
                        ? 'bg-success-light text-success'
                        : contrastBlack >= 3.0
                        ? 'bg-warning-light text-warning'
                        : 'bg-danger-light text-danger'
                    }`}
                  >
                    {contrastBlack >= 7.0
                      ? '✓ AAA Pasa'
                      : contrastBlack >= 3.0
                      ? '✓ AA Grande'
                      : '✗ Falla'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
