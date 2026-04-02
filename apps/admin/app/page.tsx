"use client";

import { useState, useEffect, useCallback } from "react";
import { createClient } from "@supabase/supabase-js";
import { PhonePreview } from "@/components/editor/PhonePreview";
import { EditorPanel } from "@/components/editor/EditorPanel";
import { TabBar } from "@/components/editor/TabBar";

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
  const [activeTab, setActiveTab] = useState(0);
  const [selectedField, setSelectedField] = useState<EditableField | null>(null);
  const [data, setData] = useState<AppData | null>(null);
  const [saving, setSaving] = useState(false);

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

  const handleSave = async (field: EditableField, newValue: string | number) => {
    setSaving(true);
    const res = await fetch("/api/update", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ table: field.table, column: field.column, value: newValue, rowId: field.rowId }),
    });

    if (res.ok) {
      await fetchData();
      setSelectedField(null);
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
      {/* Left sidebar */}
      <div className="w-64 bg-white border-r border-gray-200 p-6 flex flex-col">
        <div className="flex items-center gap-2 mb-6">
          <div className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center">
            <span className="text-white text-xs font-bold">▶</span>
          </div>
          <div>
            <h1 className="text-sm font-bold text-gray-900">YT Studio</h1>
            <p className="text-xs text-gray-500">Editor Visual</p>
          </div>
        </div>

        <div className="text-xs font-semibold text-gray-400 uppercase mb-3">Pantallas</div>
        {["Panel", "Contenido", "Estadísticas", "Comunidad", "Ingresos"].map((tab, i) => (
          <button
            key={tab}
            onClick={() => setActiveTab(i)}
            className={`text-left px-3 py-2 rounded-lg mb-1 text-sm transition-colors ${
              activeTab === i
                ? "bg-blue-50 text-blue-700 font-semibold"
                : "text-gray-600 hover:bg-gray-50"
            }`}
          >
            {tab}
          </button>
        ))}

        <div className="mt-auto text-xs text-gray-400">
          Haz click en cualquier elemento para editarlo
        </div>
      </div>

      {/* Center: iPhone preview */}
      <div className="flex-1 flex items-center justify-center bg-gray-100">
        <div className="iphone-frame">
          <div className="iphone-notch" />
          <div className="iphone-content" style={{ paddingTop: 44 }}>
            <PhonePreview
              activeTab={activeTab}
              data={data}
              onFieldSelect={setSelectedField}
              selectedField={selectedField}
            />
            <div style={{ height: 80 }} />
          </div>
          <TabBar activeTab={activeTab} onTabChange={setActiveTab} />
        </div>
      </div>

      {/* Right: Editor panel */}
      {selectedField && (
        <EditorPanel
          field={selectedField}
          onSave={handleSave}
          onClose={() => setSelectedField(null)}
          saving={saving}
        />
      )}
    </div>
  );
}
