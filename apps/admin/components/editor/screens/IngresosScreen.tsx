"use client";

import type { EditableField, AppData } from "@/app/page";
import { Editable } from "../PhonePreview";

type Props = {
  data: AppData;
  onFieldSelect: (field: EditableField) => void;
  selectedField: EditableField | null;
};

const RECURSOS = [
  { label: "Asistencia para Creadores de YouTube", icon: "headset" },
  { label: "Copyright Match Tool", icon: "copyright" },
  { label: "Recaudacion de fondos con Giving", icon: "giving" },
  { label: "Pantallas finales de video", icon: "screens" },
];

const PROMO_CARDS = [
  {
    title: "Miembros del canal",
    desc: "Crea un club de fans que paguen una tarifa mensual para acceder a ventajas exclusivas",
    color: "#e8f5e9",
  },
  {
    title: "Supers",
    desc: "Interactua con los fans que te demuestran su apoyo a traves de compras unicas interactivas",
    color: "#e3f2fd",
  },
  {
    title: "Shopping",
    desc: "Comparte los productos que te encantan y ayuda a los usuarios a comprar",
    color: "#fff3e0",
  },
];

function ResourceIcon({ type }: { type: string }) {
  const s: React.CSSProperties = { width: 22, height: 22, marginRight: 14, flexShrink: 0 };
  switch (type) {
    case "headset":
      return (
        <svg style={s} viewBox="0 0 22 22" fill="none">
          <path d="M3 12V11a8 8 0 1116 0v1" stroke="#333" strokeWidth="1.5" />
          <rect x="1" y="12" width="4" height="6" rx="1" fill="#333" />
          <rect x="17" y="12" width="4" height="6" rx="1" fill="#333" />
        </svg>
      );
    case "copyright":
      return (
        <svg style={s} viewBox="0 0 22 22" fill="none">
          <circle cx="11" cy="11" r="9" stroke="#333" strokeWidth="1.5" />
          <path d="M13.5 8.5A3.5 3.5 0 1013.5 13.5" stroke="#333" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      );
    case "giving":
      return (
        <svg style={s} viewBox="0 0 22 22" fill="none">
          <path d="M11 19L3 11.5C1.5 10 1.5 7 3 5.5C4.5 4 7 4 8.5 5.5L11 8L13.5 5.5C15 4 17.5 4 19 5.5C20.5 7 20.5 10 19 11.5L11 19Z" stroke="#333" strokeWidth="1.5" fill="none" />
        </svg>
      );
    case "screens":
      return (
        <svg style={s} viewBox="0 0 22 22" fill="none">
          <rect x="2" y="3" width="18" height="12" rx="2" stroke="#333" strokeWidth="1.5" />
          <path d="M8 19h6M11 15v4" stroke="#333" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      );
    default:
      return <div style={{ ...s, background: "#eee", borderRadius: 4 }} />;
  }
}

export function IngresosScreen({ data, onFieldSelect, selectedField }: Props) {
  return (
    <div style={{ paddingBottom: 20, background: "#fff" }}>

      {/* Title */}
      <div style={{ fontSize: 27, fontWeight: 700, color: "#1a1a1a", padding: "12px 16px 20px" }}>
        Ingresos
      </div>

      {/* Tus formas de ganar dinero */}
      <div style={{ fontSize: 17, fontWeight: 700, color: "#222222", padding: "0 16px", marginBottom: 12 }}>
        Tus formas de ganar dinero
      </div>

      {/* Anuncios de la pagina de visualizacion */}
      <div style={{
        display: "flex", alignItems: "center", padding: "14px 16px", cursor: "pointer",
      }}>
        <div style={{
          width: 34, height: 34, borderRadius: 6, background: "#f0f0f0",
          display: "flex", alignItems: "center", justifyContent: "center",
          marginRight: 14, flexShrink: 0,
        }}>
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <rect x="1" y="3" width="18" height="12" rx="2" stroke="#333" strokeWidth="1.3" />
            <path d="M8 7v6l5-3-5-3z" fill="#333" />
          </svg>
        </div>
        <span style={{ flex: 1, fontSize: 15, fontWeight: 600, color: "#2d2d2d" }}>Anuncios de la pagina de visualizacion</span>
        <svg width="9" height="14" viewBox="0 0 9 14" fill="none">
          <path d="M1.5 1l6 6-6 6" stroke="#888" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>

      {/* Anuncios del feed de Shorts */}
      <div style={{
        display: "flex", alignItems: "center", padding: "14px 16px", cursor: "pointer",
      }}>
        <div style={{
          width: 33, height: 33, borderRadius: 6, background: "#f0f0f0",
          display: "flex", alignItems: "center", justifyContent: "center",
          marginRight: 14, flexShrink: 0,
        }}>
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <rect x="3" y="1" width="12" height="16" rx="2" stroke="#333" strokeWidth="1.3" />
            <path d="M7 7v4l4-2-4-2z" fill="#333" />
          </svg>
        </div>
        <span style={{ flex: 1, fontSize: 15, fontWeight: 600, color: "#2d2d2d" }}>Anuncios del feed de Shorts</span>
        <svg width="9" height="14" viewBox="0 0 9 14" fill="none">
          <path d="M1.5 1l6 6-6 6" stroke="#888" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>

      {/* More button */}
      <div style={{
        margin: "10px 16px 28px",
        border: "1px solid #e0e0e0", borderRadius: 8,
        padding: 12, textAlign: "center", cursor: "pointer",
      }}>
        <span style={{ fontSize: 14, fontWeight: 600, color: "#272727" }}>Mas formas de obtener ingresos</span>
      </div>

      {/* Recursos y herramientas para creadores */}
      <div style={{ fontSize: 17, fontWeight: 700, color: "#222222", padding: "0 16px", marginBottom: 12 }}>
        Recursos y herramientas para creadores
      </div>

      {RECURSOS.map((item, i) => (
        <div key={i} style={{
          display: "flex", alignItems: "center", padding: "14px 16px", cursor: "pointer",
        }}>
          <ResourceIcon type={item.icon} />
          <span style={{ flex: 1, fontSize: 15, fontWeight: 600, color: "#2d2d2d" }}>{item.label}</span>
          <svg width="9" height="14" viewBox="0 0 9 14" fill="none">
            <path d="M1.5 1l6 6-6 6" stroke="#888" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      ))}

      {/* Mas formas de obtener ingresos (carousel) */}
      <div style={{ fontSize: 17, fontWeight: 700, color: "#222222", padding: "30px 16px 12px" }}>
        Mas formas de obtener ingresos
      </div>

      <div style={{ display: "flex", gap: 12, padding: "0 16px", overflowX: "auto" }}>
        {PROMO_CARDS.map((card, i) => (
          <div key={i} style={{
            width: 160, flexShrink: 0, display: "flex", flexDirection: "column",
            alignItems: "center", paddingTop: 12,
          }}>
            {/* Image placeholder */}
            <div style={{
              width: 86, height: 88, borderRadius: 12, background: card.color,
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
                {i === 0 && (
                  <>
                    <circle cx="20" cy="14" r="6" stroke="#666" strokeWidth="1.5" fill="none" />
                    <path d="M8 34c0-6.6 5.4-12 12-12s12 5.4 12 12" stroke="#666" strokeWidth="1.5" fill="none" />
                    <path d="M20 22v4M17 24h6" stroke="#666" strokeWidth="1.5" strokeLinecap="round" />
                  </>
                )}
                {i === 1 && (
                  <>
                    <path d="M20 6l4 8h-8l4-8z" fill="#f0c14b" stroke="#666" strokeWidth="1" />
                    <circle cx="20" cy="24" r="8" stroke="#666" strokeWidth="1.5" fill="none" />
                    <path d="M17 24l2 2 4-4" stroke="#666" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </>
                )}
                {i === 2 && (
                  <>
                    <rect x="8" y="10" width="24" height="18" rx="3" stroke="#666" strokeWidth="1.5" fill="none" />
                    <path d="M12 22h4M16 18h4M24 22h-4" stroke="#666" strokeWidth="1.5" strokeLinecap="round" />
                  </>
                )}
              </svg>
            </div>
            <span style={{
              fontSize: 14, fontWeight: 600, color: "#292929",
              marginTop: 10, textAlign: "center",
            }}>{card.title}</span>
            <span style={{
              fontSize: 12, color: "#737373", marginTop: 4,
              textAlign: "center", lineHeight: "17px", padding: "0 4px",
            }}>{card.desc}</span>
          </div>
        ))}
      </div>

      {/* Dot indicators */}
      <div style={{ display: "flex", justifyContent: "center", gap: 8, marginTop: 16 }}>
        <div style={{ width: 8, height: 8, borderRadius: 4, background: "#333" }} />
        <div style={{ width: 8, height: 8, borderRadius: 4, background: "#d5d5d5" }} />
      </div>

      <div style={{ height: 40 }} />
    </div>
  );
}
