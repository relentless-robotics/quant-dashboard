'use client';

import Sidebar from '@/components/Sidebar';

export default function QuanttimePage() {
  return (
    <div className="min-h-screen bg-gray-100">
      <Sidebar currentPage="Quanttime" />

      <main className="pl-4 pr-4 pt-20 pb-8 max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Quanttime System
          </h1>
          <p className="text-gray-600">
            CNN/GNN Transformer | Tick/MBO Timeframe | High-Frequency Strategy
          </p>
        </div>

        <div className="bg-white rounded-lg p-8 shadow-sm text-center">
          <h3 className="text-xl font-semibold text-gray-700 mb-4">
            Coming Soon
          </h3>
          <p className="text-gray-600">
            Quanttime results will appear here once available.
          </p>
          <p className="text-sm text-gray-500 mt-4">
            Expected data: Tick-level backtest results, order flow analysis, latency metrics
          </p>
        </div>
      </main>
    </div>
  );
}
