'use client';

import { useState } from 'react';
import { TradingRun } from '@/lib/types';

interface PerformanceTableProps {
  runs: TradingRun[];
}

export default function PerformanceTable({ runs }: PerformanceTableProps) {
  const [sortField, setSortField] = useState<keyof TradingRun['metrics']>('sharpe');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  const sortedRuns = [...runs].sort((a, b) => {
    const aVal = a.metrics[sortField] || 0;
    const bVal = b.metrics[sortField] || 0;
    return sortDirection === 'asc' ? aVal - bVal : bVal - aVal;
  });

  const handleSort = (field: keyof TradingRun['metrics']) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  if (runs.length === 0) {
    return (
      <div className="bg-white rounded-lg p-6 shadow-sm">
        <h3 className="text-lg font-semibold mb-4">Performance Results</h3>
        <div className="text-center text-gray-500 py-8">
          No results available
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg p-6 shadow-sm overflow-x-auto">
      <h3 className="text-lg font-semibold mb-4">Performance Results</h3>
      <table className="min-w-full divide-y divide-gray-200">
        <thead>
          <tr>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">System</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Sector/Symbol</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Timeframe</th>
            <th
              className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase cursor-pointer hover:bg-gray-50"
              onClick={() => handleSort('sharpe')}
            >
              Sharpe {sortField === 'sharpe' && (sortDirection === 'asc' ? '↑' : '↓')}
            </th>
            <th
              className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase cursor-pointer hover:bg-gray-50"
              onClick={() => handleSort('totalReturn')}
            >
              Return {sortField === 'totalReturn' && (sortDirection === 'asc' ? '↑' : '↓')}
            </th>
            <th
              className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase cursor-pointer hover:bg-gray-50"
              onClick={() => handleSort('maxDrawdown')}
            >
              Max DD {sortField === 'maxDrawdown' && (sortDirection === 'asc' ? '↑' : '↓')}
            </th>
            <th
              className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase cursor-pointer hover:bg-gray-50"
              onClick={() => handleSort('winRate')}
            >
              Win Rate {sortField === 'winRate' && (sortDirection === 'asc' ? '↑' : '↓')}
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {sortedRuns.map((run, idx) => (
            <tr key={run.id || idx} className="hover:bg-gray-50">
              <td className="px-4 py-3 text-sm">{run.system}</td>
              <td className="px-4 py-3 text-sm">{run.sector || run.symbol || '-'}</td>
              <td className="px-4 py-3 text-sm">{run.timeframe}</td>
              <td className={`px-4 py-3 text-sm font-medium ${
                run.metrics.sharpe > 1 ? 'text-green-600' : run.metrics.sharpe < 0 ? 'text-red-600' : 'text-gray-900'
              }`}>
                {run.metrics.sharpe.toFixed(2)}
              </td>
              <td className={`px-4 py-3 text-sm ${
                run.metrics.totalReturn > 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                {(run.metrics.totalReturn * 100).toFixed(2)}%
              </td>
              <td className="px-4 py-3 text-sm text-red-600">
                {(run.metrics.maxDrawdown * 100).toFixed(2)}%
              </td>
              <td className="px-4 py-3 text-sm">
                {(run.metrics.winRate * 100).toFixed(1)}%
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
