import type { Metadata } from 'next';
import Link from 'next/link';
import TableOfContents from '@/components/TableOfContents';
import { getGuideBySlug, formatDateSpanish } from '@/lib/guides';
import { getToolBySlug } from '@/lib/tools';

const SLUG = 'que-es-base64-para-que-sirve-y-cuando-usarlo';

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

export default function Base64GuidePage() {
  const guide = getGuideBySlug(SLUG)!;
  const base64Tool = getToolBySlug('codificador-base64')!;
  const converterTool = getToolBySlug('conversor-binario-decimal-hexadecimal')!;

  const faqItems = [
    {
      question: '¿Base64 es una forma de cifrado?',
      answer:
        'No. Base64 es un sistema de codificación de transporte, no de cifrado. Cualquier sistema informático o usuario puede decodificarlo de forma instantánea sin contraseña. Emplearlo para ocultar contraseñas o datos personales supone una grave brecha de seguridad.',
    },
    {
      question: '¿Por qué Base64 aumenta el peso del archivo un 33%?',
      answer:
        'Porque empaqueta grupos de 3 bytes (24 bits) en 4 caracteres imprimibles de 6 bits cada uno. Para enviar la misma información se transmiten 4 caracteres por cada 3 bytes originales, lo que genera un sobrecoste fijo del 33,33% (4/3 = 1,333...).',
    },
    {
      question: '¿Qué significan los signos de igual (= o ==) al final?',
      answer:
        'Indican bytes de relleno (padding). Si los datos originales no son múltiplo exacto de 3 bytes, el algoritmo añade bytes de relleno para completar el bloque y coloca un signo igual si sobraban 2 bytes, o dos signos si sobraba 1 byte.',
    },
    {
      question: '¿Qué diferencia hay entre Base64 estándar y Base64URL?',
      answer:
        'El estándar clásico (RFC 4648) emplea los símbolos + y /, reservados en URLs. La variante Base64URL sustituye el signo + por un guion (-) y la barra / por un guion bajo (_), eliminando además el padding para viajar de forma segura en tokens JWT y direcciones web.',
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
            <span>Estándar IETF RFC 4648</span>
          </div>
        </header>

        {/* Banner interactivo hacia la herramienta */}
        <div className="mb-8 p-4 rounded-lg bg-card border border-accent/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h4 className="text-sm font-bold text-foreground">¿Necesitas codificar o decodificar Base64 al instante?</h4>
            <p className="text-xs text-muted">
              Convierte textos, archivos o fragmentos binarios con soporte completo UTF-8 en tu propio navegador.
            </p>
          </div>
          <Link
            href={`/herramientas/${base64Tool.slug}`}
            className="px-4 py-2 text-xs font-semibold rounded bg-accent text-white hover:bg-accent-hover transition-colors whitespace-nowrap"
          >
            Abrir Codificador Base64
          </Link>
        </div>

        {/* Cuerpo del artículo */}
        <TableOfContents />

        <div className="max-w-[68ch] space-y-6 text-base sm:text-lg text-slate-700 dark:text-slate-300 leading-relaxed font-sans">
          <p>
            Si alguna vez has inspeccionado una hoja de estilos CSS, un token web JSON (JWT) o un correo electrónico en
            su formato fuente original, con seguridad te habrás topado con una cadena densa de caracteres alfanuméricos
            que remata con uno o dos signos de igual (<code>==</code>). Es Base64 en acción. Pero, ¿por qué los ingenieros
            de software convierten datos binarios en texto si esa operación incrementa el peso del archivo en un 33%?
          </p>
          <p>
            La respuesta no responde a una moda: Base64 nació para solucionar un problema crítico de compatibilidad en los
            canales de comunicación de Internet que amenazaba con corromper cualquier archivo binario en tránsito.
          </p>

          <h2 className="text-xl font-bold text-foreground mt-8 mb-3">
            1. El problema histórico de los canales de texto de 7 bits
          </h2>
          <p>
            En los inicios de Internet, protocolos como SMTP (el estándar de correo electrónico) fueron diseñados
            exclusivamente para transportar texto en inglés codificado en <strong>ASCII de 7 bits</strong> (valores de 0 a 127).
          </p>
          <p>
            Cuando los usuarios necesitaron enviar archivos adjuntos (imágenes, ejecutables o documentos comprimidos),
            los servidores antiguos mutilaban el octavo bit de cada byte o interpretaban secuencias de control (como el byte
            nulo <code>0x00</code> o retornos de línea) como órdenes del protocolo, corrompiendo el archivo.
          </p>
          <p>
            La solución fue diseñar un algoritmo que tomase cualquier flujo binario y lo tradujese a un subconjunto
            restringido de 64 caracteres imprimibles universales, formalizado en el estándar <strong>RFC 4648</strong>.
          </p>

          <h2 className="text-xl font-bold text-foreground mt-8 mb-3">
            2. La matemática de Base64: Cómo convertir 8 bits en 6 bits
          </h2>
          <p>
            El mecanismo de Base64 descansa en una correspondencia matemática directa:
          </p>
          <ul className="list-disc pl-5 space-y-1 text-muted">
            <li>Un byte de datos consta de <strong>8 bits</strong> (256 combinaciones posibles).</li>
            <li>El alfabeto Base64 contiene exactamente <strong>64 símbolos</strong> ($2^6 = 64$ combinaciones).</li>
            <li>Por tanto, cada carácter Base64 representa exactamente <strong>6 bits</strong> de información.</li>
          </ul>
          <p>
            Para emparejar ambos formatos, el algoritmo agrupa <strong>3 bytes de entrada</strong> (3 &times; 8 = 24 bits)
            y los redistribuye en <strong>4 bloques de 6 bits</strong> (4 &times; 6 = 24 bits). Cada bloque de 6 bits toma
            un valor entre 0 y 63, sustituyéndose por el carácter de la tabla oficial:
          </p>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse border border-card-border text-xs">
              <thead>
                <tr className="bg-muted/10 text-foreground">
                  <th className="p-2 border border-card-border font-semibold">Índice</th>
                  <th className="p-2 border border-card-border font-semibold">Símbolos</th>
                  <th className="p-2 border border-card-border font-semibold">Rango binario (6 bits)</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="p-2 border border-card-border font-mono">0 a 25</td>
                  <td className="p-2 border border-card-border font-mono font-semibold">A - Z (Mayúsculas)</td>
                  <td className="p-2 border border-card-border font-mono">000000 a 011001</td>
                </tr>
                <tr>
                  <td className="p-2 border border-card-border font-mono">26 a 51</td>
                  <td className="p-2 border border-card-border font-mono font-semibold">a - z (Minúsculas)</td>
                  <td className="p-2 border border-card-border font-mono">011010 a 110011</td>
                </tr>
                <tr>
                  <td className="p-2 border border-card-border font-mono">52 a 61</td>
                  <td className="p-2 border border-card-border font-mono font-semibold">0 - 9 (Dígitos)</td>
                  <td className="p-2 border border-card-border font-mono">110100 a 111101</td>
                </tr>
                <tr>
                  <td className="p-2 border border-card-border font-mono">62 y 63</td>
                  <td className="p-2 border border-card-border font-mono font-semibold">+ y / (Estándar RFC 4648)</td>
                  <td className="p-2 border border-card-border font-mono">111110 y 111111</td>
                </tr>
              </tbody>
            </table>
          </div>

          <h2 className="text-xl font-bold text-foreground mt-8 mb-3">
            3. Ejemplo práctico resuelto: Codificando la palabra &quot;Sol&quot;
          </h2>
          <div className="space-y-3 border border-card-border p-4 rounded-lg bg-card">
            <h3 className="font-bold text-foreground text-sm">
              Conversión manual de &quot;Sol&quot; a Base64 paso a paso
            </h3>
            <ol className="list-decimal pl-5 text-xs text-muted space-y-1.5">
              <li>
                <strong>Valores ASCII y binarios de 8 bits:</strong> &apos;S&apos; = 83 (01010011), &apos;o&apos; = 111
                (01101111), &apos;l&apos; = 108 (01101100).
              </li>
              <li>
                <strong>Unión de los 24 bits continuos:</strong> <code>010100110110111101101100</code>.
              </li>
              <li>
                <strong>División en 4 grupos de 6 bits:</strong>
                <ul className="list-disc pl-5 mt-1 font-mono text-foreground space-y-0.5">
                  <li>010100 = 20 en decimal Carácter <strong>&apos;U&apos;</strong></li>
                  <li>110110 = 54 en decimal Carácter <strong>&apos;2&apos;</strong></li>
                  <li>111101 = 61 en decimal Carácter <strong>&apos;9&apos;</strong></li>
                  <li>101100 = 44 en decimal Carácter <strong>&apos;s&apos;</strong></li>
                </ul>
              </li>
              <li>
                <strong>Resultado:</strong> &quot;Sol&quot; codificado en Base64 es exactamente{' '}
                <code className="text-foreground font-mono font-bold">U29s</code>.
              </li>
            </ol>
          </div>

          <h2 className="text-xl font-bold text-foreground mt-8 mb-3">
            4. El misterio del padding: ¿Por qué aparecen los signos &quot;=&quot;?
          </h2>
          <p>
            Cuando la entrada no contiene un múltiplo exacto de 3 bytes (por ejemplo, &quot;Hola&quot;, que tiene 4 bytes):
          </p>
          <ul className="list-disc pl-5 space-y-1 text-muted">
            <li>Los primeros 3 bytes (&quot;Hol&quot;) forman 4 caracteres Base64 (<code>SG9s</code>).</li>
            <li>Sobra 1 byte final (&apos;a&apos;). Sus 8 bits se completan con ceros para formar 2 sextetos, y los dos
            espacios vacíos restantes del bloque de 4 caracteres se rellenan con signos <code>=</code>.</li>
            <li>El resultado para &quot;Hola&quot; es <code className="font-mono text-foreground font-bold">SG9sYQ==</code>.</li>
          </ul>
          <p>
            El carácter <code>=</code> permite al receptor descartar los ceros de relleno y recuperar la longitud exacta del archivo original.
          </p>

          <h2 className="text-xl font-bold text-foreground mt-8 mb-3">
            5. Casos de uso reales recomendados
          </h2>
          <ul className="list-disc pl-5 space-y-1.5 text-muted">
            <li>
              <strong>Data URIs para iconos SVG:</strong> Incrusta pequeños gráficos vectoriales en HTML o CSS (<code>data:image/svg+xml;base64,...</code>)
              ahorrando peticiones HTTP en recursos críticos.
            </li>
            <li>
              <strong>Tokens JWT (JSON Web Tokens):</strong> La cabecera y el payload viajan codificados en Base64URL dentro de cabeceras HTTP de autenticación.
            </li>
            <li>
              <strong>Certificados y claves criptográficas:</strong> El formato PEM almacena claves privadas RSA y certificados SSL en bloques legibles Base64.
            </li>
            <li>
              <strong>Cargas útiles binarias en APIs JSON:</strong> Permite transmitir pequeñas firmas digitales o avatares dentro de objetos JSON estándar.
            </li>
          </ul>

          <h2 className="text-xl font-bold text-foreground mt-8 mb-3">
            6. Errores habituales con Base64 y cómo evitarlos
          </h2>
          <div className="space-y-3">
            <div className="p-3 border-l-4 border-danger bg-danger-light/10 rounded-r-lg">
              <h4 className="font-semibold text-danger text-xs uppercase tracking-wide">
                Error 1: Confundir Base64 con cifrado de seguridad
              </h4>
              <p className="text-xs text-muted mt-1">
                Base64 <strong>no protege datos confidenciales</strong>. Revertirlo es instantáneo sin contraseñas ni claves.
                Nunca almacenes credenciales o información privada en Base64 sin cifrado previo con algoritmos reales como AES-256.
              </p>
            </div>

            <div className="p-3 border-l-4 border-danger bg-danger-light/10 rounded-r-lg">
              <h4 className="font-semibold text-danger text-xs uppercase tracking-wide">
                Error 2: Incrustar imágenes pesadas en código CSS o HTML
              </h4>
              <p className="text-xs text-muted mt-1">
                Convertir una foto de 500 KB a Base64 generará más de 660 KB de texto, bloqueando el renderizado de la página
                y desaprovechando la caché del navegador. Limita su uso a iconos o recursos menores de 2 KB.
              </p>
            </div>

            <div className="p-3 border-l-4 border-danger bg-danger-light/10 rounded-r-lg">
              <h4 className="font-semibold text-danger text-xs uppercase tracking-wide">
                Error 3: Fallos con caracteres especiales UTF-8 en JavaScript
              </h4>
              <p className="text-xs text-muted mt-1">
                La función nativa <code>btoa()</code> solo acepta caracteres Latin-1. Al procesar tildes, la letra &apos;ñ&apos; o
                emojis lanza una excepción. Nuestra herramienta resuelve este problema convirtiendo primero la cadena a bytes
                UTF-8 antes de procesar los bloques.
              </p>
            </div>
          </div>

          <h2 className="text-xl font-bold text-foreground mt-8 mb-3">
            7. Preguntas frecuentes sobre Base64
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
            Resumen técnico y herramientas vinculadas
          </h2>
          <p>
            En conclusión: Base64 es el estándar universal para transportar flujos binarios sobre canales diseñados para
            texto, asumiendo un recargo predecible del 33% en tamaño.
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-muted">
            <li>
              Codifica o decodifica cualquier cadena o archivo con nuestro{' '}
              <Link href={`/herramientas/${base64Tool.slug}`} className="text-accent underline font-semibold">
                Codificador y Decodificador Base64
              </Link>{' '}
              con soporte UTF-8 en tiempo real.
            </li>
            <li>
              Comprueba la representación en binario y hexadecimal en el{' '}
              <Link href={`/herramientas/${converterTool.slug}`} className="text-accent underline font-semibold">
                Conversor Binario, Decimal y Hexadecimal
              </Link>
              .
            </li>
            <li>
              Aprende cómo se protegen contraseñas en bases de datos en nuestra guía sobre{' '}
              <Link
                href="/guias/guia-seguridad-contrasenas-entropia"
                className="text-accent underline font-semibold"
              >
                Seguridad de contraseñas y cálculo de entropía
              </Link>
              .
            </li>
          </ul>
        </div>
      </article>
    </main>
  );
}
