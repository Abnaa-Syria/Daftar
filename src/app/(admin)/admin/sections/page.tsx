"use client";

import { useEffect, useState, useCallback } from "react";
import { useAuth } from "@/hooks/useAuth";
import { adminApi } from "@/lib/api";
import DataTable from "@/components/admin/DataTable";

interface Section { id: number; slug: string; name: string; description: string; color: string; sortOrder: number; isActive: boolean; _count?: { articles: number }; }

export default function AdminSectionsPage() {
  const { token } = useAuth();
  const [data, setData] = useState<Section[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Section | null>(null);
  const [form, setForm] = useState({ name: "", slug: "", description: "", color: "#1a2744", sortOrder: 0, isActive: true });

  const fetchData = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    try {
      const res = (await adminApi.crud("sections", token).list({ limit: "50" })) as { data: Section[] };
      setData(res.data || []);
    } catch {
      /* */
    }
    setLoading(false);
  }, [token]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleSave = async () => {
    if (!token) return;
    const crud = adminApi.crud("sections", token);
    try {
      if (editing) { await crud.update(editing.id, form); }
      else { await crud.create(form); }
      setShowForm(false); setEditing(null); setForm({ name: "", slug: "", description: "", color: "#1a2744", sortOrder: 0, isActive: true });
      fetchData();
    } catch { /* */ }
  };

  const handleEdit = (item: Section) => {
    setEditing(item);
    setForm({ name: item.name, slug: item.slug, description: item.description || "", color: item.color, sortOrder: item.sortOrder, isActive: item.isActive });
    setShowForm(true);
  };

  const handleDelete = async (item: Section) => {
    if (!token) return;
    await adminApi.crud("sections", token).remove(item.id);
    fetchData();
  };

  const columns = [
    { key: "name", label: "الاسم", render: (item: Section) => (<div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} /><span className="font-bold">{item.name}</span></div>) },
    { key: "slug", label: "الرابط", render: (item: Section) => <span className="text-xs text-text-secondary dark:text-text-dark-secondary" dir="ltr">{item.slug}</span> },
    { key: "articles", label: "المقالات", render: (item: Section) => item._count?.articles ?? 0 },
    { key: "sortOrder", label: "الترتيب" },
    { key: "isActive", label: "الحالة", render: (item: Section) => item.isActive ? <span className="text-green-600 font-bold text-xs">نشط</span> : <span className="text-gray-400 text-xs">غير نشط</span> },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-extrabold">الأقسام</h1>
        <button onClick={() => { setShowForm(true); setEditing(null); setForm({ name: "", slug: "", description: "", color: "#1a2744", sortOrder: 0, isActive: true }); }} className="px-5 py-2.5 bg-crimson text-white rounded-xl font-bold hover:bg-crimson-light transition-colors text-sm">
          + قسم جديد
        </button>
      </div>

      {showForm && (
        <div className="bg-surface dark:bg-surface-dark rounded-xl border border-border dark:border-border-dark p-6 mb-6 space-y-4">
          <h2 className="font-extrabold text-lg">{editing ? "تعديل القسم" : "قسم جديد"}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div><label className="block text-sm font-bold mb-1">الاسم</label><input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-border dark:border-border-dark bg-surface-alt dark:bg-surface-dark-alt text-sm" /></div>
            <div><label className="block text-sm font-bold mb-1">الرابط</label><input value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-border dark:border-border-dark bg-surface-alt dark:bg-surface-dark-alt text-sm" dir="ltr" placeholder="يتم إنشاؤه تلقائياً" /></div>
            <div className="md:col-span-2"><label className="block text-sm font-bold mb-1">الوصف</label><textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-border dark:border-border-dark bg-surface-alt dark:bg-surface-dark-alt text-sm" rows={2} /></div>
            <div><label className="block text-sm font-bold mb-1">اللون</label><input type="color" value={form.color} onChange={(e) => setForm({ ...form, color: e.target.value })} className="w-16 h-10 rounded border" /></div>
            <div><label className="block text-sm font-bold mb-1">الترتيب</label><input type="number" value={form.sortOrder} onChange={(e) => setForm({ ...form, sortOrder: parseInt(e.target.value) || 0 })} className="w-full px-3 py-2 rounded-lg border border-border dark:border-border-dark bg-surface-alt dark:bg-surface-dark-alt text-sm" /></div>
          </div>
          <div className="flex items-center gap-2">
            <input type="checkbox" checked={form.isActive} onChange={(e) => setForm({ ...form, isActive: e.target.checked })} id="active" />
            <label htmlFor="active" className="text-sm font-bold">نشط</label>
          </div>
          <div className="flex gap-2">
            <button onClick={handleSave} className="px-5 py-2 bg-crimson text-white rounded-lg font-bold text-sm">{editing ? "تحديث" : "إنشاء"}</button>
            <button onClick={() => { setShowForm(false); setEditing(null); }} className="px-5 py-2 bg-surface-alt dark:bg-surface-dark-alt rounded-lg font-bold text-sm">إلغاء</button>
          </div>
        </div>
      )}

      <DataTable columns={columns} data={data} loading={loading} onEdit={handleEdit} onDelete={handleDelete} emptyMessage="لا توجد أقسام" />
    </div>
  );
}
