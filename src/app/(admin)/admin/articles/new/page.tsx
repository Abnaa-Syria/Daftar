"use client";

import ArticleEditorForm from "@/components/admin/ArticleEditorForm";

export default function NewArticlePage() {
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-extrabold">إنشاء مقال جديد</h1>
      </div>
      <ArticleEditorForm />
    </div>
  );
}
