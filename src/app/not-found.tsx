import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
      <h1 className="text-8xl font-extrabold text-crimson mb-4">٤٠٤</h1>
      <h2 className="text-2xl font-extrabold mb-3">الصفحة غير موجودة</h2>
      <p className="text-text-secondary dark:text-text-dark-secondary mb-8 max-w-md">
        عذراً، الصفحة التي تبحث عنها غير موجودة. ربما تم نقلها أو حذفها أو
        أن الرابط غير صحيح.
      </p>
      <div className="flex gap-4">
        <Link
          href="/"
          className="px-6 py-3 bg-crimson text-white rounded-lg font-bold hover:bg-crimson-light transition-colors"
        >
          العودة للرئيسية
        </Link>
        <Link
          href="/search"
          className="px-6 py-3 bg-surface-alt dark:bg-surface-dark-alt rounded-lg font-bold hover:bg-navy hover:text-white transition-colors"
        >
          البحث
        </Link>
      </div>
    </div>
  );
}
