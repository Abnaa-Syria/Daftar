"use client";
import { useEffect, useState, useCallback } from "react";
import { useAuth } from "@/hooks/useAuth";
import { adminApi } from "@/lib/api";
import DataTable from "@/components/admin/DataTable";
import Image from "next/image";
import { resolveMediaSrc } from "@/lib/media";

interface Infographic {
  id: number;
  slug: string;
  title: string;
  description: string;
  coverImage?: string;
  source?: string;
  status: string;
  publishedAt?: string;
  metaTitle?: string;
  metaDescription?: string;
  ogImage?: string;
  images: { url: string }[];
}

interface InfographicForm {
  title: string;
  slug: string;
  description: string;
  coverImage: string;
  source: string;
  status: "DRAFT" | "PUBLISHED" | "ARCHIVED";
  publishedAt: string;
  metaTitle: string;
  metaDescription: string;
  ogImage: string;
  imageUrlsText: string;
}

const initialForm: InfographicForm = {
  title: "",
  slug: "",
  description: "",
  coverImage: "",
  source: "",
  status: "DRAFT",
  publishedAt: "",
  metaTitle: "",
  metaDescription: "",
  ogImage: "",
  imageUrlsText: "",
};

export default function AdminInfographicsPage() {
  const { token } = useAuth();
  const [data, setData] = useState<Infographic[]>([]);
  const [meta, setMeta] = useState<{ page: number; limit: number; total: number; totalPages: number }>();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [page, setPage] = useState(1);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Infographic | null>(null);
  const [form, setForm] = useState<InfographicForm>(initialForm);
  const fetchData = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    try {
      const res = (await adminApi.crud("infographics", token).list({ page: String(page), limit: "15" })) as { data: Infographic[]; meta: typeof meta };
      setData(res.data || []);
      setMeta(res.meta);
    } catch {}
    setLoading(false);
  }, [token, page]);
  useEffect(() => { fetchData(); }, [fetchData]);

  const loadEdit = async (item: Infographic) => {
    if (!token) return;
    const res = (await adminApi.crud("infographics", token).get(item.id)) as { data: Infographic };
    const i = res.data;
    setEditing(i);
    setForm({
      title: i.title || "",
      slug: i.slug || "",
      description: i.description || "",
      coverImage: i.coverImage || "",
      source: i.source || "",
      status: (i.status as InfographicForm["status"]) || "DRAFT",
      publishedAt: i.publishedAt ? new Date(i.publishedAt).toISOString().slice(0, 16) : "",
      metaTitle: i.metaTitle || "",
      metaDescription: i.metaDescription || "",
      ogImage: i.ogImage || "",
      imageUrlsText: (i.images || []).map((img) => img.url).join("\n"),
    });
    setShowForm(true);
  };

  const parseImageUrls = () =>
    form.imageUrlsText
      .split("\n")
      .map((s) => s.trim())
      .filter(Boolean);

  const handleUpload = async (file: File, target: "coverImage" | "ogImage" | "gallery") => {
    if (!token) return;
    const res = (await adminApi.uploadMedia(token, file)) as { success: boolean; data?: { url?: string } };
    const url = res?.data?.url || "";
    if (!url) return;
    if (target === "gallery") {
      setForm((prev) => ({
        ...prev,
        imageUrlsText: prev.imageUrlsText ? `${prev.imageUrlsText}\n${url}` : url,
      }));
      return;
    }
    setForm((prev) => ({ ...prev, [target]: url }));
  };

  const handleSave = async () => {
    if (!token) return;
    setSaving(true);
    try {
      const payload = {
        title: form.title,
        slug: form.slug || undefined,
        description: form.description || undefined,
        coverImage: form.coverImage || undefined,
        source: form.source || undefined,
        status: form.status,
        publishedAt: form.publishedAt || undefined,
        metaTitle: form.metaTitle || undefined,
        metaDescription: form.metaDescription || undefined,
        ogImage: form.ogImage || undefined,
        imageUrls: parseImageUrls(),
      };
      const crud = adminApi.crud("infographics", token);
      if (editing) await crud.update(editing.id, payload);
      else await crud.create(payload);
      setShowForm(false);
      setEditing(null);
      setForm(initialForm);
      fetchData();
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (item: Infographic) => {
    if (!token) return;
    await adminApi.crud("infographics", token).remove(item.id);
    fetchData();
  };
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-extrabold">الانفوجراف</h1>
        <button
          onClick={() => {
            setEditing(null);
            setForm(initialForm);
            setShowForm(true);
          }}
          className="px-5 py-2.5 bg-crimson text-white rounded-xl font-bold text-sm"
        >
          + انفوجراف جديد
        </button>
      </div>

      {showForm && (
        <div className="bg-surface dark:bg-surface-dark rounded-xl border border-border dark:border-border-dark p-5 mb-6 space-y-4">
          <h2 className="font-extrabold text-lg">{editing ? "تعديل الانفوجراف" : "إنشاء انفوجراف"}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div><label className="block text-sm font-bold mb-1">العنوان</label><input value={form.title} onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))} className="w-full px-3 py-2 rounded-lg border text-sm" /></div>
            <div><label className="block text-sm font-bold mb-1">Slug</label><input dir="ltr" value={form.slug} onChange={(e) => setForm((p) => ({ ...p, slug: e.target.value }))} className="w-full px-3 py-2 rounded-lg border text-sm" /></div>
            <div className="md:col-span-2"><label className="block text-sm font-bold mb-1">الوصف</label><textarea rows={3} value={form.description} onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))} className="w-full px-3 py-2 rounded-lg border text-sm" /></div>
            <div><label className="block text-sm font-bold mb-1">Cover Image Path</label><input dir="ltr" value={form.coverImage} onChange={(e) => setForm((p) => ({ ...p, coverImage: e.target.value }))} className="w-full px-3 py-2 rounded-lg border text-sm" /></div>
            <div><label className="block text-sm font-bold mb-1">OG Image Path</label><input dir="ltr" value={form.ogImage} onChange={(e) => setForm((p) => ({ ...p, ogImage: e.target.value }))} className="w-full px-3 py-2 rounded-lg border text-sm" /></div>
            <div><label className="block text-sm font-bold mb-1">المصدر</label><input value={form.source} onChange={(e) => setForm((p) => ({ ...p, source: e.target.value }))} className="w-full px-3 py-2 rounded-lg border text-sm" /></div>
            <div><label className="block text-sm font-bold mb-1">الحالة</label><select value={form.status} onChange={(e) => setForm((p) => ({ ...p, status: e.target.value as InfographicForm["status"] }))} className="w-full px-3 py-2 rounded-lg border text-sm"><option value="DRAFT">مسودة</option><option value="PUBLISHED">منشور</option><option value="ARCHIVED">مؤرشف</option></select></div>
            <div><label className="block text-sm font-bold mb-1">تاريخ النشر</label><input type="datetime-local" value={form.publishedAt} onChange={(e) => setForm((p) => ({ ...p, publishedAt: e.target.value }))} className="w-full px-3 py-2 rounded-lg border text-sm" /></div>
            <div><label className="block text-sm font-bold mb-1">Meta Title</label><input value={form.metaTitle} onChange={(e) => setForm((p) => ({ ...p, metaTitle: e.target.value }))} className="w-full px-3 py-2 rounded-lg border text-sm" /></div>
            <div className="md:col-span-2"><label className="block text-sm font-bold mb-1">Meta Description</label><textarea rows={2} value={form.metaDescription} onChange={(e) => setForm((p) => ({ ...p, metaDescription: e.target.value }))} className="w-full px-3 py-2 rounded-lg border text-sm" /></div>
            <div className="md:col-span-2"><label className="block text-sm font-bold mb-1">Gallery Image Paths (one per line)</label><textarea dir="ltr" rows={5} value={form.imageUrlsText} onChange={(e) => setForm((p) => ({ ...p, imageUrlsText: e.target.value }))} className="w-full px-3 py-2 rounded-lg border text-sm" /></div>
          </div>

          <div className="flex flex-wrap gap-2">
            <label className="px-3 py-2 rounded-lg bg-surface-alt dark:bg-surface-dark-alt text-sm cursor-pointer">
              رفع Cover
              <input className="hidden" type="file" accept="image/*" onChange={(e) => e.target.files?.[0] && handleUpload(e.target.files[0], "coverImage")} />
            </label>
            <label className="px-3 py-2 rounded-lg bg-surface-alt dark:bg-surface-dark-alt text-sm cursor-pointer">
              رفع OG
              <input className="hidden" type="file" accept="image/*" onChange={(e) => e.target.files?.[0] && handleUpload(e.target.files[0], "ogImage")} />
            </label>
            <label className="px-3 py-2 rounded-lg bg-surface-alt dark:bg-surface-dark-alt text-sm cursor-pointer">
              إضافة صورة للمعرض
              <input className="hidden" type="file" accept="image/*" onChange={(e) => e.target.files?.[0] && handleUpload(e.target.files[0], "gallery")} />
            </label>
          </div>

          {(form.coverImage || form.ogImage) && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {form.coverImage && (
                <div className="rounded-lg border p-2">
                  <p className="text-xs mb-1">Preview Cover</p>
                  <div className="relative h-36">
                    <Image src={resolveMediaSrc(form.coverImage)} alt="cover" fill className="object-cover rounded" />
                  </div>
                </div>
              )}
              {form.ogImage && (
                <div className="rounded-lg border p-2">
                  <p className="text-xs mb-1">Preview OG</p>
                  <div className="relative h-36">
                    <Image src={resolveMediaSrc(form.ogImage)} alt="og" fill className="object-cover rounded" />
                  </div>
                </div>
              )}
            </div>
          )}

          <div className="flex gap-2">
            <button onClick={handleSave} disabled={saving} className="px-5 py-2 bg-crimson text-white rounded-lg font-bold text-sm disabled:opacity-60">{saving ? "جارٍ الحفظ..." : editing ? "تحديث" : "إنشاء"}</button>
            <button onClick={() => { setShowForm(false); setEditing(null); setForm(initialForm); }} className="px-5 py-2 bg-surface-alt dark:bg-surface-dark-alt rounded-lg font-bold text-sm">إلغاء</button>
          </div>
        </div>
      )}

      <DataTable columns={[
        { key: "title", label: "العنوان", render: (item: Infographic) => <span className="font-bold">{item.title}</span> },
        { key: "images", label: "الصور", render: (item: Infographic) => `${item.images?.length || 0} صور` },
        { key: "status", label: "الحالة", render: (item: Infographic) => <span className={`text-xs font-bold ${item.status === "PUBLISHED" ? "text-green-600" : "text-gray-400"}`}>{item.status === "PUBLISHED" ? "منشور" : item.status === "DRAFT" ? "مسودة" : "مؤرشف"}</span> },
      ]} data={data} loading={loading} meta={meta} onPageChange={setPage} onEdit={loadEdit} onDelete={handleDelete} emptyMessage="لا توجد انفوجرافات" />
    </div>
  );
}
