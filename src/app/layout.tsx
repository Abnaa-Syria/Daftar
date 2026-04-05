import type { Metadata } from "next";
import { Almarai } from "next/font/google";
import "./globals.css";
import ThemeProvider from "@/components/ThemeProvider";
import RootChrome from "@/components/RootChrome";
import { publicApi } from "@/lib/api";
import type { Section } from "@/types/content";

const almarai = Almarai({
  subsets: ["arabic"],
  weight: ["300", "400", "700", "800"],
  variable: "--font-almarai",
  display: "swap",
});

export const metadata: Metadata = {
  title: "الدفتر - أخبار بلا حدود",
  description: "منصة إخبارية عربية شاملة تقدم أحدث الأخبار والتحليلات والتقارير المعمقة",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sectionsRes, settingsRes] = await Promise.all([
    publicApi.getSections().catch(() => null),
    publicApi.getSettings().catch(() => null),
  ]);
  const sections = (sectionsRes?.data as Section[]) || [];
  const settings = (settingsRes?.data as Record<string, Record<string, string>>) || {};
  const editorial = settings.editorial || {};

  return (
    <html lang="ar" dir="rtl" className={almarai.variable}>
      <body className="font-[family-name:var(--font-almarai)] bg-surface dark:bg-surface-dark text-text-primary dark:text-text-dark-primary min-h-screen">
        <ThemeProvider>
          <RootChrome
            sections={sections}
            supervisorName={editorial.supervisor_name}
            editorInChiefName={editorial.editor_in_chief}
          >
            {children}
          </RootChrome>
        </ThemeProvider>
      </body>
    </html>
  );
}
