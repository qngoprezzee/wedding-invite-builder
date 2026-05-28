"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import type { WeddingConfig } from "@/types/config";

const PHOTO_SLOTS = Array.from({ length: 21 }, (_, i) => `images/photo-${String(i + 1).padStart(2, "0")}.jpg`);

const TEXT_FIELDS: { key: keyof Omit<WeddingConfig, "photos">; label: string; placeholder: string }[] = [
  { key: "groomName",      label: "Tên Chú Rể",       placeholder: "Nguyễn Văn A" },
  { key: "brideName",      label: "Tên Cô Dâu",       placeholder: "Trần Thị B" },
  { key: "groomEventDate", label: "Ngày Cưới Nhà Trai", placeholder: "15/10/2025" },
  { key: "brideEventDate", label: "Ngày Cưới Nhà Gái", placeholder: "14/10/2025" },
  { key: "eventDay",       label: "Ngày (số)",          placeholder: "15" },
  { key: "eventWeekday",   label: "Thứ",               placeholder: "Thứ Tư" },
  { key: "eventMonthYear", label: "Tháng - Năm",        placeholder: "10 - 2025" },
  { key: "eventTime",      label: "Giờ Tiệc",          placeholder: "11 GIỜ 00" },
  { key: "lunarDate",      label: "Ngày Âm Lịch",      placeholder: "14 tháng 9 năm Ất Tỵ" },
  { key: "venue",          label: "Tên Nhà Hàng",      placeholder: "NHÀ HÀNG TIỆC CƯỚI ABC" },
  { key: "venueAddress",   label: "Địa Chỉ",           placeholder: "123 Đường ABC, Quận 1, TP.HCM" },
];

export default function AdminPage() {
  const [config, setConfig] = useState<WeddingConfig | null>(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [uploading, setUploading] = useState<string | null>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const activeSlotRef = useRef<string | null>(null);

  useEffect(() => {
    fetch("/api/config")
      .then((r) => r.json())
      .then(setConfig);
  }, []);

  const updateField = useCallback((key: keyof Omit<WeddingConfig, "photos">, value: string) => {
    setConfig((prev) => prev ? { ...prev, [key]: value } : prev);
  }, []);

  const handleSave = async () => {
    if (!config) return;
    setSaving(true);
    await fetch("/api/config", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(config),
    });
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
    iframeRef.current?.contentWindow?.location.reload();
  };

  const triggerReplace = (slot: string) => {
    activeSlotRef.current = slot;
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    const slot = activeSlotRef.current;
    if (!file || !slot) return;

    setUploading(slot);
    const form = new FormData();
    form.append("file", file);
    form.append("slot", slot);

    const res = await fetch("/api/upload", { method: "POST", body: form });
    const { url } = await res.json();

    setConfig((prev) =>
      prev ? { ...prev, photos: { ...prev.photos, [slot]: url } } : prev
    );
    setUploading(null);
    e.target.value = "";
  };

  if (!config) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <div className="text-gray-500">Loading...</div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden">
      {/* Hidden file input */}
      <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange} />

      {/* ── Left panel: form ───────────────────────────────────────────── */}
      <aside className="w-[420px] flex-shrink-0 flex flex-col bg-white border-r border-gray-200 overflow-y-auto">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <div>
            <h1 className="text-lg font-semibold text-gray-900">Wedding Builder</h1>
            <p className="text-xs text-gray-500 mt-0.5">Tùy chỉnh thiệp cưới của bạn</p>
          </div>
          <div className="flex gap-2">
            <a
              href="/invite"
              target="_blank"
              className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 text-gray-700"
            >
              Xem thiệp ↗
            </a>
            <button
              onClick={handleSave}
              disabled={saving}
              className="px-4 py-1.5 text-sm bg-rose-500 hover:bg-rose-600 text-white rounded-lg font-medium disabled:opacity-60 transition-colors"
            >
              {saving ? "Đang lưu..." : saved ? "✓ Đã lưu!" : "Lưu"}
            </button>
          </div>
        </div>

        {/* Text fields */}
        <div className="px-6 py-4 space-y-3">
          <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Thông tin cặp đôi</h2>
          {TEXT_FIELDS.map(({ key, label, placeholder }) => (
            <div key={key}>
              <label className="block text-xs font-medium text-gray-700 mb-1">{label}</label>
              <input
                type="text"
                value={config[key] as string}
                placeholder={placeholder}
                onChange={(e) => updateField(key, e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-400 focus:border-transparent"
              />
            </div>
          ))}
        </div>

        {/* Photo grid */}
        <div className="px-6 py-4 border-t border-gray-100">
          <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
            Album ảnh ({PHOTO_SLOTS.length} ảnh)
          </h2>
          <div className="grid grid-cols-3 gap-2">
            {PHOTO_SLOTS.map((slot, i) => {
              const url = config.photos[slot] ?? `/images/photo-${String(i + 1).padStart(2, "0")}.jpg`;
              const isUploading = uploading === slot;
              return (
                <div key={slot} className="relative group aspect-square rounded-lg overflow-hidden bg-gray-100 border border-gray-200">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={url} alt={`Photo ${i + 1}`} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-1">
                    <span className="text-white text-xs font-medium">#{i + 1}</span>
                    <button
                      onClick={() => triggerReplace(slot)}
                      disabled={isUploading}
                      className="px-2 py-1 bg-white text-gray-800 text-xs font-medium rounded hover:bg-gray-100 disabled:opacity-60"
                    >
                      {isUploading ? "..." : "Thay ảnh"}
                    </button>
                  </div>
                  {isUploading && (
                    <div className="absolute inset-0 bg-white/70 flex items-center justify-center">
                      <div className="w-5 h-5 border-2 border-rose-400 border-t-transparent rounded-full animate-spin" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
        <div className="h-6" />
      </aside>

      {/* ── Right panel: preview ────────────────────────────────────────── */}
      <main className="flex-1 flex flex-col">
        <div className="px-4 py-3 bg-white border-b border-gray-200 flex items-center gap-3">
          <div className="flex-1 px-3 py-1.5 bg-gray-100 rounded text-xs text-gray-500 font-mono">
            {typeof window !== "undefined" ? `${window.location.origin}/invite` : "/invite"}
          </div>
          <button
            onClick={() => iframeRef.current?.contentWindow?.location.reload()}
            className="px-3 py-1.5 text-xs text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            ↺ Refresh
          </button>
        </div>
        <div className="flex-1 overflow-hidden bg-gray-300">
          <iframe
            ref={iframeRef}
            src="/invite"
            className="w-full h-full border-0"
            title="Wedding Invitation Preview"
          />
        </div>
      </main>
    </div>
  );
}
