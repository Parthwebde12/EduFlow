
export default function StatCard({
  title,
  value,
  icon: Icon,
  color,
  subtitle,
}) {
  const bgMap = {
    blue: 'bg-blue-50 dark:bg-blue-900/20',
    purple: 'bg-purple-50 dark:bg-purple-900/20',
    green: 'bg-green-50 dark:bg-green-900/20',
    orange: 'bg-orange-50 dark:bg-orange-900/20',
    pink: 'bg-pink-50 dark:bg-pink-900/20',
    cyan: 'bg-cyan-50 dark:bg-cyan-900/20',
  };

  const iconColorMap = {
    blue: 'text-blue-600 dark:text-blue-400',
    purple: 'text-purple-600 dark:text-purple-400',
    green: 'text-green-600 dark:text-green-400',
    orange: 'text-orange-600 dark:text-orange-400',
    pink: 'text-pink-600 dark:text-pink-400',
    cyan: 'text-cyan-600 dark:text-cyan-400',
  };

  return (
    <div className="card p-5 flex items-center gap-4">
      <div
        className={`w-12 h-12 ${
          bgMap[color] || bgMap.blue
        } rounded-xl flex items-center justify-center shrink-0`}
      >
        <Icon
          size={22}
          className={iconColorMap[color] || iconColorMap.blue}
        />
      </div>

      <div>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          {title}
        </p>

        <p className="text-2xl font-bold text-slate-900 dark:text-white">
          {value}
        </p>

        {subtitle && (
          <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">
            {subtitle}
          </p>
        )}
      </div>
    </div>
  );
}