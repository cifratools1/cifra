import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Política Editorial y Estándares de Calidad — Cifra',
  description:
    'Conoce nuestros criterios de redacción técnica, fuentes de documentación oficiales (RFC, NIST, ISO, W3C) y el proceso de revisión de nuestras herramientas y guías.',
  alternates: {
    canonical: 'https://cifra.tools/editorial',
  },
};

export default function EditorialPage() {
  return (
    <main className="flex-1 bg-background text-foreground transition-colors">
      <div className="mx-auto max-w-3xl px-4 py-12">
        <h1 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
          Política Editorial y Rigor Técnico
        </h1>
        <p className="mt-3 text-muted leading-relaxed">
          En internet abundan los sitios de utilidades generados por granjas de contenido con
          fórmulas erróneas y explicaciones traducidas automáticamente. En Cifra aplicamos un
          marco estricto de rigor técnico, transparencia y verificación empírica.
        </p>

        <div className="mt-8 space-y-6 text-sm text-foreground/90 leading-relaxed">
          <section>
            <h2 className="text-lg font-bold text-foreground mb-2">1. Fuentes y Estándares Oficiales</h2>
            <p className="text-muted leading-relaxed">
              Toda calculadora, conversor y guía explicativa publicada en Cifra está fundamentada
              directamente en las especificaciones y normativas de los organismos oficiales de
              estandarización de internet y computación:
            </p>
            <ul className="list-disc pl-5 text-muted space-y-2 mt-2">
              <li>
                <strong>IETF (Internet Engineering Task Force):</strong> Especificaciones RFC para
                redes IPv4/IPv6, CIDR (RFC 4632), codificación Base64 (RFC 4648) y Percent-Encoding
                (RFC 3986).
              </li>
              <li>
                <strong>NIST (National Institute of Standards and Technology):</strong> Criterios de
                seguridad para funciones hash FIPS 180-4 (SHA-1, SHA-256, SHA-512) y pautas de
                gestión de identidad digital (SP 800-63B).
              </li>
              <li>
                <strong>W3C & WHATWG:</strong> Especificaciones de formato de color CSS Color 4,
                contraste WCAG 2.1 y codificación de caracteres Unicode / UTF-8.
              </li>
              <li>
                <strong>IEC & IEEE:</strong> Definición de prefijos binarios y decimales (IEC 60027-2)
                para almacenamiento y transmisión de datos.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold text-foreground mb-2">2. Proceso de Verificación y Testing</h2>
            <p className="text-muted leading-relaxed">
              Antes de publicar cualquier herramienta:
            </p>
            <ol className="list-decimal pl-5 text-muted space-y-2 mt-2">
              <li>
                <strong>Validación de casos extremos (Edge Cases):</strong> Se prueban límites
                numéricos como prefijos CIDR /0 y /32, caracteres fuera del plano básico multilingüe
                (emojis y combinaciones UTF-8), números enteros grandes más allá de 2⁵³ (utilizando
                precisión arbitraria <code>BigInt</code>) y cadenas mal formadas.
              </li>
              <li>
                <strong>Ejecución en navegador sin dependencias opacas:</strong> Se priorizan APIs
                nativas probadas de los motores de navegación (Web Crypto API, TextEncoder, canvas
                context) para garantizar fidelidad y seguridad.
              </li>
              <li>
                <strong>Revisión de accesibilidad y contraste:</strong> Se verifica el cumplimiento
                de las directrices de contraste WCAG 2.1 tanto en modo claro como en modo oscuro.
              </li>
            </ol>
          </section>

          <section>
            <h2 className="text-lg font-bold text-foreground mb-2">3. Correcciones y Transparencia</h2>
            <p className="text-muted leading-relaxed">
              Si un usuario o investigador detecta una imprecisión en cualquiera de nuestros artículos
              o herramientas, nos comprometemos a verificarla y corregirla con celeridad. Puedes
              comunicarte con el equipo técnico directamente a través de nuestra{' '}
              <Link href="/contacto" className="text-accent underline">
                página de contacto
              </Link>
              .
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
