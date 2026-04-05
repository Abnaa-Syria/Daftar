"use client";
import { useEffect, useState, useCallback } from "react";
import { useAuth } from "@/hooks/useAuth";
import { adminApi } from "@/lib/api";
import DataTable from "@/components/admin/DataTable";

interface BreakingItem {
  id: number;
  title: string;
  sortOrder: number;
  isActive: boolean;
  publishedAt: string;
  article?: { id: number; slug: string; title: string };
}

interface ArticleItem {
  id: number;
  title: string;
}

export default function AdminBreakingPage() {
  const { token } = useAuth();
  const [data, setData] = useState<BreakingItem[]>([]);
  const [articles, setArticles] = useState<ArticleItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<BreakingItem | null>(null);
  const [form, setForm] = useState({ title: "", articleId: "", sortOrder: 0, isActive: true });

  const fetchData = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    try {
      const res = (await adminApi.crud("breaking", token).list({ limit: "50" })) as { data: BreakingItem[] };
      setData(res.data || []);
    } catch {}
    setLoading(false);
  }, [token]);
  useEffect(() => { fetchData(); }, [fetchData]);
  useEffect(() => {
    if (!token) return;
    adminApi.crud("articles", token).list({ status: "PUBLISHED", limit: "200" })
      .then((res) => setArticles(((res as { data: ArticleItem[] }).data || [])))
      .catch(() => setArticles([]));
  }, [token]);

  const handleSave = async () => {
    if (!token) return;
    const crud = adminApi.crud("breaking", token);
    try {
      const payload = {
        title: form.title.trim(),
        articleId: form.articleId ? Number(form.articleId) : undefined,
        sortOrder: form.sortOrder,
        isActive: form.isActive,
      };
      if (editing) await crud.update(editing.id, payload);
      else await crud.create(payload);
      setShowForm(false);
      setEditing(null);
      setForm({ title: "", articleId: "", sortOrder: 0, isActive: true });
      fetchData();
    } catch {}
  };
  const handleEdit = (item: BreakingItem) => {
    setEditing(item);
    setForm({ title: item.title, articleId: item.article?.id ? String(item.article.id) : "", sortOrder: item.sortOrder, isActive: item.isActive });
    setShowForm(true);
  };
  const handleDelete = async (item: BreakingItem) => {
    if (!token) return;
    await adminApi.crud("breaking", token).remove(item.id);
    fetchData();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-extrabold">الأخبار العاجلة</h1>
        <button onClick={() => { setShowForm(true); setEditing(null); setForm({ title: "", articleId: "", sortOrder: 0, isActive: true }); }} className="px-5 py-2.5 bg-crimson text-white rounded-xl font-bold text-sm">+ خبر عاجل</button>
      </div>
      {showForm && (
        <div className="bg-surface dark:bg-surface-dark rounded-xl border border-border dark:border-border-dark p-6 mb-6 space-y-4">
          <div>
            <label className="block text-sm font-bold mb-1">ربط بمقال منشور (اختياري)</label>
            <select
              value={form.articleId}
              onChange={(e) => {
                const selectedId = e.target.value;
                const selected = articles.find((a) => a.id === Number(selectedId));
                setForm((prev) => ({
                  ...prev,
                  articleId: selectedId,
                  title: prev.title || selected?.title || "",
                }));
              }}
              className="w-full px-3 py-2 rounded-lg border border-border dark:border-border-dark bg-surface-alt dark:bg-surface-dark-alt text-sm"
            >
              <option value="">بدون ربط</option>
              {articles.map((a) => (
                <option key={a.id} value={a.id}>{a.title}</option>
              ))}
            </select>
          </div>
          <div><label className="block text-sm font-bold mb-1">نص الخبر العاجل (اتركه فارغًا ليأخذ عنوان المقال)</label><input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-border dark:border-border-dark bg-surface-alt dark:bg-surface-dark-alt text-sm" /></div>
          <div className="flex gap-4 items-end">
            <div><label className="block text-sm font-bold mb-1">الترتيب</label><input type="number" value={form.sortOrder} onChange={(e) => setForm({ ...form, sortOrder: parseInt(e.target.value) || 0 })} className="w-24 px-3 py-2 rounded-lg border border-border dark:border-border-dark bg-surface-alt dark:bg-surface-dark-alt text-sm" /></div>
            <div className="flex items-end gap-2 pb-1"><input type="checkbox" checked={form.isActive} onChange={(e) => setForm({ ...form, isActive: e.target.checked })} id="active" /><label htmlFor="active" className="text-sm font-bold">نشط</label></div>
          </div>
          <div className="flex gap-2">
            <button onClick={handleSave} className="px-5 py-2 bg-crimson text-white rounded-lg font-bold text-sm">{editing ? "تحديث" : "إنشاء"}</button>
            <button onClick={() => setShowForm(false)} className="px-5 py-2 bg-surface-alt dark:bg-surface-dark-alt rounded-lg font-bold text-sm">إلغاء</button>
          </div>
        </div>
      )}
      <DataTable columns={[
        { key: "title", label: "النص", render: (item: BreakingItem) => <span className="font-bold">{item.title}</span> },
        { key: "article", label: "المقال المرتبط", render: (item: BreakingItem) => item.article ? <span className="text-xs" dir="ltr">{item.article.title}</span> : "—" },
        { key: "sortOrder", label: "الترتيب" },
        { key: "isActive", label: "الحالة", render: (item: BreakingItem) => item.isActive ? <span className="text-green-600 font-bold text-xs">نشط</span> : <span className="text-gray-400 text-xs">غير نشط</span> },
      ]} data={data} loading={loading} onEdit={handleEdit} onDelete={handleDelete} />
    </div>
  );
}
