"use client";

import { useParams } from "next/navigation";
import ArticleEditorForm from "@/components/admin/ArticleEditorForm";

export default function EditArticlePage() {
  const params = useParams<{ id: string }>();
  const id = Number(params.id);

  if (!id || Number.isNaN(id)) {
    return <p className="text-sm text-crimson">معرف المقال غير صالح.</p>;
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-extrabold">تعديل المقال</h1>
      </div>
      <ArticleEditorForm articleId={id} />
    </div>
  );
}
