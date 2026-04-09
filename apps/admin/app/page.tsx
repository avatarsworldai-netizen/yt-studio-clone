"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { createClient } from "@supabase/supabase-js";
import { ChannelEditor, StatsEditor, VideosEditor, RevenueEditor, CommentsEditor } from "@/components/editor/SectionEditors";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const iframeSrc = process.env.NODE_ENV === 'development'
  ? 'http://localhost:8081'
  : 'https://yt-studio-app-orpin.vercel.app';

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
  const [selectedField, setSelectedField] = useState<EditableField | null>(null);
  const [editValue, setEditValue] = useState("");
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const selectField = (field: EditableField) => {
    setSelectedField(field);
    setEditValue(String(field.value ?? ""));
  };

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

  // Listen for postMessage from iframe (mobile app in admin mode)
  useEffect(() => {
    const handler = (e: MessageEvent) => {
      console.log('[Admin] Message received:', e.data);
      if (e.data?.type === 'EDIT_FIELD' && e.data.field) {
        const f = e.data.field;
        console.log('[Admin] Opening editor for:', f.label);
        setSelectedField({ id: f.id, label: f.label, value: f.value, type: f.type, table: f.table, column: f.column, rowId: f.rowId });
        setEditValue(String(f.value ?? ''));
      }
    };
    window.addEventListener('message', handler);
    return () => window.removeEventListener('message', handler);
  }, []);

  const handleSave = async (table: string, column: string, value: string | number, rowId: string) => {
    setSaving(true);

    // Save to Supabase (original table or field_overrides fallback)
    const res = await fetch("/api/update", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ table, column, value, rowId }),
    });

    // Always send update to iframe so values update instantly without reload
    iframeRef.current?.contentWindow?.postMessage({
      type: 'UPDATE_FIELD',
      id: `${table}_${column}_${rowId}`,
      value,
      table, column, rowId,
    }, '*');

    if (res.ok) {
      await fetchData();
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
      {/* Left: Title bar */}
      <div className="w-16 bg-white border-r border-gray-200 flex flex-col items-center py-4">
        <div className="w-10 h-10 bg-red-600 rounded-lg flex items-center justify-center mb-4">
          <span className="text-white text-sm font-bold">▶</span>
        </div>
        <button
          onClick={() => { fetchData(); iframeRef.current?.setAttribute('src', iframeSrc); }}
          className="w-10 h-10 bg-gray-100 hover:bg-gray-200 rounded-lg flex items-center justify-center text-gray-600 text-lg"
          title="Refrescar"
        >
          ↻
        </button>
      </div>

      {/* Center: iPhone preview - loads the actual mobile app */}
      <div className="flex-1 flex items-center justify-center bg-gray-100">
        <div className="iphone-frame">
          <div className="iphone-notch" />
          <iframe
            ref={iframeRef}
            src={iframeSrc}
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

      {/* Right: Quick edit panel when a field is selected */}
      {selectedField && (
        <div className="w-80 bg-white border-l border-gray-200 flex flex-col h-full">
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <h3 className="font-semibold text-gray-900 text-sm">Editar: {selectedField.label}</h3>
            <button onClick={() => setSelectedField(null)} className="text-gray-400 hover:text-gray-600 text-lg">✕</button>
          </div>
          <div className="p-4">
            {selectedField.type === "image" ? (
              <div>
                <div className="mb-3 rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center" style={{ height: 120 }}>
                  {editValue && <img src={editValue} alt="" className="max-h-full max-w-full object-contain" />}
                </div>
                <input
                  type="text"
                  value={editValue}
                  onChange={(e) => setEditValue(e.target.value)}
                  placeholder="URL de la imagen"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 mb-2"
                />
                <label className="inline-block px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-sm text-white cursor-pointer">
                  Subir imagen
                  <input type="file" accept="image/*" className="hidden" onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (!file || !selectedField) return;
                    const formData = new FormData();
                    formData.append("file", file);
                    formData.append("table", selectedField.table);
                    formData.append("column", selectedField.column);
                    formData.append("rowId", selectedField.rowId);
                    const res = await fetch("/api/upload", { method: "POST", body: formData });
                    if (res.ok) {
                      const d = await res.json();
                      setEditValue(d.url);
                      await handleSave(selectedField.table, selectedField.column, d.url, selectedField.rowId);
                      setSelectedField(null);
                    }
                  }} />
                </label>
              </div>
            ) : (
              <input
                autoFocus
                type="text"
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
                onKeyDown={async (e) => {
                  if (e.key === "Enter" && selectedField) {
                    await handleSave(selectedField.table, selectedField.column, editValue, selectedField.rowId);
                    setSelectedField(null);
                  }
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            )}
            <div className="mt-3 p-3 bg-gray-50 rounded-lg text-xs text-gray-400">
              <div>Tabla: <span className="text-gray-600">{selectedField.table}</span></div>
              <div>Columna: <span className="text-gray-600">{selectedField.column}</span></div>
            </div>
            <button
              onClick={async () => {
                if (selectedField) {
                  await handleSave(selectedField.table, selectedField.column, editValue, selectedField.rowId);
                  setSelectedField(null);
                }
              }}
              className="w-full mt-3 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium"
            >
              Guardar cambios
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
