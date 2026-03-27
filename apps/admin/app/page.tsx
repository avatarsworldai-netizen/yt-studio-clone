'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { supabase, CHANNEL_ID } from '@/lib/supabase';

interface TableCount {
  label: string;
  count: number;
  href: string;
  icon: string;
}

export default function AdminDashboard() {
  const [counts, setCounts] = useState<TableCount[]>([]);
  const [channelName, setChannelName] = useState('');

  useEffect(() => {
    async function loadCounts() {
      const [channel, videos, comments, stats, revenue] = await Promise.all([
        supabase.from('channel').select('name').eq('id', CHANNEL_ID).single(),
        supabase.from('videos').select('id', { count: 'exact', head: true }),
        supabase.from('comments').select('id', { count: 'exact', head: true }),
        supabase.from('dashboard_stats').select('id', { count: 'exact', head: true }),
        supabase.from('revenue').select('id', { count: 'exact', head: true }),
      ]);

      setChannelName(channel.data?.name || 'Unknown');
      setCounts([
        { label: 'Videos', count: videos.count || 0, href: '/videos', icon: '🎬' },
        { label: 'Comments', count: comments.count || 0, href: '/comments', icon: '💬' },
        { label: 'Stat Periods', count: stats.count || 0, href: '/stats', icon: '📈' },
        { label: 'Revenue Months', count: revenue.count || 0, href: '/revenue', icon: '💰' },
      ]);
    }
    loadCounts();
  }, []);

  return (
    <div>
      <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
      <p className="text-gray-400 mb-8">
        Managing channel: <span className="text-white font-medium">{channelName}</span>
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {counts.map((item) => (
          <Link
            key={item.label}
            href={item.href}
            className="bg-gray-900 border border-gray-800 rounded-xl p-6 hover:border-blue-500 transition-colors"
          >
            <div className="text-2xl mb-2">{item.icon}</div>
            <div className="text-3xl font-bold text-white">{item.count}</div>
            <div className="text-gray-400 text-sm mt-1">{item.label}</div>
          </Link>
        ))}
      </div>

      <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
        <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <Link
            href="/channel"
            className="bg-gray-800 hover:bg-gray-700 rounded-lg px-4 py-3 text-sm transition-colors"
          >
            Edit Channel Profile
          </Link>
          <Link
            href="/videos"
            className="bg-gray-800 hover:bg-gray-700 rounded-lg px-4 py-3 text-sm transition-colors"
          >
            Manage Videos
          </Link>
          <Link
            href="/stats"
            className="bg-gray-800 hover:bg-gray-700 rounded-lg px-4 py-3 text-sm transition-colors"
          >
            Edit Dashboard Stats
          </Link>
        </div>
      </div>
    </div>
  );
}
