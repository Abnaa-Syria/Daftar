import Link from "next/link";
import Image from "next/image";
import type { Section } from "@/types/content";
import SocialLinks from "@/components/SocialLinks";

export default function Footer({ sections = [] }: { sections?: Section[] }) {
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
            جميع الحقوق محفوظة © {new Date().getFullYear()} تصميم{" "}
            <a
              href="https://www.qeematech.net/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white/70 hover:text-white underline underline-offset-4 transition-colors"
            >
              Qeema-Tech
            </a>
          </p>
          <SocialLinks />
        </div>
      </div>
    </footer>
  );
}
