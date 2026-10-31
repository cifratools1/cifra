import type { Metadata } from 'next';
import { getToolBySlug, getRelatedTools } from '@/lib/tools';
import SubnetCalculatorClient from './SubnetCalculatorClient';

export const metadata: Metadata = {
  title: 'Calculadora de Subredes IPv4 y CIDR',
  description:
    'Calcula rangos de red, máscara, broadcast, hosts disponibles, máscara wildcard y notación CIDR para cualquier dirección IPv4. Gratuita y 100% en tu navegador.',
  keywords: [
    'calculadora subredes',
    'subnet calculator',
    'CIDR',
    'máscara de red',
    'IPv4',
    'redes',
    'wildcard mask',
    'hosts utilizables',
    'calcular IP',
    'tabla CIDR',
    'dirección de broadcast',
    'redes privadas RFC 1918',
  ],
  alternates: {
    canonical: 'https://cifra.tools/herramientas/calculadora-subredes',
  },
  openGraph: {
    title: 'Calculadora de Subredes IPv4 y CIDR | Cifra',
    description:
      'Calcula rangos de red, máscara, broadcast, hosts disponibles, wildcard y notación CIDR al instante sin enviar datos a ningún servidor.',
    url: 'https://cifra.tools/herramientas/calculadora-subredes',
    siteName: 'Cifra',
    locale: 'es_ES',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Calculadora de Subredes IPv4 y CIDR | Cifra',
    description:
      'Calcula rangos de red, máscara, broadcast, hosts disponibles y notación CIDR para cualquier IPv4.',
  },
};

export default function SubnetCalculatorPage() {
  const tool = getToolBySlug('calculadora-subredes');
  const relatedTools = getRelatedTools('calculadora-subredes');

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebApplication',
        '@id': 'https://cifra.tools/herramientas/calculadora-subredes#webapp',
        name: 'Calculadora de Subredes IPv4 y CIDR',
        url: 'https://cifra.tools/herramientas/calculadora-subredes',
        description:
          'Herramienta web gratuita para calcular subredes IPv4, máscaras, direcciones de broadcast, rango de hosts utilizables y representación binaria.',
        applicationCategory: 'UtilityApplication',
        operatingSystem: 'All',
        offers: {
          '@type': 'Offer',
          price: '0',
          priceCurrency: 'EUR',
        },
        inLanguage: 'es',
      },
      {
        '@type': 'FAQPage',
        '@id': 'https://cifra.tools/herramientas/calculadora-subredes#faq',
        mainEntity: [
          {
            '@type': 'Question',
            name: '¿Qué es una subred y para qué sirve dividir una red (subnetting)?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Una subred es una división lógica de una red IP mayor. El proceso de subnetting permite segmentar redes físicas en subredes virtuales más pequeñas e independientes para optimizar seguridad, tráfico y administración de direcciones.',
            },
          },
          {
            '@type': 'Question',
            name: '¿Por qué se restan 2 direcciones al calcular los hosts utilizables?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'En las subredes IPv4 estándar se reservan obligatoriamente dos direcciones que no pueden asignarse a dispositivos: la Dirección de Red (primera del rango) y la Dirección de Broadcast (última del rango). Por ello la fórmula es 2^(32 - prefijo) - 2.',
            },
          },
          {
            '@type': 'Question',
            name: '¿Qué es la notación CIDR y por qué sustituyó a las clases tradicionales?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'CIDR (Classless Inter-Domain Routing) reemplazó la asignación rígida por clases A, B y C en 1993, permitiendo prefijos de longitud variable desde /0 hasta /32 para evitar el desperdicio de direcciones IPv4.',
            },
          },
          {
            '@type': 'Question',
            name: '¿Qué es la máscara wildcard y dónde se utiliza?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'La máscara wildcard es la inversión binaria de la máscara de subred (restando cada octeto a 255). Se utiliza principalmente en Listas de Control de Acceso (ACL) y protocolos de enrutamiento como OSPF y EIGRP.',
            },
          },
          {
            '@type': 'Question',
            name: '¿Se pueden usar subredes /31 para conectar dos routers?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Sí, bajo el estándar RFC 3021, las subredes /31 son válidas para enlaces bilaterales punto a punto entre routers, asignando ambas direcciones sin necesidad de broadcast ni red.',
            },
          },
          {
            '@type': 'Question',
            name: '¿Cómo saber si una dirección IPv4 es pública o privada?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Las IPs privadas pertenecen a los rangos del RFC 1918: 10.0.0.0/8, 172.16.0.0/12 y 192.168.0.0/16, reservados para redes internas. El resto son públicas y enrutables en Internet.',
            },
          },
        ],
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c') }}
      />
      <SubnetCalculatorClient
        title={tool?.name || 'Calculadora de Subredes IPv4'}
        description={
          tool?.description ||
          'Calcula rangos de red, máscara, broadcast, hosts disponibles y notación CIDR para cualquier dirección IPv4.'
        }
        relatedTools={relatedTools.map((t) => ({
          slug: t.slug,
          name: t.name,
          shortName: t.shortName,
        }))}
      />
    </>
  );
}
