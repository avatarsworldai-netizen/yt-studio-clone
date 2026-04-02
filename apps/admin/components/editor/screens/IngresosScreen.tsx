"use client";

import type { EditableField, AppData } from "@/app/page";
import { Editable } from "../PhonePreview";

type Props = {
  data: AppData;
  onFieldSelect: (field: EditableField) => void;
  selectedField: EditableField | null;
};

const cardStyle: React.CSSProperties = {
  background: "#fff", borderRadius: 12, padding: 14,
  boxShadow: "0 1px 6px rgba(0,0,0,0.08)", marginBottom: 10,
};

export function IngresosScreen({ data, onFieldSelect, selectedField }: Props) {
  const { revenue, stats: st, timeseries } = data;

  return (
    <div style={{ paddingBottom: 20 }}>
      {/* Header */}
      <div style={{ padding: "16px 16px 4px" }}>
        <div style={{ fontSize: 17, fontWeight: 700, color: "#1f1f1f" }}>Ingresos</div>
        <div style={{ fontSize: 12, color: "#757575", marginTop: 2 }}>Resumen de monetización</div>
      </div>

      {/* Total revenue card */}
      {st && (
        <div style={{ padding: "12px 14px" }}>
          <Editable
            field={{ id: "ing_total", label: "Ingresos estimados (28d)", value: st.estimated_revenue, type: "currency", table: "dashboard_stats", column: "estimated_revenue", rowId: st.id }}
            onSelect={onFieldSelect} selectedField={selectedField}
          >
            <div style={{ ...cardStyle, padding: 18 }}>
              <div style={{ fontSize: 12, color: "#737373" }}>Ingresos estimados (últimos 28 días)</div>
              <div style={{ fontSize: 28, fontWeight: 700, color: "#1f1f1f", marginTop: 6 }}>
                {st.estimated_revenue?.toFixed(2).replace(".", ",")} €
              </div>
            </div>
          </Editable>
        </div>
      )}

      {/* Mini chart */}
      {timeseries.length > 0 && (
        <div style={{ padding: "0 14px 14px" }}>
          <div style={cardStyle}>
            <div style={{ fontSize: 13, fontWeight: 600, color: "#1f1f1f", marginBottom: 10 }}>Evolución de ingresos</div>
            <div style={{ display: "flex", alignItems: "flex-end", gap: 3, height: 60 }}>
              {timeseries.slice(0, 28).map((d: any, i: number) => {
                const max = Math.max(...timeseries.map((t: any) => t.value || 1));
                const h = Math.max(3, ((d.value || 0) / max) * 50);
                return <div key={i} style={{ flex: 1, height: h, background: "#34a853", borderRadius: 2, minWidth: 2 }} />;
              })}
            </div>
          </div>
        </div>
      )}

      {/* Revenue rows by month */}
      <div style={{ padding: "0 14px" }}>
        <div style={{ fontSize: 15, fontWeight: 700, color: "#1f1f1f", marginBottom: 10 }}>Ingresos por mes</div>
        {revenue.map((r: any) => (
          <div key={r.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 14px", background: "#fff", borderRadius: 10, boxShadow: "0 1px 4px rgba(0,0,0,0.06)", marginBottom: 8 }}>
            <div>
              <div style={{ fontSize: 13, fontWeight: 500, color: "#1f1f1f" }}>{r.month}</div>
              <div style={{ fontSize: 11, color: "#909090", marginTop: 2 }}>{r.currency || "EUR"}</div>
            </div>
            <Editable
              field={{ id: `ing_rev_${r.id}`, label: `Ingreso ${r.month}`, value: r.estimated_revenue, type: "currency", table: "revenue", column: "estimated_revenue", rowId: r.id }}
              onSelect={onFieldSelect} selectedField={selectedField}
            >
              <div style={{ fontSize: 15, fontWeight: 700, color: "#1f1f1f" }}>{r.estimated_revenue?.toFixed(2).replace(".", ",")} €</div>
            </Editable>
          </div>
        ))}
      </div>

      {/* Monetization sources */}
      <div style={{ padding: "20px 14px 0" }}>
        <div style={{ fontSize: 15, fontWeight: 700, color: "#1f1f1f", marginBottom: 10 }}>Tus formas de ganar dinero</div>
        {[
          { icon: "💰", name: "Ingresos por anuncios", desc: "Google AdSense" },
          { icon: "⭐", name: "Miembros del canal", desc: "Suscripciones de pago" },
          { icon: "💬", name: "Super Chat y Super Stickers", desc: "Durante emisiones en directo" },
        ].map((source, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 0", borderBottom: i < 2 ? "1px solid #f0f0f0" : "none" }}>
            <div style={{ width: 36, height: 36, borderRadius: 8, background: "#f5f5f5", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>
              {source.icon}
            </div>
            <div>
              <div style={{ fontSize: 13, fontWeight: 600, color: "#1f1f1f" }}>{source.name}</div>
              <div style={{ fontSize: 11, color: "#909090" }}>{source.desc}</div>
            </div>
            <span style={{ marginLeft: "auto", fontSize: 12, color: "#34a853", fontWeight: 600 }}>Activo</span>
          </div>
        ))}
      </div>
    </div>
  );
}
