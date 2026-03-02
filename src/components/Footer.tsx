import Link from "next/link";
import Image from "next/image";
import { sections } from "@/data";

export default function Footer() {
  return (
    <footer className="bg-navy dark:bg-navy-dark text-white mt-12">
      <div className="max-w-7xl mx-auto px-4 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <Image
              src="/logo.png"
              alt="الدفتر مصر"
              width={140}
              height={56}
              className="h-12 w-auto mb-3"
            />
            <p className="text-white/70 text-sm leading-relaxed">
              منصة إخبارية عربية شاملة تقدم أحدث الأخبار والتحليلات والتقارير
              المعمقة من قلب الأحداث.
            </p>
          </div>

          {/* Sections */}
          <div>
            <h3 className="font-bold text-lg mb-3">الأقسام</h3>
            <ul className="space-y-2">
              {sections.slice(0, 6).map((section) => (
                <li key={section.slug}>
                  <Link
                    href={`/section/${section.slug}`}
                    className="text-white/70 text-sm hover:text-white transition-colors"
                  >
                    {section.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* More Sections */}
          <div>
            <h3 className="font-bold text-lg mb-3">المزيد</h3>
            <ul className="space-y-2">
              {sections.slice(6).map((section) => (
                <li key={section.slug}>
                  <Link
                    href={`/section/${section.slug}`}
                    className="text-white/70 text-sm hover:text-white transition-colors"
                  >
                    {section.name}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  href="/series/first-guide"
                  className="text-white/70 text-sm hover:text-white transition-colors"
                >
                  دليلك الأول
                </Link>
              </li>
              <li>
                <Link
                  href="/series/shot-comment"
                  className="text-white/70 text-sm hover:text-white transition-colors"
                >
                  لقطة وتعليق
                </Link>
              </li>
              <li>
                <Link
                  href="/series/mind-logic"
                  className="text-white/70 text-sm hover:text-white transition-colors"
                >
                  بالعقل والمنطق
                </Link>
              </li>
            </ul>
          </div>

          {/* Links */}
          <div>
            <h3 className="font-bold text-lg mb-3">روابط سريعة</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/about" className="text-white/70 text-sm hover:text-white transition-colors">
                  عن الدفتر
                </Link>
              </li>
              <li>
                <Link href="/editorial-policy" className="text-white/70 text-sm hover:text-white transition-colors">
                  السياسة التحريرية
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-white/70 text-sm hover:text-white transition-colors">
                  تواصل معنا
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-white/70 text-sm hover:text-white transition-colors">
                  سياسة الخصوصية
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-white/70 text-sm hover:text-white transition-colors">
                  شروط الاستخدام
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-10 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-white/50 text-sm">
            © {new Date().getFullYear()} الدفتر. جميع الحقوق محفوظة.
          </p>
          <div className="flex items-center gap-4">
            <SocialIcon label="فيسبوك" d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" />
            <SocialIcon label="تويتر" d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z" />
            <SocialIcon label="يوتيوب" d="M22.54 6.42a2.78 2.78 0 00-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 00-1.94 2A29 29 0 001 11.75a29 29 0 00.46 5.33A2.78 2.78 0 003.4 19.1C5.12 19.56 12 19.56 12 19.56s6.88 0 8.6-.46a2.78 2.78 0 001.94-2 29 29 0 00.46-5.25 29 29 0 00-.46-5.43z M9.75 15.02V8.48l5.75 3.27-5.75 3.27z" />
          </div>
        </div>
      </div>
    </footer>
  );
}

function SocialIcon({ label, d }: { label: string; d: string }) {
  return (
    <a
      href="#"
      aria-label={label}
      className="w-9 h-9 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-colors"
    >
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d={d} />
      </svg>
    </a>
  );
}
