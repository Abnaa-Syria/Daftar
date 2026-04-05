import Breadcrumbs from "@/components/Breadcrumbs";
import { publicApi } from "@/lib/api";
import SocialLinks from "@/components/SocialLinks";
import { notFound } from "next/navigation";

export const metadata = { title: "تواصل معنا - الدفتر" };

export default async function ContactPage() {
  const res = await publicApi.getPage("contact").catch(() => null);
  const page = res?.data as { title?: string; content?: string } | undefined;
  if (!page) return notFound();

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <Breadcrumbs items={[{ label: "تواصل معنا" }]} />
      <h1 className="text-3xl font-extrabold mt-4 mb-6">{page.title || "تواصل معنا"}</h1>
      <article className="prose prose-lg max-w-none dark:prose-invert" dangerouslySetInnerHTML={{ __html: page.content || "" }} />

      <div className="mt-10 pt-6 border-t border-border dark:border-border-dark">
        <h2 className="text-xl font-extrabold mb-3">تابعنا على</h2>
        <SocialLinks className="flex flex-wrap items-center gap-3" />
      </div>
    </div>
  );
}
