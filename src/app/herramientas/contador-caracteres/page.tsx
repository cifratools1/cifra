import type { Metadata } from 'next';
import { ToolLayout } from '@/components/ToolComponents';
import { getRelatedTools, getToolBySlug } from '@/lib/tools';
import CharacterCounter from './CharacterCounter';

const TOOL_SLUG = 'contador-caracteres';
const tool = getToolBySlug(TOOL_SLUG)!;

export const metadata: Metadata = {
  title: tool.name,
  description: tool.metaDescription,
  keywords: tool.keywords,
  alternates: {
    canonical: `https://cifra.tools/herramientas/${TOOL_SLUG}`,
  },
  openGraph: {
    title: `${tool.name} | Cifra`,
    description: tool.metaDescription,
    url: `https://cifra.tools/herramientas/${TOOL_SLUG}`,
    type: 'website',
  },
};

const FAQ_ITEMS = [
  {
    question: '¿Cuenta espacios y saltos de línea este contador de caracteres?',
    answer:
      'Sí. La herramienta desglosa la métrica en dos valores independientes: «Caracteres con espacios» (que contabiliza cada letra, espacio en blanco, tabulación y salto de línea) y «Caracteres sin espacios» (que omite todo espacio en blanco, muy solicitado para trabajos académicos y traducciones tarifadas por volumen neto de caracteres).',
  },
  {
    question: '¿Cómo se calculan los tiempos estimados de lectura y locución?',
    answer:
      'El tiempo de lectura se calcula sobre un estándar internacional de 200 palabras por minuto (ppm), que es la velocidad media de lectura silenciosa en adultos en textos en prosa. El tiempo de locución o habla se basa en 130 palabras por minuto, el ritmo estándar recomendado para conferencias, vídeos divulgativos y locución de podcasts.',
  },
  {
    question: '¿Por qué es importante respetar los 160 caracteres en la meta descripción SEO?',
    answer:
      'Google trunca las descripciones de los resultados de búsqueda (SERP) a partir de los 960 píxeles en escritorio (aproximadamente 155-160 caracteres). Mantener tu meta descripción entre 140 y 160 caracteres garantiza que el mensaje promocional se lea íntegramente y aumente el ratio de clics (CTR).',
  },
  {
    question: '¿Cuál es el límite actual de caracteres en Twitter / X?',
    answer:
      'Para cuentas estándar gratuitas, el límite de una publicación básica en Twitter / X es de 280 caracteres. Los usuarios suscritos a planes premium pueden publicar posts extensos, pero para publicaciones orgánicas virales y lectura rápida el estándar de 280 sigue siendo el formato clave.',
  },
  {
    question: '¿Mis textos se guardan o se envían a servidores externos?',
    answer:
      'No. En absoluto. Todo el procesamiento se realiza en tiempo real directamente en la memoria de tu navegador mediante JavaScript. Cifra no dispone de backend para almacenar textos ni envía ninguna petición de red mientras escribes.',
  },
];

export default function ContadorCaracteresPage() {
  const relatedTools = getRelatedTools(TOOL_SLUG);

  // Schema.org structured data
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebApplication',
        name: tool.name,
        url: `https://cifra.tools/herramientas/${TOOL_SLUG}`,
        description: tool.metaDescription,
        applicationCategory: 'UtilityApplication',
        operatingSystem: 'All',
        offers: {
          '@type': 'Offer',
          price: '0',
          priceCurrency: 'EUR',
        },
      },
      {
        '@type': 'FAQPage',
        mainEntity: FAQ_ITEMS.map(item => ({
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
    <div className="space-y-8 text-foreground/90">
      <div>
        <h2 className="text-xl font-bold text-foreground mb-3">
          ¿Cómo funciona el contador de caracteres y palabras?
        </h2>
        <p className="text-sm leading-relaxed text-muted">
          El análisis de texto en Cifra utiliza expresiones regulares y algoritmos de tokenización
          compatibles con la norma Unicode. Esto significa que los caracteres con tildes (á, é, í, ó, ú),
          diéresis (ü), la letra eñe (ñ), los signos de apertura propios del español (¿, ¡) y los emojis
          se procesan con precisión sin distorsionar el recuento.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="border border-card-border rounded-lg bg-card p-5">
          <h3 className="text-base font-semibold text-foreground mb-2">
            Métricas de texto analizadas
          </h3>
          <ul className="text-sm text-muted space-y-2 list-disc pl-5">
            <li>
              <strong className="text-foreground">Caracteres con espacios:</strong> Cuenta la
              longitud total de la cadena en memoria, incluyendo tabulaciones, retornos de carro y
              espacios.
            </li>
            <li>
              <strong className="text-foreground">Caracteres sin espacios:</strong> La longitud neta
              restando cualquier espacio en blanco. Esencial para calcular tarifas editoriales o
              ensayos académicos.
            </li>
            <li>
              <strong className="text-foreground">Palabras:</strong> Segmentadas por límites de
              espacios en blanco contiguos, ignorando cadenas vacías.
            </li>
            <li>
              <strong className="text-foreground">Oraciones:</strong> Identificadas por la presencia
              de signos delimitadores finales (. ! ? …) seguidos de espacio o fin de texto.
            </li>
            <li>
              <strong className="text-foreground">Párrafos:</strong> Segmentados por líneas vacías
              dobles o saltos de línea consecutivos.
            </li>
          </ul>
        </div>

        <div className="border border-card-border rounded-lg bg-card p-5">
          <h3 className="text-base font-semibold text-foreground mb-2">
            Tiempos de lectura y locución (PPM)
          </h3>
          <p className="text-sm text-muted leading-relaxed mb-3">
            Las estimaciones de tiempo son herramientas fundamentales para periodistas, oradores,
            guionistas y creadores de contenido multimedia:
          </p>
          <ul className="text-sm text-muted space-y-2 list-disc pl-5">
            <li>
              <strong className="text-foreground">Lectura silenciosa (200 ppm):</strong> Estándar
              científico para lectura en pantalla y libros impresos por adultos.
            </li>
            <li>
              <strong className="text-foreground">Locución y oratoria (130 ppm):</strong> Cadencia
              óptima para que el mensaje resulte claro, comprensible y profesional en vídeos de
              YouTube, podcasts o exposiciones orales.
            </li>
          </ul>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-bold text-foreground mb-3">
          Guía de límites recomendados por plataforma
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left border-collapse">
            <thead>
              <tr className="border-b border-card-border text-foreground bg-code-bg/50">
                <th className="py-2.5 px-4 font-semibold">Canal / Medio</th>
                <th className="py-2.5 px-4 font-semibold">Límite Técnico</th>
                <th className="py-2.5 px-4 font-semibold">Longitud Óptima Recomendada</th>
                <th className="py-2.5 px-4 font-semibold">Objetivo</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-card-border text-muted">
              <tr>
                <td className="py-2.5 px-4 font-medium text-foreground">Google Title Tag</td>
                <td className="py-2.5 px-4">~60 caracteres</td>
                <td className="py-2.5 px-4">50 - 60 caracteres</td>
                <td className="py-2.5 px-4">Evitar truncamiento con puntos suspensivos en SERPs</td>
              </tr>
              <tr>
                <td className="py-2.5 px-4 font-medium text-foreground">Google Meta Description</td>
                <td className="py-2.5 px-4">~160 caracteres</td>
                <td className="py-2.5 px-4">140 - 155 caracteres</td>
                <td className="py-2.5 px-4">Aumentar el CTR orgánico en resultados de búsqueda</td>
              </tr>
              <tr>
                <td className="py-2.5 px-4 font-medium text-foreground">Twitter / X</td>
                <td className="py-2.5 px-4">280 caracteres</td>
                <td className="py-2.5 px-4">180 - 240 caracteres</td>
                <td className="py-2.5 px-4">Mayor tasa de retuits y respuestas con espacio para menciones</td>
              </tr>
              <tr>
                <td className="py-2.5 px-4 font-medium text-foreground">LinkedIn Post</td>
                <td className="py-2.5 px-4">3.000 caracteres</td>
                <td className="py-2.5 px-4">1.000 - 1.500 caracteres</td>
                <td className="py-2.5 px-4">Enganche antes del botón «ver más» (primeros 210 caracteres)</td>
              </tr>
              <tr>
                <td className="py-2.5 px-4 font-medium text-foreground">Instagram Caption</td>
                <td className="py-2.5 px-4">2.200 caracteres</td>
                <td className="py-2.5 px-4">150 - 300 caracteres</td>
                <td className="py-2.5 px-4">Lectura ágil con foco en la primera línea antes del recorte</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c') }}
      />
      <ToolLayout
        title={tool.name}
        description={tool.description}
        educationalContent={educationalContent}
        faq={FAQ_ITEMS}
        relatedTools={relatedTools}
      >
        <CharacterCounter />
      </ToolLayout>
    </>
  );
}
