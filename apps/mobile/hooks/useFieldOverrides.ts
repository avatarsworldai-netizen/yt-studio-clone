import { useEffect, useState } from 'react';
import { Platform } from 'react-native';

// Global store for field overrides from admin panel
const overrides: Record<string, string> = {};
const listeners: Set<() => void> = new Set();
let loaded = false;

// Active channel ID — updated by ChannelContext
let _activeChannelId = '00000000-0000-0000-0000-000000000001';

export function setActiveChannelForOverrides(channelId: string) {
  _activeChannelId = channelId;
}

export function getActiveChannelForOverrides() {
  return _activeChannelId;
}

function notify() {
  listeners.forEach(fn => fn());
}

// Fetch overrides from Supabase on startup
async function loadFromSupabase() {
  if (loaded) return;
  loaded = true;
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

// Load overrides on module init
loadFromSupabase();

// Listen for postMessage from admin panel (iframe mode)
if (Platform.OS === 'web') {
  try {
    window.addEventListener('message', (e) => {
      if (e.data?.type === 'UPDATE_FIELD' && e.data.id) {
        const chId = e.data.channelId || _activeChannelId;
        // Store with channel prefix
        const channelKey = `${chId}_${e.data.id}`;
        overrides[channelKey] = String(e.data.value);
        // Also store without prefix for backward compat
        overrides[e.data.id] = String(e.data.value);
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
  // First try channel-specific key
  const channelKey = `${_activeChannelId}_${table}_${column}_${rowId}`;
  if (overrides[channelKey] !== undefined) return overrides[channelKey];
  // Fallback to global key (backward compat)
  const id = `${table}_${column}_${rowId}`;
  return overrides[id];
}
