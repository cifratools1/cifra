import type { Metadata } from 'next';
import { ToolLayout } from '@/components/ToolComponents';
import { getRelatedTools } from '@/lib/tools';
import Base64Tool from './Base64Tool';

export const metadata: Metadata = {
  title: 'Codificador y Decodificador Base64 Online',
  description:
    'Codifica y decodifica texto y archivos en Base64 al instante. Soporta codificación UTF-8 completa y formato URL-safe: lo que introduces se procesa en tu navegador.',
  keywords: [
    'base64 decode',
    'base64 encode',
    'codificador base64',
    'decodificador base64',
    'base64 utf8',
    'base64 url safe',
    'convertir a base64',
    'base64 online gratis',
  ],
  alternates: {
    canonical: 'https://cifra.tools/herramientas/codificador-base64',
  },
  openGraph: {
    title: 'Codificador y Decodificador Base64 Online | Cifra',
    description:
      'Herramienta gratuita para codificar y decodificar texto en Base64 con soporte UTF-8 y modo URL-safe. Se procesa en tu navegador sin enviar datos.',
    url: 'https://cifra.tools/herramientas/codificador-base64',
    type: 'website',
  },
};

const FAQ_ITEMS = [
  {
    question: '¿Es Base64 un método de cifrado seguro para proteger datos?',
    answer:
      'No. Base64 es un esquema de codificación de datos, no un cifrado criptográfico. No oculta ni protege la información contra accesos no autorizados, ya que cualquier persona o sistema puede revertir la codificación inmediatamente. Si necesitas confidencialidad, debes emplear algoritmos de cifrado como AES o RSA antes de codificar en Base64.',
  },
  {
    question: '¿Por qué el texto codificado en Base64 ocupa un 33% más de espacio?',
    answer:
      'Base64 toma grupos de 3 bytes (24 bits) de información de entrada y los divide en 4 bloques de 6 bits cada uno. Cada bloque de 6 bits representa un carácter ASCII visible de su alfabeto. Esto significa que por cada 3 bytes originales se generan 4 bytes codificados, lo que equivale a un incremento exacto del 33.3% en el tamaño de los datos.',
  },
  {
    question: '¿Cómo gestiona esta herramienta los caracteres especiales, acentos y emojis?',
    answer:
      'La herramienta utiliza la API nativa TextEncoder y TextDecoder con codificación UTF-8 antes de la conversión a Base64. De este modo, caracteres del español (como tildes, la letra ñ, signos de apertura ¿ y ¡) y caracteres multilingües o emojis complejos se procesan con total fidelidad sin generar errores ni caracteres extraños.',
  },
  {
    question: '¿Qué significa el carácter igual (=) al final de una cadena Base64?',
    answer:
      'El signo de igualdad (=) se denomina "padding" o relleno. Base64 procesa bloques de 3 bytes. Si la cantidad total de bytes del mensaje original no es múltiplo de 3, se añade uno o dos caracteres "=" al final para completar la longitud reglamentaria de 4 caracteres en el bloque final.',
  },
  {
    question: '¿Qué diferencia hay entre Base64 estándar y Base64 URL-safe?',
    answer:
      'El estándar Base64 (RFC 4648) incluye los caracteres "+" y "/". Sin embargo, en URLs y nombres de archivo estos caracteres tienen significado reservado (+ representa un espacio y / separa rutas). La variante URL-safe sustituye "+" por "-" y "/" por "_", además de prescindir habitualmente del relleno "=", facilitando su inserción en tokens JWT y cadenas de consulta.',
  },
];

export default function CodificadorBase64Page() {
  const relatedTools = getRelatedTools('codificador-base64');

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'Codificador y Decodificador Base64 Online',
    applicationCategory: 'DeveloperApplication',
    operatingSystem: 'Any',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
    description:
      'Herramienta gratuita para codificar y decodificar texto en Base64 con soporte para UTF-8 y formato URL-safe.',
  };

  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: FAQ_ITEMS.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  };

  const educationalContent = (
    <div className="space-y-8 text-foreground text-sm leading-relaxed">
      <div>
        <h2 className="text-xl font-bold tracking-tight text-foreground mb-3">
          ¿Qué es la codificación Base64 y para qué sirve?
        </h2>
        <p className="text-muted">
          <strong>Base64</strong> es un esquema de codificación binario a texto diseñado para
          representar secuencias arbitrarias de bytes en un formato legible compuesto exclusivamente
          por caracteres imprimibles del estándar ASCII.
        </p>
        <p className="mt-3 text-muted">
          Históricamente surgió para permitir la transmisión segura de datos binarios (como imágenes,
          documentos o firmas criptográficas) a través de canales de red concebidos exclusivamente
          para texto de 7 u 8 bits, como el correo electrónico (MIME RFC 2045) o las cabeceras del
          protocolo HTTP.
        </p>
      </div>

      <div className="border border-card-border rounded-lg bg-card p-5">
        <h3 className="text-base font-semibold text-foreground mb-3">
          ¿Cómo funciona el algoritmo Base64 paso a paso?
        </h3>
        <p className="text-muted mb-4">
          El principio matemático de Base64 se basa en reorganizar paquetes de bits de orden 8 en
          paquetes de orden 6:
        </p>
        <ol className="list-decimal pl-5 space-y-2 text-muted">
          <li>
            <strong>Lectura en bloques de 3 bytes:</strong> Cada byte de entrada contiene 8 bits, por
            lo que 3 bytes suman 24 bits (3 × 8 = 24).
          </li>
          <li>
            <strong>División en 4 grupos de 6 bits:</strong> Los 24 bits continuos se dividen en 4
            bloques de 6 bits cada uno (4 × 6 = 24).
          </li>
          <li>
            <strong>Mapeo al alfabeto Base64:</strong> Un número de 6 bits puede tener valores entre 0
            y 63 (2⁶ = 64 posibles valores). Cada número se asigna directamente a un carácter de la
            tabla estándar.
          </li>
          <li>
            <strong>Relleno (Padding):</strong> Si al final quedan solo 2 bytes por codificar, se
            generan 3 caracteres Base64 y se añade un <code className="font-mono text-accent">=</code>.
            Si queda solo 1 byte, se generan 2 caracteres y se añaden dos signos{' '}
            <code className="font-mono text-accent">==</code>.
          </li>
        </ol>
      </div>

      <div>
        <h3 className="text-base font-semibold text-foreground mb-3">
          El alfabeto estándar de 64 caracteres (RFC 4648)
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 font-mono text-xs">
          <div className="p-3 border border-card-border rounded-lg bg-card">
            <span className="text-accent font-semibold block mb-1">Índices 0 al 25:</span>
            <span className="text-foreground">A - Z (Letras mayúsculas)</span>
          </div>
          <div className="p-3 border border-card-border rounded-lg bg-card">
            <span className="text-accent font-semibold block mb-1">Índices 26 al 51:</span>
            <span className="text-foreground">a - z (Letras minúsculas)</span>
          </div>
          <div className="p-3 border border-card-border rounded-lg bg-card">
            <span className="text-accent font-semibold block mb-1">Índices 52 al 61:</span>
            <span className="text-foreground">0 - 9 (Dígitos numéricos)</span>
          </div>
          <div className="p-3 border border-card-border rounded-lg bg-card">
            <span className="text-accent font-semibold block mb-1">Índices 62 y 63:</span>
            <span className="text-foreground">+ y / (Estándar) o - y _ (URL-safe)</span>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-base font-semibold text-foreground mb-3">
          Principales casos de uso en desarrollo web y sistemas
        </h3>
        <ul className="space-y-2 text-muted list-disc pl-5">
          <li>
            <strong>Data URIs en CSS y HTML:</strong> Permite incrustar pequeñas imágenes SVG, PNG o
            fuentes directamente en el código (<code className="font-mono text-xs">data:image/png;base64,...</code>)
            evitando peticiones HTTP adicionales.
          </li>
          <li>
            <strong>Tokens JSON Web Tokens (JWT):</strong> El encabezado y el cuerpo de los tokens
            JWT se codifican en Base64 URL-safe para ser transportados de forma segura en cabeceras HTTP o cookies.
          </li>
          <li>
            <strong>Autenticación HTTP Basic:</strong> La cabecera{' '}
            <code className="font-mono text-xs">Authorization: Basic &lt;base64&gt;</code> envía las
            credenciales en formato <code className="font-mono text-xs">usuario:clave</code> codificadas en Base64.
          </li>
          <li>
            <strong>Firmas y certificados criptográficos:</strong> Claves públicas y certificados X.509
            (archivos PEM o CRT) se almacenan protegidos bajo delimitadores de texto en Base64.
          </li>
        </ul>
      </div>

      <div className="p-4 rounded-lg bg-amber-500/10 border border-amber-500/30 text-xs text-foreground">
        <strong className="text-amber-600 dark:text-amber-400 font-semibold block mb-1">
          Recordatorio de seguridad esencial:
        </strong>
        Base64 <strong>no cifra</strong> ni proporciona seguridad por sí mismo. Toda persona que
        tenga acceso a una cadena Base64 puede reconstruir su contenido original de inmediato con
        cualquier navegador o terminal. Nunca utilices Base64 como sustituto del cifrado para
        almacenar contraseñas o datos personales sensibles.
      </div>
    </div>
  );

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c') }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd).replace(/</g, '\\u003c') }}
      />
      <ToolLayout
        title="Codificador y Decodificador Base64"
        description="Convierte texto o archivos a Base64 y viceversa en tiempo real con compatibilidad total UTF-8 y modo URL-safe. Lo que introduces se procesa en tu navegador."
        educationalContent={educationalContent}
        faq={FAQ_ITEMS}
        relatedTools={relatedTools}
      >
        <Base64Tool />
      </ToolLayout>
    </>
  );
}
