'use client';

import { useState, useEffect, useCallback } from 'react';
import { SunIcon, MoonIcon } from '@/components/Icons';

export default function ThemeToggle({ className = '' }: { className?: string }) {
  const [mounted, setMounted] = useState(false);
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    // Detect whether .dark is currently active on documentElement
    const timer = setTimeout(() => {
      const isCurrentlyDark = document.documentElement.classList.contains('dark');
      setIsDark(isCurrentlyDark);
      setMounted(true);
    }, 0);

    // Sync across tabs
    const handleStorage = (e: StorageEvent) => {
      if (e.key === 'cifra-theme') {
        const dark = e.newValue === 'dark';
        setIsDark(dark);
        if (dark) {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
      }
    };

    window.addEventListener('storage', handleStorage);
    return () => {
      clearTimeout(timer);
      window.removeEventListener('storage', handleStorage);
    };
  }, []);

  const toggleTheme = useCallback(() => {
    const nextDark = !isDark;
    setIsDark(nextDark);

    if (nextDark) {
      document.documentElement.classList.add('dark');
      try {
        localStorage.setItem('cifra-theme', 'dark');
      } catch {
        // Ignore localStorage errors (e.g., private browsing mode)
      }
    } else {
      document.documentElement.classList.remove('dark');
      try {
        localStorage.setItem('cifra-theme', 'light');
      } catch {
        // Ignore
      }
    }

    // Dispatch custom event for any components needing real-time awareness
    try {
      window.dispatchEvent(
        new CustomEvent('cifra:theme-change', {
          detail: { theme: nextDark ? 'dark' : 'light' },
        })
      );
    } catch {
      // Ignore
    }
  }, [isDark]);

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className={`inline-flex items-center justify-center w-8 h-8 rounded-md text-muted hover:text-foreground hover:bg-card-hover border border-card-border transition-colors focus-visible:outline-2 focus-visible:outline-accent ${className}`}
      aria-label={
        !mounted
          ? 'Alternar tema claro y oscuro'
          : isDark
            ? 'Cambiar a modo claro'
            : 'Cambiar a modo oscuro'
      }
      title={
        !mounted
          ? 'Alternar tema'
          : isDark
            ? 'Activar modo claro'
            : 'Activar modo oscuro'
      }
    >
      {!mounted ? (
        <span className="w-4 h-4" aria-hidden="true" />
      ) : isDark ? (
        <SunIcon size={16} className="text-foreground transition-transform duration-150" />
      ) : (
        <MoonIcon size={16} className="text-foreground transition-transform duration-150" />
      )}
    </button>
  );
}
