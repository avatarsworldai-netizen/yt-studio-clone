'use client';

import { useEffect, useState } from 'react';
import { supabase, CHANNEL_ID } from '@/lib/supabase';

export default function ChannelPage() {
  const [channel, setChannel] = useState<any>(null);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    loadChannel();
  }, []);

  async function loadChannel() {
    const { data } = await supabase
      .from('channel')
      .select('*')
      .eq('id', CHANNEL_ID)
      .single();
    if (data) setChannel(data);
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setMessage('');
    const { error } = await supabase
      .from('channel')
      .update({
        name: channel.name,
        handle: channel.handle,
        avatar_url: channel.avatar_url,
        banner_url: channel.banner_url,
        description: channel.description,
        subscriber_count: channel.subscriber_count,
        total_views: channel.total_views,
        total_watch_time_hours: channel.total_watch_time_hours,
        video_count: channel.video_count,
        country: channel.country,
        is_verified: channel.is_verified,
      })
      .eq('id', CHANNEL_ID);

    setSaving(false);
    setMessage(error ? `Error: ${error.message}` : 'Channel updated successfully!');
  }

  function updateField(field: string, value: any) {
    setChannel((prev: any) => ({ ...prev, [field]: value }));
  }

  if (!channel) return <div className="text-gray-400">Loading...</div>;

  return (
    <div className="max-w-2xl">
      <h1 className="text-3xl font-bold mb-6">Edit Channel</h1>

      {message && (
        <div
          className={`mb-4 p-3 rounded-lg text-sm ${
            message.includes('Error')
              ? 'bg-red-900/50 text-red-300'
              : 'bg-green-900/50 text-green-300'
          }`}
        >
          {message}
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-4">
        <Field label="Channel Name">
          <input
            type="text"
            value={channel.name}
            onChange={(e) => updateField('name', e.target.value)}
            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white focus:border-blue-500 focus:outline-none"
          />
        </Field>

        <Field label="Handle">
          <input
            type="text"
            value={channel.handle}
            onChange={(e) => updateField('handle', e.target.value)}
            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white focus:border-blue-500 focus:outline-none"
          />
        </Field>

        <Field label="Avatar URL">
          <input
            type="text"
            value={channel.avatar_url || ''}
            onChange={(e) => updateField('avatar_url', e.target.value)}
            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white focus:border-blue-500 focus:outline-none"
          />
        </Field>

        <Field label="Banner URL">
          <input
            type="text"
            value={channel.banner_url || ''}
            onChange={(e) => updateField('banner_url', e.target.value)}
            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white focus:border-blue-500 focus:outline-none"
          />
        </Field>

        <Field label="Description">
          <textarea
            value={channel.description || ''}
            onChange={(e) => updateField('description', e.target.value)}
            rows={4}
            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white focus:border-blue-500 focus:outline-none"
          />
        </Field>

        <div className="grid grid-cols-2 gap-4">
          <Field label="Subscriber Count">
            <input
              type="number"
              value={channel.subscriber_count}
              onChange={(e) => updateField('subscriber_count', parseInt(e.target.value) || 0)}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white focus:border-blue-500 focus:outline-none"
            />
          </Field>
          <Field label="Total Views">
            <input
              type="number"
              value={channel.total_views}
              onChange={(e) => updateField('total_views', parseInt(e.target.value) || 0)}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white focus:border-blue-500 focus:outline-none"
            />
          </Field>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Field label="Watch Time (hours)">
            <input
              type="number"
              step="0.1"
              value={channel.total_watch_time_hours}
              onChange={(e) => updateField('total_watch_time_hours', parseFloat(e.target.value) || 0)}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white focus:border-blue-500 focus:outline-none"
            />
          </Field>
          <Field label="Video Count">
            <input
              type="number"
              value={channel.video_count}
              onChange={(e) => updateField('video_count', parseInt(e.target.value) || 0)}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white focus:border-blue-500 focus:outline-none"
            />
          </Field>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Field label="Country">
            <input
              type="text"
              value={channel.country}
              onChange={(e) => updateField('country', e.target.value)}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white focus:border-blue-500 focus:outline-none"
            />
          </Field>
          <Field label="Verified">
            <label className="flex items-center gap-2 mt-2">
              <input
                type="checkbox"
                checked={channel.is_verified}
                onChange={(e) => updateField('is_verified', e.target.checked)}
                className="w-4 h-4"
              />
              <span className="text-gray-300">Channel is verified</span>
            </label>
          </Field>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white px-6 py-2 rounded-lg font-medium transition-colors"
        >
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </form>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-sm text-gray-400 mb-1">{label}</label>
      {children}
    </div>
  );
}
