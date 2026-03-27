'use client';

import { useEffect, useState } from 'react';
import { supabase, CHANNEL_ID } from '@/lib/supabase';

const PERIODS = ['last_7_days', 'last_28_days', 'last_90_days', 'lifetime'];

export default function StatsPage() {
  const [stats, setStats] = useState<any[]>([]);
  const [realtimeStats, setRealtimeStats] = useState<any>(null);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    loadStats();
    loadRealtimeStats();
  }, []);

  async function loadStats() {
    const { data } = await supabase
      .from('dashboard_stats')
      .select('*')
      .eq('channel_id', CHANNEL_ID)
      .order('period');
    setStats(data || []);
  }

  async function loadRealtimeStats() {
    const { data } = await supabase
      .from('realtime_stats')
      .select('*')
      .eq('channel_id', CHANNEL_ID)
      .single();
    if (data) {
      setRealtimeStats({
        ...data,
        hourly_data: JSON.stringify(data.hourly_data || [], null, 2),
      });
    }
  }

  async function saveStat(stat: any) {
    setSaving(true);
    const { id, created_at, updated_at, ...payload } = stat;
    const { error } = await supabase
      .from('dashboard_stats')
      .update({
        views: Number(payload.views),
        views_change_percent: Number(payload.views_change_percent),
        watch_time_hours: Number(payload.watch_time_hours),
        watch_time_change_percent: Number(payload.watch_time_change_percent),
        subscribers_gained: Number(payload.subscribers_gained),
        subscribers_lost: Number(payload.subscribers_lost),
        subscribers_net: Number(payload.subscribers_net),
        subscribers_change_percent: Number(payload.subscribers_change_percent),
        estimated_revenue: Number(payload.estimated_revenue),
        revenue_change_percent: Number(payload.revenue_change_percent),
        impressions: Number(payload.impressions),
        impression_ctr: Number(payload.impression_ctr),
      })
      .eq('id', id);
    setSaving(false);
    setMessage(error ? `Error: ${error.message}` : `${stat.period} updated!`);
  }

  async function saveRealtimeStats() {
    if (!realtimeStats) return;
    setSaving(true);
    const { error } = await supabase
      .from('realtime_stats')
      .update({
        current_viewers: Number(realtimeStats.current_viewers),
        views_last_48h: Number(realtimeStats.views_last_48h),
        views_last_60min: Number(realtimeStats.views_last_60min),
        hourly_data: JSON.parse(realtimeStats.hourly_data || '[]'),
      })
      .eq('id', realtimeStats.id);
    setSaving(false);
    setMessage(error ? `Error: ${error.message}` : 'Realtime stats updated!');
  }

  function updateStat(index: number, field: string, value: string) {
    setStats((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Dashboard Stats</h1>

      {message && (
        <div className="mb-4 p-3 rounded-lg text-sm bg-green-900/50 text-green-300">{message}</div>
      )}

      {/* Dashboard Stats by Period */}
      {stats.map((stat, index) => (
        <div key={stat.id} className="bg-gray-900 border border-gray-800 rounded-xl p-6 mb-4">
          <h2 className="text-lg font-semibold mb-4 capitalize">
            {stat.period.replace(/_/g, ' ')}
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <MiniField label="Views" value={stat.views} onChange={(v) => updateStat(index, 'views', v)} />
            <MiniField label="Views %" value={stat.views_change_percent} onChange={(v) => updateStat(index, 'views_change_percent', v)} />
            <MiniField label="Watch Time (hrs)" value={stat.watch_time_hours} onChange={(v) => updateStat(index, 'watch_time_hours', v)} />
            <MiniField label="Watch Time %" value={stat.watch_time_change_percent} onChange={(v) => updateStat(index, 'watch_time_change_percent', v)} />
            <MiniField label="Subs Gained" value={stat.subscribers_gained} onChange={(v) => updateStat(index, 'subscribers_gained', v)} />
            <MiniField label="Subs Lost" value={stat.subscribers_lost} onChange={(v) => updateStat(index, 'subscribers_lost', v)} />
            <MiniField label="Subs Net" value={stat.subscribers_net} onChange={(v) => updateStat(index, 'subscribers_net', v)} />
            <MiniField label="Subs %" value={stat.subscribers_change_percent} onChange={(v) => updateStat(index, 'subscribers_change_percent', v)} />
            <MiniField label="Revenue ($)" value={stat.estimated_revenue} onChange={(v) => updateStat(index, 'estimated_revenue', v)} />
            <MiniField label="Revenue %" value={stat.revenue_change_percent} onChange={(v) => updateStat(index, 'revenue_change_percent', v)} />
            <MiniField label="Impressions" value={stat.impressions} onChange={(v) => updateStat(index, 'impressions', v)} />
            <MiniField label="CTR (%)" value={stat.impression_ctr} onChange={(v) => updateStat(index, 'impression_ctr', v)} />
          </div>
          <button
            onClick={() => saveStat(stat)}
            disabled={saving}
            className="mt-4 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white px-4 py-1.5 rounded-lg text-sm font-medium transition-colors"
          >
            Save {stat.period.replace(/_/g, ' ')}
          </button>
        </div>
      ))}

      {/* Realtime Stats */}
      {realtimeStats && (
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 mb-4">
          <h2 className="text-lg font-semibold mb-4">Realtime Stats Card</h2>
          <div className="grid grid-cols-3 gap-3 mb-4">
            <MiniField
              label="Current Viewers"
              value={realtimeStats.current_viewers}
              onChange={(v) => setRealtimeStats((p: any) => ({ ...p, current_viewers: v }))}
            />
            <MiniField
              label="Views Last 48h"
              value={realtimeStats.views_last_48h}
              onChange={(v) => setRealtimeStats((p: any) => ({ ...p, views_last_48h: v }))}
            />
            <MiniField
              label="Views Last 60min"
              value={realtimeStats.views_last_60min}
              onChange={(v) => setRealtimeStats((p: any) => ({ ...p, views_last_60min: v }))}
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm text-gray-400 mb-1">Hourly Data (JSON)</label>
            <textarea
              value={realtimeStats.hourly_data}
              onChange={(e) => setRealtimeStats((p: any) => ({ ...p, hourly_data: e.target.value }))}
              rows={6}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-xs font-mono focus:border-blue-500 focus:outline-none"
            />
          </div>
          <button
            onClick={saveRealtimeStats}
            disabled={saving}
            className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white px-4 py-1.5 rounded-lg text-sm font-medium transition-colors"
          >
            Save Realtime Stats
          </button>
        </div>
      )}
    </div>
  );
}

function MiniField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: any;
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <label className="block text-xs text-gray-400 mb-1">{label}</label>
      <input
        type="number"
        step="any"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-gray-800 border border-gray-700 rounded-lg px-2 py-1.5 text-white text-sm focus:border-blue-500 focus:outline-none"
      />
    </div>
  );
}
