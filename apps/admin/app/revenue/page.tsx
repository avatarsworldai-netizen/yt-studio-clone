'use client';

import { useEffect, useState } from 'react';
import { supabase, CHANNEL_ID } from '@/lib/supabase';

export default function RevenuePage() {
  const [revenues, setRevenues] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editData, setEditData] = useState<any>({});
  const [message, setMessage] = useState('');

  useEffect(() => {
    loadRevenues();
  }, []);

  async function loadRevenues() {
    const { data } = await supabase
      .from('revenue')
      .select('*')
      .eq('channel_id', CHANNEL_ID)
      .order('month', { ascending: false });
    setRevenues(data || []);
    setLoading(false);
  }

  function startEdit(rev: any) {
    setEditingId(rev.id);
    setEditData({ ...rev });
  }

  async function saveRevenue() {
    if (!editingId) return;
    const { error } = await supabase
      .from('revenue')
      .update({
        estimated_revenue: Number(editData.estimated_revenue),
        ad_revenue: Number(editData.ad_revenue),
        membership_revenue: Number(editData.membership_revenue),
        superchat_revenue: Number(editData.superchat_revenue),
        merchandise_revenue: Number(editData.merchandise_revenue),
        premium_revenue: Number(editData.premium_revenue),
        rpm: Number(editData.rpm),
        cpm: Number(editData.cpm),
        playback_based_cpm: Number(editData.playback_based_cpm),
        ad_impressions: Number(editData.ad_impressions),
        monetized_playbacks: Number(editData.monetized_playbacks),
      })
      .eq('id', editingId);

    if (error) {
      setMessage(`Error: ${error.message}`);
    } else {
      setEditingId(null);
      setMessage('Revenue updated!');
      loadRevenues();
    }
  }

  if (loading) return <div className="text-gray-400">Loading...</div>;

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Revenue</h1>

      {message && (
        <div className="mb-4 p-3 rounded-lg text-sm bg-green-900/50 text-green-300">{message}</div>
      )}

      <div className="space-y-4">
        {revenues.map((rev) => (
          <div key={rev.id} className="bg-gray-900 border border-gray-800 rounded-xl p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">
                {new Date(rev.month).toLocaleDateString('en-US', {
                  month: 'long',
                  year: 'numeric',
                })}
              </h2>
              <div className="flex gap-2">
                {editingId === rev.id ? (
                  <>
                    <button onClick={saveRevenue} className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm">Save</button>
                    <button onClick={() => setEditingId(null)} className="bg-gray-700 hover:bg-gray-600 text-white px-3 py-1 rounded text-sm">Cancel</button>
                  </>
                ) : (
                  <button onClick={() => startEdit(rev)} className="text-blue-400 hover:text-blue-300 text-sm">Edit</button>
                )}
              </div>
            </div>

            {editingId === rev.id ? (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <NumField label="Total Revenue ($)" value={editData.estimated_revenue} onChange={(v) => setEditData({ ...editData, estimated_revenue: v })} />
                <NumField label="Ad Revenue ($)" value={editData.ad_revenue} onChange={(v) => setEditData({ ...editData, ad_revenue: v })} />
                <NumField label="Memberships ($)" value={editData.membership_revenue} onChange={(v) => setEditData({ ...editData, membership_revenue: v })} />
                <NumField label="Super Chat ($)" value={editData.superchat_revenue} onChange={(v) => setEditData({ ...editData, superchat_revenue: v })} />
                <NumField label="Merchandise ($)" value={editData.merchandise_revenue} onChange={(v) => setEditData({ ...editData, merchandise_revenue: v })} />
                <NumField label="Premium ($)" value={editData.premium_revenue} onChange={(v) => setEditData({ ...editData, premium_revenue: v })} />
                <NumField label="RPM ($)" value={editData.rpm} onChange={(v) => setEditData({ ...editData, rpm: v })} />
                <NumField label="CPM ($)" value={editData.cpm} onChange={(v) => setEditData({ ...editData, cpm: v })} />
                <NumField label="Playback CPM ($)" value={editData.playback_based_cpm} onChange={(v) => setEditData({ ...editData, playback_based_cpm: v })} />
                <NumField label="Ad Impressions" value={editData.ad_impressions} onChange={(v) => setEditData({ ...editData, ad_impressions: v })} />
                <NumField label="Monetized Playbacks" value={editData.monetized_playbacks} onChange={(v) => setEditData({ ...editData, monetized_playbacks: v })} />
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <StatDisplay label="Total" value={`$${rev.estimated_revenue.toFixed(2)}`} />
                <StatDisplay label="Ads" value={`$${rev.ad_revenue.toFixed(2)}`} />
                <StatDisplay label="Memberships" value={`$${rev.membership_revenue.toFixed(2)}`} />
                <StatDisplay label="Super Chat" value={`$${rev.superchat_revenue.toFixed(2)}`} />
                <StatDisplay label="Merch" value={`$${rev.merchandise_revenue.toFixed(2)}`} />
                <StatDisplay label="Premium" value={`$${rev.premium_revenue.toFixed(2)}`} />
                <StatDisplay label="RPM" value={`$${rev.rpm.toFixed(2)}`} />
                <StatDisplay label="CPM" value={`$${rev.cpm.toFixed(2)}`} />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function NumField({
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

function StatDisplay({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-xs text-gray-400">{label}</div>
      <div className="text-white font-medium">{value}</div>
    </div>
  );
}
