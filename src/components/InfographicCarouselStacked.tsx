import Link from "next/link";
import Image from "next/image";
import { Infographic } from "@/data";
import SectionHeaderBar from "./SectionHeaderBar";
import CardCarousel from "./CardCarousel";

interface Props {
  items: Infographic[];
}

export default function InfographicCarouselStacked({ items }: Props) {
  if (!items.length) return null;

  const visible = items.slice(0, 12);

  return (
    <section className="space-y-4">
      <SectionHeaderBar
        title="الانفو جراف"
        href="/section/infographic"
        accentColor="#00838f"
      />

      <CardCarousel
        items={visible.map((info) => (
          <InfographicCard key={info.id} info={info} />
        ))}
        itemsPerView={3}
        ariaLabel="الانفو جراف"
        autoPlay
      />
    </section>
  );
}

function InfographicCard({ info }: { info: Infographic }) {
  return (
    <Link
      href={`/infographic/${info.slug}`}
      className="group block h-full"
    >
      <div className="relative aspect-[3/4] rounded-3xl overflow-hidden bg-surface dark:bg-surface-dark shadow-[0_16px_40px_rgba(0,0,0,0.35)] transition-transform duration-300 group-hover:-translate-y-1 group-hover:shadow-[0_22px_55px_rgba(0,0,0,0.45)]">
        <Image
          src={info.images[0]}
          alt={info.title}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 280px"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent" />
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
  );
}
