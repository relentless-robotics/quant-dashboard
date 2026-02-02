# Quant Trading Dashboard

Comprehensive dashboard for visualizing quantitative trading system performance.

## Features

- **Multi-System Support**: Swing, Quanttime, MacroStrategy
- **Interactive Charts**: Equity curves, performance metrics
- **Sortable Tables**: Filter and sort results by any metric
- **Responsive Design**: Works on desktop, tablet, and mobile
- **Centralized Logging**: All results stored in `trading_performance.json`

## Systems

### Swing Trading
- **Model**: XGBoost + Genetic Algorithm
- **Timeframe**: 4H
- **Strategy**: Sector rotation with fundamental factors
- **Data Source**: `../Swing/results/backtest_results.json`

### Quanttime (Coming Soon)
- **Model**: CNN/GNN Transformer
- **Timeframe**: Tick/MBO
- **Strategy**: High-frequency order flow analysis

### MacroStrategy (Coming Soon)
- **Model**: LSTM + Symbolic Regression
- **Timeframe**: Daily
- **Strategy**: Macro trend following

## Getting Started

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### Build

```bash
npm run build
npm start
```

## Adding New Results

### Option 1: Centralized Log

Add results to `../teleclaude-main/logs/trading_performance.json`:

```json
{
  "runs": [
    {
      "id": "unique-id",
      "timestamp": "2026-02-01T12:00:00.000Z",
      "system": "Swing",
      "mode": "backtest",
      "timeframe": "4h",
      "config": {},
      "metrics": {
        "sharpe": 2.5,
        "sortino": 3.0,
        "maxDrawdown": 0.15,
        "winRate": 0.65,
        "totalReturn": 0.45
      },
      "equityCurve": [
        { "date": "2024-01-01", "value": 1.0 },
        { "date": "2024-01-02", "value": 1.05 }
      ]
    }
  ]
}
```

### Option 2: System-Specific Files

The dashboard automatically reads from:
- Swing: `../Swing/results/backtest_results.json`
- Quanttime: `../Quanttime/results/` (when available)
- MacroStrategy: `../MacroStrategy/results/` (when available)

## API Endpoints

### GET /api/performance

Query parameters:
- `system`: Filter by system name (Swing, Quanttime, MacroStrategy)
- `mode`: Filter by mode (backtest, paper, live)
- `timeframe`: Filter by timeframe (tick, 1m, 4h, daily, etc.)

Response:
```json
{
  "success": true,
  "data": {
    "runs": [...],
    "stats": {
      "avgSharpe": 2.1,
      "avgReturn": 0.35,
      "avgMaxDrawdown": 0.18,
      "totalTrades": 1500
    },
    "count": 10
  }
}
```

## Deployment

Deploy to Vercel:

1. Push to GitHub
2. Import in Vercel
3. Deploy

The dashboard is statically generated and can be deployed to any hosting platform.

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Charts**: Recharts
- **Icons**: Lucide React

## Project Structure

```
quant-dashboard/
├── app/
│   ├── page.tsx           # Overview page
│   ├── swing/page.tsx     # Swing system page
│   ├── quanttime/page.tsx # Quanttime page
│   ├── macro/page.tsx     # MacroStrategy page
│   └── api/
│       └── performance/
│           └── route.ts   # Performance API
├── components/
│   ├── Sidebar.tsx        # Hamburger menu
│   ├── MetricCard.tsx     # Metric display card
│   ├── EquityCurveChart.tsx
│   └── PerformanceTable.tsx
├── lib/
│   ├── types.ts           # TypeScript types
│   └── dataLoader.ts      # Data loading utilities
└── public/
```

## License

ISC
