"use client";

import { useEffect, useState, useCallback } from "react";
import { useAuth } from "@/hooks/useAuth";
import { adminApi } from "@/lib/api";
import DataTable from "@/components/admin/DataTable";

interface Author { id: number; slug: string; name: string; role: string; bio: string; avatar: string; isActive: boolean; _count?: { articles: number }; }

export default function AdminAuthorsPage() {
  const { token } = useAuth();
  const [data, setData] = useState<Author[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Author | null>(null);
  const [form, setForm] = useState({ name: "", slug: "", role: "", bio: "", avatar: "" });

  const fetchData = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    try {
      const res = (await adminApi.crud("authors", token).list({ limit: "50" })) as { data: Author[] };
      setData(res.data || []);
    } catch {}
    setLoading(false);
  }, [token]);
  useEffect(() => { fetchData(); }, [fetchData]);

  const handleSave = async () => {
    if (!token) return;
    const crud = adminApi.crud("authors", token);
    try {
      if (editing) await crud.update(editing.id, form);
      else await crud.create(form);
      setShowForm(false);
      setEditing(null);
      fetchData();
    } catch {}
  };
  const handleEdit = (item: Author) => { setEditing(item); setForm({ name: item.name, slug: item.slug, role: item.role || "", bio: item.bio || "", avatar: item.avatar || "" }); setShowForm(true); };
  const handleDelete = async (item: Author) => {
    if (!token) return;
    await adminApi.crud("authors", token).remove(item.id);
    fetchData();
  };

  const columns = [
    { key: "name", label: "الاسم", render: (item: Author) => <span className="font-bold">{item.name}</span> },
    { key: "role", label: "الدور" },
    { key: "articles", label: "المقالات", render: (item: Author) => item._count?.articles ?? 0 },
    { key: "isActive", label: "الحالة", render: (item: Author) => item.isActive ? <span className="text-green-600 font-bold text-xs">نشط</span> : <span className="text-gray-400 text-xs">غير نشط</span> },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-extrabold">الكتّاب</h1>
        <button onClick={() => { setShowForm(true); setEditing(null); setForm({ name: "", slug: "", role: "", bio: "", avatar: "" }); }} className="px-5 py-2.5 bg-crimson text-white rounded-xl font-bold hover:bg-crimson-light transition-colors text-sm">+ كاتب جديد</button>
      </div>
      {showForm && (
        <div className="bg-surface dark:bg-surface-dark rounded-xl border border-border dark:border-border-dark p-6 mb-6 space-y-4">
          <h2 className="font-extrabold text-lg">{editing ? "تعديل الكاتب" : "كاتب جديد"}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div><label className="block text-sm font-bold mb-1">الاسم</label><input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-border dark:border-border-dark bg-surface-alt dark:bg-surface-dark-alt text-sm" /></div>
            <div><label className="block text-sm font-bold mb-1">الدور</label><input value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-border dark:border-border-dark bg-surface-alt dark:bg-surface-dark-alt text-sm" /></div>
            <div className="md:col-span-2"><label className="block text-sm font-bold mb-1">السيرة</label><textarea value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-border dark:border-border-dark bg-surface-alt dark:bg-surface-dark-alt text-sm" rows={3} /></div>
            <div><label className="block text-sm font-bold mb-1">رابط الصورة</label><input value={form.avatar} onChange={(e) => setForm({ ...form, avatar: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-border dark:border-border-dark bg-surface-alt dark:bg-surface-dark-alt text-sm" dir="ltr" /></div>
          </div>
          <div className="flex gap-2">
            <button onClick={handleSave} className="px-5 py-2 bg-crimson text-white rounded-lg font-bold text-sm">{editing ? "تحديث" : "إنشاء"}</button>
            <button onClick={() => { setShowForm(false); setEditing(null); }} className="px-5 py-2 bg-surface-alt dark:bg-surface-dark-alt rounded-lg font-bold text-sm">إلغاء</button>
          </div>
        </div>
      )}
      <DataTable columns={columns} data={data} loading={loading} onEdit={handleEdit} onDelete={handleDelete} emptyMessage="لا يوجد كتّاب" />
    </div>
  );
}
