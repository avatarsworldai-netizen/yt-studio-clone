import { useEffect, useState } from 'react';
import { Platform } from 'react-native';

// Global store for field overrides from admin panel
const overrides: Record<string, string> = {};
const listeners: Set<() => void> = new Set();

function notify() {
  listeners.forEach(fn => fn());
}

// Initialize listener for postMessage from admin panel
if (Platform.OS === 'web') {
  try {
    window.addEventListener('message', (e) => {
      if (e.data?.type === 'UPDATE_FIELD' && e.data.id) {
        overrides[e.data.id] = String(e.data.value);
        // Also save to localStorage for persistence
        try { localStorage.setItem('yt_overrides', JSON.stringify(overrides)); } catch {}
        notify();
      }
    });
    // Load saved overrides from localStorage
    try {
      const saved = localStorage.getItem('yt_overrides');
      if (saved) Object.assign(overrides, JSON.parse(saved));
    } catch {}
  } catch {}
}

export function useFieldOverrides() {
  const [, setTick] = useState(0);

  useEffect(() => {
    const fn = () => setTick(t => t + 1);
    listeners.add(fn);
    return () => { listeners.delete(fn); };
  }, []);

  return overrides;
}

export function getOverride(table: string, column: string, rowId: string): string | undefined {
  const id = `${table}_${column}_${rowId}`;
  return overrides[id];
}
