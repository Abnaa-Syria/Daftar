import Link from "next/link";

interface Crumb {
  label: string;
  href?: string;
}

interface Props {
  items: Crumb[];
}

export default function Breadcrumbs({ items }: Props) {
  return (
    <nav aria-label="breadcrumb" className="py-3 text-sm">
      <ol className="flex items-center gap-2 flex-wrap text-text-secondary dark:text-text-dark-secondary">
        <li>
          <Link href="/" className="hover:text-crimson transition-colors">
            الرئيسية
          </Link>
        </li>
        {items.map((item, i) => (
          <li key={i} className="flex items-center gap-2">
            <span className="text-xs">‹</span>
            {item.href ? (
              <Link href={item.href} className="hover:text-crimson transition-colors">
                {item.label}
              </Link>
            ) : (
              <span className="text-text-primary dark:text-text-dark-primary font-bold">
                {item.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
