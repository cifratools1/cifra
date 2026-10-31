import type { Metadata } from 'next';
import { TOOLS } from '@/lib/tools';
import ToolCatalog from '@/components/ToolCatalog';
import ToolSearchBar from '@/components/ToolSearchBar';

export const metadata: Metadata = {
  title: 'Catálogo de Herramientas y Calculadoras',
  description:
    'Catálogo completo de herramientas de Cifra: cálculo de subredes IPv4, generación de hashes SHA/MD5, generador de contraseñas, conversor binario y validación JSON.',
  alternates: {
    canonical: 'https://cifra.tools/herramientas',
  },
};

export default function HerramientasPage() {
  return (
    <main className="flex-1 bg-background text-foreground transition-colors">
      <div className="mx-auto max-w-6xl px-4 py-8">
        {/* Header section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-card-border mb-6">
          <div>
            <h1 className="text-2xl font-bold text-foreground tracking-tight sm:text-3xl">
              Todas las herramientas
            </h1>
            <p className="mt-1 text-sm text-muted max-w-xl leading-relaxed">
              {TOOLS.length} calculadoras y utilidades técnicas. Todas se ejecutan en tu navegador: lo que escribes en ellas no se envía a ningún servidor.
            </p>
          </div>

          <div className="w-full md:w-72">
            <ToolSearchBar placeholder="Buscar por nombre o RFC..." />
          </div>
        </div>

        {/* Interactive Tool Catalog with filtering & favorites */}
        <ToolCatalog initialCategory="all" />

        {/* Ad shell placeholder con altura reservada */}
        <div className="ad-slot-shell" id="cifra-ad-tools-bottom" aria-hidden="true" />
      </div>
    </main>
  );
}
