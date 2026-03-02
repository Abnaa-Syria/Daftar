import Breadcrumbs from "@/components/Breadcrumbs";

export const metadata = { title: "عن الدفتر - الدفتر" };

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <Breadcrumbs items={[{ label: "عن الدفتر" }]} />

      <h1 className="text-3xl font-extrabold mt-4 mb-6">عن الدفتر</h1>

      <div className="prose prose-lg max-w-none dark:prose-invert">
        <p className="text-lg leading-relaxed">
          <strong>الدفتر</strong> هي منصة إخبارية عربية مستقلة تأسست بهدف تقديم
          محتوى إخباري موثوق ومتنوع يلبي احتياجات القارئ العربي في عالم سريع
          التغير.
        </p>

        <h2 className="text-xl font-extrabold mt-8 mb-4">رؤيتنا</h2>
        <p>
          نسعى لأن نكون المصدر الأول للأخبار والتحليلات في العالم العربي، من
          خلال تقديم صحافة رقمية عالية الجودة تجمع بين الدقة والسرعة والعمق.
        </p>

        <h2 className="text-xl font-extrabold mt-8 mb-4">رسالتنا</h2>
        <p>
          نؤمن بحق القارئ في الحصول على معلومات دقيقة وموضوعية تساعده على فهم
          الأحداث واتخاذ قرارات مستنيرة. نلتزم بأعلى معايير المهنية الصحفية في
          كل ما ننشره.
        </p>

        <h2 className="text-xl font-extrabold mt-8 mb-4">قيمنا</h2>
        <ul className="space-y-3">
          <li>
            <strong>الدقة:</strong> نتحقق من كل خبر قبل نشره ونعتمد على مصادر موثوقة
          </li>
          <li>
            <strong>الموضوعية:</strong> نقدم الأخبار كما هي دون تحيز أو تأثر بأي جهة
          </li>
          <li>
            <strong>الشفافية:</strong> نكون صريحين مع قرائنا حول مصادرنا ومنهجيتنا
          </li>
          <li>
            <strong>الابتكار:</strong> نستخدم أحدث التقنيات لتقديم تجربة قراءة مميزة
          </li>
        </ul>

        <h2 className="text-xl font-extrabold mt-8 mb-4">فريقنا</h2>
        <p>
          يضم فريق الدفتر نخبة من الصحفيين والمحللين والمحررين ذوي الخبرة في مختلف
          المجالات، يعملون على مدار الساعة لتقديم أفضل تغطية إخبارية للقارئ العربي.
        </p>
      </div>
    </div>
  );
}
