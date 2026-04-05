"use client";
import { useEffect, useState, useCallback } from "react";
import { useAuth } from "@/hooks/useAuth";
import { adminApi } from "@/lib/api";

interface HomepageModule { id: number; type: string; title: string; sectionSlug: string; sortOrder: number; isActive: boolean; }

const typeLabels: Record<string, string> = {
  HERO_SLIDER: "سلايدر رئيسي",
  BREAKING_TICKER: "شريط عاجل",
  FEATURED_WITH_THUMBNAILS: "مميز مع صور مصغرة",
  CARD_CAROUSEL: "كاروسيل بطاقات",
  GRID_LAYOUT: "شبكة",
  SPLIT_LIST_FEATURED: "قائمة مقسمة",
  INFOGRAPHIC_CAROUSEL: "كاروسيل انفوجراف",
  MOST_READ_CAROUSEL: "الأكثر قراءة",
  SPECIAL_FILE_HIGHLIGHT: "ملف خاص",
  NEWSLETTER_CTA: "نشرة بريدية",
  TWO_ROW_GRID: "شبكة صفين",
};

export default function AdminHomepagePage() {
  const { token } = useAuth();
  const [modules, setModules] = useState<HomepageModule[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<HomepageModule | null>(null);
  const [form, setForm] = useState({ type: "HERO_SLIDER", title: "", sectionSlug: "", layout: "", isActive: true, articleIdsText: "" });

  const fetchData = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    try {
      const res = await adminApi.crud("homepage-modules", token).list() as { data: HomepageModule[] };
      setModules((res.data || []).sort((a, b) => a.sortOrder - b.sortOrder));
    } catch {}
    setLoading(false);
  }, [token]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const toggleActive = async (mod: HomepageModule) => {
    if (!token) return;
    await adminApi.crud("homepage-modules", token).update(mod.id, { isActive: !mod.isActive });
    fetchData();
  };

  const moveUp = async (index: number) => {
    if (index <= 0 || !token) return;
    const newOrder = [...modules];
    [newOrder[index - 1], newOrder[index]] = [newOrder[index], newOrder[index - 1]];
    const ids = newOrder.map((m) => m.id);
    await adminApi.reorderHomepage(token, ids);
    fetchData();
  };

  const moveDown = async (index: number) => {
    if (index >= modules.length - 1 || !token) return;
    const newOrder = [...modules];
    [newOrder[index], newOrder[index + 1]] = [newOrder[index + 1], newOrder[index]];
    const ids = newOrder.map((m) => m.id);
    await adminApi.reorderHomepage(token, ids);
    fetchData();
  };

  const loadEdit = async (id: number) => {
    if (!token) return;
    const res = (await adminApi.crud("homepage-modules", token).get(id)) as { data: HomepageModule & { items?: { articleId?: number }[]; layout?: string } };
    const mod = res.data;
    setEditing(mod);
    setForm({
      type: mod.type,
      title: mod.title || "",
      sectionSlug: mod.sectionSlug || "",
      layout: mod.layout || "",
      isActive: mod.isActive,
      articleIdsText: (mod.items || []).map((i) => i.articleId).filter(Boolean).join(", "),
    });
    setShowForm(true);
  };

  const saveModule = async () => {
    if (!token) return;
    const articleIds = form.articleIdsText.split(",").map((v) => parseInt(v.trim(), 10)).filter((n) => !Number.isNaN(n));
    const payload = {
      type: form.type,
      title: form.title || undefined,
      sectionSlug: form.sectionSlug || undefined,
      layout: form.layout || undefined,
      isActive: form.isActive,
      articleIds,
    };
    const crud = adminApi.crud("homepage-modules", token);
    if (editing) await crud.update(editing.id, payload);
    else await crud.create(payload);
    setShowForm(false);
    setEditing(null);
    setForm({ type: "HERO_SLIDER", title: "", sectionSlug: "", layout: "", isActive: true, articleIdsText: "" });
    fetchData();
  };

  const removeModule = async (id: number) => {
    if (!token) return;
    await adminApi.crud("homepage-modules", token).remove(id);
    fetchData();
  };

  if (loading) return <div className="p-8 text-center">جارٍ التحميل...</div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-extrabold">إدارة الصفحة الرئيسية</h1>
        <button onClick={() => { setEditing(null); setShowForm(true); setForm({ type: "HERO_SLIDER", title: "", sectionSlug: "", layout: "", isActive: true, articleIdsText: "" }); }} className="px-5 py-2.5 bg-crimson text-white rounded-xl font-bold text-sm">+ موديول جديد</button>
      </div>
      <p className="text-sm text-text-secondary dark:text-text-dark-secondary mb-4">قم بترتيب وتفعيل/تعطيل وحدات الصفحة الرئيسية. اسحب لإعادة الترتيب.</p>

      {showForm && (
        <div className="bg-surface dark:bg-surface-dark rounded-xl border border-border dark:border-border-dark p-5 mb-5 space-y-3">
          <h2 className="font-bold">{editing ? "تعديل موديول" : "موديول جديد"}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <select value={form.type} onChange={(e) => setForm((p) => ({ ...p, type: e.target.value }))} className="px-3 py-2 rounded-lg border text-sm">{Object.keys(typeLabels).map((k) => <option key={k} value={k}>{typeLabels[k]}</option>)}</select>
            <input value={form.title} onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))} placeholder="العنوان" className="px-3 py-2 rounded-lg border text-sm" />
            <input value={form.sectionSlug} onChange={(e) => setForm((p) => ({ ...p, sectionSlug: e.target.value }))} placeholder="sectionSlug" className="px-3 py-2 rounded-lg border text-sm" dir="ltr" />
            <input value={form.layout} onChange={(e) => setForm((p) => ({ ...p, layout: e.target.value }))} placeholder="layout" className="px-3 py-2 rounded-lg border text-sm" dir="ltr" />
            <div className="md:col-span-2">
              <input value={form.articleIdsText} onChange={(e) => setForm((p) => ({ ...p, articleIdsText: e.target.value }))} placeholder="Article IDs comma separated: 1,2,3" className="w-full px-3 py-2 rounded-lg border text-sm" dir="ltr" />
            </div>
            <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={form.isActive} onChange={(e) => setForm((p) => ({ ...p, isActive: e.target.checked }))} />نشط</label>
          </div>
          <div className="flex gap-2">
            <button onClick={saveModule} className="px-4 py-2 bg-crimson text-white rounded-lg text-sm font-bold">{editing ? "تحديث" : "إنشاء"}</button>
            <button onClick={() => setShowForm(false)} className="px-4 py-2 rounded-lg bg-surface-alt dark:bg-surface-dark-alt text-sm font-bold">إلغاء</button>
          </div>
        </div>
      )}

      <div className="space-y-3">
        {modules.map((mod, idx) => (
          <div key={mod.id} className={`flex items-center gap-4 p-4 rounded-xl border ${mod.isActive ? "bg-surface dark:bg-surface-dark border-border dark:border-border-dark" : "bg-surface-alt/50 dark:bg-surface-dark-alt/50 border-border/50 dark:border-border-dark/50 opacity-60"}`}>
            <div className="flex flex-col gap-1">
              <button onClick={() => moveUp(idx)} disabled={idx === 0} className="text-xs text-text-secondary hover:text-text-primary disabled:opacity-30">▲</button>
              <button onClick={() => moveDown(idx)} disabled={idx === modules.length - 1} className="text-xs text-text-secondary hover:text-text-primary disabled:opacity-30">▼</button>
            </div>
            <div className="flex-1">
              <p className="font-bold">{mod.title || typeLabels[mod.type] || mod.type}</p>
              <p className="text-xs text-text-secondary dark:text-text-dark-secondary mt-0.5">
                النوع: {typeLabels[mod.type] || mod.type}
                {mod.sectionSlug && ` | القسم: ${mod.sectionSlug}`}
              </p>
            </div>
            <div className="text-sm font-bold text-text-secondary dark:text-text-dark-secondary">#{mod.sortOrder}</div>
            <button onClick={() => toggleActive(mod)} className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-colors ${mod.isActive ? "bg-green-500/10 text-green-600" : "bg-gray-200 dark:bg-gray-700 text-gray-500"}`}>
              {mod.isActive ? "نشط" : "معطل"}
            </button>
            <button onClick={() => loadEdit(mod.id)} className="px-3 py-1.5 rounded-lg text-xs font-bold bg-surface-alt dark:bg-surface-dark-alt">تعديل</button>
            <button onClick={() => removeModule(mod.id)} className="px-3 py-1.5 rounded-lg text-xs font-bold bg-crimson/10 text-crimson">حذف</button>
          </div>
        ))}
      </div>
    </div>
  );
}
