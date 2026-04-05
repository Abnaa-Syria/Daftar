"use client";
import { useEffect, useState, useCallback } from "react";
import { useAuth } from "@/hooks/useAuth";
import { adminApi } from "@/lib/api";
import DataTable from "@/components/admin/DataTable";
import Image from "next/image";
import { resolveMediaSrc } from "@/lib/media";

interface SpecialFile {
  id: number;
  slug: string;
  title: string;
  description?: string;
  coverImage?: string;
  status: string;
  publishedAt?: string;
  metaTitle?: string;
  metaDescription?: string;
  ogImage?: string;
  articles: { article: { id: number; title: string } }[];
}

interface ArticleItem {
  id: number;
  title: string;
}

const initialForm = {
  title: "",
  slug: "",
  description: "",
  coverImage: "",
  status: "DRAFT",
  publishedAt: "",
  metaTitle: "",
  metaDescription: "",
  ogImage: "",
  articleIdsText: "",
};

export default function AdminSpecialFilesPage() {
  const { token } = useAuth();
  const [data, setData] = useState<SpecialFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<SpecialFile | null>(null);
  const [form, setForm] = useState(initialForm);
  const [articles, setArticles] = useState<ArticleItem[]>([]);
  const fetchData = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    try {
      const res = (await adminApi.crud("special-files", token).list({ limit: "20" })) as { data: SpecialFile[] };
      setData(res.data || []);
    } catch {}
    setLoading(false);
  }, [token]);
  useEffect(() => { fetchData(); }, [fetchData]);

  useEffect(() => {
    if (!token) return;
    adminApi
      .crud("articles", token)
      .list({ limit: "200", status: "PUBLISHED" })
      .then((res) => setArticles(((res as { data: ArticleItem[] }).data || [])))
      .catch(() => setArticles([]));
  }, [token]);

  const loadEdit = async (item: SpecialFile) => {
    if (!token) return;
    const res = (await adminApi.crud("special-files", token).get(item.id)) as { data: SpecialFile };
    const s = res.data;
    setEditing(s);
    setForm({
      title: s.title || "",
      slug: s.slug || "",
      description: s.description || "",
      coverImage: s.coverImage || "",
      status: s.status || "DRAFT",
      publishedAt: s.publishedAt ? new Date(s.publishedAt).toISOString().slice(0, 16) : "",
      metaTitle: s.metaTitle || "",
      metaDescription: s.metaDescription || "",
      ogImage: s.ogImage || "",
      articleIdsText: (s.articles || []).map((a) => String(a.article.id)).join(", "),
    });
    setShowForm(true);
  };

  const parseArticleIds = () =>
    form.articleIdsText
      .split(",")
      .map((v) => parseInt(v.trim(), 10))
      .filter((n) => !Number.isNaN(n));

  const handleUpload = async (file: File, target: "coverImage" | "ogImage") => {
    if (!token) return;
    const res = (await adminApi.uploadMedia(token, file)) as { data?: { url?: string } };
    const url = res?.data?.url || "";
    if (!url) return;
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
        status: form.status,
        publishedAt: form.publishedAt || undefined,
        metaTitle: form.metaTitle || undefined,
        metaDescription: form.metaDescription || undefined,
        ogImage: form.ogImage || undefined,
        articleIds: parseArticleIds(),
      };
      const crud = adminApi.crud("special-files", token);
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

  const handleDelete = async (item: SpecialFile) => {
    if (!token) return;
    await adminApi.crud("special-files", token).remove(item.id);
    fetchData();
  };
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-extrabold">ملفات خاصة</h1>
        <button onClick={() => { setEditing(null); setForm(initialForm); setShowForm(true); }} className="px-5 py-2.5 bg-crimson text-white rounded-xl font-bold text-sm">+ ملف خاص</button>
      </div>

      {showForm && (
        <div className="bg-surface dark:bg-surface-dark rounded-xl border border-border dark:border-border-dark p-5 mb-6 space-y-4">
          <h2 className="font-extrabold text-lg">{editing ? "تعديل ملف خاص" : "إنشاء ملف خاص"}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div><label className="block text-sm font-bold mb-1">العنوان</label><input value={form.title} onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))} className="w-full px-3 py-2 rounded-lg border text-sm" /></div>
            <div><label className="block text-sm font-bold mb-1">Slug</label><input dir="ltr" value={form.slug} onChange={(e) => setForm((p) => ({ ...p, slug: e.target.value }))} className="w-full px-3 py-2 rounded-lg border text-sm" /></div>
            <div className="md:col-span-2"><label className="block text-sm font-bold mb-1">الوصف</label><textarea rows={3} value={form.description} onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))} className="w-full px-3 py-2 rounded-lg border text-sm" /></div>
            <div><label className="block text-sm font-bold mb-1">Cover Image Path</label><input dir="ltr" value={form.coverImage} onChange={(e) => setForm((p) => ({ ...p, coverImage: e.target.value }))} className="w-full px-3 py-2 rounded-lg border text-sm" /></div>
            <div><label className="block text-sm font-bold mb-1">OG Image Path</label><input dir="ltr" value={form.ogImage} onChange={(e) => setForm((p) => ({ ...p, ogImage: e.target.value }))} className="w-full px-3 py-2 rounded-lg border text-sm" /></div>
            <div><label className="block text-sm font-bold mb-1">الحالة</label><select value={form.status} onChange={(e) => setForm((p) => ({ ...p, status: e.target.value }))} className="w-full px-3 py-2 rounded-lg border text-sm"><option value="DRAFT">مسودة</option><option value="PUBLISHED">منشور</option><option value="ARCHIVED">مؤرشف</option></select></div>
            <div><label className="block text-sm font-bold mb-1">تاريخ النشر</label><input type="datetime-local" value={form.publishedAt} onChange={(e) => setForm((p) => ({ ...p, publishedAt: e.target.value }))} className="w-full px-3 py-2 rounded-lg border text-sm" /></div>
            <div><label className="block text-sm font-bold mb-1">Meta Title</label><input value={form.metaTitle} onChange={(e) => setForm((p) => ({ ...p, metaTitle: e.target.value }))} className="w-full px-3 py-2 rounded-lg border text-sm" /></div>
            <div className="md:col-span-2"><label className="block text-sm font-bold mb-1">Meta Description</label><textarea rows={2} value={form.metaDescription} onChange={(e) => setForm((p) => ({ ...p, metaDescription: e.target.value }))} className="w-full px-3 py-2 rounded-lg border text-sm" /></div>
            <div className="md:col-span-2">
              <label className="block text-sm font-bold mb-1">Article IDs (comma separated)</label>
              <input dir="ltr" value={form.articleIdsText} onChange={(e) => setForm((p) => ({ ...p, articleIdsText: e.target.value }))} className="w-full px-3 py-2 rounded-lg border text-sm" placeholder="1, 2, 5" />
              <p className="text-xs text-text-secondary mt-1">Published articles: {articles.slice(0, 20).map((a) => `${a.id}:${a.title}`).join(" | ")}{articles.length > 20 ? " ..." : ""}</p>
            </div>
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
          </div>

          {form.coverImage && (
            <div className="relative h-36 w-64 rounded-lg overflow-hidden border">
              <Image src={resolveMediaSrc(form.coverImage)} alt="cover" fill className="object-cover" />
            </div>
          )}

          <div className="flex gap-2">
            <button onClick={handleSave} disabled={saving} className="px-5 py-2 bg-crimson text-white rounded-lg font-bold text-sm disabled:opacity-60">{saving ? "جارٍ الحفظ..." : editing ? "تحديث" : "إنشاء"}</button>
            <button onClick={() => { setShowForm(false); setEditing(null); setForm(initialForm); }} className="px-5 py-2 bg-surface-alt dark:bg-surface-dark-alt rounded-lg font-bold text-sm">إلغاء</button>
          </div>
        </div>
      )}

      <DataTable columns={[
        { key: "title", label: "العنوان", render: (item: SpecialFile) => <span className="font-bold">{item.title}</span> },
        { key: "articles", label: "المقالات", render: (item: SpecialFile) => `${item.articles?.length || 0} مقال` },
        { key: "status", label: "الحالة", render: (item: SpecialFile) => <span className={`text-xs font-bold ${item.status === "PUBLISHED" ? "text-green-600" : "text-gray-400"}`}>{item.status === "PUBLISHED" ? "منشور" : "مسودة"}</span> },
      ]} data={data} loading={loading} onEdit={loadEdit} onDelete={handleDelete} />
    </div>
  );
}
