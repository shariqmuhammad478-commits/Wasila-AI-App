'use client';

import { useEffect, useState, useCallback } from 'react';

const KEY = 'wasila:saved';

export function useSaved() {
  const [saved, setSaved] = useState<string[]>([]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) setSaved(JSON.parse(raw));
    } catch {
      // ignore corrupt storage
    }
  }, []);

  const toggle = useCallback((id: string) => {
    setSaved((prev) => {
      const next = prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id];
      try {
        localStorage.setItem(KEY, JSON.stringify(next));
      } catch {
        // storage unavailable — ignore
      }
      return next;
    });
  }, []);

  const isSaved = useCallback((id: string) => saved.includes(id), [saved]);

  return { saved, toggle, isSaved };
}
