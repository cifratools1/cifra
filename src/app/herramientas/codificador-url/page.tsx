import type { Metadata } from 'next';
import { ToolLayout } from '@/components/ToolComponents';
import { getRelatedTools } from '@/lib/tools';
import UrlTool from './UrlTool';

export const metadata: Metadata = {
  title: 'Codificador y Decodificador URL (URL Encode & Decode) Online',
  description:
    'Codifica y decodifica URLs y parámetros web al instante. Soporta encodeURI, encodeURIComponent, desglose detallado de caracteres y formato RFC 3986. 100% en tu navegador.',
  keywords: [
    'url encode',
    'url decode',
    'codificador url',
    'decodificador url',
    'percent encoding',
    'encodeuricomponent online',
    'encodeuri online',
    'escapar url',
    'codificar parametros url',
  ],
  alternates: {
    canonical: 'https://cifra.tools/herramientas/codificador-url',
  },
  openGraph: {
    title: 'Codificador y Decodificador URL Online | Cifra',
    description:
      'Convierte URLs y parámetros con codificación por porcentaje (Percent-Encoding) de forma segura y visual. Lo que introduces no se envía a ningún servidor.',
    url: 'https://cifra.tools/herramientas/codificador-url',
    type: 'website',
  },
};

const FAQ_ITEMS = [
  {
    question: '¿Cuál es la diferencia entre encodeURI y encodeURIComponent?',
    answer:
      'encodeURI está diseñado para codificar una URL completa; preserva los caracteres con significado sintáctico en la estructura de la dirección (como ://, /, ?, #, &, =, @) y solo codifica espacios y caracteres no permitidos. En contraste, encodeURIComponent está diseñado para valores individuales de parámetros de consulta (query parameters) o fragmentos; codifica prácticamente todos los caracteres especiales, incluyendo barras y signos de interrogación, para evitar que alteren la estructura de la URL contenedora.',
  },
  {
    question: '¿Por qué los espacios a veces se codifican como %20 y otras como el signo más (+)?',
    answer:
      'El estándar oficial para identificadores uniformes de recursos (RFC 3986) define que el espacio debe codificarse en porcentaje como %20. Sin embargo, en el estándar de formularios HTML (application/x-www-form-urlencoded), históricamente se adoptó el signo más (+) para reemplazar los espacios en las cadenas de consulta de las peticiones GET/POST. Ambas formas son comunes, aunque %20 es la más rigurosa y compatible en URLs generales.',
  },
  {
    question: '¿Qué es el problema de la "doble codificación" (Double Encoding)?',
    answer:
      'La doble codificación ocurre cuando una cadena previamente codificada se vuelve a codificar por error. Por ejemplo, un espacio codificado como "%20" pasa a ser "%2520" (ya que el signo "%" se codifica como "%25"). Esto provoca errores 404 o fallos de interpretación en servidores y APIs. Para evitarlo, solo debes codificar los valores de los parámetros una única vez antes de ensamblar la URL final.',
  },
  {
    question: '¿Es seguro pasar contraseñas o tokens confidenciales en la URL si están codificados?',
    answer:
      'No. La codificación URL (Percent-Encoding) no es cifrado ni anonimización; es simplemente un mecanismo de escape de caracteres para cumplir la sintaxis web. Además, las URLs completas quedan registradas en el historial del navegador, en registros de servidores web (access logs), cabeceras Referer y proxies intermedios. Los datos sensibles siempre deben enviarse en el cuerpo de peticiones HTTPS cifradas (POST, PUT) o en cabeceras HTTP de autorización.',
  },
];

export default function CodificadorUrlPage() {
  const relatedTools = getRelatedTools('codificador-url');

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'Codificador y Decodificador URL Online',
    applicationCategory: 'DeveloperApplication',
    operatingSystem: 'Any',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
    description:
      'Herramienta gratuita para codificar y decodificar URLs y parámetros con soporte para encodeURI y encodeURIComponent.',
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
          ¿Qué es la codificación de URLs (Percent-Encoding)?
        </h2>
        <p className="text-muted">
          La <strong>codificación por porcentaje</strong> (en inglés, <em>percent-encoding</em> o{' '}
          <em>URL encoding</em>) es el mecanismo estandarizado por la especificación{' '}
          <strong>RFC 3986</strong> para representar cualquier carácter o byte dentro de un URI
          (Identificador Uniforme de Recursos) empleando únicamente el subconjunto de caracteres
          ASCII universalmente seguro.
        </p>
        <p className="mt-3 text-muted">
          Cuando un carácter no está permitido en una URL (por ejemplo un espacio, una tilde o un
          carácter reservado como <code className="font-mono text-xs">?</code> o{' '}
          <code className="font-mono text-xs">&</code>), se sustituye por el símbolo de porcentaje{' '}
          <code className="font-mono text-accent">%</code> seguido de dos dígitos hexadecimales que
          representan el valor numérico del byte en codificación UTF-8. Por ejemplo, el espacio
          (byte 0x20) se convierte en <code className="font-mono text-accent">%20</code>.
        </p>
      </div>

      <div className="border border-card-border rounded-lg bg-card p-5">
        <h3 className="text-base font-semibold text-foreground mb-3">
          Comparativa técnica: encodeURI vs encodeURIComponent
        </h3>
        <p className="text-muted mb-4">
          Uno de los errores más frecuentes en el desarrollo web con JavaScript es utilizar la
          función incorrecta para codificar direcciones:
        </p>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-card-border text-foreground">
                <th className="py-2.5 pr-4 font-semibold">Característica</th>
                <th className="py-2.5 px-4 font-semibold text-accent">encodeURI()</th>
                <th className="py-2.5 pl-4 font-semibold text-accent">encodeURIComponent()</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-card-border text-muted">
              <tr>
                <td className="py-2.5 pr-4 font-medium text-foreground">Objetivo principal</td>
                <td className="py-2.5 px-4">Codificar una URL completa y válida.</td>
                <td className="py-2.5 pl-4">Codificar el valor de un parámetro o fragmento.</td>
              </tr>
              <tr>
                <td className="py-2.5 pr-4 font-medium text-foreground">¿Codifica : / ? & = # ?</td>
                <td className="py-2.5 px-4 text-emerald-600 dark:text-emerald-400 font-semibold">
                  NO (los conserva para la sintaxis)
                </td>
                <td className="py-2.5 pl-4 text-amber-600 dark:text-amber-400 font-semibold">
                  SÍ (los convierte a %3A, %2F, %3F, etc.)
                </td>
              </tr>
              <tr>
                <td className="py-2.5 pr-4 font-medium text-foreground">Ejemplo de uso ideal</td>
                <td className="py-2.5 px-4 font-mono text-[11px]">
                  https://sitio.com/guía sobre redes.html
                </td>
                <td className="py-2.5 pl-4 font-mono text-[11px]">
                  ?busqueda=redes & wifi?&seccion=1
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div>
        <h3 className="text-base font-semibold text-foreground mb-3">
          Clasificación de caracteres según la norma RFC 3986
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-4 rounded-lg border border-card-border bg-card">
            <h4 className="font-semibold text-sm text-foreground mb-2 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-accent"></span>
              Caracteres no reservados (Unreserved)
            </h4>
            <p className="text-xs text-muted mb-2">
              Nunca requieren codificación y pueden usarse con total libertad en cualquier punto de
              la URL:
            </p>
            <p className="font-mono text-xs text-foreground bg-code-bg p-2 rounded">
              A-Z, a-z, 0-9, guion (-), guion bajo (_), punto (.) y virgulilla (~)
            </p>
          </div>

          <div className="p-4 rounded-lg border border-card-border bg-card">
            <h4 className="font-semibold text-sm text-foreground mb-2 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-amber-500"></span>
              Caracteres reservados (Reserved)
            </h4>
            <p className="text-xs text-muted mb-2">
              Tienen un propósito delimitador dentro de la jerarquía de la URL. Si forman parte del
              contenido de un valor, <strong>deben</strong> codificarse:
            </p>
            <p className="font-mono text-xs text-foreground bg-code-bg p-2 rounded">
              : / ? # [ ] @ ! $ & &apos; ( ) * + , ; =
            </p>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-base font-semibold text-foreground mb-3">
          Buenas prácticas para desarrolladores web
        </h3>
        <ul className="space-y-2 text-muted list-disc pl-5">
          <li>
            <strong>Construcción modular de URLs:</strong> Al trabajar con JavaScript moderno o
            frameworks como Next.js, utiliza el objeto nativo{' '}
            <code className="font-mono text-xs">URL</code> y{' '}
            <code className="font-mono text-xs">URLSearchParams</code>. Estos gestionan la
            codificación automáticamente de acuerdo con el estándar sin necesidad de llamadas
            manuales a <code className="font-mono text-xs">encodeURIComponent</code>.
          </li>
          <li>
            <strong>Prevenir la doble codificación:</strong> Nunca apliques funciones de codificación
            sobre una URL que ya ha sido codificada previamente por otra capa de la aplicación o el
            cliente HTTP.
          </li>
          <li>
            <strong>Decodificación simétrica:</strong> Si un formulario o servicio reemplaza espacios
            por el signo más (<code className="font-mono text-xs">+</code>), recuerda reemplazarlo por
            espacios antes de invocar <code className="font-mono text-xs">decodeURIComponent</code> en
            el backend.
          </li>
        </ul>
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
        title="Codificador y Decodificador URL"
        description="Codifica y decodifica parámetros y direcciones web al instante. Soporta encodeURI, encodeURIComponent y desglose visual de caracteres según RFC 3986."
        educationalContent={educationalContent}
        faq={FAQ_ITEMS}
        relatedTools={relatedTools}
      >
        <UrlTool />
      </ToolLayout>
    </>
  );
}
