import type { Metadata } from 'next';
import { ToolLayout } from '@/components/ToolComponents';
import { getRelatedTools, getToolBySlug } from '@/lib/tools';
import ColorConverter from './ColorConverter';

const TOOL_SLUG = 'conversor-colores';
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
    question: '¿Cuál es la diferencia práctica entre RGB y HSL en desarrollo frontend?',
    answer:
      'RGB define el color mediante la intensidad de luz física de los tres canales primarios (rojo, verde y azul de 0 a 255), lo que resulta intuitivo para el hardware pero complejo de manipular mentalmente. HSL, en cambio, descompone el color en Matiz (posición en grados de 0 a 360° en la rueda cromática), Saturación (0% a 100%) y Luminosidad (0% a 100%). Esto facilita enormemente crear estados como :hover o modos oscuros simplemente alterando la luminosidad.',
  },
  {
    question: '¿Qué exige el criterio de contraste WCAG 2.1 para accesibilidad web?',
    answer:
      'El estándar WCAG 2.1 nivel AA de la W3C exige que el texto de tamaño estándar presente un ratio de contraste mínimo de 4.5:1 respecto a su fondo. Para texto grande (al menos 18pt o 14pt en negrita) se requiere un ratio de 3:1. Para alcanzar el nivel AAA de máxima exigencia, el ratio debe superar 7.0:1 para texto normal.',
  },
  {
    question: '¿Cómo funciona la abreviatura de códigos HEX de tres dígitos (#RGB)?',
    answer:
      'Cuando un código hexadecimal consta de tres dígitos (por ejemplo, #F53), el navegador duplica cada carácter individual (#FF5533). Esto permite escribir colores estándar de forma compacta en hojas de estilo CSS.',
  },
  {
    question: '¿Qué es una tríada o armonía triádica de colores?',
    answer:
      'Una armonía triádica selecciona tres colores equidistantes en el círculo cromático, separados por 120 grados (por ejemplo, a 0°, 120° y 240°). Esta combinación proporciona un fuerte impacto visual manteniendo el equilibrio y la viveza en paletas de interfaz de usuario y marcas.',
  },
  {
    question: '¿Se envía algún dato a servidores al convertir colores?',
    answer:
      'No. Todas las transformaciones matemáticas, cálculos de luminosidad relativa y comprobaciones de contraste se ejecutan en tiempo real en tu navegador mediante código JavaScript. Cifra no recopila ni almacena información.',
  },
];

export default function ConversorColoresPage() {
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
          Comprendiendo los modelos de color en la web
        </h2>
        <p className="text-sm leading-relaxed text-muted">
          En el ecosistema del desarrollo web y diseño digital coexisten diferentes modelos y espacios de color.
          Saber cómo interactúan HEX, RGB y HSL permite diseñar interfaces visualmente equilibradas y conformes
          a los estándares de accesibilidad WCAG.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="border border-card-border rounded-lg bg-card p-5">
          <h3 className="text-base font-semibold text-foreground mb-2">
            Hexadecimal (HEX)
          </h3>
          <p className="text-sm text-muted leading-relaxed mb-2">
            Representa valores numéricos en base 16 agrupados en pares para Rojo (R), Verde (G) y Azul (B),
            con un rango de <code className="text-xs bg-code-bg px-1 py-0.5 rounded font-mono">00</code> (0) a{' '}
            <code className="text-xs bg-code-bg px-1 py-0.5 rounded font-mono">FF</code> (255).
          </p>
          <span className="text-xs font-medium text-accent">
            Ideal para: Especificaciones de diseño, tokens de CSS y guías de estilo.
          </span>
        </div>

        <div className="border border-card-border rounded-lg bg-card p-5">
          <h3 className="text-base font-semibold text-foreground mb-2">
            RGB (Red, Green, Blue)
          </h3>
          <p className="text-sm text-muted leading-relaxed mb-2">
            Modelo aditivo en el que los píxeles de la pantalla emiten luz sumando tres longitudes de onda.
            Cada canal oscila entre 0 (ausencia de luz) y 255 (máxima intensidad), generando 16,777,216 combinaciones.
          </p>
          <span className="text-xs font-medium text-accent">
            Ideal para: Motores de renderizado Canvas, WebGL y canal alfa (rgba).
          </span>
        </div>

        <div className="border border-card-border rounded-lg bg-card p-5">
          <h3 className="text-base font-semibold text-foreground mb-2">
            HSL (Hue, Saturation, Light)
          </h3>
          <p className="text-sm text-muted leading-relaxed mb-2">
            Mapeo cilíndrico del espacio sRGB. El matiz (H) recorre la rueda cromática de 0° a 360° (rojo a 0°,
            verde a 120°, azul a 240°), mientras la saturación y la luminosidad se miden en porcentajes.
          </p>
          <span className="text-xs font-medium text-accent">
            Ideal para: Temas dinámicos (Dark/Light mode) y paletas armónicas con CSS variables.
          </span>
        </div>
      </div>

      <div className="border border-card-border rounded-lg bg-card p-5">
        <h3 className="text-base font-semibold text-foreground mb-2">
          Teoría del color: Armonías cromáticas en UI
        </h3>
        <p className="text-sm text-muted leading-relaxed mb-3">
          Las relaciones geométricas dentro de la rueda cromática determinan combinaciones equilibradas:
        </p>
        <ul className="text-sm text-muted space-y-2 list-disc pl-5">
          <li>
            <strong className="text-foreground">Colores complementarios (180°):</strong> Producen el
            máximo contraste simultáneo. Útiles para botones de llamada a la acción (CTA) sobre fondos
            neutros.
          </li>
          <li>
            <strong className="text-foreground">Colores análogos (±30°):</strong> Se encuentran a ambos
            lados del color base. Crean una sensación de serenidad y continuidad visual ideal para
            fondos, ilustraciones e infografías.
          </li>
          <li>
            <strong className="text-foreground">Colores triádicos (±120°):</strong> Ofrecen una paleta
            rica en matices sin sacrificar armonía, permitiendo distinguir diferentes categorías de
            información en cuadros de mando (dashboards).
          </li>
        </ul>
      </div>

      <div className="border border-card-border rounded-lg bg-card p-5">
        <h3 className="text-base font-semibold text-foreground mb-2">
          Accesibilidad web: Cálculo de la luminancia y contraste WCAG 2.1
        </h3>
        <p className="text-sm text-muted leading-relaxed mb-3">
          El ratio de contraste se calcula a partir de la luminancia relativa (<code className="text-xs bg-code-bg px-1 py-0.5 rounded font-mono">L</code>)
          de los dos colores según la fórmula normalizada por la W3C:
        </p>
        <div className="p-3 bg-code-bg rounded-md text-xs font-mono text-foreground mb-3 overflow-x-auto">
          Ratio = (L1 + 0.05) / (L2 + 0.05)
        </div>
        <p className="text-sm text-muted leading-relaxed">
          donde L1 es la luminancia del color más claro y L2 la del más oscuro. Un ratio adecuado garantiza que
          personas con deficiencias visuales (daltonismo, baja agudeza visual) o usuarios bajo luz solar directa
          puedan leer el contenido sin esfuerzo.
        </p>
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
        <ColorConverter />
      </ToolLayout>
    </>
  );
}
