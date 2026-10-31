import type { Metadata } from 'next';
import { ToolLayout } from '@/components/ToolComponents';
import { getToolBySlug, getRelatedTools } from '@/lib/tools';
import PasswordCheckerClient from './PasswordCheckerClient';

const TOOL_SLUG = 'comprobador-contrasenas';

export const metadata: Metadata = {
  title: 'Comprobador de Fortaleza de Contraseñas — Auditoría de Entropía',
  description:
    'Comprueba la robustez de tu contraseña en tiempo real. Calcula entropía en bits, espacio muestral y tiempo estimado: lo que escribes no se envía a ningún servidor.',
  keywords: [
    'comprobador contraseñas',
    'password strength checker',
    'auditoría de contraseñas',
    'fuerza de contraseña',
    'calcular entropía contraseña',
    'tiempo descifrado fuerza bruta',
    'seguridad de contraseñas online',
  ],
  alternates: {
    canonical: `https://cifra.tools/herramientas/${TOOL_SLUG}`,
  },
  openGraph: {
    title: 'Comprobador de Fortaleza de Contraseñas — Cifra',
    description:
      'Evalúa la entropía matemática y resistencia a fuerza bruta de cualquier contraseña. Lo que introduces se procesa en tu navegador y no se envía a ningún servidor.',
    url: `https://cifra.tools/herramientas/${TOOL_SLUG}`,
    type: 'website',
  },
};

const FAQ_ITEMS = [
  {
    question: '¿Es seguro comprobar mi contraseña en esta herramienta online?',
    answer:
      'Sí. A diferencia de otros comprobadores web que envían tu texto a un servidor para procesarlo, esta herramienta procesa la contraseña directamente en tu navegador mediante JavaScript local: lo que escribes no se envía a ningún servidor.',
  },
  {
    question: '¿Cómo se calcula la entropía de una contraseña?',
    answer:
      'La entropía se mide en bits mediante la fórmula de Claude Shannon: E = L × log₂(N), donde L representa la longitud de la contraseña y N es el repertorio de caracteres posibles (26 minúsculas, 26 mayúsculas, 10 dígitos y 33 símbolos). Cuanto mayor sea la entropía, mayor será el número de combinaciones que un atacante debe probar.',
  },
  {
    question: '¿Cuál es la diferencia entre un ataque de diccionario y uno de fuerza bruta?',
    answer:
      'Un ataque de fuerza bruta exhaustivo prueba metódicamente todas las permutaciones posibles de caracteres hasta dar con la clave correcta. Un ataque de diccionario, en cambio, utiliza bases de datos de palabras comunes, contraseñas filtradas en brechas de seguridad previas y combinaciones previsibles (como sustituir "a" por "@"). Por eso, una contraseña larga pero común cae en milisegundos ante un diccionario.',
  },
  {
    question: '¿Cuántos bits de entropía se consideran seguros hoy en día?',
    answer:
      'Según el estándar NIST SP 800-63B, una contraseña con menos de 45 bits se considera débil. Entre 50 y 65 bits ofrece una seguridad moderada. A partir de 80 bits de entropía, la contraseña se considera criptográficamente inquebrantable mediante computación clásica, requiriendo billones de años para un atacante con clústeres de supercomputadoras.',
  },
  {
    question: '¿Qué es mejor: una contraseña corta y compleja o una frase de paso larga?',
    answer:
      'Las frases de paso largas (passphrases) de 4 o 5 palabras no relacionadas (por ejemplo, "bateria-caballo-grapa-nieve") son exponencialmente más seguras y fáciles de memorizar que contraseñas cortas de 8 caracteres con símbolos extraños ("P@ss12!"). La longitud es el factor que más multiplica el espacio de búsqueda ante la fuerza bruta.',
  },
];

export default function ComprobadorContrasenasPage() {
  const tool = getToolBySlug(TOOL_SLUG);
  const relatedTools = getRelatedTools(TOOL_SLUG);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebApplication',
        name: tool?.name || 'Comprobador de Fortaleza de Contraseñas',
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
        mainEntity: FAQ_ITEMS.map((item) => ({
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
        title={tool?.name || 'Comprobador de Fortaleza de Contraseñas'}
        description={
          tool?.description ||
          'Evalúa la robustez, entropía en bits y tiempo estimado de descifrado por fuerza bruta de cualquier contraseña en tiempo real.'
        }
        faq={FAQ_ITEMS}
        relatedTools={relatedTools}
        educationalContent={
          <div className="space-y-8 text-foreground">
            {/* Sección 1: Funcionamiento y Privacidad */}
            <div>
              <h2 className="text-xl font-bold text-foreground mb-3">
                ¿Cómo evalúa esta herramienta la seguridad de una contraseña?
              </h2>
              <p className="text-muted leading-relaxed text-sm">
                La seguridad de una credencial no se mide únicamente por la presencia de un carácter especial o un número aleatorio, sino por su <strong className="text-foreground">espacio muestral matemático</strong> y su resistencia frente a técnicas modernas de auditoría ofensiva. Esta herramienta descompone tu contraseña en sus conjuntos de caracteres constituyentes, evalúa patrones predecibles y calcula la cantidad objetiva de incertidumbre expresada en bits de entropía.
              </p>
              <div className="mt-4 p-4 rounded-lg bg-card border border-card-border">
                <p className="text-xs text-muted leading-relaxed">
                  <strong className="text-foreground font-semibold">Garantía absoluta de privacidad técnica:</strong> Esta aplicación web está programada bajo una arquitectura estricta de procesamiento en el lado del cliente (Client-Side).{' '}
                  <strong className="text-foreground">
                    Tu contraseña se analiza exclusivamente en tu navegador web mediante JavaScript local: lo que escribes no se transmite a ningún servidor ni se almacena en bases de datos.
                  </strong>{' '}
                  Puedes verificar el tráfico en la pestaña de red de las herramientas para desarrolladores o utilizar la herramienta completamente sin conexión.
                </p>
              </div>
            </div>

            {/* Sección 2: Fuerza Bruta vs Diccionario */}
            <div>
              <h2 className="text-xl font-bold text-foreground mb-3">
                Ataques de Diccionario vs. Fuerza Bruta Exhaustiva
              </h2>
              <p className="text-muted leading-relaxed text-sm">
                En el ámbito de la ciberseguridad existen dos metodologías fundamentales mediante las cuales los atacantes vulneran hashes de contraseñas filtrados:
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div className="p-4 rounded-xl border border-card-border bg-card">
                  <h3 className="text-sm font-bold text-foreground mb-2 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-accent" />
                    Ataque por Fuerza Bruta (Brute-Force)
                  </h3>
                  <p className="text-xs text-muted leading-relaxed">
                    Consiste en probar de forma sistemática y exhaustiva todas y cada una de las permutaciones posibles de caracteres (desde &quot;a&quot;, &quot;b&quot;, &quot;c&quot;... hasta combinaciones alfanuméricas complejas). La única defensa frente a este ataque es una <strong className="text-foreground">longitud elevada y un amplio repertorio de caracteres</strong>, lo que hace que el número de combinaciones crezca exponencialmente hasta superar la capacidad física de cómputo del planeta.
                  </p>
                </div>

                <div className="p-4 rounded-xl border border-card-border bg-card">
                  <h3 className="text-sm font-bold text-foreground mb-2 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-danger" />
                    Ataque de Diccionario y Reglas
                  </h3>
                  <p className="text-xs text-muted leading-relaxed">
                    En lugar de probar todas las letras al azar, el atacante utiliza listas precompiladas de millones de contraseñas reales obtenidas en brechas históricas (como la lista <em>RockYou</em>) aplicando mutaciones conocidas (como cambiar la &quot;a&quot; por &quot;@&quot;, la &quot;e&quot; por &quot;3&quot; o añadir &quot;2024!&quot; al final). Por esta razón, una clave como <code className="bg-code-bg px-1 py-0.5 rounded font-mono text-foreground">Tr0ub4dor&amp;3</code> parece compleja ante un humano pero cae en segundos ante un ataque de diccionario automatizado.
                  </p>
                </div>
              </div>
            </div>

            {/* Sección 3: Fórmula matemática de la Entropía */}
            <div className="border border-card-border rounded-xl p-5 bg-card">
              <h2 className="text-base font-bold text-foreground mb-2">
                ¿Qué es la Entropía y cómo se calcula matemáticamente?
              </h2>
              <p className="text-muted text-sm leading-relaxed mb-3">
                Propuesta por Claude Shannon en la Teoría Matemática de la Comunicación, la entropía cuantifica el grado de incertidumbre o sorpresa que representa una clave para un observador externo. Se formula de la siguiente manera:
              </p>

              <div className="bg-code-bg p-3.5 rounded-lg font-mono text-center text-sm text-foreground my-3 border border-card-border">
                E = L × log₂(N)
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-muted mt-3">
                <div className="p-2.5 rounded bg-card-subtle border border-card-border">
                  <strong className="text-foreground block mb-0.5">L (Longitud):</strong>
                  Número total de caracteres que componen la contraseña.
                </div>
                <div className="p-2.5 rounded bg-card-subtle border border-card-border">
                  <strong className="text-foreground block mb-0.5">N (Espacio Muestral):</strong>
                  Tamaño del conjunto de caracteres disponibles según los tipos utilizados (hasta 95 caracteres ASCII estándar).
                </div>
                <div className="p-2.5 rounded bg-card-subtle border border-card-border">
                  <strong className="text-foreground block mb-0.5">E (Entropía en Bits):</strong>
                  Potencia de 2 equivalente al número total de intentos promedio requeridos (2<sup>E-1</sup>).
                </div>
              </div>
            </div>

            {/* Sección 4: Tabla Comparativa */}
            <div>
              <h2 className="text-xl font-bold text-foreground mb-3">
                Tabla Comparativa: Estructura, Entropía y Tiempo de Quiebre
              </h2>
              <p className="text-muted text-sm leading-relaxed mb-4">
                La siguiente tabla ilustra cómo varía la resistencia ante un clúster de tarjetas gráficas modernas realizando 100.000 millones de intentos por segundo (10¹¹ hashes/s en formatos rápidos como NTLM o MD5):
              </p>

              <div className="overflow-x-auto border border-card-border rounded-lg">
                <table className="w-full text-left text-xs">
                  <thead className="bg-code-bg text-foreground font-semibold border-b border-card-border">
                    <tr>
                      <th className="p-3">Patrón de Contraseña</th>
                      <th className="p-3">Longitud</th>
                      <th className="p-3">Repertorio (N)</th>
                      <th className="p-3">Entropía Estimada</th>
                      <th className="p-3">Tiempo de Crackeo Offline</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-card-border text-muted font-mono">
                    <tr>
                      <td className="p-3 text-foreground font-sans">12345678</td>
                      <td className="p-3">8</td>
                      <td className="p-3">10 (dígitos)</td>
                      <td className="p-3 text-danger font-semibold">~26.6 bits</td>
                      <td className="p-3 text-danger font-sans">Instantáneo (&lt; 1 ms)</td>
                    </tr>
                    <tr>
                      <td className="p-3 text-foreground font-sans">primavera2024</td>
                      <td className="p-3">13</td>
                      <td className="p-3">36 (minús + núm)</td>
                      <td className="p-3 text-danger font-semibold">~35 bits (penalizado)</td>
                      <td className="p-3 text-danger font-sans">Milisegundos (diccionario)</td>
                    </tr>
                    <tr>
                      <td className="p-3 text-foreground font-sans">M@rt3s!2024</td>
                      <td className="p-3">11</td>
                      <td className="p-3">95 (completo)</td>
                      <td className="p-3 text-warning font-semibold">~58 bits</td>
                      <td className="p-3 text-warning font-sans">~15 días</td>
                    </tr>
                    <tr>
                      <td className="p-3 text-foreground font-sans">k9#Np@9$xQ2vL8!z</td>
                      <td className="p-3">16</td>
                      <td className="p-3">95 (completo)</td>
                      <td className="p-3 text-accent font-semibold">~105 bits</td>
                      <td className="p-3 text-accent font-sans">~33 billones de años</td>
                    </tr>
                    <tr>
                      <td className="p-3 text-foreground font-sans">reloj-bosque-marfil-nieve</td>
                      <td className="p-3">25</td>
                      <td className="p-3">7.776 (Diceware)</td>
                      <td className="p-3 text-success font-semibold">~110 bits</td>
                      <td className="p-3 text-success font-sans">Inquebrantable (Militar)</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Sección 5: Recomendaciones NIST SP 800-63B */}
            <div>
              <h2 className="text-xl font-bold text-foreground mb-3">
                Recomendaciones Oficiales de Seguridad (NIST SP 800-63B)
              </h2>
              <p className="text-muted text-sm leading-relaxed mb-3">
                El Instituto Nacional de Estándares y Tecnología de los Estados Unidos (NIST) actualizó sus directrices de identidad digital en la publicación especial 800-63B, desmitificando prácticas obsoletas:
              </p>
              <ul className="text-sm text-muted space-y-2 list-disc list-inside">
                <li>
                  <strong className="text-foreground">Prioriza la longitud sobre la complejidad arbitraria:</strong> Forzar cambios de símbolos complejos provoca patrones humanos predecibles. Una frase de 16 a 20 caracteres es mucho más efectiva.
                </li>
                <li>
                  <strong className="text-foreground">No cambies de contraseña periódicamente sin motivo:</strong> Obligar a los usuarios a rotar sus claves cada 60 días conduce a cambios triviales (ej. modificar el número final de 1 a 2). Solo debe cambiarse una clave si existe sospecha real de filtración.
                </li>
                <li>
                  <strong className="text-foreground">Usa un gestor de contraseñas de código abierto:</strong> Herramientas como Bitwarden o KeePass permiten almacenar claves aleatorias de alta entropía para cada servicio, evitando la reutilización de credenciales.
                </li>
                <li>
                  <strong className="text-foreground">Activa siempre la autenticación de doble factor (2FA/MFA):</strong> Una segunda capa de validación mediante llaves FIDO2/WebAuthn o aplicaciones TOTP impide el acceso incluso si tu contraseña llega a ser descifrada.
                </li>
              </ul>
            </div>
          </div>
        }
      >
        <PasswordCheckerClient />
      </ToolLayout>
    </>
  );
}
