"use client";
import { useEffect, useState, useCallback } from "react";
import { useAuth } from "@/hooks/useAuth";
import { adminApi } from "@/lib/api";

export default function AdminSettingsPage() {
  const { token } = useAuth();
  const [settings, setSettings] = useState<Record<string, Record<string, string>>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [newGroup, setNewGroup] = useState("general");
  const [newKey, setNewKey] = useState("");
  const [newValue, setNewValue] = useState("");

  const fetchData = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    try {
      const res = await adminApi.getSettings(token) as { data: Record<string, Record<string, string>> };
      setSettings(res.data || {});
    } catch {}
    setLoading(false);
  }, [token]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const updateSetting = (group: string, key: string, value: string) => {
    setSettings((prev) => ({ ...prev, [group]: { ...prev[group], [key]: value } }));
  };

  const handleSave = async () => {
    if (!token) return;
    setSaving(true);
    const flat: { key: string; value: string; group: string }[] = [];
    for (const [group, entries] of Object.entries(settings)) {
      for (const [key, value] of Object.entries(entries)) {
        flat.push({ key, value, group });
      }
    }
    try { await adminApi.updateSettings(token, flat); } catch {}
    setSaving(false);
  };

  const handleAddSetting = async () => {
    if (!token || !newKey.trim()) return;
    await adminApi.upsertSetting(token, { key: newKey.trim(), value: newValue, group: newGroup });
    setNewKey("");
    setNewValue("");
    fetchData();
  };

  const handleDelete = async (key: string) => {
    if (!token) return;
    await adminApi.deleteSetting(token, key);
    fetchData();
  };

  if (loading) return <div className="p-8 text-center">جارٍ التحميل...</div>;

  const groups: { key: string; label: string }[] = [
    { key: "general", label: "إعدادات عامة" },
    { key: "editorial", label: "الفريق التحريري" },
    { key: "contact", label: "معلومات التواصل" },
    { key: "social", label: "وسائل التواصل" },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-extrabold">الإعدادات</h1>
        <button onClick={handleSave} disabled={saving} className="px-5 py-2.5 bg-crimson text-white rounded-xl font-bold text-sm disabled:opacity-60">
          {saving ? "جارٍ الحفظ..." : "حفظ الإعدادات"}
        </button>
      </div>
      <div className="space-y-6">
        <div className="bg-surface dark:bg-surface-dark rounded-xl border border-border dark:border-border-dark p-6">
          <h2 className="font-extrabold text-lg mb-4">إضافة إعداد جديد</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            <select value={newGroup} onChange={(e) => setNewGroup(e.target.value)} className="px-3 py-2 rounded-lg border border-border dark:border-border-dark bg-surface-alt dark:bg-surface-dark-alt text-sm">
              <option value="general">general</option>
              <option value="editorial">editorial</option>
              <option value="contact">contact</option>
              <option value="social">social</option>
            </select>
            <input value={newKey} onChange={(e) => setNewKey(e.target.value)} placeholder="key" className="px-3 py-2 rounded-lg border border-border dark:border-border-dark bg-surface-alt dark:bg-surface-dark-alt text-sm" dir="ltr" />
            <input value={newValue} onChange={(e) => setNewValue(e.target.value)} placeholder="value" className="px-3 py-2 rounded-lg border border-border dark:border-border-dark bg-surface-alt dark:bg-surface-dark-alt text-sm" />
            <button onClick={handleAddSetting} className="px-4 py-2 rounded-lg bg-crimson text-white text-sm font-bold">إضافة</button>
          </div>
        </div>

        {groups.map((group) => (
          <div key={group.key} className="bg-surface dark:bg-surface-dark rounded-xl border border-border dark:border-border-dark p-6">
            <h2 className="font-extrabold text-lg mb-4">{group.label}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(settings[group.key] || {}).map(([key, value]) => (
                <div key={key}>
                  <label className="block text-sm font-bold mb-1">{key}</label>
                  <div className="flex gap-2">
                    <input
                      value={value}
                      onChange={(e) => updateSetting(group.key, key, e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-border dark:border-border-dark bg-surface-alt dark:bg-surface-dark-alt text-sm"
                    />
                    <button onClick={() => handleDelete(key)} className="px-3 py-2 rounded-lg bg-crimson/10 text-crimson text-xs font-bold">حذف</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
