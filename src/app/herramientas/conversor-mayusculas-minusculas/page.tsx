import type { Metadata } from 'next';
import { ToolLayout } from '@/components/ToolComponents';
import { getRelatedTools, getToolBySlug } from '@/lib/tools';
import CaseConverter from './CaseConverter';

const TOOL_SLUG = 'conversor-mayusculas-minusculas';
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
    question: '¿Las letras mayúsculas deben llevar tilde según las normas de la RAE?',
    answer:
      'Sí, rotundamente. La Real Academia Española (RAE) establece de forma preceptiva que las letras mayúsculas están sujetas a las mismas reglas de acentuación gráfica que las minúsculas, lleven o no tilde (Á, É, Í, Ó, Ú). La antigua práctica de no acentuarlas se debía únicamente a limitaciones mecánicas en las máquinas de escribir y tipos de imprenta de plomo, problema inexistente en la tipografía digital.',
  },
  {
    question: '¿Cuál es la diferencia entre Title Case y Capitalizar Oraciones en español?',
    answer:
      '«Title Case» (Formato Título) capitaliza la primera letra de cada palabra individual, una convención típica de la lengua inglesa. En cambio, en español la norma ortográfica de la RAE dicta el uso de «Capitalizar Oraciones» (Sentence Case), donde solo se escribe con mayúscula inicial la primera palabra del título y los nombres propios contenidos en él.',
  },
  {
    question: '¿Qué es el formato aLtErNaDo y para qué se suele utilizar?',
    answer:
      'El texto alternado («spongecase» o «mocking case») alterna de forma consecutiva letras mayúsculas y minúsculas. Es un recurso muy popular en redes sociales, foros y memes para transmitir ironía, sarcasmo o una voz burlona al citar una frase.',
  },
  {
    question: '¿Para qué sirven kebab-case y snake_case?',
    answer:
      'Son convenciones de nomenclatura en programación y desarrollo web: «kebab-case» separa las palabras mediante guiones (muy utilizado para crear URLs legibles y amigables para el SEO, así como clases CSS); «snake_case» emplea guiones bajos y es la convención habitual para nombres de variables y columnas en bases de datos SQL y Python.',
  },
  {
    question: '¿Se envía el texto a algún servidor externo para su procesamiento?',
    answer:
      'No. La conversión se produce al 100% de manera local en tu navegador utilizando JavaScript nativo. Cifra garantiza la máxima privacidad: ningún fragmento de tu texto sale jamás de tu dispositivo.',
  },
];

export default function ConversorMayusculasMinusculasPage() {
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
          ¿Cómo utilizar y cuándo aplicar cada formato de texto?
        </h2>
        <p className="text-sm leading-relaxed text-muted">
          Transformar texto entre diferentes formatos ortográficos y de programación ahorra tiempo al
          corregir textos escritos por error con el bloqueo de mayúsculas activado, estandarizar títulos
          editoriales o normalizar identificadores en código y bases de datos.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="border border-card-border rounded-lg bg-card p-5">
          <h3 className="text-base font-semibold text-foreground mb-2">
            Formatos editoriales y de redacción
          </h3>
          <ul className="text-sm text-muted space-y-2.5 list-disc pl-5">
            <li>
              <strong className="text-foreground">MAYÚSCULAS (Uppercase):</strong> Utilizadas en
              acrónimos (ONU, NASA, HTML), advertencias críticas o cabeceras de tablas. En redacción
              general o correos electrónicos, escribir oraciones completas en mayúsculas equivale a
              gritar y dificulta la legibilidad.
            </li>
            <li>
              <strong className="text-foreground">minúsculas (Lowercase):</strong> Indispensables
              para direcciones de correo electrónico, nombres de dominios web y extensiones de
              archivo (.png, .json).
            </li>
            <li>
              <strong className="text-foreground">Capitalizar Oraciones (Sentence Case):</strong> La
              regla de oro en español. Pone en mayúscula la letra inicial tras punto, signo de cierre
              de interrogación o exclamación, o al inicio de párrafo.
            </li>
            <li>
              <strong className="text-foreground">Title Case (Cada Palabra):</strong> Pone en
              mayúscula la primera letra de cada vocablo. Estándar en la prensa inglesa, aunque en
              español suele reservarse a nombres de marcas o eventos comerciales.
            </li>
          </ul>
        </div>

        <div className="border border-card-border rounded-lg bg-card p-5">
          <h3 className="text-base font-semibold text-foreground mb-2">
            Formatos técnicos para programadores (Clean Code)
          </h3>
          <ul className="text-sm text-muted space-y-2.5 list-disc pl-5">
            <li>
              <strong className="text-foreground">kebab-case:</strong> Palabras en minúsculas unidas
              por guiones medios (<code className="text-xs bg-code-bg px-1 py-0.5 rounded font-mono">mi-articulo-seo</code>).
              Es el formato preferido por Google para slugs de URLs y atributos CSS.
            </li>
            <li>
              <strong className="text-foreground">snake_case:</strong> Palabras en minúsculas unidas
              por guiones bajos (<code className="text-xs bg-code-bg px-1 py-0.5 rounded font-mono">nombre_usuario</code>).
              Estándar en bases de datos relacionales, Python y archivos de configuración YAML.
            </li>
            <li>
              <strong className="text-foreground">camelCase:</strong> La primera palabra en minúscula
              y las siguientes con inicial mayúscula (<code className="text-xs bg-code-bg px-1 py-0.5 rounded font-mono">calcularTotalPedido</code>).
              Estándar de facto en JavaScript, TypeScript, Java y APIs JSON.
            </li>
            <li>
              <strong className="text-foreground">Invertir mayús/minús (Toggle Case):</strong>{' '}
              Convierte mayúsculas a minúsculas y viceversa. Es la solución perfecta para textos
              redactados mientras se mantenía pulsada la tecla Bloq Mayús por error.
            </li>
          </ul>
        </div>
      </div>

      <div className="border border-card-border rounded-lg bg-card p-5">
        <h3 className="text-base font-semibold text-foreground mb-2">
          Ortografía y acentuación de mayúsculas en español (Normativa RAE)
        </h3>
        <p className="text-sm text-muted leading-relaxed mb-3">
          Existe el mito extendido de que las mayúsculas están exentas de llevar tilde. La Real Academia
          Española señala explícitamente en su <em>Ortografía de la lengua española</em>:
        </p>
        <blockquote className="border-l-4 border-accent pl-4 text-sm italic text-foreground/80 my-3">
          «Las letras mayúsculas, tanto si se trata de iniciales como si se integran en una palabra escrita
          enteramente en mayúsculas, deben llevar tilde si así les corresponde según las reglas de acentuación:
          África, PERÚ, ÓRGANO.»
        </blockquote>
        <p className="text-sm text-muted leading-relaxed">
          Nuestra herramienta procesa fielmente los caracteres especiales del idioma español,
          preservando las tildes tanto al pasar de minúsculas a mayúsculas como a la inversa.
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
        <CaseConverter />
      </ToolLayout>
    </>
  );
}
