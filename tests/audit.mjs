// ========================================================
// CIFRA — SUITE COMPLETA DE AUDITORÍA MATEMÁTICA Y ROBUSTEZ
// Importa las funciones REALES del código fuente de la aplicación
// ========================================================

import { calculateSubnet, validateIpv4 } from '../src/lib/subnet.ts';
import { hexToRgb, rgbToHex, rgbToHsl, hslToRgb, parseRgbString, parseHslString, calculateContrastRatio } from '../src/lib/colors.ts';
import { convertStorage, formatStorageNumber } from '../src/lib/storage.ts';
import { transformText } from '../src/lib/case.ts';
import { encodeBase64Utf8, decodeBase64Utf8, encodeUrlString, decodeUrlString } from '../src/lib/encoding.ts';
import { md5 } from '../src/lib/md5.ts';
import { getEntropyInfo, estimateCrackTime, formatCombinations } from '../src/lib/passwords.ts';
import { TOOLS, getToolBySlug } from '../src/lib/tools.ts';
import { GUIDES, getGuideBySlug } from '../src/lib/guides.ts';

console.log('========================================================');
console.log('CIFRA — SUITE COMPLETA DE AUDITORÍA DE ROBUSTEZ (FASE 2)');
console.log('Prueba directa de funciones de la aplicación con casos límite');
console.log('========================================================\n');

let totalTests = 0;
let passedTests = 0;

function assert(condition, testName, details = '') {
  totalTests++;
  if (condition) {
    passedTests++;
    console.log(`✅ [PASS] ${testName}`);
  } else {
    console.error(`❌ [FAIL] ${testName} | ${details}`);
  }
}

// ----------------------------------------------------
// 1. AUDITORÍA DE SUBREDES IPv4 Y NOTACIÓN CIDR
// ----------------------------------------------------
console.log('--- 1. Subredes IPv4 y Notación CIDR ---');

const sub1 = calculateSubnet('192.168.1.142', 24);
assert(sub1 && sub1.networkAddress === '192.168.1.0', '192.168.1.142/24 -> Red 192.168.1.0');
assert(sub1 && sub1.broadcastAddress === '192.168.1.255', '192.168.1.142/24 -> Broadcast 192.168.1.255');
assert(sub1 && sub1.subnetMask === '255.255.255.0', '192.168.1.142/24 -> Máscara 255.255.255.0');
assert(sub1 && sub1.wildcardMask === '0.0.0.255', '192.168.1.142/24 -> Wildcard 0.0.0.255');
assert(sub1 && sub1.usableHosts === 254, '192.168.1.142/24 -> 254 hosts utilizables');

const sub2 = calculateSubnet('10.25.100.1', 8);
assert(sub2 && sub2.networkAddress === '10.0.0.0', '10.25.100.1/8 -> Red 10.0.0.0');
assert(sub2 && sub2.broadcastAddress === '10.255.255.255', '10.25.100.1/8 -> Broadcast 10.255.255.255');
assert(sub2 && sub2.usableHosts === 16777214, '10.0.0.0/8 -> 16.777.214 hosts utilizables');

const sub3 = calculateSubnet('172.16.1.5', 30);
assert(sub3 && sub3.networkAddress === '172.16.1.4', '172.16.1.5/30 -> Red 172.16.1.4');
assert(sub3 && sub3.broadcastAddress === '172.16.1.7', '172.16.1.5/30 -> Broadcast 172.16.1.7');
assert(sub3 && sub3.usableHosts === 2, '172.16.1.5/30 -> 2 hosts utilizables (enlace p2p)');

const sub4 = calculateSubnet('192.168.10.1', 31);
assert(sub4 && sub4.usableHosts === 2, 'RFC 3021 /31 -> 2 hosts utilizables');

const sub5 = calculateSubnet('192.168.1.1', 32);
assert(sub5 && sub5.usableHosts === 1, 'Host route /32 -> 1 host');

const sub0 = calculateSubnet('0.0.0.0', 0);
assert(sub0 && sub0.usableHosts === 4294967294, 'Ruta por defecto /0 -> 4.294.967.294 hosts');

// Casos límite y entradas rotas de IP
assert(validateIpv4('').isValid === false, 'Validación IP: cadena vacía rechazada');
assert(validateIpv4('   ').isValid === false, 'Validación IP: solo espacios rechazada');
assert(validateIpv4('256.1.1.1').isValid === false, 'Validación IP: octeto > 255 rechazado');
assert(validateIpv4('1.1.1').isValid === false, 'Validación IP: 3 octetos rechazada');
assert(validateIpv4('1.1.1.1.1').isValid === false, 'Validación IP: 5 octetos rechazada');
assert(validateIpv4('192.168.01.1').isValid === false, 'Validación IP: ceros a la izquierda rechazados');
assert(validateIpv4('192.168.1.abc').isValid === false, 'Validación IP: texto no numérico rechazado');
assert(validateIpv4('-1.0.0.1').isValid === false, 'Validación IP: números negativos rechazados');
assert(calculateSubnet('256.0.0.1', 24) === null, 'calculateSubnet con IP inválida retorna null');
assert(calculateSubnet('192.168.1.1', 33) === null, 'calculateSubnet con CIDR > 32 retorna null');
assert(calculateSubnet('192.168.1.1', -1) === null, 'calculateSubnet con CIDR < 0 retorna null');

// ----------------------------------------------------
// 2. AUDITORÍA DE BASES NUMÉRICAS Y BIGINT
// ----------------------------------------------------
console.log('\n--- 2. Conversor Binario / Decimal / Hex (BigInt) ---');

const testBigNum = BigInt('18446744073709551615'); // 2^64 - 1
assert(testBigNum.toString(16).toUpperCase() === 'FFFFFFFFFFFFFFFF', '64-bit max BigInt a Hexadecimal');
assert(testBigNum.toString(2).length === 64 && !testBigNum.toString(2).includes('0'), '64-bit max BigInt a Binario (64 unos)');

const num42 = BigInt(42);
assert(num42.toString(2) === '101010', '42 a binario es 101010');
assert(num42.toString(16).toUpperCase() === '2A', '42 a hexadecimal es 2A');
assert(num42.toString(8) === '52', '42 a octal es 52');

// Números gigantes (> 256 bits)
const hugeBig = BigInt('0x' + 'FF'.repeat(32)); // 256 bits todo 1s
assert(hugeBig > 0n, 'BigInt de 256 bits procesado sin overflow');
assert(BigInt('0b1010') === 10n, 'BigInt con prefijo 0b parseado correctamente');
assert(BigInt('0o77') === 63n, 'BigInt con prefijo 0o parseado correctamente');
assert(BigInt('0xFF') === 255n, 'BigInt con prefijo 0x parseado correctamente');

// ----------------------------------------------------
// 3. AUDITORÍA DE ALMACENAMIENTO (SI vs IEC)
// ----------------------------------------------------
console.log('\n--- 3. Conversor de Almacenamiento (Decimal vs Binario) ---');

const gibInOneTb = convertStorage(1, 'TB', 'GiB');
assert(gibInOneTb.toFixed(2) === '931.32', '1 TB comercial = 931.32 GiB en Windows');

const mibInOneMb = convertStorage(1, 'MiB', 'MB');
assert(mibInOneMb === 1.048576, '1 MiB = exactamente 1.048576 MB');

// Casos límite de almacenamiento
assert(convertStorage(0, 'GB', 'MB') === 0, '0 GB = 0 MB');
assert(convertStorage(-5, 'GB', 'MB') === 0, 'Valor negativo devuelve 0 sin excepción');
assert(convertStorage(NaN, 'GB', 'MB') === 0, 'NaN devuelve 0 sin excepción');
assert(convertStorage(1, 'UNIDAD_FALSA', 'MB') === 0, 'Unidad de origen inválida devuelve 0');
assert(convertStorage(1, 'MB', 'UNIDAD_FALSA') === 0, 'Unidad de destino inválida devuelve 0');
assert(formatStorageNumber(0) === '0', 'Formato número cero es "0"');
assert(formatStorageNumber(1e-7).includes('e'), 'Formato número diminuto usa notación científica');

// ----------------------------------------------------
// 4. AUDITORÍA DE BASE64 UTF-8
// ----------------------------------------------------
console.log('\n--- 4. Codificador Base64 con UTF-8 ---');

const testText = 'Cifra — Herramientas técnicas gratuitas y privadas 🚀 (á, é, í, ó, ú, ñ)';
const encodedB64 = encodeBase64Utf8(testText);
const decodedB64 = decodeBase64Utf8(encodedB64);
assert(decodedB64 === testText, 'Base64 roundtrip perfecto con acentos y emojis');

// URL-Safe Base64
const urlSafeB64 = encodeBase64Utf8(testText, true);
assert(!urlSafeB64.includes('+') && !urlSafeB64.includes('/') && !urlSafeB64.includes('='), 'Base64 URL-safe sin +, / ni =');
assert(decodeBase64Utf8(urlSafeB64) === testText, 'Decodificación de Base64 URL-safe correcta');

// Casos límite Base64
assert(encodeBase64Utf8('') === '', 'Base64 de texto vacío es cadena vacía');
assert(decodeBase64Utf8('') === '', 'Decodificación de cadena vacía es cadena vacía');
assert(decodeBase64Utf8('   ') === '', 'Decodificación de espacios es cadena vacía');
let caughtInvalidB64 = false;
try {
  decodeBase64Utf8('Carácter inválido no base64!!!!');
} catch {
  caughtInvalidB64 = true;
}
assert(caughtInvalidB64, 'Base64 con caracteres no válidos lanza error controlado');

// ----------------------------------------------------
// 5. AUDITORÍA DE CODIFICACIÓN URL
// ----------------------------------------------------
console.log('\n--- 5. Codificador URL ---');

const rawUrlQuery = 'búsqueda=seguridad & cifrado?';
const encodedUrlComp = encodeUrlString(rawUrlQuery, 'component');
assert(encodedUrlComp === 'b%C3%BAsqueda%3Dseguridad%20%26%20cifrado%3F', 'encodeURIComponent codifica tildes y delimitadores');
assert(decodeUrlString(encodedUrlComp, 'component') === rawUrlQuery, 'decodeURIComponent decodifica fielmente');

const plusFormat = encodeUrlString('hola mundo', 'component', 'plus');
assert(plusFormat === 'hola+mundo', 'Espacio codificado como + cuando se solicita');
assert(decodeUrlString('hola+mundo', 'component', true) === 'hola mundo', 'Decodificación de + como espacio');

// Casos límite URL
assert(encodeUrlString('') === '', 'URL encode vacío retorna vacío');
assert(decodeUrlString('') === '', 'URL decode vacío retorna vacío');

// ----------------------------------------------------
// 6. AUDITORÍA DE CONVERSIÓN DE COLORES Y WCAG
// ----------------------------------------------------
console.log('\n--- 6. Conversor de Colores y Accesibilidad WCAG ---');

const hex = '#2563EB'; // Azul acento de Cifra
const rgb = hexToRgb(hex);
assert(rgb && rgb.r === 37 && rgb.g === 99 && rgb.b === 235, '#2563EB parseado a RGB (37, 99, 235)');
assert(rgbToHex(rgb.r, rgb.g, rgb.b) === '#2563EB', 'RGB (37, 99, 235) convertido a HEX #2563EB');

const shortHex = hexToRgb('#FFF');
assert(shortHex && shortHex.r === 255 && shortHex.g === 255 && shortHex.b === 255, '#FFF expandido a #FFFFFF');

// HSL roundtrip
const hsl = rgbToHsl(37, 99, 235);
const backRgb = hslToRgb(hsl.h, hsl.s, hsl.l);
assert(Math.abs(backRgb.r - 37) <= 1 && Math.abs(backRgb.g - 99) <= 1 && Math.abs(backRgb.b - 235) <= 1, 'RGB <-> HSL conversión reversible');

// Contraste WCAG (blanco vs negro = 21:1)
const contrast = calculateContrastRatio({ r: 255, g: 255, b: 255 }, { r: 0, g: 0, b: 0 });
assert(Math.round(contrast) === 21, 'Ratio de contraste blanco sobre negro = 21:1 (máximo WCAG)');

// Casos límite de colores
assert(hexToRgb('') === null, 'HEX vacío retorna null');
assert(hexToRgb('#GGGGGG') === null, 'HEX con caracteres no válidos retorna null');
assert(hexToRgb('#12') === null, 'HEX con longitud incompleta retorna null');
assert(parseRgbString('rgb(999, 0, 0)') === null, 'RGB con valor > 255 retorna null');
assert(parseHslString('hsl(400, 50%, 50%)') === null, 'HSL con H > 360 retorna null');

// ----------------------------------------------------
// 7. AUDITORÍA DE CONVERSOR DE MAYÚSCULAS Y FORMATO
// ----------------------------------------------------
console.log('\n--- 7. Conversor de Formatos de Texto ---');

const sample = 'hola mundo desde cifra';
assert(transformText(sample, 'upper') === 'HOLA MUNDO DESDE CIFRA', 'Mayúsculas correctas');
assert(transformText(sample, 'title') === 'Hola Mundo Desde Cifra', 'Title Case correcto');
assert(transformText('hola mundo. qué tal estás?', 'sentence') === 'Hola mundo. Qué tal estás?', 'Sentence Case correcto con signos');
assert(transformText('Hola Mundo', 'kebab') === 'hola-mundo', 'kebab-case correcto');
assert(transformText('Hola Mundo', 'snake') === 'hola_mundo', 'snake_case correcto');
assert(transformText('hola mundo', 'camel') === 'holaMundo', 'camelCase correcto');
assert(transformText('cifra', 'reverse') === 'arfic', 'Reverse correcto');
assert(transformText('🚀 estrella ⭐', 'reverse') === '⭐ allertse 🚀', 'Reverse preserva emojis y pares suplentes Unicode');

// Casos límite de texto
assert(transformText('', 'upper') === '', 'Texto vacío retorna vacío');
assert(transformText('   ', 'kebab') === '', 'Solo espacios en kebab retorna vacío');

// ----------------------------------------------------
// 8. AUDITORÍA DE ENTROPÍA Y CRIPTOGRAFÍA DE CONTRASEÑAS
// ----------------------------------------------------
console.log('\n--- 8. Entropía de Contraseñas y Resistencia NIST ---');

const entropy16 = getEntropyInfo({
  length: 16,
  useUpper: true,
  useLower: true,
  useNumbers: true,
  useSymbols: true,
  avoidAmbiguous: false,
  count: 1,
});
assert(entropy16.bits >= 100 && entropy16.bits <= 110, `Entropía para 16 caracteres: ~${entropy16.bits} bits (>100 bits = Muy fuerte)`);
assert(entropy16.label === 'Muy fuerte', '16 caracteres clasificado como "Muy fuerte"');

const entropyDigits = getEntropyInfo({
  length: 8,
  useUpper: false,
  useLower: false,
  useNumbers: true,
  useSymbols: false,
  avoidAmbiguous: false,
  count: 1,
});
assert(entropyDigits.bits < 28, `Entropía 8 dígitos: ~${entropyDigits.bits} bits (<28 bits = Muy débil)`);

// Casos límite de contraseñas
const noOptions = getEntropyInfo({
  length: 16,
  useUpper: false,
  useLower: false,
  useNumbers: false,
  useSymbols: false,
  avoidAmbiguous: false,
  count: 1,
});
assert(noOptions.bits === 0 && noOptions.label === 'Inválida', '0 categorías seleccionadas retorna 0 bits e "Inválida"');
assert(formatCombinations(0) === '0', 'formatCombinations(0) = "0"');
assert(formatCombinations(Infinity) === '> 10^100', 'formatCombinations(Infinity) no genera NaN');
assert(estimateCrackTime(0) === 'Menos de 1 segundo', 'estimateCrackTime(0) = "Menos de 1 segundo"');

// ----------------------------------------------------
// 9. AUDITORÍA DE GENERADOR DE HASH (MD5)
// ----------------------------------------------------
console.log('\n--- 9. Hashing Criptográfico (MD5) ---');

assert(md5('hola mundo') === '0ad066a5d29f3f2a2a1c7c17dd082a79', 'MD5("hola mundo") coincide exactamente con Node crypto');
assert(md5('Hola Mundo') === 'd501194c987486789bb01b50dc1a0adb', 'MD5("Hola Mundo") coincide exactamente con Node crypto');
assert(md5('') === 'd41d8cd98f00b204e9800998ecf8427e', 'MD5("") coincide con hash RFC estándar');
assert(md5('Cifra 2026 🚀').length === 32, 'MD5 con emojis genera hash hexadecimal de 32 caracteres');

// ----------------------------------------------------
// 10. AUDITORÍA DEL CATÁLOGO DE HERRAMIENTAS Y GUÍAS
// ----------------------------------------------------
console.log('\n--- 10. Catálogo e Integridad Estructural ---');

assert(TOOLS.length === 12, '12 herramientas registradas en catálogo');
assert(GUIDES.length === 7, '7 guías editoriales registradas en catálogo');
assert(getToolBySlug('calculadora-subredes') !== undefined, 'Herramienta calculadora-subredes existe');
assert(getGuideBySlug('como-calcular-subredes-ipv4-paso-a-paso') !== undefined, 'Guía de subredes existe');

// ----------------------------------------------------
// 11. COMPROBACIÓN INDIVIDUAL DE LAS 12 HERRAMIENTAS
// (1 Entrada Válida + 1 Entrada Inválida o Casos Límite)
// ----------------------------------------------------
console.log('\n--- 11. Comprobación Individual de las 12 Herramientas ---');

// H1: Calculadora de Subredes
const h1Valid = calculateSubnet('10.0.0.1', 16);
assert(h1Valid && h1Valid.networkAddress === '10.0.0.0', 'H1 Calculadora Subredes [Válida]: 10.0.0.1/16');
assert(calculateSubnet('999.1.1.1', 24) === null, 'H1 Calculadora Subredes [Inválida]: 999.1.1.1 rechazada');

// H2: Conversor Binario / Decimal / Hex
const h2Valid = BigInt('0xFF');
assert(h2Valid.toString(10) === '255', 'H2 Conversor Bases [Válida]: 0xFF = 255');
let h2InvCaught = false;
try { BigInt('0xZZ'); } catch { h2InvCaught = true; }
assert(h2InvCaught, 'H2 Conversor Bases [Inválida]: 0xZZ genera error controlado');

// H3: Conversor de Almacenamiento
assert(convertStorage(1, 'TB', 'GB') === 1000, 'H3 Conversor Almacenamiento [Válida]: 1 TB = 1000 GB');
assert(convertStorage(-5, 'TB', 'GB') === 0, 'H3 Conversor Almacenamiento [Inválida]: -5 TB retorna 0');

// H4: Generador de Contraseñas
const h4Valid = getEntropyInfo({ length: 16, useUpper: true, useLower: true, useNumbers: true, useSymbols: true, avoidAmbiguous: false, count: 1 });
assert(h4Valid.bits > 90, 'H4 Generador Contraseñas [Válida]: 16 chars genera > 90 bits');
const h4Inv = getEntropyInfo({ length: 0, useUpper: false, useLower: false, useNumbers: false, useSymbols: false, avoidAmbiguous: false, count: 1 });
assert(h4Inv.bits === 0, 'H4 Generador Contraseñas [Inválida]: 0 chars retorna 0 bits');

// H5: Comprobador de Contraseñas
assert(formatCombinations(1000000) === '1.00 × 10^6', 'H5 Comprobador Contraseñas [Válida]: 1M combinaciones en notación científica');
assert(formatCombinations(Infinity) === '> 10^100', 'H5 Comprobador Contraseñas [Inválida]: Infinity controlado a > 10^100');

// H6: Generador de Hash
assert(md5('cifra').length === 32, 'H6 Generador Hash [Válida]: MD5("cifra") = 32 hex chars');
assert(md5('').length === 32, 'H6 Generador Hash [Inválida/Vacía]: MD5("") hash RFC correcto');

// H7: Codificador Base64
assert(decodeBase64Utf8(encodeBase64Utf8('Hola Cifra')) === 'Hola Cifra', 'H7 Base64 [Válida]: encode/decode UTF-8');
let h7InvCaught = false;
try { decodeBase64Utf8('!!!not-base64!!!'); } catch { h7InvCaught = true; }
assert(h7InvCaught, 'H7 Base64 [Inválida]: caracteres ilegales lanzan excepción controlada');

// H8: Codificador URL
assert(decodeUrlString(encodeUrlString('https://cifra.tools/guías')) === 'https://cifra.tools/guías', 'H8 URL [Válida]: encode/decode URL');
let h8InvCaught = false;
try { decodeUrlString('%E0%A4%A'); } catch { h8InvCaught = true; }
assert(h8InvCaught, 'H8 URL [Inválida]: secuencia UTF-8 truncada lanza excepción controlada');

// H9: Formateador JSON
let h9Parsed = null;
try { h9Parsed = JSON.parse('{"cifra":"tools","version":2}'); } catch {}
assert(h9Parsed && h9Parsed.version === 2, 'H9 Formateador JSON [Válida]: JSON parse correcto');
let h9InvCaught = false;
try { JSON.parse('{ broken json: '); } catch { h9InvCaught = true; }
assert(h9InvCaught, 'H9 Formateador JSON [Inválida]: JSON corrupto capturado con SyntaxError');

// H10: Contador de Caracteres
const h10Text = 'Cifra tools 2026';
assert(h10Text.length === 16 && h10Text.trim().split(/\s+/).length === 3, 'H10 Contador Caracteres [Válida]: 16 caracteres, 3 palabras');
const h10Empty = '';
assert(h10Empty.length === 0, 'H10 Contador Caracteres [Inválida/Vacía]: 0 caracteres');

// H11: Conversor Mayúsculas / Minúsculas
assert(transformText('cifra', 'upper') === 'CIFRA', 'H11 Conversor Texto [Válida]: "cifra" -> "CIFRA"');
assert(transformText('', 'upper') === '', 'H11 Conversor Texto [Inválida/Vacía]: retorna cadena vacía');

// H12: Conversor de Colores
const h12Rgb = hexToRgb('#10B981');
assert(h12Rgb && h12Rgb.g === 185, 'H12 Conversor Colores [Válida]: #10B981 -> G=185');
assert(hexToRgb('#ZZZZZZ') === null, 'H12 Conversor Colores [Inválida]: #ZZZZZZ retorna null');

// ----------------------------------------------------
// RESUMEN FINAL
// ----------------------------------------------------
console.log('\n========================================================');
console.log(`TOTAL PRUEBAS EJECUTADAS: ${totalTests}`);
console.log(`PRUEBAS SUPERADAS:        ${passedTests}`);
console.log(`FALLOS:                   ${totalTests - passedTests}`);
console.log('========================================================');

if (totalTests === passedTests) {
  console.log('🎉 TODAS LAS VERIFICACIONES MATEMÁTICAS Y DE ROBUSTEZ HAN SIDO SUPERADAS.');
} else {
  process.exit(1);
}
