import type { Metadata } from "next";
import { Almarai } from "next/font/google";
import "./globals.css";
import ThemeProvider from "@/components/ThemeProvider";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ar" dir="rtl" className={almarai.variable}>
      <body className="font-[family-name:var(--font-almarai)] bg-surface dark:bg-surface-dark text-text-primary dark:text-text-dark-primary min-h-screen">
        <ThemeProvider>
          <Header />
          <main className="min-h-[60vh]">{children}</main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
