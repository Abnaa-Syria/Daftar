"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { adminApi } from "@/lib/api";
import StatsCard from "@/components/admin/StatsCard";

interface DashboardData {
  articles: number;
  sections: number;
  authors: number;
  tags: number;
  breaking: number;
  infographics: number;
  users: number;
  media: number;
}

export default function AdminDashboardPage() {
  const { token } = useAuth();
  const [stats, setStats] = useState<DashboardData | null>(null);

  useEffect(() => {
    if (!token) return;
    const crud = adminApi.crud;

    Promise.all([
      crud("articles", token).list({ limit: "1" }),
      crud("sections", token).list({ limit: "1" }),
      crud("authors", token).list({ limit: "1" }),
      crud("tags", token).list({ limit: "1" }),
      crud("breaking", token).list({ limit: "1" }),
      crud("infographics", token).list({ limit: "1" }),
      crud("users", token).list({ limit: "1" }),
      crud("media", token).list({ limit: "1" }),
    ]).then(([articles, sections, authors, tags, breaking, infographics, users, media]) => {
      setStats({
        articles: (articles as { meta?: { total: number } }).meta?.total || 0,
        sections: (sections as { meta?: { total: number } }).meta?.total || 0,
        authors: (authors as { meta?: { total: number } }).meta?.total || 0,
        tags: (tags as { meta?: { total: number } }).meta?.total || 0,
        breaking: (breaking as { meta?: { total: number } }).meta?.total || 0,
        infographics: (infographics as { meta?: { total: number } }).meta?.total || 0,
        users: (users as { meta?: { total: number } }).meta?.total || 0,
        media: (media as { meta?: { total: number } }).meta?.total || 0,
      });
    }).catch(() => {});
  }, [token]);

  return (
    <div>
      <h1 className="text-2xl font-extrabold mb-6">لوحة التحكم</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard title="المقالات" value={stats?.articles ?? "..."} icon="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" color="#c41e3a" />
        <StatsCard title="الأقسام" value={stats?.sections ?? "..."} icon="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" color="#1a2744" />
        <StatsCard title="الكتّاب" value={stats?.authors ?? "..."} icon="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" color="#2e7d32" />
        <StatsCard title="الوسوم" value={stats?.tags ?? "..."} icon="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" color="#9c27b0" />
        <StatsCard title="عاجل" value={stats?.breaking ?? "..."} icon="M13 10V3L4 14h7v7l9-11h-7z" color="#e65100" />
        <StatsCard title="الانفوجراف" value={stats?.infographics ?? "..."} icon="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" color="#00838f" />
        <StatsCard title="المستخدمون" value={stats?.users ?? "..."} icon="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" color="#1565c0" />
        <StatsCard title="الوسائط" value={stats?.media ?? "..."} icon="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" color="#795548" />
      </div>
    </div>
  );
}
