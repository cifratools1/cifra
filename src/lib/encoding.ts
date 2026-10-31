// Funciones de codificación y decodificación para Base64 (con soporte UTF-8 completo) y URL

export function encodeBase64Utf8(text: string, isUrlSafe = false, lineBreak = 0): string {
  if (!text) return '';
  if (text.length > 5 * 1024 * 1024) {
    throw new Error('El texto supera los 5 MB. Para contenidos mayores, utiliza la opción de subir archivo.');
  }

  const encoder = new TextEncoder();
  const bytes = encoder.encode(text);
  let binary = '';
  const CHUNK_SIZE = 8192;
  for (let i = 0; i < bytes.length; i += CHUNK_SIZE) {
    binary += String.fromCharCode(...bytes.subarray(i, i + CHUNK_SIZE));
  }
  let base64 = btoa(binary);

  if (isUrlSafe) {
    base64 = base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  }

  if (lineBreak > 0) {
    const regex = new RegExp(`.{1,${lineBreak}}`, 'g');
    const chunks = base64.match(regex);
    return chunks ? chunks.join('\n') : base64;
  }

  return base64;
}

export function decodeBase64Utf8(b64: string): string {
  let clean = b64.trim();
  if (!clean) return '';

  if (clean.length > 7 * 1024 * 1024) {
    throw new Error('La cadena Base64 supera los 7 MB. Para contenidos mayores, utiliza la opción de subir archivo.');
  }

  // Quitar prefijo Data URI si existe
  if (clean.includes(',')) {
    clean = clean.split(',')[1] || clean;
  }

  // Quitar espacios y saltos de línea
  clean = clean.replace(/\s+/g, '');

  // Convertir caracteres URL-safe a Base64 estándar
  clean = clean.replace(/-/g, '+').replace(/_/g, '/');

  // Añadir relleno si falta
  while (clean.length % 4 !== 0) {
    clean += '=';
  }

  const validBase64Regex = /^[A-Za-z0-9+/]+={0,2}$/;
  if (!validBase64Regex.test(clean)) {
    throw new Error(
      'El texto contiene caracteres no válidos para Base64. Asegúrate de incluir solo letras (A-Z, a-z), números (0-9) y los símbolos +, / (o -, _ en URL-safe) con relleno =.'
    );
  }

  try {
    const binary = atob(clean);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i);
    }
    const decoder = new TextDecoder('utf-8', { fatal: false });
    return decoder.decode(bytes);
  } catch {
    throw new Error('No se pudo decodificar la cadena Base64. Formato o secuencia de bytes no válida.');
  }
}

export function encodeUrlString(
  text: string,
  scope: 'component' | 'full' = 'component',
  spaceFormat: 'percent' | 'plus' = 'percent'
): string {
  if (!text) return '';
  if (text.length > 5 * 1024 * 1024) {
    throw new Error('El texto supera los 5 MB.');
  }

  let result = scope === 'component' ? encodeURIComponent(text) : encodeURI(text);
  if (spaceFormat === 'plus') {
    result = result.replace(/%20/g, '+');
  }
  return result;
}

export function decodeUrlString(
  text: string,
  scope: 'component' | 'full' = 'component',
  decodePlusAsSpace = true
): string {
  if (!text) return '';
  let clean = text;
  if (decodePlusAsSpace) {
    clean = clean.replace(/\+/g, ' ');
  }
  return scope === 'component' ? decodeURIComponent(clean) : decodeURI(clean);
}
