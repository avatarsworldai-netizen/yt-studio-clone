"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { createClient } from "@supabase/supabase-js";
import { ChannelEditor, StatsEditor, VideosEditor, RevenueEditor, CommentsEditor } from "@/components/editor/SectionEditors";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export type EditableField = {
  id: string;
  label: string;
  value: string | number;
  type: "text" | "number" | "currency" | "image" | "textarea";
  table: string;
  column: string;
  rowId: string;
};

export type AppData = {
  channel: any;
  stats: any;
  videos: any[];
  comments: any[];
  revenue: any[];
  timeseries: any[];
};

const CID = "00000000-0000-0000-0000-000000000001";

export default function AdminEditor() {
  const [activeSection, setActiveSection] = useState(0);
  const [data, setData] = useState<AppData | null>(null);
  const [saving, setSaving] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const fetchData = useCallback(async () => {
    const [channel, stats, videos, comments, revenue, timeseries] = await Promise.all([
      supabase.from("channel").select("*").eq("id", CID).single(),
      supabase.from("dashboard_stats").select("*").eq("channel_id", CID).eq("period", "last_28_days").single(),
      supabase.from("videos").select("*").eq("channel_id", CID).order("sort_order"),
      supabase.from("comments").select("*").order("published_at", { ascending: false }).limit(10),
      supabase.from("revenue").select("*").eq("channel_id", CID).order("month", { ascending: false }).limit(6),
      supabase.from("analytics_timeseries").select("*").eq("channel_id", CID).eq("metric_type", "revenue").order("date").limit(30),
    ]);
    setData({
      channel: channel.data,
      stats: stats.data,
      videos: videos.data || [],
      comments: comments.data || [],
      revenue: revenue.data || [],
      timeseries: timeseries.data || [],
    });
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleSave = async (table: string, column: string, value: string | number, rowId: string) => {
    setSaving(true);
    const res = await fetch("/api/update", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ table, column, value, rowId }),
    });

    if (res.ok) {
      await fetchData();
      // Refresh iframe to show changes
      setTimeout(() => {
        iframeRef.current?.contentWindow?.location.reload();
      }, 500);
    }
    setSaving(false);
  };

  if (!data) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-gray-500 text-lg">Cargando datos...</div>
      </div>
    );
  }

  return (
    <div className="h-full flex">
      {/* Left sidebar - full editor */}
      <div className="w-96 bg-white border-r border-gray-200 flex flex-col h-full">
        <div className="flex items-center gap-2 p-4 border-b border-gray-200">
          <div className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center">
            <span className="text-white text-xs font-bold">▶</span>
          </div>
          <div>
            <h1 className="text-sm font-bold text-gray-900">YT Studio</h1>
            <p className="text-xs text-gray-500">Editor Visual</p>
          </div>
          <button
            onClick={() => { fetchData(); iframeRef.current?.contentWindow?.location.reload(); }}
            className="ml-auto px-3 py-1.5 bg-blue-600 text-white text-xs rounded-lg hover:bg-blue-700"
          >
            ↻ Refrescar
          </button>
        </div>

        {/* Section tabs */}
        <div className="flex border-b border-gray-200 overflow-x-auto">
          {["Canal", "Stats", "Videos", "Revenue", "Comments"].map((tab, i) => (
            <button
              key={tab}
              onClick={() => setActiveSection(i)}
              className={`px-3 py-2.5 text-xs font-medium whitespace-nowrap transition-colors ${
                activeSection === i
                  ? "text-blue-700 border-b-2 border-blue-700"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Editor fields */}
        <div className="flex-1 overflow-y-auto p-4">
          {activeSection === 0 && <ChannelEditor data={data} onSave={handleSave} />}
          {activeSection === 1 && <StatsEditor data={data} onSave={handleSave} />}
          {activeSection === 2 && <VideosEditor data={data} onSave={handleSave} />}
          {activeSection === 3 && <RevenueEditor data={data} onSave={handleSave} />}
          {activeSection === 4 && <CommentsEditor data={data} onSave={handleSave} />}
        </div>
      </div>

      {/* Center: iPhone preview - loads the actual mobile app */}
      <div className="flex-1 flex items-center justify-center bg-gray-100">
        <div className="iphone-frame">
          <div className="iphone-notch" />
          <iframe
            ref={iframeRef}
            src="http://localhost:8081"
            style={{
              width: "100%",
              height: "100%",
              border: "none",
              borderRadius: 32,
            }}
            title="App Preview"
          />
        </div>
      </div>

    </div>
  );
}
