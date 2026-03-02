"use client";

import { useState } from "react";
import Breadcrumbs from "@/components/Breadcrumbs";

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <Breadcrumbs items={[{ label: "تواصل معنا" }]} />

      <h1 className="text-3xl font-extrabold mt-4 mb-6">تواصل معنا</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* Info */}
        <div>
          <p className="text-text-secondary dark:text-text-dark-secondary leading-relaxed mb-6">
            نسعد بتواصلك معنا سواء لإرسال ملاحظاتك أو اقتراحاتك أو للإبلاغ عن
            أي مشكلة. سنحرص على الرد في أقرب وقت ممكن.
          </p>

          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-navy text-white flex items-center justify-center">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-bold">البريد الإلكتروني</p>
                <p className="text-sm text-text-secondary dark:text-text-dark-secondary">
                  info@aldaftar.com
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-navy text-white flex items-center justify-center">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-bold">الهاتف</p>
                <p className="text-sm text-text-secondary dark:text-text-dark-secondary" dir="ltr">
                  +20 2 1234 5678
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-navy text-white flex items-center justify-center">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-bold">العنوان</p>
                <p className="text-sm text-text-secondary dark:text-text-dark-secondary">
                  القاهرة، مصر
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Form */}
        <div>
          {submitted ? (
            <div className="bg-green-50 dark:bg-green-900/20 rounded-xl p-8 text-center">
              <p className="text-3xl mb-3">✓</p>
              <p className="text-lg font-bold text-green-700 dark:text-green-400">
                شكراً لتواصلك!
              </p>
              <p className="text-sm text-green-600 dark:text-green-300 mt-2">
                سنعود إليك في أقرب وقت ممكن
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-bold mb-1">الاسم</label>
                <input
                  type="text"
                  required
                  className="w-full px-4 py-3 rounded-lg bg-surface-alt dark:bg-surface-dark-alt border border-border dark:border-border-dark focus:outline-none focus:border-crimson"
                  placeholder="أدخل اسمك"
                />
              </div>
              <div>
                <label className="block text-sm font-bold mb-1">
                  البريد الإلكتروني
                </label>
                <input
                  type="email"
                  required
                  className="w-full px-4 py-3 rounded-lg bg-surface-alt dark:bg-surface-dark-alt border border-border dark:border-border-dark focus:outline-none focus:border-crimson"
                  placeholder="example@email.com"
                  dir="ltr"
                />
              </div>
              <div>
                <label className="block text-sm font-bold mb-1">الموضوع</label>
                <select className="w-full px-4 py-3 rounded-lg bg-surface-alt dark:bg-surface-dark-alt border border-border dark:border-border-dark focus:outline-none focus:border-crimson">
                  <option>استفسار عام</option>
                  <option>ملاحظة على محتوى</option>
                  <option>إبلاغ عن خطأ</option>
                  <option>تعاون إعلامي</option>
                  <option>أخرى</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold mb-1">الرسالة</label>
                <textarea
                  rows={5}
                  required
                  className="w-full px-4 py-3 rounded-lg bg-surface-alt dark:bg-surface-dark-alt border border-border dark:border-border-dark focus:outline-none focus:border-crimson resize-none"
                  placeholder="اكتب رسالتك هنا..."
                />
              </div>
              <button
                type="submit"
                className="w-full py-3 bg-crimson text-white rounded-lg font-bold hover:bg-crimson-light transition-colors"
              >
                إرسال الرسالة
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
