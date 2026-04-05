import Breadcrumbs from "@/components/Breadcrumbs";
import { publicApi } from "@/lib/api";
import { notFound } from "next/navigation";

export const metadata = { title: "???? ????????? - ??????" };

export default async function TermsPage() {
  const res = await publicApi.getPage("terms").catch(() => null);
  const page = res?.data as { title?: string; content?: string } | undefined;
  if (!page) return notFound();

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <Breadcrumbs items={[{ label: "???? ?????????" }]} />
      <h1 className="text-3xl font-extrabold mt-4 mb-6">{page.title || "???? ?????????"}</h1>
      <article className="prose prose-lg max-w-none dark:prose-invert" dangerouslySetInnerHTML={{ __html: page.content || "" }} />
    </div>
  );
}
