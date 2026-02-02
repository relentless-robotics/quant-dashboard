interface MetricCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  trend?: 'up' | 'down' | 'neutral';
  className?: string;
}

export default function MetricCard({
  title,
  value,
  subtitle,
  trend = 'neutral',
  className = ''
}: MetricCardProps) {
  const trendColors = {
    up: 'text-green-600',
    down: 'text-red-600',
    neutral: 'text-gray-600'
  };

  const bgColors = {
    up: 'bg-green-50',
    down: 'bg-red-50',
    neutral: 'bg-gray-50'
  };

  return (
    <div className={`${bgColors[trend]} rounded-lg p-6 shadow-sm ${className}`}>
      <h3 className="text-sm font-medium text-gray-600 mb-2">{title}</h3>
      <div className={`text-3xl font-bold ${trendColors[trend]} mb-1`}>
        {typeof value === 'number' ? value.toFixed(2) : value}
      </div>
      {subtitle && (
        <p className="text-xs text-gray-500">{subtitle}</p>
      )}
    </div>
  );
}
