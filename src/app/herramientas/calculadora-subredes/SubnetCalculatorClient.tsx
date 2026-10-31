'use client';

import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { ToolLayout, CopyButton } from '@/components/ToolComponents';
import { CheckIcon, CopyIcon } from '@/components/Icons';
import {
  type SubnetResult,
  validateIpv4,
  calculateSubnet,
} from '@/lib/subnet';

interface CommonCidrRow {
  cidr: number;
  mask: string;
  wildcard: string;
  total: number;
  usable: number;
  use: string;
}

// Tabla de referencia rápida de prefijos comunes
const COMMON_CIDR_TABLE: CommonCidrRow[] = [
  { cidr: 8, mask: '255.0.0.0', wildcard: '0.255.255.255', total: 16777216, usable: 16777214, use: 'Redes muy grandes (antigua Clase A), backbones e ISPs' },
  { cidr: 16, mask: '255.255.0.0', wildcard: '0.0.255.255', total: 65536, usable: 65534, use: 'Redes corporativas, universidades, campus amplios' },
  { cidr: 20, mask: '255.255.240.0', wildcard: '0.0.15.255', total: 4096, usable: 4094, use: 'Sedes medianas o edificios empresariales' },
  { cidr: 22, mask: '255.255.252.0', wildcard: '0.0.3.255', total: 1024, usable: 1022, use: 'Centros de datos, granjas de servidores' },
  { cidr: 24, mask: '255.255.255.0', wildcard: '0.0.0.255', total: 256, usable: 254, use: 'Redes LAN domésticas y oficinas habituales (estándar)' },
  { cidr: 25, mask: '255.255.255.128', wildcard: '0.0.0.127', total: 128, usable: 126, use: 'División de una /24 en 2 subredes iguales' },
  { cidr: 26, mask: '255.255.255.192', wildcard: '0.0.0.63', total: 64, usable: 62, use: 'División de una /24 en 4 subredes por departamento' },
  { cidr: 27, mask: '255.255.255.224', wildcard: '0.0.0.31', total: 32, usable: 30, use: 'VLANs pequeñas, grupos de trabajo segmentados' },
  { cidr: 28, mask: '255.255.255.240', wildcard: '0.0.0.15', total: 16, usable: 14, use: 'Zonas DMZ, balanceadores, pequeñas sucursales' },
  { cidr: 29, mask: '255.255.255.248', wildcard: '0.0.0.7', total: 8, usable: 6, use: 'Bloques de IPs públicas estáticas de ISP' },
  { cidr: 30, mask: '255.255.255.252', wildcard: '0.0.0.3', total: 4, usable: 2, use: 'Enlaces WAN punto a punto tradicionales entre routers' },
  { cidr: 31, mask: '255.255.255.254', wildcard: '0.0.0.1', total: 2, usable: 2, use: 'Enlaces punto a punto modernos (RFC 3021, sin desperdicio)' },
  { cidr: 32, mask: '255.255.255.255', wildcard: '0.0.0.0', total: 1, usable: 1, use: 'Host individual, interfaces loopback y reglas de firewall' },
];

// Presets prácticos para probar con un clic
const PRESETS = [
  { label: 'LAN estándar (/24)', ip: '192.168.1.1', cidr: 24 },
  { label: 'Red corporativa (/16)', ip: '10.0.0.1', cidr: 16 },
  { label: 'Subred mediana (/20)', ip: '172.16.0.1', cidr: 20 },
  { label: 'Servidores DMZ (/28)', ip: '192.168.10.1', cidr: 28 },
  { label: 'Enlace punto a punto (/30)', ip: '10.254.0.1', cidr: 30 },
  { label: 'Host único (/32)', ip: '192.168.1.50', cidr: 32 },
];

// Generar lista de los 33 prefijos CIDR disponibles (0 a 32)
function getCidrOptions() {
  const options = [];
  for (let c = 0; c <= 32; c++) {
    const maskNum = c === 0 ? 0 : ((0xFFFFFFFF << (32 - c)) >>> 0);
    const maskStr = [
      (maskNum >>> 24) & 255,
      (maskNum >>> 16) & 255,
      (maskNum >>> 8) & 255,
      maskNum & 255,
    ].join('.');
    const total = Math.pow(2, 32 - c);
    let usable = 0;
    if (c === 32) usable = 1;
    else if (c === 31) usable = 2;
    else if (c === 0) usable = 4294967294;
    else usable = total - 2;

    options.push({
      cidr: c,
      mask: maskStr,
      total,
      usable,
    });
  }
  return options;
}

const ALL_CIDR_OPTIONS = getCidrOptions();

interface SubnetCalculatorClientProps {
  title: string;
  description: string;
  relatedTools: Array<{ slug: string; name: string; shortName: string }>;
}

export default function SubnetCalculatorClient({
  title,
  description,
  relatedTools,
}: SubnetCalculatorClientProps) {
  const [ipInput, setIpInput] = useState<string>('192.168.1.0');
  const [cidr, setCidr] = useState<number>(24);
  const [copiedAll, setCopiedAll] = useState<boolean>(false);

  // Leer parámetros de URL al montar en el cliente (evita desincronización de hidratación)
  useEffect(() => {
    const timer = setTimeout(() => {
      try {
        const params = new URLSearchParams(window.location.search);
        const qIp = params.get('ip');
        const qCidr = params.get('cidr');
        if (qIp) setIpInput(qIp);
        if (qCidr) {
          const p = parseInt(qCidr, 10);
          if (!isNaN(p) && p >= 0 && p <= 32) setCidr(p);
        }
      } catch {
        // Ignore
      }
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  // Actualizar URL con parámetros compartibles
  useEffect(() => {
    try {
      if (typeof window !== 'undefined' && ipInput.trim()) {
        const url = new URL(window.location.href);
        url.searchParams.set('ip', ipInput.trim());
        url.searchParams.set('cidr', cidr.toString());
        window.history.replaceState({}, '', url.toString());
      }
    } catch {
      // Ignore
    }
  }, [ipInput, cidr]);

  // Manejar el cambio de texto en el campo de IP
  // Detecta inteligentemente si el usuario pega "192.168.1.1/28"
  const handleIpChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawVal = e.target.value;
    if (rawVal.includes('/')) {
      const parts = rawVal.split('/');
      const parsedIp = parts[0].trim();
      const parsedPrefix = parseInt(parts[1].trim(), 10);
      setIpInput(parsedIp);
      if (!isNaN(parsedPrefix) && parsedPrefix >= 0 && parsedPrefix <= 32) {
        setCidr(parsedPrefix);
      }
    } else {
      setIpInput(rawVal);
    }
  };

  // Validación de la IP actual
  const validation = useMemo(() => validateIpv4(ipInput), [ipInput]);

  // Cálculo de resultados de subred
  const subnetResult = useMemo<SubnetResult | null>(() => {
    return calculateSubnet(ipInput, cidr);
  }, [ipInput, cidr]);

  // Aplicar un preset de ejemplo
  const handleApplyPreset = (presetIp: string, presetCidr: number) => {
    setIpInput(presetIp);
    setCidr(presetCidr);
  };

  // Copiar todo el informe formateado
  const handleCopyFullReport = useCallback(async () => {
    if (!subnetResult) return;

    const report = [
      `=== RESUMEN DE SUBRED IPV4 (Cifra) ===`,
      `Dirección consultada: ${subnetResult.ip}`,
      `Notación CIDR:        ${subnetResult.cidrNotation}`,
      `Dirección de red:     ${subnetResult.networkAddress}`,
      `Máscara de subred:    ${subnetResult.subnetMask}`,
      `Máscara wildcard:     ${subnetResult.wildcardMask}`,
      `Dirección broadcast:  ${subnetResult.broadcastAddress}`,
      `Primer host útil:     ${subnetResult.firstHost}`,
      `Último host útil:     ${subnetResult.lastHost}`,
      `Rango utilizable:     ${subnetResult.usableRange}`,
      `Hosts utilizables:    ${subnetResult.usableHosts.toLocaleString('es-ES')}`,
      `Total de direcciones: ${subnetResult.totalHosts.toLocaleString('es-ES')}`,
      `Clase de IP:          ${subnetResult.ipClass}`,
      `Tipo de red:          ${subnetResult.ipScope}`,
      `Bits de Red / Host:   ${subnetResult.networkBits} / ${subnetResult.hostBits}`,
      `Binario de Red:       ${subnetResult.networkBinary}`,
      `Binario de Máscara:   ${subnetResult.subnetMaskBinary}`,
    ].join('\n');

    try {
      await navigator.clipboard.writeText(report);
      setCopiedAll(true);
      setTimeout(() => setCopiedAll(false), 2000);
    } catch {
      const textarea = document.createElement('textarea');
      textarea.value = report;
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setCopiedAll(true);
      setTimeout(() => setCopiedAll(false), 2000);
    }
  }, [subnetResult]);

  // Helper para renderizar los 32 bits coloreando bits de red y host
  const renderBinaryBits = (binaryStrWithDots: string, netBits: number) => {
    const octets = binaryStrWithDots.split('.');
    let globalBitIndex = 0;

    return (
      <span className="font-mono text-xs sm:text-sm tracking-wider">
        {octets.map((oct, octIdx) => (
          <React.Fragment key={octIdx}>
            {octIdx > 0 && <span className="text-muted/60 font-bold mx-0.5">.</span>}
            {oct.split('').map((bit, bitIdx) => {
              const isNetworkBit = globalBitIndex < netBits;
              globalBitIndex++;
              return (
                <span
                  key={bitIdx}
                  className={
                    isNetworkBit
                      ? 'text-accent font-semibold'
                      : 'text-warning font-semibold'
                  }
                >
                  {bit}
                </span>
              );
            })}
          </React.Fragment>
        ))}
      </span>
    );
  };

  // Preguntas frecuentes para la sección de FAQ y Schema
  const faqData = [
    {
      question: '¿Qué es una subred y para qué sirve dividir una red (subnetting)?',
      answer:
        'Una subred es una división lógica de una red IP mayor. El proceso de subnetting permite a ingenieros y administradores segmentar redes físicas en subredes virtuales más pequeñas e independientes. Esto mejora sustancialmente la seguridad (aislando departamentos, servidores o dispositivos IoT), optimiza el rendimiento disminuyendo el tráfico de broadcast y permite administrar las direcciones IP disponibles con máxima eficiencia.',
    },
    {
      question: '¿Por qué se restan 2 direcciones al calcular los hosts utilizables?',
      answer:
        'En las subredes IPv4 estándar (/0 a /30), cada subred reserva obligatoriamente dos direcciones que no pueden asignarse a dispositivos: la Dirección de Red (la primera dirección del rango, con todos los bits de host en 0), utilizada por los routers para identificar el segmento, y la Dirección de Broadcast (la última del rango, con todos los bits de host en 1), utilizada para enviar paquetes a todos los dispositivos de la subred a la vez. Por esta razón, la fórmula de hosts utilizables es 2^(32 - prefijo) - 2.',
    },
    {
      question: '¿Qué es la notación CIDR y por qué sustituyó a las clases tradicionales?',
      answer:
        'CIDR (Classless Inter-Domain Routing, Enrutamiento Interdominios sin Clases) se introdujo en 1993 mediante el RFC 1519 para superar las limitaciones del direccionamiento clásico (Clases A, B y C). En el modelo antiguo, solo podían solicitarse bloques rígidos (/8 con 16M de IPs, /16 con 65.536 IPs o /24 con 256 IPs), provocando un enorme desperdicio de espacio IPv4. CIDR permite utilizar prefijos de longitud variable desde /0 hasta /32, adaptando el tamaño del bloque exactamente a las necesidades de cada organización.',
    },
    {
      question: '¿Qué es la máscara wildcard y dónde se utiliza?',
      answer:
        'La máscara wildcard (o comodín) es la inversión binaria de la máscara de subred: los bits en 1 de la máscara pasan a ser 0, y los bits en 0 pasan a ser 1. En decimal con puntos, equivale a restar cada octeto de la máscara a 255 (por ejemplo, para la máscara 255.255.255.0 la wildcard es 0.0.0.255). Es obligatoria en la configuración de Listas de Control de Acceso (ACL), reglas de cortafuegos y protocolos de enrutamiento como OSPF y EIGRP en dispositivos Cisco, Juniper y MikroTik.',
    },
    {
      question: '¿Se pueden usar subredes /31 para conectar dos routers?',
      answer:
        'Sí. De acuerdo con el estándar oficial RFC 3021, las subredes /31 están diseñadas específicamente para enlaces punto a punto entre routers o firewalls. En este tipo de enlaces estrictamente bilaterales no se requiere dirección de broadcast ni de red, por lo que las 2 direcciones disponibles son completamente asignables a los dos extremos. Esto ahorra un 50% de direcciones IP públicas en comparación con el prefijo /30 tradicional.',
    },
    {
      question: '¿Cómo saber si una dirección IPv4 es pública o privada?',
      answer:
        'Las direcciones IP privadas están definidas en el RFC 1918 y corresponden a tres rangos reservados: 10.0.0.0 a 10.255.255.255 (10.0.0.0/8), 172.16.0.0 a 172.31.255.255 (172.16.0.0/12) y 192.168.0.0 a 192.168.255.255 (192.168.0.0/16). Estas IPs son de uso libre en redes locales hogareñas y corporativas pero no se enrutan en Internet. Cualquier otra dirección (salvo rangos especiales como loopback 127.0.0.0/8 o APIPA 169.254.0.0/16) es una dirección pública enrutable globalmente.',
    },
  ];

  // Contenido educativo para la sección estática
  const educationalContent = (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-bold text-foreground">Fundamentos de Subnetting y Direccionamiento IPv4</h2>
        <p className="mt-3 text-muted leading-relaxed">
          El subnetting o subdivisión de redes es una de las habilidades esenciales de la arquitectura de redes, la administración de sistemas y la ciberseguridad. Comprender cómo se descomponen los 32 bits de una dirección IPv4 permite planificar infraestructuras escalables, aislar dominios de difusión y optimizar el uso de los escasos recursos de direccionamiento IPv4.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="p-4 border border-card-border rounded-lg bg-card">
          <h3 className="text-base font-semibold text-foreground flex items-center gap-2">
            <span className="text-accent font-mono text-sm">01.</span> Anatomía de una dirección IPv4
          </h3>
          <p className="mt-2 text-sm text-muted leading-relaxed">
            Una dirección IPv4 consta de <strong>32 bits</strong> agrupados en 4 bloques de 8 bits (octetos), separados por puntos. Cada octeto toma valores de 0 a 255. Toda dirección se divide en dos componentes:
          </p>
          <ul className="mt-2 text-sm text-muted space-y-1 list-disc list-inside">
            <li><strong className="text-foreground">Identificador de Red (Net ID):</strong> Señala a qué segmento o subred pertenece la máquina.</li>
            <li><strong className="text-foreground">Identificador de Host (Host ID):</strong> Identifica de forma única al dispositivo específico dentro de esa subred.</li>
          </ul>
        </div>

        <div className="p-4 border border-card-border rounded-lg bg-card">
          <h3 className="text-base font-semibold text-foreground flex items-center gap-2">
            <span className="text-accent font-mono text-sm">02.</span> El rol de la Máscara de Subred
          </h3>
          <p className="mt-2 text-sm text-muted leading-relaxed">
            La máscara de subred indica exactamente la frontera entre la porción de red y la de host. Se compone de una secuencia continua de <strong>1s binarios</strong> para los bits de red, seguidos de <strong>0s binarios</strong> para los bits de host.
          </p>
          <p className="mt-2 text-sm text-muted leading-relaxed">
            Para averiguar si dos equipos están en la misma red local, la tarjeta de red aplica una operación lógica <code className="bg-code-bg px-1.5 py-0.5 rounded text-foreground font-mono text-xs">AND</code> entre la IP y la máscara.
          </p>
        </div>
      </div>

      <div className="p-5 border border-card-border rounded-lg bg-card space-y-4">
        <h3 className="text-base font-semibold text-foreground">Fórmulas matemáticas fundamentales para el cálculo de subredes</h3>
        <p className="text-sm text-muted leading-relaxed">
          Si dispones de un prefijo de longitud <code className="bg-code-bg px-1.5 py-0.5 rounded text-foreground font-mono text-xs">/n</code>, el número de bits asignados al host es <code className="bg-code-bg px-1.5 py-0.5 rounded text-foreground font-mono text-xs">h = 32 - n</code>:
        </p>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="p-3 bg-code-bg rounded-md border border-card-border">
            <div className="text-xs font-medium text-muted">Total de direcciones IP</div>
            <div className="mt-1 font-mono text-lg text-foreground font-bold">2^(32 - n)</div>
            <p className="mt-1 text-xs text-muted">Ejemplo para /24: 2^(32-24) = 2^8 = 256 direcciones en total.</p>
          </div>
          <div className="p-3 bg-code-bg rounded-md border border-card-border">
            <div className="text-xs font-medium text-muted">Hosts útiles para dispositivos</div>
            <div className="mt-1 font-mono text-lg text-accent font-bold">2^(32 - n) - 2</div>
            <p className="mt-1 text-xs text-muted">Ejemplo para /24: 256 - 2 = 254 interfaces asignables.</p>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-base font-semibold text-foreground">Rangos de Direcciones IP Privadas (RFC 1918)</h3>
        <div className="overflow-x-auto border border-card-border rounded-lg">
          <table className="w-full text-left text-sm">
            <thead className="bg-code-bg text-muted border-b border-card-border text-xs">
              <tr>
                <th className="px-4 py-3 font-semibold">Clase</th>
                <th className="px-4 py-3 font-semibold">Bloque CIDR</th>
                <th className="px-4 py-3 font-semibold">Rango de Direcciones IP</th>
                <th className="px-4 py-3 font-semibold">Total de Hosts</th>
                <th className="px-4 py-3 font-semibold">Uso Habitual</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-card-border">
              <tr className="hover:bg-card/50">
                <td className="px-4 py-2.5 font-medium text-foreground">Clase A</td>
                <td className="px-4 py-2.5 font-mono text-accent font-semibold">10.0.0.0/8</td>
                <td className="px-4 py-2.5 font-mono text-muted">10.0.0.0 – 10.255.255.255</td>
                <td className="px-4 py-2.5 text-foreground">16.777.214</td>
                <td className="px-4 py-2.5 text-muted">Grandes multinacionales, clouds privadas</td>
              </tr>
              <tr className="hover:bg-card/50">
                <td className="px-4 py-2.5 font-medium text-foreground">Clase B</td>
                <td className="px-4 py-2.5 font-mono text-accent font-semibold">172.16.0.0/12</td>
                <td className="px-4 py-2.5 font-mono text-muted">172.16.0.0 – 172.31.255.255</td>
                <td className="px-4 py-2.5 text-foreground">1.048.574</td>
                <td className="px-4 py-2.5 text-muted">Universidades, campus, medianas empresas</td>
              </tr>
              <tr className="hover:bg-card/50">
                <td className="px-4 py-2.5 font-medium text-foreground">Clase C</td>
                <td className="px-4 py-2.5 font-mono text-accent font-semibold">192.168.0.0/16</td>
                <td className="px-4 py-2.5 font-mono text-muted">192.168.0.0 – 192.168.255.255</td>
                <td className="px-4 py-2.5 text-foreground">65.534</td>
                <td className="px-4 py-2.5 text-muted">Routers domésticos, pequeñas oficinas (SOHO)</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  return (
    <ToolLayout
      title={title}
      description={description}
      faq={faqData}
      relatedTools={relatedTools}
      educationalContent={educationalContent}
    >
      {/* Panel de entrada de datos */}
      <div className="border border-card-border rounded-xl bg-card p-5 sm:p-6">
        <h2 className="text-base font-semibold text-foreground mb-4">Parámetros de la subred</h2>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Campo IP */}
          <div>
            <label htmlFor="ip-input" className="block text-sm font-medium text-foreground mb-1.5">
              Dirección IPv4
            </label>
            <div className="relative">
              <input
                id="ip-input"
                type="text"
                value={ipInput}
                onChange={handleIpChange}
                placeholder="ej. 192.168.1.1 o 10.0.0.1/24"
                className={`w-full px-3.5 py-2.5 text-sm font-mono bg-background rounded-lg border transition-colors outline-none ${
                  validation.isValid
                    ? 'border-input-border focus:border-accent'
                    : 'border-danger text-danger focus:border-danger'
                }`}
                aria-invalid={!validation.isValid}
                aria-describedby={!validation.isValid ? 'ip-error' : undefined}
              />
            </div>

            {/* Error de validación */}
            {!validation.isValid && (
              <p id="ip-error" className="mt-2 text-xs text-danger flex items-center gap-1.5" role="alert">
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="7" cy="7" r="6" />
                  <path d="M7 4v3.5M7 10h.01" />
                </svg>
                {validation.error}
              </p>
            )}

            {/* Presets rápidos */}
            <div className="mt-3">
              <span className="text-xs font-medium text-muted block mb-1.5">Ejemplos rápidos:</span>
              <div className="flex flex-wrap gap-1.5">
                {PRESETS.map((p, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleApplyPreset(p.ip, p.cidr)}
                    className="px-2.5 py-1 text-xs rounded-md border border-card-border bg-background hover:border-accent hover:text-accent text-muted transition-colors"
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Selector de prefijo CIDR y Máscara */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label htmlFor="cidr-select" className="text-sm font-medium text-foreground">
                Máscara de subred / Notación CIDR
              </label>
              <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-accent-light text-accent">
                /{cidr}
              </span>
            </div>

            {/* Dropdown de máscaras */}
            <select
              id="cidr-select"
              value={cidr}
              onChange={(e) => setCidr(parseInt(e.target.value, 10))}
              className="w-full px-3.5 py-2.5 text-sm font-mono bg-background rounded-lg border border-input-border text-foreground focus:border-accent transition-colors outline-none cursor-pointer"
            >
              {ALL_CIDR_OPTIONS.map((opt) => (
                <option key={opt.cidr} value={opt.cidr}>
                  /{opt.cidr} &mdash; {opt.mask} ({opt.usable.toLocaleString('es-ES')} hosts útiles)
                </option>
              ))}
            </select>

            {/* Slider de prefijo CIDR */}
            <div className="mt-4">
              <div className="flex justify-between text-xs text-muted font-mono mb-1">
                <span>/0 (Internet)</span>
                <span>/24 (LAN)</span>
                <span>/32 (Host)</span>
              </div>
              <input
                type="range"
                min="0"
                max="32"
                step="1"
                value={cidr}
                onChange={(e) => setCidr(parseInt(e.target.value, 10))}
                className="w-full h-2 bg-card-border rounded-lg appearance-none cursor-pointer accent-accent"
                aria-label="Ajustar longitud de prefijo CIDR"
              />
            </div>

            {/* Botones de prefijos frecuentes */}
            <div className="mt-3 flex flex-wrap gap-1">
              {[8, 16, 24, 26, 27, 28, 29, 30, 32].map((commonCidr) => (
                <button
                  key={commonCidr}
                  type="button"
                  onClick={() => setCidr(commonCidr)}
                  className={`px-2 py-0.5 text-xs font-mono rounded border transition-colors ${
                    cidr === commonCidr
                      ? 'bg-accent text-white border-accent'
                      : 'bg-background text-muted border-card-border hover:border-accent hover:text-accent'
                  }`}
                >
                  /{commonCidr}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Resultados calculados */}
      {subnetResult ? (
        <div className="space-y-6">
          {/* Panel Unificado de Resultados (2 columnas en escritorio, 1 en móvil) */}
          <div className="border border-card-border rounded-xl bg-card shadow-2xs overflow-hidden">
            {/* Cabecera del Panel con botón Copiar y confirmación visual */}
            <div className="p-5 sm:p-6 border-b border-card-border bg-card-subtle/70 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-xs font-semibold text-muted">
                  Resultados del cálculo
                </span>
                <div className="mt-1 flex flex-wrap items-baseline gap-3">
                  <span className="text-2xl sm:text-3xl font-mono font-bold text-foreground">
                    {subnetResult.cidrNotation}
                  </span>
                  <span className="text-sm font-medium text-muted">
                    ({subnetResult.subnetMask})
                  </span>
                </div>
                <p className="mt-1 text-xs text-muted flex items-center gap-2">
                  <span className="inline-block w-2 h-2 rounded-full bg-accent" />
                  <span>{subnetResult.ipClass}</span>
                  <span>•</span>
                  <span>{subnetResult.ipScope}</span>
                </p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={handleCopyFullReport}
                  className={`inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-lg border transition-all ${
                    copiedAll
                      ? 'bg-foreground text-background border-foreground'
                      : 'bg-card text-foreground border-card-border hover:border-card-border hover:bg-card-subtle shadow-2xs'
                  }`}
                  aria-label="Copiar todos los resultados de la subred"
                >
                  {copiedAll ? (
                    <>
                      <CheckIcon className="w-3.5 h-3.5 text-white" />
                      <span>¡Copiado!</span>
                    </>
                  ) : (
                    <>
                      <CopyIcon className="w-3.5 h-3.5 text-muted" />
                      <span>Copiar informe completo</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Dos columnas de resultados en escritorio, una en móvil */}
            <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-card-border">
              {/* Columna 1: Datos de Red */}
              <div className="p-5 sm:p-6 space-y-4">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-light mb-3">
                  Parámetros de Red
                </h4>

                <div className="flex items-start justify-between gap-3 pb-3 border-b border-card-border/60">
                  <div>
                    <span className="text-xs text-muted block">Dirección de Red</span>
                    <span className="text-base font-mono font-bold text-foreground block mt-0.5">
                      {subnetResult.networkAddress}
                    </span>
                    <span className="text-[11px] text-muted-light">Identificador del segmento</span>
                  </div>
                  <CopyButton text={subnetResult.networkAddress} />
                </div>

                <div className="flex items-start justify-between gap-3 pb-3 border-b border-card-border/60">
                  <div>
                    <span className="text-xs text-muted block">Máscara de Subred</span>
                    <span className="text-base font-mono font-bold text-foreground block mt-0.5">
                      {subnetResult.subnetMask}
                    </span>
                    <span className="text-[11px] text-muted-light">Prefijo /{subnetResult.cidr}</span>
                  </div>
                  <CopyButton text={subnetResult.subnetMask} />
                </div>

                <div className="flex items-start justify-between gap-3 pb-3 border-b border-card-border/60">
                  <div>
                    <span className="text-xs text-muted block">Máscara Wildcard</span>
                    <span className="text-base font-mono font-bold text-foreground block mt-0.5">
                      {subnetResult.wildcardMask}
                    </span>
                    <span className="text-[11px] text-muted-light">Inversa para ACLs y OSPF</span>
                  </div>
                  <CopyButton text={subnetResult.wildcardMask} />
                </div>

                <div className="flex items-start justify-between gap-3 pb-3 border-b border-card-border/60">
                  <div>
                    <span className="text-xs text-muted block">Dirección de Broadcast</span>
                    <span className="text-base font-mono font-bold text-foreground block mt-0.5">
                      {subnetResult.broadcastAddress}
                    </span>
                    <span className="text-[11px] text-muted-light">Difusión masiva a la subred</span>
                  </div>
                  <CopyButton text={subnetResult.broadcastAddress} />
                </div>

                <div className="flex items-start justify-between gap-3">
                  <div>
                    <span className="text-xs text-muted block">Total de Direcciones</span>
                    <span className="text-base font-mono font-bold text-foreground block mt-0.5">
                      {subnetResult.totalHosts.toLocaleString('es-ES')}
                    </span>
                    <span className="text-[11px] text-muted-light">Tamaño total del bloque (2^{subnetResult.hostBits})</span>
                  </div>
                  <CopyButton text={subnetResult.totalHosts.toString()} />
                </div>
              </div>

              {/* Columna 2: Hosts Asignables y Rango */}
              <div className="p-5 sm:p-6 space-y-4">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-light mb-3">
                  Rango y Hosts Útiles
                </h4>

                <div className="flex items-start justify-between gap-3 pb-3 border-b border-card-border/60">
                  <div>
                    <span className="text-xs text-muted block">Rango de Hosts Asignables</span>
                    <span className="text-base font-mono font-bold text-accent block mt-0.5 break-all">
                      {subnetResult.usableRange}
                    </span>
                    <span className="text-[11px] text-muted-light">Direcciones IP configurables</span>
                  </div>
                  <CopyButton text={subnetResult.usableRange} />
                </div>

                <div className="flex items-start justify-between gap-3 pb-3 border-b border-card-border/60">
                  <div>
                    <span className="text-xs text-muted block">Primer Host Utilizable</span>
                    <span className="text-base font-mono font-bold text-foreground block mt-0.5">
                      {subnetResult.firstHost}
                    </span>
                    <span className="text-[11px] text-muted-light">Primera IP para interfaz o gateway</span>
                  </div>
                  <CopyButton text={subnetResult.firstHost} />
                </div>

                <div className="flex items-start justify-between gap-3 pb-3 border-b border-card-border/60">
                  <div>
                    <span className="text-xs text-muted block">Último Host Utilizable</span>
                    <span className="text-base font-mono font-bold text-foreground block mt-0.5">
                      {subnetResult.lastHost}
                    </span>
                    <span className="text-[11px] text-muted-light">Última IP del segmento</span>
                  </div>
                  <CopyButton text={subnetResult.lastHost} />
                </div>

                <div className="flex items-start justify-between gap-3 pb-3 border-b border-card-border/60">
                  <div>
                    <span className="text-xs text-muted block">Hosts Utilizables</span>
                    <span className="text-base font-mono font-bold text-accent block mt-0.5">
                      {subnetResult.usableHosts.toLocaleString('es-ES')}
                    </span>
                    <span className="text-[11px] text-muted-light">
                      {subnetResult.cidr === 31
                        ? '2 según estándar RFC 3021 (enlace punto a punto)'
                        : subnetResult.cidr === 32
                        ? '1 host individual (loopback / host route)'
                        : '2^(32 - prefijo) - 2 direcciones'}
                    </span>
                  </div>
                  <CopyButton text={subnetResult.usableHosts.toString()} />
                </div>

                <div className="flex items-start justify-between gap-3">
                  <div>
                    <span className="text-xs text-muted block">Bits de Red / Host</span>
                    <span className="text-base font-mono font-bold text-foreground block mt-0.5">
                      {subnetResult.networkBits} red / {subnetResult.hostBits} host
                    </span>
                    <span className="text-[11px] text-muted-light">Total de 32 bits de longitud IPv4</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Desglose Binario y Representación de Bits */}
          <div className="border border-card-border rounded-xl bg-card p-5 sm:p-6 shadow-2xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
              <div>
                <h3 className="text-base font-semibold text-foreground">Representación Binaria de 32 Bits</h3>
                <p className="text-xs text-muted mt-0.5">
                  Visualización de los octetos con diferenciación entre bits de red y bits de host.
                </p>
              </div>
              <div className="flex items-center gap-4 text-xs font-mono">
                <span className="flex items-center gap-1.5">
                  <span className="inline-block w-2.5 h-2.5 rounded-full bg-accent"></span>
                  <span className="text-muted">Red: {subnetResult.networkBits} bits</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="inline-block w-2.5 h-2.5 rounded-full bg-warning"></span>
                  <span className="text-muted">Host: {subnetResult.hostBits} bits</span>
                </span>
              </div>
            </div>

            <div className="space-y-3 bg-card-subtle p-4 rounded-lg border border-card-border overflow-x-auto">
              <div className="flex items-center justify-between min-w-[500px]">
                <span className="text-xs font-semibold text-muted w-28">Dirección IP:</span>
                <div className="flex-1 font-mono text-sm">
                  {renderBinaryBits(subnetResult.ipBinary, subnetResult.cidr)}
                </div>
                <CopyButton text={subnetResult.ipBinary} label="Copiar binario" />
              </div>

              <div className="flex items-center justify-between min-w-[500px]">
                <span className="text-xs font-semibold text-muted w-28">Máscara:</span>
                <div className="flex-1 font-mono text-sm">
                  {renderBinaryBits(subnetResult.subnetMaskBinary, subnetResult.cidr)}
                </div>
                <CopyButton text={subnetResult.subnetMaskBinary} label="Copiar binario" />
              </div>

              <div className="flex items-center justify-between min-w-[500px]">
                <span className="text-xs font-semibold text-muted w-28">Red:</span>
                <div className="flex-1 font-mono text-sm">
                  {renderBinaryBits(subnetResult.networkBinary, subnetResult.cidr)}
                </div>
                <CopyButton text={subnetResult.networkBinary} label="Copiar binario" />
              </div>

              <div className="flex items-center justify-between min-w-[500px]">
                <span className="text-xs font-semibold text-muted w-28">Broadcast:</span>
                <div className="flex-1 font-mono text-sm">
                  {renderBinaryBits(subnetResult.broadcastBinary, subnetResult.cidr)}
                </div>
                <CopyButton text={subnetResult.broadcastBinary} label="Copiar binario" />
              </div>
            </div>
          </div>

          {/* Tabla de Referencia Rápida CIDR */}
          <div className="border border-card-border rounded-xl bg-card p-5 sm:p-6 shadow-2xs">
            <h3 className="text-base font-semibold text-foreground mb-1">
              Tabla de Referencia Rápida de Prefijos CIDR Comunes
            </h3>
            <p className="text-xs text-muted mb-4">
              Haz clic en el botón de cualquier fila para aplicar de forma instantánea ese prefijo a la calculadora.
            </p>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead className="bg-card-subtle text-muted border-b border-card-border uppercase text-[11px]">
                  <tr>
                    <th className="px-3 py-2.5 font-semibold">Prefijo</th>
                    <th className="px-3 py-2.5 font-semibold">Máscara de Subred</th>
                    <th className="px-3 py-2.5 font-semibold hidden md:table-cell">Máscara Wildcard</th>
                    <th className="px-3 py-2.5 font-semibold">Hosts Útiles</th>
                    <th className="px-3 py-2.5 font-semibold hidden lg:table-cell">Uso Típico</th>
                    <th className="px-3 py-2.5 font-semibold text-right">Acción</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-card-border">
                  {COMMON_CIDR_TABLE.map((row) => (
                    <tr
                      key={row.cidr}
                      className={`hover:bg-code-bg/60 transition-colors ${
                        cidr === row.cidr ? 'bg-accent-light/30' : ''
                      }`}
                    >
                      <td className="px-3 py-2.5 font-mono font-bold text-accent">
                        /{row.cidr}
                      </td>
                      <td className="px-3 py-2.5 font-mono text-foreground">
                        {row.mask}
                      </td>
                      <td className="px-3 py-2.5 font-mono text-muted hidden md:table-cell">
                        {row.wildcard}
                      </td>
                      <td className="px-3 py-2.5 font-mono font-medium text-foreground">
                        {row.usable.toLocaleString('es-ES')}
                      </td>
                      <td className="px-3 py-2.5 text-muted text-xs hidden lg:table-cell max-w-xs truncate">
                        {row.use}
                      </td>
                      <td className="px-3 py-2.5 text-right">
                        <button
                          type="button"
                          onClick={() => setCidr(row.cidr)}
                          className={`px-2.5 py-1 text-xs font-medium rounded transition-colors ${
                            cidr === row.cidr
                              ? 'bg-accent text-white font-semibold'
                              : 'border border-card-border text-muted hover:text-foreground hover:border-accent'
                          }`}
                        >
                          {cidr === row.cidr ? 'Activo' : 'Cargar'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : (
        <div className="border border-card-border rounded-xl bg-card p-8 text-center text-muted">
          <svg
            className="w-12 h-12 mx-auto text-muted/50 mb-3"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="1.5"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <p className="text-sm font-medium text-foreground">Dirección IPv4 no válida</p>
          <p className="text-xs text-muted mt-1">
            Por favor, corrige el formato de la dirección IP arriba para calcular la subred.
          </p>
        </div>
      )}
    </ToolLayout>
  );
}
