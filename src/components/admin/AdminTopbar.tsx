"use client";

import { useState } from "react";

interface AdminTopbarProps {
  user: { name: string; role: string } | null;
  onLogout: () => void;
}

const roleLabels: Record<string, string> = {
  SUPER_ADMIN: "مدير عام",
  ADMIN: "مدير",
  EDITOR_IN_CHIEF: "رئيس تحرير",
  EDITOR: "محرر",
  AUTHOR: "كاتب",
  MEDIA_MANAGER: "مدير وسائط",
};

export default function AdminTopbar({ user, onLogout }: AdminTopbarProps) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-30 bg-surface dark:bg-surface-dark border-b border-border dark:border-border-dark h-16 flex items-center justify-between px-6">
      <div>
        <h2 className="text-lg font-bold">مرحباً {user?.name}</h2>
      </div>
      <div className="relative">
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-surface-alt dark:hover:bg-surface-dark-alt transition-colors"
        >
          <div className="w-8 h-8 rounded-full bg-crimson text-white flex items-center justify-center text-sm font-bold">
            {user?.name?.[0]}
          </div>
          <div className="text-right text-sm">
            <p className="font-bold">{user?.name}</p>
            <p className="text-text-secondary dark:text-text-dark-secondary text-xs">{roleLabels[user?.role || ""] || user?.role}</p>
          </div>
        </button>
        {menuOpen && (
          <div className="absolute left-0 top-full mt-1 w-48 bg-surface dark:bg-surface-dark border border-border dark:border-border-dark rounded-lg shadow-lg py-1 z-50">
            <button
              onClick={() => { setMenuOpen(false); onLogout(); }}
              className="w-full text-right px-4 py-2 text-sm hover:bg-surface-alt dark:hover:bg-surface-dark-alt text-crimson font-bold"
            >
              تسجيل الخروج
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
