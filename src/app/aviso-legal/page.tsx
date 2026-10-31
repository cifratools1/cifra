import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Aviso Legal y Condiciones de Uso — Cifra',
  description:
    'Aviso legal, condiciones generales de uso del sitio web, propiedad intelectual y exención de responsabilidad de Cifra.',
  alternates: {
    canonical: 'https://cifra.tools/aviso-legal',
  },
};

export default function AvisoLegalPage() {
  return (
    <main className="flex-1 bg-background text-foreground transition-colors">
      <div className="mx-auto max-w-3xl px-4 py-12">
        <h1 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
          Aviso Legal y Términos de Uso
        </h1>
        <p className="mt-2 text-xs text-muted">Última actualización: 21 de octubre de 2026</p>

        <div className="mt-8 space-y-6 text-sm text-foreground/90 leading-relaxed">
          <section className="p-4 rounded-lg bg-card border border-card-border">
            <h2 className="text-base font-bold text-foreground mb-2">1. Información General (LSSI-CE)</h2>
            <p className="text-muted text-xs leading-relaxed">
              En cumplimiento del artículo 10 de la Ley 34/2002, de 11 de julio, de Servicios de la
              Sociedad de la Información y de Comercio Electrónico (LSSI-CE), se facilitan los datos
              del titular del sitio web:
            </p>
            <ul className="mt-2 text-xs text-muted space-y-1 font-mono">
              <li>• Nombre comercial: Cifra</li>
              <li>• Titular responsable: Equipo de Cifra tools</li>
              <li>• N.I.F. / C.I.F.: ****</li>
              <li>• Domicilio / Ubicación: ****</li>
              <li>• Correo electrónico de contacto: cifra.tools1@gmail.com</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold text-foreground mb-2">2. Objeto y Condiciones de Acceso</h2>
            <p className="text-muted leading-relaxed">
              El acceso y uso de este portal confiere la condición de usuario, aceptando plenamente
              los presentes términos desde el mismo instante en que se navega por el sitio. Las
              herramientas y contenidos están destinados a fines informativos, pedagógicos, técnicos
              y de productividad personal o profesional.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-foreground mb-2">3. Exención de Responsabilidad</h2>
            <p className="text-muted leading-relaxed">
              Aunque el equipo de Cifra aplica los mayores estándares de rigor técnico en la
              implementación de algoritmos matemáticos y especificaciones de ingeniería:
            </p>
            <ul className="list-disc pl-5 text-muted space-y-2 mt-2">
              <li>
                Los cálculos, estimaciones y conversiones se entregan &quot;tal cual&quot; (<em>as is</em>)
                sin garantía explícita o implícita de adecuación para un fin crítico determinado
                (infraestructuras críticas de telecomunicaciones, sistemas de soporte vital o
                financieros regulados).
              </li>
              <li>
                El usuario es el único responsable de validar los resultados antes de aplicar
                configuraciones en equipos de producción (routers, switches, firewalls o sistemas de
                cifrado).
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold text-foreground mb-2">4. Propiedad Intelectual</h2>
            <p className="text-muted leading-relaxed">
              El código fuente, diseño gráfico, logotipos, textos explicativos y arquitectura de la
              información son propiedad de Cifra o se utilizan bajo licencias permisivas de código
              abierto. Las especificaciones y algoritmos públicos (como SHA-256 de NIST, Base64 de
              RFC 4648 o cálculo de subredes de RFC 4632) constituyen estándares abiertos de dominio
              público en la industria de la computación.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
