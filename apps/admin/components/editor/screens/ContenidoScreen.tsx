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

// Hardcoded data matching the mobile app's Figma design
const VIDEOS_HARDCODED = [
  { id: "v1", title: "Tutorial BRIDGE FLORK...", views: "1,9K", likes: "91", dur: "17:43", money: true },
  { id: "v2", title: "Bridge de FLORK a DUM...", views: "2,2K", likes: "65", dur: "17:13", copyright: true },
];

const SHORTS_HARDCODED = [
  { id: "s1", title: "27 de diciemb...", views: "4,3K", likes: "392" },
  { id: "s2", title: "SCAM The sug...", views: "339", likes: "" },
  { id: "s3", title: "Trump maga...", views: "841", likes: "" },
  { id: "s4", title: "$PENG...", views: "1", likes: "" },
];

const LIVES_HARDCODED = [
  { id: "l1", title: "Creando tokens en Dum...", views: "2K", likes: "127", dur: "1:27:29" },
  { id: "l2", title: "SE VIENEN COSITAS!G...", views: "992", likes: "", dur: "1:16:37" },
];

const CARD_W = 192;
const SHORT_W = 112;

export function ContenidoScreen({ data, onFieldSelect, selectedField }: Props) {
  const { videos } = data;

  // Use data from props when available, fallback to hardcoded
  const videoItems = videos.filter((v: any) => v.video_type === "video" || !v.video_type);
  const shortItems = videos.filter((v: any) => v.video_type === "short");
  const liveItems = videos.filter((v: any) => v.video_type === "live");

  return (
    <div style={{ paddingBottom: 20, background: "#fff" }}>
      {/* Filter chips row */}
      <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 12px", overflowX: "auto" }}>
        {/* Filter icon button */}
        <div style={{
          width: 40, height: 32, borderRadius: 8, background: "#f2f2f2",
          display: "flex", alignItems: "center", justifyContent: "center",
          flexShrink: 0,
        }}>
          <svg width="18" height="14" viewBox="0 0 18 14" fill="none">
            <path d="M0 0h18v2H0V0zm3 6h12v2H3V6zm5 6h4v2H8v-2z" fill="#555" />
          </svg>
        </div>
        {["Tipo", "Visibilidad", "Visualizaciones", "M"].map((label) => (
          <div key={label} style={{
            display: "flex", alignItems: "center", gap: 4,
            padding: "8px 12px", borderRadius: 8, background: "#f2f2f2",
            flexShrink: 0, cursor: "pointer",
          }}>
            <span style={{ fontSize: 14, fontWeight: 600, color: "#252525" }}>{label}</span>
            <svg width="10" height="6" viewBox="0 0 10 6" fill="none">
              <path d="M1 1l4 4 4-4" stroke="#555" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        ))}
      </div>

      {/* Videos Section */}
      <SectionHead title="Videos" />
      <div style={{ display: "flex", gap: 10, padding: "0 12px", overflowX: "auto" }}>
        {(videoItems.length > 0 ? videoItems : VIDEOS_HARDCODED).map((item: any, idx: number) => {
          const isFromData = videoItems.length > 0;
          const title = isFromData ? item.title : item.title;
          const views = isFromData ? fmt(item.view_count) : item.views;
          const likes = isFromData ? String(item.like_count ?? "") : item.likes;
          const dur = isFromData ? (item.duration || "17:43") : item.dur;
          const thumbUrl = isFromData ? item.thumbnail_url : null;

          return (
            <div key={item.id} style={{ width: CARD_W, flexShrink: 0 }}>
              {/* Thumbnail */}
              <Editable
                field={{ id: `cont_thumb_${item.id}`, label: `Thumbnail - ${title}`, value: thumbUrl || "", type: "image", table: "videos", column: "thumbnail_url", rowId: item.id }}
                onSelect={onFieldSelect} selectedField={selectedField}
              >
                <div style={{
                  width: CARD_W, height: Math.round(CARD_W * 9 / 16), borderRadius: 12,
                  overflow: "hidden", background: "#e8e8e8", position: "relative",
                }}>
                  {thumbUrl ? (
                    <img src={thumbUrl} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  ) : (
                    <div style={{ width: "100%", height: "100%", background: "linear-gradient(135deg, #d0d0d0, #e8e8e8)" }} />
                  )}
                  {dur && (
                    <div style={{
                      position: "absolute", bottom: 6, right: 6,
                      background: "rgba(0,0,0,0.8)", borderRadius: 4,
                      padding: "2px 5px",
                    }}>
                      <span style={{ color: "#e6e2dd", fontSize: 12, fontWeight: 600 }}>{dur}</span>
                    </div>
                  )}
                </div>
              </Editable>
              {/* Title row */}
              <div style={{ display: "flex", alignItems: "center", marginTop: 8 }}>
                <Editable
                  field={{ id: `cont_title_${item.id}`, label: `Titulo - ${title}`, value: title, type: "text", table: "videos", column: "title", rowId: item.id }}
                  onSelect={onFieldSelect} selectedField={selectedField}
                  style={{ flex: 1, minWidth: 0 }}
                >
                  <div style={{
                    fontSize: 14, fontWeight: 600, color: "#252525",
                    overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                  }}>{title}</div>
                </Editable>
                <span style={{ fontSize: 14, color: "#888", marginLeft: 4, cursor: "pointer" }}>&#8942;</span>
              </div>
              {/* Stats row */}
              <div style={{ display: "flex", alignItems: "center", marginTop: 5, gap: 3 }}>
                {item.money && (
                  <span style={{ fontSize: 14, marginRight: 4 }}>&#128176;</span>
                )}
                {item.copyright && (
                  <span style={{ fontSize: 14, color: "#d32f2f", marginRight: 4 }}>&copy;</span>
                )}
                <Editable
                  field={{ id: `cont_views_${item.id}`, label: `Vistas - ${title}`, value: isFromData ? item.view_count : 0, type: "number", table: "videos", column: "view_count", rowId: item.id }}
                  onSelect={onFieldSelect} selectedField={selectedField}
                >
                  <span style={{ display: "flex", alignItems: "center", gap: 3 }}>
                    <svg width="15" height="15" viewBox="0 0 15 15" fill="none"><rect x="1" y="9" width="3" height="5" rx="0.5" fill="#717171" /><rect x="6" y="5" width="3" height="9" rx="0.5" fill="#717171" /><rect x="11" y="1" width="3" height="13" rx="0.5" fill="#717171" /></svg>
                    <span style={{ fontSize: 12, color: "#717171", marginRight: 6 }}>{views}</span>
                  </span>
                </Editable>
                {likes && (
                  <Editable
                    field={{ id: `cont_likes_${item.id}`, label: `Likes - ${title}`, value: isFromData ? item.like_count : 0, type: "number", table: "videos", column: "like_count", rowId: item.id }}
                    onSelect={onFieldSelect} selectedField={selectedField}
                  >
                    <span style={{ display: "flex", alignItems: "center", gap: 3 }}>
                      <svg width="15" height="15" viewBox="0 0 15 15" fill="none"><path d="M4.5 6.5V13H2.5C2.22 13 2 12.78 2 12.5V7.5C2 7.22 2.22 7 2.5 7H4.5V6.5ZM5.5 6.5L8 1.5C8.83 1.5 9.5 2.17 9.5 3V5.5H12.5C12.78 5.5 13 5.72 13 6V12.5C13 12.78 12.78 13 12.5 13H5.5V6.5Z" fill="#717171" /></svg>
                      <span style={{ fontSize: 12, color: "#717171" }}>{likes}</span>
                    </span>
                  </Editable>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Shorts Section */}
      <SectionHead title="Shorts" />
      <div style={{ display: "flex", gap: 10, padding: "0 12px", overflowX: "auto" }}>
        {(shortItems.length > 0 ? shortItems : SHORTS_HARDCODED).map((item: any) => {
          const isFromData = shortItems.length > 0;
          const title = item.title;
          const views = isFromData ? fmt(item.view_count) : item.views;
          const likes = isFromData ? String(item.like_count ?? "") : item.likes;
          const thumbUrl = isFromData ? item.thumbnail_url : null;

          return (
            <div key={item.id} style={{ width: SHORT_W, flexShrink: 0 }}>
              {/* Short thumbnail */}
              <Editable
                field={{ id: `cont_sthumb_${item.id}`, label: `Thumbnail - ${title}`, value: thumbUrl || "", type: "image", table: "videos", column: "thumbnail_url", rowId: item.id }}
                onSelect={onFieldSelect} selectedField={selectedField}
              >
                <div style={{
                  width: SHORT_W, height: Math.round(SHORT_W * 16 / 9), borderRadius: 12,
                  overflow: "hidden", background: "#e8e8e8", position: "relative",
                }}>
                  {thumbUrl ? (
                    <img src={thumbUrl} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  ) : (
                    <div style={{ width: "100%", height: "100%", background: "linear-gradient(135deg, #c0c0c0, #e0e0e0)" }} />
                  )}
                  <div style={{ position: "absolute", top: 6, right: 6 }}>
                    <span style={{ color: "#fff", fontSize: 14, cursor: "pointer" }}>&#8942;</span>
                  </div>
                </div>
              </Editable>
              {/* Title */}
              <Editable
                field={{ id: `cont_stitle_${item.id}`, label: `Titulo - ${title}`, value: title, type: "text", table: "videos", column: "title", rowId: item.id }}
                onSelect={onFieldSelect} selectedField={selectedField}
              >
                <div style={{
                  fontSize: 13, fontWeight: 600, color: "#282828", marginTop: 6,
                  overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                }}>{title}</div>
              </Editable>
              {/* Stats */}
              <div style={{ display: "flex", alignItems: "center", marginTop: 5, gap: 3 }}>
                <Editable
                  field={{ id: `cont_sviews_${item.id}`, label: `Vistas - ${title}`, value: isFromData ? item.view_count : 0, type: "number", table: "videos", column: "view_count", rowId: item.id }}
                  onSelect={onFieldSelect} selectedField={selectedField}
                >
                  <span style={{ display: "flex", alignItems: "center", gap: 3 }}>
                    <svg width="15" height="15" viewBox="0 0 15 15" fill="none"><rect x="1" y="9" width="3" height="5" rx="0.5" fill="#717171" /><rect x="6" y="5" width="3" height="9" rx="0.5" fill="#717171" /><rect x="11" y="1" width="3" height="13" rx="0.5" fill="#717171" /></svg>
                    <span style={{ fontSize: 12, color: "#717171", marginRight: 6 }}>{views}</span>
                  </span>
                </Editable>
                {likes && (
                  <Editable
                    field={{ id: `cont_slikes_${item.id}`, label: `Likes - ${title}`, value: isFromData ? item.like_count : 0, type: "number", table: "videos", column: "like_count", rowId: item.id }}
                    onSelect={onFieldSelect} selectedField={selectedField}
                  >
                    <span style={{ display: "flex", alignItems: "center", gap: 3 }}>
                      <svg width="15" height="15" viewBox="0 0 15 15" fill="none"><path d="M4.5 6.5V13H2.5C2.22 13 2 12.78 2 12.5V7.5C2 7.22 2.22 7 2.5 7H4.5V6.5ZM5.5 6.5L8 1.5C8.83 1.5 9.5 2.17 9.5 3V5.5H12.5C12.78 5.5 13 5.72 13 6V12.5C13 12.78 12.78 13 12.5 13H5.5V6.5Z" fill="#717171" /></svg>
                      <span style={{ fontSize: 12, color: "#717171" }}>{likes}</span>
                    </span>
                  </Editable>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* En directo Section */}
      <SectionHead title="En directo" />
      <div style={{ display: "flex", gap: 10, padding: "0 12px", overflowX: "auto" }}>
        {(liveItems.length > 0 ? liveItems : LIVES_HARDCODED).map((item: any) => {
          const isFromData = liveItems.length > 0;
          const title = item.title;
          const views = isFromData ? fmt(item.view_count) : item.views;
          const likes = isFromData ? String(item.like_count ?? "") : item.likes;
          const dur = isFromData ? (item.duration || "1:27:29") : item.dur;
          const thumbUrl = isFromData ? item.thumbnail_url : null;

          return (
            <div key={item.id} style={{ width: CARD_W, flexShrink: 0 }}>
              {/* Thumbnail */}
              <Editable
                field={{ id: `cont_lthumb_${item.id}`, label: `Thumbnail - ${title}`, value: thumbUrl || "", type: "image", table: "videos", column: "thumbnail_url", rowId: item.id }}
                onSelect={onFieldSelect} selectedField={selectedField}
              >
                <div style={{
                  width: CARD_W, height: Math.round(CARD_W * 9 / 16), borderRadius: 12,
                  overflow: "hidden", background: "#e8e8e8", position: "relative",
                }}>
                  {thumbUrl ? (
                    <img src={thumbUrl} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  ) : (
                    <div style={{ width: "100%", height: "100%", background: "linear-gradient(135deg, #d0d0d0, #e8e8e8)" }} />
                  )}
                  {dur && (
                    <div style={{
                      position: "absolute", bottom: 6, right: 6,
                      background: "rgba(0,0,0,0.8)", borderRadius: 4,
                      padding: "2px 5px",
                    }}>
                      <span style={{ color: "#e6e2dd", fontSize: 12, fontWeight: 600 }}>{dur}</span>
                    </div>
                  )}
                </div>
              </Editable>
              {/* Title row */}
              <div style={{ display: "flex", alignItems: "center", marginTop: 8 }}>
                <Editable
                  field={{ id: `cont_ltitle_${item.id}`, label: `Titulo - ${title}`, value: title, type: "text", table: "videos", column: "title", rowId: item.id }}
                  onSelect={onFieldSelect} selectedField={selectedField}
                  style={{ flex: 1, minWidth: 0 }}
                >
                  <div style={{
                    fontSize: 14, fontWeight: 600, color: "#252525",
                    overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                  }}>{title}</div>
                </Editable>
                <span style={{ fontSize: 14, color: "#888", marginLeft: 4, cursor: "pointer" }}>&#8942;</span>
              </div>
              {/* Stats row */}
              <div style={{ display: "flex", alignItems: "center", marginTop: 5, gap: 3 }}>
                <Editable
                  field={{ id: `cont_lviews_${item.id}`, label: `Vistas - ${title}`, value: isFromData ? item.view_count : 0, type: "number", table: "videos", column: "view_count", rowId: item.id }}
                  onSelect={onFieldSelect} selectedField={selectedField}
                >
                  <span style={{ display: "flex", alignItems: "center", gap: 3 }}>
                    <svg width="15" height="15" viewBox="0 0 15 15" fill="none"><rect x="1" y="9" width="3" height="5" rx="0.5" fill="#717171" /><rect x="6" y="5" width="3" height="9" rx="0.5" fill="#717171" /><rect x="11" y="1" width="3" height="13" rx="0.5" fill="#717171" /></svg>
                    <span style={{ fontSize: 12, color: "#717171", marginRight: 6 }}>{views}</span>
                  </span>
                </Editable>
                {likes && (
                  <Editable
                    field={{ id: `cont_llikes_${item.id}`, label: `Likes - ${title}`, value: isFromData ? item.like_count : 0, type: "number", table: "videos", column: "like_count", rowId: item.id }}
                    onSelect={onFieldSelect} selectedField={selectedField}
                  >
                    <span style={{ display: "flex", alignItems: "center", gap: 3 }}>
                      <svg width="15" height="15" viewBox="0 0 15 15" fill="none"><path d="M4.5 6.5V13H2.5C2.22 13 2 12.78 2 12.5V7.5C2 7.22 2.22 7 2.5 7H4.5V6.5ZM5.5 6.5L8 1.5C8.83 1.5 9.5 2.17 9.5 3V5.5H12.5C12.78 5.5 13 5.72 13 6V12.5C13 12.78 12.78 13 12.5 13H5.5V6.5Z" fill="#717171" /></svg>
                      <span style={{ fontSize: 12, color: "#717171" }}>{likes}</span>
                    </span>
                  </Editable>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div style={{ height: 40 }} />
    </div>
  );
}

function SectionHead({ title }: { title: string }) {
  return (
    <div style={{
      display: "flex", justifyContent: "space-between", alignItems: "center",
      padding: "18px 16px 10px",
    }}>
      <span style={{ fontSize: 17, fontWeight: 700, color: "#1f1f1f" }}>{title}</span>
      <div style={{
        border: "1px solid #e0e0e0", borderRadius: 18,
        padding: "7px 14px", cursor: "pointer",
      }}>
        <span style={{ fontSize: 12, fontWeight: 600, color: "#2c2c2c" }}>Ver todo</span>
      </div>
    </div>
  );
}
