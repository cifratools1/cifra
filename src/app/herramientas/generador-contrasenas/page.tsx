import type { Metadata } from 'next';
import { ToolLayout } from '@/components/ToolComponents';
import { getToolBySlug, getRelatedTools } from '@/lib/tools';
import PasswordGenerator from './PasswordGenerator';

const TOOL_SLUG = 'generador-contrasenas';

export const metadata: Metadata = {
  title: 'Generador de Contraseñas Seguras y Aleatorias Online',
  description:
    'Genera contraseñas seguras y aleatorias con Web Crypto API. Control total de longitud, caracteres y entropía: se generan en tu navegador y no se envían a ningún servidor.',
  keywords: [
    'generador contraseñas',
    'password generator',
    'generador de contraseñas seguras',
    'contraseñas aleatorias',
    'calcular entropía contraseña',
    'contraseña segura online',
    'web crypto api password',
  ],
  alternates: {
    canonical: `https://cifra.tools/herramientas/${TOOL_SLUG}`,
  },
  openGraph: {
    title: 'Generador de Contraseñas Seguras — Cifra',
    description:
      'Crea contraseñas criptográficamente seguras con Web Crypto API. Se generan directamente en tu navegador y no se envían a ningún servidor.',
    url: `https://cifra.tools/herramientas/${TOOL_SLUG}`,
    type: 'website',
  },
};

const FAQ_ITEMS = [
  {
    question: '¿Es seguro generar contraseñas en esta herramienta online?',
    answer:
      'Sí, es completamente seguro. A diferencia de otros sitios que envían datos a un servidor central, Cifra genera las contraseñas al 100% en el procesador de tu propio dispositivo utilizando la Web Crypto API nativa de tu navegador. Tu contraseña nunca viaja por internet ni se guarda en ningún registro.',
  },
  {
    question: '¿Por qué utiliza Web Crypto API en lugar de Math.random()?',
    answer:
      'Math.random() es un generador pseudoaleatorio predecible diseñado para simulaciones gráficas o juegos, no para criptografía. Por el contrario, window.crypto.getRandomValues() es un Generador Criptográficamente Seguro de Números Pseudoaleatorios (CSPRNG) que aprovecha la entropía física del sistema operativo (ruido térmico, interrupciones de hardware), impidiendo que un atacante pueda predecir contraseñas futuras.',
  },
  {
    question: '¿Qué longitud de contraseña se considera segura en la actualidad?',
    answer:
      'Para cuentas estándar se recomienda un mínimo de 14 a 16 caracteres. Para contraseñas maestras de gestores de contraseñas, billeteras de criptomonedas o cuentas bancarias, es aconsejable utilizar entre 20 y 32 caracteres. La longitud es el factor más determinante para resistir ataques de fuerza bruta.',
  },
  {
    question: '¿Qué significa la entropía en bits de una contraseña?',
    answer:
      'La entropía mide la cantidad de incertidumbre o aleatoriedad de la contraseña frente a un atacante que intenta adivinarla. Se calcula con la fórmula E = L × log₂(N), donde L es la longitud y N es la cantidad de caracteres posibles. Una contraseña con más de 80 bits de entropía tardaría billones de años en ser quebrada por supercomputadoras.',
  },
  {
    question: '¿Cómo debo guardar mis contraseñas generadas?',
    answer:
      'No se recomienda memorizar contraseñas largas ni anotarlas en archivos de texto sin cifrar. La mejor práctica recomendada por expertos en ciberseguridad es utilizar un gestor de contraseñas confiable (como Bitwarden, 1Password o KeePass), protegido por una única clave maestra fuerte y autenticación de doble factor (2FA).',
  },
];

export default function GeneradorContrasenasPage() {
  const tool = getToolBySlug(TOOL_SLUG);
  const relatedTools = getRelatedTools(TOOL_SLUG);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebApplication',
        name: tool?.name || 'Generador de Contraseñas Seguras',
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
        title={tool?.name || 'Generador de Contraseñas Seguras'}
        description={
          tool?.description ||
          'Genera contraseñas aleatorias seguras con control de longitud y cálculo de entropía.'
        }
        faq={FAQ_ITEMS}
        relatedTools={relatedTools}
        educationalContent={
          <div className="space-y-8 text-foreground">
            <div>
              <h2 className="text-xl font-bold text-foreground mb-3">
                ¿Cómo funciona un generador de contraseñas criptográficamente seguro?
              </h2>
              <p className="text-muted leading-relaxed text-sm">
                La seguridad de una contraseña generada automáticamente radica en la imprevisibilidad
                de su fuente de números aleatorios. La mayoría de lenguajes y librerías básicas
                ofrecen funciones como <code className="text-accent bg-code-bg px-1.5 py-0.5 rounded text-xs font-mono">Math.random()</code>,
                cuyo algoritmo es determinista y predecible; un atacante que conozca la semilla
                inicial o un par de contraseñas previas puede reconstruir la secuencia completa.
              </p>
              <p className="text-muted leading-relaxed text-sm mt-3">
                Esta herramienta utiliza exclusivamente la{' '}
                <strong className="text-foreground">Web Crypto API</strong> (<code className="text-accent bg-code-bg px-1.5 py-0.5 rounded text-xs font-mono">crypto.getRandomValues</code>),
                que accede a las fuentes de entropía físicas proporcionadas directamente por el núcleo
                de tu sistema operativo (como fluctuaciones térmicas, pausas de disco y tiempos de
                interrupción del reloj). Esto garantiza aleatoriedad criptográfica de estándar militar
                (CSPRNG).
              </p>
            </div>

            <div className="border border-card-border rounded-xl p-5 bg-card">
              <h3 className="text-base font-bold text-foreground mb-2">
                La matemática detrás de la fuerza: La Entropía
              </h3>
              <p className="text-muted text-sm leading-relaxed mb-3">
                En teoría de la información de Claude Shannon, la entropía cuantifica cuántos intentos
                promedio necesitaría un atacante para adivinar una clave por fuerza bruta exhaustiva:
              </p>
              <div className="bg-code-bg p-3 rounded-lg font-mono text-center text-sm text-foreground my-3 border border-card-border">
                E = L × log₂(N)
              </div>
              <ul className="text-xs text-muted space-y-1.5 list-disc list-inside">
                <li>
                  <strong className="text-foreground">L:</strong> Longitud total de la contraseña (número de caracteres).
                </li>
                <li>
                  <strong className="text-foreground">N:</strong> Tamaño del conjunto de caracteres posibles (p. ej. minúsculas = 26, minúsculas + mayúsculas = 52, con dígitos = 62, con símbolos = ~90).
                </li>
                <li>
                  <strong className="text-foreground">E:</strong> Entropía resultante expresada en bits.
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-bold text-foreground mb-3">
                Longitud vs. Complejidad: El mito de los caracteres especiales
              </h3>
              <p className="text-muted text-sm leading-relaxed">
                Durante años se obligó a los usuarios a crear contraseñas cortas pero con reglas
                estrictas (una mayúscula, un dígito y un símbolo). Esto derivó en hábitos predecibles,
                como reemplazar la letra &quot;a&quot; por un &quot;@&quot; o añadir un &quot;1!&quot; al final.
              </p>
              <div className="overflow-x-auto my-4">
                <table className="w-full text-left text-xs border border-card-border rounded-lg overflow-hidden">
                  <thead className="bg-code-bg text-foreground font-semibold">
                    <tr>
                      <th className="p-3 border-b border-card-border">Ejemplo de formato</th>
                      <th className="p-3 border-b border-card-border">Longitud</th>
                      <th className="p-3 border-b border-card-border">Entropía aprox.</th>
                      <th className="p-3 border-b border-card-border">Resistencia ante GPU moderna</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-card-border text-muted">
                    <tr>
                      <td className="p-3 font-mono">P@ssw0rd!</td>
                      <td className="p-3">9 caracteres</td>
                      <td className="p-3 text-red-500 font-semibold">~40 bits</td>
                      <td className="p-3">Milisegundos (en diccionarios comunes)</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-mono">xK9#mQ2$</td>
                      <td className="p-3">8 caracteres</td>
                      <td className="p-3 text-amber-500 font-semibold">~52 bits</td>
                      <td className="p-3">Pocos minutos</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-mono">tr7w-b9f2-k4m8</td>
                      <td className="p-3">14 caracteres</td>
                      <td className="p-3 text-emerald-500 font-semibold">~75 bits</td>
                      <td className="p-3">Varios meses</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-mono">G8#kR2!wV9$pL4&z</td>
                      <td className="p-3">16 caracteres</td>
                      <td className="p-3 text-emerald-600 dark:text-emerald-400 font-bold">~103 bits</td>
                      <td className="p-3 font-semibold text-foreground">Millones de años</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p className="text-xs text-muted">
                * Estimaciones basadas en ataques de fuerza bruta offline a 100 mil millones de combinaciones por segundo.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-bold text-foreground mb-3">
                Reglas de oro de seguridad recomendadas por el NIST (2026)
              </h3>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="p-4 rounded-lg border border-card-border bg-card">
                  <h4 className="text-sm font-bold text-foreground mb-1">1. Usa un gestor de contraseñas</h4>
                  <p className="text-xs text-muted leading-relaxed">
                    Nadie puede recordar 80 contraseñas aleatorias de 16 caracteres. Herramientas
                    como Bitwarden, KeePass o 1Password almacenan tus claves bajo cifrado AES-256 de
                    conocimiento cero.
                  </p>
                </div>
                <div className="p-4 rounded-lg border border-card-border bg-card">
                  <h4 className="text-sm font-bold text-foreground mb-1">2. Nunca reutilices contraseñas</h4>
                  <p className="text-xs text-muted leading-relaxed">
                    Si un servicio menor sufre una brecha de datos (credential stuffing), los
                    ciberdelincuentes probarán esa misma combinación de email y clave en tu banco,
                    PayPal y correo electrónico.
                  </p>
                </div>
                <div className="p-4 rounded-lg border border-card-border bg-card">
                  <h4 className="text-sm font-bold text-foreground mb-1">3. Activa 2FA (Doble Factor)</h4>
                  <p className="text-xs text-muted leading-relaxed">
                    Usa aplicaciones autenticadoras (TOTP) como Google Authenticator o llaves de
                    seguridad FIDO2/WebAuthn (YubiKey). Evita siempre que sea posible el 2FA por SMS.
                  </p>
                </div>
                <div className="p-4 rounded-lg border border-card-border bg-card">
                  <h4 className="text-sm font-bold text-foreground mb-1">4. Longitud mínima de 16 caracteres</h4>
                  <p className="text-xs text-muted leading-relaxed">
                    Con la potencia de cálculo actual de las tarjetas gráficas dedicadas, 16
                    caracteres es el nuevo estándar seguro para evitar cualquier intento de colisión o
                    fuerza bruta.
                  </p>
                </div>
              </div>
            </div>
          </div>
        }
      >
        <PasswordGenerator />
      </ToolLayout>
    </>
  );
}
