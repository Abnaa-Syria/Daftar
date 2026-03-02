import Link from "next/link";

interface Props {
  title: string;
  href?: string;
  accentColor?: string;
  badge?: string;
}

export default function SectionHeaderBar({ title, href, accentColor, badge }: Props) {
  const content = (
    <div className="flex items-center justify-between gap-4 px-4 py-3 rounded-2xl bg-gradient-to-l from-crimson to-navy text-white shadow-sm">
      <div className="flex items-center gap-3">
        {accentColor && (
          <span
            className="w-1.5 h-8 rounded-full"
            style={{ backgroundColor: accentColor }}
          />
        )}
        <h2 className="text-lg md:text-xl font-extrabold tracking-tight">{title}</h2>
        {badge && (
          <span className="px-2.5 py-0.5 rounded-full bg-white/15 text-xs font-bold">
            {badge}
          </span>
        )}
      </div>
      {href && (
        <span className="text-xs md:text-sm font-bold text-white/80 hover:text-white transition-colors">
          عرض الكل ←
        </span>
      )}
    </div>
  );

  if (href) {
    return (
      <Link href={href} className="block mb-4 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-crimson rounded-2xl">
        {content}
      </Link>
    );
  }

  return <div className="mb-4">{content}</div>;
}

