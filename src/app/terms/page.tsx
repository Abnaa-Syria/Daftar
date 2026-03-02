import Breadcrumbs from "@/components/Breadcrumbs";

export const metadata = { title: "شروط الاستخدام - الدفتر" };

export default function TermsPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <Breadcrumbs items={[{ label: "شروط الاستخدام" }]} />

      <h1 className="text-3xl font-extrabold mt-4 mb-6">شروط الاستخدام</h1>

      <div className="prose prose-lg max-w-none dark:prose-invert space-y-6">
        <p className="text-lg leading-relaxed">
          باستخدامك لموقع <strong>الدفتر</strong> فإنك توافق على الالتزام بهذه
          الشروط والأحكام.
        </p>

        <h2 className="text-xl font-extrabold">١. استخدام المحتوى</h2>
        <p>
          جميع المحتويات المنشورة على الدفتر محمية بحقوق الملكية الفكرية. يُسمح
          بمشاركة المقالات مع الإشارة إلى المصدر ورابط المقال الأصلي.
        </p>

        <h2 className="text-xl font-extrabold">٢. سلوك المستخدم</h2>
        <p>
          يلتزم المستخدم باستخدام الموقع بشكل قانوني ومسؤول، ويمتنع عن نشر أي
          محتوى مسيء أو مخالف للقانون.
        </p>

        <h2 className="text-xl font-extrabold">٣. إخلاء المسؤولية</h2>
        <p>
          نسعى لضمان دقة المعلومات المنشورة لكننا لا نتحمل مسؤولية أي قرارات
          يتخذها المستخدم بناءً على محتوى الموقع.
        </p>

        <h2 className="text-xl font-extrabold">٤. الروابط الخارجية</h2>
        <p>
          قد يحتوي الموقع على روابط لمواقع خارجية. لا نتحمل مسؤولية محتوى هذه
          المواقع أو سياساتها.
        </p>

        <h2 className="text-xl font-extrabold">٥. تعديل الشروط</h2>
        <p>
          نحتفظ بالحق في تعديل هذه الشروط في أي وقت. ستُنشر التعديلات على هذه
          الصفحة مع تاريخ آخر تحديث.
        </p>

        <p className="text-sm text-text-secondary dark:text-text-dark-secondary mt-8">
          آخر تحديث: مارس ٢٠٢٦
        </p>
      </div>
    </div>
  );
}
