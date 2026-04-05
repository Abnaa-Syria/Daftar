"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { adminApi } from "@/lib/api";

interface OptionItem {
  id: number;
  name: string;
}

interface ArticlePayload {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  image: string;
  sectionId?: number;
  authorId?: number;
  seriesId?: number;
  status: "DRAFT" | "IN_REVIEW" | "SCHEDULED" | "PUBLISHED" | "ARCHIVED";
  publishedAt: string;
  scheduledAt: string;
  readTime: number;
  views: number;
  isFeatured: boolean;
  isBreaking: boolean;
  isExclusive: boolean;
  isAnalysis: boolean;
  isPinnedHome: boolean;
  isPinnedSection: boolean;
  sortOrder: number;
  metaTitle: string;
  metaDescription: string;
  ogImage: string;
  tagIdsText: string;
  galleryImagesText: string;
}

const initialState: ArticlePayload = {
  title: "",
  slug: "",
  excerpt: "",
  content: "",
  image: "",
  sectionId: undefined,
  authorId: undefined,
  seriesId: undefined,
  status: "DRAFT",
  publishedAt: "",
  scheduledAt: "",
  readTime: 0,
  views: 0,
  isFeatured: false,
  isBreaking: false,
  isExclusive: false,
  isAnalysis: false,
  isPinnedHome: false,
  isPinnedSection: false,
  sortOrder: 0,
  metaTitle: "",
  metaDescription: "",
  ogImage: "",
  tagIdsText: "",
  galleryImagesText: "",
};

export default function ArticleEditorForm({ articleId }: { articleId?: number }) {
  const { token } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState<ArticlePayload>(initialState);
  const [sections, setSections] = useState<OptionItem[]>([]);
  const [authors, setAuthors] = useState<OptionItem[]>([]);
  const [series, setSeries] = useState<OptionItem[]>([]);
  const [tags, setTags] = useState<OptionItem[]>([]);

  useEffect(() => {
    if (!token) return;
    const crud = adminApi.crud;
    Promise.all([
      crud("sections", token).list({ limit: "200" }),
      crud("authors", token).list({ limit: "200" }),
      crud("series", token).list({ limit: "200" }),
      crud("tags", token).list({ limit: "300" }),
    ])
      .then(([s, a, sr, t]) => {
        setSections(((s as { data: OptionItem[] }).data || []).map((x) => ({ id: x.id, name: x.name })));
        setAuthors(((a as { data: OptionItem[] }).data || []).map((x) => ({ id: x.id, name: x.name })));
        setSeries(((sr as { data: OptionItem[] }).data || []).map((x) => ({ id: x.id, name: x.name })));
        setTags(((t as { data: OptionItem[] }).data || []).map((x) => ({ id: x.id, name: x.name })));
      })
      .catch(() => {
        setSections([]);
        setAuthors([]);
        setSeries([]);
        setTags([]);
      });
  }, [token]);

  useEffect(() => {
    if (!token || !articleId) return;
    setLoading(true);
    adminApi
      .crud("articles", token)
      .get(articleId)
      .then((res) => {
        const a = (res as { data: Record<string, unknown> }).data;
        const tagIds = ((a.tags as { id: number }[]) || []).map((t) => t.id).join(", ");
        const gallery = ((a.images as { url: string }[]) || []).map((img) => img.url).join("\n");
        setForm({
          title: String(a.title || ""),
          slug: String(a.slug || ""),
          excerpt: String(a.excerpt || ""),
          content: String(a.content || ""),
          image: String(a.image || ""),
          sectionId: a.sectionId ? Number(a.sectionId) : undefined,
          authorId: a.authorId ? Number(a.authorId) : undefined,
          seriesId: a.seriesId ? Number(a.seriesId) : undefined,
          status: (a.status as ArticlePayload["status"]) || "DRAFT",
          publishedAt: a.publishedAt ? new Date(String(a.publishedAt)).toISOString().slice(0, 16) : "",
          scheduledAt: a.scheduledAt ? new Date(String(a.scheduledAt)).toISOString().slice(0, 16) : "",
          readTime: Number(a.readTime || 0),
          views: Number(a.views || 0),
          isFeatured: Boolean(a.isFeatured),
          isBreaking: Boolean(a.isBreaking),
          isExclusive: Boolean(a.isExclusive),
          isAnalysis: Boolean(a.isAnalysis),
          isPinnedHome: Boolean(a.isPinnedHome),
          isPinnedSection: Boolean(a.isPinnedSection),
          sortOrder: Number(a.sortOrder || 0),
          metaTitle: String(a.metaTitle || ""),
          metaDescription: String(a.metaDescription || ""),
          ogImage: String(a.ogImage || ""),
          tagIdsText: tagIds,
          galleryImagesText: gallery,
        });
      })
      .finally(() => setLoading(false));
  }, [token, articleId]);

  const tagsHelp = useMemo(() => tags.slice(0, 20).map((t) => `${t.id}:${t.name}`).join(" | "), [tags]);

  const parseIds = (value: string) =>
    value
      .split(",")
      .map((v) => parseInt(v.trim(), 10))
      .filter((n) => !Number.isNaN(n));

  const parseLines = (value: string) => value.split("\n").map((v) => v.trim()).filter(Boolean);

  const uploadAndSet = async (file: File, field: "image" | "ogImage" | "gallery") => {
    if (!token) return;
    const res = (await adminApi.uploadMedia(token, file)) as { data?: { url?: string } };
    const url = res?.data?.url || "";
    if (!url) return;
    if (field === "gallery") {
      setForm((p) => ({ ...p, galleryImagesText: p.galleryImagesText ? `${p.galleryImagesText}\n${url}` : url }));
      return;
    }
    setForm((p) => ({ ...p, [field]: url }));
  };

  const submit = async () => {
    if (!token) return;
    setSaving(true);
    try {
      const payload = {
        title: form.title,
        slug: form.slug || undefined,
        excerpt: form.excerpt || undefined,
        content: form.content || undefined,
        image: form.image || undefined,
        sectionId: form.sectionId || undefined,
        authorId: form.authorId || undefined,
        seriesId: form.seriesId || undefined,
        status: form.status,
        publishedAt: form.publishedAt || undefined,
        scheduledAt: form.scheduledAt || undefined,
        readTime: form.readTime,
        views: form.views,
        isFeatured: form.isFeatured,
        isBreaking: form.isBreaking,
        isExclusive: form.isExclusive,
        isAnalysis: form.isAnalysis,
        isPinnedHome: form.isPinnedHome,
        isPinnedSection: form.isPinnedSection,
        sortOrder: form.sortOrder,
        metaTitle: form.metaTitle || undefined,
        metaDescription: form.metaDescription || undefined,
        ogImage: form.ogImage || undefined,
        tagIds: parseIds(form.tagIdsText),
        galleryImages: parseLines(form.galleryImagesText),
      };
      const crud = adminApi.crud("articles", token);
      if (articleId) await crud.update(articleId, payload);
      else await crud.create(payload);
      router.push("/admin/articles");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p className="text-center py-10">جارٍ تحميل بيانات المقال...</p>;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div><label className="block text-sm font-bold mb-1">العنوان</label><input value={form.title} onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))} className="w-full px-3 py-2 rounded-lg border text-sm" /></div>
        <div><label className="block text-sm font-bold mb-1">Slug</label><input dir="ltr" value={form.slug} onChange={(e) => setForm((p) => ({ ...p, slug: e.target.value }))} className="w-full px-3 py-2 rounded-lg border text-sm" /></div>
        <div className="md:col-span-2"><label className="block text-sm font-bold mb-1">Excerpt</label><textarea rows={2} value={form.excerpt} onChange={(e) => setForm((p) => ({ ...p, excerpt: e.target.value }))} className="w-full px-3 py-2 rounded-lg border text-sm" /></div>
        <div className="md:col-span-2"><label className="block text-sm font-bold mb-1">المحتوى</label><textarea rows={10} value={form.content} onChange={(e) => setForm((p) => ({ ...p, content: e.target.value }))} className="w-full px-3 py-2 rounded-lg border text-sm" /></div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div><label className="block text-sm font-bold mb-1">القسم</label><select value={form.sectionId || ""} onChange={(e) => setForm((p) => ({ ...p, sectionId: e.target.value ? Number(e.target.value) : undefined }))} className="w-full px-3 py-2 rounded-lg border text-sm"><option value="">—</option>{sections.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}</select></div>
        <div><label className="block text-sm font-bold mb-1">الكاتب</label><select value={form.authorId || ""} onChange={(e) => setForm((p) => ({ ...p, authorId: e.target.value ? Number(e.target.value) : undefined }))} className="w-full px-3 py-2 rounded-lg border text-sm"><option value="">—</option>{authors.map((a) => <option key={a.id} value={a.id}>{a.name}</option>)}</select></div>
        <div><label className="block text-sm font-bold mb-1">السلسلة</label><select value={form.seriesId || ""} onChange={(e) => setForm((p) => ({ ...p, seriesId: e.target.value ? Number(e.target.value) : undefined }))} className="w-full px-3 py-2 rounded-lg border text-sm"><option value="">—</option>{series.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}</select></div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div><label className="block text-sm font-bold mb-1">الحالة</label><select value={form.status} onChange={(e) => setForm((p) => ({ ...p, status: e.target.value as ArticlePayload["status"] }))} className="w-full px-3 py-2 rounded-lg border text-sm"><option value="DRAFT">مسودة</option><option value="IN_REVIEW">قيد المراجعة</option><option value="SCHEDULED">مجدول</option><option value="PUBLISHED">منشور</option><option value="ARCHIVED">مؤرشف</option></select></div>
        <div><label className="block text-sm font-bold mb-1">نشر بتاريخ</label><input type="datetime-local" value={form.publishedAt} onChange={(e) => setForm((p) => ({ ...p, publishedAt: e.target.value }))} className="w-full px-3 py-2 rounded-lg border text-sm" /></div>
        <div><label className="block text-sm font-bold mb-1">جدولة بتاريخ</label><input type="datetime-local" value={form.scheduledAt} onChange={(e) => setForm((p) => ({ ...p, scheduledAt: e.target.value }))} className="w-full px-3 py-2 rounded-lg border text-sm" /></div>
        <div><label className="block text-sm font-bold mb-1">مدة القراءة</label><input type="number" value={form.readTime} onChange={(e) => setForm((p) => ({ ...p, readTime: Number(e.target.value || 0) }))} className="w-full px-3 py-2 rounded-lg border text-sm" /></div>
        <div><label className="block text-sm font-bold mb-1">المشاهدات</label><input type="number" value={form.views} onChange={(e) => setForm((p) => ({ ...p, views: Number(e.target.value || 0) }))} className="w-full px-3 py-2 rounded-lg border text-sm" /></div>
        <div><label className="block text-sm font-bold mb-1">الترتيب</label><input type="number" value={form.sortOrder} onChange={(e) => setForm((p) => ({ ...p, sortOrder: Number(e.target.value || 0) }))} className="w-full px-3 py-2 rounded-lg border text-sm" /></div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {(["isFeatured", "isBreaking", "isExclusive", "isAnalysis", "isPinnedHome", "isPinnedSection"] as const).map((k) => (
          <label key={k} className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={form[k]} onChange={(e) => setForm((p) => ({ ...p, [k]: e.target.checked }))} />
            {k}
          </label>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div><label className="block text-sm font-bold mb-1">Main Image Path</label><input dir="ltr" value={form.image} onChange={(e) => setForm((p) => ({ ...p, image: e.target.value }))} className="w-full px-3 py-2 rounded-lg border text-sm" /></div>
        <div><label className="block text-sm font-bold mb-1">OG Image Path</label><input dir="ltr" value={form.ogImage} onChange={(e) => setForm((p) => ({ ...p, ogImage: e.target.value }))} className="w-full px-3 py-2 rounded-lg border text-sm" /></div>
        <div className="md:col-span-2"><label className="block text-sm font-bold mb-1">Meta Title</label><input value={form.metaTitle} onChange={(e) => setForm((p) => ({ ...p, metaTitle: e.target.value }))} className="w-full px-3 py-2 rounded-lg border text-sm" /></div>
        <div className="md:col-span-2"><label className="block text-sm font-bold mb-1">Meta Description</label><textarea rows={2} value={form.metaDescription} onChange={(e) => setForm((p) => ({ ...p, metaDescription: e.target.value }))} className="w-full px-3 py-2 rounded-lg border text-sm" /></div>
      </div>

      <div className="flex flex-wrap gap-2">
        <label className="px-3 py-2 rounded-lg bg-surface-alt dark:bg-surface-dark-alt text-sm cursor-pointer">
          رفع الصورة الرئيسية
          <input className="hidden" type="file" accept="image/*" onChange={(e) => e.target.files?.[0] && uploadAndSet(e.target.files[0], "image")} />
        </label>
        <label className="px-3 py-2 rounded-lg bg-surface-alt dark:bg-surface-dark-alt text-sm cursor-pointer">
          رفع OG
          <input className="hidden" type="file" accept="image/*" onChange={(e) => e.target.files?.[0] && uploadAndSet(e.target.files[0], "ogImage")} />
        </label>
        <label className="px-3 py-2 rounded-lg bg-surface-alt dark:bg-surface-dark-alt text-sm cursor-pointer">
          إضافة صورة للمعرض
          <input className="hidden" type="file" accept="image/*" onChange={(e) => e.target.files?.[0] && uploadAndSet(e.target.files[0], "gallery")} />
        </label>
      </div>

      <div>
        <label className="block text-sm font-bold mb-1">Tag IDs (comma separated)</label>
        <input dir="ltr" value={form.tagIdsText} onChange={(e) => setForm((p) => ({ ...p, tagIdsText: e.target.value }))} className="w-full px-3 py-2 rounded-lg border text-sm" placeholder="1,2,3" />
        <p className="text-xs text-text-secondary mt-1">Tags: {tagsHelp}{tags.length > 20 ? " ..." : ""}</p>
      </div>

      <div>
        <label className="block text-sm font-bold mb-1">Gallery Image Paths (one per line)</label>
        <textarea dir="ltr" rows={4} value={form.galleryImagesText} onChange={(e) => setForm((p) => ({ ...p, galleryImagesText: e.target.value }))} className="w-full px-3 py-2 rounded-lg border text-sm" />
      </div>

      <div className="flex gap-2">
        <button onClick={submit} disabled={saving} className="px-5 py-2 bg-crimson text-white rounded-lg font-bold text-sm disabled:opacity-60">
          {saving ? "جارٍ الحفظ..." : articleId ? "تحديث المقال" : "إنشاء المقال"}
        </button>
        <button onClick={() => router.push("/admin/articles")} className="px-5 py-2 bg-surface-alt dark:bg-surface-dark-alt rounded-lg font-bold text-sm">إلغاء</button>
      </div>
    </div>
  );
}
