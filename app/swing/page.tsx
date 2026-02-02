'use client';

import { useEffect, useState } from 'react';
import Sidebar from '@/components/Sidebar';
import MetricCard from '@/components/MetricCard';
import EquityCurveChart from '@/components/EquityCurveChart';
import PerformanceTable from '@/components/PerformanceTable';
import { TradingRun } from '@/lib/types';

export default function SwingPage() {
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
        const response = await fetch('/api/performance?system=Swing');
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
        <Sidebar currentPage="Swing" />
        <div className="flex items-center justify-center h-screen">
          <div className="text-xl text-gray-600">Loading...</div>
        </div>
      </div>
    );
  }

  if (data.error) {
    return (
      <div className="min-h-screen bg-gray-100">
        <Sidebar currentPage="Swing" />
        <div className="flex items-center justify-center h-screen">
          <div className="text-xl text-red-600">Error: {data.error}</div>
        </div>
      </div>
    );
  }

  const { runs, stats } = data;

  return (
    <div className="min-h-screen bg-gray-100">
      <Sidebar currentPage="Swing" />

      <main className="pl-4 pr-4 pt-20 pb-8 max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Swing Trading System
          </h1>
          <p className="text-gray-600">
            XGBoost + Genetic Algorithm | 4H Timeframe | Sector Rotation Strategy
          </p>
        </div>

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
            title="Avg Win Rate"
            value={`${((stats?.avgWinRate || 0) * 100).toFixed(1)}%`}
            trend={stats?.avgWinRate > 0.5 ? 'up' : 'down'}
          />
        </div>

        {/* Sector Performance */}
        <div className="mb-8 bg-white rounded-lg p-6 shadow-sm">
          <h3 className="text-lg font-semibold mb-4">Sector Performance</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {runs.map((run, idx) => (
              <div key={run.id || idx} className="border rounded p-4">
                <h4 className="font-semibold text-gray-800 mb-2">{run.sector || 'Unknown'}</h4>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Sharpe:</span>
                    <span className={run.metrics.sharpe > 1 ? 'text-green-600' : 'text-red-600'}>
                      {run.metrics.sharpe.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Return:</span>
                    <span className={run.metrics.totalReturn > 0 ? 'text-green-600' : 'text-red-600'}>
                      {(run.metrics.totalReturn * 100).toFixed(2)}%
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Max DD:</span>
                    <span className="text-red-600">
                      {(run.metrics.maxDrawdown * 100).toFixed(2)}%
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Results Table */}
        <PerformanceTable runs={runs} />

        {/* Configuration */}
        {runs.length > 0 && runs[0].config && (
          <div className="mt-8 bg-white rounded-lg p-6 shadow-sm">
            <h3 className="text-lg font-semibold mb-4">Model Configuration</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <span className="text-gray-600">Folds:</span>
                <span className="ml-2 font-medium">{runs[0].config.folds || 'N/A'}</span>
              </div>
              <div>
                <span className="text-gray-600">Features:</span>
                <span className="ml-2 font-medium">{runs[0].config.features?.length || 0}</span>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
