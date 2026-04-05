"use client";
import { useEffect, useState, useCallback } from "react";
import { useAuth } from "@/hooks/useAuth";
import { adminApi } from "@/lib/api";
import DataTable from "@/components/admin/DataTable";
interface User { id: number; name: string; email: string; role: string; isActive: boolean; lastLogin: string; }
const roleLabels: Record<string, string> = { SUPER_ADMIN: "مدير عام", ADMIN: "مدير", EDITOR_IN_CHIEF: "رئيس تحرير", EDITOR: "محرر", AUTHOR: "كاتب", MEDIA_MANAGER: "مدير وسائط" };
export default function AdminUsersPage() {
  const { token } = useAuth();
  const [data, setData] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<User | null>(null);
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "EDITOR" });
  const fetchData = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    try {
      const res = (await adminApi.crud("users", token).list({ limit: "50" })) as { data: User[] };
      setData(res.data || []);
    } catch {}
    setLoading(false);
  }, [token]);
  useEffect(() => { fetchData(); }, [fetchData]);
  const handleSave = async () => {
    if (!token) return;
    const crud = adminApi.crud("users", token);
    try {
      const payload = editing ? { name: form.name, email: form.email, role: form.role, ...(form.password ? { password: form.password } : {}) } : form;
      if (editing) await crud.update(editing.id, payload);
      else await crud.create(payload);
      setShowForm(false);
      setEditing(null);
      setForm({ name: "", email: "", password: "", role: "EDITOR" });
      fetchData();
    } catch {}
  };
  const handleEdit = (item: User) => { setEditing(item); setForm({ name: item.name, email: item.email, password: "", role: item.role }); setShowForm(true); };
  const handleDelete = async (item: User) => {
    if (!token) return;
    await adminApi.crud("users", token).remove(item.id);
    fetchData();
  };
  return (
    <div>
      <div className="flex items-center justify-between mb-6"><h1 className="text-2xl font-extrabold">المستخدمون</h1>
        <button onClick={() => { setShowForm(true); setEditing(null); setForm({ name: "", email: "", password: "", role: "EDITOR" }); }} className="px-5 py-2.5 bg-crimson text-white rounded-xl font-bold text-sm">+ مستخدم جديد</button>
      </div>
      {showForm && (
        <div className="bg-surface dark:bg-surface-dark rounded-xl border border-border dark:border-border-dark p-6 mb-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div><label className="block text-sm font-bold mb-1">الاسم</label><input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-border dark:border-border-dark bg-surface-alt dark:bg-surface-dark-alt text-sm" /></div>
            <div><label className="block text-sm font-bold mb-1">البريد الإلكتروني</label><input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-border dark:border-border-dark bg-surface-alt dark:bg-surface-dark-alt text-sm" dir="ltr" /></div>
            <div><label className="block text-sm font-bold mb-1">كلمة المرور {editing && "(اتركها فارغة لعدم التغيير)"}</label><input type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-border dark:border-border-dark bg-surface-alt dark:bg-surface-dark-alt text-sm" dir="ltr" /></div>
            <div><label className="block text-sm font-bold mb-1">الدور</label>
              <select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-border dark:border-border-dark bg-surface-alt dark:bg-surface-dark-alt text-sm">
                {Object.entries(roleLabels).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
              </select>
            </div>
          </div>
          <div className="flex gap-2"><button onClick={handleSave} className="px-5 py-2 bg-crimson text-white rounded-lg font-bold text-sm">{editing ? "تحديث" : "إنشاء"}</button><button onClick={() => setShowForm(false)} className="px-5 py-2 bg-surface-alt dark:bg-surface-dark-alt rounded-lg font-bold text-sm">إلغاء</button></div>
        </div>
      )}
      <DataTable columns={[
        { key: "name", label: "الاسم", render: (item: User) => <span className="font-bold">{item.name}</span> },
        { key: "email", label: "البريد", render: (item: User) => <span dir="ltr" className="text-xs">{item.email}</span> },
        { key: "role", label: "الدور", render: (item: User) => <span className="text-xs font-bold">{roleLabels[item.role] || item.role}</span> },
        { key: "isActive", label: "الحالة", render: (item: User) => item.isActive ? <span className="text-green-600 font-bold text-xs">نشط</span> : <span className="text-gray-400 text-xs">معطل</span> },
      ]} data={data} loading={loading} onEdit={handleEdit} onDelete={handleDelete} />
    </div>
  );
}
