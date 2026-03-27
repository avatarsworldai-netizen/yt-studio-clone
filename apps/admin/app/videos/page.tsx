'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { supabase, CHANNEL_ID } from '@/lib/supabase';

export default function VideosPage() {
  const [videos, setVideos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadVideos();
  }, []);

  async function loadVideos() {
    const { data } = await supabase
      .from('videos')
      .select('*')
      .eq('channel_id', CHANNEL_ID)
      .order('sort_order', { ascending: true });
    setVideos(data || []);
    setLoading(false);
  }

  async function deleteVideo(id: string) {
    if (!confirm('Are you sure you want to delete this video?')) return;
    await supabase.from('videos').delete().eq('id', id);
    loadVideos();
  }

  function formatNumber(num: number): string {
    if (num >= 1_000_000) return `${(num / 1_000_000).toFixed(1)}M`;
    if (num >= 1_000) return `${(num / 1_000).toFixed(1)}K`;
    return num.toString();
  }

  if (loading) return <div className="text-gray-400">Loading...</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Videos</h1>
        <Link
          href="/videos/new"
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
        >
          + Add Video
        </Link>
      </div>

      <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-800">
              <th className="text-left px-4 py-3 text-sm text-gray-400 font-medium">Video</th>
              <th className="text-left px-4 py-3 text-sm text-gray-400 font-medium">Status</th>
              <th className="text-right px-4 py-3 text-sm text-gray-400 font-medium">Views</th>
              <th className="text-right px-4 py-3 text-sm text-gray-400 font-medium">Likes</th>
              <th className="text-right px-4 py-3 text-sm text-gray-400 font-medium">Revenue</th>
              <th className="text-right px-4 py-3 text-sm text-gray-400 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {videos.map((video) => (
              <tr key={video.id} className="border-b border-gray-800 hover:bg-gray-800/50">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={video.thumbnail_url || 'https://picsum.photos/120/68'}
                      alt=""
                      className="w-24 h-14 rounded object-cover bg-gray-700"
                    />
                    <div>
                      <div className="text-white text-sm font-medium line-clamp-1">
                        {video.title}
                      </div>
                      <div className="text-gray-400 text-xs mt-0.5">{video.duration}</div>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`text-xs px-2 py-1 rounded ${
                      video.status === 'published'
                        ? 'bg-green-900/50 text-green-300'
                        : video.status === 'draft'
                        ? 'bg-gray-700 text-gray-300'
                        : 'bg-yellow-900/50 text-yellow-300'
                    }`}
                  >
                    {video.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-right text-sm text-gray-300">
                  {formatNumber(video.view_count)}
                </td>
                <td className="px-4 py-3 text-right text-sm text-gray-300">
                  {formatNumber(video.like_count)}
                </td>
                <td className="px-4 py-3 text-right text-sm text-gray-300">
                  ${video.estimated_revenue.toFixed(2)}
                </td>
                <td className="px-4 py-3 text-right">
                  <div className="flex justify-end gap-2">
                    <Link
                      href={`/videos/${video.id}`}
                      className="text-blue-400 hover:text-blue-300 text-sm"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => deleteVideo(video.id)}
                      className="text-red-400 hover:text-red-300 text-sm"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
