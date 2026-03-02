import Breadcrumbs from "@/components/Breadcrumbs";

export const metadata = { title: "السياسة التحريرية - الدفتر" };

export default function EditorialPolicyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <Breadcrumbs items={[{ label: "السياسة التحريرية" }]} />

      <h1 className="text-3xl font-extrabold mt-4 mb-6">السياسة التحريرية</h1>

      <div className="prose prose-lg max-w-none dark:prose-invert space-y-6">
        <p className="text-lg leading-relaxed">
          تلتزم <strong>الدفتر</strong> بمعايير مهنية صارمة في جمع الأخبار
          ومعالجتها ونشرها. تحدد هذه السياسة المبادئ التي يعمل بها فريقنا
          التحريري.
        </p>

        <h2 className="text-xl font-extrabold">١. مصادر المعلومات</h2>
        <p>
          نعتمد على مصادر متعددة وموثوقة للتحقق من صحة المعلومات قبل نشرها.
          لا ننشر أي خبر يعتمد على مصدر واحد فقط في القضايا الحساسة.
        </p>

        <h2 className="text-xl font-extrabold">٢. الفصل بين الخبر والرأي</h2>
        <p>
          نحرص على الفصل الواضح بين المحتوى الإخباري والمحتوى التحليلي أو
          الرأي، ونوضح ذلك للقارئ بشكل صريح.
        </p>

        <h2 className="text-xl font-extrabold">٣. تصحيح الأخطاء</h2>
        <p>
          في حال اكتشاف أي خطأ في محتوى منشور، نلتزم بتصحيحه فوراً مع الإشارة
          إلى التعديل بشفافية تامة.
        </p>

        <h2 className="text-xl font-extrabold">٤. حماية المصادر</h2>
        <p>
          نحترم سرية المصادر ونحميها وفق المعايير الدولية للعمل الصحفي.
        </p>

        <h2 className="text-xl font-extrabold">٥. التنوع والشمولية</h2>
        <p>
          نسعى لتمثيل جميع الأصوات والآراء في تغطياتنا الإخبارية، ونرفض أي شكل
          من أشكال التمييز أو التحيز.
        </p>
      </div>
    </div>
  );
}
