'use client';

import Link from 'next/link';
import { CifraLogoIcon, CookieSettingsIcon, KeyboardIcon } from '@/components/Icons';
import { useState } from 'react';

export default function Footer() {
  const currentYear = 2026;
  const [shortcutsModalOpen, setShortcutsModalOpen] = useState(false);

  const openCookiePreferences = () => {
    window.dispatchEvent(new CustomEvent('cifra:open-cookie-preferences'));
  };

  return (
    <>
      <footer className="border-t border-card-border bg-card mt-auto transition-colors">
        <div className="mx-auto max-w-6xl px-4 py-12">
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 lg:grid-cols-5">
            {/* Brand and Description */}
            <div className="col-span-2 sm:col-span-3 lg:col-span-2">
              <Link
                href="/"
                className="inline-flex items-center gap-2.5 text-foreground hover:opacity-90 transition-opacity"
                aria-label="Cifra — Portada"
              >
                <div className="w-6 h-6 rounded bg-foreground text-background flex items-center justify-center shrink-0">
                  <CifraLogoIcon className="w-3.5 h-3.5" />
                </div>
                <span className="text-base font-bold tracking-tight text-foreground font-sans">
                  cifra<span className="text-muted font-mono font-medium">.tools</span>
                </span>
              </Link>
              <p className="mt-3 text-xs text-muted max-w-sm leading-relaxed">
                Herramientas técnicas y calculadoras. Lo que escribes se procesa en tu navegador y no se envía a ningún servidor.
              </p>
              <div className="mt-4 flex items-center gap-4 text-xs text-muted">
                <button
                  type="button"
                  onClick={openCookiePreferences}
                  className="flex items-center gap-1.5 text-muted hover:text-foreground transition-colors"
                >
                  <CookieSettingsIcon size={14} />
                  <span>Preferencias de cookies</span>
                </button>
                <button
                  type="button"
                  onClick={() => setShortcutsModalOpen(true)}
                  className="flex items-center gap-1.5 text-muted hover:text-foreground transition-colors"
                >
                  <KeyboardIcon size={14} />
                  <span>Atajos de teclado</span>
                </button>
              </div>
            </div>

            {/* Redes y Seguridad */}
            <div>
              <h3 className="text-sm font-semibold text-foreground mb-3">
                Redes y seguridad
              </h3>
              <ul className="space-y-2 text-sm text-muted">
                <li>
                  <Link href="/herramientas/calculadora-subredes" className="hover:text-foreground transition-colors">
                    Calculadora de Subredes
                  </Link>
                </li>
                <li>
                  <Link href="/herramientas/generador-contrasenas" className="hover:text-foreground transition-colors">
                    Generador de Contraseñas
                  </Link>
                </li>
                <li>
                  <Link href="/herramientas/generador-hash" className="hover:text-foreground transition-colors">
                    Generador de Hashes
                  </Link>
                </li>
                <li>
                  <Link href="/herramientas/conversor-binario-decimal-hexadecimal" className="hover:text-foreground transition-colors">
                    Conversor de Bases
                  </Link>
                </li>
              </ul>
            </div>

            {/* Formatos y Datos */}
            <div>
              <h3 className="text-sm font-semibold text-foreground mb-3">
                Formatos y web
              </h3>
              <ul className="space-y-2 text-sm text-muted">
                <li>
                  <Link href="/herramientas/formateador-json" className="hover:text-foreground transition-colors">
                    Formateador JSON
                  </Link>
                </li>
                <li>
                  <Link href="/herramientas/codificador-base64" className="hover:text-foreground transition-colors">
                    Codificador Base64
                  </Link>
                </li>
                <li>
                  <Link href="/herramientas/conversor-unidades-almacenamiento" className="hover:text-foreground transition-colors">
                    Conversor de Almacenamiento
                  </Link>
                </li>
                <li>
                  <Link href="/herramientas/conversor-colores" className="hover:text-foreground transition-colors">
                    Conversor de Colores
                  </Link>
                </li>
              </ul>
            </div>

            {/* Legal e Institucional */}
            <div>
              <h3 className="text-sm font-semibold text-foreground mb-3">
                Información y legal
              </h3>
              <ul className="space-y-2 text-sm text-muted">
                <li>
                  <Link href="/acerca" className="hover:text-foreground transition-colors">
                    Acerca de Cifra
                  </Link>
                </li>
                <li>
                  <Link href="/guias" className="hover:text-foreground transition-colors">
                    Guías Técnicas
                  </Link>
                </li>
                <li>
                  <Link href="/contacto" className="hover:text-foreground transition-colors">
                    Contacto
                  </Link>
                </li>
                <li>
                  <Link href="/privacidad" className="hover:text-foreground transition-colors">
                    Privacidad
                  </Link>
                </li>
                <li>
                  <Link href="/aviso-legal" className="hover:text-foreground transition-colors">
                    Aviso Legal
                  </Link>
                </li>
                <li>
                  <Link href="/cookies" className="hover:text-foreground transition-colors">
                    Política de Cookies
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-10 pt-6 border-t border-card-border flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted">
            <p>© {currentYear} Cifra. Lo que escribes en las herramientas se procesa en tu navegador.</p>
            <p className="flex items-center gap-3">
              <span>Next.js 16</span>
              <span>·</span>
              <span>Web Crypto API</span>
            </p>
          </div>
        </div>
      </footer>

      {/* Modal de Atajos de Teclado */}
      {shortcutsModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="shortcuts-title"
          className="fixed inset-0 z-50 bg-background/80 backdrop-blur-xs flex items-center justify-center p-4"
          onClick={() => setShortcutsModalOpen(false)}
        >
          <div
            className="w-full max-w-md bg-card border border-card-border rounded-xl shadow-md p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-card-border mb-4">
              <h3 id="shortcuts-title" className="text-sm font-bold text-foreground">
                Atajos de teclado
              </h3>
              <button
                type="button"
                onClick={() => setShortcutsModalOpen(false)}
                className="text-xs text-muted hover:text-foreground px-2 py-1 rounded bg-card-subtle"
              >
                Cerrar (Esc)
              </button>
            </div>
            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-muted">Abrir buscador global</span>
                <span className="kbd">Ctrl + K</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted">Cerrar modales o desplegables</span>
                <span className="kbd">Esc</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted">Copiar resultado al portapapeles</span>
                <span className="text-muted-light font-mono">Clic en Copiar</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted">Navegación accesible</span>
                <span className="kbd">Tab</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
