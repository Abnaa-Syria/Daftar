"use client";
import { useEffect, useState, useCallback } from "react";
import { useAuth } from "@/hooks/useAuth";
import { adminApi } from "@/lib/api";
import DataTable from "@/components/admin/DataTable";
interface StaticPage {
  id: number;
  slug: string;
  title: string;
  content?: string;
  status: string;
  metaTitle?: string;
  metaDescription?: string;
  ogImage?: string;
  updatedAt: string;
}
export default function AdminPagesPage() {
  const { token } = useAuth();
  const [data, setData] = useState<StaticPage[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<StaticPage | null>(null);
  const [form, setForm] = useState({ title: "", slug: "", content: "", status: "DRAFT", metaTitle: "", metaDescription: "", ogImage: "" });
  const fetchData = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    try {
      const res = (await adminApi.crud("pages", token).list({ limit: "50" })) as { data: StaticPage[] };
      setData(res.data || []);
    } catch {}
    setLoading(false);
  }, [token]);
  useEffect(() => { fetchData(); }, [fetchData]);
  const handleSave = async () => {
    if (!token) return;
    const crud = adminApi.crud("pages", token);
    try {
      if (editing) await crud.update(editing.id, form);
      else await crud.create(form);
      setShowForm(false);
      setEditing(null);
      setForm({ title: "", slug: "", content: "", status: "DRAFT", metaTitle: "", metaDescription: "", ogImage: "" });
      fetchData();
    } catch {}
  };
  const handleEdit = async (item: StaticPage) => {
    if (!token) return;
    const res = (await adminApi.crud("pages", token).get(item.id)) as { data: StaticPage };
    const full = res.data;
    setEditing(full);
    setForm({
      title: full.title || "",
      slug: full.slug || "",
      content: full.content || "",
      status: full.status || "DRAFT",
      metaTitle: full.metaTitle || "",
      metaDescription: full.metaDescription || "",
      ogImage: full.ogImage || "",
    });
    setShowForm(true);
  };
  const handleDelete = async (item: StaticPage) => {
    if (!token) return;
    await adminApi.crud("pages", token).remove(item.id);
    fetchData();
  };
  return (
    <div>
      <div className="flex items-center justify-between mb-6"><h1 className="text-2xl font-extrabold">صفحات ثابتة</h1>
        <button onClick={() => { setShowForm(true); setEditing(null); setForm({ title: "", slug: "", content: "", status: "DRAFT", metaTitle: "", metaDescription: "", ogImage: "" }); }} className="px-5 py-2.5 bg-crimson text-white rounded-xl font-bold text-sm">+ صفحة جديدة</button>
      </div>
      {showForm && (
        <div className="bg-surface dark:bg-surface-dark rounded-xl border border-border dark:border-border-dark p-6 mb-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div><label className="block text-sm font-bold mb-1">العنوان</label><input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-border dark:border-border-dark bg-surface-alt dark:bg-surface-dark-alt text-sm" /></div>
            <div><label className="block text-sm font-bold mb-1">الرابط</label><input value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-border dark:border-border-dark bg-surface-alt dark:bg-surface-dark-alt text-sm" dir="ltr" /></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div><label className="block text-sm font-bold mb-1">Meta Title</label><input value={form.metaTitle} onChange={(e) => setForm({ ...form, metaTitle: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-border dark:border-border-dark bg-surface-alt dark:bg-surface-dark-alt text-sm" /></div>
            <div><label className="block text-sm font-bold mb-1">OG Image Path</label><input value={form.ogImage} onChange={(e) => setForm({ ...form, ogImage: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-border dark:border-border-dark bg-surface-alt dark:bg-surface-dark-alt text-sm" dir="ltr" /></div>
            <div className="md:col-span-2"><label className="block text-sm font-bold mb-1">Meta Description</label><textarea value={form.metaDescription} onChange={(e) => setForm({ ...form, metaDescription: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-border dark:border-border-dark bg-surface-alt dark:bg-surface-dark-alt text-sm" rows={2} /></div>
            <div><label className="block text-sm font-bold mb-1">الحالة</label><select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-border dark:border-border-dark bg-surface-alt dark:bg-surface-dark-alt text-sm"><option value="DRAFT">مسودة</option><option value="PUBLISHED">منشور</option><option value="ARCHIVED">مؤرشف</option></select></div>
          </div>
          <div><label className="block text-sm font-bold mb-1">المحتوى (HTML)</label><textarea value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-border dark:border-border-dark bg-surface-alt dark:bg-surface-dark-alt text-sm" rows={6} /></div>
          <div className="flex gap-2"><button onClick={handleSave} className="px-5 py-2 bg-crimson text-white rounded-lg font-bold text-sm">{editing ? "تحديث" : "إنشاء"}</button><button onClick={() => setShowForm(false)} className="px-5 py-2 bg-surface-alt dark:bg-surface-dark-alt rounded-lg font-bold text-sm">إلغاء</button></div>
        </div>
      )}
      <DataTable columns={[
        { key: "title", label: "العنوان", render: (item: StaticPage) => <span className="font-bold">{item.title}</span> },
        { key: "slug", label: "الرابط", render: (item: StaticPage) => <span dir="ltr" className="text-xs">{item.slug}</span> },
        { key: "status", label: "الحالة", render: (item: StaticPage) => <span className={`text-xs font-bold ${item.status === "PUBLISHED" ? "text-green-600" : "text-gray-400"}`}>{item.status === "PUBLISHED" ? "منشور" : "مسودة"}</span> },
      ]} data={data} loading={loading} onEdit={handleEdit} onDelete={handleDelete} />
    </div>
  );
}
