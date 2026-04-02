"use client";

import { useState } from "react";
import type { AppData } from "@/app/page";

import type { EditableField } from "@/app/page";

type SaveFn = (table: string, column: string, value: string | number, rowId: string) => Promise<void>;
type SelectFn = (field: EditableField) => void;

function Field({ label, value, table, column, rowId, onSave, onSelect, type = "text" }: {
  label: string; value: any; table: string; column: string; rowId: string; onSave: SaveFn; onSelect?: SelectFn; type?: "text" | "image";
}) {
  const fieldData: EditableField = { id: `${table}_${column}_${rowId}`, label, value: value ?? "", type: type as any, table, column, rowId };

  return (
    <div
      className="mb-2 flex items-center justify-between group cursor-pointer hover:bg-blue-50 rounded px-2 py-1.5 -mx-2 transition-colors"
      onClick={() => onSelect?.(fieldData)}
    >
      <div className="min-w-0 flex-1">
        <div className="text-xs text-gray-400">{label}</div>
        {type === "image" ? (
          <div className="flex items-center gap-2 mt-1">
            <div className="w-8 h-8 rounded bg-gray-200 overflow-hidden flex-shrink-0">
              {value && <img src={value} alt="" className="w-full h-full object-cover" />}
            </div>
            <span className="text-xs text-gray-500 truncate">{value ? "Imagen cargada" : "Sin imagen"}</span>
          </div>
        ) : (
          <div className="text-sm text-gray-900 font-medium truncate">{String(value ?? "—")}</div>
        )}
      </div>
      <span className="text-gray-300 group-hover:text-blue-500 text-xs ml-2 flex-shrink-0">✎</span>
    </div>
  );
}

function SectionTitle({ children }: { children: string }) {
  return <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 mt-4 first:mt-0">{children}</h3>;
}

// ── Channel Editor ──
export function ChannelEditor({ data, onSave, onSelect }: { data: AppData; onSave: SaveFn; onSelect: SelectFn }) {
  const ch = data.channel;
  if (!ch) return null;
  return (
    <div>
      <SectionTitle>Perfil del canal</SectionTitle>
      <Field label="Avatar" value={ch.avatar_url} table="channel" column="avatar_url" rowId={ch.id} onSave={onSave} onSelect={onSelect} type="image" />
      <Field label="Banner" value={ch.banner_url} table="channel" column="banner_url" rowId={ch.id} onSave={onSave} onSelect={onSelect} type="image" />
      <Field label="Nombre" value={ch.name} table="channel" column="name" rowId={ch.id} onSave={onSave} onSelect={onSelect} />
      <Field label="Handle" value={ch.handle} table="channel" column="handle" rowId={ch.id} onSave={onSave} onSelect={onSelect} />
      <Field label="Suscriptores" value={ch.subscriber_count} table="channel" column="subscriber_count" rowId={ch.id} onSave={onSave} onSelect={onSelect} />
      <Field label="Visualizaciones totales" value={ch.total_views} table="channel" column="total_views" rowId={ch.id} onSave={onSave} onSelect={onSelect} />
      <Field label="Tiempo de visualización (horas)" value={ch.total_watch_time_hours} table="channel" column="total_watch_time_hours" rowId={ch.id} onSave={onSave} onSelect={onSelect} />
      <Field label="Número de videos" value={ch.video_count} table="channel" column="video_count" rowId={ch.id} onSave={onSave} onSelect={onSelect} />
      <Field label="País" value={ch.country} table="channel" column="country" rowId={ch.id} onSave={onSave} onSelect={onSelect} />
      <Field label="Verificado" value={ch.is_verified ? "sí" : "no"} table="channel" column="is_verified" rowId={ch.id} onSave={onSave} onSelect={onSelect} />
      <Field label="Descripción" value={ch.description} table="channel" column="description" rowId={ch.id} onSave={onSave} onSelect={onSelect} />
    </div>
  );
}

// ── Stats Editor ──
export function StatsEditor({ data, onSave, onSelect }: { data: AppData; onSave: SaveFn; onSelect: SelectFn }) {
  const st = data.stats;
  if (!st) return null;
  return (
    <div>
      <SectionTitle>Estadísticas del canal (28 días)</SectionTitle>
      <Field label="Visualizaciones" value={st.views} table="dashboard_stats" column="views" rowId={st.id} onSave={onSave} onSelect={onSelect} />
      <Field label="% cambio visualizaciones" value={st.views_change_percent} table="dashboard_stats" column="views_change_percent" rowId={st.id} onSave={onSave} onSelect={onSelect} />
      <Field label="Tiempo de visualización (horas)" value={st.watch_time_hours} table="dashboard_stats" column="watch_time_hours" rowId={st.id} onSave={onSave} onSelect={onSelect} />
      <Field label="% cambio tiempo" value={st.watch_time_change_percent} table="dashboard_stats" column="watch_time_change_percent" rowId={st.id} onSave={onSave} onSelect={onSelect} />
      <Field label="Suscriptores ganados" value={st.subscribers_gained} table="dashboard_stats" column="subscribers_gained" rowId={st.id} onSave={onSave} onSelect={onSelect} />
      <Field label="Suscriptores perdidos" value={st.subscribers_lost} table="dashboard_stats" column="subscribers_lost" rowId={st.id} onSave={onSave} onSelect={onSelect} />
      <Field label="Suscriptores neto" value={st.subscribers_net} table="dashboard_stats" column="subscribers_net" rowId={st.id} onSave={onSave} onSelect={onSelect} />
      <Field label="% cambio suscriptores" value={st.subscribers_change_percent} table="dashboard_stats" column="subscribers_change_percent" rowId={st.id} onSave={onSave} onSelect={onSelect} />
      <Field label="Ingresos estimados" value={st.estimated_revenue} table="dashboard_stats" column="estimated_revenue" rowId={st.id} onSave={onSave} onSelect={onSelect} />
      <Field label="% cambio ingresos" value={st.revenue_change_percent} table="dashboard_stats" column="revenue_change_percent" rowId={st.id} onSave={onSave} onSelect={onSelect} />
      <Field label="Impresiones" value={st.impressions} table="dashboard_stats" column="impressions" rowId={st.id} onSave={onSave} onSelect={onSelect} />
      <Field label="CTR impresiones (%)" value={st.impression_ctr} table="dashboard_stats" column="impression_ctr" rowId={st.id} onSave={onSave} onSelect={onSelect} />
    </div>
  );
}

// ── Videos Editor ──
export function VideosEditor({ data, onSave, onSelect }: { data: AppData; onSave: SaveFn; onSelect: SelectFn }) {
  const [expanded, setExpanded] = useState<number | null>(null);
  return (
    <div>
      <SectionTitle>{`Videos (${data.videos.length})`}</SectionTitle>
      {data.videos.map((vid: any, i: number) => (
        <div key={vid.id} className="mb-2 border border-gray-200 rounded-lg overflow-hidden">
          <div
            className="flex items-center gap-2 p-2 cursor-pointer hover:bg-gray-50"
            onClick={() => setExpanded(expanded === i ? null : i)}
          >
            <div className="w-10 h-6 rounded bg-gray-200 overflow-hidden flex-shrink-0">
              {vid.thumbnail_url && <img src={vid.thumbnail_url} alt="" className="w-full h-full object-cover" />}
            </div>
            <span className="text-xs text-gray-800 truncate flex-1">{vid.title}</span>
            <span className="text-gray-400 text-xs">{expanded === i ? "▲" : "▼"}</span>
          </div>
          {expanded === i && (
            <div className="p-2 pt-0 border-t border-gray-100">
              <Field label="Thumbnail" value={vid.thumbnail_url} table="videos" column="thumbnail_url" rowId={vid.id} onSave={onSave} onSelect={onSelect} type="image" />
              <Field label="Título" value={vid.title} table="videos" column="title" rowId={vid.id} onSave={onSave} onSelect={onSelect} />
              <Field label="Descripción" value={vid.description} table="videos" column="description" rowId={vid.id} onSave={onSave} onSelect={onSelect} />
              <Field label="Duración" value={vid.duration} table="videos" column="duration" rowId={vid.id} onSave={onSave} onSelect={onSelect} />
              <Field label="Estado" value={vid.status} table="videos" column="status" rowId={vid.id} onSave={onSave} onSelect={onSelect} />
              <Field label="Visibilidad" value={vid.visibility} table="videos" column="visibility" rowId={vid.id} onSave={onSave} onSelect={onSelect} />
              <Field label="Visualizaciones" value={vid.view_count} table="videos" column="view_count" rowId={vid.id} onSave={onSave} onSelect={onSelect} />
              <Field label="Likes" value={vid.like_count} table="videos" column="like_count" rowId={vid.id} onSave={onSave} onSelect={onSelect} />
              <Field label="Dislikes" value={vid.dislike_count} table="videos" column="dislike_count" rowId={vid.id} onSave={onSave} onSelect={onSelect} />
              <Field label="Comentarios" value={vid.comment_count} table="videos" column="comment_count" rowId={vid.id} onSave={onSave} onSelect={onSelect} />
              <Field label="Compartidos" value={vid.share_count} table="videos" column="share_count" rowId={vid.id} onSave={onSave} onSelect={onSelect} />
              <Field label="Tiempo de vis. (horas)" value={vid.watch_time_hours} table="videos" column="watch_time_hours" rowId={vid.id} onSave={onSave} onSelect={onSelect} />
              <Field label="Duración media vista" value={vid.average_view_duration} table="videos" column="average_view_duration" rowId={vid.id} onSave={onSave} onSelect={onSelect} />
              <Field label="Impresiones" value={vid.impressions} table="videos" column="impressions" rowId={vid.id} onSave={onSave} onSelect={onSelect} />
              <Field label="CTR impresiones (%)" value={vid.impression_ctr} table="videos" column="impression_ctr" rowId={vid.id} onSave={onSave} onSelect={onSelect} />
              <Field label="Ingresos estimados" value={vid.estimated_revenue} table="videos" column="estimated_revenue" rowId={vid.id} onSave={onSave} onSelect={onSelect} />
              <Field label="RPM" value={vid.rpm} table="videos" column="rpm" rowId={vid.id} onSave={onSave} onSelect={onSelect} />
              <Field label="CPM" value={vid.cpm} table="videos" column="cpm" rowId={vid.id} onSave={onSave} onSelect={onSelect} />
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

// ── Revenue Editor ──
export function RevenueEditor({ data, onSave, onSelect }: { data: AppData; onSave: SaveFn; onSelect: SelectFn }) {
  return (
    <div>
      <SectionTitle>Ingresos mensuales</SectionTitle>
      {data.revenue.map((rev: any) => {
        const monthName = new Date(rev.month).toLocaleDateString("es-ES", { month: "long", year: "numeric" });
        return (
          <div key={rev.id} className="mb-3 p-2 border border-gray-200 rounded-lg">
            <div className="text-xs font-semibold text-gray-700 mb-2 capitalize">{monthName}</div>
            <Field label="Ingresos estimados" value={rev.estimated_revenue} table="revenue" column="estimated_revenue" rowId={rev.id} onSave={onSave} onSelect={onSelect} />
            <Field label="Ingresos por anuncios" value={rev.ad_revenue} table="revenue" column="ad_revenue" rowId={rev.id} onSave={onSave} onSelect={onSelect} />
            <Field label="Membresías" value={rev.membership_revenue} table="revenue" column="membership_revenue" rowId={rev.id} onSave={onSave} onSelect={onSelect} />
            <Field label="Super Chat" value={rev.superchat_revenue} table="revenue" column="superchat_revenue" rowId={rev.id} onSave={onSave} onSelect={onSelect} />
            <Field label="Merchandise" value={rev.merchandise_revenue} table="revenue" column="merchandise_revenue" rowId={rev.id} onSave={onSave} onSelect={onSelect} />
            <Field label="Premium" value={rev.premium_revenue} table="revenue" column="premium_revenue" rowId={rev.id} onSave={onSave} onSelect={onSelect} />
            <Field label="RPM" value={rev.rpm} table="revenue" column="rpm" rowId={rev.id} onSave={onSave} onSelect={onSelect} />
            <Field label="CPM" value={rev.cpm} table="revenue" column="cpm" rowId={rev.id} onSave={onSave} onSelect={onSelect} />
          </div>
        );
      })}
    </div>
  );
}

// ── Comments Editor ──
export function CommentsEditor({ data, onSave, onSelect }: { data: AppData; onSave: SaveFn; onSelect: SelectFn }) {
  return (
    <div>
      <SectionTitle>{`Comentarios (${data.comments.length})`}</SectionTitle>
      {data.comments.map((com: any) => (
        <div key={com.id} className="mb-3 p-2 border border-gray-200 rounded-lg">
          <Field label="Autor" value={com.author_name} table="comments" column="author_name" rowId={com.id} onSave={onSave} onSelect={onSelect} />
          <Field label="Avatar" value={com.author_avatar_url} table="comments" column="author_avatar_url" rowId={com.id} onSave={onSave} onSelect={onSelect} type="image" />
          <Field label="Contenido" value={com.content} table="comments" column="content" rowId={com.id} onSave={onSave} onSelect={onSelect} />
          <Field label="Likes" value={com.like_count} table="comments" column="like_count" rowId={com.id} onSave={onSave} onSelect={onSelect} />
          <Field label="Estado" value={com.status} table="comments" column="status" rowId={com.id} onSave={onSave} onSelect={onSelect} />
          <Field label="Fijado" value={com.is_pinned ? "sí" : "no"} table="comments" column="is_pinned" rowId={com.id} onSave={onSave} onSelect={onSelect} />
          <Field label="Corazón" value={com.is_hearted ? "sí" : "no"} table="comments" column="is_hearted" rowId={com.id} onSave={onSave} onSelect={onSelect} />
        </div>
      ))}
    </div>
  );
}
