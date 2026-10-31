import type { Metadata } from 'next';
import Link from 'next/link';
import TableOfContents from '@/components/TableOfContents';
import { getGuideBySlug, formatDateSpanish } from '@/lib/guides';
import { getToolBySlug } from '@/lib/tools';

const SLUG = 'diferencias-md5-sha1-sha256-sha512-guia-hashes';

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

export default function HashGuidePage() {
  const guide = getGuideBySlug(SLUG)!;
  const hashTool = getToolBySlug('generador-hash')!;
  const pwdTool = getToolBySlug('generador-contrasenas')!;

  const faqItems = [
    {
      question: '¿Por qué MD5 y SHA-1 ya no se consideran seguros?',
      answer:
        'Porque ambos algoritmos carecen de resistencia a colisiones práctica. Investigadores y atacantes han demostrado que es posible generar dos archivos completamente diferentes con el mismo hash exacto en pocas horas o minutos, lo que permite falsificar firmas digitales, manipular código ejecutable o suplantar certificados SSL.',
    },
    {
      question: '¿Es posible recuperar el texto original a partir de su hash (deshashear)?',
      answer:
        'No de forma matemática directa. Las funciones hash son estrictamente unidireccionales (de un solo sentido) y descartan información durante su compresión interna. Los sitios que aseguran descifrar hashes únicamente consultan tablas precalculadas (rainbow tables) donde guardan pares conocidos de textos y hashes habituales.',
    },
    {
      question: '¿Por qué SHA-512 puede ser más rápido que SHA-256 en ordenadores modernos?',
      answer:
        'Porque SHA-512 opera internamente con palabras de 64 bits, coincidiendo con la arquitectura de registros nativa de los procesadores actuales (x86-64 y ARM64), mientras que SHA-256 opera con palabras de 32 bits y requiere más instrucciones de CPU para procesar grandes bloques de datos.',
    },
    {
      question: '¿Cómo puedo verificar el hash SHA-256 de un archivo en mi sistema operativo?',
      answer:
        'En Linux y macOS puedes abrir la terminal y ejecutar "sha256sum nombre_archivo" o "shasum -a 256 nombre_archivo". En Windows puedes abrir PowerShell y ejecutar "Get-FileHash nombre_archivo -Algorithm SHA256", comparando el resultado hexadecimal con el proporcionado por el distribuidor del archivo.',
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
            <span>Estándares NIST FIPS 180-4 e IETF RFC 1321</span>
          </div>
        </header>

        {/* Banner interactivo hacia la herramienta */}
        <div className="mb-8 p-4 rounded-lg bg-card border border-accent/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h4 className="text-sm font-bold text-foreground">Calcula hashes criptográficos en tiempo real</h4>
            <p className="text-xs text-muted">
              Genera resúmenes MD5, SHA-1, SHA-256 y SHA-512 en tu propio navegador con Web Crypto API.
            </p>
          </div>
          <Link
            href={`/herramientas/${hashTool.slug}`}
            className="px-4 py-2 text-xs font-semibold rounded bg-accent text-white hover:bg-accent-hover transition-colors whitespace-nowrap"
          >
            Abrir Generador de Hashes
          </Link>
        </div>

        {/* Cuerpo del artículo */}
        <TableOfContents />

        <div className="max-w-[68ch] space-y-6 text-base sm:text-lg text-slate-700 dark:text-slate-300 leading-relaxed font-sans">
          <p>
            ¿Por qué al descargar una imagen ISO de Linux te sugieren comprobar una cadena hexadecimal de 64 caracteres,
            pero si un desarrollador utiliza MD5 para almacenar contraseñas salta de inmediato una alerta de seguridad crítica?
            Aunque a simple vista todas las funciones hash producen secuencias de aspecto similar, sus garantías matemáticas
            y su resistencia ante ataques difieren de forma radical.
          </p>
          <p>
            Comprender las diferencias entre MD5, SHA-1, SHA-256 y SHA-512 es indispensable para cualquier profesional que
            diseñe APIs, verifique la integridad de copias de seguridad o configure canales seguros TLS/HTTPS.
          </p>

          <h2 className="text-xl font-bold text-foreground mt-8 mb-3">
            1. ¿Qué es una función hash criptográfica?
          </h2>
          <p>
            Una función hash es un algoritmo matemático determinista que transforma una entrada de datos de cualquier tamaño
            (desde una sola letra hasta una base de datos de varios gigabytes) en una salida de longitud fija, denominada{' '}
            <strong>resumen (digest)</strong> o huella digital.
          </p>
          <p>
            Para considerarse apta en seguridad informática, una función hash debe cumplir cuatro propiedades obligatorias:
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-muted">
            <li>
              <strong>Determinismo estricto:</strong> La misma entrada produce siempre exactamente el mismo hash.
            </li>
            <li>
              <strong>Efecto avalancha:</strong> Modificar un solo bit en la entrada altera de forma imprevisible más del 50%
              de los bits de salida.
            </li>
            <li>
              <strong>Resistencia a preimagen (unidireccionalidad):</strong> Debe ser computacionalmente imposible deducir el
              mensaje original a partir de su hash resultante.
            </li>
            <li>
              <strong>Resistencia a colisiones:</strong> Debe resultar inviable encontrar dos mensajes distintos que generen
              el mismo hash exacto ($H(m1) = H(m2)$).
            </li>
          </ul>

          <h2 className="text-xl font-bold text-foreground mt-8 mb-3">
            2. La caída histórica de MD5 y SHA-1
          </h2>
          <p>
            Durante las décadas de 1990 y 2000, MD5 y SHA-1 dominaron Internet. Sin embargo, ambos algoritmos fueron rotos
            en ataques reales con graves repercusiones en la industria:
          </p>
          <div className="space-y-3">
            <div className="p-3 bg-muted/10 rounded-lg border border-card-border">
              <h4 className="font-semibold text-foreground text-xs">
                MD5 (Message Digest 5 - Ron Rivest, 1991): Roto por colisión práctica
              </h4>
              <p className="text-xs text-muted mt-1 leading-relaxed">
                MD5 genera resúmenes de 128 bits (32 caracteres hexadecimales). En 2004, la investigadora china Xiaoyun Wang
                demostró cómo generar colisiones en minutos. El caso más célebre ocurrió en 2012 con el ciberataque{' '}
                <strong>Flame</strong>, un malware sofisticado que utilizó una colisión de prefijo elegido en MD5 para
                falsificar un certificado de firma de código de Microsoft y firmar sus módulos como legítimos. Hoy MD5 solo es
                tolerable como suma de comprobación no crítica contra errores aleatorios de red.
              </p>
            </div>

            <div className="p-3 bg-muted/10 rounded-lg border border-card-border">
              <h4 className="font-semibold text-foreground text-xs">
                SHA-1 (Secure Hash Algorithm 1 - NSA, 1995): El ataque SHAttered
              </h4>
              <p className="text-xs text-muted mt-1 leading-relaxed">
                Diseñado con salida de 160 bits (40 caracteres hex), SHA-1 resistió durante años hasta que en 2017 Google y el
                instituto CWI de Ámsterdam anunciaron el ataque <strong>SHAttered</strong>: crearon dos documentos PDF con
                contenido visual totalmente diferente pero con el mismo hash SHA-1 idéntico. Tras este hito, los navegadores
                bloquearon definitivamente los certificados SSL firmados con SHA-1 y Git migró sus objetos internos a SHA-256.
              </p>
            </div>
          </div>

          <h2 className="text-xl font-bold text-foreground mt-8 mb-3">
            3. La familia SHA-2: El estándar moderno (FIPS 180-4)
          </h2>
          <p>
            Para sustituir los algoritmos vulnerables, el NIST estandarizó la familia <strong>SHA-2</strong>, basada en la
            construcción Merkle-Damgård con operaciones bit a bit optimizadas. Sus dos variantes principales son:
          </p>
          <ul className="list-disc pl-5 space-y-2 text-muted">
            <li>
              <strong>SHA-256:</strong> Produce un resumen de <strong>256 bits</strong> (64 caracteres hexadecimales).
              Es el estándar de facto en la web moderna, utilizado en los certificados TLS/HTTPS, en la firma de paquetes
              de software y en la validación de transacciones de cadenas de bloques (Bitcoin).
            </li>
            <li>
              <strong>SHA-512:</strong> Genera resúmenes de <strong>512 bits</strong> (128 caracteres hexadecimales).
              Al operar internamente con palabras de 64 bits, es frecuentemente más veloz que SHA-256 en procesadores
              modernos de arquitectura x86-64 y servidores en la nube.
            </li>
          </ul>

          <h2 className="text-xl font-bold text-foreground mt-8 mb-3">
            4. Tabla comparativa: Longitud, seguridad y usos
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse border border-card-border text-xs">
              <thead>
                <tr className="bg-muted/10 text-foreground">
                  <th className="p-2 border border-card-border font-semibold">Algoritmo</th>
                  <th className="p-2 border border-card-border font-semibold">Salida (bits)</th>
                  <th className="p-2 border border-card-border font-semibold">Caracteres Hex</th>
                  <th className="p-2 border border-card-border font-semibold">Estado de seguridad</th>
                  <th className="p-2 border border-card-border font-semibold">Caso de uso recomendado</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="p-2 border border-card-border font-mono font-semibold">MD5</td>
                  <td className="p-2 border border-card-border font-mono">128 bits</td>
                  <td className="p-2 border border-card-border font-mono">32 chars</td>
                  <td className="p-2 border border-card-border text-danger font-semibold">Roto (inseguro)</td>
                  <td className="p-2 border border-card-border text-muted">Sumas de verificación de archivos no críticos</td>
                </tr>
                <tr>
                  <td className="p-2 border border-card-border font-mono font-semibold">SHA-1</td>
                  <td className="p-2 border border-card-border font-mono">160 bits</td>
                  <td className="p-2 border border-card-border font-mono">40 chars</td>
                  <td className="p-2 border border-card-border text-danger font-semibold">Obsoleto (colisiones reales)</td>
                  <td className="p-2 border border-card-border text-muted">Compatibilidad con sistemas heredados antiguos</td>
                </tr>
                <tr>
                  <td className="p-2 border border-card-border font-mono font-semibold">SHA-256</td>
                  <td className="p-2 border border-card-border font-mono">256 bits</td>
                  <td className="p-2 border border-card-border font-mono">64 chars</td>
                  <td className="p-2 border border-card-border text-success font-semibold">Robusto y seguro</td>
                  <td className="p-2 border border-card-border text-foreground">Estándar web TLS, firmas digitales, repositorios</td>
                </tr>
                <tr>
                  <td className="p-2 border border-card-border font-mono font-semibold">SHA-512</td>
                  <td className="p-2 border border-card-border font-mono">512 bits</td>
                  <td className="p-2 border border-card-border font-mono">128 chars</td>
                  <td className="p-2 border border-card-border text-success font-semibold">Máxima resistencia</td>
                  <td className="p-2 border border-card-border text-foreground">Alta seguridad criptográfica y servidores 64-bit</td>
                </tr>
              </tbody>
            </table>
          </div>

          <h2 className="text-xl font-bold text-foreground mt-8 mb-3">
            5. Ejemplo práctico resuelto: El efecto avalancha
          </h2>
          <div className="space-y-3 border border-card-border p-4 rounded-lg bg-card">
            <h3 className="font-bold text-foreground text-sm">
              Comparación del texto &quot;cifra&quot; frente a &quot;Cifra&quot;
            </h3>
            <p className="text-muted text-xs">
              Observa cómo cambiar únicamente la primera letra de minúscula a mayúscula altera por completo cada resumen:
            </p>
            <div className="space-y-2 font-mono text-xs">
              <div className="p-2 bg-muted/10 rounded border border-card-border">
                <span className="text-muted block text-[11px]">Entrada: &quot;cifra&quot; (en minúsculas)</span>
                <span className="text-foreground block truncate">MD5:    0458622c15ea6dc3dbdd827c10b741aa</span>
                <span className="text-foreground block truncate">SHA-1:  c7457a4a9840ebaa0b80ef61ba5bce6ba4f6c449</span>
                <span className="text-foreground block truncate">SHA-256: 3959bc8d50e05dc9d5a8ee52da215d2a931751d3615dc5dfdb0cb5bce2831c18</span>
              </div>
              <div className="p-2 bg-muted/10 rounded border border-card-border">
                <span className="text-muted block text-[11px]">Entrada: &quot;Cifra&quot; (primera letra mayúscula)</span>
                <span className="text-foreground block truncate">MD5:    669910cf9dbd0061e88e89ddb6bc6b93</span>
                <span className="text-foreground block truncate">SHA-1:  f82e04313bfa74df73eb3648083818e11a3dbe85</span>
                <span className="text-foreground block truncate">SHA-256: 72bf90ad96120e2ca8d203e0708f36270603f9052b61eeea78687f8f96eec509</span>
              </div>
            </div>
            <p className="text-xs text-muted">
              Un cambio de un solo bit en la entrada altera más del 50% de los caracteres resultantes, garantizando que
              ningún patrón pueda predecirse.
            </p>
          </div>

          <h2 className="text-xl font-bold text-foreground mt-8 mb-3">
            6. Errores habituales con funciones hash y cómo evitarlos
          </h2>
          <div className="space-y-3">
            <div className="p-3 border-l-4 border-danger bg-danger-light/10 rounded-r-lg">
              <h4 className="font-semibold text-danger text-xs uppercase tracking-wide">
                Error 1: Guardar contraseñas con SHA-256 plano sin factor de coste
              </h4>
              <p className="text-xs text-muted mt-1">
                SHA-256 fue diseñado para ser extraordinariamente rápido. Una tarjeta gráfica moderna como la NVIDIA RTX 4090
                puede calcular miles de millones de hashes SHA-256 por segundo. Si un atacante extrae una base de datos con
                hashes SHA-256 directos, descifrará la mayoría de contraseñas de longitud normal en minutos. Las contraseñas
                deben procesarse siempre con funciones lentas que consumen memoria, como <strong>Argon2id</strong> o <strong>bcrypt</strong>.
              </p>
            </div>

            <div className="p-3 border-l-4 border-danger bg-danger-light/10 rounded-r-lg">
              <h4 className="font-semibold text-danger text-xs uppercase tracking-wide">
                Error 2: Creer que una función hash comprime información reversible
              </h4>
              <p className="text-xs text-muted mt-1">
                Una función hash no es un algoritmo de compresión como ZIP o GZIP. Las funciones de resumen descartan
                información deliberadamente en cada ronda de mezcla. No existe ningún método matemático que permita reconstruir
                un archivo original de 500 MB a partir de su hash SHA-256 de 32 bytes.
              </p>
            </div>

            <div className="p-3 border-l-4 border-danger bg-danger-light/10 rounded-r-lg">
              <h4 className="font-semibold text-danger text-xs uppercase tracking-wide">
                Error 3: Omitir la comprobación de integridad en descargas de software
              </h4>
              <p className="text-xs text-muted mt-1">
                Descargar instaladores o imágenes de disco sin comparar su hash publicado expone tu infraestructura a ataques de
                hombre en el medio (MITM) o descargas corruptas. Ejecutar <code>sha256sum</code> en terminal toma un par de
                segundos y confirma al 100% que el binario no ha sido modificado.
              </p>
            </div>
          </div>

          <h2 className="text-xl font-bold text-foreground mt-8 mb-3">
            7. Preguntas frecuentes sobre funciones hash
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
            Resumen técnico y herramientas recomendadas
          </h2>
          <p>
            En síntesis: descarta MD5 y SHA-1 para cualquier aplicación de seguridad, utiliza SHA-256 o SHA-512 para
            integridad y firmas digitales, y recurre a funciones como Argon2id para el almacenamiento de contraseñas.
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-muted">
            <li>
              Calcula resúmenes criptográficos simultáneos con el{' '}
              <Link href={`/herramientas/${hashTool.slug}`} className="text-accent underline font-semibold">
                Generador de Hashes MD5 y SHA
              </Link>{' '}
              de Cifra, procesando textos o archivos directamente en memoria.
            </li>
            <li>
              Crea claves con alta resistencia contra ataques de fuerza bruta con el{' '}
              <Link href={`/herramientas/${pwdTool.slug}`} className="text-accent underline font-semibold">
                Generador de Contraseñas Seguras
              </Link>
              .
            </li>
            <li>
              Profundiza en la matemática de la entropía en nuestra guía sobre{' '}
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
