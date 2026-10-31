import type { Metadata } from 'next';
import { ToolLayout } from '@/components/ToolComponents';
import { getToolBySlug, getRelatedTools } from '@/lib/tools';
import HashGenerator from './HashGenerator';

const TOOL_SLUG = 'generador-hash';

export const metadata: Metadata = {
  title: 'Generador de Hash Online (MD5, SHA-1, SHA-256, SHA-512) — Texto y Archivos',
  description:
    'Calcula hashes MD5, SHA-1, SHA-256 y SHA-512 para texto o archivos al instante con Web Crypto API: lo que introduces se procesa en tu navegador.',
  keywords: [
    'generador hash',
    'hash generator',
    'md5 online',
    'sha256 online',
    'sha512 online',
    'checksum archivo',
    'verificar sha256',
    'calcular hash texto',
    'crypto subtle digest',
  ],
  alternates: {
    canonical: `https://cifra.tools/herramientas/${TOOL_SLUG}`,
  },
  openGraph: {
    title: 'Generador de Hash Online (MD5, SHA-256, SHA-512) — Cifra',
    description:
      'Calcula hashes criptográficos en tiempo real para texto y archivos. Se procesa en tu navegador con Web Crypto API.',
    url: `https://cifra.tools/herramientas/${TOOL_SLUG}`,
    type: 'website',
  },
};

const FAQ_ITEMS = [
  {
    question: '¿Es posible descifrar o revertir un hash MD5 o SHA-256?',
    answer:
      'No. Las funciones hash son matemáticamente unidireccionales: están diseñadas para que sea computacionalmente imposible recuperar los datos originales a partir del hash. Lo que hacen herramientas de "descifrado" externas no es revertir la función matemática, sino consultar gigantescas tablas precalculadas (llamadas tablas rainbow) con millones de palabras y frases comunes ya hasheadas.',
  },
  {
    question: '¿Por qué se sigue usando MD5 si se considera obsoleto para seguridad?',
    answer:
      'MD5 ya no debe utilizarse para firmas digitales, certificados SSL/TLS ni almacenamiento de contraseñas debido a que existen ataques de colisión prácticos (dos archivos distintos pueden producir el mismo hash MD5). Sin embargo, sigue siendo una herramienta muy popular y eficiente para comprobar la integridad accidental de descargas (checksums rápidos frente a corrupción de red) o deduplicación de archivos en sistemas de almacenamiento.',
  },
  {
    question: '¿Mis archivos o textos se envían a algún servidor para calcular el hash?',
    answer:
      'No, en absoluto. Los algoritmos se ejecutan en tu propio equipo. El texto se procesa mediante la Web Crypto API nativa de tu navegador y nuestro motor MD5 en TypeScript; los archivos se leen mediante la API local FileReader: lo que introduces no se envía a ningún servidor.',
  },
  {
    question: '¿Qué diferencia hay entre SHA-256 y SHA-512?',
    answer:
      'Ambos pertenecen a la familia SHA-2 estandarizada por el NIST. SHA-256 genera una huella de 256 bits (64 caracteres hexadecimales) procesando bloques de 32 bits, mientras que SHA-512 produce 512 bits (128 caracteres) usando palabras de 64 bits. En procesadores modernos de 64 bits, SHA-512 suele ser incluso más rápido por byte que SHA-256 además de ofrecer una resistencia criptográfica aún mayor.',
  },
  {
    question: '¿Por qué no se debe usar SHA-256 solo para guardar contraseñas en bases de datos?',
    answer:
      'SHA-256 fue diseñado para ser extremadamente rápido, lo cual es excelente para calcular checksums de archivos grandes, pero contraproducente para proteger contraseñas. Un atacante con unas pocas tarjetas gráficas comerciales puede probar más de 10 mil millones de hashes SHA-256 por segundo. Para contraseñas se deben utilizar funciones de derivación de claves lentas y costosas en memoria como Argon2id, bcrypt o PBKDF2.',
  },
];

export default function GeneradorHashPage() {
  const tool = getToolBySlug(TOOL_SLUG);
  const relatedTools = getRelatedTools(TOOL_SLUG);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebApplication',
        name: tool?.name || 'Generador de Hash (MD5, SHA-256)',
        description: tool?.description,
        applicationCategory: 'SecurityApplication',
        operatingSystem: 'All',
        url: `https://cifra.tools/herramientas/${TOOL_SLUG}`,
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

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c') }}
      />
      <ToolLayout
        title={tool?.name || 'Generador de Hash (MD5, SHA-1, SHA-256, SHA-512)'}
        description={
          tool?.description ||
          'Genera hashes MD5, SHA-1, SHA-256 y SHA-512 de cualquier texto o archivo. Procesamiento 100% local en tu navegador.'
        }
        faq={FAQ_ITEMS}
        relatedTools={relatedTools}
        educationalContent={
          <div className="space-y-8 text-foreground">
            <div>
              <h2 className="text-xl font-bold text-foreground mb-3">
                ¿Qué es una función hash criptográfica?
              </h2>
              <p className="text-muted leading-relaxed text-sm">
                Una función hash es un algoritmo matemático determinista que toma una entrada de
                cualquier longitud (desde una sola letra hasta una imagen ISO de 10 gigabytes) y la
                transforma en una cadena de caracteres de <strong className="text-foreground">longitud fija</strong> llamada
                digest, huella digital o checksum.
              </p>
              <p className="text-muted leading-relaxed text-sm mt-3">
                El mismo mensaje de entrada siempre generará exactamente el mismo hash. Sin embargo,
                cualquier cambio mínimo en el texto de entrada provocará un hash completamente
                irreconocible y diferente, una propiedad conocida como el{' '}
                <strong className="text-foreground">efecto avalancha</strong>.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <div className="border border-card-border rounded-xl p-4 bg-card">
                <h3 className="text-sm font-bold text-foreground mb-1">1. Unidireccionalidad</h3>
                <p className="text-xs text-muted leading-relaxed">
                  Dado un hash <code className="font-mono text-accent">h</code>, es computacionalmente imposible encontrar el mensaje original <code className="font-mono text-accent">m</code> tal que <code className="font-mono">hash(m) = h</code> (resistencia a preimagen).
                </p>
              </div>

              <div className="border border-card-border rounded-xl p-4 bg-card">
                <h3 className="text-sm font-bold text-foreground mb-1">2. Efecto Avalancha</h3>
                <p className="text-xs text-muted leading-relaxed">
                  Si cambias un solo bit o una coma en una entrada de 1 millón de caracteres,
                  aproximadamente el 50% de los bits del hash resultante cambiarán de valor de forma
                  aparentemente caótica.
                </p>
              </div>

              <div className="border border-card-border rounded-xl p-4 bg-card">
                <h3 className="text-sm font-bold text-foreground mb-1">3. Resistencia a Colisiones</h3>
                <p className="text-xs text-muted leading-relaxed">
                  Debe ser prácticamente imposible encontrar dos mensajes diferentes <code className="font-mono text-accent">m1 ≠ m2</code> que produzcan exactamente el mismo hash <code className="font-mono">hash(m1) = hash(m2)</code>.
                </p>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-bold text-foreground mb-3">
                Comparativa de algoritmos de hash populares
              </h3>
              <div className="overflow-x-auto my-3">
                <table className="w-full text-left text-xs border border-card-border rounded-lg overflow-hidden">
                  <thead className="bg-code-bg text-foreground font-semibold">
                    <tr>
                      <th className="p-3 border-b border-card-border">Algoritmo</th>
                      <th className="p-3 border-b border-card-border">Tamaño del hash</th>
                      <th className="p-3 border-b border-card-border">Longitud hex</th>
                      <th className="p-3 border-b border-card-border">Estado de seguridad</th>
                      <th className="p-3 border-b border-card-border">Casos de uso habituales</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-card-border text-muted">
                    <tr>
                      <td className="p-3 font-bold text-foreground">MD5</td>
                      <td className="p-3 font-mono">128 bits</td>
                      <td className="p-3 font-mono">32 caracteres</td>
                      <td className="p-3 text-red-500 font-semibold">Vulnerable a colisiones</td>
                      <td className="p-3">Checksum de archivos no críticos, caché web, índices de bases de datos.</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-bold text-foreground">SHA-1</td>
                      <td className="p-3 font-mono">160 bits</td>
                      <td className="p-3 font-mono">40 caracteres</td>
                      <td className="p-3 text-amber-500 font-semibold">Deprecado criptográficamente</td>
                      <td className="p-3">Identificadores de commits en Git (migrando a SHA-256), sistemas legados.</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-bold text-foreground">SHA-256</td>
                      <td className="p-3 font-mono">256 bits</td>
                      <td className="p-3 font-mono">64 caracteres</td>
                      <td className="p-3 text-emerald-500 font-semibold">Seguro (Estándar global)</td>
                      <td className="p-3">Certificados TLS/HTTPS, firmas digitales, Bitcoin, verificación de ISOs.</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-bold text-foreground">SHA-512</td>
                      <td className="p-3 font-mono">512 bits</td>
                      <td className="p-3 font-mono">128 caracteres</td>
                      <td className="p-3 text-emerald-500 font-semibold">Seguro (Grado militar)</td>
                      <td className="p-3">Sistemas financieros de alta seguridad, firmas de paquetes Linux, kernels.</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div className="border border-card-border rounded-xl p-5 bg-card">
              <h3 className="text-base font-bold text-foreground mb-2">
                Diferencia clave: ¿En qué se distingue el Hash del Cifrado?
              </h3>
              <p className="text-muted text-sm leading-relaxed mb-3">
                Es muy común confundir ambos términos, pero tienen propósitos completamente distintos:
              </p>
              <div className="grid gap-3 sm:grid-cols-2 text-xs">
                <div className="p-3 bg-code-bg rounded-lg border border-card-border">
                  <h4 className="font-bold text-foreground mb-1">Cifrado (Encriptación)</h4>
                  <p className="text-muted leading-relaxed">
                    Es un proceso <strong className="text-foreground">bidireccional</strong>. Se transforma un mensaje claro en texto cifrado con una clave, y quien posea la clave privada correspondiente puede <em>descifrarlo</em> para recuperar el original intacto (ejemplos: AES-256, RSA).
                  </p>
                </div>
                <div className="p-3 bg-code-bg rounded-lg border border-card-border">
                  <h4 className="font-bold text-foreground mb-1">Función Hash (Digest)</h4>
                  <p className="text-muted leading-relaxed">
                    Es un proceso <strong className="text-foreground">unidireccional</strong> e irreversible. No existe una clave de descifrado matemática: se comprime información para verificar identidad e integridad, nunca para recuperar el contenido original.
                  </p>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-bold text-foreground mb-3">
                Cómo verificar un archivo con la terminal de comandos
              </h3>
              <p className="text-muted text-sm leading-relaxed mb-3">
                Si descargas un archivo y quieres contrastar su hash localmente en tu sistema operativo,
                puedes usar estos comandos nativos equivalentes a los resultados calculados arriba:
              </p>

              <div className="space-y-3 font-mono text-xs">
                <div className="p-3 bg-code-bg rounded-lg border border-card-border">
                  <div className="text-muted mb-1 font-sans font-semibold">En Linux / macOS:</div>
                  <div className="text-foreground">sha256sum archivo.zip</div>
                  <div className="text-muted mt-1"># o para MD5: md5sum archivo.zip</div>
                </div>

                <div className="p-3 bg-code-bg rounded-lg border border-card-border">
                  <div className="text-muted mb-1 font-sans font-semibold">En Windows (PowerShell):</div>
                  <div className="text-foreground">Get-FileHash -Algorithm SHA256 .\archivo.zip</div>
                  <div className="text-muted mt-1"># o para MD5: Get-FileHash -Algorithm MD5 .\archivo.zip</div>
                </div>
              </div>
            </div>
          </div>
        }
      >
        <HashGenerator />
      </ToolLayout>
    </>
  );
}
