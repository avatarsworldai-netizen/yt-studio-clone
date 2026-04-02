"use client";

const TABS = [
  { label: "Panel", icon: "⊞" },
  { label: "Contenido", icon: "▶" },
  { label: "Estadísticas", icon: "📊" },
  { label: "Comunidad", icon: "👥" },
  { label: "Ingresos", icon: "$" },
];

export function TabBar({ activeTab, onTabChange }: { activeTab: number; onTabChange: (i: number) => void }) {
  return (
    <div style={{
      position: "absolute", bottom: 0, left: 0, right: 0,
      height: 70, background: "#fff", borderTop: "1px solid #e5e5e5",
      display: "flex", alignItems: "center", justifyContent: "space-around",
      paddingBottom: 10,
    }}>
      {TABS.map((tab, i) => (
        <button
          key={tab.label}
          onClick={() => onTabChange(i)}
          style={{
            display: "flex", flexDirection: "column", alignItems: "center", gap: 2,
            background: "none", border: "none", cursor: "pointer", padding: 4,
            opacity: activeTab === i ? 1 : 0.5,
          }}
        >
          <span style={{ fontSize: 18 }}>{tab.icon}</span>
          <span style={{ fontSize: 9, color: "#363636", fontWeight: activeTab === i ? 600 : 400 }}>{tab.label}</span>
        </button>
      ))}
    </div>
  );
}
