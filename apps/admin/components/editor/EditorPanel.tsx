"use client";

import { useState, useEffect, useRef } from "react";
import type { EditableField } from "@/app/page";

export function EditorPanel({
  field,
  onSave,
  onClose,
  saving,
}: {
  field: EditableField;
  onSave: (field: EditableField, value: string | number) => void;
  onClose: () => void;
  saving: boolean;
}) {
  const [value, setValue] = useState<string>(String(field.value));
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null);

  useEffect(() => {
    setValue(String(field.value));
    setTimeout(() => inputRef.current?.focus(), 100);
  }, [field]);

  const handleSubmit = () => {
    onSave(field, value);
  };

  return (
    <div className="editor-panel">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <h3 className="font-semibold text-gray-900 text-sm">Editar campo</h3>
        <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-lg">✕</button>
      </div>

      {/* Content */}
      <div className="p-4">
        <label className="block text-xs font-medium text-gray-500 uppercase mb-2">
          {field.label}
        </label>

        {field.type === "textarea" ? (
          <textarea
            ref={inputRef as any}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-900 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={4}
          />
        ) : field.type === "image" ? (
          <div>
            <div className="mb-3 rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center" style={{ height: 120 }}>
              {value && <img src={value} alt="" className="max-h-full max-w-full object-contain" />}
            </div>
            <input
              ref={inputRef as any}
              type="text"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder="URL de la imagen"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <p className="text-xs text-gray-400 mt-1">Pega la URL de la imagen o sube una nueva</p>
            <label className="mt-2 inline-block px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-sm text-white cursor-pointer transition-colors">
              Subir imagen
              <input type="file" accept="image/*" className="hidden" onChange={async (e) => {
                const file = e.target.files?.[0];
                if (!file) return;
                const formData = new FormData();
                formData.append("file", file);
                formData.append("table", field.table);
                formData.append("column", field.column);
                formData.append("rowId", field.rowId);
                const res = await fetch("/api/upload", { method: "POST", body: formData });
                if (res.ok) {
                  const data = await res.json();
                  setValue(data.url);
                  onSave(field, data.url);
                }
              }} />
            </label>
          </div>
        ) : (
          <input
            ref={inputRef as any}
            type="text"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        )}

        {/* Info */}
        <div className="mt-4 p-3 bg-gray-50 rounded-lg">
          <div className="text-xs text-gray-400 space-y-1">
            <div>Tabla: <span className="text-gray-600">{field.table}</span></div>
            <div>Columna: <span className="text-gray-600">{field.column}</span></div>
          </div>
        </div>

        {/* Save button */}
        <button
          onClick={handleSubmit}
          disabled={saving}
          className="w-full mt-4 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-lg text-sm font-medium transition-colors"
        >
          {saving ? "Guardando..." : "Guardar cambios"}
        </button>
      </div>
    </div>
  );
}
