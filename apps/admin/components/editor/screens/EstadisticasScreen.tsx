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

const tabStyle: React.CSSProperties = {
  fontSize: 12, fontWeight: 600, padding: "8px 12px", borderRadius: 20,
  border: "none", cursor: "pointer", whiteSpace: "nowrap",
};

const cardStyle: React.CSSProperties = {
  background: "#fff", borderRadius: 12, padding: 14,
  boxShadow: "0 1px 6px rgba(0,0,0,0.08)", marginBottom: 10,
};

export function EstadisticasScreen({ data, onFieldSelect, selectedField }: Props) {
  const { stats: st, revenue, timeseries } = data;
  if (!st) return null;

  const subTabs = ["Vista General", "Contenido", "Audiencia", "Ingresos", "Tendencias"];

  return (
    <div style={{ paddingBottom: 20 }}>
      {/* Sub-tabs */}
      <div style={{ display: "flex", gap: 4, padding: "10px 12px", overflowX: "auto", borderBottom: "1px solid #e5e5e5" }}>
        {subTabs.map((t, i) => (
          <div key={t} style={{ ...tabStyle, background: i === 0 ? "#1f1f1f" : "#f2f2f2", color: i === 0 ? "#fff" : "#606060" }}>{t}</div>
        ))}
      </div>

      <div style={{ padding: "16px 14px 0" }}>
        <div style={{ fontSize: 15, fontWeight: 700, color: "#1f1f1f", marginBottom: 4 }}>Vista general</div>
        <div style={{ fontSize: 12, color: "#757575", marginBottom: 14 }}>Últimos 28 días</div>

        {/* Stats grid */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 16 }}>
          <Editable
            field={{ id: "est_views", label: "Visualizaciones", value: st.views, type: "number", table: "dashboard_stats", column: "views", rowId: st.id }}
            onSelect={onFieldSelect} selectedField={selectedField}
          >
            <div style={cardStyle}>
              <div style={{ fontSize: 12, color: "#737373" }}>Visualizaciones</div>
              <div style={{ fontSize: 20, fontWeight: 700, color: "#1f1f1f", marginTop: 4 }}>{fmt(st.views)}</div>
            </div>
          </Editable>

          <Editable
            field={{ id: "est_wt", label: "Tiempo de visualización", value: st.watch_time_hours, type: "number", table: "dashboard_stats", column: "watch_time_hours", rowId: st.id }}
            onSelect={onFieldSelect} selectedField={selectedField}
          >
            <div style={cardStyle}>
              <div style={{ fontSize: 12, color: "#737373" }}>Tiempo visualización</div>
              <div style={{ fontSize: 20, fontWeight: 700, color: "#1f1f1f", marginTop: 4 }}>{Math.round(st.watch_time_hours)}h</div>
            </div>
          </Editable>

          <Editable
            field={{ id: "est_subs", label: "Suscriptores netos", value: st.subscribers_net, type: "number", table: "dashboard_stats", column: "subscribers_net", rowId: st.id }}
            onSelect={onFieldSelect} selectedField={selectedField}
          >
            <div style={cardStyle}>
              <div style={{ fontSize: 12, color: "#737373" }}>Suscriptores</div>
              <div style={{ fontSize: 20, fontWeight: 700, color: "#1f1f1f", marginTop: 4 }}>{st.subscribers_net >= 0 ? "+" : ""}{st.subscribers_net}</div>
            </div>
          </Editable>

          <Editable
            field={{ id: "est_rev", label: "Ingresos estimados", value: st.estimated_revenue, type: "currency", table: "dashboard_stats", column: "estimated_revenue", rowId: st.id }}
            onSelect={onFieldSelect} selectedField={selectedField}
          >
            <div style={cardStyle}>
              <div style={{ fontSize: 12, color: "#737373" }}>Ingresos</div>
              <div style={{ fontSize: 20, fontWeight: 700, color: "#1f1f1f", marginTop: 4 }}>{st.estimated_revenue?.toFixed(2).replace(".", ",")} €</div>
            </div>
          </Editable>
        </div>

        {/* Revenue chart placeholder */}
        <div style={{ ...cardStyle, padding: 16 }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: "#1f1f1f", marginBottom: 12 }}>Ingresos (últimos 30 días)</div>
          <div style={{ display: "flex", alignItems: "flex-end", gap: 3, height: 80 }}>
            {timeseries.slice(0, 28).map((d: any, i: number) => {
              const max = Math.max(...timeseries.map((t: any) => t.value || 1));
              const h = Math.max(4, ((d.value || 0) / max) * 70);
              return (
                <div key={i} style={{ flex: 1, height: h, background: "#34a853", borderRadius: 2, minWidth: 2 }} />
              );
            })}
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 6 }}>
            <span style={{ fontSize: 10, color: "#909090" }}>Hace 28d</span>
            <span style={{ fontSize: 10, color: "#909090" }}>Hoy</span>
          </div>
        </div>

        {/* Revenue rows */}
        {revenue.length > 0 && (
          <div style={{ marginTop: 14 }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: "#1f1f1f", marginBottom: 8 }}>Ingresos por mes</div>
            {revenue.map((r: any) => (
              <div key={r.id} style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderBottom: "1px solid #f0f0f0" }}>
                <span style={{ fontSize: 13, color: "#606060" }}>{r.month}</span>
                <Editable
                  field={{ id: `est_rev_${r.id}`, label: `Ingreso ${r.month}`, value: r.estimated_revenue, type: "currency", table: "revenue", column: "estimated_revenue", rowId: r.id }}
                  onSelect={onFieldSelect} selectedField={selectedField}
                >
                  <span style={{ fontSize: 13, fontWeight: 600, color: "#1f1f1f" }}>{r.estimated_revenue?.toFixed(2).replace(".", ",")} €</span>
                </Editable>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
