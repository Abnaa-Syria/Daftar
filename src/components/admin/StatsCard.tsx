interface StatsCardProps {
  title: string;
  value: string | number;
  icon: string;
  color?: string;
  change?: string;
}

export default function StatsCard({ title, value, icon, color = "#c41e3a", change }: StatsCardProps) {
  return (
    <div className="bg-surface dark:bg-surface-dark rounded-xl border border-border dark:border-border-dark p-5 flex items-start gap-4">
      <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: color + "15" }}>
        <svg className="w-6 h-6" style={{ color }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d={icon} />
        </svg>
      </div>
      <div>
        <p className="text-sm text-text-secondary dark:text-text-dark-secondary font-bold">{title}</p>
        <p className="text-2xl font-extrabold mt-1">{value}</p>
        {change && <p className="text-xs text-text-secondary dark:text-text-dark-secondary mt-1">{change}</p>}
      </div>
    </div>
  );
}
