import type { Metadata } from 'next';
import Link from 'next/link';
import TableOfContents from '@/components/TableOfContents';
import { getGuideBySlug, formatDateSpanish } from '@/lib/guides';
import { getToolBySlug } from '@/lib/tools';

const SLUG = 'guia-seguridad-contrasenas-entropia';

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

export default function PasswordSecurityGuidePage() {
  const guide = getGuideBySlug(SLUG)!;
  const pwdTool = getToolBySlug('generador-contrasenas')!;
  const hashTool = getToolBySlug('generador-hash')!;

  const faqItems = [
    {
      question: '¿Cuántos bits de entropía se consideran seguros frente a ataques modernos?',
      answer:
        'Una contraseña con al menos 80 bits de entropía ofrece una resistencia suficiente contra ataques dirigidos. A partir de 100 bits de entropía (alcanzables con 16 caracteres aleatorios de un repertorio de 94 símbolos), el espacio de combinaciones supera 10^31 posibilidades, resultando computacionalmente inexpugnable incluso ante clústeres masivos de tarjetas gráficas durante miles de millones de años.',
    },
    {
      question: '¿Por qué el estándar NIST desaconseja obligar a cambiar contraseñas cada 90 días?',
      answer:
        'La publicación oficial NIST SP 800-63B demostró que la rotación periódica forzada degrada la seguridad real: los usuarios eligen patrones predecibles como incrementar un número al final (Password2025! a Password2026!) o reutilizan variaciones mínimas. El estándar actual recomienda cambiar la clave únicamente ante sospechas fundadas o filtraciones confirmadas.',
    },
    {
      question: '¿Es más segura una frase de 4 palabras o una clave aleatoria de 12 caracteres?',
      answer:
        'Una clave aleatoria de 12 caracteres con 94 símbolos alcanza ~78 bits de entropía, mientras que una frase de 4 palabras elegidas al azar de un diccionario Diceware de 7.776 palabras aporta ~51,6 bits (12,9 bits por palabra). Sin embargo, una frase de 5 o 6 palabras (64 a 77 bits) es mucho más fácil de recordar y escribir para un ser humano, reduciendo el riesgo de anotaciones inseguras.',
    },
    {
      question: '¿Qué función cumple el salt en el almacenamiento de contraseñas?',
      answer:
        'El salt es una cadena aleatoria y única generada para cada usuario que se concatena a la contraseña antes de procesar el hash. Su propósito es garantizar que dos usuarios con la misma contraseña generen hashes totalmente diferentes, neutralizando ataques basados en tablas precalculadas (rainbow tables) y obligando al atacante a calcular cada prueba de forma individual.',
    },
    {
      question: '¿Por qué nunca debe utilizarse Math.random() para generar contraseñas en JavaScript?',
      answer:
        'Math.random() es un generador de números pseudoaleatorios (PRNG) no criptográfico cuyo estado interno puede predecirse tras observar unos pocos valores. Para generar secretos criptográficos en el navegador es imperativo utilizar crypto.getRandomValues() de la Web Crypto API, que obtiene entropía directamente del hardware y del sistema operativo.',
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
            <span>Estándares NIST SP 800-63B e IETF RFC 9106</span>
          </div>
        </header>

        {/* Banner interactivo hacia la herramienta */}
        <div className="mb-8 p-4 rounded-lg bg-card border border-accent/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h4 className="text-sm font-bold text-foreground">Genera contraseñas con alta entropía</h4>
            <p className="text-xs text-muted">
              Crea claves criptográficamente seguras con Web Crypto API directamente en tu navegador.
            </p>
          </div>
          <Link
            href={`/herramientas/${pwdTool.slug}`}
            className="px-4 py-2 text-xs font-semibold rounded bg-accent text-white hover:bg-accent-hover transition-colors whitespace-nowrap"
          >
            Generar Contraseña Segura →
          </Link>
        </div>

        {/* Contenido principal */}
        <TableOfContents />

        <div className="max-w-[68ch] space-y-6 text-base sm:text-lg text-slate-700 dark:text-slate-300 leading-relaxed font-sans">
          <p>
            Durante décadas, las políticas de seguridad en empresas e instituciones exigieron requisitos
            rígidos de composición (mayúsculas, minúsculas, números y símbolos obligatorios) combinados con
            la obligación de renovar las claves cada 90 días. En su histórica publicación especial{' '}
            <strong>NIST SP 800-63B (Digital Identity Guidelines)</strong>, el Instituto Nacional de Estándares
            y Tecnología de EE.UU. demostró que estas imposiciones producían el efecto contrario al deseado:
            contraseñas predecibles para los ciberatacantes y difíciles de recordar para los usuarios.
          </p>

          <h2 className="text-xl font-bold text-foreground mt-8 mb-3">
            1. ¿Qué es la entropía de una contraseña?
          </h2>
          <p>
            En teoría de la información (desarrollada originalmente por Claude Shannon en 1948), la{' '}
            <strong>entropía</strong> mide la incertidumbre o aleatoriedad de un mensaje, expresada en{' '}
            <strong>bits</strong>. En el ámbito de las contraseñas, la entropía cuantifica cuántas pruebas
            debería realizar un atacante en el peor escenario teórico para averiguar la clave mediante
            fuerza bruta exhaustiva.
          </p>
          <div className="p-4 bg-card border border-card-border rounded-lg text-center font-mono text-base font-bold text-foreground">
            Entropía (bits) = Longitud &times; log2(Tamaño del repertorio)
          </div>
          <p>
            Cada bit adicional de entropía <strong>duplica</strong> el número total de intentos necesarios para
            adivinar la contraseña (2 elevado al número de bits de entropía). Por ejemplo,
            pasar de 40 a 50 bits no incrementa la dificultad en un 25%, sino en 2^10 = 1.024 veces.
          </p>

          <h2 className="text-xl font-bold text-foreground mt-8 mb-3">
            2. El tamaño del repertorio de caracteres (R)
          </h2>
          <p>
            El repertorio $R$ representa la cantidad de caracteres disponibles en cada posición de la clave:
          </p>
          <ul className="list-disc pl-5 space-y-1 text-muted">
            <li>
              <strong>Solo dígitos (0-9):</strong> $R = 10 \rightarrow \log_2(10) \approx 3,32$ bits por carácter.
            </li>
            <li>
              <strong>Letras minúsculas (a-z):</strong> $R = 26 \rightarrow \log_2(26) \approx 4,70$ bits por carácter.
            </li>
            <li>
              <strong>Mayúsculas y minúsculas (a-z, A-Z):</strong> $R = 52 \rightarrow \log_2(52) \approx 5,70$ bits por carácter.
            </li>
            <li>
              <strong>Alfanumérico (a-z, A-Z, 0-9):</strong> $R = 62 \rightarrow \log_2(62) \approx 5,95$ bits por carácter.
            </li>
            <li>
              <strong>ASCII imprimible completo (con símbolos):</strong> $R = 94 \rightarrow \log_2(94) \approx 6,55$ bits por carácter.
            </li>
          </ul>

          <h2 className="text-xl font-bold text-foreground mt-8 mb-3">
            3. Longitud frente a complejidad: Tres casos resueltos
          </h2>
          <p>
            Para comprender por qué la longitud supera drásticamente a los trucos de complejidad, analicemos tres
            ejemplos con clústeres modernos de GPU:
          </p>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse border border-card-border text-xs">
              <thead>
                <tr className="bg-muted/10 text-foreground">
                  <th className="p-2 border border-card-border font-semibold">Ejemplo</th>
                  <th className="p-2 border border-card-border font-semibold">Longitud</th>
                  <th className="p-2 border border-card-border font-semibold">Repertorio (R)</th>
                  <th className="p-2 border border-card-border font-semibold">Entropía</th>
                  <th className="p-2 border border-card-border font-semibold">Resistencia real</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="p-2 border border-card-border font-mono">P@ssw0rd!</td>
                  <td className="p-2 border border-card-border">9</td>
                  <td className="p-2 border border-card-border">94 (aparente)</td>
                  <td className="p-2 border border-card-border font-mono">~35 bits reales</td>
                  <td className="p-2 border border-card-border text-danger font-semibold">Vulnerable en milisegundos por diccionario</td>
                </tr>
                <tr>
                  <td className="p-2 border border-card-border font-mono">k9#mQ2$pL8!xZ4@w</td>
                  <td className="p-2 border border-card-border">16</td>
                  <td className="p-2 border border-card-border">94 (aleatorio)</td>
                  <td className="p-2 border border-card-border font-mono">104,9 bits</td>
                  <td className="p-2 border border-card-border text-success font-semibold">Inviolable en miles de millones de años</td>
                </tr>
                <tr>
                  <td className="p-2 border border-card-border font-mono">oruga-cemento-volcan-timbre</td>
                  <td className="p-2 border border-card-border">27 (4 palabras)</td>
                  <td className="p-2 border border-card-border">Diccionario (7.776)</td>
                  <td className="p-2 border border-card-border font-mono">51,6 bits</td>
                  <td className="p-2 border border-card-border text-foreground font-semibold">Fácil de memorizar; excelente con 5 palabras (64,6 bits)</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="space-y-3 border border-card-border p-4 rounded-lg bg-card">
            <h3 className="font-bold text-foreground text-sm">
              Caso práctico: Clave de 6 caracteres frente a clave de 16 caracteres
            </h3>
            <p className="text-muted text-xs">
              Supongamos una clave compleja de 6 caracteres como <code>T0r#9!</code> (L = 6, R = 94):
            </p>
            <ul className="list-disc pl-5 text-xs text-muted space-y-1">
              <li>Espacio total: 94^6 ≈ 6,89 × 10^11 combinaciones (~39,3 bits).</li>
              <li>
                Un clúster moderno de 8 tarjetas NVIDIA RTX 4090 ejecutando Hashcat sobre hashes NTLM procesa
                más de 200 gigahashes por segundo (2 × 10^11 hashes/s).
              </li>
              <li>
                Tiempo de descifrado exhaustivo: <strong>menos de 4 segundos</strong>.
              </li>
            </ul>
            <p className="text-muted text-xs mt-2">
              En cambio, para 16 caracteres aleatorios (94^16 ≈ 3,71 × 10^31 combinaciones):
            </p>
            <ul className="list-disc pl-5 text-xs text-muted space-y-1">
              <li>
                A esa misma velocidad descomunal, el ataque requeriría más de 5 × 10^12 años, una cifra
                centenares de veces superior a la edad estimada del universo.
              </li>
            </ul>
          </div>

          <h2 className="text-xl font-bold text-foreground mt-8 mb-3">
            4. Almacenamiento seguro en servidores: Hashing y funciones lentas
          </h2>
          <p>
            Ningún sistema seguro almacena contraseñas en texto claro. Se procesan mediante funciones criptográficas
            unidireccionales combinadas con mecanismos de protección:
          </p>
          <ul className="list-disc pl-5 space-y-2 text-muted">
            <li>
              <strong>Salt criptográfico (RFC 2898):</strong> Una cadena aleatoria generada por usuario que se concatena
              a la clave antes del resumen, impidiendo el uso de tablas precalculadas (rainbow tables).
            </li>
            <li>
              <strong>Funciones de derivación con coste computacional (KDF):</strong> Algoritmos como{' '}
              <strong>Argon2id (RFC 9106)</strong> o <strong>bcrypt</strong> obligan a consumir memoria RAM y ciclos de
              CPU configurables en cada verificación, ralentizando intencionadamente los ataques de fuerza bruta masiva
              basados en hardware especializado (ASIC o GPU).
            </li>
          </ul>

          <h2 className="text-xl font-bold text-foreground mt-8 mb-3">
            5. Errores comunes en la gestión de contraseñas y cómo evitarlos
          </h2>
          <div className="space-y-3">
            <div className="p-3 border-l-4 border-danger bg-danger-light/10 rounded-r-lg">
              <h4 className="font-semibold text-danger text-xs uppercase tracking-wide">
                Error 1: Reutilización de credenciales entre sitios web
              </h4>
              <p className="text-xs text-muted mt-1">
                El 80% de los incidentes de robo de cuentas se deben a ataques de <em>credential stuffing</em>: si un foro
                menor sufre una filtración, los atacantes prueban automáticamente ese correo y clave en bancos, correo y
                redes sociales. La única defensa eficaz es una clave única por servicio gestionada con un gestor de
                contraseñas fiable.
              </p>
            </div>

            <div className="p-3 border-l-4 border-danger bg-danger-light/10 rounded-r-lg">
              <h4 className="font-semibold text-danger text-xs uppercase tracking-wide">
                Error 2: Sustituciones Leet predecibles (L33t Speak)
              </h4>
              <p className="text-xs text-muted mt-1">
                Cambiar la &apos;a&apos; por &apos;@&apos;, la &apos;e&apos; por &apos;3&apos; o la &apos;o&apos; por &apos;0&apos;{' '}
                no añade entropía real. Los programas de descifrado actuales incluyen reglas de mutación automática que
                prueban todas las variaciones ortográficas de palabras de diccionario en una fracción de segundo.
              </p>
            </div>

            <div className="p-3 border-l-4 border-danger bg-danger-light/10 rounded-r-lg">
              <h4 className="font-semibold text-danger text-xs uppercase tracking-wide">
                Error 3: Emplear generadores basados en Math.random()
              </h4>
              <p className="text-xs text-muted mt-1">
                Muchas páginas web gratuitas utilizan la función estándar <code>Math.random()</code> de JavaScript, cuyo
                algoritmo no es criptográficamente seguro y permite deducir claves futuras. Nuestro generador utiliza
                estrictamente la Web Crypto API nativa (<code>crypto.getRandomValues()</code>), garantizando entropía de
                nivel de sistema operativo.
              </p>
            </div>

            <div className="p-3 border-l-4 border-danger bg-danger-light/10 rounded-r-lg">
              <h4 className="font-semibold text-danger text-xs uppercase tracking-wide">
                Error 4: Prescindir del doble factor de autenticación (2FA / MFA)
              </h4>
              <p className="text-xs text-muted mt-1">
                Incluso con una contraseña con alta entropía, técnicas de phishing o malware en el equipo pueden
                interceptarla. Activar autenticación de dos factores mediante aplicaciones TOTP o llaves físicas FIDO2
                bloquea más del 99% de los ataques automatizados.
              </p>
            </div>
          </div>

          <h2 className="text-xl font-bold text-foreground mt-8 mb-3">
            6. Preguntas frecuentes sobre seguridad de contraseñas
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
            Herramientas interactivas y guías recomendadas
          </h2>
          <p>
            Protege tus credenciales y experimenta con la seguridad criptográfica:
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-muted">
            <li>
              Crea claves con más de 100 bits de entropía con el{' '}
              <Link href={`/herramientas/${pwdTool.slug}`} className="text-accent underline font-semibold">
                Generador de Contraseñas Seguras
              </Link>
              , ejecutado al 100% en la memoria de tu dispositivo.
            </li>
            <li>
              Comprueba el comportamiento de algoritmos criptográficos con el{' '}
              <Link href={`/herramientas/${hashTool.slug}`} className="text-accent underline font-semibold">
                Generador de Hashes SHA-256 y MD5
              </Link>
              .
            </li>
            <li>
              Consulta también nuestra guía técnica de redes:{' '}
              <Link
                href="/guias/como-calcular-subredes-ipv4-paso-a-paso"
                className="text-accent underline font-semibold"
              >
                Cómo calcular subredes IPv4 paso a paso con CIDR
              </Link>
              .
            </li>
          </ul>
        </div>
      </article>
    </main>
  );
}
