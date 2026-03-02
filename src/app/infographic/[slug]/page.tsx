import { notFound } from "next/navigation";
import { infographics, getInfographicBySlug, formatDate } from "@/data";
import Breadcrumbs from "@/components/Breadcrumbs";
import Carousel from "@/components/Carousel";

export function generateStaticParams() {
  return infographics.map((i) => ({ slug: i.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const info = getInfographicBySlug(slug);
  return { title: info ? `${info.title} - الدفتر` : "الدفتر" };
}

export default async function InfographicPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const info = getInfographicBySlug(slug);
  if (!info) return notFound();

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <Breadcrumbs
        items={[
          { label: "الانفو جراف", href: "/section/infographic" },
          { label: info.title },
        ]}
      />

      <h1 className="text-3xl font-extrabold mt-4 mb-2">{info.title}</h1>
      <p className="text-text-secondary dark:text-text-dark-secondary mb-2">
        {info.description}
      </p>
      <span className="text-xs text-text-secondary dark:text-text-dark-secondary block mb-6">
        {formatDate(info.publishedAt)}
      </span>

      <Carousel images={info.images} title={info.title} />
    </div>
  );
}
