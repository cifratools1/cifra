import type { Metadata } from 'next';
import Link from 'next/link';
import TableOfContents from '@/components/TableOfContents';
import { getGuideBySlug, formatDateSpanish } from '@/lib/guides';
import { getToolBySlug } from '@/lib/tools';

const SLUG = 'como-calcular-subredes-ipv4-paso-a-paso';

export function generateMetadata(): Metadata {
  const guide = getGuideBySlug(SLUG);
  if (!guide) return {};

  return {
    title: guide.title,
    description: guide.description,
    alternates: {
      canonical: `https://cifra.tools/guias/${SLUG}`,
    },
    openGraph: {
      title: guide.title,
      description: guide.description,
      type: 'article',
      publishedTime: guide.publishDate,
    },
  };
}

export default function SubnetGuidePage() {
  const guide = getGuideBySlug(SLUG)!;
  const subnetTool = getToolBySlug('calculadora-subredes')!;
  const converterTool = getToolBySlug('conversor-binario-decimal-hexadecimal')!;

  const faqItems = [
    {
      question: '¿Por qué se restan 2 direcciones a la capacidad total de una subred?',
      answer:
        'En subredes estándar (/24 a /30), la primera dirección (con todos los bits de host en 0) identifica a la red en las tablas de enrutamiento, y la última (bits de host en 1) se reserva para difusión o broadcast. Por ello, la capacidad de equipos útiles es siempre 2^(32 - n) - 2.',
    },
    {
      question: '¿Qué es una subred /31 y cuándo se utiliza?',
      answer:
        'El estándar RFC 3021 permite utilizar prefijos /31 en enlaces punto a punto entre routers. Al existir solo dos extremos y no requerir difusión local, ambas direcciones se asignan a las interfaces sin desperdiciar identificadores de red ni de broadcast.',
    },
    {
      question: '¿Cómo se calcula la máscara comodín (wildcard)?',
      answer:
        'La máscara wildcard es el complemento inverso de la máscara de subred. Se obtiene restando cada octeto a 255 (255.255.255.255 - máscara). Para un prefijo /27 (255.255.255.224), la wildcard resultante es 0.0.0.31, utilizada en listas ACL y OSPF.',
    },
    {
      question: '¿Qué ventaja ofrece VLSM frente al subnetting tradicional?',
      answer:
        'VLSM (máscaras de subred de longitud variable) permite segmentar un mismo bloque IP con prefijos de diferente tamaño (/26, /27, /30) según la necesidad de cada departamento, evitando el desperdicio de direcciones que provoca el subnetting de longitud fija (FLSM).',
    },
  ];

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Article',
        '@id': `https://cifra.tools/guias/${SLUG}#article`,
        headline: guide.title,
        description: guide.description,
        datePublished: guide.publishDate,
        dateModified: guide.publishDate,
        author: {
          '@type': 'Organization',
          name: 'Equipo Técnico Cifra',
          url: 'https://cifra.tools',
        },
        publisher: {
          '@type': 'Organization',
          name: 'Cifra',
          url: 'https://cifra.tools',
        },
        mainEntityOfPage: `https://cifra.tools/guias/${SLUG}`,
      },
      {
        '@type': 'FAQPage',
        '@id': `https://cifra.tools/guias/${SLUG}#faq`,
        mainEntity: faqItems.map((item) => ({
          '@type': 'Question',
          name: item.question,
          acceptedAnswer: {
            '@type': 'Answer',
            text: item.answer,
          },
        })),
      },
    ],
  };

  return (
    <main className="flex-1">
      <article className="mx-auto max-w-3xl px-4 py-12">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c') }}
        />

        <header className="mb-8 border-b border-card-border pb-6">
          <div className="flex items-center gap-2 text-xs text-muted mb-3">
            <Link href="/guias" className="hover:text-accent transition-colors">
              Guías
            </Link>
            <span>/</span>
            <span>{guide.category}</span>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
            {guide.title}
          </h1>
          <div className="mt-4 flex flex-wrap items-center gap-3 text-xs text-muted">
            <span>{guide.readTime}</span>
            <span>•</span>
            <time dateTime={guide.publishDate}>{formatDateSpanish(guide.publishDate)}</time>
            <span>•</span>
            <span>Estándares IETF RFC 791, RFC 4632 y RFC 3021</span>
          </div>
        </header>

        {/* Banner interactivo hacia la herramienta principal */}
        <div className="mb-8 p-4 rounded-lg bg-card border border-accent/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h4 className="text-sm font-bold text-foreground">¿Prefieres calcular una subred al instante?</h4>
            <p className="text-xs text-muted">
              Usa nuestra herramienta interactiva para obtener rangos, broadcast, wildcard y binario sin esperas.
            </p>
          </div>
          <Link
            href={`/herramientas/${subnetTool.slug}`}
            className="px-4 py-2 text-xs font-semibold rounded bg-accent text-white hover:bg-accent-hover transition-colors whitespace-nowrap"
          >
            Abrir Calculadora de Subredes
          </Link>
        </div>

        {/* Cuerpo del artículo */}
        <TableOfContents />

        <div className="max-w-[68ch] space-y-6 text-base sm:text-lg text-slate-700 dark:text-slate-300 leading-relaxed font-sans">
          <p>
            El cálculo y segmentación de subredes (<strong>subnetting</strong>) constituye uno de los pilares
            fundamentales de la ingeniería de redes y la preparación de certificaciones como Cisco CCNA o CompTIA
            Network+. En lugar de memorizar tablas estáticas, dominar la aritmética binaria elemental permite
            determinar cualquier rango de red, máscara y dirección de broadcast con exactitud matemática.
          </p>

          <h2 className="text-xl font-bold text-foreground mt-8 mb-3">
            1. Fundamentos del direccionamiento IPv4 (RFC 791)
          </h2>
          <p>
            Toda dirección IPv4 consta de <strong>32 bits</strong> agrupados en 4 octetos de 8 bits cada uno,
            representados en decimal del 0 al 255. La dirección requiere forzosamente una{' '}
            <strong>máscara de subred</strong>, que delimita qué porción identifica a la red (unos consecutivos)
            y qué porción identifica a los equipos o hosts (ceros consecutivos).
          </p>
          <div className="p-3 bg-muted/10 font-mono text-xs rounded border border-card-border overflow-x-auto">
            IP: 192 . 168 . 10 . 130 11000000 . 10101000 . 00001010 . 10000010
            <br />
            Máscara (/26): 255.255.255.192 11111111 . 11111111 . 11111111 . 11000000
            <br />
            Operación AND: 192.168.10.128 11000000 . 10101000 . 00001010 . 10000000
          </div>
          <p>
            Los routers determinan la red ejecutando a nivel de hardware una operación lógica booleana <strong>AND</strong>{' '}
            entre los 32 bits de la IP y los 32 bits de la máscara. Donde hay un 1 en la máscara, el bit de la IP se conserva;
            donde hay un 0, el bit se fuerza a 0. Esto permite a los circuitos de conmutación tomar decisiones de reenvío
            en nanosegundos sin procesar divisiones decimales complejas.
          </p>

          <h2 className="text-xl font-bold text-foreground mt-8 mb-3">
            2. Notación CIDR: El prefijo de red (RFC 4632)
          </h2>
          <p>
            Con la adopción de CIDR (<em>Classless Inter-Domain Routing</em>), la división histórica en Clases A,
            B y C quedó obsoleta. Hoy la máscara se define mediante el prefijo <code>/n</code>, que especifica el
            número de bits encendidos a 1.
          </p>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse border border-card-border text-xs">
              <thead>
                <tr className="bg-muted/10 text-foreground">
                  <th className="p-2 border border-card-border font-semibold">Prefijo</th>
                  <th className="p-2 border border-card-border font-semibold">Máscara Decimal</th>
                  <th className="p-2 border border-card-border font-semibold">Bits Host</th>
                  <th className="p-2 border border-card-border font-semibold">Salto (Bloque)</th>
                  <th className="p-2 border border-card-border font-semibold">Hosts Útiles</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="p-2 border border-card-border font-mono">/24</td>
                  <td className="p-2 border border-card-border font-mono">255.255.255.0</td>
                  <td className="p-2 border border-card-border font-mono">8</td>
                  <td className="p-2 border border-card-border font-mono">256</td>
                  <td className="p-2 border border-card-border font-mono">254</td>
                </tr>
                <tr>
                  <td className="p-2 border border-card-border font-mono">/26</td>
                  <td className="p-2 border border-card-border font-mono">255.255.255.192</td>
                  <td className="p-2 border border-card-border font-mono">6</td>
                  <td className="p-2 border border-card-border font-mono">64</td>
                  <td className="p-2 border border-card-border font-mono">62</td>
                </tr>
                <tr>
                  <td className="p-2 border border-card-border font-mono">/27</td>
                  <td className="p-2 border border-card-border font-mono">255.255.255.224</td>
                  <td className="p-2 border border-card-border font-mono">5</td>
                  <td className="p-2 border border-card-border font-mono">32</td>
                  <td className="p-2 border border-card-border font-mono">30</td>
                </tr>
                <tr>
                  <td className="p-2 border border-card-border font-mono">/28</td>
                  <td className="p-2 border border-card-border font-mono">255.255.255.240</td>
                  <td className="p-2 border border-card-border font-mono">4</td>
                  <td className="p-2 border border-card-border font-mono">16</td>
                  <td className="p-2 border border-card-border font-mono">14</td>
                </tr>
                <tr>
                  <td className="p-2 border border-card-border font-mono">/30</td>
                  <td className="p-2 border border-card-border font-mono">255.255.255.252</td>
                  <td className="p-2 border border-card-border font-mono">2</td>
                  <td className="p-2 border border-card-border font-mono">4</td>
                  <td className="p-2 border border-card-border font-mono">2</td>
                </tr>
              </tbody>
            </table>
          </div>

          <h2 className="text-xl font-bold text-foreground mt-8 mb-3">
            3. Fórmulas matemáticas: Salto y hosts útiles
          </h2>
          <p>
            Cualquier parámetro de una subred se obtiene directamente a partir del prefijo CIDR ($n$):
          </p>
          <ul className="list-disc pl-5 space-y-1 text-muted">
            <li><strong>Bits de host:</strong> 32 - n.</li>
            <li><strong>Tamaño de bloque (salto):</strong> 2^(32 - n).</li>
            <li><strong>Hosts útiles:</strong> 2^(32 - n) - 2 (se descuenta la red y el broadcast).</li>
            <li><strong>Máscara comodín (Wildcard):</strong> 255.255.255.255 - Máscara.</li>
          </ul>

          <h2 className="text-xl font-bold text-foreground mt-8 mb-3">
            4. Ejemplos prácticos resueltos paso a paso
          </h2>

          <div className="space-y-3 border border-card-border p-4 rounded-lg bg-card">
            <h3 className="font-bold text-foreground text-sm">
              Ejemplo 1: Análisis completo de 172.16.45.195/27
            </h3>
            <ol className="list-decimal pl-5 text-xs text-muted space-y-1.5">
              <li>
                <strong>Bits de host:</strong> $32 - 27 = 5$ bits.
              </li>
              <li>
                <strong>Tamaño de bloque:</strong> $2^5 = 32$ direcciones por subred.
              </li>
              <li>
                <strong>Máscara decimal:</strong> Los primeros 24 bits suman 255.255.255. El cuarto octeto tiene 3 bits
                a uno ($128 + 64 + 32 = 224$). Máscara: <code className="text-foreground">255.255.255.224</code>.
              </li>
              <li>
                <strong>Localización del segmento:</strong> Los saltos de 32 avanzan: 0, 32, 64, 96, 128, 160,{' '}
                <strong>192</strong>, 224. El valor 195 cae en el bloque de 192 a 223.
              </li>
              <li>
                <strong>Parámetros resultantes:</strong>
                <ul className="list-disc pl-5 mt-1 space-y-0.5 font-mono text-foreground">
                  <li>Dirección de Red: 172.16.45.192</li>
                  <li>Primera IP útil: 172.16.45.193</li>
                  <li>Última IP útil: 172.16.45.222</li>
                  <li>Dirección de Broadcast: 172.16.45.223</li>
                  <li>Máscara Wildcard: 0.0.0.31 ($255 - 224 = 31$)</li>
                </ul>
              </li>
            </ol>
          </div>

          <div className="space-y-3 border border-card-border p-4 rounded-lg bg-card">
            <h3 className="font-bold text-foreground text-sm">
              Ejemplo 2: Segmentación VLSM corporativa en 192.168.1.0/24
            </h3>
            <p className="text-muted text-xs">
              Diseño de tres subredes optimizadas para una sede empresarial:
            </p>
            <ul className="list-disc pl-5 text-xs text-muted space-y-1.5">
              <li>
                <strong>Desarrollo (55 hosts requeridos):</strong> Requiere 6 bits de host ($2^6 - 2 = 62$).
                Prefijo: <strong>/26</strong>. Subred: <code>192.168.1.0/26</code> (Rango útil: 192.168.1.1 a
                192.168.1.62; Broadcast: 192.168.1.63).
              </li>
              <li>
                <strong>Administración (25 hosts requeridos):</strong> Requiere 5 bits de host ($2^5 - 2 = 30$).
                Prefijo: <strong>/27</strong>. Inicia en el siguiente salto: <code>192.168.1.64/27</code> (Rango útil:
                192.168.1.65 a 192.168.1.94; Broadcast: 192.168.1.95).
              </li>
              <li>
                <strong>Enlace entre routers (2 hosts):</strong> Requiere 2 bits de host ($2^2 - 2 = 2$). Prefijo:{' '}
                <strong>/30</strong>. Subred: <code>192.168.1.96/30</code> (Rango útil: 192.168.1.97 a 192.168.1.98;
                Broadcast: 192.168.1.99).
              </li>
            </ul>
          </div>

          <h2 className="text-xl font-bold text-foreground mt-8 mb-3">
            5. Errores habituales en el cálculo de subredes y cómo evitarlos
          </h2>
          <div className="space-y-3">
            <div className="p-3 border-l-4 border-danger bg-danger-light/10 rounded-r-lg">
              <h4 className="font-semibold text-danger text-xs uppercase tracking-wide">
                Error 1: Calcular el salto en el octeto equivocado
              </h4>
              <p className="text-xs text-muted mt-1">
                En prefijos como <code>10.50.0.0/19</code> el salto no ocurre en el cuarto octeto, sino en el tercero.
                Al tener 19 bits, el tercer octeto contiene 3 bits de red (19 - 16 = 3), por lo que el salto es de{' '}
                2^(8 - 3) = 32 en dicho octeto (10.50.0.0, 10.50.32.0, 10.50.64.0...).
              </p>
            </div>

            <div className="p-3 border-l-4 border-danger bg-danger-light/10 rounded-r-lg">
              <h4 className="font-semibold text-danger text-xs uppercase tracking-wide">
                Error 2: Solapamiento entre subredes continuas en VLSM
              </h4>
              <p className="text-xs text-muted mt-1">
                Si tras asignar <code>192.168.1.0/26</code> (direcciones 0 a 63) se inicia la siguiente subred en{' '}
                <code>192.168.1.32/27</code>, se creará un conflicto de enrutamiento. Toda subred debe iniciar en un
                múltiplo exacto de su tamaño de bloque que no haya sido utilizado.
              </p>
            </div>

            <div className="p-3 border-l-4 border-danger bg-danger-light/10 rounded-r-lg">
              <h4 className="font-semibold text-danger text-xs uppercase tracking-wide">
                Error 3: Asignar la IP de red o broadcast a un host
              </h4>
              <p className="text-xs text-muted mt-1">
                Asignar <code>192.168.10.128</code> en una subred /26 a la interfaz de un servidor causará fallos de
                comunicación inmediata, ya que el sistema operativo o el router considerarán que representa al
                identificador de la red.
              </p>
            </div>
          </div>

          <h2 className="text-xl font-bold text-foreground mt-8 mb-3">
            6. Preguntas frecuentes sobre subnetting IPv4
          </h2>
          <div className="space-y-3 not-prose">
            {faqItems.map((faq, index) => (
              <div key={index} className="p-3.5 rounded-lg bg-card border border-card-border">
                <h3 className="text-sm font-bold text-foreground mb-1">{faq.question}</h3>
                <p className="text-xs text-muted leading-relaxed">{faq.answer}</p>
              </div>
            ))}
          </div>

          <h2 className="text-xl font-bold text-foreground mt-8 mb-3">
            Herramientas interactivas y recursos vinculados
          </h2>
          <p>
            Comprueba tus cálculos y agiliza el diseño de red con nuestras utilidades técnicas:
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-muted">
            <li>
              Usa la{' '}
              <Link href={`/herramientas/${subnetTool.slug}`} className="text-accent underline font-semibold">
                Calculadora de Subredes IPv4
              </Link>{' '}
              para obtener la tabla completa de parámetros, wildcard y representación binaria en tiempo real.
            </li>
            <li>
              Para descomponer octetos a nivel de bits, utiliza el{' '}
              <Link href={`/herramientas/${converterTool.slug}`} className="text-accent underline font-semibold">
                Conversor Binario, Decimal y Hexadecimal
              </Link>
              .
            </li>
            <li>
              Si necesitas asegurar el acceso a tus equipos de red y servidores, consulta nuestra guía sobre:{' '}
              <Link
                href="/guias/guia-seguridad-contrasenas-entropia"
                className="text-accent underline font-semibold"
              >
                Seguridad de contraseñas y cálculo de entropía
              </Link>
              .
            </li>
            <li>
              Consulta nuestra guía complementaria sobre almacenamiento y base binaria:{' '}
              <Link
                href="/guias/diferencia-kb-kib-por-que-mi-disco-tiene-menos-espacio"
                className="text-accent underline font-semibold"
              >
                ¿Por qué un disco de 1 TB muestra 931 GB en Windows?
              </Link>
              .
            </li>
          </ul>
        </div>
      </article>
    </main>
  );
}
