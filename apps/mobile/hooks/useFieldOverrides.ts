import { useEffect, useState } from 'react';
import { Platform } from 'react-native';

// Global store for field overrides from admin panel
const overrides: Record<string, string> = {};
const listeners: Set<() => void> = new Set();

function notify() {
  listeners.forEach(fn => fn());
}

// Fetch overrides from Supabase
async function loadFromSupabase() {
  try {
    const url = process.env.EXPO_PUBLIC_SUPABASE_URL || 'https://dyzwlxhghmkrnuvesxqf.supabase.co';
    const key = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR5endseGhnaG1rcm51dmVzeHFmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ1Njk3MjQsImV4cCI6MjA5MDE0NTcyNH0.b3TWo5ZUd-qB1PHIc6ct2IlL14nT2nTVNh7l6qAU8ew';
    const res = await fetch(`${url}/rest/v1/field_overrides?select=*`, {
      headers: { 'apikey': key, 'Authorization': `Bearer ${key}` },
    });
    if (res.ok) {
      const rows = await res.json();
      for (const row of rows) {
        overrides[row.id] = row.value;
      }
      if (rows.length > 0) notify();
    }
  } catch {}
}

// Load on init
loadFromSupabase();

// Reload (called on channel switch to pick up fresh data)
export function reloadOverrides() {
  loadFromSupabase();
}

// Listen for postMessage from admin panel (iframe mode)
if (Platform.OS === 'web') {
  try {
    window.addEventListener('message', (e) => {
      if (e.data?.type === 'UPDATE_FIELD' && e.data.id) {
        overrides[e.data.id] = String(e.data.value);
        notify();
      }
    });
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
  if (_activeChannelId) {
    const channelKey = `${table}_${column}_${_activeChannelId}_${rowId}`;
    if (overrides[channelKey] !== undefined) return overrides[channelKey];
  }
  return undefined;
}

// Active channel ID for scoping overrides
let _activeChannelId = '';

export function setActiveChannelForOverrides(channelId: string) {
  _activeChannelId = channelId;
  notify(); // Trigger re-render on channel switch
}

export function getActiveChannelForOverrides() {
  return _activeChannelId;
}
