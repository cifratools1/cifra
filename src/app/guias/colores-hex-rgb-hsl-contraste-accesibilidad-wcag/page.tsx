import type { Metadata } from 'next';
import Link from 'next/link';
import TableOfContents from '@/components/TableOfContents';
import { getGuideBySlug, formatDateSpanish } from '@/lib/guides';
import { getToolBySlug } from '@/lib/tools';

const SLUG = 'colores-hex-rgb-hsl-contraste-accesibilidad-wcag';

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

export default function ColorGuidePage() {
  const guide = getGuideBySlug(SLUG)!;
  const colorTool = getToolBySlug('conversor-colores')!;
  const converterTool = getToolBySlug('conversor-binario-decimal-hexadecimal')!;

  const faqItems = [
    {
      question: '¿Qué ratio de contraste mínimo exige la normativa WCAG 2.1?',
      answer:
        'Para el nivel estándar AA se exige al menos 4,5:1 en texto normal (menor de 24 px) y 3,0:1 en texto grande o componentes interactivos. Para el nivel AAA, los umbrales se elevan a 7,0:1 en texto normal y 4,5:1 en texto grande.',
    },
    {
      question: '¿Por qué el modelo HSL resulta más intuitivo que RGB o HEX?',
      answer:
        'Porque separa el tono (Hue, de 0 a 360 grados) de la pureza (Saturación en %) y la luz (Luminosidad en %). Esto permite crear variantes interactivas (hover, focus, disabled) modificando únicamente la luminosidad sin alterar el tono base.',
    },
    {
      question: '¿Cómo funciona la notación abreviada de 3 dígitos (#FFF)?',
      answer:
        'En CSS, un código de 3 caracteres hexadecimales como #17A se expande duplicando cada dígito: el 1 se convierte en 11, el 7 en 77 y la A en AA, dando como resultado exacto #1177AA.',
    },
    {
      question: '¿Por qué el verde influye más en el cálculo de luminancia que el azul?',
      answer:
        'Porque la vista humana tiene mayor sensibilidad a las longitudes de onda del verde. En la fórmula estándar de luminancia sRGB (ITU-R BT.709), el verde aporta el 71,52% del brillo percibido, el rojo el 21,26% y el azul solo el 7,22%.',
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
            <span>Estándares W3C WCAG 2.1 y CIE sRGB</span>
          </div>
        </header>

        {/* Banner interactivo hacia la herramienta */}
        <div className="mb-8 p-4 rounded-lg bg-card border border-accent/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h4 className="text-sm font-bold text-foreground">Convierte colores y comprueba el contraste WCAG</h4>
            <p className="text-xs text-muted">
              Transforma al instante entre formatos HEX, RGB y HSL y valida el cumplimiento accesible.
            </p>
          </div>
          <Link
            href={`/herramientas/${colorTool.slug}`}
            className="px-4 py-2 text-xs font-semibold rounded bg-accent text-white hover:bg-accent-hover transition-colors whitespace-nowrap"
          >
            Abrir Conversor de Colores
          </Link>
        </div>

        {/* Cuerpo del artículo */}
        <TableOfContents />

        <div className="max-w-[68ch] space-y-6 text-base sm:text-lg text-slate-700 dark:text-slate-300 leading-relaxed font-sans">
          <p>
            ¿Alguna vez te has preguntado por qué un botón gris claro sobre fondo blanco luce sofisticado en tu monitor de
            diseño pero resulta casi invisible en el móvil bajo el sol o para personas con baja visión? Detrás de esa
            experiencia frustrante no hay una cuestión de gusto estético, sino una fórmula matemática rigurosa de
            luminancia relativa y ratio de contraste establecida por el consorcio W3C.
          </p>
          <p>
            Dominar la conversión entre modelos HEX, RGB y HSL y aprender a verificar el contraste accesible permite construir
            interfaces digitales atractivas, profesionales y plenamente inclusivas para millones de usuarios.
          </p>

          <h2 className="text-xl font-bold text-foreground mt-8 mb-3">
            1. El modelo aditivo RGB: De los píxeles a la retina
          </h2>
          <p>
            Las pantallas emiten luz directa mediante subpíxeles organizados en tres colores primarios aditivos:{' '}
            <strong>Rojo (Red)</strong>, <strong>Verde (Green)</strong> y <strong>Azul (Blue)</strong>.
          </p>
          <p>
            Cada canal se mide con un número entero de 8 bits comprendido entre 0 (apagado) y 255 (intensidad máxima),
            produciendo un total de <strong>16.777.216 combinaciones cromáticas</strong> (256 &times; 256 &times; 256):
          </p>
          <ul className="list-disc pl-5 space-y-1 text-muted">
            <li><strong>Negro puro:</strong> <code>rgb(0, 0, 0)</code> (subpíxeles apagados).</li>
            <li><strong>Blanco puro:</strong> <code>rgb(255, 255, 255)</code> (los tres canales al máximo).</li>
            <li><strong>Rojo primario:</strong> <code>rgb(255, 0, 0)</code>.</li>
            <li><strong>Azul primario:</strong> <code>rgb(0, 0, 255)</code>.</li>
          </ul>

          <h2 className="text-xl font-bold text-foreground mt-8 mb-3">
            2. Códigos hexadecimales: Cómo leer #RRGGBB sin calculadora
          </h2>
          <p>
            El formato hexadecimal es una representación compacta en base 16 del modelo RGB, precedido por una
            almohadilla (<code>#RRGGBB</code>):
          </p>
          <div className="p-3 bg-muted/10 font-mono text-xs rounded border border-card-border overflow-x-auto">
            # 1E (Rojo: 30) 40 (Verde: 64) AF (Azul: 175) rgb(30, 64, 175)
          </div>
          <p>
            En base 16, dos dígitos abarcan desde <code>00</code> (0) hasta <code>FF</code> (255). Esto permite deducir
            colores a simple vista: <code>#FF0000</code> es rojo puro, <code>#00FF00</code> es verde lima, y cuando los
            tres pares coinciden (como <code>#808080</code>), el resultado es siempre un gris neutro.
          </p>

          <h2 className="text-xl font-bold text-foreground mt-8 mb-3">
            3. Por qué los desarrolladores prefieren HSL para diseñar
          </h2>
          <p>
            Oscurecer o aclarar un color en RGB requiere recalcular los tres canales individualmente. El modelo{' '}
            <strong>HSL (Hue, Saturation, Lightness)</strong> solventa esto representando el color según parámetros
            perceptivos humanos:
          </p>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse border border-card-border text-xs">
              <thead>
                <tr className="bg-muted/10 text-foreground">
                  <th className="p-2 border border-card-border font-semibold">Parámetro HSL</th>
                  <th className="p-2 border border-card-border font-semibold">Rango</th>
                  <th className="p-2 border border-card-border font-semibold">Significado visual</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="p-2 border border-card-border font-mono font-semibold">H (Tono / Hue)</td>
                  <td className="p-2 border border-card-border font-mono">0 a 360 grados</td>
                  <td className="p-2 border border-card-border text-muted">Rueda cromática: 0º rojo, 120º verde, 240º azul</td>
                </tr>
                <tr>
                  <td className="p-2 border border-card-border font-mono font-semibold">S (Saturación)</td>
                  <td className="p-2 border border-card-border font-mono">0% a 100%</td>
                  <td className="p-2 border border-card-border text-muted">Pureza: 0% gris apagado, 100% color puro</td>
                </tr>
                <tr>
                  <td className="p-2 border border-card-border font-mono font-semibold">L (Luminosidad)</td>
                  <td className="p-2 border border-card-border font-mono">0% a 100%</td>
                  <td className="p-2 border border-card-border text-muted">Luz: 0% negro, 50% color pleno, 100% blanco</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p>
            Con HSL, crear variantes en CSS es inmediato: para un botón <code>hsl(217, 91%, 60%)</code>, el estado hover
            se obtiene reduciendo la luminosidad a <code>hsl(217, 91%, 50%)</code> sin desajustar el matiz.
          </p>

          <h2 className="text-xl font-bold text-foreground mt-8 mb-3">
            4. La fórmula de contraste accesible y los niveles WCAG 2.1
          </h2>
          <p>
            Las <strong>Pautas de Accesibilidad Web (WCAG 2.1)</strong> calculan el contraste relacionando la luminancia
            relativa del color más claro (L1) y del color más oscuro (L2):
          </p>
          <div className="p-4 bg-card border border-card-border rounded-lg text-center font-mono text-base font-bold text-foreground">
            Ratio de contraste = (L1 + 0,05) / (L2 + 0,05)
          </div>
          <p>
            El resultado oscila entre <strong>1:1</strong> (mismo color) y <strong>21:1</strong> (negro contra blanco).
            El valor 0,05 representa la dispersión lumínica ambiental del monitor.
          </p>
          <ul className="list-disc pl-5 text-xs text-muted space-y-1">
            <li>
              <strong>Nivel AA (Estándar general):</strong> Mínimo <strong>4,5:1</strong> para texto normal y{' '}
              <strong>3,0:1</strong> para texto grande (&ge; 24 px) e interfaces interactivas.
            </li>
            <li>
              <strong>Nivel AAA (Alta exigencia):</strong> Mínimo <strong>7,0:1</strong> para texto normal y{' '}
              <strong>4,5:1</strong> para texto grande.
            </li>
          </ul>

          <h2 className="text-xl font-bold text-foreground mt-8 mb-3">
            5. Ejemplo práctico resuelto: Dos botones bajo la lupa WCAG
          </h2>
          <div className="space-y-3 border border-card-border p-4 rounded-lg bg-card text-xs text-muted">
            <h3 className="font-bold text-foreground text-sm">
              Evaluación de contraste sobre fondo blanco (#FFFFFF)
            </h3>
            <div className="p-3 bg-muted/10 rounded border border-card-border">
              <span className="font-semibold text-foreground block text-sm">
                Caso A: Azul profundo (#1E40AF) sobre fondo blanco
              </span>
              <p className="mt-1">
                Luminancia blanco: L1 = 1,000. Luminancia azul: L2 = 0,078.
              </p>
              <p className="font-mono text-foreground font-semibold mt-1">
                Ratio: (1,000 + 0,05) / (0,078 + 0,05) = 1,05 / 0,128 = <strong>8,20:1</strong>
              </p>
              <span className="text-success font-semibold block mt-1">
                &check; Supera holgadamente el Nivel AA (4,5:1) y el Nivel AAA (7,0:1).
              </span>
            </div>

            <div className="p-3 bg-muted/10 rounded border border-card-border">
              <span className="font-semibold text-foreground block text-sm">
                Caso B: Texto gris (#94A3B8) sobre fondo blanco
              </span>
              <p className="mt-1">
                Luminancia gris: L2 = 0,432.
              </p>
              <p className="font-mono text-foreground font-semibold mt-1">
                Ratio: (1,000 + 0,05) / (0,432 + 0,05) = 1,05 / 0,482 = <strong>2,18:1</strong>
              </p>
              <span className="text-danger font-semibold block mt-1">
                &cross; Suspende el Nivel AA (exige 4,5:1). Resultará ilegible en condiciones de baja luminosidad.
              </span>
            </div>
          </div>

          <h2 className="text-xl font-bold text-foreground mt-8 mb-3">
            6. Errores habituales en accesibilidad de color y cómo evitarlos
          </h2>
          <div className="space-y-3">
            <div className="p-3 border-l-4 border-danger bg-danger-light/10 rounded-r-lg">
              <h4 className="font-semibold text-danger text-xs uppercase tracking-wide">
                Error 1: Validar únicamente &quot;a ojo&quot; en pantallas de gama alta
              </h4>
              <p className="text-xs text-muted mt-1">
                Un monitor con panel calibrado disimula contrastes deficientes que en pantallas económicas o dispositivos
                móviles bajo luz natural resultan imposibles de leer. Valida siempre con ratios matemáticos objetivos.
              </p>
            </div>

            <div className="p-3 border-l-4 border-danger bg-danger-light/10 rounded-r-lg">
              <h4 className="font-semibold text-danger text-xs uppercase tracking-wide">
                Error 2: Usar el color como único indicador de información (WCAG 1.4.1)
              </h4>
              <p className="text-xs text-muted mt-1">
                Marcar un campo en rojo para señalar un error deja desprotegidas a personas con daltonismo (que afecta al 8%
                de los varones). Añade siempre un icono gráfico o un texto descriptivo explicativo.
              </p>
            </div>

            <div className="p-3 border-l-4 border-danger bg-danger-light/10 rounded-r-lg">
              <h4 className="font-semibold text-danger text-xs uppercase tracking-wide">
                Error 3: Ocultar los anillos de foco en CSS (outline: none)
              </h4>
              <p className="text-xs text-muted mt-1">
                Eliminar el indicador de foco en botones sin una alternativa visible bloquea la navegación por teclado.
                En Cifra utilizamos anillos visibles con ratio superior a 3:1 mediante la pseudoclase <code>:focus-visible</code>.
              </p>
            </div>
          </div>

          <h2 className="text-xl font-bold text-foreground mt-8 mb-3">
            7. Preguntas frecuentes sobre modelos de color y contraste
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
            Resumen práctico y herramientas vinculadas
          </h2>
          <p>
            Comprender los modelos de color permite diseñar paletas atractivas y garantizar que ningún usuario quede
            excluido por problemas de legibilidad:
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-muted">
            <li>
              Convierte cualquier color entre HEX, RGB y HSL y obtén paletas armónicas con el{' '}
              <Link href={`/herramientas/${colorTool.slug}`} className="text-accent underline font-semibold">
                Conversor de Colores
              </Link>{' '}
              de Cifra.
            </li>
            <li>
              Comprueba conversiones numéricas entre bases con el{' '}
              <Link href={`/herramientas/${converterTool.slug}`} className="text-accent underline font-semibold">
                Conversor Binario, Decimal y Hexadecimal
              </Link>
              .
            </li>
            <li>
              Descubre cómo los estándares matemáticos impactan en la informática en nuestra guía sobre{' '}
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
