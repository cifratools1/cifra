'use client';

import { useState, useEffect, useCallback } from 'react';

export const FAVORITES_KEY = 'cifra_favorites';
export const RECENTS_KEY = 'cifra_recents';
export const PREFS_KEY_PREFIX = 'cifra_tool_prefs_';
const MAX_RECENTS = 6;

function areArraysEqual(a: string[], b: string[]): boolean {
  if (a.length !== b.length) return false;
  for (let i = 0; i < a.length; i++) {
    if (a[i] !== b[i]) return false;
  }
  return true;
}

export function useFavorites() {
  const [favorites, setFavorites] = useState<string[]>([]);
  const [recents, setRecents] = useState<string[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  const syncFromStorage = useCallback(() => {
    try {
      if (typeof window === 'undefined') return;

      const rawFavs = localStorage.getItem(FAVORITES_KEY);
      if (rawFavs) {
        const parsed = JSON.parse(rawFavs);
        if (Array.isArray(parsed)) {
          setFavorites((prev) => (areArraysEqual(prev, parsed) ? prev : parsed));
        }
      } else {
        setFavorites((prev) => (prev.length === 0 ? prev : []));
      }

      const rawRecents = localStorage.getItem(RECENTS_KEY);
      if (rawRecents) {
        const parsed = JSON.parse(rawRecents);
        if (Array.isArray(parsed)) {
          setRecents((prev) => (areArraysEqual(prev, parsed) ? prev : parsed));
        }
      } else {
        setRecents((prev) => (prev.length === 0 ? prev : []));
      }
    } catch {
      // Ignore
    } finally {
      setIsLoaded(true);
    }
  }, []);

  useEffect(() => {
    // Sync on mount asynchronously
    const timer = setTimeout(() => {
      syncFromStorage();
    }, 0);

    const handleStorage = () => {
      syncFromStorage();
    };

    window.addEventListener('storage', handleStorage);
    window.addEventListener('cifra:favorites-change', handleStorage);

    return () => {
      clearTimeout(timer);
      window.removeEventListener('storage', handleStorage);
      window.removeEventListener('cifra:favorites-change', handleStorage);
    };
  }, [syncFromStorage]);

  const toggleFavorite = useCallback((slug: string) => {
    try {
      if (!slug || typeof window === 'undefined') return false;
      const raw = localStorage.getItem(FAVORITES_KEY);
      const current: string[] = raw ? JSON.parse(raw) : [];

      const exists = current.includes(slug);
      const next = exists ? current.filter((s: string) => s !== slug) : [...current, slug];

      localStorage.setItem(FAVORITES_KEY, JSON.stringify(next));
      setFavorites(next);
      window.dispatchEvent(new CustomEvent('cifra:favorites-change'));
      return !exists;
    } catch {
      return false;
    }
  }, []);

  const pinFavoriteToTop = useCallback((slug: string) => {
    try {
      if (!slug || typeof window === 'undefined') return;
      const raw = localStorage.getItem(FAVORITES_KEY);
      const current: string[] = raw ? JSON.parse(raw) : [];

      if (!current.includes(slug)) {
        current.push(slug);
      }
      const reordered = [slug, ...current.filter((s) => s !== slug)];
      localStorage.setItem(FAVORITES_KEY, JSON.stringify(reordered));
      setFavorites(reordered);
      window.dispatchEvent(new CustomEvent('cifra:favorites-change'));
    } catch {
      // Ignore
    }
  }, []);

  const reorderFavorites = useCallback((newOrder: string[]) => {
    try {
      if (typeof window === 'undefined') return;
      localStorage.setItem(FAVORITES_KEY, JSON.stringify(newOrder));
      setFavorites(newOrder);
      window.dispatchEvent(new CustomEvent('cifra:favorites-change'));
    } catch {
      // Ignore
    }
  }, []);

  const addRecent = useCallback((slug: string) => {
    try {
      if (!slug || typeof window === 'undefined') return;
      const raw = localStorage.getItem(RECENTS_KEY);
      const current: string[] = raw ? JSON.parse(raw) : [];

      if (current.length > 0 && current[0] === slug) {
        return;
      }

      const filtered = current.filter((s) => s !== slug);
      const next = [slug, ...filtered].slice(0, MAX_RECENTS);

      localStorage.setItem(RECENTS_KEY, JSON.stringify(next));
      setRecents(next);
      window.dispatchEvent(new CustomEvent('cifra:favorites-change'));
    } catch {
      // Ignore error
    }
  }, []);

  const isFavorite = useCallback(
    (slug: string) => {
      if (!isLoaded) return false;
      return favorites.includes(slug);
    },
    [favorites, isLoaded]
  );

  return {
    favorites,
    recents,
    isLoaded,
    isFavorite,
    toggleFavorite,
    pinFavoriteToTop,
    reorderFavorites,
    addRecent,
  };
}

// Helper para persistencia de opciones técnicas no sensibles
export function getToolPreference<T>(toolSlug: string, key: string, defaultValue: T): T {
  if (typeof window === 'undefined') return defaultValue;
  try {
    const raw = localStorage.getItem(`${PREFS_KEY_PREFIX}${toolSlug}`);
    if (!raw) return defaultValue;
    const parsed = JSON.parse(raw);
    return parsed[key] !== undefined ? parsed[key] : defaultValue;
  } catch {
    return defaultValue;
  }
}

export function setToolPreference<T>(toolSlug: string, key: string, value: T): void {
  if (typeof window === 'undefined') return;
  try {
    const storageKey = `${PREFS_KEY_PREFIX}${toolSlug}`;
    const raw = localStorage.getItem(storageKey);
    const parsed = raw ? JSON.parse(raw) : {};
    parsed[key] = value;
    localStorage.setItem(storageKey, JSON.stringify(parsed));
  } catch {
    // Ignore error
  }
}
