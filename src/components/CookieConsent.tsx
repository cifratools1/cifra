'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

/**
 * GOOGLE PRIVACY & MESSAGING (CMP OFICIAL):
 * Cuando tu cuenta de Google AdSense sea aprobada y habilites el mensaje reglamentario
 * para el EEE y Reino Unido en el panel de AdSense (Privacidad y mensajes):
 * 1. Cambia la constante USE_GOOGLE_CMP a true (o comenta <CookieConsent /> en src/app/layout.tsx).
 * 2. El script oficial de AdSense inyectará automáticamente la CMP certificada por IAB TCF v2.2.
 */
const USE_GOOGLE_CMP = false;

interface SavedConsent {
  technical: boolean;
  analytics: boolean;
  ads: boolean;
  timestamp: string;
}

function getStoredConsent(): SavedConsent | null {
  if (typeof window === 'undefined') return null;
  try {
    const saved = localStorage.getItem('cifra_cookie_consent');
    if (!saved) return null;
    return JSON.parse(saved);
  } catch {
    return null;
  }
}

export default function CookieConsent() {
  const [showBanner, setShowBanner] = useState(false);
  const [showPreferences, setShowPreferences] = useState(false);
  const [analyticsConsent, setAnalyticsConsent] = useState(false);
  const [adsConsent, setAdsConsent] = useState(false);

  useEffect(() => {
    if (USE_GOOGLE_CMP) return;

    const timer = setTimeout(() => {
      const saved = getStoredConsent();
      if (!saved) {
        setShowBanner(true);
      } else {
        setAnalyticsConsent(!!saved.analytics);
        setAdsConsent(!!saved.ads);
      }
    }, 0);

    const handleOpenPrefs = () => {
      setShowPreferences(true);
    };

    window.addEventListener('cifra:open-cookie-preferences', handleOpenPrefs);
    return () => {
      clearTimeout(timer);
      window.removeEventListener('cifra:open-cookie-preferences', handleOpenPrefs);
    };
  }, []);

  if (USE_GOOGLE_CMP) {
    return null;
  }

  const saveConsent = (analytics: boolean, ads: boolean) => {
    try {
      localStorage.setItem(
        'cifra_cookie_consent',
        JSON.stringify({
          technical: true,
          analytics,
          ads,
          timestamp: new Date().toISOString(),
        })
      );
    } catch {
      // Ignorar si LocalStorage está deshabilitado
    }
    setAnalyticsConsent(analytics);
    setAdsConsent(ads);
    setShowBanner(false);
    setShowPreferences(false);
  };

  const handleAcceptAll = () => {
    saveConsent(true, true);
  };

  const handleRejectAll = () => {
    saveConsent(false, false);
  };

  const handleSaveCustom = () => {
    saveConsent(analyticsConsent, adsConsent);
  };

  if (!showBanner && !showPreferences) {
    return null;
  }

  return (
    <div
      role="dialog"
      aria-labelledby="cookie-dialog-title"
      aria-describedby="cookie-dialog-desc"
      className="fixed bottom-0 inset-x-0 z-50 p-4 sm:p-6 bg-card/95 backdrop-blur-md border-t border-card-border shadow-md"
    >
      <div className="mx-auto max-w-4xl">
        {!showPreferences ? (
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="max-w-2xl">
              <h3 id="cookie-dialog-title" className="text-sm font-bold text-foreground">
                Control de privacidad y cookies técnicas en Cifra
              </h3>
              <p id="cookie-dialog-desc" className="mt-1 text-xs text-muted leading-relaxed">
                Nuestras herramientas se ejecutan de forma 100% local en tu navegador sin enviar datos a ningún servidor.
                Utilizamos almacenamiento local técnico imprescindible y, con tu consentimiento, cookies para métricas
                anónimas y anuncios relevantes de Google AdSense que financian la infraestructura gratuita. Consulta nuestra{' '}
                <Link href="/cookies" className="text-accent underline hover:opacity-80">
                  Política de Cookies
                </Link>{' '}
                y{' '}
                <Link href="/privacidad" className="text-accent underline hover:opacity-80">
                  Política de Privacidad
                </Link>
                .
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto shrink-0">
              <button
                type="button"
                onClick={handleRejectAll}
                className="flex-1 sm:flex-initial px-3 py-1.5 text-xs font-medium rounded-md border border-card-border text-foreground hover:bg-card-hover transition-colors"
              >
                Rechazar no esenciales
              </button>
              <button
                type="button"
                onClick={() => setShowPreferences(true)}
                className="flex-1 sm:flex-initial px-3 py-1.5 text-xs font-medium rounded-md border border-card-border text-foreground hover:bg-card-hover transition-colors"
              >
                Personalizar
              </button>
              <button
                type="button"
                onClick={handleAcceptAll}
                className="flex-1 sm:flex-initial px-4 py-1.5 text-xs font-semibold rounded-md bg-accent text-white hover:bg-accent-hover transition-colors"
              >
                Aceptar todas
              </button>
            </div>
          </div>
        ) : (
          /* Modal de preferencias detalladas */
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-card-border pb-3">
              <h3 className="text-sm font-bold text-foreground">
                Preferencias de privacidad y cookies
              </h3>
              <button
                type="button"
                onClick={() => setShowPreferences(false)}
                className="text-xs text-muted hover:text-foreground px-2 py-1 rounded bg-card-subtle"
              >
                Volver
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-md bg-card-subtle border border-card-border flex items-start justify-between gap-3">
                <div>
                  <strong className="text-foreground block">Almacenamiento Local Técnico (Obligatorio)</strong>
                  <p className="text-muted mt-0.5 leading-relaxed">
                    Necesario para recordar tus herramientas favoritas, historial reciente de uso en este equipo, tema claro/oscuro
                    y estado del consentimiento. No almacena datos sensibles.
                  </p>
                </div>
                <span className="text-accent font-semibold px-2 py-0.5 bg-accent-light text-[11px] rounded">
                  Siempre activo
                </span>
              </div>

              <div className="p-3 rounded-md bg-card-subtle border border-card-border flex items-start justify-between gap-3">
                <div>
                  <strong className="text-foreground block">
                    Cookies de Medición y Analítica
                  </strong>
                  <p className="text-muted mt-0.5 leading-relaxed">
                    Nos ayudan a conocer de forma anónima qué herramientas son las más utilizadas para optimizar el rendimiento.
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={analyticsConsent}
                    onChange={(e) => setAnalyticsConsent(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-9 h-5 bg-card-border peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-accent"></div>
                </label>
              </div>

              <div className="p-3 rounded-md bg-card-subtle border border-card-border flex items-start justify-between gap-3">
                <div>
                  <strong className="text-foreground block">
                    Publicidad Contextual y Google AdSense
                  </strong>
                  <p className="text-muted mt-0.5 leading-relaxed">
                    Permite mostrar anuncios no intrusivos que sustentan el mantenimiento y servidores gratuitos de Cifra.
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={adsConsent}
                    onChange={(e) => setAdsConsent(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-9 h-5 bg-card-border peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-accent"></div>
                </label>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={handleRejectAll}
                className="px-3 py-1.5 text-xs font-medium rounded-md border border-card-border text-foreground hover:bg-card-hover transition-colors"
              >
                Rechazar no esenciales
              </button>
              <button
                type="button"
                onClick={handleSaveCustom}
                className="px-4 py-1.5 text-xs font-semibold rounded-md bg-accent text-white hover:bg-accent-hover transition-colors"
              >
                Guardar selección
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
