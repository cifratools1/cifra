// Funciones criptográficas, generador de contraseñas, análisis de entropía y resistencia NIST

export interface PasswordGeneratorOptions {
  length: number;
  useUpper: boolean;
  useLower: boolean;
  useNumbers: boolean;
  useSymbols: boolean;
  avoidAmbiguous: boolean;
  count: number;
}

export const CHAR_SETS = {
  lower: 'abcdefghijklmnopqrstuvwxyz',
  lowerNoAmbiguous: 'abcdefghijkmnpqrstuvwxyz', // sin 'l', 'o'
  upper: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
  upperNoAmbiguous: 'ABCDEFGHJKLMNPQRSTUVWXYZ', // sin 'I', 'O'
  numbers: '0123456789',
  numbersNoAmbiguous: '23456789', // sin '0', '1'
  symbols: '!@#$%^&*()_+-=[]{}|;:,.<>?~',
  symbolsNoAmbiguous: '!@#$%^&*()_+-=[]{};:,.<>?~', // sin '|'
};

export function getSecureRandomInt(max: number): number {
  if (max <= 1) return 0;
  const array = new Uint32Array(1);
  const maxUint = 0x100000000;
  const limit = maxUint - (maxUint % max);
  let rand: number;
  do {
    if (typeof globalThis !== 'undefined' && globalThis.crypto) {
      globalThis.crypto.getRandomValues(array);
    }
    rand = array[0];
  } while (rand >= limit);
  return rand % max;
}

export function secureShuffle<T>(arr: T[]): T[] {
  const result = [...arr];
  for (let i = result.length - 1; i > 0; i--) {
    const j = getSecureRandomInt(i + 1);
    const temp = result[i];
    result[i] = result[j];
    result[j] = temp;
  }
  return result;
}

export function generateSinglePassword(options: PasswordGeneratorOptions): string {
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

export function estimateCrackTime(entropyBits: number): string {
  if (entropyBits < 30) return 'Menos de 1 segundo';
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

export function getEntropyInfo(options: PasswordGeneratorOptions) {
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
      textColor: 'text-danger',
      bgColor: 'bg-danger',
      percent: Math.min(25, Math.round((bits / 40) * 25)),
      crackTime,
      description: 'Vulnerable a ataques de diccionario y fuerza bruta en milisegundos.',
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
      description: 'Riesgo moderado. Aumenta la longitud o activa más conjuntos de caracteres.',
    };
  }
  if (bits < 80) {
    return {
      bits,
      poolSize,
      label: 'Aceptable',
      textColor: 'text-accent',
      bgColor: 'bg-accent',
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

export function formatCombinations(comb: number): string {
  if (comb === 0) return '0';
  if (!isFinite(comb) || comb > 1e100) return '> 10^100';
  if (comb < 1e6) return comb.toLocaleString('es-ES');
  const exp = Math.floor(Math.log10(comb));
  const base = (comb / Math.pow(10, exp)).toFixed(2);
  return `${base} × 10^${exp}`;
}
