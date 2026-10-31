import { ImageResponse } from 'next/og';

export const alt = 'Cifra — Herramientas y calculadoras para el día a día';
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = 'image/png';

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#0C0E12',
          border: '1px solid #232732',
          padding: '48px 64px',
        }}
      >
        {/* Brand Header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            marginBottom: '32px',
          }}
        >
          <div
            style={{
              width: '64px',
              height: '64px',
              borderRadius: '16px',
              backgroundColor: '#14171E',
              border: '1px solid #232732',
              color: '#3B82F6',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '36px',
              fontWeight: 800,
              fontFamily: 'monospace',
              marginRight: '20px',
            }}
          >
            C
          </div>
          <span
            style={{
              fontSize: '68px',
              fontWeight: 800,
              color: '#F9FAFB',
              letterSpacing: '-2px',
            }}
          >
            cifra<span style={{ color: '#3B82F6' }}>.tools</span>
          </span>
        </div>

        {/* Headline */}
        <div
          style={{
            fontSize: '44px',
            fontWeight: 800,
            color: '#F9FAFB',
            textAlign: 'center',
            maxWidth: '1000px',
            lineHeight: 1.2,
            marginBottom: '20px',
            letterSpacing: '-1px',
          }}
        >
          Herramientas técnicas de navegador
        </div>

        {/* Subtitle */}
        <div
          style={{
            fontSize: '22px',
            color: '#9CA3AF',
            textAlign: 'center',
            maxWidth: '850px',
            lineHeight: 1.4,
            marginBottom: '40px',
          }}
        >
          Calculadoras de subredes IPv4, generación de claves de alta entropía, validación sintáctica JSON y conversiones de datos.
        </div>

        {/* Trust Badges */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
          }}
        >
          <div
            style={{
              backgroundColor: '#14171E',
              border: '1px solid #232732',
              borderRadius: '9999px',
              padding: '8px 24px',
              fontSize: '16px',
              fontWeight: 600,
              color: '#10B981',
            }}
          >
            100% en cliente (Web Crypto)
          </div>
          <div
            style={{
              backgroundColor: '#14171E',
              border: '1px solid #232732',
              borderRadius: '9999px',
              padding: '8px 24px',
              fontSize: '16px',
              fontWeight: 600,
              color: '#9CA3AF',
            }}
          >
            Procesamiento en tu navegador
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
