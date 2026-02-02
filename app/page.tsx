'use client';

import { useEffect, useState } from 'react';
import Sidebar from '@/components/Sidebar';
import MetricCard from '@/components/MetricCard';
import EquityCurveChart from '@/components/EquityCurveChart';
import PerformanceTable from '@/components/PerformanceTable';
import { TradingRun } from '@/lib/types';

export default function OverviewPage() {
  const [data, setData] = useState<{
    runs: TradingRun[];
    stats: any;
    loading: boolean;
    error: string | null;
  }>({
    runs: [],
    stats: null,
    loading: true,
    error: null
  });

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch('/api/performance');
        const result = await response.json();

        if (result.success) {
          setData({
            runs: result.data.runs,
            stats: result.data.stats,
            loading: false,
            error: null
          });
        } else {
          setData(prev => ({
            ...prev,
            loading: false,
            error: result.error
          }));
        }
      } catch (error) {
        console.error('Failed to fetch data:', error);
        setData(prev => ({
          ...prev,
          loading: false,
          error: 'Failed to load data'
        }));
      }
    }

    fetchData();
  }, []);

  if (data.loading) {
    return (
      <div className="min-h-screen bg-gray-100">
        <Sidebar currentPage="Overview" />
        <div className="flex items-center justify-center h-screen">
          <div className="text-xl text-gray-600">Loading...</div>
        </div>
      </div>
    );
  }

  if (data.error) {
    return (
      <div className="min-h-screen bg-gray-100">
        <Sidebar currentPage="Overview" />
        <div className="flex items-center justify-center h-screen">
          <div className="text-xl text-red-600">Error: {data.error}</div>
        </div>
      </div>
    );
  }

  const { runs, stats } = data;

  // Aggregate equity curves
  const aggregatedEquityCurve = runs
    .flatMap(r => r.equityCurve)
    .reduce((acc: any[], point) => {
      const existing = acc.find(p => p.date === point.date);
      if (existing) {
        existing.value += point.value;
        existing.count += 1;
      } else {
        acc.push({ date: point.date, value: point.value, count: 1 });
      }
      return acc;
    }, [])
    .map(p => ({ date: p.date, value: p.value / p.count }))
    .sort((a, b) => a.date.localeCompare(b.date));

  return (
    <div className="min-h-screen bg-gray-100">
      <Sidebar currentPage="Overview" />

      <main className="pl-4 pr-4 pt-20 pb-8 max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          Quant Trading Overview
        </h1>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <MetricCard
            title="Avg Sharpe Ratio"
            value={stats?.avgSharpe || 0}
            trend={stats?.avgSharpe > 1 ? 'up' : stats?.avgSharpe < 0 ? 'down' : 'neutral'}
          />
          <MetricCard
            title="Avg Return"
            value={`${((stats?.avgReturn || 0) * 100).toFixed(2)}%`}
            trend={stats?.avgReturn > 0 ? 'up' : 'down'}
          />
          <MetricCard
            title="Avg Max Drawdown"
            value={`${((stats?.avgMaxDrawdown || 0) * 100).toFixed(2)}%`}
            trend="down"
          />
          <MetricCard
            title="Total Trades"
            value={stats?.totalTrades || 0}
            trend="neutral"
          />
        </div>

        {/* Best/Worst Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <MetricCard
            title="Best Sharpe Ratio"
            value={stats?.bestSharpe || 0}
            subtitle="Across all systems"
            trend="up"
          />
          <MetricCard
            title="Worst Drawdown"
            value={`${((stats?.worstDrawdown || 0) * 100).toFixed(2)}%`}
            subtitle="Across all systems"
            trend="down"
          />
        </div>

        {/* Equity Curve */}
        <div className="mb-8">
          <EquityCurveChart
            data={aggregatedEquityCurve}
            title="Aggregated Equity Curve"
          />
        </div>

        {/* Results Table */}
        <PerformanceTable runs={runs} />

        {/* System Breakdown */}
        <div className="mt-8 bg-white rounded-lg p-6 shadow-sm">
          <h3 className="text-lg font-semibold mb-4">System Breakdown</h3>
          <div className="space-y-2">
            {['Swing', 'Quanttime', 'MacroStrategy'].map(system => {
              const systemRuns = runs.filter(r => r.system === system);
              return (
                <div key={system} className="flex justify-between items-center py-2 border-b">
                  <span className="font-medium">{system}</span>
                  <span className="text-gray-600">{systemRuns.length} runs</span>
                </div>
              );
            })}
          </div>
        </div>
      </main>
    </div>
  );
}
