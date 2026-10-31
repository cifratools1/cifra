import type { Metadata } from 'next';
import { getToolBySlug, getRelatedTools } from '@/lib/tools';
import { ToolLayout } from '@/components/ToolComponents';
import StorageConverterClient from './StorageConverterClient';

const SLUG = 'conversor-unidades-almacenamiento';

export function generateMetadata(): Metadata {
  const tool = getToolBySlug(SLUG);
  if (!tool) return {};

  return {
    title: `${tool.name} — Bytes, KB, MB, GB, TB, PB`,
    description: tool.metaDescription,
    keywords: tool.keywords,
    alternates: {
      canonical: `https://cifra.tools/herramientas/${SLUG}`,
    },
    openGraph: {
      title: `${tool.name} | Cifra`,
      description: tool.metaDescription,
      url: `https://cifra.tools/herramientas/${SLUG}`,
      type: 'website',
    },
  };
}

export default function StorageConverterPage() {
  const tool = getToolBySlug(SLUG);
  const relatedTools = getRelatedTools(SLUG);

  if (!tool) {
    return <div>Herramienta no encontrada</div>;
  }

  const faq = [
    {
      question: '¿Por qué mi disco de 1 TB muestra 931 GB en Windows?',
      answer:
        'Los fabricantes comercializan los discos duros y memorias usando el Sistema Internacional (SI) en base 10 (1 TB = 1.000.000.000.000 de bytes). Sin embargo, Windows calcula la capacidad dividiendo sucesivamente por 1024 (base 2): 1.000.000.000.000 / (1024 * 1024 * 1024) ≈ 931,32 GiB. Aunque Windows lo etiqueta como "GB", en realidad está midiendo Gibibytes (GiB).',
    },
    {
      question: '¿Cuál es la diferencia entre Kilobyte (KB) y Kibibyte (KiB)?',
      answer:
        'Un Kilobyte (KB) representa exactamente 1.000 bytes (10³), según la norma del Sistema Internacional (SI). Un Kibibyte (KiB) representa 1.024 bytes (2¹⁰), según el estándar IEC 60027-2 establecido en 1998 para eliminar la ambigüedad histórica en informática.',
    },
    {
      question: '¿Cuál es la diferencia entre bit (b) y Byte (B)?',
      answer:
        '1 Byte siempre está compuesto por 8 bits. Los bits (b minúscula) se usan típicamente en telecomunicaciones para medir ancho de banda y velocidad de transmisión (Mbps, Gbps). Los Bytes (B mayúscula) se usan para medir tamaño de archivos y capacidad de almacenamiento.',
    },
    {
      question: '¿Cuánto tiempo tarda en descargarse un archivo de 10 GB con fibra de 300 Mbps?',
      answer:
        'Primero convierte 10 GB a bits: 10 * 8 = 80 Gigabits = 80.000 Megabits. Luego divide por la velocidad: 80.000 Mb / 300 Mbps ≈ 266,6 segundos (unos 4 minutos y 26 segundos), asumiendo una conexión ideal sin pérdidas de cabecera.',
    },
    {
      question: '¿Cómo mide el almacenamiento macOS?',
      answer:
        'A partir de Mac OS X Snow Leopard (versión 10.6), Apple adaptó su sistema operativo al estándar internacional SI. Un disco de 1 TB en macOS muestra 1 TB completo, coincidiendo exactamente con la especificación del fabricante.',
    },
  ];

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'SoftwareApplication',
        name: tool.name,
        applicationCategory: 'UtilitiesApplication',
        operatingSystem: 'All',
        offers: {
          '@type': 'Offer',
          price: '0',
          priceCurrency: 'EUR',
        },
        description: tool.metaDescription,
        url: `https://cifra.tools/herramientas/${SLUG}`,
      },
      {
        '@type': 'FAQPage',
        mainEntity: faq.map((item) => ({
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

  const educationalContent = (
    <div className="space-y-6 text-sm text-foreground/90">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c') }}
      />
      <div>
        <h2 className="text-xl font-bold text-foreground mb-3">
          Sistemas de Medida: Decimal (SI) vs Binario (IEC)
        </h2>
        <p className="leading-relaxed text-muted">
          Durante las primeras décadas de la computación comercial, los ingenieros adoptaron los
          prefijos del Sistema Internacional (kilo, mega, giga) para abreviar potencias de dos,
          ya que 2¹⁰ (1024) es aproximadamente igual a 10³ (1000). Esta coincidencia matemática
          provocó décadas de confusión entre usuarios, desarrolladores y tribunales de consumo.
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse border border-card-border text-xs">
          <thead>
            <tr className="bg-muted/10 text-foreground">
              <th className="p-2 border border-card-border">Prefijo SI</th>
              <th className="p-2 border border-card-border">Factor Decimal</th>
              <th className="p-2 border border-card-border">Prefijo IEC</th>
              <th className="p-2 border border-card-border">Factor Binario</th>
              <th className="p-2 border border-card-border">Diferencia Relativa</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="p-2 border border-card-border">KB (Kilobyte)</td>
              <td className="p-2 border border-card-border font-mono">1.000 Bytes</td>
              <td className="p-2 border border-card-border">KiB (Kibibyte)</td>
              <td className="p-2 border border-card-border font-mono">1.024 Bytes</td>
              <td className="p-2 border border-card-border font-mono">+2,4 %</td>
            </tr>
            <tr>
              <td className="p-2 border border-card-border">MB (Megabyte)</td>
              <td className="p-2 border border-card-border font-mono">1.000.000 Bytes</td>
              <td className="p-2 border border-card-border">MiB (Mebibyte)</td>
              <td className="p-2 border border-card-border font-mono">1.048.576 Bytes</td>
              <td className="p-2 border border-card-border font-mono">+4,8 %</td>
            </tr>
            <tr>
              <td className="p-2 border border-card-border">GB (Gigabyte)</td>
              <td className="p-2 border border-card-border font-mono">1.000.000.000 Bytes</td>
              <td className="p-2 border border-card-border">GiB (Gibibyte)</td>
              <td className="p-2 border border-card-border font-mono">1.073.741.824 Bytes</td>
              <td className="p-2 border border-card-border font-mono">+7,3 %</td>
            </tr>
            <tr>
              <td className="p-2 border border-card-border">TB (Terabyte)</td>
              <td className="p-2 border border-card-border font-mono">1.000.000.000.000 Bytes</td>
              <td className="p-2 border border-card-border">TiB (Tebibyte)</td>
              <td className="p-2 border border-card-border font-mono">1.099.511.627.776 Bytes</td>
              <td className="p-2 border border-card-border font-mono">+9,9 %</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="bg-card border border-card-border rounded-lg p-4">
        <h3 className="font-semibold text-foreground mb-2">
          La regla de conversión rápida entre Mbps y MB/s
        </h3>
        <p className="text-muted leading-relaxed">
          Para saber a qué velocidad máxima descargará un navegador o gestor de descargas tu conexión de fibra:
          <br />
          <strong className="text-foreground">Velocidad en MB/s = Velocidad en Mbps ÷ 8</strong>
          <br />
          Por ejemplo, una conexión contratada de <strong>600 Megabits por segundo (Mbps)</strong> equivale a un límite teórico de descarga de <strong>75 Megabytes por segundo (MB/s)</strong>.
        </p>
      </div>
    </div>
  );

  return (
    <ToolLayout
      title={tool.name}
      description={tool.description}
      educationalContent={educationalContent}
      faq={faq}
      relatedTools={relatedTools}
    >
      <StorageConverterClient />
    </ToolLayout>
  );
}
