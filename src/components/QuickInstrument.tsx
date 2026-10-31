'use client';

import React, { useState, useMemo, useCallback } from 'react';
import Link from 'next/link';
import { CopyButton } from '@/components/ToolComponents';
import { ZapIcon } from '@/components/Icons';

// --- HELPERS PARA REDES IPV4 ---
function ipToNum(ip: string): number {
  const parts = ip.split('.').map((p) => parseInt(p, 10));
  if (parts.length !== 4 || parts.some((p) => isNaN(p) || p < 0 || p > 255)) {
    return 0;
  }
  return (((parts[0] << 24) | (parts[1] << 16) | (parts[2] << 8) | parts[3]) >>> 0);
}

function numToIp(num: number): string {
  return [
    (num >>> 24) & 255,
    (num >>> 16) & 255,
    (num >>> 8) & 255,
    num & 255,
  ].join('.');
}

// --- HELPERS PARA CONTRASEÑAS Y ENTROPÍA ---
const CHARS_ALL = 'abcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ23456789!@#$%^&*()_+~';

function generateRandomPassword(len: number): string {
  if (typeof window === 'undefined' || !window.crypto) return '';
  const array = new Uint32Array(len);
  window.crypto.getRandomValues(array);
  let res = '';
  for (let i = 0; i < len; i++) {
    res += CHARS_ALL[array[i] % CHARS_ALL.length];
  }
  return res;
}

function calculatePasswordEntropy(pw: string): {
  bits: number;
  crackTime: string;
  label: string;
  color: string;
  barColor: string;
  percent: number;
} {
  if (!pw) {
    return {
      bits: 0,
      crackTime: '0 s',
      label: 'Sin contraseña',
      color: 'text-muted',
      barColor: 'bg-card-border',
      percent: 0,
    };
  }

  let pool = 0;
  if (/[a-z]/.test(pw)) pool += 26;
  if (/[A-Z]/.test(pw)) pool += 26;
  if (/[0-9]/.test(pw)) pool += 10;
  if (/[^a-zA-Z0-9]/.test(pw)) pool += 33;

  if (pool === 0) pool = 26;
  const bits = Math.round(pw.length * Math.log2(pool) * 10) / 10;

  if (bits >= 90) {
    return {
      bits,
      crackTime: 'Miles de millones de años',
      label: 'Muy segura',
      color: 'text-emerald-500 dark:text-emerald-400',
      barColor: 'bg-emerald-500',
      percent: 100,
    };
  } else if (bits >= 65) {
    return {
      bits,
      crackTime: 'Varios siglos',
      label: 'Segura',
      color: 'text-accent',
      barColor: 'bg-accent',
      percent: 75,
    };
  } else if (bits >= 45) {
    return {
      bits,
      crackTime: 'Varios meses',
      label: 'Aceptable',
      color: 'text-amber-500 dark:text-amber-400',
      barColor: 'bg-amber-500',
      percent: 50,
    };
  } else {
    return {
      bits,
      crackTime: 'Instantáneo o pocos minutos',
      label: 'Débil',
      color: 'text-red-500 dark:text-red-400',
      barColor: 'bg-red-500',
      percent: 25,
    };
  }
}

// --- HELPER PARA BASE64 UTF-8 ---
function toBase64Utf8(str: string): string {
  if (!str) return '';
  try {
    const bytes = new TextEncoder().encode(str);
    let bin = '';
    for (let i = 0; i < bytes.length; i++) {
      bin += String.fromCharCode(bytes[i]);
    }
    return btoa(bin);
  } catch {
    return '';
  }
}

export default function QuickInstrument() {
  const [activeTab, setActiveTab] = useState<'subnets' | 'passwords' | 'text-hash'>('subnets');

  // --- Pestaña 1: Redes e IP ---
  const [subnetInput, setSubnetInput] = useState('192.168.1.50/24');

  const subnetCalculated = useMemo(() => {
    try {
      const trimmed = subnetInput.trim();
      let ip = trimmed;
      let cidr = 24;
      if (trimmed.includes('/')) {
        const parts = trimmed.split('/');
        ip = parts[0].trim();
        const pCidr = parseInt(parts[1].trim(), 10);
        if (!isNaN(pCidr) && pCidr >= 0 && pCidr <= 32) {
          cidr = pCidr;
        } else {
          return null;
        }
      }

      const octets = ip.split('.').map((p) => parseInt(p, 10));
      if (octets.length !== 4 || octets.some((o) => isNaN(o) || o < 0 || o > 255)) {
        return null;
      }

      const ipInt = ipToNum(ip);
      const maskInt = cidr === 0 ? 0 : ((0xffffffff << (32 - cidr)) >>> 0);
      const wildcardInt = (~maskInt) >>> 0;
      const netInt = (ipInt & maskInt) >>> 0;
      const bcastInt = (netInt | wildcardInt) >>> 0;

      const total = Math.pow(2, 32 - cidr);
      const usable = cidr === 32 ? 1 : cidr === 31 ? 2 : Math.max(0, total - 2);

      const netStr = numToIp(netInt);
      const bcastStr = numToIp(bcastInt);
      const maskStr = numToIp(maskInt);
      const usableStr = usable.toLocaleString('es-ES');

      return {
        network: netStr,
        broadcast: bcastStr,
        mask: maskStr,
        usableHosts: usableStr,
        cidr,
        summaryText: `Red: ${netStr}/${cidr}\nMáscara: ${maskStr}\nBroadcast: ${bcastStr}\nHosts utilizables: ${usableStr}`,
      };
    } catch {
      return null;
    }
  }, [subnetInput]);

  const handleApplyPrefix = (prefix: number) => {
    const trimmed = subnetInput.trim();
    const baseIp = trimmed ? trimmed.split('/')[0].trim() : '192.168.1.50';
    setSubnetInput(`${baseIp}/${prefix}`);
  };

  // --- Pestaña 2: Contraseñas ---
  const [passwordValue, setPasswordValue] = useState('k9#mP2$vL8@qW5!z');
  const [passwordLength, setPasswordLength] = useState(16);

  const handleRegeneratePassword = useCallback((len: number) => {
    const pw = generateRandomPassword(len);
    if (pw) setPasswordValue(pw);
  }, []);

  const handleLengthChange = (len: number) => {
    setPasswordLength(len);
    handleRegeneratePassword(len);
  };

  const passwordMetrics = useMemo(() => {
    return calculatePasswordEntropy(passwordValue);
  }, [passwordValue]);

  // --- Pestaña 3: Textos / Hashes ---
  const [textInput, setTextInput] = useState('cifra.tools');
  const [sha256Output, setSha256Output] = useState(
    '151d4589992211cb62cf29ddee690d48e859a27363d5f01ff05a9873f90b4606'
  );

  const base64Output = useMemo(() => {
    return toBase64Utf8(textInput);
  }, [textInput]);

  const calculateSha256 = useCallback(async (text: string) => {
    if (!text) {
      setSha256Output('');
      return;
    }
    try {
      const encoder = new TextEncoder();
      const data = encoder.encode(text);
      const hashBuffer = await crypto.subtle.digest('SHA-256', data);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      const hashHex = hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
      setSha256Output(hashHex);
    } catch {
      setSha256Output('');
    }
  }, []);

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    setTextInput(val);
    calculateSha256(val);
  };

  return (
    <div className="rounded-xl border border-card-border bg-card p-4 sm:p-5 shadow-sm min-h-[420px] flex flex-col justify-between">
      {/* 1. Selector de Pestañas Superior */}
      <div>
        <div className="flex items-center justify-between border-b border-card-border pb-3 mb-4">
          <div className="flex items-center gap-1.5">
            <ZapIcon size={16} className="text-accent shrink-0" />
            <span className="text-xs font-semibold text-foreground">
              Acceso rápido
            </span>
          </div>

          <div
            className="flex items-center gap-1 bg-card-subtle p-0.5 rounded-lg border border-card-border"
            role="tablist"
            aria-label="Selector de herramientas rápidas"
          >
            <button
              type="button"
              role="tab"
              aria-selected={activeTab === 'subnets'}
              onClick={() => setActiveTab('subnets')}
              className={`px-2.5 py-1 text-xs font-medium rounded-md transition-all ${
                activeTab === 'subnets'
                  ? 'bg-foreground text-background shadow-xs font-semibold'
                  : 'text-muted hover:text-foreground'
              }`}
            >
              Redes e IP
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={activeTab === 'passwords'}
              onClick={() => setActiveTab('passwords')}
              className={`px-2.5 py-1 text-xs font-medium rounded-md transition-all ${
                activeTab === 'passwords'
                  ? 'bg-foreground text-background shadow-xs font-semibold'
                  : 'text-muted hover:text-foreground'
              }`}
            >
              Contraseñas
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={activeTab === 'text-hash'}
              onClick={() => setActiveTab('text-hash')}
              className={`px-2.5 py-1 text-xs font-medium rounded-md transition-all ${
                activeTab === 'text-hash'
                  ? 'bg-foreground text-background shadow-xs font-semibold'
                  : 'text-muted hover:text-foreground'
              }`}
            >
              Textos / Hashes
            </button>
          </div>
        </div>

        {/* 2. CONTENIDO SEGÚN PESTAÑA */}

        {/* PESTAÑA 1: REDES E IP */}
        {activeTab === 'subnets' && (
          <div className="space-y-3.5">
            <div>
              <label htmlFor="quick-subnet-input" className="block text-xs font-medium text-muted mb-1">
                Dirección IP con prefijo CIDR
              </label>
              <input
                id="quick-subnet-input"
                type="text"
                value={subnetInput}
                onChange={(e) => setSubnetInput(e.target.value)}
                placeholder="ej. 192.168.1.50/24"
                className="w-full px-3 py-1.5 text-sm font-mono bg-background border border-input-border rounded-md focus:border-accent outline-none text-foreground"
              />

              {/* Botones rápidos para prefijos frecuentes */}
              <div className="flex items-center gap-1.5 mt-2">
                <span className="text-[11px] text-muted font-medium">Prefijos rápidos:</span>
                {[24, 16, 20, 30].map((prefix) => {
                  const isSelected = subnetCalculated?.cidr === prefix;
                  return (
                    <button
                      key={prefix}
                      type="button"
                      onClick={() => handleApplyPrefix(prefix)}
                      className={`text-[11px] font-mono px-2 py-0.5 rounded border transition-colors ${
                        isSelected
                          ? 'bg-accent text-white border-accent font-semibold'
                          : 'border-card-border bg-card-subtle text-muted hover:text-foreground hover:border-accent'
                      }`}
                    >
                      /{prefix}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Panel de resultados en tiempo real */}
            {subnetCalculated ? (
              <div className="p-3.5 rounded-lg bg-card-subtle border border-card-border space-y-3">
                <div className="flex items-baseline justify-between border-b border-card-border pb-2">
                  <div>
                    <span className="text-[11px] text-muted block">Red calculada</span>
                    <span className="text-xl sm:text-2xl font-mono font-bold text-foreground">
                      {subnetCalculated.network}/{subnetCalculated.cidr}
                    </span>
                  </div>
                  <CopyButton
                    text={subnetCalculated.summaryText}
                    label="Copiar"
                    className="py-1 px-2.5 text-xs"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-muted block text-[11px]">Dirección de red</span>
                    <span className="font-mono font-semibold text-foreground">
                      {subnetCalculated.network}
                    </span>
                  </div>
                  <div>
                    <span className="text-muted block text-[11px]">Máscara de subred</span>
                    <span className="font-mono font-semibold text-foreground">
                      {subnetCalculated.mask}
                    </span>
                  </div>
                  <div>
                    <span className="text-muted block text-[11px]">Broadcast</span>
                    <span className="font-mono text-muted">{subnetCalculated.broadcast}</span>
                  </div>
                  <div>
                    <span className="text-muted block text-[11px]">Hosts utilizables</span>
                    <span className="font-mono font-semibold text-accent">
                      {subnetCalculated.usableHosts}
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/20 text-xs text-red-600 dark:text-red-400">
                Formato no válido. Escribe una IP IPv4 con prefijo CIDR (ej. 192.168.1.50/24).
              </div>
            )}
          </div>
        )}

        {/* PESTAÑA 2: CONTRASEÑAS */}
        {activeTab === 'passwords' && (
          <div className="space-y-3.5">
            <div>
              <div className="flex items-center justify-between mb-1">
                <label htmlFor="quick-pw-input" className="text-xs font-medium text-muted">
                  Contraseña (edita para auditar o regenera)
                </label>
                <button
                  type="button"
                  onClick={() => handleRegeneratePassword(passwordLength)}
                  className="text-xs text-accent hover:underline font-semibold inline-flex items-center gap-1"
                >
                  <span className="font-mono text-sm leading-none">↻</span>
                  <span>Regenerar</span>
                </button>
              </div>

              <div className="flex gap-2">
                <input
                  id="quick-pw-input"
                  type="text"
                  value={passwordValue}
                  onChange={(e) => setPasswordValue(e.target.value)}
                  placeholder="Escribe o genera una clave..."
                  className="w-full px-3 py-2 text-sm sm:text-base font-mono bg-background border border-input-border rounded-md focus:border-accent outline-none text-foreground font-medium tracking-wide"
                />
                <CopyButton text={passwordValue} label="Copiar" />
              </div>

              {/* Botones de longitud rápida */}
              <div className="flex items-center gap-1.5 mt-2">
                <span className="text-[11px] text-muted font-medium">Longitud:</span>
                {[12, 16, 24, 32].map((len) => (
                  <button
                    key={len}
                    type="button"
                    onClick={() => handleLengthChange(len)}
                    className={`text-[11px] font-mono px-2 py-0.5 rounded border transition-colors ${
                      passwordLength === len
                        ? 'bg-accent text-white border-accent font-semibold'
                        : 'border-card-border bg-card-subtle text-muted hover:text-foreground hover:border-accent'
                    }`}
                  >
                    {len}
                  </button>
                ))}
              </div>
            </div>

            {/* Panel de indicador visual de seguridad */}
            <div className="p-3.5 rounded-lg bg-card-subtle border border-card-border space-y-2.5">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="text-muted">Fortaleza:</span>
                  <span className={`font-bold ${passwordMetrics.color}`}>
                    {passwordMetrics.label}
                  </span>
                </div>
                <span className="font-mono font-semibold text-foreground">
                  {passwordMetrics.bits} bits de entropía
                </span>
              </div>

              {/* Barra de progreso dinámica */}
              <div className="w-full h-1.5 bg-card-border/50 rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all duration-300 rounded-full ${passwordMetrics.barColor}`}
                  style={{ width: `${passwordMetrics.percent}%` }}
                />
              </div>

              <div className="flex items-center justify-between text-[11px] text-muted pt-0.5">
                <span>Tiempo estimado de fuerza bruta:</span>
                <strong className="text-foreground font-medium">{passwordMetrics.crackTime}</strong>
              </div>
            </div>
          </div>
        )}

        {/* PESTAÑA 3: TEXTOS / HASHES */}
        {activeTab === 'text-hash' && (
          <div className="space-y-3">
            <div>
              <label htmlFor="quick-text-input" className="block text-xs font-medium text-muted mb-1">
                Texto de entrada
              </label>
              <textarea
                id="quick-text-input"
                rows={2}
                value={textInput}
                onChange={handleTextChange}
                placeholder="Escribe o pega texto aquí..."
                className="w-full px-3 py-1.5 text-xs sm:text-sm font-mono bg-background border border-input-border rounded-md focus:border-accent outline-none text-foreground resize-none leading-relaxed"
              />
            </div>

            {/* Panel A: Base64 */}
            <div className="p-2.5 rounded-lg bg-card-subtle border border-card-border">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[11px] font-semibold text-muted uppercase tracking-wider">
                  Base64 (UTF-8)
                </span>
                <CopyButton text={base64Output} className="py-0.5 px-2 text-[11px]" />
              </div>
              <div className="font-mono text-xs text-foreground break-all select-all line-clamp-2 min-h-[1.25rem]">
                {base64Output || <span className="text-muted/60 italic">Sin datos</span>}
              </div>
            </div>

            {/* Panel B: SHA-256 */}
            <div className="p-2.5 rounded-lg bg-card-subtle border border-card-border">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[11px] font-semibold text-muted uppercase tracking-wider">
                  Hash SHA-256 (Web Crypto)
                </span>
                <CopyButton text={sha256Output} className="py-0.5 px-2 text-[11px]" />
              </div>
              <div className="font-mono text-xs text-foreground break-all select-all font-semibold min-h-[1.25rem]">
                {sha256Output || <span className="text-muted/60 italic">Calculando...</span>}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 3. Footer con garantía client-side y accesos directos */}
      <div className="pt-3 border-t border-card-border mt-3 flex items-center justify-between text-[11px] text-muted">
        <span>100% Client-Side · Sin servidor</span>

        <div className="flex items-center gap-2">
          {activeTab === 'subnets' && (
            <Link
              href="/herramientas/calculadora-subredes"
              className="font-semibold text-accent hover:underline inline-flex items-center gap-0.5"
            >
              <span>Calculadora completa</span>
              <span>→</span>
            </Link>
          )}

          {activeTab === 'passwords' && (
            <>
              <Link
                href="/herramientas/generador-contrasenas"
                className="font-semibold text-accent hover:underline"
              >
                Generador
              </Link>
              <span className="text-muted/40">·</span>
              <Link
                href="/herramientas/comprobador-contrasenas"
                className="font-semibold text-accent hover:underline"
              >
                Auditoría
              </Link>
            </>
          )}

          {activeTab === 'text-hash' && (
            <>
              <Link
                href="/herramientas/generador-hash"
                className="font-semibold text-accent hover:underline"
              >
                Hashes
              </Link>
              <span className="text-muted/40">·</span>
              <Link
                href="/herramientas/codificador-base64"
                className="font-semibold text-accent hover:underline"
              >
                Base64
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
