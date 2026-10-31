import type { Metadata } from 'next';
import Link from 'next/link';
import TableOfContents from '@/components/TableOfContents';
import { getGuideBySlug, formatDateSpanish } from '@/lib/guides';
import { getToolBySlug } from '@/lib/tools';

const SLUG = 'como-validar-depurar-json-errores-comunes';

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

export default function JsonGuidePage() {
  const guide = getGuideBySlug(SLUG)!;
  const jsonTool = getToolBySlug('formateador-json')!;
  const urlTool = getToolBySlug('codificador-url')!;

  const faqItems = [
    {
      question: '¿Por qué JSON no admite comentarios en su especificación?',
      answer:
        'Douglas Crockford los omitió deliberadamente para evitar que desarrolladores y plataformas comenzaran a incluir directivas de parseo contextuales, lo que habría destruido la interoperabilidad entre diferentes lenguajes.',
    },
    {
      question: '¿Cómo deben almacenarse y transmitirse las fechas en JSON?',
      answer:
        'JSON no incluye tipo nativo de fecha. El estándar universal es serializarlas como cadenas bajo la norma ISO 8601 (por ejemplo, "2026-10-22T14:30:00.000Z"), lo que garantiza orden lexicográfico y parseo exacto en cualquier entorno.',
    },
    {
      question: '¿Qué diferencias existen entre JSON estándar, JSONC y JSON5?',
      answer:
        'JSONC añade soporte para comentarios simples y de bloque. JSON5 permite comentarios, claves sin comillas, comillas simples, comas colgantes y números hexadecimales. Sin embargo, en APIs REST y microservicios la norma universal sigue siendo el estándar estricto RFC 8259.',
    },
    {
      question: '¿Por qué JSON.stringify() descarta las claves con valor undefined?',
      answer:
        'Como undefined y function no forman parte de los tipos válidos del RFC 8259, JSON.stringify() los descarta silenciosamente al serializar objetos y los convierte en null dentro de arrays para producir JSON rigurosamente conforme.',
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
            <span>Estándares IETF RFC 8259 y ECMA-404</span>
          </div>
        </header>

        {/* Banner interactivo hacia la herramienta */}
        <div className="mb-8 p-4 rounded-lg bg-card border border-accent/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h4 className="text-sm font-bold text-foreground">Valida, embellece y depura tu código JSON</h4>
            <p className="text-xs text-muted">
              Comprueba la sintaxis, localiza la línea exacta de cualquier error y formatea la salida al instante.
            </p>
          </div>
          <Link
            href={`/herramientas/${jsonTool.slug}`}
            className="px-4 py-2 text-xs font-semibold rounded bg-accent text-white hover:bg-accent-hover transition-colors whitespace-nowrap"
          >
            Abrir Formateador JSON
          </Link>
        </div>

        {/* Cuerpo del artículo */}
        <TableOfContents />

        <div className="max-w-[68ch] space-y-6 text-base sm:text-lg text-slate-700 dark:text-slate-300 leading-relaxed font-sans">
          <p>
            Cualquier desarrollador que construya aplicaciones web o integre APIs se ha topado con el error:{' '}
            <code>SyntaxError: Unexpected token in JSON at position 148</code> o{' '}
            <code>Unexpected end of JSON input</code>. En el backend de una pasarela de pago o webhook, este fallo interrumpe
            transacciones y bloquea servicios en tiempo de ejecución.
          </p>
          <p>
            Aunque JSON (<em>JavaScript Object Notation</em>) nació a partir de los literales de JavaScript,{' '}
            <strong>JSON no es JavaScript</strong>. Se trata de un formato textual estricto definido formalmente en el estándar{' '}
            <strong>IETF RFC 8259</strong> y en la norma <strong>ECMA-404</strong>. Conocer sus restricciones gramaticales
            evita fallos de integración y acelera la resolución de incidencias.
          </p>

          <h2 className="text-xl font-bold text-foreground mt-8 mb-3">
            1. La gramática formal de JSON: Estructuras y tipos primitivos
          </h2>
          <p>
            La especificación RFC 8259 admite únicamente dos estructuras contenedoras y cuatro tipos de datos primitivos:
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-muted">
            <li>
              <strong>Objetos (<code>{`{}`}</code>):</strong> Pares clave-valor sin orden prefijado. Las claves deben ser cadenas
              entrecomilladas con comillas dobles, seguidas de dos puntos.
            </li>
            <li>
              <strong>Arrays (<code>[]</code>):</strong> Listas ordenadas de valores separadas por comas.
            </li>
            <li>
              <strong>Cadenas de texto:</strong> Secuencias Unicode delimitadas con comillas dobles (<code>&quot;texto&quot;</code>) con escapes
              válidos (<code>{'\\"'}</code>, <code>{'\\\\'}</code>, <code>{'\\/'}</code>, <code>{'\\n'}</code>, <code>{'\\r'}</code>, <code>{'\\t'}</code> o <code>{'\\uXXXX'}</code>).
            </li>
            <li>
              <strong>Números:</strong> Valores en base 10 con signo negativo opcional, punto decimal y notación científica (<code>1.5e3</code>).
            </li>
            <li>
              <strong>Booleanos y Nulo:</strong> Los literales en minúsculas <code>true</code>, <code>false</code> y <code>null</code>.
            </li>
          </ul>
          <p>
            Cualquier otro elemento —funciones, símbolos, expresiones regulares, valores <code>undefined</code>,{' '}
            <code>Infinity</code> o <code>NaN</code>— provoca un fallo sintáctico inmediato al parsearse.
          </p>

          <h2 className="text-xl font-bold text-foreground mt-8 mb-3">
            2. Los 5 errores de sintaxis más habituales y cómo corregirlos
          </h2>
          <p>
            La mayoría de excepciones proceden de hábitos adquiridos al programar en JavaScript o Python:
          </p>

          <div className="space-y-4 my-6 not-prose">
            <div className="p-3.5 border-l-4 border-danger bg-card rounded-r-lg shadow-sm border border-card-border">
              <h3 className="font-semibold text-danger text-xs uppercase tracking-wide">
                Fallo 1: Comas colgantes o sobrantes (Trailing Commas)
              </h3>
              <p className="text-xs text-muted mt-1 leading-relaxed">
                JavaScript o Python permiten una coma final al cierre de listas para facilitar diffs en Git. En JSON formal,
                una coma exige obligatoriamente un elemento posterior. Si el parser encuentra una coma antes de <code>{`}`}</code> o{' '}
                <code>]</code>, emitirá un error crítico.
              </p>
              <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-mono">
                <div className="p-2 rounded bg-danger/10 text-danger border border-danger/30">
                  <span className="font-bold">❌ Inválido:</span>
                  <br />
                  {`{ "nombre": "Ana", "edad": 28, }`}
                </div>
                <div className="p-2 rounded bg-accent/10 text-accent border border-accent/30">
                  <span className="font-bold">✔ Válido:</span>
                  <br />
                  {`{ "nombre": "Ana", "edad": 28 }`}
                </div>
              </div>
            </div>

            <div className="p-3.5 border-l-4 border-danger bg-card rounded-r-lg shadow-sm border border-card-border">
              <h3 className="font-semibold text-danger text-xs uppercase tracking-wide">
                Fallo 2: Uso de comillas simples en cadenas o claves
              </h3>
              <p className="text-xs text-muted mt-1 leading-relaxed">
                El RFC 8259 exige imperativamente comillas dobles (<code>&quot;</code>). Las comillas simples (<code>&apos;</code>) o acentos
                graves (<code>&#96;</code>) provocan un rechazo directo del parser.
              </p>
              <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-mono">
                <div className="p-2 rounded bg-danger/10 text-danger border border-danger/30">
                  <span className="font-bold">❌ Inválido:</span>
                  <br />
                  {`{ 'status': 'pendiente' }`}
                </div>
                <div className="p-2 rounded bg-accent/10 text-accent border border-accent/30">
                  <span className="font-bold">✔ Válido:</span>
                  <br />
                  {`{ "status": "pendiente" }`}
                </div>
              </div>
            </div>

            <div className="p-3.5 border-l-4 border-danger bg-card rounded-r-lg shadow-sm border border-card-border">
              <h3 className="font-semibold text-danger text-xs uppercase tracking-wide">
                Fallo 3: Claves de objeto sin entrecomillar
              </h3>
              <p className="text-xs text-muted mt-1 leading-relaxed">
                En JavaScript es habitual escribir <code>{`{ user: "Carlos" }`}</code>. En JSON, toda clave debe ir obligatoriamente
                entre comillas dobles para diferenciarse de identificadores de variables.
              </p>
              <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-mono">
                <div className="p-2 rounded bg-danger/10 text-danger border border-danger/30">
                  <span className="font-bold">❌ Inválido:</span>
                  <br />
                  {`{ codigo: 200, activo: true }`}
                </div>
                <div className="p-2 rounded bg-accent/10 text-accent border border-accent/30">
                  <span className="font-bold">✔ Válido:</span>
                  <br />
                  {`{ "codigo": 200, "activo": true }`}
                </div>
              </div>
            </div>

            <div className="p-3.5 border-l-4 border-danger bg-card rounded-r-lg shadow-sm border border-card-border">
              <h3 className="font-semibold text-danger text-xs uppercase tracking-wide">
                Fallo 4: Inclusión de comentarios o valores undefined
              </h3>
              <p className="text-xs text-muted mt-1 leading-relaxed">
                Introducir comentarios con <code>{"//"}</code> o <code>{"/* */"}</code> provoca que el parser falle en la primera
                barra diagonal. Del mismo modo, variables no inicializadas con valor <code>undefined</code> deben omitirse
                o sustituirse por <code>null</code> explícito.
              </p>
              <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-mono">
                <div className="p-2 rounded bg-danger/10 text-danger border border-danger/30">
                  <span className="font-bold">❌ Inválido:</span>
                  <br />
                  {`// Comentario\n{ "rol": undefined }`}
                </div>
                <div className="p-2 rounded bg-accent/10 text-accent border border-accent/30">
                  <span className="font-bold">✔ Válido:</span>
                  <br />
                  {`{ "rol": null }`}
                </div>
              </div>
            </div>

            <div className="p-3.5 border-l-4 border-danger bg-card rounded-r-lg shadow-sm border border-card-border">
              <h3 className="font-semibold text-danger text-xs uppercase tracking-wide">
                Fallo 5: Números con ceros a la izquierda o formato hexadecimal
              </h3>
              <p className="text-xs text-muted mt-1 leading-relaxed">
                Valores como <code>0123</code> o <code>0xFF</code> violan las normas de representación numérica de JSON.
                Los números enteros no pueden comenzar por cero a menos que el valor total sea exactamente 0.
              </p>
            </div>
          </div>

          <h2 className="text-xl font-bold text-foreground mt-8 mb-3">
            3. La trampa silenciosa: Números de 64 bits y pérdida de precisión
          </h2>
          <p>
            Existe un problema muy peligroso que no genera ningún error sintáctico pero destruye datos en silencio:{' '}
            <strong>los identificadores numéricos de 64 bits</strong>.
          </p>
          <p>
            Tanto JavaScript como la mayoría de librerías de cliente representan los números bajo la especificación IEEE 754
            de doble precisión (64 bits). Esto significa que el entero seguro más alto representable sin redondeo es:{' '}
            <code>Number.MAX_SAFE_INTEGER</code> = 2⁵³ - 1 = <strong>9.007.199.254.740.991</strong>.
          </p>
          <p>
            Muchos sistemas backend (bases de datos con columnas <code>BIGINT</code> en PostgreSQL o IDs distribuidos como los
            Snowflake de Discord y Twitter) generan identificadores superiores a este límite, como por ejemplo{' '}
            <code>9007199254740993</code>. Al ejecutar <code>JSON.parse()</code> en el navegador, el motor redondeará el valor
            a <code>9007199254740992</code>, alterando el ID sin lanzar ninguna advertencia.
          </p>
          <div className="p-3 bg-card border border-card-border rounded-lg text-xs font-mono">
            <p className="text-muted mb-1">{"// Problema al parsear identificadores de 64 bits en frontend:"}</p>
            <p className="text-danger">JSON.parse(&apos;{`{ "userId": 9007199254740993 }`}&apos;)</p>
            <p className="text-muted mt-1">{"// Resultado devuelto por el motor JS (valor corrompido):"}</p>
            <p className="text-accent">{`{ userId: 9007199254740992 }`}</p>
          </div>
          <p>
            <strong>Regla de oro para arquitecturas de APIs:</strong> Todos los identificadores <code>BIGINT</code>, números de
            tarjeta de crédito y hashes deben enviarse siempre serializados como cadenas de texto (<code>&quot;9007199254740993&quot;</code>).
          </p>

          <h2 className="text-xl font-bold text-foreground mt-8 mb-3">
            4. Caso práctico resuelto: Depuración de una respuesta de API rota
          </h2>
          <p>
            Imaginemos una respuesta HTTP defectuosa recibida desde un servicio de sincronización externo que bloquea nuestra
            aplicación:
          </p>

          <div className="p-3 bg-card border border-danger/40 rounded-lg text-xs font-mono text-muted space-y-1">
            <p className="text-danger font-bold">{"// Payload erróneo recibido:"}</p>
            <p>{`{`}</p>
            <p className="pl-4">{`'status': "success",`} {"// Estado de la transacción"}</p>
            <p className="pl-4">{`transaccion_id: 9007199254740995,`}</p>
            <p className="pl-4">{`"importe": 149.50,`}</p>
            <p className="pl-4">{`"detalles": undefined,`}</p>
            <p className="pl-4">{`"items": ["Licencia Anual", "Soporte Premium",],`}</p>
            <p>{`}`}</p>
          </div>

          <p>
            Al pasar este texto por el{' '}
            <Link href={`/herramientas/${jsonTool.slug}`} className="text-accent underline font-semibold">
              Formateador JSON de Cifra
            </Link>
            , el validador identifica secuencialmente las infracciones y nos permite subsanarlas paso a paso:
          </p>

          <ol className="list-decimal pl-5 space-y-1.5 text-muted">
            <li>
              <strong>Línea 2:</strong> Reemplazamos la comilla simple de <code>&apos;status&apos;</code> por comillas dobles{' '}
              <code>&quot;status&quot;</code> y eliminamos el comentario <code>{"//"}</code>.
            </li>
            <li>
              <strong>Línea 3:</strong> Entrecomillamos la propiedad <code>&quot;transaccion_id&quot;</code> y convertimos el número
              extenso a cadena para preservar su integridad de 64 bits.
            </li>
            <li>
              <strong>Línea 5:</strong> Sustituimos el identificador no válido <code>undefined</code> por el literal{' '}
              <code>null</code>.
            </li>
            <li>
              <strong>Línea 6:</strong> Eliminamos la coma colgante tras el segundo elemento del array de items.
            </li>
          </ol>

          <div className="p-3 bg-card border border-accent/40 rounded-lg text-xs font-mono text-muted space-y-1">
            <p className="text-accent font-bold">{"// Estructura depurada y validada (RFC 8259):"}</p>
            <p>{`{`}</p>
            <p className="pl-4">{`"status": "success",`}</p>
            <p className="pl-4">{`"transaccion_id": "9007199254740995",`}</p>
            <p className="pl-4">{`"importe": 149.5,`}</p>
            <p className="pl-4">{`"detalles": null,`}</p>
            <p className="pl-4">{`"items": [`}</p>
            <p className="pl-8">{`"Licencia Anual",`}</p>
            <p className="pl-8">{`"Soporte Premium"`}</p>
            <p className="pl-4">{`]`}</p>
            <p>{`}`}</p>
          </div>

          <h2 className="text-xl font-bold text-foreground mt-8 mb-3">
            5. Minificación vs Formateo: Optimización en red
          </h2>
          <p>
            Durante la fase de desarrollo, una indentación legible de 2 o 4 espacios resulta esencial para inspeccionar
            objetos anidados. Sin embargo, en entornos de producción los saltos de línea y espacios en blanco son caracteres
            superfluos que incrementan innecesariamente el consumo de ancho de banda.
          </p>
          <p>
            La <strong>minificación</strong> retira todos los espacios innecesarios fuera de cadenas sin alterar en absoluto la
            semántica del contenido. En documentos de gran volumen con miles de registros (como catálogos de comercio electrónico
            o exportaciones de bases de datos), la minificación reduce el tamaño del payload entre un 20% y un 40% antes de
            la compresión gzip o Brotli en tránsito.
          </p>

          <h2 className="text-xl font-bold text-foreground mt-8 mb-3">
            6. Preguntas frecuentes sobre validación y depuración JSON
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
            Validar la sintaxis de tus datos y respetar las normas del estándar RFC 8259 garantiza una integración robusta
            y previene fallos silenciosos en producción:
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-muted">
            <li>
              Valida la sintaxis, formatea y minifica tus estructuras en tiempo real con el{' '}
              <Link href={`/herramientas/${jsonTool.slug}`} className="text-accent underline font-semibold">
                Formateador JSON
              </Link>{' '}
              de Cifra.
            </li>
            <li>
              Si necesitas enviar cargas JSON en parámetros de consulta de una URL, codifícalas de forma segura con el{' '}
              <Link href={`/herramientas/${urlTool.slug}`} className="text-accent underline font-semibold">
                Codificador URL
              </Link>
              .
            </li>
            <li>
              Aprende cómo empaquetar datos binarios o tokens dentro de cadenas JSON en nuestra guía técnica sobre{' '}
              <Link
                href="/guias/que-es-base64-para-que-sirve-y-cuando-usarlo"
                className="text-accent underline font-semibold"
              >
                Qué es Base64, para qué sirve y cuándo utilizarlo
              </Link>
              .
            </li>
          </ul>
        </div>
      </article>
    </main>
  );
}
