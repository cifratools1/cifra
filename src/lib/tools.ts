// Catálogo central de herramientas de Cifra
// Cada herramienta se define aquí y se reutiliza en navegación, homepage, sitemap y SEO

export interface Tool {
  slug: string;
  name: string;
  shortName: string;
  description: string;
  metaDescription: string;
  category: ToolCategory;
  keywords: string[];
  relatedSlugs: string[];
  technicalTag: string;
  taskHint: string;
  featured?: boolean;
}

export type ToolCategory = 
  | 'redes'
  | 'conversion'
  | 'seguridad'
  | 'texto'
  | 'desarrollo';

export type CategoryKey = ToolCategory;

export const CATEGORIES: Record<ToolCategory, { name: string; description: string; tag: string }> = {
  redes: {
    name: 'Redes e IP',
    description: 'Cálculo de subredes, máscaras, broadcast y direccionamiento IPv4 según RFCs oficiales.',
    tag: 'Networking',
  },
  conversion: {
    name: 'Conversión de datos',
    description: 'Transformaciones de base numérica, codificación binaria y equivalencias de almacenamiento.',
    tag: 'Arquitectura',
  },
  seguridad: {
    name: 'Seguridad y criptografía',
    description: 'Generación criptográfica CSPRNG, cálculo de entropía y funciones hash de integridad.',
    tag: 'Ciberseguridad',
  },
  texto: {
    name: 'Texto y contenido',
    description: 'Métricas de legibilidad, tokenización Unicode, límites de plataformas y transformaciones tipográficas.',
    tag: 'Procesamiento',
  },
  desarrollo: {
    name: 'Desarrollo web',
    description: 'Validación sintáctica de formatos, Percent-Encoding RFC 3986 y colorimetría WCAG 2.1.',
    tag: 'Ingeniería Web',
  },
};

export const TOOLS: Tool[] = [
  {
    slug: 'calculadora-subredes',
    name: 'Calculadora de Subredes IPv4',
    shortName: 'Subredes IPv4',
    description: 'Calcula rangos de red, máscara, broadcast, hosts disponibles y notación CIDR para cualquier dirección IPv4.',
    metaDescription: 'Calculadora de subredes IPv4 y CIDR online gratuita. Obtén máscara de red, rango de hosts, broadcast y wildcard al instante. 100% en tu navegador.',
    category: 'redes',
    keywords: ['calculadora subredes', 'subnet calculator', 'CIDR', 'máscara de red', 'IPv4', 'redes'],
    relatedSlugs: ['conversor-binario-decimal-hexadecimal', 'conversor-unidades-almacenamiento'],
    technicalTag: 'RFC 4632 / CIDR',
    taskHint: 'Segmentación y rangos de red IP',
    featured: true,
  },
  {
    slug: 'conversor-binario-decimal-hexadecimal',
    name: 'Conversor Binario, Decimal y Hexadecimal',
    shortName: 'Bin / Dec / Hex',
    description: 'Convierte números entre binario, decimal, octal y hexadecimal de forma instantánea con explicación paso a paso.',
    metaDescription: 'Conversor online entre binario, decimal, octal y hexadecimal. Resultado instantáneo paso a paso: lo que introduces se procesa en tu navegador.',
    category: 'conversion',
    keywords: ['binario a decimal', 'decimal a hexadecimal', 'conversor binario', 'binary converter', 'hex converter'],
    relatedSlugs: ['calculadora-subredes', 'codificador-base64'],
    technicalTag: 'BigInt / Precisión arbitraria',
    taskHint: 'Bases numéricas en tiempo real',
    featured: true,
  },
  {
    slug: 'generador-contrasenas',
    name: 'Generador de Contraseñas Seguras',
    shortName: 'Contraseñas',
    description: 'Genera contraseñas seguras y aleatorias con control total sobre longitud, caracteres y complejidad. Todo en tu navegador.',
    metaDescription: 'Generador de contraseñas seguras online. Personaliza longitud y caracteres. Se generan en tu navegador y no se envían a ningún servidor.',
    category: 'seguridad',
    keywords: ['generador contraseñas', 'password generator', 'contraseña segura', 'contraseña aleatoria'],
    relatedSlugs: ['comprobador-contrasenas', 'generador-hash', 'codificador-base64'],
    technicalTag: 'Web Crypto CSPRNG',
    taskHint: 'Entropía NIST SP 800-63B',
    featured: true,
  },
  {
    slug: 'comprobador-contrasenas',
    name: 'Comprobador de Fortaleza de Contraseñas',
    shortName: 'Fuerza Clave',
    description: 'Evalúa la robustez, entropía en bits y tiempo estimado de descifrado por fuerza bruta de cualquier contraseña en tiempo real.',
    metaDescription: 'Comprueba la fortaleza de tu contraseña online. Calcula entropía en bits y tiempo de descifrado: lo que escribes no se envía a ningún servidor.',
    category: 'seguridad',
    keywords: ['comprobador contraseñas', 'password strength checker', 'auditoría contraseña', 'fuerza contraseña', 'entropía contraseña', 'tiempo descifrado contraseña'],
    relatedSlugs: ['generador-contrasenas', 'generador-hash', 'codificador-base64'],
    technicalTag: 'Auditoría Entropía / NIST',
    taskHint: 'Evaluación de seguridad y resistencia a fuerza bruta',
    featured: true,
  },
  {
    slug: 'generador-hash',
    name: 'Generador de Hash (MD5, SHA-256)',
    shortName: 'Generador Hash',
    description: 'Genera hashes MD5, SHA-1, SHA-256 y SHA-512 de cualquier texto. Se procesa directamente en tu navegador.',
    metaDescription: 'Generador de hash online: MD5, SHA-1, SHA-256, SHA-512. Lo que escribes se procesa en tu navegador y no se envía a ningún servidor.',
    category: 'seguridad',
    keywords: ['generador hash', 'MD5 online', 'SHA-256 online', 'hash generator', 'checksum'],
    relatedSlugs: ['generador-contrasenas', 'comprobador-contrasenas'],
    technicalTag: 'FIPS 180-4 / RFC 1321',
    taskHint: 'Integridad y checksum de archivos',
    featured: true,
  },
  {
    slug: 'codificador-base64',
    name: 'Codificador y Decodificador Base64',
    shortName: 'Base64',
    description: 'Codifica y decodifica texto en Base64 al instante. Útil para API, tokens, emails y datos binarios.',
    metaDescription: 'Codificador y decodificador Base64 online. Convierte texto a Base64 y viceversa al instante: lo que escribes no se envía a ningún servidor.',
    category: 'conversion',
    keywords: ['base64 decode', 'base64 encode', 'codificador base64', 'decodificador base64'],
    relatedSlugs: ['codificador-url', 'generador-hash'],
    technicalTag: 'RFC 4648 / UTF-8',
    taskHint: 'Codificación MIME y URL-safe',
    featured: false,
  },
  {
    slug: 'formateador-json',
    name: 'Formateador y Validador JSON',
    shortName: 'JSON',
    description: 'Formatea, valida y minifica JSON con resaltado de sintaxis y detección de errores precisa.',
    metaDescription: 'Formateador y validador JSON online gratuito. Embellece, minifica y detecta errores en tu JSON. Procesamiento instantáneo en tu navegador.',
    category: 'desarrollo',
    keywords: ['formatear JSON', 'validar JSON', 'JSON formatter', 'JSON validator', 'JSON beautifier'],
    relatedSlugs: ['codificador-base64', 'codificador-url'],
    technicalTag: 'RFC 8259 / Diagnóstico AST',
    taskHint: 'Validación y minificación de datos',
    featured: true,
  },
  {
    slug: 'codificador-url',
    name: 'Codificador y Decodificador URL',
    shortName: 'URL Encode',
    description: 'Codifica y decodifica URLs y parámetros para uso seguro en navegadores, APIs y enlaces.',
    metaDescription: 'Codificador y decodificador de URLs online gratuito. Codifica caracteres especiales para parámetros web seguros. Resultado instantáneo.',
    category: 'desarrollo',
    keywords: ['URL encode', 'URL decode', 'codificar URL', 'decodificar URL', 'percent encoding'],
    relatedSlugs: ['codificador-base64', 'formateador-json'],
    technicalTag: 'RFC 3986 Percent-Encoding',
    taskHint: 'Parámetros HTTP y query strings',
    featured: false,
  },
  {
    slug: 'contador-caracteres',
    name: 'Contador de Caracteres y Palabras',
    shortName: 'Contador texto',
    description: 'Cuenta caracteres, palabras, frases, párrafos y tiempo de lectura de cualquier texto al instante.',
    metaDescription: 'Contador de caracteres y palabras online gratuito. Cuenta letras, palabras, frases y tiempo de lectura. Ideal para redes sociales, SEO y redacción.',
    category: 'texto',
    keywords: ['contador caracteres', 'contador palabras', 'word counter', 'character counter', 'contar palabras'],
    relatedSlugs: ['conversor-mayusculas-minusculas', 'formateador-json'],
    technicalTag: 'Tokenización Unicode',
    taskHint: 'Métricas de lectura y límites SEO',
    featured: false,
  },
  {
    slug: 'conversor-mayusculas-minusculas',
    name: 'Conversor de Mayúsculas y Minúsculas',
    shortName: 'MAYÚS / minús',
    description: 'Convierte texto a mayúsculas, minúsculas, capitalización, Title Case y más formatos al instante.',
    metaDescription: 'Conversor de mayúsculas y minúsculas online. Transforma texto a MAYÚSCULAS, minúsculas, Title Case y más en tu navegador sin enviar datos.',
    category: 'texto',
    keywords: ['mayúsculas a minúsculas', 'minúsculas a mayúsculas', 'text case converter', 'capitalizar texto'],
    relatedSlugs: ['contador-caracteres', 'codificador-url'],
    technicalTag: '10 transformaciones / Tildes',
    taskHint: 'Formateo tipográfico y casing',
    featured: false,
  },
  {
    slug: 'conversor-colores',
    name: 'Conversor de Colores (HEX, RGB, HSL)',
    shortName: 'Colores',
    description: 'Convierte colores entre HEX, RGB, HSL y visualiza paletas complementarias para diseño web.',
    metaDescription: 'Conversor de colores online gratuito: HEX a RGB, RGB a HSL y más. Visualiza el color en tiempo real con vista previa y paleta de contraste.',
    category: 'desarrollo',
    keywords: ['hex a rgb', 'rgb a hsl', 'conversor colores', 'color converter', 'color picker'],
    relatedSlugs: ['formateador-json', 'codificador-url'],
    technicalTag: 'W3C / Contraste WCAG 2.1',
    taskHint: 'Armonías y accesibilidad visual',
    featured: false,
  },
  {
    slug: 'conversor-unidades-almacenamiento',
    name: 'Conversor de Unidades de Almacenamiento',
    shortName: 'Almacenamiento',
    description: 'Convierte entre bytes, KB, MB, GB, TB y PB. Incluye sistema binario (KiB, MiB, GiB) y decimal.',
    metaDescription: 'Conversor de unidades de almacenamiento online. Bytes, KB, MB, GB, TB en sistemas binario y decimal. Resultado instantáneo y gratuito.',
    category: 'conversion',
    keywords: ['convertir MB a GB', 'bytes a megabytes', 'storage converter', 'unidades almacenamiento'],
    relatedSlugs: ['calculadora-subredes', 'conversor-binario-decimal-hexadecimal'],
    technicalTag: 'SI (Base 10) vs IEC (Base 2)',
    taskHint: 'Discrepancias de disco y RAM',
    featured: false,
  },
];

export function getToolBySlug(slug: string): Tool | undefined {
  return TOOLS.find(t => t.slug === slug);
}

export function getToolsByCategory(category: ToolCategory): Tool[] {
  return TOOLS.filter(t => t.category === category);
}

export function getRelatedTools(slug: string): Tool[] {
  const tool = getToolBySlug(slug);
  if (!tool) return [];
  return tool.relatedSlugs
    .map(s => getToolBySlug(s))
    .filter((t): t is Tool => t !== undefined);
}

export function getAllCategories(): ToolCategory[] {
  return Object.keys(CATEGORIES) as ToolCategory[];
}

export function getFeaturedTools(): Tool[] {
  return TOOLS.filter(t => t.featured);
}
