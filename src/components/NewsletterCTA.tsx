"use client";

import { useState } from "react";

export default function NewsletterCTA() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    try {
      const stored = JSON.parse(localStorage.getItem("al-daftar-newsletter") || "[]") as string[];
      if (!stored.includes(email.trim())) {
        stored.push(email.trim());
        localStorage.setItem("al-daftar-newsletter", JSON.stringify(stored));
      }
    } catch {
      // ignore
    }
    setSubmitted(true);
  };

  return (
    <section className="mt-10 mb-6">
      <div className="max-w-7xl mx-auto">
        <div className="rounded-3xl bg-gradient-to-l from-navy via-navy-light to-crimson text-white px-6 py-6 md:px-10 md:py-8 flex flex-col md:flex-row items-center gap-6">
          <div className="flex-1">
            <h2 className="text-2xl font-extrabold mb-1">اشترك في نشرة الدفتر</h2>
            <p className="text-sm text-white/80">
              أهم الأخبار والتحليلات تصلك إلى بريدك مرة واحدة يومياً.
            </p>
          </div>
          <form
            onSubmit={handleSubmit}
            className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full md:w-auto"
          >
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="اكتب بريدك الإلكتروني"
              className="px-4 py-2.5 rounded-xl bg-white text-navy text-sm min-w-[220px] focus:outline-none focus:ring-2 focus:ring-crimson"
              dir="ltr"
              required
            />
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-crimson text-white text-sm font-bold hover:bg-crimson-light transition-colors min-w-[120px]"
            >
              {submitted ? "تم الاشتراك" : "اشتراك"}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}

