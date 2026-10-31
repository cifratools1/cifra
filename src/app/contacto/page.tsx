import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contacto — Cifra',
  description:
    'Ponte en contacto con el equipo de Cifra para enviar sugerencias, reportar errores en herramientas o proponer nuevas funcionalidades.',
  alternates: {
    canonical: 'https://cifra.tools/contacto',
  },
};

export default function ContactoPage() {
  return (
    <main className="flex-1 bg-background text-foreground transition-colors">
      <div className="mx-auto max-w-2xl px-4 py-12">
        <header className="pb-6 border-b border-card-border mb-8">
          <span className="text-[11px] font-mono uppercase tracking-wider text-muted block mb-2">
            Canales Oficiales
          </span>
          <h1 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
            Contacto
          </h1>
          <p className="mt-3 text-sm text-muted leading-relaxed">
            Valoramos enormemente el feedback de estudiantes, administradores de sistemas y
            desarrolladores. Si encuentras una discrepancia en un cálculo, tienes una sugerencia o deseas
            proponer una nueva utilidad, comunícate con nosotros.
          </p>
        </header>

        <div className="space-y-6">
          <div className="p-6 border border-card-border rounded-lg bg-card">
            <h2 className="text-base font-semibold text-foreground mb-4">Canales de comunicación directa</h2>
            <ul className="space-y-4 text-sm">
              <li className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-md bg-card-subtle border border-card-border flex items-center justify-center shrink-0 text-foreground">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
                    <rect x="2" y="4" width="20" height="16" rx="2" />
                    <path d="M22 6l-10 7L2 6" />
                  </svg>
                </div>
                <div>
                  <strong className="text-foreground block text-sm font-semibold">Correo electrónico general:</strong>
                  <a href="mailto:cifra.tools1@gmail.com" className="font-mono text-accent hover:underline text-xs">
                    cifra.tools1@gmail.com
                  </a>
                  <p className="text-xs text-muted mt-0.5">
                    Tiempo estimado de respuesta: 24 a 48 horas laborables.
                  </p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-md bg-card-subtle border border-card-border flex items-center justify-center shrink-0 text-foreground">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
                    <circle cx="12" cy="12" r="10" />
                    <line x1="12" y1="8" x2="12" y2="12" />
                    <line x1="12" y1="16" x2="12.01" y2="16" />
                  </svg>
                </div>
                <div>
                  <strong className="text-foreground block text-sm font-semibold">Reporte de incidencias técnicas y soporte:</strong>
                  <a href="mailto:cifra.tools1@gmail.com?subject=Reporte%20de%20error%20-%20Cifra" className="font-mono text-accent hover:underline text-xs">
                    cifra.tools1@gmail.com
                  </a>
                  <p className="text-xs text-muted mt-0.5">
                    Para discrepancias numéricas en calculadoras, incluye la entrada y el resultado esperado según RFC o estándar oficial.
                  </p>
                </div>
              </li>
            </ul>
          </div>

          <div className="p-6 border border-card-border rounded-lg bg-card">
            <h2 className="text-base font-semibold text-foreground mb-2">Antes de contactar</h2>
            <p className="text-xs text-muted leading-relaxed">
              Ten presente que <strong>Cifra no almacena datos de los usuarios</strong>. No conservamos
              registros de las contraseñas generadas, los textos transformados ni las IPs calculadas.
              No nos es posible recuperar información que hayas procesado en una pestaña cerrada.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
