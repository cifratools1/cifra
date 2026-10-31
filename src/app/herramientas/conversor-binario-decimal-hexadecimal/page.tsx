import React from 'react';
import type { Metadata } from 'next';
import { ToolLayout } from '@/components/ToolComponents';
import { getRelatedTools, getToolBySlug } from '@/lib/tools';
import ConverterClient from './ConverterClient';

const TOOL_SLUG = 'conversor-binario-decimal-hexadecimal';

export const metadata: Metadata = {
  title: 'Conversor Binario, Decimal, Octal y Hexadecimal | Cifra',
  description:
    'Convierte números entre binario, decimal, octal y hexadecimal en tiempo real con explicación matemática paso a paso. Soporta números grandes con BigInt. 100% gratuito en tu navegador.',
  keywords: [
    'conversor binario',
    'conversor binario decimal',
    'binario a hexadecimal',
    'hexadecimal a decimal',
    'conversor octal',
    'calculadora binaria',
    'sistema binario',
    'sistema hexadecimal',
    'divisiones sucesivas binario',
    'tabla binario decimal hex',
  ],
  alternates: {
    canonical: `https://cifra.tools/herramientas/${TOOL_SLUG}`,
  },
  openGraph: {
    title: 'Conversor Binario, Decimal, Octal y Hexadecimal | Cifra',
    description:
      'Convierte números entre binario, decimal, octal y hexadecimal al instante con paso a paso y tabla de referencia 0-255.',
    url: `https://cifra.tools/herramientas/${TOOL_SLUG}`,
    siteName: 'Cifra',
    locale: 'es_ES',
    type: 'website',
  },
};

const FAQ_ITEMS = [
  {
    question: '¿Cómo convertir de binario a decimal manualmente?',
    answer:
      'Se multiplica cada dígito binario (0 o 1) por 2 elevado a la potencia de su posición, contando de derecha a izquierda comenzando en 0, y luego se suman todos los productos. Por ejemplo, para 1011₂: (1 × 2³) + (0 × 2²) + (1 × 2¹) + (1 × 2⁰) = 8 + 0 + 2 + 1 = 11₁₀.',
  },
  {
    question: '¿Por qué el sistema hexadecimal utiliza letras de la A a la F?',
    answer:
      'Al ser un sistema en base 16, requiere 16 símbolos distintos para cada posición. Dado que el sistema numérico arábigo solo cuenta con diez dígitos (0 al 9), se incorporaron las primeras seis letras del abecedario latino: A = 10, B = 11, C = 12, D = 13, E = 14 y F = 15.',
  },
  {
    question: '¿Por qué las computadoras funcionan con sistema binario?',
    answer:
      'Los procesadores y memorias electrónicas están fabricados con transistores microscópicos. En los circuitos digitales es física y técnicamente mucho más confiable y rápido distinguir entre dos niveles estables de voltaje (encendido/apagado, 1 y 0) que medir con precisión continua diez niveles analógicos diferentes.',
  },
  {
    question: '¿Cuál es la relación directa entre el sistema binario y el hexadecimal?',
    answer:
      'Dado que 16 es una potencia exacta de 2 (16 = 2⁴), cada dígito hexadecimal equivale exactamente a 4 dígitos binarios (un nibble). Así, dos dígitos hexadecimales representan a la perfección un byte de 8 bits (como 0xFF = 11111111₂ = 255₁₀), facilitando la lectura humana del código de máquina.',
  },
  {
    question: '¿Para qué se utiliza el sistema octal en la actualidad?',
    answer:
      'El uso más cotidiano del sistema octal (base 8) hoy en día está en la gestión de permisos de archivos y directorios en sistemas tipo UNIX y Linux (comando chmod). Cada dígito octal del 0 al 7 codifica con precisión los 3 bits de permisos de lectura (4), escritura (2) y ejecución (1).',
  },
  {
    question: '¿Qué significan los prefijos 0x, 0b y 0o en programación?',
    answer:
      'Son indicadores sintácticos estándar utilizados en lenguajes como JavaScript, Python, C, C++, Rust y Java para especificar la base numérica de una constante literal: "0b" para binario (ej. 0b1010), "0o" para octal (ej. 0o755) y "0x" para hexadecimal (ej. 0xFF).',
  },
  {
    question: '¿Tiene límite de tamaño el conversor de Cifra?',
    answer:
      'Gracias al uso del tipo de dato nativo BigInt de JavaScript en lugar de números de coma flotante estándar de 64 bits, esta herramienta puede procesar enteros de cientos o miles de dígitos y longitudes de 256 bits o mayores sin redondeos ni pérdida de precisión.',
  },
  {
    question: '¿Se envía mi información a algún servidor web?',
    answer:
      'No. Todo el procesamiento se realiza en tu propio navegador mediante JavaScript: lo que introduces en la herramienta no se envía a ningún servidor.',
  },
];

export default function ConversorBasesPage() {
  const tool = getToolBySlug(TOOL_SLUG);
  const relatedTools = getRelatedTools(TOOL_SLUG);

  // Structured Data (JSON-LD) for SEO
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'SoftwareApplication',
        name: tool?.name || 'Conversor Binario, Decimal y Hexadecimal',
        applicationCategory: 'UtilitiesApplication',
        operatingSystem: 'All',
        offers: {
          '@type': 'Offer',
          price: '0',
          priceCurrency: 'USD',
        },
        description:
          tool?.description ||
          'Convierte números entre binario, decimal, octal y hexadecimal de forma instantánea con explicación paso a paso.',
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

  const educationalSection = (
    <div className="space-y-8 text-foreground">
      <div>
        <h2 className="text-xl font-bold tracking-tight text-foreground mb-3">
          Sistemas de numeración posicionales en informática
        </h2>
        <p className="text-sm text-muted leading-relaxed">
          En matemáticas y computación, un sistema de numeración posicional es aquel donde el valor
          de cada dígito depende tanto de su propio símbolo como de la posición relativa que ocupa
          dentro de la cifra. La base del sistema determina cuántos símbolos únicos existen y el
          factor multiplicador de cada posición sucesiva.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 not-prose">
        <div className="p-4 rounded-lg border border-card-border bg-card">
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2 py-0.5 text-xs font-bold rounded bg-accent-light text-accent">
              Base 2
            </span>
            <h3 className="text-sm font-bold text-foreground">Sistema Binario</h3>
          </div>
          <p className="text-xs text-muted leading-relaxed">
            Utiliza únicamente dos dígitos: <strong className="text-foreground">0</strong> y{' '}
            <strong className="text-foreground">1</strong>. Es el lenguaje natural del hardware
            digital. Cada dígito binario se denomina <em className="text-foreground">bit</em>{' '}
            (binary digit). Un conjunto de 8 bits conforma un byte, capaz de representar 256 valores
            diferentes (del 0 al 255).
          </p>
        </div>

        <div className="p-4 rounded-lg border border-card-border bg-card">
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2 py-0.5 text-xs font-bold rounded bg-accent-light text-accent">
              Base 16
            </span>
            <h3 className="text-sm font-bold text-foreground">Sistema Hexadecimal</h3>
          </div>
          <p className="text-xs text-muted leading-relaxed">
            Utiliza 16 símbolos:{' '}
            <strong className="text-foreground">0-9</strong> y{' '}
            <strong className="text-foreground">A-F</strong> (donde A=10, B=11, C=12, D=13, E=14 y
            F=15). Es la forma más compacta de representar bytes: exactamente 2 caracteres
            hexadecimales describen cualquier byte de memoria, color HTML/CSS o dirección MAC.
          </p>
        </div>

        <div className="p-4 rounded-lg border border-card-border bg-card">
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2 py-0.5 text-xs font-bold rounded bg-accent-light text-accent">
              Base 8
            </span>
            <h3 className="text-sm font-bold text-foreground">Sistema Octal</h3>
          </div>
          <p className="text-xs text-muted leading-relaxed">
            Utiliza ocho dígitos:{' '}
            <strong className="text-foreground">0 al 7</strong>. Como 8 = 2³, cada dígito octal
            corresponde exactamente a un trío de bits binarios. Se utiliza habitualmente en sistemas
            UNIX/Linux para expresar permisos de archivos (lectura=4, escritura=2, ejecución=1).
          </p>
        </div>

        <div className="p-4 rounded-lg border border-card-border bg-card">
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2 py-0.5 text-xs font-bold rounded bg-accent-light text-accent">
              Base 10
            </span>
            <h3 className="text-sm font-bold text-foreground">Sistema Decimal</h3>
          </div>
          <p className="text-xs text-muted leading-relaxed">
            El sistema convencional de diez dígitos (0 al 9) utilizado por la humanidad, basado
            históricamente en el conteo con diez dedos. Todas las operaciones aritméticas de la vida
            cotidiana se expresan en esta notación.
          </p>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-bold text-foreground mb-3">
          ¿Cómo funcionan los métodos de conversión manual?
        </h3>
        <div className="space-y-4 text-sm text-muted">
          <div>
            <h4 className="font-semibold text-foreground mb-1">
              1. De cualquier base a Decimal: Notación Polinómica
            </h4>
            <p className="leading-relaxed">
              Para convertir un número desde una base <em className="text-foreground">B</em> a base
              10, se multiplica el valor de cada dígito por la base elevada a su exponente posicional
              (de derecha a izquierda, empezando en 0):
            </p>
            <div className="mt-2 p-3 rounded bg-card border border-card-border font-mono text-xs text-foreground">
              Número = (dₙ₋₁ × Bⁿ⁻¹) + ... + (d₁ × B¹) + (d₀ × B⁰)
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-foreground mb-1">
              2. De Decimal a cualquier base: Método de Divisiones Sucesivas
            </h4>
            <p className="leading-relaxed">
              Para pasar un número decimal a binario, octal o hexadecimal, se divide el número
              entero sucesivamente entre la base deseada. En cada división se anota el residuo. El
              proceso termina cuando el cociente es cero. El resultado final se obtiene leyendo todos
              los residuos en orden inverso (desde el último residuo obtenido hasta el primero).
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-foreground mb-1">
              3. Conversión directa entre Binario, Octal y Hexadecimal
            </h4>
            <p className="leading-relaxed">
              No es necesario pasar por el sistema decimal cuando se trabaja entre bases potencias de
              dos:
            </p>
            <ul className="list-disc pl-5 mt-2 space-y-1 text-xs">
              <li>
                <strong className="text-foreground">Binario a Hexadecimal:</strong> Agrupa los bits
                en bloques de 4 (nibbles) de derecha a izquierda y traduce cada bloque a su
                equivalente de un dígito hex (por ejemplo 1010₂ = A₁₆).
              </li>
              <li>
                <strong className="text-foreground">Binario a Octal:</strong> Agrupa los bits en
                bloques de 3 de derecha a izquierda y traduce cada bloque a su dígito octal (por
                ejemplo 111₂ = 7₈).
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c') }}
      />
      <ToolLayout
        title={tool?.name || 'Conversor Binario, Decimal y Hexadecimal'}
        description={
          tool?.description ||
          'Convierte números entre binario, decimal, octal y hexadecimal de forma instantánea con explicación paso a paso.'
        }
        educationalContent={educationalSection}
        faq={FAQ_ITEMS}
        relatedTools={relatedTools}
      >
        <ConverterClient />
      </ToolLayout>
    </>
  );
}
