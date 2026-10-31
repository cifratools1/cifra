'use client';

import { useState, useMemo, useEffect } from 'react';
import { ResultCard, CopyButton } from '@/components/ToolComponents';
import { STORAGE_UNITS as UNITS, formatStorageNumber as formatNumber } from '@/lib/storage';

export default function StorageConverterClient() {
  const [inputValue, setInputValue] = useState<string>('1');
  const [selectedUnit, setSelectedUnit] = useState<string>('GB');

  // Leer parámetros de URL al montar en el cliente (evita desincronización de hidratación)
  useEffect(() => {
    const timer = setTimeout(() => {
      try {
        const params = new URLSearchParams(window.location.search);
        const qVal = params.get('val');
        const qUnit = params.get('unit');
        if (qVal) setInputValue(qVal);
        if (qUnit && UNITS.some((u) => u.id === qUnit)) setSelectedUnit(qUnit);
      } catch {
        // Ignore
      }
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  // Sincronizar URL
  useEffect(() => {
    try {
      if (typeof window !== 'undefined' && inputValue.trim()) {
        const url = new URL(window.location.href);
        url.searchParams.set('val', inputValue.trim());
        url.searchParams.set('unit', selectedUnit);
        window.history.replaceState({}, '', url.toString());
      }
    } catch {
      // Ignore
    }
  }, [inputValue, selectedUnit]);

  // Cálculo de bytes base
  const totalBytes = useMemo(() => {
    const val = parseFloat(inputValue);
    if (isNaN(val) || val < 0) return 0;
    const unit = UNITS.find((u) => u.id === selectedUnit);
    if (!unit) return 0;
    return val * unit.bytes;
  }, [inputValue, selectedUnit]);

  const getConvertedValue = (unitId: string): string => {
    const target = UNITS.find((u) => u.id === unitId);
    if (!target) return '0';
    const val = totalBytes / target.bytes;
    return formatNumber(val);
  };

  return (
    <div className="space-y-6">
      {/* Controles de entrada */}
      <div className="border border-card-border rounded-lg bg-card p-6 shadow-sm">
        <label className="block text-sm font-medium text-foreground mb-2">
          Cantidad y Unidad de Origen
        </label>
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="sm:col-span-2">
            <input
              type="number"
              min="0"
              step="any"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Introduce un valor..."
              className="w-full px-4 py-2.5 bg-background border border-card-border text-foreground font-mono focus:border-accent focus:outline-none transition-colors"
            />
          </div>
          <div>
            <select
              value={selectedUnit}
              onChange={(e) => setSelectedUnit(e.target.value)}
              className="w-full px-4 py-2.5 bg-background border border-card-border text-foreground focus:border-accent focus:outline-none transition-colors"
            >
              <optgroup label="Estándar Decimal (SI / Fabricantes)">
                <option value="B">Bytes (B)</option>
                <option value="KB">Kilobytes (KB - 1.000 B)</option>
                <option value="MB">Megabytes (MB - 10⁶ B)</option>
                <option value="GB">Gigabytes (GB - 10⁹ B)</option>
                <option value="TB">Terabytes (TB - 10¹² B)</option>
                <option value="PB">Petabytes (PB - 10¹⁵ B)</option>
              </optgroup>
              <optgroup label="Estándar Binario (IEC / Sistemas Operativos)">
                <option value="KiB">Kibibytes (KiB - 1.024 B)</option>
                <option value="MiB">Mebibytes (MiB - 1.024² B)</option>
                <option value="GiB">Gibibytes (GiB - 1.024³ B)</option>
                <option value="TiB">Tebibytes (TiB - 1.024⁴ B)</option>
                <option value="PiB">Pebibytes (PiB - 1.024⁵ B)</option>
              </optgroup>
              <optgroup label="Telecomunicaciones y Redes (Bits)">
                <option value="b">Bits (b)</option>
                <option value="kb_bit">Kilobits (Kb)</option>
                <option value="mb_bit">Megabits (Mb)</option>
                <option value="gb_bit">Gigabits (Gb)</option>
              </optgroup>
            </select>
          </div>
        </div>

        {/* Acceso rápido a valores comunes */}
        <div className="mt-4 flex flex-wrap items-center gap-2 text-xs text-muted">
          <span>Pruebas rápidas:</span>
          {[
            { label: '500 GB', val: '500', unit: 'GB' },
            { label: '1 TB', val: '1', unit: 'TB' },
            { label: '2 TB', val: '2', unit: 'TB' },
            { label: '4.7 GB (DVD)', val: '4.7', unit: 'GB' },
            { label: '64 GB (USB)', val: '64', unit: 'GB' },
          ].map((preset) => (
            <button
              key={preset.label}
              type="button"
              onClick={() => {
                setInputValue(preset.val);
                setSelectedUnit(preset.unit);
              }}
              className="px-2.5 py-1 rounded bg-background border border-card-border hover:border-accent text-foreground transition-colors"
            >
              {preset.label}
            </button>
          ))}
        </div>
      </div>

      {/* Caso práctico: La discrepancia de espacio en disco */}
      {selectedUnit === 'TB' || selectedUnit === 'GB' ? (
        <div className="border border-card-border rounded-lg bg-card p-4 border-l-4 border-l-accent">
          <h4 className="text-sm font-semibold text-foreground flex items-center gap-2">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-accent shrink-0" aria-hidden="true">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="16" x2="12" y2="12" />
              <line x1="12" y1="8" x2="12.01" y2="8" />
            </svg>
            <span>¿Por qué Windows muestra menos espacio?</span>
          </h4>
          <p className="mt-1 text-xs text-muted leading-relaxed">
            Un almacenamiento de{' '}
            <strong className="text-foreground">
              {inputValue} {selectedUnit}
            </strong>{' '}
            comercializado en base 10 equivale realmente a{' '}
            <strong className="text-foreground">
              {getConvertedValue(selectedUnit === 'TB' ? 'TiB' : 'GiB')}{' '}
              {selectedUnit === 'TB' ? 'GiB (TiB en IEC)' : 'GiB'}
            </strong>{' '}
            en Windows (que mide en bloques binarios de 1024 pero erróneamente los etiqueta como GB).
          </p>
        </div>
      ) : null}

      {/* Resultados agrupados */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Sistema Decimal */}
        <div className="border border-card-border rounded-lg bg-card p-5">
          <div className="flex items-center justify-between border-b border-card-border pb-3 mb-3">
            <h3 className="text-sm font-bold text-foreground">
              Sistema Decimal / Internacional (SI)
            </h3>
            <span className="text-xs bg-muted/10 text-muted px-2 py-0.5 rounded">
              Base 10 (1000ⁿ)
            </span>
          </div>
          <p className="text-xs text-muted mb-4">
            Utilizado por fabricantes de discos, memorias flash, SSDs y macOS.
          </p>
          <div className="space-y-3">
            {UNITS.filter((u) => u.system === 'decimal').map((unit) => {
              const val = getConvertedValue(unit.id);
              return (
                <div
                  key={unit.id}
                  className="flex items-center justify-between p-2.5 rounded bg-background border border-card-border"
                >
                  <div>
                    <span className="text-xs font-medium text-muted block">{unit.name}</span>
                    <span className="font-mono text-sm font-semibold text-foreground">
                      {val} {unit.symbol}
                    </span>
                  </div>
                  <CopyButton text={`${val} ${unit.symbol}`} label="Copiar" />
                </div>
              );
            })}
          </div>
        </div>

        {/* Sistema Binario */}
        <div className="border border-card-border rounded-lg bg-card p-5">
          <div className="flex items-center justify-between border-b border-card-border pb-3 mb-3">
            <h3 className="text-sm font-bold text-foreground">
              Sistema Binario / IEC (Sistemas Operativos)
            </h3>
            <span className="text-xs bg-muted/10 text-muted px-2 py-0.5 rounded">
              Base 2 (1024ⁿ)
            </span>
          </div>
          <p className="text-xs text-muted mb-4">
            Utilizado por la arquitectura de computadores, memoria RAM y Windows.
          </p>
          <div className="space-y-3">
            {UNITS.filter((u) => u.system === 'binary').map((unit) => {
              const val = getConvertedValue(unit.id);
              return (
                <div
                  key={unit.id}
                  className="flex items-center justify-between p-2.5 rounded bg-background border border-card-border"
                >
                  <div>
                    <span className="text-xs font-medium text-muted block">{unit.name}</span>
                    <span className="font-mono text-sm font-semibold text-foreground">
                      {val} {unit.symbol}
                    </span>
                  </div>
                  <CopyButton text={`${val} ${unit.symbol}`} label="Copiar" />
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Telecomunicaciones y transferencia de datos */}
      <ResultCard title="Equivalencia en Redes y Telecomunicaciones (Bits)">
        <p className="text-xs text-muted mb-3">
          Las conexiones de internet (ej. fibra 300 Mbps, 1 Gbps) miden velocidad en bits por
          segundo. 1 Byte = 8 bits.
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {UNITS.filter((u) => u.system === 'bits').map((unit) => {
            const val = getConvertedValue(unit.id);
            return (
              <div key={unit.id} className="p-3 bg-background border border-card-border rounded">
                <span className="text-xs text-muted block">{unit.name}</span>
                <span className="font-mono text-sm font-bold text-foreground block truncate">
                  {val} {unit.symbol}
                </span>
                <div className="mt-1">
                  <CopyButton text={`${val} ${unit.symbol}`} label="Copiar" />
                </div>
              </div>
            );
          })}
        </div>
      </ResultCard>
    </div>
  );
}
