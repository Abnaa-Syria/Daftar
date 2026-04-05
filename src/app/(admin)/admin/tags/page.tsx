"use client";
import { useEffect, useState, useCallback } from "react";
import { useAuth } from "@/hooks/useAuth";
import { adminApi } from "@/lib/api";
import DataTable from "@/components/admin/DataTable";

interface Tag { id: number; slug: string; name: string; _count?: { articles: number }; }

export default function AdminTagsPage() {
  const { token } = useAuth();
  const [data, setData] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Tag | null>(null);
  const [form, setForm] = useState({ name: "", slug: "" });

  const fetchData = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    try {
      const res = (await adminApi.crud("tags", token).list({ limit: "100" })) as { data: Tag[] };
      setData(res.data || []);
    } catch {}
    setLoading(false);
  }, [token]);
  useEffect(() => { fetchData(); }, [fetchData]);

  const handleSave = async () => {
    if (!token) return;
    const crud = adminApi.crud("tags", token);
    try {
      if (editing) await crud.update(editing.id, form);
      else await crud.create(form);
      setShowForm(false);
      setEditing(null);
      setForm({ name: "", slug: "" });
      fetchData();
    } catch {}
  };
  const handleEdit = (item: Tag) => { setEditing(item); setForm({ name: item.name, slug: item.slug }); setShowForm(true); };
  const handleDelete = async (item: Tag) => {
    if (!token) return;
    await adminApi.crud("tags", token).remove(item.id);
    fetchData();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-extrabold">الوسوم</h1>
        <button onClick={() => { setShowForm(true); setEditing(null); setForm({ name: "", slug: "" }); }} className="px-5 py-2.5 bg-crimson text-white rounded-xl font-bold text-sm">+ وسم جديد</button>
      </div>
      {showForm && (
        <div className="bg-surface dark:bg-surface-dark rounded-xl border border-border dark:border-border-dark p-6 mb-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div><label className="block text-sm font-bold mb-1">الاسم</label><input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-border dark:border-border-dark bg-surface-alt dark:bg-surface-dark-alt text-sm" /></div>
            <div><label className="block text-sm font-bold mb-1">الرابط</label><input value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-border dark:border-border-dark bg-surface-alt dark:bg-surface-dark-alt text-sm" dir="ltr" /></div>
          </div>
          <div className="flex gap-2">
            <button onClick={handleSave} className="px-5 py-2 bg-crimson text-white rounded-lg font-bold text-sm">{editing ? "تحديث" : "إنشاء"}</button>
            <button onClick={() => setShowForm(false)} className="px-5 py-2 bg-surface-alt dark:bg-surface-dark-alt rounded-lg font-bold text-sm">إلغاء</button>
          </div>
        </div>
      )}
      <DataTable columns={[
        { key: "name", label: "الاسم", render: (item: Tag) => <span className="font-bold">{item.name}</span> },
        { key: "slug", label: "الرابط", render: (item: Tag) => <span className="text-xs" dir="ltr">{item.slug}</span> },
        { key: "articles", label: "المقالات", render: (item: Tag) => item._count?.articles ?? 0 },
      ]} data={data} loading={loading} onEdit={handleEdit} onDelete={handleDelete} />
    </div>
  );
}
