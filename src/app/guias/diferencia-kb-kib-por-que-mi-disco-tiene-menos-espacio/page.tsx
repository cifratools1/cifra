import type { Metadata } from 'next';
import Link from 'next/link';
import TableOfContents from '@/components/TableOfContents';
import { getGuideBySlug, formatDateSpanish } from '@/lib/guides';
import { getToolBySlug } from '@/lib/tools';

const SLUG = 'diferencia-kb-kib-por-que-mi-disco-tiene-menos-espacio';

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

export default function DiskSpaceGuidePage() {
  const guide = getGuideBySlug(SLUG)!;
  const storageTool = getToolBySlug('conversor-unidades-almacenamiento')!;
  const converterTool = getToolBySlug('conversor-binario-decimal-hexadecimal')!;

  const faqItems = [
    {
      question: '¿Por qué Windows sigue mostrando GB en lugar de GiB?',
      answer:
        'Por razones de compatibilidad histórica heredada de MS-DOS y Windows NT. Aunque internamente divide por 1.024 (GiB), Microsoft conserva la etiqueta "GB" para evitar desconcertar a usuarios no técnicos acostumbrados a los prefijos clásicos.',
    },
    {
      question: '¿Cuánto espacio utilizable muestra realmente una memoria de 64 GB?',
      answer:
        'Una memoria de 64 GB comercial contiene 64.000.000.000 bytes. Al dividir sucesivamente por 1.024 (64.000.000.000 / 1.024^3), Windows reporta aproximadamente 59,60 GiB. Tras el formato de archivos (FAT32 o exFAT), el espacio libre utilizable ronda los 59,5 GB.',
    },
    {
      question: '¿Es legal que los fabricantes etiqueten en base decimal?',
      answer:
        'Sí. Los fabricantes siguen el Sistema Internacional de Unidades (SI), donde giga significa 10^9 y tera significa 10^12. Los tribunales han ratificado que no existe engaño publicitario siempre que se aclare la equivalencia de cálculo en el embalaje.',
    },
    {
      question: '¿Qué es el "slack space" o espacio desperdiciado por tamaño de bloque?',
      answer:
        'Los sistemas de archivos asignan espacio en bloques fijos o clusters (habitualmente de 4 KiB en NTFS). Un archivo de 500 bytes ocupa un cluster completo de 4.096 bytes, quedando 3.596 bytes inutilizados y creando una diferencia entre tamaño real y tamaño en disco.',
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
            <span>Estándares SI vs IEC 60027-2 / ISO 80000-13</span>
          </div>
        </header>

        {/* Banner interactivo hacia la herramienta de almacenamiento */}
        <div className="mb-8 p-4 rounded-lg bg-card border border-accent/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h4 className="text-sm font-bold text-foreground">Comprueba la capacidad exacta de tu unidad</h4>
            <p className="text-xs text-muted">
              Convierte al instante entre el estándar decimal de los fabricantes y el binario de Windows.
            </p>
          </div>
          <Link
            href={`/herramientas/${storageTool.slug}`}
            className="px-4 py-2 text-xs font-semibold rounded bg-accent text-white hover:bg-accent-hover transition-colors whitespace-nowrap"
          >
            Abrir Conversor de Almacenamiento
          </Link>
        </div>

        {/* Cuerpo del artículo */}
        <TableOfContents />

        <div className="max-w-[68ch] space-y-6 text-base sm:text-lg text-slate-700 dark:text-slate-300 leading-relaxed font-sans">
          <p>
            Casi cualquier persona que haya adquirido un disco duro externo, un SSD NVMe o una tarjeta microSD
            ha experimentado la misma decepción al conectarlo a su equipo: la caja promete <strong>1.000 GB (1 TB)</strong>,
            pero el explorador de archivos de Windows asegura que la unidad solo dispone de <strong>931 GB</strong>.
            ¿Dónde están los 69 GB restantes? ¿Se trata de un engaño del fabricante o de espacio retenido por el sistema?
          </p>
          <p>
            La realidad es que <strong>no falta ningún byte físico en la unidad</strong>. Se trata de un desacuerdo
            histórico entre dos sistemas de unidades de medida (el decimal y el binario) que lleva décadas generando
            confusión entre consumidores y profesionales de la informática.
          </p>

          <h2 className="text-xl font-bold text-foreground mt-8 mb-3">
            1. El origen del desacuerdo: Base 10 (SI) frente a Base 2 (IEC)
          </h2>
          <p>
            En el <strong>Sistema Internacional de Unidades (SI)</strong>, los prefijos responden estrictamente
            a potencias de 10:
          </p>
          <ul className="list-disc pl-5 space-y-1 text-muted">
            <li>1 Kilobyte (KB) = 10^3 = 1.000 Bytes.</li>
            <li>1 Megabyte (MB) = 10^6 = 1.000.000 Bytes.</li>
            <li>1 Gigabyte (GB) = 10^9 = 1.000.000.000 Bytes.</li>
            <li>1 Terabyte (TB) = 10^12 = 1.000.000.000.000 Bytes.</li>
          </ul>
          <p>
            Los fabricantes de discos duros y memorias flash siguen el estándar decimal. Al comprar un disco de 1 TB,
            recibes con exactitud un billón de bytes físicos. Sin embargo, los sistemas operativos operan en base 2.
            En los primeros microordenadores, 2^10 = 1.024 bytes era tan próximo a 1.000 que se adoptó informalmente
            la palabra &quot;kilo&quot;, pero al escalar a gigabytes y terabytes la discrepancia creció exponencialmente.
          </p>

          <h2 className="text-xl font-bold text-foreground mt-8 mb-3">
            2. El estándar IEC 60027-2 y los prefijos binarios
          </h2>
          <p>
            Para resolver esta ambigüedad, la Comisión Electrotécnica Internacional formalizó en 1998 la norma{' '}
            <strong>IEC 60027-2 (ISO/IEC 80000-13)</strong>, estableciendo prefijos binarios inequívocos:
          </p>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse border border-card-border text-xs">
              <thead>
                <tr className="bg-muted/10 text-foreground">
                  <th className="p-2 border border-card-border font-semibold">Prefijo Binario</th>
                  <th className="p-2 border border-card-border font-semibold">Símbolo</th>
                  <th className="p-2 border border-card-border font-semibold">Valor Exacto en Bytes</th>
                  <th className="p-2 border border-card-border font-semibold">Equivalente Decimal (SI)</th>
                  <th className="p-2 border border-card-border font-semibold">Divergencia</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="p-2 border border-card-border">Kibibyte</td>
                  <td className="p-2 border border-card-border font-mono">KiB</td>
                  <td className="p-2 border border-card-border font-mono">1.024 B</td>
                  <td className="p-2 border border-card-border font-mono">1 KB = 1.000 B</td>
                  <td className="p-2 border border-card-border font-mono">+2,40%</td>
                </tr>
                <tr>
                  <td className="p-2 border border-card-border">Mebibyte</td>
                  <td className="p-2 border border-card-border font-mono">MiB</td>
                  <td className="p-2 border border-card-border font-mono">1.048.576 B</td>
                  <td className="p-2 border border-card-border font-mono">1 MB = 1.000.000 B</td>
                  <td className="p-2 border border-card-border font-mono">+4,86%</td>
                </tr>
                <tr>
                  <td className="p-2 border border-card-border">Gibibyte</td>
                  <td className="p-2 border border-card-border font-mono">GiB</td>
                  <td className="p-2 border border-card-border font-mono">1.073.741.824 B</td>
                  <td className="p-2 border border-card-border font-mono">1 GB = 10^9 B</td>
                  <td className="p-2 border border-card-border font-mono">+7,37%</td>
                </tr>
                <tr>
                  <td className="p-2 border border-card-border">Tebibyte</td>
                  <td className="p-2 border border-card-border font-mono">TiB</td>
                  <td className="p-2 border border-card-border font-mono">1.099.511.627.776 B</td>
                  <td className="p-2 border border-card-border font-mono">1 TB = 10^12 B</td>
                  <td className="p-2 border border-card-border font-mono">+9,95%</td>
                </tr>
              </tbody>
            </table>
          </div>

          <h2 className="text-xl font-bold text-foreground mt-8 mb-3">
            3. Cálculo paso a paso para unidades de 1 TB y 2 TB
          </h2>
          <div className="space-y-3 border border-card-border p-4 rounded-lg bg-card">
            <h3 className="font-bold text-foreground text-sm">
              Caso 1: Demostración matemática para un disco de 1 TB
            </h3>
            <p className="text-muted text-xs">
              El fabricante entrega un disco con exactamente 1.000.000.000.000 de bytes. Cuando Windows analiza el
              volumen, divide sucesivamente entre 1.024:
            </p>
            <div className="font-mono text-xs space-y-1 bg-muted/10 p-2.5 rounded border border-card-border">
              1.000.000.000.000 Bytes / 1.024 = 976.562.500 KiB
              <br />
              976.562.500 KiB / 1.024 = 953.674,316 MiB
              <br />
              953.674,316 MiB / 1.024 = <strong>931,32 GiB</strong>
            </div>
            <p className="text-xs text-muted">
              El disco contiene todos los bytes prometidos. La discrepancia radica en que{' '}
              <strong>Windows etiqueta como &quot;GB&quot; lo que técnicamente son &quot;GiB&quot;</strong>.
            </p>
          </div>

          <div className="space-y-3 border border-card-border p-4 rounded-lg bg-card">
            <h3 className="font-bold text-foreground text-sm">
              Caso 2: Demostración matemática para un disco de 2 TB
            </h3>
            <p className="text-muted text-xs">
              Para una unidad comercial de 2 TB (2 × 10^12 bytes):
            </p>
            <div className="font-mono text-xs space-y-1 bg-muted/10 p-2.5 rounded border border-card-border">
              2.000.000.000.000 Bytes / (1.024^3) = <strong>1.862,64 GiB</strong>
              <br />
              1.862,64 GiB / 1.024 = <strong>1,8189 TiB</strong>
            </div>
            <p className="text-xs text-muted">
              Windows muestra &quot;1,81 TB&quot;, acumulando una diferencia aparente de casi 190 GB respecto a la caja.
            </p>
          </div>

          <h2 className="text-xl font-bold text-foreground mt-8 mb-3">
            4. Capacidades comerciales y espacio visible en Windows
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse border border-card-border text-xs">
              <thead>
                <tr className="bg-muted/10 text-foreground">
                  <th className="p-2 border border-card-border font-semibold">Disco Comercial</th>
                  <th className="p-2 border border-card-border font-semibold">Bytes Físicos</th>
                  <th className="p-2 border border-card-border font-semibold">Capacidad en Windows</th>
                  <th className="p-2 border border-card-border font-semibold">Diferencia Visual</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="p-2 border border-card-border font-mono">256 GB</td>
                  <td className="p-2 border border-card-border font-mono">256.000.000.000 B</td>
                  <td className="p-2 border border-card-border font-mono font-semibold">~238,4 GiB</td>
                  <td className="p-2 border border-card-border text-muted">~17,6 GB</td>
                </tr>
                <tr>
                  <td className="p-2 border border-card-border font-mono">512 GB</td>
                  <td className="p-2 border border-card-border font-mono">512.000.000.000 B</td>
                  <td className="p-2 border border-card-border font-mono font-semibold">~476,8 GiB</td>
                  <td className="p-2 border border-card-border text-muted">~35,2 GB</td>
                </tr>
                <tr>
                  <td className="p-2 border border-card-border font-mono">1 TB (1.000 GB)</td>
                  <td className="p-2 border border-card-border font-mono">1.000.000.000.000 B</td>
                  <td className="p-2 border border-card-border font-mono font-semibold">~931,3 GiB</td>
                  <td className="p-2 border border-card-border text-muted">~68,7 GB</td>
                </tr>
                <tr>
                  <td className="p-2 border border-card-border font-mono">2 TB (2.000 GB)</td>
                  <td className="p-2 border border-card-border font-mono">2.000.000.000.000 B</td>
                  <td className="p-2 border border-card-border font-mono font-semibold">~1.862,6 GiB (1,81 TiB)</td>
                  <td className="p-2 border border-card-border text-muted">~137,4 GB</td>
                </tr>
                <tr>
                  <td className="p-2 border border-card-border font-mono">4 TB (4.000 GB)</td>
                  <td className="p-2 border border-card-border font-mono">4.000.000.000.000 B</td>
                  <td className="p-2 border border-card-border font-mono font-semibold">~3.725,2 GiB (3,63 TiB)</td>
                  <td className="p-2 border border-card-border text-muted">~274,8 GB</td>
                </tr>
              </tbody>
            </table>
          </div>

          <h2 className="text-xl font-bold text-foreground mt-8 mb-3">
            5. Otros factores que reducen el espacio utilizable
          </h2>
          <p>
            Además de la discrepancia matemática de unidades, el formateo consume parte del medio:
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-muted">
            <li>
              <strong>Tablas de partición:</strong> Las estructuras GPT y particiones reservadas como EFI (ESP) consumen
              entre 100 MB y 500 MB.
            </li>
            <li>
              <strong>Metadatos del sistema de archivos:</strong> En NTFS, la Master File Table ($MFT) reserva espacio
              para indexar archivos. En Linux EXT4, por defecto se reserva un 5% para el superusuario <code>root</code>.
            </li>
            <li>
              <strong>Over-provisioning en SSDs:</strong> Los discos de estado sólido reservan un 7% de celdas internas
              para mantenimiento y nivelación de desgaste (wear leveling).
            </li>
          </ul>

          <h2 className="text-xl font-bold text-foreground mt-8 mb-3">
            6. Comportamiento según el sistema operativo
          </h2>
          <ul className="list-disc pl-5 space-y-1.5 text-muted">
            <li>
              <strong>Windows:</strong> Divide por 1.024 pero rotula con prefijos decimales (&quot;GB&quot; y &quot;TB&quot;).
            </li>
            <li>
              <strong>macOS (Apple):</strong> Desde Mac OS X Snow Leopard (10.6), Apple adoptó el estándar decimal SI. Un disco
              de 1 TB en Mac muestra exactamente 1 TB.
            </li>
            <li>
              <strong>Linux:</strong> Respeta la norma con rigor. Comandos como <code>lsblk</code> reportan en GiB, mientras
              que <code>df -H</code> permite consultar en base decimal.
            </li>
          </ul>

          <h2 className="text-xl font-bold text-foreground mt-8 mb-3">
            7. Errores habituales al interpretar el almacenamiento
          </h2>
          <div className="space-y-3">
            <div className="p-3 border-l-4 border-danger bg-danger-light/10 rounded-r-lg">
              <h4 className="font-semibold text-danger text-xs uppercase tracking-wide">
                Error 1: Devolver un disco duro creyendo que está defectuoso
              </h4>
              <p className="text-xs text-muted mt-1">
                Muchos usuarios devuelven unidades de 1 TB creyendo que han sido estafados al ver 931 GB. Conocer la
                diferencia entre GB y GiB evita reclamaciones innecesarias a fabricantes y tiendas.
              </p>
            </div>

            <div className="p-3 border-l-4 border-danger bg-danger-light/10 rounded-r-lg">
              <h4 className="font-semibold text-danger text-xs uppercase tracking-wide">
                Error 2: Confundir velocidad de red (Mbps) con descarga (MB/s)
              </h4>
              <p className="text-xs text-muted mt-1">
                Las conexiones de fibra se comercializan en Megabits por segundo (Mbps). Al descargar archivos, los navegadores
                miden en Megabytes por segundo (MB/s). Como 1 Byte tiene 8 bits, 600 Mbps equivalen a 75 MB/s teóricos.
              </p>
            </div>

            <div className="p-3 border-l-4 border-danger bg-danger-light/10 rounded-r-lg">
              <h4 className="font-semibold text-danger text-xs uppercase tracking-wide">
                Error 3: Desperdicio por tamaño de bloque (Slack Space)
              </h4>
              <p className="text-xs text-muted mt-1">
                Guardar millones de archivos pequeños en particiones con clusters de 64 KiB provoca que un archivo de 100 bytes
                ocupe 65.536 bytes en disco, desperdiciando espacio útil. El cluster estándar de 4 KiB minimiza esta pérdida.
              </p>
            </div>
          </div>

          <h2 className="text-xl font-bold text-foreground mt-8 mb-3">
            8. Preguntas frecuentes sobre unidades de almacenamiento
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
            Herramientas interactivas y guías relacionadas
          </h2>
          <p>
            Comprueba cualquier conversión de capacidad y amplía tus conocimientos técnicos:
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-muted">
            <li>
              Usa nuestro{' '}
              <Link href={`/herramientas/${storageTool.slug}`} className="text-accent underline font-semibold">
                Conversor de Unidades de Almacenamiento
              </Link>{' '}
              para calcular al instante equivalencias entre KB, KiB, MB, MiB, GB, GiB, TB y TiB.
            </li>
            <li>
              Para comprender el sistema binario y la representación en base 2, visita el{' '}
              <Link href={`/herramientas/${converterTool.slug}`} className="text-accent underline font-semibold">
                Conversor Binario, Decimal y Hexadecimal
              </Link>
              .
            </li>
            <li>
              Descubre los secretos de la aleatoriedad en nuestra guía de seguridad:{' '}
              <Link
                href="/guias/guia-seguridad-contrasenas-entropia"
                className="text-accent underline font-semibold"
              >
                Seguridad de contraseñas y medición de entropía
              </Link>
              .
            </li>
          </ul>
        </div>
      </article>
    </main>
  );
}
