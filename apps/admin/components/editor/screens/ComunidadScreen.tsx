"use client";

import type { EditableField, AppData } from "@/app/page";
import { Editable } from "../PhonePreview";

type Props = {
  data: AppData;
  onFieldSelect: (field: EditableField) => void;
  selectedField: EditableField | null;
};

const cardShadow: React.CSSProperties = {
  background: "#fff", borderRadius: 12,
  boxShadow: "0 1px 6px rgba(0,0,0,0.08)",
};

const actionIconStyle: React.CSSProperties = {
  width: 15, height: 15, cursor: "pointer", opacity: 0.6,
};

export function ComunidadScreen({ data, onFieldSelect, selectedField }: Props) {
  const { comments, stats: st } = data;

  return (
    <div style={{ paddingBottom: 20, background: "#fff" }}>

      {/* Metric cards row */}
      <div style={{ display: "flex", gap: 8, padding: "10px 13px" }}>
        <Editable
          field={{ id: "com_comments_count", label: "Comentarios 28d", value: 176, type: "number", table: "dashboard_stats", column: "comments_count", rowId: st?.id ?? "" }}
          onSelect={onFieldSelect} selectedField={selectedField}
          style={{ flex: 1 }}
        >
          <div style={{ ...cardShadow, padding: 14 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
              <span style={{ fontSize: 12, color: "#717171" }}>Comentarios</span>
              <span style={{ fontSize: 12, color: "#9a9a9a" }}>28 d</span>
            </div>
            <div style={{ fontSize: 18, fontWeight: 700, color: "#1e1e1e", marginTop: 6 }}>176</div>
          </div>
        </Editable>
        <Editable
          field={{ id: "com_audience", label: "Audiencia mensual 28d", value: 1600, type: "number", table: "dashboard_stats", column: "views", rowId: st?.id ?? "" }}
          onSelect={onFieldSelect} selectedField={selectedField}
          style={{ flex: 1 }}
        >
          <div style={{ ...cardShadow, padding: 14 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
              <span style={{ fontSize: 12, color: "#717171" }}>Audiencia mensual</span>
              <span style={{ fontSize: 12, color: "#9a9a9a" }}>28 d</span>
            </div>
            <div style={{ fontSize: 18, fontWeight: 700, color: "#1e1e1e", marginTop: 6 }}>1,6K</div>
          </div>
        </Editable>
      </div>

      {/* Comentarios section header */}
      <div style={{
        display: "flex", justifyContent: "space-between", alignItems: "center",
        padding: "24px 16px 14px",
      }}>
        <span style={{ fontSize: 17, fontWeight: 700, color: "#1e1e1e" }}>Comentarios</span>
        <div style={{
          border: "1px solid #e0e0e0", borderRadius: 18,
          padding: "7px 14px", cursor: "pointer",
        }}>
          <span style={{ fontSize: 12, fontWeight: 600, color: "#2d2d2d" }}>Ver todo</span>
        </div>
      </div>

      {/* Comments card (all 3 comments inside one shadow box) */}
      <div style={{ ...cardShadow, margin: "0 13px", overflow: "hidden" }}>

        {/* Comment 1 */}
        <div style={{ padding: "14px 16px" }}>
          {/* Video title + thumbnail */}
          <div style={{ display: "flex", alignItems: "flex-start", marginBottom: 12 }}>
            <div style={{ flex: 1, fontSize: 14, fontWeight: 600, color: "#2b2b2b", lineHeight: "20px", marginRight: 12 }}>
              ASI GANE 200.000$ en 30 DIAS{"\n"}TRADEANDO MEMECOINS
            </div>
            <div style={{
              width: 79, height: 44, borderRadius: 6, background: "#d0d0d0", flexShrink: 0,
              overflow: "hidden",
            }}>
              <div style={{ width: "100%", height: "100%", background: "linear-gradient(135deg, #c0c0c0, #e0e0e0)" }} />
            </div>
          </div>
          {/* Author + comment */}
          <div style={{ display: "flex", alignItems: "flex-start" }}>
            <div style={{
              width: 40, height: 40, borderRadius: 20, background: "#d0d0d0", flexShrink: 0,
            }} />
            <div style={{ flex: 1, marginLeft: 10 }}>
              <div style={{ display: "flex", alignItems: "center" }}>
                <span style={{ fontSize: 11, color: "#787878" }}>@arielhumberto3813</span>
                <span style={{ fontSize: 11, color: "#747474" }}> &middot; hace 1 mes</span>
                <div style={{ flex: 1 }} />
                <span style={{ fontSize: 14, color: "#888", cursor: "pointer" }}>&#8942;</span>
              </div>
              <div style={{ fontSize: 13, color: "#313131", lineHeight: "19px", marginTop: 4 }}>
                Comp me comunico con tigo tenemos in proyecto para Lanzar algo different que le dara otra vista a las meme
              </div>
            </div>
          </div>
          {/* Action icons */}
          <div style={{ display: "flex", alignItems: "center", gap: 20, marginTop: 12, paddingLeft: 50 }}>
            <svg style={actionIconStyle} viewBox="0 0 15 15" fill="none"><path d="M4.5 6.5V13H2.5C2.22 13 2 12.78 2 12.5V7.5C2 7.22 2.22 7 2.5 7H4.5V6.5ZM5.5 6.5L8 1.5C8.83 1.5 9.5 2.17 9.5 3V5.5H12.5C12.78 5.5 13 5.72 13 6V12.5C13 12.78 12.78 13 12.5 13H5.5V6.5Z" fill="#555" /></svg>
            <svg style={actionIconStyle} viewBox="0 0 15 15" fill="none"><path d="M10.5 8.5V2H12.5C12.78 2 13 2.22 13 2.5V7.5C13 7.78 12.78 8 12.5 8H10.5V8.5ZM9.5 8.5L7 13.5C6.17 13.5 5.5 12.83 5.5 12V9.5H2.5C2.22 9.5 2 9.28 2 9V2.5C2 2.22 2.22 2 2.5 2H9.5V8.5Z" fill="#555" /></svg>
            <svg style={actionIconStyle} viewBox="0 0 15 15" fill="none"><path d="M2 2h11v8H4l-2 2V2z" stroke="#555" strokeWidth="1.2" fill="none" /></svg>
            <svg style={actionIconStyle} viewBox="0 0 15 15" fill="none"><path d="M7.5 13L1.5 7.5C0.5 6.5 0.5 4.5 1.5 3.5C2.5 2.5 4.5 2.5 5.5 3.5L7.5 5.5L9.5 3.5C10.5 2.5 12.5 2.5 13.5 3.5C14.5 4.5 14.5 6.5 13.5 7.5L7.5 13Z" stroke="#555" strokeWidth="1.2" fill="none" /></svg>
          </div>
        </div>

        <div style={{ height: 0.5, background: "#e0e0e0", margin: "0 16px" }} />

        {/* Comment 2 */}
        <div style={{ padding: "14px 16px" }}>
          {/* Video title + thumbnail */}
          <div style={{ display: "flex", alignItems: "flex-start", marginBottom: 12 }}>
            <div style={{ flex: 1, fontSize: 14, fontWeight: 600, color: "#2b2b2b", lineHeight: "20px", marginRight: 12 }}>
              Asi fue el lanzamiento de $AWI I Como crear un proyecto blockchain desde cero...
            </div>
            <div style={{
              width: 79, height: 44, borderRadius: 6, background: "#d0d0d0", flexShrink: 0,
              overflow: "hidden",
            }}>
              <div style={{ width: "100%", height: "100%", background: "linear-gradient(135deg, #b8b8b8, #d8d8d8)" }} />
            </div>
          </div>
          {/* Author + comment */}
          <div style={{ display: "flex", alignItems: "flex-start" }}>
            <div style={{
              width: 40, height: 40, borderRadius: 20, background: "#c8c8c8", flexShrink: 0,
            }} />
            <div style={{ flex: 1, marginLeft: 10 }}>
              <div style={{ display: "flex", alignItems: "center" }}>
                <span style={{ fontSize: 11, color: "#787878" }}>@felixalejb</span>
                {/* YT badge */}
                <div style={{
                  width: 16, height: 16, borderRadius: 8, background: "#FF0000",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  marginLeft: 2, marginRight: 2,
                }}>
                  <span style={{ color: "#fff", fontSize: 7, fontWeight: 700 }}>&#9654;</span>
                </div>
                <span style={{ fontSize: 11, color: "#747474" }}> &middot; hace 1 mes</span>
                <div style={{ flex: 1 }} />
                <span style={{ fontSize: 14, color: "#888", cursor: "pointer" }}>&#8942;</span>
              </div>
              <div style={{ fontSize: 13, color: "#313131", lineHeight: "19px", marginTop: 4 }}>
                Se ve muy sano, ojala siga asi y se rompan muchos maximos.
              </div>
            </div>
          </div>
          {/* Action icons with like count "1" */}
          <div style={{ display: "flex", alignItems: "center", gap: 20, marginTop: 12, paddingLeft: 50 }}>
            <svg style={actionIconStyle} viewBox="0 0 15 15" fill="none"><path d="M4.5 6.5V13H2.5C2.22 13 2 12.78 2 12.5V7.5C2 7.22 2.22 7 2.5 7H4.5V6.5ZM5.5 6.5L8 1.5C8.83 1.5 9.5 2.17 9.5 3V5.5H12.5C12.78 5.5 13 5.72 13 6V12.5C13 12.78 12.78 13 12.5 13H5.5V6.5Z" fill="#555" /></svg>
            <span style={{ fontSize: 12, color: "#1f1f1f", marginLeft: -14 }}>1</span>
            <svg style={actionIconStyle} viewBox="0 0 15 15" fill="none"><path d="M10.5 8.5V2H12.5C12.78 2 13 2.22 13 2.5V7.5C13 7.78 12.78 8 12.5 8H10.5V8.5ZM9.5 8.5L7 13.5C6.17 13.5 5.5 12.83 5.5 12V9.5H2.5C2.22 9.5 2 9.28 2 9V2.5C2 2.22 2.22 2 2.5 2H9.5V8.5Z" fill="#555" /></svg>
            <svg style={actionIconStyle} viewBox="0 0 15 15" fill="none"><path d="M2 2h11v8H4l-2 2V2z" stroke="#555" strokeWidth="1.2" fill="none" /></svg>
            <svg style={actionIconStyle} viewBox="0 0 15 15" fill="none"><path d="M7.5 13L1.5 7.5C0.5 6.5 0.5 4.5 1.5 3.5C2.5 2.5 4.5 2.5 5.5 3.5L7.5 5.5L9.5 3.5C10.5 2.5 12.5 2.5 13.5 3.5C14.5 4.5 14.5 6.5 13.5 7.5L7.5 13Z" stroke="#555" strokeWidth="1.2" fill="none" /></svg>
          </div>
        </div>

        <div style={{ height: 0.5, background: "#e0e0e0", margin: "0 16px" }} />

        {/* Comment 3 */}
        <div style={{ padding: "14px 16px" }}>
          {/* Author + comment (no video title for this one) */}
          <div style={{ display: "flex", alignItems: "flex-start" }}>
            {/* Letter avatar "S" */}
            <div style={{
              width: 40, height: 40, borderRadius: 20, background: "#c4d9e9",
              display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
            }}>
              <span style={{ fontSize: 22, fontWeight: 600, color: "#fff" }}>S</span>
            </div>
            <div style={{ flex: 1, marginLeft: 10 }}>
              <div style={{ display: "flex", alignItems: "center" }}>
                <span style={{ fontSize: 11, color: "#787878" }}>@SebastianLopez-qt8kq</span>
                <span style={{ fontSize: 11, color: "#747474" }}> &middot; hace 1 mes</span>
                <div style={{ flex: 1 }} />
                <span style={{ fontSize: 14, color: "#888", cursor: "pointer" }}>&#8942;</span>
              </div>
              <div style={{ fontSize: 13, color: "#313131", lineHeight: "19px", marginTop: 4 }}>
                Brutal el video de Awi !! Felicitaciones
              </div>
            </div>
          </div>
          {/* Action icons */}
          <div style={{ display: "flex", alignItems: "center", gap: 20, marginTop: 12, paddingLeft: 50 }}>
            <svg style={actionIconStyle} viewBox="0 0 15 15" fill="none"><path d="M4.5 6.5V13H2.5C2.22 13 2 12.78 2 12.5V7.5C2 7.22 2.22 7 2.5 7H4.5V6.5ZM5.5 6.5L8 1.5C8.83 1.5 9.5 2.17 9.5 3V5.5H12.5C12.78 5.5 13 5.72 13 6V12.5C13 12.78 12.78 13 12.5 13H5.5V6.5Z" fill="#555" /></svg>
            <svg style={actionIconStyle} viewBox="0 0 15 15" fill="none"><path d="M10.5 8.5V2H12.5C12.78 2 13 2.22 13 2.5V7.5C13 7.78 12.78 8 12.5 8H10.5V8.5ZM9.5 8.5L7 13.5C6.17 13.5 5.5 12.83 5.5 12V9.5H2.5C2.22 9.5 2 9.28 2 9V2.5C2 2.22 2.22 2 2.5 2H9.5V8.5Z" fill="#555" /></svg>
            <svg style={actionIconStyle} viewBox="0 0 15 15" fill="none"><path d="M2 2h11v8H4l-2 2V2z" stroke="#555" strokeWidth="1.2" fill="none" /></svg>
            <svg style={actionIconStyle} viewBox="0 0 15 15" fill="none"><path d="M7.5 13L1.5 7.5C0.5 6.5 0.5 4.5 1.5 3.5C2.5 2.5 4.5 2.5 5.5 3.5L7.5 5.5L9.5 3.5C10.5 2.5 12.5 2.5 13.5 3.5C14.5 4.5 14.5 6.5 13.5 7.5L7.5 13Z" stroke="#555" strokeWidth="1.2" fill="none" /></svg>
          </div>
        </div>
      </div>

      {/* Publicaciones de usuarios section */}
      <div style={{
        display: "flex", justifyContent: "space-between", alignItems: "center",
        padding: "20px 16px 14px",
      }}>
        <span style={{ fontSize: 17, fontWeight: 700, color: "#1e1e1e" }}>Publicaciones de usuarios</span>
        <div style={{
          border: "1px solid #e0e0e0", borderRadius: 18,
          padding: "7px 14px", cursor: "pointer",
        }}>
          <span style={{ fontSize: 12, fontWeight: 600, color: "#2d2d2d" }}>Ver todo</span>
        </div>
      </div>

      <div style={{ ...cardShadow, margin: "0 13px", overflow: "hidden" }}>
        <div style={{
          background: "#f5f5f5", margin: 14, borderRadius: 8,
          padding: 14, textAlign: "center",
        }}>
          <span style={{ fontSize: 13, color: "#797979" }}>Tu Comunidad esta desactivada</span>
        </div>
      </div>

      {/* Destacados de la comunidad section */}
      <div style={{
        display: "flex", justifyContent: "space-between", alignItems: "center",
        padding: "24px 16px 14px",
      }}>
        <span style={{ fontSize: 17, fontWeight: 700, color: "#1e1e1e" }}>Destacados de la comunidad</span>
        <div style={{
          border: "1px solid #e0e0e0", borderRadius: 18,
          padding: "7px 14px", cursor: "pointer",
        }}>
          <span style={{ fontSize: 12, fontWeight: 600, color: "#2d2d2d" }}>Ver todo</span>
        </div>
      </div>

      <div style={{ fontSize: 12, color: "#757575", lineHeight: "17px", padding: "0 16px", marginBottom: 16 }}>
        Actividad semanal destacada de los miembros de tu audiencia que mas han interactuado, incluidos los principales comentadores
      </div>

      {/* Destacados cards (horizontal scroll) */}
      <div style={{ display: "flex", gap: 10, padding: "6px 13px 10px", overflowX: "auto" }}>
        {/* Thiago */}
        <div style={{
          ...cardShadow, width: 155, flexShrink: 0, padding: "16px 10px",
          display: "flex", flexDirection: "column", alignItems: "center",
        }}>
          <div style={{
            width: 73, height: 73, borderRadius: 37, background: "#fce3cf",
            display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 8,
          }}>
            <span style={{ fontSize: 30, fontWeight: 600, color: "#e8915a" }}>T</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 2 }}>
            <span style={{ fontSize: 13, fontWeight: 600, color: "#242424" }}>Thiago Velgua</span>
            <div style={{
              width: 14, height: 14, borderRadius: 7, background: "#FF0000",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <span style={{ color: "#fff", fontSize: 6, fontWeight: 700 }}>&#9654;</span>
            </div>
          </div>
          <span style={{ fontSize: 12, color: "#757575", marginTop: 2 }}>@thiagovelgua121</span>
          <div style={{ display: "flex", alignItems: "center", gap: 4, marginTop: 4 }}>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M1 1h10v7H3.5L1 10V1z" stroke="#262626" strokeWidth="1.2" fill="none" /></svg>
            <span style={{ fontSize: 13, fontWeight: 700, color: "#262626" }}>43</span>
          </div>
        </div>

        {/* Felix */}
        <div style={{
          ...cardShadow, width: 155, flexShrink: 0, padding: "16px 10px",
          display: "flex", flexDirection: "column", alignItems: "center",
        }}>
          <div style={{
            width: 73, height: 73, borderRadius: 37, background: "#d0d0d0",
            overflow: "hidden", marginBottom: 8,
          }}>
            <div style={{ width: "100%", height: "100%", background: "linear-gradient(135deg, #c0c0c0, #e0e0e0)" }} />
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 2 }}>
            <span style={{ fontSize: 13, fontWeight: 600, color: "#242424", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>Felix Alejand...</span>
            <div style={{
              width: 14, height: 14, borderRadius: 7, background: "#FF0000",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <span style={{ color: "#fff", fontSize: 6, fontWeight: 700 }}>&#9654;</span>
            </div>
          </div>
          <span style={{ fontSize: 12, color: "#757575", marginTop: 2 }}>@felixalejb</span>
          <div style={{ display: "flex", alignItems: "center", gap: 4, marginTop: 4 }}>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M1 1h10v7H3.5L1 10V1z" stroke="#262626" strokeWidth="1.2" fill="none" /></svg>
            <span style={{ fontSize: 13, fontWeight: 700, color: "#262626" }}>39</span>
          </div>
        </div>

        {/* Flork */}
        <div style={{
          ...cardShadow, width: 155, flexShrink: 0, padding: "16px 10px",
          display: "flex", flexDirection: "column", alignItems: "center",
        }}>
          <div style={{
            width: 73, height: 73, borderRadius: 37, background: "#d0d0d0",
            overflow: "hidden", marginBottom: 8,
          }}>
            <div style={{ width: "100%", height: "100%", background: "linear-gradient(135deg, #b8b8b8, #d8d8d8)" }} />
          </div>
          <span style={{ fontSize: 13, fontWeight: 600, color: "#242424" }}>Flork_Swea</span>
          <span style={{ fontSize: 12, color: "#757575", marginTop: 2 }}>@LiFall</span>
          <div style={{ display: "flex", alignItems: "center", gap: 4, marginTop: 4 }}>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M1 1h10v7H3.5L1 10V1z" stroke="#262626" strokeWidth="1.2" fill="none" /></svg>
            <span style={{ fontSize: 13, fontWeight: 700, color: "#262626" }}>11</span>
          </div>
        </div>
      </div>

      {/* Moderacion section */}
      <div style={{ fontSize: 17, fontWeight: 700, color: "#1d1d1d", padding: "28px 16px 14px" }}>
        Moderacion
      </div>

      <div style={{ ...cardShadow, margin: "0 13px", overflow: "hidden", paddingTop: 4, paddingBottom: 4 }}>
        <div style={{ display: "flex", alignItems: "center", padding: "14px 16px", cursor: "pointer" }}>
          <svg width="22" height="22" viewBox="0 0 22 22" fill="none" style={{ marginRight: 14, flexShrink: 0 }}>
            <rect x="2" y="4" width="18" height="2" rx="1" fill="#333" />
            <rect x="2" y="10" width="18" height="2" rx="1" fill="#333" />
            <rect x="2" y="16" width="18" height="2" rx="1" fill="#333" />
            <circle cx="7" cy="5" r="2.5" fill="#fff" stroke="#333" strokeWidth="1.5" />
            <circle cx="15" cy="11" r="2.5" fill="#fff" stroke="#333" strokeWidth="1.5" />
            <circle cx="10" cy="17" r="2.5" fill="#fff" stroke="#333" strokeWidth="1.5" />
          </svg>
          <span style={{ flex: 1, fontSize: 15, fontWeight: 600, color: "#262626", lineHeight: "21px" }}>Controles de contenido</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", padding: "14px 16px", cursor: "pointer" }}>
          <svg width="22" height="22" viewBox="0 0 22 22" fill="none" style={{ marginRight: 14, flexShrink: 0 }}>
            <circle cx="11" cy="11" r="9" stroke="#333" strokeWidth="1.5" fill="none" />
            <text x="11" y="16" textAnchor="middle" fontSize="13" fontWeight="600" fill="#333">i</text>
          </svg>
          <span style={{ flex: 1, fontSize: 15, fontWeight: 600, color: "#262626", lineHeight: "21px" }}>Informacion sobre la configuracion de los comentarios</span>
        </div>
      </div>

      <div style={{ height: 40 }} />
    </div>
  );
}
