import Breadcrumbs from "@/components/Breadcrumbs";

export const metadata = { title: "سياسة الخصوصية - الدفتر" };

export default function PrivacyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <Breadcrumbs items={[{ label: "سياسة الخصوصية" }]} />

      <h1 className="text-3xl font-extrabold mt-4 mb-6">سياسة الخصوصية</h1>

      <div className="prose prose-lg max-w-none dark:prose-invert space-y-6">
        <p className="text-lg leading-relaxed">
          تحرص <strong>الدفتر</strong> على حماية خصوصية مستخدميها. توضح هذه
          السياسة كيفية جمع واستخدام وحماية البيانات الشخصية.
        </p>

        <h2 className="text-xl font-extrabold">البيانات التي نجمعها</h2>
        <p>
          نستخدم التخزين المحلي (localStorage) فقط لحفظ تفضيلاتك مثل المظهر
          (فاتح/داكن) وحجم الخط والمقالات المحفوظة. لا نجمع أي بيانات شخصية
          على خوادمنا.
        </p>

        <h2 className="text-xl font-extrabold">ملفات تعريف الارتباط</h2>
        <p>
          قد نستخدم ملفات تعريف الارتباط لتحسين تجربة التصفح. يمكنك التحكم في
          هذه الملفات من خلال إعدادات المتصفح.
        </p>

        <h2 className="text-xl font-extrabold">مشاركة البيانات</h2>
        <p>
          لا نشارك أي بيانات شخصية مع أطراف ثالثة ولا نبيعها بأي شكل من
          الأشكال.
        </p>

        <h2 className="text-xl font-extrabold">حقوقك</h2>
        <p>
          لديك الحق في الوصول إلى بياناتك وحذفها في أي وقت. يمكنك مسح
          التخزين المحلي من إعدادات المتصفح لحذف جميع بياناتك المحفوظة.
        </p>

        <h2 className="text-xl font-extrabold">تواصل معنا</h2>
        <p>
          لأي استفسارات حول سياسة الخصوصية، يرجى التواصل معنا عبر صفحة
          «تواصل معنا».
        </p>
      </div>
    </div>
  );
}
