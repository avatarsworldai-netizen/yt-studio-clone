'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { supabase, CHANNEL_ID } from '@/lib/supabase';

export default function VideoEditPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const isNew = id === 'new';

  const [video, setVideo] = useState<any>({
    title: '',
    description: '',
    thumbnail_url: '',
    duration: '0:00',
    status: 'draft',
    visibility: 'public',
    published_at: '',
    view_count: 0,
    like_count: 0,
    dislike_count: 0,
    comment_count: 0,
    share_count: 0,
    watch_time_hours: 0,
    average_view_duration: '0:00',
    impressions: 0,
    impression_ctr: 0,
    estimated_revenue: 0,
    rpm: 0,
    cpm: 0,
    retention_data: '[]',
    traffic_sources: '[]',
    audience_geography: '[]',
    audience_age_gender: '[]',
    sort_order: 0,
  });
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [activeTab, setActiveTab] = useState('basic');

  useEffect(() => {
    if (!isNew) loadVideo();
  }, [id]);

  async function loadVideo() {
    const { data } = await supabase.from('videos').select('*').eq('id', id).single();
    if (data) {
      setVideo({
        ...data,
        retention_data: JSON.stringify(data.retention_data || [], null, 2),
        traffic_sources: JSON.stringify(data.traffic_sources || [], null, 2),
        audience_geography: JSON.stringify(data.audience_geography || [], null, 2),
        audience_age_gender: JSON.stringify(data.audience_age_gender || [], null, 2),
      });
    }
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setMessage('');

    const payload = {
      ...video,
      channel_id: CHANNEL_ID,
      retention_data: JSON.parse(video.retention_data || '[]'),
      traffic_sources: JSON.parse(video.traffic_sources || '[]'),
      audience_geography: JSON.parse(video.audience_geography || '[]'),
      audience_age_gender: JSON.parse(video.audience_age_gender || '[]'),
      view_count: Number(video.view_count),
      like_count: Number(video.like_count),
      dislike_count: Number(video.dislike_count),
      comment_count: Number(video.comment_count),
      share_count: Number(video.share_count),
      watch_time_hours: Number(video.watch_time_hours),
      impressions: Number(video.impressions),
      impression_ctr: Number(video.impression_ctr),
      estimated_revenue: Number(video.estimated_revenue),
      rpm: Number(video.rpm),
      cpm: Number(video.cpm),
      sort_order: Number(video.sort_order),
    };

    let error;
    if (isNew) {
      const result = await supabase.from('videos').insert(payload);
      error = result.error;
    } else {
      delete payload.id;
      delete payload.created_at;
      delete payload.updated_at;
      const result = await supabase.from('videos').update(payload).eq('id', id);
      error = result.error;
    }

    setSaving(false);
    if (error) {
      setMessage(`Error: ${error.message}`);
    } else {
      setMessage('Video saved successfully!');
      if (isNew) router.push('/videos');
    }
  }

  function updateField(field: string, value: any) {
    setVideo((prev: any) => ({ ...prev, [field]: value }));
  }

  const TABS = [
    { key: 'basic', label: 'Basic Info' },
    { key: 'stats', label: 'Statistics' },
    { key: 'revenue', label: 'Revenue' },
    { key: 'audience', label: 'Audience Data' },
  ];

  return (
    <div className="max-w-3xl">
      <h1 className="text-3xl font-bold mb-6">
        {isNew ? 'Add Video' : 'Edit Video'}
      </h1>

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

      {/* Tabs */}
      <div className="flex border-b border-gray-800 mb-6">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
              activeTab === tab.key
                ? 'border-blue-500 text-white'
                : 'border-transparent text-gray-400 hover:text-white'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <form onSubmit={handleSave} className="space-y-4">
        {activeTab === 'basic' && (
          <>
            <Field label="Title">
              <input
                type="text"
                value={video.title}
                onChange={(e) => updateField('title', e.target.value)}
                className="input"
                required
              />
            </Field>
            <Field label="Description">
              <textarea
                value={video.description || ''}
                onChange={(e) => updateField('description', e.target.value)}
                rows={4}
                className="input"
              />
            </Field>
            <Field label="Thumbnail URL">
              <input
                type="text"
                value={video.thumbnail_url || ''}
                onChange={(e) => updateField('thumbnail_url', e.target.value)}
                className="input"
              />
            </Field>
            <div className="grid grid-cols-3 gap-4">
              <Field label="Duration">
                <input
                  type="text"
                  value={video.duration || ''}
                  onChange={(e) => updateField('duration', e.target.value)}
                  className="input"
                  placeholder="12:34"
                />
              </Field>
              <Field label="Status">
                <select
                  value={video.status}
                  onChange={(e) => updateField('status', e.target.value)}
                  className="input"
                >
                  <option value="published">Published</option>
                  <option value="draft">Draft</option>
                  <option value="unlisted">Unlisted</option>
                  <option value="private">Private</option>
                  <option value="scheduled">Scheduled</option>
                </select>
              </Field>
              <Field label="Visibility">
                <select
                  value={video.visibility}
                  onChange={(e) => updateField('visibility', e.target.value)}
                  className="input"
                >
                  <option value="public">Public</option>
                  <option value="unlisted">Unlisted</option>
                  <option value="private">Private</option>
                </select>
              </Field>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Field label="Published At">
                <input
                  type="datetime-local"
                  value={video.published_at ? video.published_at.slice(0, 16) : ''}
                  onChange={(e) => updateField('published_at', e.target.value)}
                  className="input"
                />
              </Field>
              <Field label="Sort Order">
                <input
                  type="number"
                  value={video.sort_order}
                  onChange={(e) => updateField('sort_order', e.target.value)}
                  className="input"
                />
              </Field>
            </div>
          </>
        )}

        {activeTab === 'stats' && (
          <>
            <div className="grid grid-cols-2 gap-4">
              <Field label="View Count">
                <input type="number" value={video.view_count} onChange={(e) => updateField('view_count', e.target.value)} className="input" />
              </Field>
              <Field label="Like Count">
                <input type="number" value={video.like_count} onChange={(e) => updateField('like_count', e.target.value)} className="input" />
              </Field>
              <Field label="Dislike Count">
                <input type="number" value={video.dislike_count} onChange={(e) => updateField('dislike_count', e.target.value)} className="input" />
              </Field>
              <Field label="Comment Count">
                <input type="number" value={video.comment_count} onChange={(e) => updateField('comment_count', e.target.value)} className="input" />
              </Field>
              <Field label="Share Count">
                <input type="number" value={video.share_count} onChange={(e) => updateField('share_count', e.target.value)} className="input" />
              </Field>
              <Field label="Watch Time (hours)">
                <input type="number" step="0.1" value={video.watch_time_hours} onChange={(e) => updateField('watch_time_hours', e.target.value)} className="input" />
              </Field>
              <Field label="Avg View Duration">
                <input type="text" value={video.average_view_duration} onChange={(e) => updateField('average_view_duration', e.target.value)} className="input" placeholder="3:45" />
              </Field>
              <Field label="Impressions">
                <input type="number" value={video.impressions} onChange={(e) => updateField('impressions', e.target.value)} className="input" />
              </Field>
              <Field label="Impression CTR (%)">
                <input type="number" step="0.01" value={video.impression_ctr} onChange={(e) => updateField('impression_ctr', e.target.value)} className="input" />
              </Field>
            </div>
          </>
        )}

        {activeTab === 'revenue' && (
          <>
            <div className="grid grid-cols-3 gap-4">
              <Field label="Estimated Revenue ($)">
                <input type="number" step="0.01" value={video.estimated_revenue} onChange={(e) => updateField('estimated_revenue', e.target.value)} className="input" />
              </Field>
              <Field label="RPM ($)">
                <input type="number" step="0.01" value={video.rpm} onChange={(e) => updateField('rpm', e.target.value)} className="input" />
              </Field>
              <Field label="CPM ($)">
                <input type="number" step="0.01" value={video.cpm} onChange={(e) => updateField('cpm', e.target.value)} className="input" />
              </Field>
            </div>
          </>
        )}

        {activeTab === 'audience' && (
          <>
            <Field label="Retention Data (JSON)">
              <textarea
                value={video.retention_data}
                onChange={(e) => updateField('retention_data', e.target.value)}
                rows={6}
                className="input font-mono text-xs"
                placeholder='[{"second": 0, "percentage": 100}]'
              />
            </Field>
            <Field label="Traffic Sources (JSON)">
              <textarea
                value={video.traffic_sources}
                onChange={(e) => updateField('traffic_sources', e.target.value)}
                rows={6}
                className="input font-mono text-xs"
                placeholder='[{"source": "YouTube Search", "percentage": 45, "views": 1200}]'
              />
            </Field>
            <Field label="Audience Geography (JSON)">
              <textarea
                value={video.audience_geography}
                onChange={(e) => updateField('audience_geography', e.target.value)}
                rows={4}
                className="input font-mono text-xs"
                placeholder='[{"country": "US", "percentage": 42}]'
              />
            </Field>
            <Field label="Age & Gender (JSON)">
              <textarea
                value={video.audience_age_gender}
                onChange={(e) => updateField('audience_age_gender', e.target.value)}
                rows={4}
                className="input font-mono text-xs"
                placeholder='[{"range": "25-34", "male": 25, "female": 10}]'
              />
            </Field>
          </>
        )}

        <div className="flex gap-3 pt-4">
          <button
            type="submit"
            disabled={saving}
            className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white px-6 py-2 rounded-lg font-medium transition-colors"
          >
            {saving ? 'Saving...' : isNew ? 'Create Video' : 'Save Changes'}
          </button>
          <button
            type="button"
            onClick={() => router.push('/videos')}
            className="bg-gray-700 hover:bg-gray-600 text-white px-6 py-2 rounded-lg font-medium transition-colors"
          >
            Cancel
          </button>
        </div>
      </form>

      <style jsx>{`
        .input {
          width: 100%;
          background-color: rgb(31, 41, 55);
          border: 1px solid rgb(55, 65, 81);
          border-radius: 0.5rem;
          padding: 0.5rem 0.75rem;
          color: white;
          font-size: 0.875rem;
        }
        .input:focus {
          border-color: rgb(59, 130, 246);
          outline: none;
        }
      `}</style>
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
