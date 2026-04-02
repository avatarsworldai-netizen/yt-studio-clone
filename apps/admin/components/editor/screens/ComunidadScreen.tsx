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

const cardStyle: React.CSSProperties = {
  background: "#fff", borderRadius: 12, padding: 14,
  boxShadow: "0 1px 6px rgba(0,0,0,0.08)",
};

export function ComunidadScreen({ data, onFieldSelect, selectedField }: Props) {
  const { comments, stats: st } = data;

  return (
    <div style={{ paddingBottom: 20 }}>
      {/* Header */}
      <div style={{ padding: "16px 16px 8px" }}>
        <div style={{ fontSize: 17, fontWeight: 700, color: "#1f1f1f" }}>Comunidad</div>
      </div>

      {/* Metric cards */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, padding: "8px 14px 16px" }}>
        <div style={cardStyle}>
          <div style={{ fontSize: 12, color: "#737373" }}>Comentarios 28d</div>
          <div style={{ fontSize: 20, fontWeight: 700, color: "#1f1f1f", marginTop: 4 }}>
            {comments.length > 0 ? comments.length : "—"}
          </div>
        </div>
        {st && (
          <Editable
            field={{ id: "com_subs", label: "Audiencia mensual", value: st.views, type: "number", table: "dashboard_stats", column: "views", rowId: st.id }}
            onSelect={onFieldSelect} selectedField={selectedField}
          >
            <div style={cardStyle}>
              <div style={{ fontSize: 12, color: "#737373" }}>Audiencia mensual</div>
              <div style={{ fontSize: 20, fontWeight: 700, color: "#1f1f1f", marginTop: 4 }}>{fmt(st.views)}</div>
            </div>
          </Editable>
        )}
      </div>

      {/* Comments list */}
      <div style={{ padding: "0 14px" }}>
        <div style={{ fontSize: 15, fontWeight: 700, color: "#1f1f1f", marginBottom: 10 }}>Comentarios recientes</div>

        {comments.map((c: any) => (
          <div key={c.id} style={{ background: "#fff", borderRadius: 12, boxShadow: "0 1px 6px rgba(0,0,0,0.08)", padding: 14, marginBottom: 10 }}>
            {/* Author row */}
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
              <div style={{ width: 32, height: 32, borderRadius: "50%", background: "#e0e0e0", flexShrink: 0 }} />
              <Editable
                field={{ id: `com_author_${c.id}`, label: "Nombre del autor", value: c.author_name, type: "text", table: "comments", column: "author_name", rowId: c.id }}
                onSelect={onFieldSelect} selectedField={selectedField}
              >
                <span style={{ fontSize: 13, fontWeight: 600, color: "#1f1f1f" }}>{c.author_name}</span>
              </Editable>
              <span style={{ fontSize: 11, color: "#909090", marginLeft: "auto" }}>
                {c.published_at ? new Date(c.published_at).toLocaleDateString("es-ES") : ""}
              </span>
            </div>

            {/* Content */}
            <Editable
              field={{ id: `com_content_${c.id}`, label: "Comentario", value: c.content, type: "textarea", table: "comments", column: "content", rowId: c.id }}
              onSelect={onFieldSelect} selectedField={selectedField}
            >
              <div style={{ fontSize: 13, color: "#303030", lineHeight: 1.4, marginBottom: 8 }}>{c.content}</div>
            </Editable>

            {/* Actions row */}
            <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
              <Editable
                field={{ id: `com_likes_${c.id}`, label: "Likes del comentario", value: c.like_count, type: "number", table: "comments", column: "like_count", rowId: c.id }}
                onSelect={onFieldSelect} selectedField={selectedField}
              >
                <span style={{ fontSize: 12, color: "#606060" }}>👍 {c.like_count}</span>
              </Editable>
              <span style={{ fontSize: 12, color: "#606060" }}>👎</span>
              <span style={{ fontSize: 12, color: "#606060" }}>💬</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
