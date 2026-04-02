"use client";

import type { EditableField, AppData } from "@/app/page";
import { PanelScreen } from "./screens/PanelScreen";
import { ContenidoScreen } from "./screens/ContenidoScreen";
import { EstadisticasScreen } from "./screens/EstadisticasScreen";
import { ComunidadScreen } from "./screens/ComunidadScreen";
import { IngresosScreen } from "./screens/IngresosScreen";

type Props = {
  activeTab: number;
  data: AppData;
  onFieldSelect: (field: EditableField) => void;
  selectedField: EditableField | null;
};

export function PhonePreview({ activeTab, data, onFieldSelect, selectedField }: Props) {
  // Header - YT Studio logo
  const header = (
    <div style={{
      display: "flex", alignItems: "center", justifyContent: "space-between",
      padding: "12px 16px", background: "#fff",
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
        <div style={{ width: 24, height: 16, background: "#FF0000", borderRadius: 4, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <span style={{ color: "#fff", fontSize: 8 }}>▶</span>
        </div>
        <span style={{ fontSize: 16, fontWeight: 700, color: "#292929" }}>Studio</span>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
        <span style={{ fontSize: 20, color: "#333" }}>⊕</span>
        <span style={{ fontSize: 18, color: "#333" }}>🔔</span>
        <div style={{ width: 28, height: 28, borderRadius: 14, background: "#ddd" }} />
      </div>
    </div>
  );

  return (
    <div style={{ background: "#fff", minHeight: "100%" }}>
      {header}
      {activeTab === 0 && <PanelScreen data={data} onFieldSelect={onFieldSelect} selectedField={selectedField} />}
      {activeTab === 1 && <ContenidoScreen data={data} onFieldSelect={onFieldSelect} selectedField={selectedField} />}
      {activeTab === 2 && <EstadisticasScreen data={data} onFieldSelect={onFieldSelect} selectedField={selectedField} />}
      {activeTab === 3 && <ComunidadScreen data={data} onFieldSelect={onFieldSelect} selectedField={selectedField} />}
      {activeTab === 4 && <IngresosScreen data={data} onFieldSelect={onFieldSelect} selectedField={selectedField} />}
    </div>
  );
}

// Reusable editable wrapper
export function Editable({
  field,
  onSelect,
  selectedField,
  children,
  style,
}: {
  field: EditableField;
  onSelect: (f: EditableField) => void;
  selectedField: EditableField | null;
  children: React.ReactNode;
  style?: React.CSSProperties;
}) {
  const isSelected = selectedField?.id === field.id;
  return (
    <div
      className="editable"
      onClick={(e) => { e.stopPropagation(); onSelect(field); }}
      style={{
        outline: isSelected ? "2px solid #3b82f6" : undefined,
        outlineOffset: 2,
        background: isSelected ? "rgba(59,130,246,0.08)" : undefined,
        ...style,
      }}
    >
      {children}
    </div>
  );
}
