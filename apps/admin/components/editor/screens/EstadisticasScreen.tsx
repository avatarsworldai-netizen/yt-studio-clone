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

const TEAL = "#1db4a5";

const FILTER_CHIPS = ["Todo", "Anuncios de la pagina de vi...", "Anuncios del feed de Shorts", "Supers"];

const tabStyle: React.CSSProperties = {
  fontSize: 12, fontWeight: 600, padding: "8px 12px", borderRadius: 20,
  border: "none", cursor: "pointer", whiteSpace: "nowrap", flexShrink: 0,
};

const cardStyle: React.CSSProperties = {
  background: "#fff", borderRadius: 12, padding: 16,
  boxShadow: "0 1px 6px rgba(0,0,0,0.08)", marginBottom: 12,
};

const chipStyle: React.CSSProperties = {
  padding: "7px 14px", borderRadius: 20, fontSize: 13, fontWeight: 500,
  cursor: "pointer", whiteSpace: "nowrap", flexShrink: 0,
};

export function EstadisticasScreen({ data, onFieldSelect, selectedField }: Props) {
  const { stats: st, revenue, timeseries } = data;

  const subTabs = ["Vista General", "Contenido", "Audiencia", "Ingresos", "Tendencias"];
  // Default to "Ingresos" tab (index 3) as specified
  const activeTab = 3;

  const maxRev = Math.max(...(revenue || []).map((r: any) => r.estimated_revenue || 0), 1);

  return (
    <div style={{ paddingBottom: 20, background: "#fff" }}>
      {/* Sub-tabs */}
      <div style={{
        display: "flex", gap: 4, padding: "10px 12px",
        overflowX: "auto", borderBottom: "1px solid #e5e5e5",
      }}>
        {subTabs.map((t, i) => (
          <div key={t} style={{
            ...tabStyle,
            background: i === activeTab ? "#1f1f1f" : "#f2f2f2",
            color: i === activeTab ? "#fff" : "#606060",
          }}>{t}</div>
        ))}
      </div>

      {/* Ingresos tab content */}
      <div style={{ padding: "12px 14px 0" }}>

        {/* Filter chips */}
        <div style={{
          display: "flex", gap: 8, padding: "6px 0 14px",
          overflowX: "auto",
        }}>
          {FILTER_CHIPS.map((chip, i) => (
            <div key={chip} style={{
              ...chipStyle,
              background: i === 0 ? "#1f1f1f" : "#f2f2f2",
              color: i === 0 ? "#fff" : "#606060",
            }}>{chip}</div>
          ))}
        </div>

        {/* Revenue chart card */}
        <Editable
          field={{
            id: "est_rev",
            label: "Ingresos estimados",
            value: st?.estimated_revenue ?? 0,
            type: "currency",
            table: "dashboard_stats",
            column: "estimated_revenue",
            rowId: st?.id ?? "",
          }}
          onSelect={onFieldSelect} selectedField={selectedField}
        >
          <div style={cardStyle}>
            <div style={{ fontSize: 13, color: "#737373", marginBottom: 4 }}>Ingresos estimados</div>
            <div style={{ fontSize: 24, fontWeight: 700, color: "#1f1f1f", marginBottom: 16 }}>
              {(st?.estimated_revenue || 0).toFixed(2).replace(".", ",")} &euro;
            </div>

            {/* Chart area */}
            <div style={{ display: "flex", gap: 8 }}>
              {/* Y-axis labels */}
              <div style={{
                display: "flex", flexDirection: "column", justifyContent: "space-between",
                height: 100,
              }}>
                {["4,20 \u20AC", "2,80 \u20AC", "1,40 \u20AC", "0 \u20AC"].map((label, i) => (
                  <span key={i} style={{ fontSize: 10, color: "#9a9a9a", whiteSpace: "nowrap" }}>{label}</span>
                ))}
              </div>
              {/* Chart placeholder */}
              <div style={{
                flex: 1, height: 100, position: "relative",
                borderBottom: "1px solid #ececec",
              }}>
                {/* Grid lines */}
                {[0, 1, 2].map((i) => (
                  <div key={i} style={{
                    position: "absolute", left: 0, right: 0,
                    top: `${(i / 3) * 100}%`, height: 1, background: "#ececec",
                  }} />
                ))}
                {/* Teal line chart placeholder */}
                <svg width="100%" height="100" viewBox="0 0 300 100" preserveAspectRatio="none" style={{ position: "absolute", top: 0, left: 0 }}>
                  <polyline
                    points={timeseries.length > 0
                      ? timeseries.slice(0, 28).map((d: any, i: number, arr: any[]) => {
                          const max = Math.max(...arr.map((t: any) => t.value || 1));
                          return `${(i / (arr.length - 1)) * 300},${100 - ((d.value || 0) / max) * 90}`;
                        }).join(" ")
                      : "0,80 100,60 200,40 300,70"
                    }
                    fill="none" stroke={TEAL} strokeWidth="2.5"
                  />
                </svg>
              </div>
            </div>
            {/* X-axis labels */}
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: 6, paddingLeft: 40 }}>
              <span style={{ fontSize: 10, color: "#9a9a9a" }}>
                {timeseries.length > 0 ? new Date(timeseries[0].date).toLocaleDateString("es", { day: "numeric", month: "short" }) : "1 mar"}
              </span>
              <span style={{ fontSize: 10, color: "#9a9a9a" }}>
                {timeseries.length > 0 ? new Date(timeseries[timeseries.length - 1].date).toLocaleDateString("es", { day: "numeric", month: "short" }) : "28 mar"}
              </span>
            </div>
          </div>
        </Editable>

        {/* Cuanto estas ganando card */}
        <div style={cardStyle}>
          <div style={{ fontSize: 16, fontWeight: 700, color: "#1e1e1e", marginBottom: 4 }}>Cuanto estas ganando</div>
          <div style={{ fontSize: 12, color: "#757575", marginBottom: 16 }}>Estimacion &middot; Ultimos 6 meses</div>

          {revenue.length > 0 ? revenue.map((r: any, i: number) => {
            const pct = (r.estimated_revenue / maxRev) * 100;
            const monthName = new Date(r.month).toLocaleDateString("es-ES", {
              month: "long",
              year: i >= 3 ? "numeric" : undefined,
            });
            const displayName = monthName.charAt(0).toUpperCase() + monthName.slice(1) + (i === 0 ? " (en curso)" : "");

            return (
              <div key={r.id} style={{ marginBottom: 14 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                  <span style={{ fontSize: 14, fontWeight: 500, color: "#2d2d2d" }}>{displayName}</span>
                  <Editable
                    field={{
                      id: `est_rev_${r.id}`,
                      label: `Ingreso ${displayName}`,
                      value: r.estimated_revenue,
                      type: "currency",
                      table: "revenue",
                      column: "estimated_revenue",
                      rowId: r.id,
                    }}
                    onSelect={onFieldSelect} selectedField={selectedField}
                  >
                    <span style={{ fontSize: 14, fontWeight: 600, color: "#1f1f1f" }}>
                      {r.estimated_revenue?.toFixed(2).replace(".", ",")} &euro;
                    </span>
                  </Editable>
                </div>
                {/* Progress bar */}
                <div style={{ height: 6, background: "#e8e8e8", borderRadius: 3 }}>
                  <div style={{
                    height: 6, background: TEAL, borderRadius: 3,
                    width: `${Math.min(pct, 100)}%`,
                    transition: "width 0.3s ease",
                  }} />
                </div>
              </div>
            );
          }) : (
            /* Fallback hardcoded months */
            [
              { name: "Marzo (en curso)", value: "15,72", pct: 26 },
              { name: "Febrero", value: "39,48", pct: 66 },
              { name: "Enero", value: "18,20", pct: 30 },
              { name: "Diciembre", value: "59,74", pct: 100 },
              { name: "Noviembre 2025", value: "4,21", pct: 7 },
              { name: "Octubre 2025", value: "8,28", pct: 14 },
            ].map((m, i) => (
              <div key={i} style={{ marginBottom: 14 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                  <span style={{ fontSize: 14, fontWeight: 500, color: "#2d2d2d" }}>{m.name}</span>
                  <span style={{ fontSize: 14, fontWeight: 600, color: "#1f1f1f" }}>{m.value} &euro;</span>
                </div>
                <div style={{ height: 6, background: "#e8e8e8", borderRadius: 3 }}>
                  <div style={{ height: 6, background: TEAL, borderRadius: 3, width: `${m.pct}%` }} />
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
