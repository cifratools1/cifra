export interface Guide {
  slug: string;
  title: string;
  description: string;
  readTime: string;
  publishDate: string;
  category: string;
  relatedToolSlugs: string[];
}

export function formatDateSpanish(dateStr: string): string {
  try {
    const [year, month, day] = dateStr.split('-');
    if (!year || !month || !day) return dateStr;
    const months = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];
    const monthIdx = parseInt(month, 10) - 1;
    const mStr = months[monthIdx] || month;
    return `${parseInt(day, 10)} ${mStr} ${year}`;
  } catch {
    return dateStr;
  }
}

export const GUIDES: Guide[] = [
  {
    slug: 'como-calcular-subredes-ipv4-paso-a-paso',
    title: 'Cómo calcular subredes IPv4 paso a paso: Guía práctica con ejemplos',
    description:
      'Aprende a descomponer una red IPv4, calcular la máscara de subred, dirección de broadcast, número de hosts útiles y notación CIDR sin memorizar tablas infinitas.',
    readTime: '5 min de lectura', // 1.087 palabras reales
    publishDate: '2026-10-15',
    category: 'Redes y Telecomunicaciones',
    relatedToolSlugs: ['calculadora-subredes', 'conversor-binario-decimal-hexadecimal'],
  },
  {
    slug: 'guia-seguridad-contrasenas-entropia',
    title: 'Seguridad de contraseñas y entropía: Qué hace realmente inviolable una clave',
    description:
      'Análisis matemático de la fuerza de una contraseña: por qué 16 caracteres aleatorios superan a cualquier truco de sustitución y cómo medir los bits de entropía.',
    readTime: '6 min de lectura', // 1.235 palabras reales
    publishDate: '2026-10-18',
    category: 'Ciberseguridad',
    relatedToolSlugs: ['generador-contrasenas', 'generador-hash'],
  },
  {
    slug: 'diferencia-kb-kib-por-que-mi-disco-tiene-menos-espacio',
    title: '¿Por qué tu disco duro de 1 TB muestra 931 GB? La batalla entre decimal y binario',
    description:
      'La explicación técnica y legal sobre la diferencia entre Kilobytes (SI) y Kibibytes (IEC), y por qué los sistemas operativos reportan capacidades distintas.',
    readTime: '6 min de lectura', // 1.139 palabras reales
    publishDate: '2026-10-20',
    category: 'Hardware y Almacenamiento',
    relatedToolSlugs: ['conversor-unidades-almacenamiento', 'conversor-binario-decimal-hexadecimal'],
  },
  {
    slug: 'que-es-base64-para-que-sirve-y-cuando-usarlo',
    title: 'Qué es Base64, para qué sirve y cuándo usarlo: Guía con ejemplos prácticos',
    description:
      'Descubre cómo funciona la codificación Base64 (RFC 4648), por qué incrementa el tamaño un 33%, cuándo conviene utilizarla y por qué nunca debe confundirse con cifrado.',
    readTime: '6 min de lectura', // 1.120 palabras reales
    publishDate: '2026-10-21',
    category: 'Formatos y Datos Web',
    relatedToolSlugs: ['codificador-base64', 'conversor-binario-decimal-hexadecimal', 'codificador-url'],
  },
  {
    slug: 'diferencias-md5-sha1-sha256-sha512-guia-hashes',
    title: 'Diferencias entre MD5, SHA-1, SHA-256 y SHA-512: Guía de funciones hash',
    description:
      'Comprende qué es un hash criptográfico, cómo colapsaron MD5 y SHA-1 tras ataques de colisión reales y cuándo utilizar SHA-256 o SHA-512 en integridad y seguridad.',
    readTime: '6 min de lectura', // 1.236 palabras reales
    publishDate: '2026-10-21',
    category: 'Ciberseguridad y Criptografía',
    relatedToolSlugs: ['generador-hash', 'generador-contrasenas', 'conversor-binario-decimal-hexadecimal'],
  },
  {
    slug: 'colores-hex-rgb-hsl-contraste-accesibilidad-wcag',
    title: 'Colores HEX, RGB y HSL explicados: Modelos de color y contraste accesible WCAG',
    description:
      'Aprende cómo funcionan los códigos hexadecimales, el modelo RGB y el espacio HSL, cómo calcular el contraste de color y cómo cumplir con los estándares WCAG 2.1 AA y AAA.',
    readTime: '5 min de lectura', // 1.059 palabras reales
    publishDate: '2026-10-22',
    category: 'Diseño Web y Accesibilidad',
    relatedToolSlugs: ['conversor-colores', 'contador-caracteres', 'conversor-binario-decimal-hexadecimal'],
  },
  {
    slug: 'como-validar-depurar-json-errores-comunes',
    title: 'Cómo validar y depurar JSON: Errores comunes de sintaxis y buenas prácticas',
    description:
      'Guía completa para entender el estándar JSON (RFC 8259), resolver fallos de parseo habituales como comas colgantes o comillas simples y validar estructuras complejas con soltura.',
    readTime: '6 min de lectura', // 1.183 palabras reales
    publishDate: '2026-10-22',
    category: 'Desarrollo Web y APIs',
    relatedToolSlugs: ['formateador-json', 'codificador-url', 'codificador-base64'],
  },
];

export function getGuideBySlug(slug: string): Guide | undefined {
  return GUIDES.find((g) => g.slug === slug);
}
