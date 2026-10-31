import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Política de Cookies y Consentimiento — Cifra',
  description:
    'Información sobre el uso de cookies técnicas, analíticas y publicitarias (Google AdSense) en Cifra, y cómo configurar tus preferencias.',
  alternates: {
    canonical: 'https://cifra.tools/cookies',
  },
};

export default function CookiesPage() {
  return (
    <main className="flex-1 bg-background text-foreground transition-colors">
      <div className="mx-auto max-w-3xl px-4 py-12">
        <header className="pb-6 border-b border-card-border mb-8">
          <span className="text-[11px] font-mono uppercase tracking-wider text-muted block mb-2">
            Marco Normativo y Transparencia
          </span>
          <h1 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
            Política de Cookies y Almacenamiento Local
          </h1>
          <p className="mt-2 text-xs font-mono text-muted">Última actualización: 23 de octubre de 2026</p>
        </header>

        <div className="space-y-8 text-sm leading-relaxed">
          <section>
            <h2 className="text-lg font-bold text-foreground mb-2">1. ¿Qué son las cookies y el almacenamiento local?</h2>
            <p className="text-muted leading-relaxed">
              Las cookies y el almacenamiento local (<code className="font-mono text-xs bg-card-subtle px-1.5 py-0.5 rounded border border-card-border">localStorage</code>)
              son tecnologías estándar que permiten guardar pequeños fragmentos de información técnica en el navegador
              del usuario para recordar preferencias de navegación entre sesiones.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-foreground mb-2">2. Almacenamiento técnico local utilizado en Cifra</h2>
            <p className="text-muted leading-relaxed">
              En Cifra priorizamos la mínima intrusión. Lo que introduces en las herramientas no se guarda ni se envía; solo se guardan estas preferencias técnicas en tu navegador:
            </p>

            <div className="mt-4 overflow-x-auto border border-card-border rounded-lg">
              <table className="w-full text-left text-xs">
                <thead className="bg-card-subtle text-muted border-b border-card-border font-mono uppercase text-[11px]">
                  <tr>
                    <th className="p-3 font-semibold">Clave Técnica</th>
                    <th className="p-3 font-semibold">Tipo</th>
                    <th className="p-3 font-semibold">Finalidad</th>
                    <th className="p-3 font-semibold">Datos Sensibles</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-card-border font-sans">
                  <tr>
                    <td className="p-3 font-mono font-medium text-foreground">cifra_cookie_consent</td>
                    <td className="p-3 text-muted font-mono">localStorage</td>
                    <td className="p-3 text-muted">Registrar la decisión del banner de cookies (técnicas, analítica, publicidad).</td>
                    <td className="p-3 font-mono text-success">Ninguno</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-mono font-medium text-foreground">cifra-theme</td>
                    <td className="p-3 text-muted font-mono">localStorage</td>
                    <td className="p-3 text-muted">Recordar tu preferencia visual (modo claro u oscuro).</td>
                    <td className="p-3 font-mono text-success">Ninguno</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-mono font-medium text-foreground">cifra_favorites</td>
                    <td className="p-3 text-muted font-mono">localStorage</td>
                    <td className="p-3 text-muted">Lista de identificadores de tus herramientas fijadas como favoritas.</td>
                    <td className="p-3 font-mono text-success">Ninguno</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-mono font-medium text-foreground">cifra_recents</td>
                    <td className="p-3 text-muted font-mono">localStorage</td>
                    <td className="p-3 text-muted">Historial de las últimas herramientas visitadas para el acceso directo.</td>
                    <td className="p-3 font-mono text-success">Ninguno</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-mono font-medium text-foreground">cifra_tool_prefs_*</td>
                    <td className="p-3 text-muted font-mono">localStorage</td>
                    <td className="p-3 text-muted">Preferencias funcionales de UI (longitud de contraseña deseada, formato de indentación JSON).</td>
                    <td className="p-3 font-mono text-success">Ninguno (nunca claves ni textos)</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <p className="mt-3 text-xs text-muted leading-relaxed">
              <strong className="text-foreground">Garantía estricta:</strong> En ningún caso se guardan contraseñas generadas,
              hashes de entrada, cadenas de texto introducidas ni datos privados.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-foreground mb-2">3. Cookies publicitarias y de medición (Google AdSense y Google Analytics)</h2>
            <p className="text-muted leading-relaxed">
              Si el usuario acepta a través del banner de consentimiento, el sitio podrá usar Google Analytics y Google AdSense (cookies de terceros para estadísticas agregadas y publicidad contextual que financian la infraestructura gratuita de Cifra). Estas cookies solo se activan si otorgas tu consentimiento voluntario en el panel de privacidad.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-foreground mb-2">4. Cómo modificar o borrar tus datos locales</h2>
            <p className="text-muted leading-relaxed">
              Puedes restablecer tus preferencias en cualquier momento pulsando en &quot;Preferencias de cookies&quot; en el pie de página
              o borrando los datos de sitio en la configuración de tu navegador (Configuración → Privacidad y Seguridad → Borrar datos de navegación).
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
