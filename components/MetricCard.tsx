import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

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
    up: 'text-green-400',
    down: 'text-red-400',
    neutral: 'text-gray-400'
  };

  const trendIcons = {
    up: TrendingUp,
    down: TrendingDown,
    neutral: Minus
  };

  const TrendIcon = trendIcons[trend];

  const borderColors = {
    up: 'border-green-500/30',
    down: 'border-red-500/30',
    neutral: 'border-gray-700/50'
  };

  return (
    <div className={`bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm border ${borderColors[trend]} rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 ${className}`}>
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-medium text-gray-400 uppercase tracking-wider">{title}</h3>
        <TrendIcon className={`${trendColors[trend]} w-5 h-5`} />
      </div>
      <div className={`text-3xl font-bold text-white mb-2`}>
        {typeof value === 'number' ? value.toFixed(2) : value}
      </div>
      {subtitle && (
        <p className={`text-sm ${trendColors[trend]} font-medium`}>{subtitle}</p>
      )}
    </div>
  );
}
