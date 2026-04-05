"use client";
import { useEffect, useState, useCallback } from "react";
import { useAuth } from "@/hooks/useAuth";
import { adminApi } from "@/lib/api";
import DataTable from "@/components/admin/DataTable";

interface SeriesItem { id: number; slug: string; name: string; description: string; isActive: boolean; _count?: { articles: number }; }

export default function AdminSeriesPage() {
  const { token } = useAuth();
  const [data, setData] = useState<SeriesItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<SeriesItem | null>(null);
  const [form, setForm] = useState({ name: "", slug: "", description: "" });
  const fetchData = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    try {
      const res = (await adminApi.crud("series", token).list({ limit: "50" })) as { data: SeriesItem[] };
      setData(res.data || []);
    } catch {}
    setLoading(false);
  }, [token]);
  useEffect(() => { fetchData(); }, [fetchData]);
  const handleSave = async () => {
    if (!token) return;
    const crud = adminApi.crud("series", token);
    try {
      if (editing) await crud.update(editing.id, form);
      else await crud.create(form);
      setShowForm(false);
      setEditing(null);
      setForm({ name: "", slug: "", description: "" });
      fetchData();
    } catch {}
  };
  const handleEdit = (item: SeriesItem) => { setEditing(item); setForm({ name: item.name, slug: item.slug, description: item.description || "" }); setShowForm(true); };
  const handleDelete = async (item: SeriesItem) => {
    if (!token) return;
    await adminApi.crud("series", token).remove(item.id);
    fetchData();
  };
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-extrabold">السلاسل</h1>
        <button onClick={() => { setShowForm(true); setEditing(null); setForm({ name: "", slug: "", description: "" }); }} className="px-5 py-2.5 bg-crimson text-white rounded-xl font-bold text-sm">+ سلسلة جديدة</button>
      </div>
      {showForm && (
        <div className="bg-surface dark:bg-surface-dark rounded-xl border border-border dark:border-border-dark p-6 mb-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div><label className="block text-sm font-bold mb-1">الاسم</label><input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-border dark:border-border-dark bg-surface-alt dark:bg-surface-dark-alt text-sm" /></div>
            <div><label className="block text-sm font-bold mb-1">الرابط</label><input value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-border dark:border-border-dark bg-surface-alt dark:bg-surface-dark-alt text-sm" dir="ltr" /></div>
            <div className="md:col-span-2"><label className="block text-sm font-bold mb-1">الوصف</label><textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-border dark:border-border-dark bg-surface-alt dark:bg-surface-dark-alt text-sm" rows={2} /></div>
          </div>
          <div className="flex gap-2"><button onClick={handleSave} className="px-5 py-2 bg-crimson text-white rounded-lg font-bold text-sm">{editing ? "تحديث" : "إنشاء"}</button><button onClick={() => setShowForm(false)} className="px-5 py-2 bg-surface-alt dark:bg-surface-dark-alt rounded-lg font-bold text-sm">إلغاء</button></div>
        </div>
      )}
      <DataTable columns={[
        { key: "name", label: "الاسم", render: (item: SeriesItem) => <span className="font-bold">{item.name}</span> },
        { key: "slug", label: "الرابط", render: (item: SeriesItem) => <span className="text-xs" dir="ltr">{item.slug}</span> },
        { key: "articles", label: "المقالات", render: (item: SeriesItem) => item._count?.articles ?? 0 },
      ]} data={data} loading={loading} onEdit={handleEdit} onDelete={handleDelete} />
    </div>
  );
}
