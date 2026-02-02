'use client';

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface EquityCurveChartProps {
  data: Array<{ date: string; value: number }>;
  title?: string;
}

export default function EquityCurveChart({ data, title = 'Equity Curve' }: EquityCurveChartProps) {
  if (!data || data.length === 0) {
    return (
      <div className="bg-white rounded-lg p-6 shadow-sm">
        <h3 className="text-lg font-semibold mb-4">{title}</h3>
        <div className="text-center text-gray-500 py-8">
          No equity curve data available
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg p-6 shadow-sm">
      <h3 className="text-lg font-semibold mb-4">{title}</h3>
      <ResponsiveContainer width="100%" height={400}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="date"
            tick={{ fontSize: 12 }}
            angle={-45}
            textAnchor="end"
            height={80}
          />
          <YAxis tick={{ fontSize: 12 }} />
          <Tooltip />
          <Legend />
          <Line
            type="monotone"
            dataKey="value"
            stroke="#3b82f6"
            strokeWidth={2}
            dot={false}
            name="Equity"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
