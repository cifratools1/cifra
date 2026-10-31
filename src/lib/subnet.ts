// Funciones matemáticas y de validación para cálculo de subredes IPv4

export interface SubnetResult {
  ip: string;
  cidr: number;
  ipBinary: string;
  networkAddress: string;
  networkBinary: string;
  broadcastAddress: string;
  broadcastBinary: string;
  subnetMask: string;
  subnetMaskBinary: string;
  wildcardMask: string;
  wildcardBinary: string;
  firstHost: string;
  lastHost: string;
  usableRange: string;
  totalHosts: number;
  usableHosts: number;
  ipClass: string;
  ipScope: string;
  isPrivate: boolean;
  cidrNotation: string;
  networkBits: number;
  hostBits: number;
}

export function ipToNum(ip: string): number {
  const parts = ip.split('.').map(p => parseInt(p, 10));
  return ((parts[0] << 24) | (parts[1] << 16) | (parts[2] << 8) | parts[3]) >>> 0;
}

export function numToIp(num: number): string {
  return [
    (num >>> 24) & 255,
    (num >>> 16) & 255,
    (num >>> 8) & 255,
    num & 255,
  ].join('.');
}

export function toOctetBinary(val: number): string {
  return val.toString(2).padStart(8, '0');
}

export function toFullBinary(num: number): string {
  return [
    toOctetBinary((num >>> 24) & 255),
    toOctetBinary((num >>> 16) & 255),
    toOctetBinary((num >>> 8) & 255),
    toOctetBinary(num & 255),
  ].join('.');
}

export function validateIpv4(ip: string): { isValid: boolean; error?: string } {
  const trimmed = ip.trim();
  if (!trimmed) {
    return { isValid: false, error: 'Introduce una dirección IPv4.' };
  }

  const parts = trimmed.split('.');
  if (parts.length !== 4) {
    return {
      isValid: false,
      error: 'La dirección debe tener exactamente 4 octetos separados por puntos (ej. 192.168.1.1).',
    };
  }

  for (let i = 0; i < 4; i++) {
    const part = parts[i];
    if (!/^\d+$/.test(part)) {
      return {
        isValid: false,
        error: `El octeto ${i + 1} ("${part}") debe contener únicamente dígitos numéricos.`,
      };
    }
    const num = parseInt(part, 10);
    if (num < 0 || num > 255) {
      return {
        isValid: false,
        error: `El octeto ${i + 1} (${num}) está fuera de rango. Debe estar entre 0 y 255.`,
      };
    }
    if (part.length > 1 && part.startsWith('0')) {
      return {
        isValid: false,
        error: `El octeto ${i + 1} ("${part}") tiene ceros a la izquierda innecesarios.`,
      };
    }
  }

  return { isValid: true };
}

export function getIpScope(octets: number[]): { ipClass: string; ipScope: string; isPrivate: boolean } {
  const o1 = octets[0];
  const o2 = octets[1];

  let ipClass = '';
  if (o1 >= 1 && o1 <= 126) {
    ipClass = 'Clase A';
  } else if (o1 === 127) {
    ipClass = 'Clase A (Loopback)';
  } else if (o1 >= 128 && o1 <= 191) {
    ipClass = 'Clase B';
  } else if (o1 >= 192 && o1 <= 223) {
    ipClass = 'Clase C';
  } else if (o1 >= 224 && o1 <= 239) {
    ipClass = 'Clase D (Multicast)';
  } else if (o1 >= 240 && o1 <= 255) {
    ipClass = 'Clase E (Experimental)';
  } else {
    ipClass = 'Especial (0.0.0.0/8)';
  }

  let ipScope = 'Pública (Enrutable en Internet)';
  let isPrivate = false;

  if (o1 === 10) {
    ipScope = 'Privada (RFC 1918 - Red 10.0.0.0/8)';
    isPrivate = true;
  } else if (o1 === 172 && o2 >= 16 && o2 <= 31) {
    ipScope = 'Privada (RFC 1918 - Red 172.16.0.0/12)';
    isPrivate = true;
  } else if (o1 === 192 && o2 === 168) {
    ipScope = 'Privada (RFC 1918 - Red 192.168.0.0/16)';
    isPrivate = true;
  } else if (o1 === 127) {
    ipScope = 'Loopback local (RFC 1122)';
  } else if (o1 === 169 && o2 === 254) {
    ipScope = 'Enlace local / APIPA (RFC 3927)';
  } else if (o1 === 100 && o2 >= 64 && o2 <= 127) {
    ipScope = 'Carrier-Grade NAT / CGNAT (RFC 6598)';
  } else if (o1 === 0) {
    ipScope = 'Red local / Origen no especificado (RFC 1122)';
  } else if (o1 >= 224 && o1 <= 239) {
    ipScope = 'Multicast (RFC 5771)';
  } else if (o1 === 255 && o2 === 255) {
    ipScope = 'Broadcast limitado local (RFC 919)';
  } else if (o1 >= 240) {
    ipScope = 'Reservada para investigación futura (RFC 1112)';
  }

  return { ipClass, ipScope, isPrivate };
}

export function calculateSubnet(ip: string, cidr: number): SubnetResult | null {
  const validation = validateIpv4(ip);
  if (!validation.isValid) return null;
  if (cidr < 0 || cidr > 32 || isNaN(cidr)) return null;

  const cleanIp = ip.trim();
  const octets = cleanIp.split('.').map(p => parseInt(p, 10));
  const ipInt = ipToNum(cleanIp);

  // Máscara y Wildcard
  const maskInt = cidr === 0 ? 0 : ((0xFFFFFFFF << (32 - cidr)) >>> 0);
  const wildcardInt = (~maskInt) >>> 0;

  // Red y Broadcast
  const networkInt = (ipInt & maskInt) >>> 0;
  const broadcastInt = (networkInt | wildcardInt) >>> 0;

  const networkAddress = numToIp(networkInt);
  const broadcastAddress = numToIp(broadcastInt);
  const subnetMask = numToIp(maskInt);
  const wildcardMask = numToIp(wildcardInt);

  // Representaciones binarias
  const ipBinary = toFullBinary(ipInt);
  const networkBinary = toFullBinary(networkInt);
  const broadcastBinary = toFullBinary(broadcastInt);
  const subnetMaskBinary = toFullBinary(maskInt);
  const wildcardBinary = toFullBinary(wildcardInt);

  // Hosts totales y útiles
  const totalHosts = Math.pow(2, 32 - cidr);
  let usableHosts = 0;
  let firstHost = '';
  let lastHost = '';

  if (cidr === 32) {
    usableHosts = 1;
    firstHost = cleanIp;
    lastHost = cleanIp;
  } else if (cidr === 31) {
    // RFC 3021 para enlaces punto a punto
    usableHosts = 2;
    firstHost = networkAddress;
    lastHost = broadcastAddress;
  } else if (cidr === 0) {
    usableHosts = 4294967294;
    firstHost = '0.0.0.1';
    lastHost = '255.255.255.254';
  } else {
    usableHosts = totalHosts - 2;
    firstHost = numToIp((networkInt + 1) >>> 0);
    lastHost = numToIp((broadcastInt - 1) >>> 0);
  }

  const usableRange = cidr === 32 ? firstHost : `${firstHost} – ${lastHost}`;

  const { ipClass, ipScope, isPrivate } = getIpScope(octets);

  return {
    ip: cleanIp,
    cidr,
    ipBinary,
    networkAddress,
    networkBinary,
    broadcastAddress,
    broadcastBinary,
    subnetMask,
    subnetMaskBinary,
    wildcardMask,
    wildcardBinary,
    firstHost,
    lastHost,
    usableRange,
    totalHosts,
    usableHosts,
    ipClass,
    ipScope,
    isPrivate,
    cidrNotation: `${networkAddress}/${cidr}`,
    networkBits: cidr,
    hostBits: 32 - cidr,
  };
}
