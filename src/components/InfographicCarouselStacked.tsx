import Link from "next/link";
import Image from "next/image";
import { Infographic } from "@/data";
import SectionHeaderBar from "./SectionHeaderBar";

interface Props {
  items: Infographic[];
}

export default function InfographicCarouselStacked({ items }: Props) {
  if (!items.length) return null;

  return (
    <section className="space-y-4">
      <SectionHeaderBar
        title="الانفو جراف"
        href="/section/infographic"
        accentColor="#00838f"
      />

      <div className="relative">
        <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
          {items.map((info, index) => (
            <Link
              key={info.id}
              href={`/infographic/${info.slug}`}
              className="group relative shrink-0 w-40 sm:w-48 md:w-56"
            >
              <div className="relative aspect-[3/4] rounded-3xl overflow-hidden shadow-[0_18px_45px_rgba(0,0,0,0.35)] bg-surface dark:bg-surface-dark transition-transform group-hover:-translate-y-1">
                <div
                  className={`absolute inset-0 rounded-3xl border border-white/10 pointer-events-none ${
                    index % 2 === 0 ? "translate-y-1 translate-x-1" : "-translate-y-1 -translate-x-1"
                  } opacity-40`}
                />
                <Image
                  src={info.images[0]}
                  alt={info.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 60vw, 260px"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent" />
                <div className="absolute bottom-3 right-3 left-3 space-y-1">
                  <span className="inline-block px-2 py-0.5 rounded-full bg-cyan-600/90 text-[11px] font-bold text-white">
                    إنفوجراف
                  </span>
                  <h3 className="text-sm font-extrabold text-white leading-snug line-clamp-2">
                    {info.title}
                  </h3>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

