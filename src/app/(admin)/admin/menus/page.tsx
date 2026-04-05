"use client";
import { useEffect, useState, useCallback } from "react";
import { useAuth } from "@/hooks/useAuth";
import { adminApi } from "@/lib/api";

interface MenuItem { id: number; label: string; url: string; sortOrder: number; }
interface Menu { id: number; name: string; location: string; isActive: boolean; items: MenuItem[]; }

export default function AdminMenusPage() {
  const { token } = useAuth();
  const [menus, setMenus] = useState<Menu[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Menu | null>(null);
  const [form, setForm] = useState({ name: "", location: "HEADER", isActive: true, itemsText: "" });
  const fetchData = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    try {
      const res = (await adminApi.crud("menus", token).list()) as { data: Menu[] };
      setMenus(res.data || []);
    } catch {}
    setLoading(false);
  }, [token]);
  useEffect(() => { fetchData(); }, [fetchData]);

  const parseItems = () =>
    form.itemsText
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean)
      .map((line) => {
        const [label = "", url = "#", target = "_self", icon = "", isActive = "true"] = line.split("|").map((v) => v.trim());
        return { label, url, target, icon: icon || undefined, isActive: isActive !== "false" };
      });

  const saveMenu = async () => {
    if (!token) return;
    const payload = { name: form.name, location: form.location, isActive: form.isActive, items: parseItems() };
    const crud = adminApi.crud("menus", token);
    if (editing) await crud.update(editing.id, payload);
    else await crud.create(payload);
    setShowForm(false);
    setEditing(null);
    setForm({ name: "", location: "HEADER", isActive: true, itemsText: "" });
    fetchData();
  };

  const editMenu = async (id: number) => {
    if (!token) return;
    const res = (await adminApi.crud("menus", token).get(id)) as { data: Menu & { items: Array<{ label: string; url: string; target?: string; icon?: string; isActive?: boolean }> } };
    const m = res.data;
    setEditing(m);
    setForm({
      name: m.name || "",
      location: m.location || "HEADER",
      isActive: m.isActive,
      itemsText: (m.items || []).map((i) => `${i.label}|${i.url}|${i.target || "_self"}|${i.icon || ""}|${i.isActive !== false}`).join("\n"),
    });
    setShowForm(true);
  };

  const removeMenu = async (id: number) => {
    if (!token) return;
    await adminApi.crud("menus", token).remove(id);
    fetchData();
  };

  if (loading) return <div className="p-8 text-center">جارٍ التحميل...</div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-extrabold">القوائم</h1>
        <button onClick={() => { setEditing(null); setShowForm(true); setForm({ name: "", location: "HEADER", isActive: true, itemsText: "" }); }} className="px-5 py-2.5 bg-crimson text-white rounded-xl font-bold text-sm">+ قائمة جديدة</button>
      </div>

      {showForm && (
        <div className="bg-surface dark:bg-surface-dark rounded-xl border border-border dark:border-border-dark p-6 mb-6 space-y-3">
          <h2 className="font-extrabold text-lg">{editing ? "تعديل القائمة" : "إنشاء قائمة"}</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <input value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} placeholder="اسم القائمة" className="px-3 py-2 rounded-lg border text-sm" />
            <select value={form.location} onChange={(e) => setForm((p) => ({ ...p, location: e.target.value }))} className="px-3 py-2 rounded-lg border text-sm">
              <option value="HEADER">HEADER</option>
              <option value="FOOTER">FOOTER</option>
              <option value="MOBILE">MOBILE</option>
            </select>
            <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={form.isActive} onChange={(e) => setForm((p) => ({ ...p, isActive: e.target.checked }))} />نشط</label>
          </div>
          <div>
            <label className="block text-sm font-bold mb-1">العناصر (سطر لكل عنصر): label|url|target|icon|isActive</label>
            <textarea rows={6} value={form.itemsText} onChange={(e) => setForm((p) => ({ ...p, itemsText: e.target.value }))} className="w-full px-3 py-2 rounded-lg border text-sm" dir="ltr" placeholder="الرئيسية|/|_self||true" />
          </div>
          <div className="flex gap-2">
            <button onClick={saveMenu} className="px-4 py-2 bg-crimson text-white rounded-lg text-sm font-bold">{editing ? "تحديث" : "إنشاء"}</button>
            <button onClick={() => setShowForm(false)} className="px-4 py-2 bg-surface-alt dark:bg-surface-dark-alt rounded-lg text-sm font-bold">إلغاء</button>
          </div>
        </div>
      )}

      <div className="space-y-6">
        {menus.map((menu) => (
          <div key={menu.id} className="bg-surface dark:bg-surface-dark rounded-xl border border-border dark:border-border-dark p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="font-extrabold text-lg">{menu.name}</h2>
                <p className="text-xs text-text-secondary dark:text-text-dark-secondary">الموقع: {menu.location}</p>
              </div>
              <span className={`text-xs font-bold ${menu.isActive ? "text-green-600" : "text-gray-400"}`}>
                {menu.isActive ? "نشط" : "معطل"}
              </span>
            </div>
            <div className="space-y-2">
              {menu.items?.map((item) => (
                <div key={item.id} className="flex items-center justify-between px-4 py-2 rounded-lg bg-surface-alt dark:bg-surface-dark-alt">
                  <span className="font-bold text-sm">{item.label}</span>
                  <span className="text-xs text-text-secondary dark:text-text-dark-secondary" dir="ltr">{item.url}</span>
                </div>
              ))}
            </div>
            <div className="flex gap-2 mt-4">
              <button onClick={() => editMenu(menu.id)} className="px-3 py-1.5 rounded-lg text-xs font-bold bg-surface-alt dark:bg-surface-dark-alt">تعديل</button>
              <button onClick={() => removeMenu(menu.id)} className="px-3 py-1.5 rounded-lg text-xs font-bold bg-crimson/10 text-crimson">حذف</button>
            </div>
          </div>
        ))}
        {menus.length === 0 && <p className="text-center text-text-secondary dark:text-text-dark-secondary">لا توجد قوائم</p>}
      </div>
    </div>
  );
}
