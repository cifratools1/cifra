import type { Metadata } from 'next';
import Link from 'next/link';
import {
  ShieldCheckIcon,
  ZapIcon,
  DeviceMobileIcon,
  BookOpenIcon,
} from '@/components/Icons';

export const metadata: Metadata = {
  title: 'Acerca de Cifra — Proyecto y Propósito',
  description:
    'Conoce el propósito de Cifra: herramientas web gratuitas, respetuosas con la privacidad y de alto rendimiento que ejecutan todos sus cálculos en el navegador.',
  alternates: {
    canonical: 'https://cifra.tools/acerca',
  },
};

export default function AcercaPage() {
  return (
    <main className="flex-1 bg-background text-foreground transition-colors">
      <div className="mx-auto max-w-3xl px-4 py-12">
        <header className="pb-6 border-b border-card-border mb-8">
          <span className="text-xs font-mono text-muted block mb-2">
            Manifiesto y arquitectura
          </span>
          <h1 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
            Acerca de Cifra
          </h1>
          <p className="mt-3 text-base text-muted leading-relaxed">
            Una suite de herramientas técnicas y utilidades digitales diseñadas bajo una premisa elemental:
            resolver cálculos de computación e ingeniería de forma rápida, privada y sin intermediarios.
          </p>
        </header>

        <div className="space-y-10 text-sm leading-relaxed">
          <section>
            <h2 className="text-lg font-bold text-foreground mb-3 tracking-tight">Nuestra Misión</h2>
            <p className="text-muted leading-relaxed">
              La mayoría de los sitios de utilidades informáticas en internet continúan atrapados en patrones
              obsoletos: interfaces recargadas, decenas de banners publicitarios engañosos, tiempos de carga
              inflados por rastreadores y envío innecesario de datos a servidores remotos.
            </p>
            <p className="text-muted leading-relaxed mt-2">
              En Cifra creemos que las herramientas que utilizas a diario para segmentar una subred,
              generar una clave criptográfica o formatear una estructura JSON deben ser{' '}
              <strong className="text-foreground font-semibold">instantáneas, estrictamente privadas y sobrias</strong>.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-foreground mb-4 tracking-tight">
              Principios de Diseño y Operación
            </h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="p-5 rounded-lg bg-card border border-card-border card-interactive">
                <h3 className="font-semibold text-foreground flex items-center gap-2">
                  <ShieldCheckIcon size={18} className="text-success" />
                  <span>Privacidad en el cliente</span>
                </h3>
                <p className="text-xs text-muted mt-2 leading-relaxed">
                  Todas las herramientas se ejecutan en tu navegador (Web Crypto API, TypeScript y BigInt):
                  lo que escribes o introduces en ellas se procesa en tu dispositivo y no se envía a ningún servidor.
                </p>
              </div>

              <div className="p-5 rounded-lg bg-card border border-card-border card-interactive">
                <h3 className="font-semibold text-foreground flex items-center gap-2">
                  <ZapIcon size={18} className="text-warning" />
                  <span>Rendimiento instantáneo</span>
                </h3>
                <p className="text-xs text-muted mt-2 leading-relaxed">
                  Cero latencia de red para cálculos matemáticos. Procesamiento reactivo en tiempo real con
                  retroalimentación inmediata al escribir o cambiar parámetros.
                </p>
              </div>

              <div className="p-5 rounded-lg bg-card border border-card-border card-interactive">
                <h3 className="font-semibold text-foreground flex items-center gap-2">
                  <DeviceMobileIcon size={18} className="text-accent" />
                  <span>Adaptabilidad responsive</span>
                </h3>
                <p className="text-xs text-muted mt-2 leading-relaxed">
                  Diseñado para responder con fluidez desde pantallas móviles de 375 px hasta estaciones de
                  trabajo multidisplay, con tipografía calibrada y zonas de toque accesibles.
                </p>
              </div>

              <div className="p-5 rounded-lg bg-card border border-card-border card-interactive">
                <h3 className="font-semibold text-foreground flex items-center gap-2">
                  <BookOpenIcon size={18} className="text-accent" />
                  <span>Rigor técnico y documentación</span>
                </h3>
                <p className="text-xs text-muted mt-2 leading-relaxed">
                  Cada módulo va respaldado por explicaciones basadas en estándares oficiales
                  (RFC, IETF, IEC, NIST, W3C), garantizando verificabilidad y valor pedagógico.
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-lg font-bold text-foreground mb-3 tracking-tight">Modelo de Sostenibilidad</h2>
            <p className="text-muted leading-relaxed">
              Cifra se financia mediante publicidad programática no invasiva (Google AdSense) y recursos
              técnicos recomendados. No vendemos datos de usuarios, no recopilamos información personal ni cobramos
              suscripciones por funciones esenciales.
            </p>
          </section>

          <section className="pt-6 border-t border-card-border flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <span className="text-xs text-muted">¿Tienes alguna sugerencia o corrección técnica?</span>
            <Link
              href="/contacto"
              className="text-xs font-semibold text-accent hover:underline"
            >
              Contactar con el equipo
            </Link>
          </section>
        </div>
      </div>
    </main>
  );
}
