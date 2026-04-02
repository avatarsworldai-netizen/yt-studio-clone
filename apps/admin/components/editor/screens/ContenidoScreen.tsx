"use client";

import type { EditableField, AppData } from "@/app/page";
import { Editable } from "../PhonePreview";

type Props = {
  data: AppData;
  onFieldSelect: (field: EditableField) => void;
  selectedField: EditableField | null;
};

function fmt(v: number) {
  if (v >= 1e6) return `${(v / 1e6).toFixed(1).replace(".", ",")} M`;
  if (v >= 1e3) return `${(v / 1e3).toFixed(1).replace(".", ",")} K`;
  return v.toLocaleString("es-ES");
}

const sectionHeader: React.CSSProperties = {
  fontSize: 15, fontWeight: 700, color: "#1f1f1f", padding: "18px 16px 8px",
};

const tabStyle: React.CSSProperties = {
  fontSize: 13, fontWeight: 600, padding: "8px 16px", borderRadius: 20,
  border: "none", cursor: "pointer",
};

export function ContenidoScreen({ data, onFieldSelect, selectedField }: Props) {
  const { videos } = data;
  if (!videos.length) return null;

  const sections = [
    { label: "Vídeos", filter: (v: any) => v.video_type === "video" || !v.video_type },
    { label: "Shorts", filter: (v: any) => v.video_type === "short" },
    { label: "En directo", filter: (v: any) => v.video_type === "live" },
  ];

  return (
    <div style={{ paddingBottom: 20 }}>
      {/* Sub-tabs */}
      <div style={{ display: "flex", gap: 6, padding: "10px 16px", borderBottom: "1px solid #e5e5e5" }}>
        {["Vídeos", "Shorts", "En directo"].map((t, i) => (
          <div key={t} style={{ ...tabStyle, background: i === 0 ? "#1f1f1f" : "#f2f2f2", color: i === 0 ? "#fff" : "#606060" }}>{t}</div>
        ))}
      </div>

      {sections.map((section) => {
        const items = videos.filter(section.filter);
        if (!items.length) return null;
        return (
          <div key={section.label}>
            <div style={sectionHeader}>{section.label}</div>
            {items.map((vid: any, i: number) => (
              <div key={vid.id} style={{ display: "flex", padding: "10px 16px", gap: 12, alignItems: "center", borderBottom: "1px solid #f0f0f0" }}>
                <Editable
                  field={{ id: `cont_thumb_${vid.id}`, label: `Thumbnail - ${vid.title}`, value: vid.thumbnail_url || "", type: "image", table: "videos", column: "thumbnail_url", rowId: vid.id }}
                  onSelect={onFieldSelect} selectedField={selectedField}
                >
                  <div style={{ width: 120, height: 68, borderRadius: 8, background: "#e0e0e0", overflow: "hidden", flexShrink: 0 }}>
                    {vid.thumbnail_url && <img src={vid.thumbnail_url} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />}
                  </div>
                </Editable>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <Editable
                    field={{ id: `cont_title_${vid.id}`, label: `Título - ${vid.title}`, value: vid.title, type: "text", table: "videos", column: "title", rowId: vid.id }}
                    onSelect={onFieldSelect} selectedField={selectedField}
                  >
                    <div style={{ fontSize: 14, fontWeight: 500, color: "#1f1f1f", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{vid.title}</div>
                  </Editable>
                  <Editable
                    field={{ id: `cont_views_${vid.id}`, label: `Vistas - ${vid.title}`, value: vid.view_count, type: "number", table: "videos", column: "view_count", rowId: vid.id }}
                    onSelect={onFieldSelect} selectedField={selectedField}
                  >
                    <div style={{ fontSize: 12, color: "#606060", marginTop: 4 }}>
                      {fmt(vid.view_count)} visualizaciones · {vid.like_count} likes
                    </div>
                  </Editable>
                  <div style={{ fontSize: 11, color: "#909090", marginTop: 2 }}>
                    {vid.published_at ? new Date(vid.published_at).toLocaleDateString("es-ES") : ""}
                  </div>
                </div>
              </div>
            ))}
          </div>
        );
      })}
    </div>
  );
}
