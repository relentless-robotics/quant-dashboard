'use client';

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface EquityCurveChartProps {
  data: Array<{ date: string; value: number }>;
  title?: string;
}

export default function EquityCurveChart({ data, title = 'Equity Curve' }: EquityCurveChartProps) {
  if (!data || data.length === 0) {
    return (
      <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6 shadow-lg">
        <h3 className="text-xl font-semibold text-white mb-4">{title}</h3>
        <div className="text-center text-gray-400 py-8">
          No equity curve data available
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6 shadow-lg">
      <h3 className="text-xl font-semibold text-white mb-4">{title}</h3>
      <ResponsiveContainer width="100%" height={400}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
          <XAxis
            dataKey="date"
            tick={{ fontSize: 12, fill: '#9CA3AF' }}
            angle={-45}
            textAnchor="end"
            height={80}
            stroke="#4B5563"
          />
          <YAxis tick={{ fontSize: 12, fill: '#9CA3AF' }} stroke="#4B5563" />
          <Tooltip
            contentStyle={{
              backgroundColor: 'rgba(17, 24, 39, 0.9)',
              border: '1px solid rgba(75, 85, 99, 0.5)',
              borderRadius: '0.5rem',
              color: '#F9FAFB'
            }}
          />
          <Legend wrapperStyle={{ color: '#9CA3AF' }} />
          <Line
            type="monotone"
            dataKey="value"
            stroke="url(#colorGradient)"
            strokeWidth={3}
            dot={false}
            name="Equity"
          />
          <defs>
            <linearGradient id="colorGradient" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#8B5CF6" />
              <stop offset="100%" stopColor="#3B82F6" />
            </linearGradient>
          </defs>
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
