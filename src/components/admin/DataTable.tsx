"use client";

import { useState } from "react";

interface Column<T> {
  key: string;
  label: string;
  render?: (item: T) => React.ReactNode;
  sortable?: boolean;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  onEdit?: (item: T) => void;
  onDelete?: (item: T) => void;
  loading?: boolean;
  emptyMessage?: string;
  meta?: { page: number; limit: number; total: number; totalPages: number };
  onPageChange?: (page: number) => void;
}

export default function DataTable<T extends { id: number | string }>({
  columns,
  data,
  onEdit,
  onDelete,
  loading,
  emptyMessage = "لا توجد بيانات",
  meta,
  onPageChange,
}: DataTableProps<T>) {
  const [deleteId, setDeleteId] = useState<number | string | null>(null);

  if (loading) {
    return (
      <div className="bg-surface dark:bg-surface-dark rounded-xl border border-border dark:border-border-dark p-8 text-center">
        <p className="text-text-secondary dark:text-text-dark-secondary">جارٍ التحميل...</p>
      </div>
    );
  }

  if (!data.length) {
    return (
      <div className="bg-surface dark:bg-surface-dark rounded-xl border border-border dark:border-border-dark p-8 text-center">
        <p className="text-text-secondary dark:text-text-dark-secondary">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="bg-surface dark:bg-surface-dark rounded-xl border border-border dark:border-border-dark overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-surface-alt dark:bg-surface-dark-alt border-b border-border dark:border-border-dark">
              {columns.map((col) => (
                <th key={col.key} className="px-4 py-3 text-right font-bold text-text-secondary dark:text-text-dark-secondary whitespace-nowrap">
                  {col.label}
                </th>
              ))}
              {(onEdit || onDelete) && (
                <th className="px-4 py-3 text-right font-bold text-text-secondary dark:text-text-dark-secondary w-32">
                  إجراءات
                </th>
              )}
            </tr>
          </thead>
          <tbody>
            {data.map((item) => (
              <tr key={item.id} className="border-b border-border dark:border-border-dark last:border-0 hover:bg-surface-alt/50 dark:hover:bg-surface-dark-alt/50">
                {columns.map((col) => (
                  <td key={col.key} className="px-4 py-3">
                    {col.render ? col.render(item) : String((item as Record<string, unknown>)[col.key] ?? "")}
                  </td>
                ))}
                {(onEdit || onDelete) && (
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      {onEdit && (
                        <button onClick={() => onEdit(item)} className="px-3 py-1 text-xs font-bold rounded-md bg-navy/10 dark:bg-white/10 hover:bg-navy/20 dark:hover:bg-white/20 transition-colors">
                          تعديل
                        </button>
                      )}
                      {onDelete && (
                        <>
                          {deleteId === item.id ? (
                            <div className="flex items-center gap-1">
                              <button onClick={() => { onDelete(item); setDeleteId(null); }} className="px-2 py-1 text-xs font-bold rounded-md bg-crimson text-white">
                                تأكيد
                              </button>
                              <button onClick={() => setDeleteId(null)} className="px-2 py-1 text-xs font-bold rounded-md bg-surface-alt dark:bg-surface-dark-alt">
                                إلغاء
                              </button>
                            </div>
                          ) : (
                            <button onClick={() => setDeleteId(item.id)} className="px-3 py-1 text-xs font-bold rounded-md text-crimson bg-crimson/10 hover:bg-crimson/20 transition-colors">
                              حذف
                            </button>
                          )}
                        </>
                      )}
                    </div>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {meta && meta.totalPages > 1 && (
        <div className="flex items-center justify-between px-4 py-3 border-t border-border dark:border-border-dark">
          <p className="text-xs text-text-secondary dark:text-text-dark-secondary">
            عرض {(meta.page - 1) * meta.limit + 1} - {Math.min(meta.page * meta.limit, meta.total)} من {meta.total}
          </p>
          <div className="flex items-center gap-1">
            <button
              onClick={() => onPageChange?.(meta.page - 1)}
              disabled={meta.page <= 1}
              className="px-3 py-1.5 text-xs font-bold rounded-md border border-border dark:border-border-dark disabled:opacity-40 hover:bg-surface-alt dark:hover:bg-surface-dark-alt"
            >
              السابق
            </button>
            <span className="px-3 py-1.5 text-xs">{meta.page} / {meta.totalPages}</span>
            <button
              onClick={() => onPageChange?.(meta.page + 1)}
              disabled={meta.page >= meta.totalPages}
              className="px-3 py-1.5 text-xs font-bold rounded-md border border-border dark:border-border-dark disabled:opacity-40 hover:bg-surface-alt dark:hover:bg-surface-dark-alt"
            >
              التالي
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
