import type { Metadata } from 'next';
import { ToolLayout } from '@/components/ToolComponents';
import { getRelatedTools } from '@/lib/tools';
import JsonTool from './JsonTool';

export const metadata: Metadata = {
  title: 'Formateador y Validador JSON Online (JSON Beautifier & Minifier)',
  description:
    'Formatea, valida y minifica archivos y código JSON al instante. Detección precisa de errores con línea y columna, cálculo de estadísticas y sangría configurable. 100% en tu navegador.',
  keywords: [
    'formatear json',
    'validar json',
    'json formatter',
    'json validator',
    'json beautifier',
    'minificar json',
    'json minify',
    'verificar json online',
    'corregir error json',
  ],
  alternates: {
    canonical: 'https://cifra.tools/herramientas/formateador-json',
  },
  openGraph: {
    title: 'Formateador y Validador JSON Online | Cifra',
    description:
      'Herramienta gratuita para formatear, minificar y depurar JSON con análisis sintáctico en tiempo real. Lo que introduces se procesa en tu navegador.',
    url: 'https://cifra.tools/herramientas/formateador-json',
    type: 'website',
  },
};

const FAQ_ITEMS = [
  {
    question: '¿Por qué mi JSON falla si utilizo comillas simples (\') en lugar de dobles (")?',
    answer:
      'La especificación formal de JSON (RFC 8259) establece estrictamente que tanto los nombres de las propiedades como todos los valores de tipo cadena de texto deben estar delimitados exclusivamente por comillas dobles ("). A diferencia de JavaScript u otros lenguajes de programación, las comillas simples son inválidas y causarán un error de sintaxis en cualquier parser estándar.',
  },
  {
    question: '¿Es posible incluir comentarios en un archivo JSON estándar?',
    answer:
      'No. La especificación JSON no admite comentarios (ni // ni /* */). Douglas Crockford, creador de JSON, decidió omitirlos deliberadamente para evitar que se utilizaran para almacenar directivas de parseo o metadatos que rompieran la interoperabilidad entre diferentes plataformas. Si necesitas comentarios en archivos de configuración, existen variantes alternativas como JSONC o YAML.',
  },
  {
    question: '¿Qué es una "coma final" o "trailing comma" y por qué está prohibida en JSON?',
    answer:
      'Una coma final (trailing comma) ocurre cuando se deja una coma después del último elemento de una lista o del último par clave-valor de un objeto (por ejemplo: [1, 2, 3, ] o {"a": 1, }). Aunque lenguajes modernos como JavaScript, Python o TypeScript lo permiten en su código fuente, el estándar JSON estricto lo considera un error de sintaxis.',
  },
  {
    question: '¿Qué ventajas aporta minificar un archivo JSON?',
    answer:
      'Minificar un JSON elimina todos los espacios en blanco, tabulaciones y saltos de línea innecesarios sin alterar los datos. Esto reduce el tamaño de la carga útil (payload) entre un 15% y un 45%, acelerando la transmisión a través de la red, disminuyendo el consumo de ancho de banda y optimizando la velocidad de respuesta en APIs REST y GraphQL de alto tráfico.',
  },
  {
    question: '¿Es seguro formatear archivos JSON con datos confidenciales en Cifra?',
    answer:
      'Totalmente seguro. Todas las operaciones de formateo y minificación se ejecutan directamente en tu navegador web mediante las APIs nativas de JavaScript: lo que introduces en la herramienta no se envía a ningún servidor ni queda almacenado.',
  },
];

export default function FormateadorJsonPage() {
  const relatedTools = getRelatedTools('formateador-json');

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'Formateador y Validador JSON Online',
    applicationCategory: 'DeveloperApplication',
    operatingSystem: 'Any',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
    description:
      'Herramienta gratuita para formatear, validar y minificar JSON con detección de errores por línea y columna.',
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
          ¿Qué es JSON y por qué es el estándar universal en la web?
        </h2>
        <p className="text-muted">
          <strong>JSON</strong> (acrónimo de <em>JavaScript Object Notation</em>) es un formato de
          texto abierto, ligero y agnóstico al lenguaje de programación, formalizado en los
          estándares <strong>RFC 8259</strong> y <strong>ECMA-404</strong>.
        </p>
        <p className="mt-3 text-muted">
          A pesar de haberse originado a partir de la sintaxis de objetos literales de JavaScript, JSON
          se ha consolidado como el estándar de facto para el intercambio de información estructurada
          entre servidores, microservicios, bases de datos no relacionales (como MongoDB y PostgreSQL
          JSONB) y aplicaciones web y móviles.
        </p>
      </div>

      <div className="border border-card-border rounded-lg bg-card p-5">
        <h3 className="text-base font-semibold text-foreground mb-3">
          Las cuatro reglas de oro de la sintaxis JSON
        </h3>
        <p className="text-muted mb-4">
          Para que un documento sea considerado JSON válido, debe cumplir sin excepciones las
          siguientes condiciones:
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-3 rounded-lg border border-card-border bg-background">
            <span className="font-semibold text-foreground text-xs block mb-1">
              1. Comillas dobles obligatorias
            </span>
            <p className="text-xs text-muted">
              Todas las claves de los objetos y las cadenas de texto deben utilizar comillas dobles{' '}
              <code className="font-mono text-accent">&quot;clave&quot;</code>. Las comillas simples{' '}
              <code className="font-mono text-danger">&apos;clave&apos;</code> son ilegales.
            </p>
          </div>

          <div className="p-3 rounded-lg border border-card-border bg-background">
            <span className="font-semibold text-foreground text-xs block mb-1">
              2. Prohibición de comas finales (Trailing Commas)
            </span>
            <p className="text-xs text-muted">
              Nunca debe colocarse una coma tras el último valor antes de cerrar un objeto{' '}
              <code className="font-mono text-accent">&#125;</code> o un array{' '}
              <code className="font-mono text-accent">]</code>.
            </p>
          </div>

          <div className="p-3 rounded-lg border border-card-border bg-background">
            <span className="font-semibold text-foreground text-xs block mb-1">
              3. Sin comentarios
            </span>
            <p className="text-xs text-muted">
              El parser de JSON rechazará cualquier archivo que contenga líneas comentadas mediante{' '}
              <code className="font-mono text-danger">{'//'}</code> o bloques{' '}
              <code className="font-mono text-danger">{'/* */'}</code>.
            </p>
          </div>

          <div className="p-3 rounded-lg border border-card-border bg-background">
            <span className="font-semibold text-foreground text-xs block mb-1">
              4. Tipos primitivos restringidos
            </span>
            <p className="text-xs text-muted">
              JSON solo soporta seis tipos fundamentales. No admite{' '}
              <code className="font-mono text-danger">undefined</code>,{' '}
              <code className="font-mono text-danger">NaN</code>,{' '}
              <code className="font-mono text-danger">Infinity</code> ni funciones.
            </p>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-base font-semibold text-foreground mb-3">
          Tipos de datos soportados en la especificación JSON
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 font-mono text-xs">
          <div className="p-3 border border-card-border rounded-lg bg-card">
            <span className="text-accent font-semibold block mb-1">string</span>
            <span className="text-foreground">&quot;Texto en UTF-8&quot;</span>
          </div>
          <div className="p-3 border border-card-border rounded-lg bg-card">
            <span className="text-accent font-semibold block mb-1">number</span>
            <span className="text-foreground">42, -15, 3.14159, 1.2e3</span>
          </div>
          <div className="p-3 border border-card-border rounded-lg bg-card">
            <span className="text-accent font-semibold block mb-1">boolean</span>
            <span className="text-foreground">true / false</span>
          </div>
          <div className="p-3 border border-card-border rounded-lg bg-card">
            <span className="text-accent font-semibold block mb-1">null</span>
            <span className="text-foreground">null (valor vacío)</span>
          </div>
          <div className="p-3 border border-card-border rounded-lg bg-card">
            <span className="text-accent font-semibold block mb-1">object</span>
            <span className="text-foreground">&#123; &quot;clave&quot;: valor &#125;</span>
          </div>
          <div className="p-3 border border-card-border rounded-lg bg-card">
            <span className="text-accent font-semibold block mb-1">array</span>
            <span className="text-foreground">[ 1, &quot;dos&quot;, true ]</span>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-base font-semibold text-foreground mb-3">
          Cuándo formatear y cuándo minificar: optimización en producción
        </h3>
        <ul className="space-y-2 text-muted list-disc pl-5">
          <li>
            <strong>Formatear (Beautify):</strong> Indispensable durante la fase de desarrollo,
            depuración y auditoría de respuestas de APIs. Facilita la lectura humana inmediata de
            estructuras anidadas profundas.
          </li>
          <li>
            <strong>Minificar (Minify):</strong> Recomendado para entornos de producción, caché HTTP,
            almacenamiento en disco y transferencia de payloads en redes móviles de baja latencia.
          </li>
          <li>
            <strong>Compresión Gzip / Brotli:</strong> Aunque los servidores web aplican compresión
            HTTP automáticamente, minificar el JSON previamente elimina redundancias innecesarias y
            reduce aún más el consumo total de CPU y memoria de los clientes.
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
        title="Formateador y Validador JSON"
        description="Formatea, valida y minifica código JSON con detección detallada de errores por línea y columna, sangría configurable y análisis métrico instantáneo."
        educationalContent={educationalContent}
        faq={FAQ_ITEMS}
        relatedTools={relatedTools}
      >
        <JsonTool />
      </ToolLayout>
    </>
  );
}
