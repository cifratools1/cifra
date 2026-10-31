/**
 * Algoritmo MD5 en TypeScript puro (compatible con RFC 1321)
 * Diseñado para ejecutarse 100% en el navegador (cliente) sin dependencias externas.
 * Soporta cadenas de texto UTF-8 y búferes binarios (Uint8Array / ArrayBuffer).
 */

const K = new Uint32Array([
  0xd76aa478, 0xe8c7b756, 0x242070db, 0xc1bdceee,
  0xf57c0faf, 0x4787c62a, 0xa8304613, 0xfd469501,
  0x698098d8, 0x8b44f7af, 0xffff5bb1, 0x895cd7be,
  0x6b901122, 0xfd987193, 0xa679438e, 0x49b40821,
  0xf61e2562, 0xc040b340, 0x265e5a51, 0xe9b6c7aa,
  0xd62f105d, 0x02441453, 0xd8a1e681, 0xe7d3fbc8,
  0x21e1cde6, 0xc33707d6, 0xf4d50d87, 0x455a14ed,
  0xa9e3e905, 0xfcefa3f8, 0x676f02d9, 0x8d2a4c8a,
  0xfffa3942, 0x8771f681, 0x6d9d6122, 0xfde5380c,
  0xa4beea44, 0x4bdecfa9, 0xf6bb4b60, 0xbebfbc70,
  0x289b7ec6, 0xeaa127fa, 0xd4ef3085, 0x04881d05,
  0xd9d4d039, 0xe6db99e5, 0x1fa27cf8, 0xc4ac5665,
  0xf4292244, 0x432aff97, 0xab9423a7, 0xfc93a039,
  0x655b59c3, 0x8f0ccc92, 0xffeff47d, 0x85845dd1,
  0x6fa87e4f, 0xfe2ce6e0, 0xa3014314, 0x4e0811a1,
  0xf7537e82, 0xbd3af235, 0x2ad7d2bb, 0xeb86d391
]);

const S = [
  7, 12, 17, 22,  7, 12, 17, 22,  7, 12, 17, 22,  7, 12, 17, 22,
  5,  9, 14, 20,  5,  9, 14, 20,  5,  9, 14, 20,  5,  9, 14, 20,
  4, 11, 16, 23,  4, 11, 16, 23,  4, 11, 16, 23,  4, 11, 16, 23,
  6, 10, 15, 21,  6, 10, 15, 21,  6, 10, 15, 21,  6, 10, 15, 21
];

function leftRotate(x: number, c: number): number {
  return ((x << c) | (x >>> (32 - c))) >>> 0;
}

export function md5(input: string | Uint8Array): string {
  const bytes = typeof input === 'string' ? new TextEncoder().encode(input) : input;
  const originalByteLength = bytes.length;

  // Longitud en bits expresada como BigInt de 64 bits para evitar desbordamiento
  const bitLength = BigInt(originalByteLength) * BigInt(8);

  // Relleno (padding): añadir 0x80 seguido de ceros hasta que longitud % 64 === 56
  const paddingLength = (56 - ((originalByteLength + 1) % 64) + 64) % 64;
  const totalLength = originalByteLength + 1 + paddingLength + 8;

  const padded = new Uint8Array(totalLength);
  padded.set(bytes, 0);
  padded[originalByteLength] = 0x80;

  // Añadir la longitud original en bits como entero de 64 bits little-endian al final
  const mask32 = BigInt('0xffffffff');
  const lowBits = Number(bitLength & mask32);
  const highBits = Number((bitLength >> BigInt(32)) & mask32);

  padded[totalLength - 8] = lowBits & 0xff;
  padded[totalLength - 7] = (lowBits >>> 8) & 0xff;
  padded[totalLength - 6] = (lowBits >>> 16) & 0xff;
  padded[totalLength - 5] = (lowBits >>> 24) & 0xff;

  padded[totalLength - 4] = highBits & 0xff;
  padded[totalLength - 3] = (highBits >>> 8) & 0xff;
  padded[totalLength - 2] = (highBits >>> 16) & 0xff;
  padded[totalLength - 1] = (highBits >>> 24) & 0xff;

  // Valores de inicialización de los registros de 32 bits
  let a = 0x67452301;
  let b = 0xefcdab89;
  let c = 0x98badcfe;
  let d = 0x10325476;

  // Procesar bloques de 64 bytes (512 bits)
  const view = new DataView(padded.buffer, padded.byteOffset, padded.byteLength);
  const M = new Uint32Array(16);

  for (let offset = 0; offset < totalLength; offset += 64) {
    for (let i = 0; i < 16; i++) {
      M[i] = view.getUint32(offset + i * 4, true); // true = little-endian
    }

    let A = a;
    let B = b;
    let C = c;
    let D = d;

    for (let i = 0; i < 64; i++) {
      let F: number;
      let g: number;

      if (i < 16) {
        F = (B & C) | (~B & D);
        g = i;
      } else if (i < 32) {
        F = (D & B) | (~D & C);
        g = (5 * i + 1) % 16;
      } else if (i < 48) {
        F = B ^ C ^ D;
        g = (3 * i + 5) % 16;
      } else {
        F = C ^ (B | ~D);
        g = (7 * i) % 16;
      }

      const temp = D;
      D = C;
      C = B;
      const sum = (A + F + K[i] + M[g]) >>> 0;
      B = (B + leftRotate(sum, S[i])) >>> 0;
      A = temp;
    }

    a = (a + A) >>> 0;
    b = (b + B) >>> 0;
    c = (c + C) >>> 0;
    d = (d + D) >>> 0;
  }

  // Convertir cada registro a 4 bytes en formato hexadecimal little-endian
  function wordToHex(val: number): string {
    let hex = '';
    for (let i = 0; i < 4; i++) {
      const byte = (val >>> (i * 8)) & 0xff;
      hex += byte.toString(16).padStart(2, '0');
    }
    return hex;
  }

  return wordToHex(a) + wordToHex(b) + wordToHex(c) + wordToHex(d);
}
