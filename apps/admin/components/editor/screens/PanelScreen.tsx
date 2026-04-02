"use client";

import type { EditableField, AppData } from "@/app/page";
import { Editable } from "../PhonePreview";

type Props = {
  data: AppData;
  onFieldSelect: (field: EditableField) => void;
  selectedField: EditableField | null;
};

export function PanelScreen({ data, onFieldSelect, selectedField }: Props) {
  const { channel: ch, stats: st, videos } = data;
  if (!ch || !st) return null;

  return (
    <div style={{ padding: "0 0 20px", fontFamily: "-apple-system, sans-serif" }}>
      {/* Channel info */}
      <div style={{ display: "flex", alignItems: "center", padding: "16px", gap: 14 }}>
        <Editable
          field={{ id: "ch_avatar", label: "Avatar del canal", value: ch.avatar_url || "", type: "image", table: "channel", column: "avatar_url", rowId: ch.id }}
          onSelect={onFieldSelect} selectedField={selectedField}
        >
          <div style={{ width: 77, height: 77, borderRadius: "50%", background: "#e0e0e0", overflow: "hidden", flexShrink: 0 }}>
            {ch.avatar_url && <img src={ch.avatar_url} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />}
          </div>
        </Editable>
        <div>
          <Editable
            field={{ id: "ch_name", label: "Nombre del canal", value: ch.name, type: "text", table: "channel", column: "name", rowId: ch.id }}
            onSelect={onFieldSelect} selectedField={selectedField}
          >
            <div style={{ fontSize: 18, fontWeight: 700, color: "#1f1f1f" }}>{ch.name}</div>
          </Editable>
          <Editable
            field={{ id: "ch_subs", label: "Suscriptores", value: ch.subscriber_count, type: "number", table: "channel", column: "subscriber_count", rowId: ch.id }}
            onSelect={onFieldSelect} selectedField={selectedField}
          >
            <div style={{ fontSize: 23, fontWeight: 700, color: "#1d1d1d" }}>{ch.subscriber_count?.toLocaleString("es-ES")}</div>
          </Editable>
          <div style={{ fontSize: 14, color: "#757575" }}>Suscriptores totales</div>
        </div>
      </div>

      {/* Stats section */}
      <div style={{ padding: "0 14px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
          <span style={{ fontSize: 17, fontWeight: 700, color: "#202020" }}>Estadísticas del canal</span>
          <span style={{ fontSize: 14, color: "#707070" }}>Últimos 28 días</span>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          <Editable field={{ id: "st_views", label: "Visualizaciones", value: st.views, type: "text", table: "dashboard_stats", column: "views", rowId: st.id }} onSelect={onFieldSelect} selectedField={selectedField}>
            <div style={cardStyle}>
              <div style={cardLabel}>Visualizaciones</div>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <span style={cardValue}>{Number(st.views).toLocaleString("es-ES")}</span>
                <span style={{ fontSize: 12, color: "#757575" }}>⬇</span>
              </div>
            </div>
          </Editable>

          <Editable field={{ id: "st_wt", label: "Tiempo de visualización (horas)", value: st.watch_time_hours, type: "text", table: "dashboard_stats", column: "watch_time_hours", rowId: st.id }} onSelect={onFieldSelect} selectedField={selectedField}>
            <div style={cardStyle}>
              <div style={cardLabel}>Tiempo de visualización (ho...</div>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <span style={cardValue}>{Math.round(Number(st.watch_time_hours))}</span>
                <span style={{ fontSize: 12, color: "#757575" }}>⬇</span>
              </div>
            </div>
          </Editable>

          <Editable field={{ id: "st_subs", label: "Suscriptores", value: st.subscribers_net, type: "text", table: "dashboard_stats", column: "subscribers_net", rowId: st.id }} onSelect={onFieldSelect} selectedField={selectedField}>
            <div style={cardStyle}>
              <div style={cardLabel}>Suscriptores</div>
              <span style={cardValue}>{st.subscribers_net}</span>
            </div>
          </Editable>

          <Editable field={{ id: "st_rev", label: "Ingresos estimados", value: st.estimated_revenue, type: "text", table: "dashboard_stats", column: "estimated_revenue", rowId: st.id }} onSelect={onFieldSelect} selectedField={selectedField}>
            <div style={cardStyle}>
              <div style={cardLabel}>Ingresos estimados</div>
              <span style={cardValue}>{Number(st.estimated_revenue).toFixed(2).replace(".", ",")}€</span>
            </div>
          </Editable>
        </div>
      </div>

      {/* Videos section */}
      <div style={{ padding: "24px 14px 0" }}>
        <div style={{ fontSize: 17, fontWeight: 700, color: "#1f1f1f", marginBottom: 12 }}>Último contenido publicado</div>

        {videos.slice(0, 3).map((vid: any, i: number) => (
          <VideoCard key={vid.id} vid={vid} i={i} onFieldSelect={onFieldSelect} selectedField={selectedField} />
        ))}
      </div>
    </div>
  );
}

function VideoCard({ vid, i, onFieldSelect, selectedField }: { vid: any; i: number; onFieldSelect: any; selectedField: any }) {
  return (
    <div style={{ background: "#fff", borderRadius: 12, boxShadow: "0 1px 6px rgba(0,0,0,0.08)", marginBottom: 12, overflow: "hidden" }}>
      {/* Video header */}
      <div style={{ display: "flex", padding: 14, gap: 12, alignItems: "center" }}>
        <Editable
          field={{ id: `vid_thumb_${i}`, label: `Thumbnail video ${i + 1}`, value: vid.thumbnail_url || "", type: "image", table: "videos", column: "thumbnail_url", rowId: vid.id }}
          onSelect={onFieldSelect} selectedField={selectedField}
        >
          <div style={{ width: 78, height: 44, borderRadius: 6, background: "#e0e0e0", overflow: "hidden", flexShrink: 0 }}>
            {vid.thumbnail_url && <img src={vid.thumbnail_url} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />}
          </div>
        </Editable>
        <div style={{ flex: 1, minWidth: 0 }}>
          <Editable
            field={{ id: `vid_title_${i}`, label: `Título video ${i + 1}`, value: vid.title, type: "text", table: "videos", column: "title", rowId: vid.id }}
            onSelect={onFieldSelect} selectedField={selectedField}
          >
            <div style={{ fontSize: 14, fontWeight: 500, color: "#313131", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{vid.title}</div>
          </Editable>
          <div style={{ fontSize: 12, color: "#727272", marginTop: 2 }}>Primeros {7 + i * 10} días y 1 horas</div>
        </div>
      </div>

      {/* Divider */}
      <div style={{ height: 1, background: "#e5e5e5", margin: "0 14px" }} />

      {/* Stats row */}
      <div style={{ display: "flex", padding: "10px 14px", gap: 14, alignItems: "center" }}>
        <span style={{ fontSize: 16, color: "#0d7d2c" }}>$</span>
        <Editable field={{ id: `vid_views_${i}`, label: `Visualizaciones video ${i + 1}`, value: vid.view_count, type: "text", table: "videos", column: "view_count", rowId: vid.id }} onSelect={onFieldSelect} selectedField={selectedField}>
          <span style={{ fontSize: 13, color: "#2a2a2a" }}>📊 {Number(vid.view_count).toLocaleString("es-ES")}</span>
        </Editable>
        <Editable field={{ id: `vid_likes_${i}`, label: `Likes video ${i + 1}`, value: vid.like_count, type: "text", table: "videos", column: "like_count", rowId: vid.id }} onSelect={onFieldSelect} selectedField={selectedField}>
          <span style={{ fontSize: 13, color: "#2a2a2a" }}>👍 {vid.like_count}</span>
        </Editable>
        <Editable field={{ id: `vid_comments_${i}`, label: `Comentarios video ${i + 1}`, value: vid.comment_count, type: "text", table: "videos", column: "comment_count", rowId: vid.id }} onSelect={onFieldSelect} selectedField={selectedField}>
          <span style={{ fontSize: 13, color: "#2a2a2a" }}>💬 {vid.comment_count}</span>
        </Editable>
        <span style={{ marginLeft: "auto", fontSize: 14, color: "#aaa" }}>⌄</span>
      </div>
    </div>
  );
}

const cardStyle: React.CSSProperties = {
  background: "#fff",
  borderRadius: 12,
  padding: 14,
  boxShadow: "0 1px 6px rgba(0,0,0,0.08)",
  minHeight: 70,
};

const cardLabel: React.CSSProperties = {
  fontSize: 13, color: "#737373", marginBottom: 4,
};

const cardValue: React.CSSProperties = {
  fontSize: 20, fontWeight: 700, color: "#171717",
};
