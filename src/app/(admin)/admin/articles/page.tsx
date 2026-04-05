"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { adminApi } from "@/lib/api";
import DataTable from "@/components/admin/DataTable";

interface Article {
  id: number;
  title: string;
  slug: string;
  status: string;
  section?: { name: string; color: string };
  author?: { name: string };
  views: number;
  publishedAt: string;
  isFeatured: boolean;
  isBreaking: boolean;
}

const statusLabels: Record<string, { label: string; color: string }> = {
  DRAFT: { label: "مسودة", color: "#888" },
  IN_REVIEW: { label: "قيد المراجعة", color: "#f59e0b" },
  SCHEDULED: { label: "مجدول", color: "#3b82f6" },
  PUBLISHED: { label: "منشور", color: "#22c55e" },
  ARCHIVED: { label: "مؤرشف", color: "#6b7280" },
};

export default function AdminArticlesPage() {
  const { token } = useAuth();
  const [data, setData] = useState<Article[]>([]);
  const [meta, setMeta] = useState<{ page: number; limit: number; total: number; totalPages: number } | undefined>();
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const fetchData = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    try {
      const params: Record<string, string> = { page: String(page), limit: "15" };
      if (search) params.search = search;
      if (statusFilter) params.status = statusFilter;
      const res = await adminApi.crud("articles", token).list(params) as { data: Article[]; meta: typeof meta };
      setData(res.data || []);
      setMeta(res.meta);
    } catch { /* empty */ }
    setLoading(false);
  }, [token, page, search, statusFilter]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleDelete = async (article: Article) => {
    if (!token) return;
    try {
      await adminApi.crud("articles", token).remove(article.id);
      fetchData();
    } catch { /* empty */ }
  };

  const columns = [
    {
      key: "title",
      label: "العنوان",
      render: (item: Article) => (
        <div className="max-w-xs">
          <p className="font-bold line-clamp-1">{item.title}</p>
          <p className="text-xs text-text-secondary dark:text-text-dark-secondary mt-0.5" dir="ltr">{item.slug}</p>
        </div>
      ),
    },
    {
      key: "section",
      label: "القسم",
      render: (item: Article) => item.section ? (
        <span className="px-2 py-1 rounded text-xs font-bold text-white" style={{ backgroundColor: item.section.color }}>
          {item.section.name}
        </span>
      ) : "—",
    },
    {
      key: "author",
      label: "الكاتب",
      render: (item: Article) => item.author?.name || "—",
    },
    {
      key: "status",
      label: "الحالة",
      render: (item: Article) => {
        const s = statusLabels[item.status] || { label: item.status, color: "#888" };
        return (
          <span className="px-2 py-1 rounded text-xs font-bold text-white" style={{ backgroundColor: s.color }}>
            {s.label}
          </span>
        );
      },
    },
    {
      key: "flags",
      label: "علامات",
      render: (item: Article) => (
        <div className="flex gap-1">
          {item.isFeatured && <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-gold/20 text-gold">مميز</span>}
          {item.isBreaking && <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-crimson/20 text-crimson">عاجل</span>}
        </div>
      ),
    },
    {
      key: "views",
      label: "المشاهدات",
      render: (item: Article) => item.views.toLocaleString("ar-EG"),
    },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-extrabold">المقالات</h1>
        <Link
          href="/admin/articles/new"
          className="px-5 py-2.5 bg-crimson text-white rounded-xl font-bold hover:bg-crimson-light transition-colors text-sm"
        >
          + مقال جديد
        </Link>
      </div>

      <div className="flex flex-wrap items-center gap-3 mb-4">
        <input
          type="text"
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          placeholder="بحث بالعنوان..."
          className="px-4 py-2 rounded-lg border border-border dark:border-border-dark bg-surface dark:bg-surface-dark text-sm w-64"
        />
        <select
          value={statusFilter}
          onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
          className="px-4 py-2 rounded-lg border border-border dark:border-border-dark bg-surface dark:bg-surface-dark text-sm"
        >
          <option value="">كل الحالات</option>
          <option value="DRAFT">مسودة</option>
          <option value="IN_REVIEW">قيد المراجعة</option>
          <option value="SCHEDULED">مجدول</option>
          <option value="PUBLISHED">منشور</option>
          <option value="ARCHIVED">مؤرشف</option>
        </select>
      </div>

      <DataTable
        columns={columns}
        data={data}
        loading={loading}
        meta={meta}
        onPageChange={setPage}
        onEdit={(item) => { window.location.href = `/admin/articles/${item.id}`; }}
        onDelete={handleDelete}
        emptyMessage="لا توجد مقالات"
      />
    </div>
  );
}
