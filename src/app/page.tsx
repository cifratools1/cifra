import type { Metadata } from 'next';
import Link from 'next/link';
import { TOOLS } from '@/lib/tools';
import ToolSearchBar from '@/components/ToolSearchBar';
import ToolCatalog from '@/components/ToolCatalog';
import SavedToolsSection from '@/components/SavedToolsSection';
import QuickInstrument from '@/components/QuickInstrument';
import {
  SubnetIcon,
  KeyIcon,
  JsonIcon,
  ShieldCheckIcon,
} from '@/components/Icons';

export const metadata: Metadata = {
  title: 'Cifra — Herramientas y calculadoras para el día a día',
  description:
    'Calcula subredes, convierte bases, gestiona formatos y resuelve tareas técnicas en tu navegador: lo que escribes no se envía a ningún servidor.',
  alternates: {
    canonical: 'https://cifra.tools',
  },
  openGraph: {
    title: 'Cifra — Herramientas y calculadoras para el día a día',
    description:
      'Calcula subredes, convierte bases, gestiona formatos y resuelve tareas técnicas en tu navegador: lo que escribes no se envía a ningún servidor.',
    url: 'https://cifra.tools',
    siteName: 'Cifra',
    locale: 'es_ES',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Cifra — Herramientas y calculadoras para el día a día',
    description:
      'Calcula subredes, convierte bases, gestiona formatos y resuelve tareas técnicas en tu navegador: lo que escribes no se envía a ningún servidor.',
  },
};

export default function Home() {
  return (
    <main className="flex-1 bg-background text-foreground transition-colors">
      {/* 1. Hero Section: Composición de ingeniería orientada a la acción inmediata */}
      <section className="border-b border-card-border bg-card/60 py-10 sm:py-14">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Columna Izquierda: Identidad y propuesta técnica honesta */}
            <div className="lg:col-span-7">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-card-subtle border border-card-border text-xs text-foreground mb-4 font-medium">
                <ShieldCheckIcon size={15} className="text-success" />
                <span>Ejecución en cliente · Lo que introduces no se envía a ningún servidor</span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-foreground leading-[1.15]">
                Herramientas técnicas y cálculo directo en tu navegador
              </h1>

              <p className="mt-4 text-sm sm:text-base text-muted max-w-xl leading-relaxed">
                Calculadoras de subredes IPv4, generación de claves criptográficas, cálculo de hashes y validación sintáctica de formatos.
                Lo que introduces se procesa en tu navegador: cálculo directo y sin latencia.
              </p>

              {/* Barra de búsqueda interactiva inmediata */}
              <div className="mt-6 max-w-lg">
                <ToolSearchBar placeholder="Buscar herramienta o RFC (ej. subredes, json, sha256...)" />
              </div>

              {/* Accesos rápidos de tarea */}
              <div className="mt-4 flex flex-wrap items-center gap-1.5 text-xs text-muted">
                <span className="text-xs text-muted font-medium">Accesos rápidos:</span>
                <Link
                  href="/herramientas/calculadora-subredes"
                  className="px-2.5 py-1 rounded border border-card-border bg-card hover:border-accent text-foreground transition-colors font-medium"
                >
                  Subredes IPv4
                </Link>
                <Link
                  href="/herramientas/generador-contrasenas"
                  className="px-2.5 py-1 rounded border border-card-border bg-card hover:border-accent text-foreground transition-colors font-medium"
                >
                  Contraseñas
                </Link>
                <Link
                  href="/herramientas/formateador-json"
                  className="px-2.5 py-1 rounded border border-card-border bg-card hover:border-accent text-foreground transition-colors font-medium"
                >
                  Formateador JSON
                </Link>
                <Link
                  href="/herramientas/generador-hash"
                  className="px-2.5 py-1 rounded border border-card-border bg-card hover:border-accent text-foreground transition-colors font-medium"
                >
                  Hashes
                </Link>
                <Link
                  href="/herramientas/conversor-binario-decimal-hexadecimal"
                  className="px-2.5 py-1 rounded border border-card-border bg-card hover:border-accent text-foreground transition-colors font-medium"
                >
                  Bases
                </Link>
              </div>
            </div>

            {/* Columna Derecha: Instrumento Rápido en Vivo */}
            <div className="lg:col-span-5">
              <QuickInstrument />
            </div>
          </div>
        </div>
      </section>

      {/* 2. Main Content Container */}
      <div className="mx-auto max-w-6xl px-4 py-10">
        {/* Herramientas guardadas y recientes (Retención de usuario, solo si existen) */}
        <SavedToolsSection />

        {/* 3. Módulos Destacados: Jerarquía visual real con especificación técnica */}
        <section className="mb-12">
          <div className="flex items-baseline justify-between mb-4 pb-2 border-b border-card-border">
            <div>
              <h2 className="text-lg font-bold text-foreground tracking-tight">
                Herramientas de uso frecuente
              </h2>
              <p className="text-sm text-muted mt-0.5">
                Calculadoras y procesadores de mayor volumen operativo.
              </p>
            </div>
            <Link
              href="/herramientas"
              className="text-xs font-semibold text-accent hover:underline shrink-0"
            >
              Catálogo completo ({TOOLS.length})
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Subnet Calculator */}
            <div className="p-5 rounded-lg bg-card border border-card-border card-interactive flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="w-8 h-8 rounded-md bg-card-subtle border border-card-border text-foreground flex items-center justify-center shrink-0">
                    <SubnetIcon className="w-4 h-4" />
                  </div>
                  <span className="text-xs font-mono text-muted px-2 py-0.5 rounded bg-card-subtle border border-card-border">
                    RFC 4632
                  </span>
                </div>
                <h3 className="text-base font-semibold text-foreground">
                  Calculadora de Subredes IPv4
                </h3>
                <p className="mt-2 text-sm text-muted leading-relaxed">
                  Cálculo de máscaras, broadcast, wildcard y rango de hosts utilizables para cualquier dirección IP con notación CIDR.
                </p>
              </div>
              <div className="mt-5 pt-3 border-t border-card-border flex items-center justify-between">
                <span className="text-xs text-muted font-mono">10.0.0.0/8 a /32</span>
                <Link
                  href="/herramientas/calculadora-subredes"
                  className="text-xs font-semibold text-accent hover:underline"
                >
                  Abrir calculadora
                </Link>
              </div>
            </div>

            {/* Password Generator */}
            <div className="p-5 rounded-lg bg-card border border-card-border card-interactive flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="w-8 h-8 rounded-md bg-card-subtle border border-card-border text-foreground flex items-center justify-center shrink-0">
                    <KeyIcon className="w-4 h-4" />
                  </div>
                  <span className="text-xs font-mono text-muted px-2 py-0.5 rounded bg-card-subtle border border-card-border">
                    CSPRNG NIST
                  </span>
                </div>
                <h3 className="text-base font-semibold text-foreground">
                  Generador de Contraseñas
                </h3>
                <p className="mt-2 text-sm text-muted leading-relaxed">
                  Generación aleatoria de alta entropía con control de conjuntos y verificación matemática de resistencia.
                </p>
              </div>
              <div className="mt-5 pt-3 border-t border-card-border flex items-center justify-between">
                <span className="text-xs text-muted font-mono">&gt;100 bits entropía</span>
                <Link
                  href="/herramientas/generador-contrasenas"
                  className="text-xs font-semibold text-accent hover:underline"
                >
                  Generar claves
                </Link>
              </div>
            </div>

            {/* JSON Formatter */}
            <div className="p-5 rounded-lg bg-card border border-card-border card-interactive flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="w-8 h-8 rounded-md bg-card-subtle border border-card-border text-foreground flex items-center justify-center shrink-0">
                    <JsonIcon className="w-4 h-4" />
                  </div>
                  <span className="text-xs font-mono text-muted px-2 py-0.5 rounded bg-card-subtle border border-card-border">
                    RFC 8259
                  </span>
                </div>
                <h3 className="text-base font-semibold text-foreground">
                  Formateador y Validador JSON
                </h3>
                <p className="mt-2 text-sm text-muted leading-relaxed">
                  Embellece, valida y minifica texto JSON con diagnóstico exacto de línea y posición del error de análisis.
                </p>
              </div>
              <div className="mt-5 pt-3 border-t border-card-border flex items-center justify-between">
                <span className="text-xs text-muted font-mono">AST Diagnostic</span>
                <Link
                  href="/herramientas/formateador-json"
                  className="text-xs font-semibold text-accent hover:underline"
                >
                  Validar JSON
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* 4. Complete Tool Catalog */}
        <section className="mb-12">
          <div className="mb-4 pb-2 border-b border-card-border">
            <h2 className="text-lg font-bold text-foreground tracking-tight">
              Catálogo de herramientas
            </h2>
            <p className="text-sm text-muted mt-0.5">
              Utilidades clasificadas por disciplina técnica.
            </p>
          </div>
          <ToolCatalog />
        </section>

        {/* 5. Technical Guides & Articles */}
        <section className="mb-10">
          <div className="flex items-baseline justify-between mb-4 pb-2 border-b border-card-border">
            <div>
              <h2 className="text-lg font-bold text-foreground tracking-tight">
                Guías y documentación técnica
              </h2>
              <p className="text-sm text-muted mt-0.5">
                Fundamentos matemáticos y estándares oficiales explicados en profundidad.
              </p>
            </div>
            <Link
              href="/guias"
              className="text-xs font-semibold text-accent hover:underline"
            >
              Ver todas las guías
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link
              href="/guias/como-calcular-subredes-ipv4-paso-a-paso"
              className="p-5 rounded-lg border border-card-border bg-card card-interactive flex flex-col justify-between"
            >
              <div>
                <span className="text-xs font-mono text-muted block mb-1">
                  Redes e IP
                </span>
                <h3 className="text-base font-semibold text-foreground">
                  Cómo calcular subredes IPv4 paso a paso
                </h3>
                <p className="text-sm text-muted mt-2 leading-relaxed line-clamp-2">
                  Descomposición binaria de octetos, cálculo de máscaras, broadcast y hosts utilizables sin memorizar tablas.
                </p>
              </div>
              <span className="text-xs font-semibold text-accent mt-4 block">
                Leer artículo
              </span>
            </Link>

            <Link
              href="/guias/guia-seguridad-contrasenas-entropia"
              className="p-5 rounded-lg border border-card-border bg-card card-interactive flex flex-col justify-between"
            >
              <div>
                <span className="text-xs font-mono text-muted block mb-1">
                  Ciberseguridad
                </span>
                <h3 className="text-base font-semibold text-foreground">
                  Seguridad de contraseñas y cálculo de entropía
                </h3>
                <p className="text-sm text-muted mt-2 leading-relaxed line-clamp-2">
                  Análisis matemático de combinatoria y resistencia ante ataques modernos de fuerza bruta.
                </p>
              </div>
              <span className="text-xs font-semibold text-accent mt-4 block">
                Leer artículo
              </span>
            </Link>

            <Link
              href="/guias/diferencia-kb-kib-por-que-mi-disco-tiene-menos-espacio"
              className="p-5 rounded-lg border border-card-border bg-card card-interactive flex flex-col justify-between"
            >
              <div>
                <span className="text-xs font-mono text-muted block mb-1">
                  Almacenamiento
                </span>
                <h3 className="text-base font-semibold text-foreground">
                  Diferencia entre KB y KiB: decimal vs binario
                </h3>
                <p className="text-sm text-muted mt-2 leading-relaxed line-clamp-2">
                  Por qué un disco comercial de 1 TB muestra 931 GiB en el explorador del sistema operativo.
                </p>
              </div>
              <span className="text-xs font-semibold text-accent mt-4 block">
                Leer artículo
              </span>
            </Link>
          </div>
        </section>

        {/* Ad container (obligatorio: cifra-ad-home con altura reservada, oculto si está vacío) */}
        <div className="ad-slot-shell" id="cifra-ad-home" aria-hidden="true" />
      </div>
    </main>
  );
}
