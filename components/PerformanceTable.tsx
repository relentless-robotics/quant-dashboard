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
      <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6 shadow-lg">
        <h3 className="text-xl font-semibold text-white mb-4">Performance Results</h3>
        <div className="text-center text-gray-400 py-8">
          No results available
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6 shadow-lg overflow-x-auto">
      <h3 className="text-xl font-semibold text-white mb-4">Performance Results</h3>
      <table className="min-w-full divide-y divide-gray-700/50">
        <thead>
          <tr>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">System</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Sector/Symbol</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Timeframe</th>
            <th
              className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider cursor-pointer hover:bg-gray-700/30 transition-colors"
              onClick={() => handleSort('sharpe')}
            >
              Sharpe {sortField === 'sharpe' && (sortDirection === 'asc' ? '↑' : '↓')}
            </th>
            <th
              className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider cursor-pointer hover:bg-gray-700/30 transition-colors"
              onClick={() => handleSort('totalReturn')}
            >
              Return {sortField === 'totalReturn' && (sortDirection === 'asc' ? '↑' : '↓')}
            </th>
            <th
              className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider cursor-pointer hover:bg-gray-700/30 transition-colors"
              onClick={() => handleSort('maxDrawdown')}
            >
              Max DD {sortField === 'maxDrawdown' && (sortDirection === 'asc' ? '↑' : '↓')}
            </th>
            <th
              className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider cursor-pointer hover:bg-gray-700/30 transition-colors"
              onClick={() => handleSort('winRate')}
            >
              Win Rate {sortField === 'winRate' && (sortDirection === 'asc' ? '↑' : '↓')}
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-700/30">
          {sortedRuns.map((run, idx) => (
            <tr key={run.id || idx} className="hover:bg-gray-700/20 transition-colors">
              <td className="px-4 py-3 text-sm text-gray-200 font-medium">{run.system}</td>
              <td className="px-4 py-3 text-sm text-gray-300">{run.sector || run.symbol || '-'}</td>
              <td className="px-4 py-3 text-sm text-gray-300">{run.timeframe}</td>
              <td className={`px-4 py-3 text-sm font-semibold ${
                run.metrics.sharpe > 1 ? 'text-green-400' : run.metrics.sharpe < 0 ? 'text-red-400' : 'text-gray-300'
              }`}>
                {run.metrics.sharpe.toFixed(2)}
              </td>
              <td className={`px-4 py-3 text-sm font-semibold ${
                run.metrics.totalReturn > 0 ? 'text-green-400' : 'text-red-400'
              }`}>
                {(run.metrics.totalReturn * 100).toFixed(2)}%
              </td>
              <td className="px-4 py-3 text-sm text-red-400 font-semibold">
                {(run.metrics.maxDrawdown * 100).toFixed(2)}%
              </td>
              <td className="px-4 py-3 text-sm text-gray-300">
                {(run.metrics.winRate * 100).toFixed(1)}%
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
