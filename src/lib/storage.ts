// Definiciones y funciones de conversión de almacenamiento digital (SI Decimal vs IEC Binario)

export interface UnitDef {
  id: string;
  name: string;
  symbol: string;
  bytes: number; // Factor multiplicador respecto a 1 Byte
  system: 'decimal' | 'binary' | 'bits';
}

export const STORAGE_UNITS: UnitDef[] = [
  // Bits
  { id: 'b', name: 'Bit', symbol: 'b', bytes: 0.125, system: 'bits' },
  { id: 'kb_bit', name: 'Kilobit', symbol: 'Kb', bytes: 125, system: 'bits' },
  { id: 'mb_bit', name: 'Megabit', symbol: 'Mb', bytes: 125000, system: 'bits' },
  { id: 'gb_bit', name: 'Gigabit', symbol: 'Gb', bytes: 125000000, system: 'bits' },

  // Decimal (SI - Base 10)
  { id: 'B', name: 'Byte', symbol: 'B', bytes: 1, system: 'decimal' },
  { id: 'KB', name: 'Kilobyte (SI)', symbol: 'KB', bytes: 1000, system: 'decimal' },
  { id: 'MB', name: 'Megabyte (SI)', symbol: 'MB', bytes: 1e6, system: 'decimal' },
  { id: 'GB', name: 'Gigabyte (SI)', symbol: 'GB', bytes: 1e9, system: 'decimal' },
  { id: 'TB', name: 'Terabyte (SI)', symbol: 'TB', bytes: 1e12, system: 'decimal' },
  { id: 'PB', name: 'Petabyte (SI)', symbol: 'PB', bytes: 1e15, system: 'decimal' },

  // Binario (IEC - Base 2)
  { id: 'KiB', name: 'Kibibyte (IEC)', symbol: 'KiB', bytes: 1024, system: 'binary' },
  { id: 'MiB', name: 'Mebibyte (IEC)', symbol: 'MiB', bytes: 1024 ** 2, system: 'binary' },
  { id: 'GiB', name: 'Gibibyte (IEC)', symbol: 'GiB', bytes: 1024 ** 3, system: 'binary' },
  { id: 'TiB', name: 'Tebibyte (IEC)', symbol: 'TiB', bytes: 1024 ** 4, system: 'binary' },
  { id: 'PiB', name: 'Pebibyte (IEC)', symbol: 'PiB', bytes: 1024 ** 5, system: 'binary' },
];

export function convertStorage(val: number, sourceUnitId: string, targetUnitId: string): number {
  if (isNaN(val) || val < 0) return 0;
  const source = STORAGE_UNITS.find(u => u.id === sourceUnitId);
  const target = STORAGE_UNITS.find(u => u.id === targetUnitId);
  if (!source || !target) return 0;
  const totalBytes = val * source.bytes;
  return totalBytes / target.bytes;
}

export function formatStorageNumber(num: number): string {
  if (num === 0) return '0';
  if (num < 0.000001) return num.toExponential(4);
  if (num >= 1e12) return num.toLocaleString('es-ES', { maximumFractionDigits: 4 });
  return num.toLocaleString('es-ES', { maximumFractionDigits: 6 });
}
