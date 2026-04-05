"use client";
import { useEffect, useState, useCallback, useRef } from "react";
import { useAuth } from "@/hooks/useAuth";
import { adminApi } from "@/lib/api";
import Image from "next/image";
import { resolveMediaSrc } from "@/lib/media";

interface MediaItem { id: number; filename: string; url: string; mimeType: string; size: number; alt: string; createdAt: string; }

export default function AdminMediaPage() {
  const { token } = useAuth();
  const [data, setData] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [altDraft, setAltDraft] = useState("");
  const [page, setPage] = useState(1);
  const [meta, setMeta] = useState<{ totalPages: number; total: number }>();
  const fileRef = useRef<HTMLInputElement>(null);

  const fetchData = useCallback(async () => { if (!token) return; setLoading(true); try { const res = await adminApi.crud("media", token).list({ page: String(page), limit: "20" }) as { data: MediaItem[]; meta: typeof meta }; setData(res.data || []); setMeta(res.meta); } catch {} setLoading(false); }, [token, page]);
  useEffect(() => { fetchData(); }, [fetchData]);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !token) return;
    setUploading(true);
    try { await adminApi.uploadMedia(token, file); fetchData(); } catch {}
    setUploading(false);
    if (fileRef.current) fileRef.current.value = "";
  };

  const handleDelete = async (item: MediaItem) => {
    if (!token) return;
    await adminApi.crud("media", token).remove(item.id);
    fetchData();
  };

  const startEditAlt = (item: MediaItem) => {
    setEditingId(item.id);
    setAltDraft(item.alt || "");
  };

  const saveAlt = async (id: number) => {
    if (!token) return;
    await adminApi.crud("media", token).update(id, { alt: altDraft });
    setEditingId(null);
    setAltDraft("");
    fetchData();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-extrabold">الوسائط</h1>
        <div>
          <input ref={fileRef} type="file" accept="image/*" onChange={handleUpload} className="hidden" id="media-upload" />
          <label htmlFor="media-upload" className={`px-5 py-2.5 bg-crimson text-white rounded-xl font-bold text-sm cursor-pointer ${uploading ? "opacity-60" : "hover:bg-crimson-light"}`}>
            {uploading ? "جارٍ الرفع..." : "+ رفع صورة"}
          </label>
        </div>
      </div>
      {loading ? <p className="text-center py-8">جارٍ التحميل...</p> : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {data.map((item) => (
            <div key={item.id} className="group relative rounded-xl overflow-hidden border border-border dark:border-border-dark bg-surface dark:bg-surface-dark">
              <div className="aspect-square relative">
                <Image src={resolveMediaSrc(item.url)} alt={item.alt || item.filename} fill className="object-cover" sizes="200px" />
              </div>
              <div className="p-2">
                <p className="text-xs font-bold truncate">{item.filename}</p>
                {editingId === item.id ? (
                  <div className="mt-1 flex gap-1">
                    <input value={altDraft} onChange={(e) => setAltDraft(e.target.value)} className="w-full px-2 py-1 rounded border text-[10px]" />
                    <button onClick={() => saveAlt(item.id)} className="px-2 py-1 text-[10px] rounded bg-crimson text-white">✓</button>
                  </div>
                ) : (
                  <p className="text-[10px] text-text-secondary dark:text-text-dark-secondary truncate">{item.alt || "—"}</p>
                )}
                <p className="text-[10px] text-text-secondary dark:text-text-dark-secondary">{(item.size / 1024).toFixed(0)} KB</p>
                <button onClick={() => navigator.clipboard?.writeText(item.url)} className="text-[10px] mt-1 text-crimson font-bold">نسخ المسار</button>
              </div>
              <button onClick={() => startEditAlt(item)} className="absolute top-2 right-2 w-6 h-6 bg-black/50 text-white rounded-full text-xs">✎</button>
              <button onClick={() => handleDelete(item)} className="absolute top-2 left-2 w-6 h-6 bg-crimson text-white rounded-full text-xs opacity-0 group-hover:opacity-100 transition-opacity">✕</button>
            </div>
          ))}
        </div>
      )}
      {meta && meta.totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-6">
          <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page <= 1} className="px-4 py-2 rounded-lg border text-sm font-bold disabled:opacity-40">السابق</button>
          <span className="px-4 py-2 text-sm">{page} / {meta.totalPages}</span>
          <button onClick={() => setPage((p) => p + 1)} disabled={page >= meta.totalPages} className="px-4 py-2 rounded-lg border text-sm font-bold disabled:opacity-40">التالي</button>
        </div>
      )}
    </div>
  );
}
