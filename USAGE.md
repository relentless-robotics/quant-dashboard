# Usage Guide

## Dashboard Features

### Navigation

Click the hamburger menu (top-left) to access:
- **Overview**: Aggregated stats across all systems
- **Swing**: Swing trading system results (4H timeframe)
- **Quanttime**: High-frequency system results (tick data)
- **MacroStrategy**: Macro trend following results (daily timeframe)

### Overview Page

The overview page displays:

1. **Key Metrics**
   - Average Sharpe Ratio across all systems
   - Average Return
   - Average Max Drawdown
   - Total number of trades

2. **Best/Worst Metrics**
   - Best Sharpe Ratio achieved
   - Worst Drawdown experienced

3. **Aggregated Equity Curve**
   - Combined performance visualization
   - Interactive chart (hover for details)

4. **Results Table**
   - All trading runs in one table
   - Sortable by any column (click headers)
   - Color-coded performance (green = positive, red = negative)

5. **System Breakdown**
   - Count of runs per system

### System-Specific Pages

Each system page shows:

1. **System Description**
   - Model architecture
   - Timeframe
   - Strategy type

2. **System Metrics**
   - Average performance across all runs
   - Win rate, Sharpe, returns, etc.

3. **Sector/Symbol Performance** (where applicable)
   - Breakdown by traded sector or symbol
   - Individual performance cards

4. **Results Table**
   - Filtered to show only this system's results

5. **Configuration Details**
   - Model settings
   - Feature counts
   - Other hyperparameters

## Adding New Results

### Method 1: Using the Script

```bash
node scripts/add-result.js \
  --system Swing \
  --mode backtest \
  --timeframe 4h \
  --sharpe 2.5 \
  --return 0.35 \
  --maxdd 0.15 \
  --winrate 0.65 \
  --trades 150 \
  --sector Technology
```

### Method 2: JSON File

Create a JSON file with your results:

```json
{
  "system": "Swing",
  "mode": "backtest",
  "timeframe": "4h",
  "sector": "Technology",
  "metrics": {
    "sharpe": 2.5,
    "sortino": 3.0,
    "maxDrawdown": 0.15,
    "winRate": 0.65,
    "totalReturn": 0.35,
    "trades": 150
  },
  "equityCurve": [
    { "date": "2024-01-01", "value": 1.0 },
    { "date": "2024-01-02", "value": 1.02 },
    { "date": "2024-01-03", "value": 1.05 }
  ],
  "config": {
    "model": "XGBoost",
    "features": 25,
    "lookback": 100
  }
}
```

Then run:

```bash
node scripts/add-result.js --file path/to/result.json
```

### Method 3: Direct Edit

Edit `C:\Users\Footb\Documents\Github\teleclaude-main\logs\trading_performance.json`:

```json
{
  "runs": [
    {
      "id": "swing-tech-1234567890",
      "timestamp": "2026-02-01T12:00:00.000Z",
      "system": "Swing",
      "mode": "backtest",
      "timeframe": "4h",
      "sector": "Technology",
      "config": {},
      "metrics": {
        "sharpe": 2.5,
        "sortino": 3.0,
        "maxDrawdown": 0.15,
        "winRate": 0.65,
        "totalReturn": 0.35,
        "trades": 150
      },
      "equityCurve": []
    }
  ],
  "lastUpdated": "2026-02-01T12:00:00.000Z",
  "version": "1.0.0"
}
```

## Data Integration

### Automatic Loading

The dashboard automatically reads from:

1. **Centralized Log**: `teleclaude-main/logs/trading_performance.json`
2. **Swing Results**: `Swing/results/backtest_results.json`
3. **Future Systems**: Add paths in `lib/dataLoader.ts`

### Adding New System Results

To integrate a new trading system:

1. **Update dataLoader.ts**

```typescript
// Add new path constant
const NEWSYSTEM_RESULTS_PATH = path.join(
  process.cwd(),
  '..',
  'NewSystem',
  'results',
  'results.json'
);

// Add loader function
export function loadNewSystemResults(): any {
  try {
    if (fs.existsSync(NEWSYSTEM_RESULTS_PATH)) {
      const data = fs.readFileSync(NEWSYSTEM_RESULTS_PATH, 'utf-8');
      return JSON.parse(data);
    }
  } catch (error) {
    console.error('Error loading NewSystem results:', error);
  }
  return null;
}

// Add converter function
export function convertNewSystemToRuns(data: any): TradingRun[] {
  // Transform your system's data format to TradingRun[]
  return [];
}

// Update getAllRuns() to include new system
export function getAllRuns(filters?: any): TradingRun[] {
  const log = loadPerformanceLog();
  const swingData = loadSwingResults();
  const newSystemData = loadNewSystemResults(); // Add this

  let allRuns = [...log.runs];

  // ... existing Swing merge logic ...

  // Add new system merge logic
  if (newSystemData) {
    const newSystemRuns = convertNewSystemToRuns(newSystemData);
    newSystemRuns.forEach(run => {
      const exists = allRuns.some(r => r.id === run.id);
      if (!exists) {
        allRuns.push(run);
      }
    });
  }

  // ... rest of function ...
}
```

2. **Add System Page**

Create `app/newsystem/page.tsx` following the pattern in `app/swing/page.tsx`

3. **Update Sidebar**

Edit `components/Sidebar.tsx`:

```typescript
const menuItems = [
  { name: 'Overview', href: '/', icon: BarChart3 },
  { name: 'Swing', href: '/swing', icon: TrendingUp },
  { name: 'Quanttime', href: '/quanttime', icon: TrendingUp },
  { name: 'MacroStrategy', href: '/macro', icon: TrendingUp },
  { name: 'NewSystem', href: '/newsystem', icon: TrendingUp }, // Add this
];
```

## API Usage

### Performance Endpoint

**URL**: `/api/performance`

**Method**: GET

**Query Parameters**:
- `system`: Filter by system name (Swing, Quanttime, MacroStrategy)
- `mode`: Filter by mode (backtest, paper, live)
- `timeframe`: Filter by timeframe (tick, 1m, 4h, daily, etc.)

**Examples**:

```bash
# Get all results
curl http://localhost:3000/api/performance

# Get only Swing results
curl http://localhost:3000/api/performance?system=Swing

# Get only live trading results
curl http://localhost:3000/api/performance?mode=live

# Get only 4H timeframe results
curl http://localhost:3000/api/performance?timeframe=4h

# Combine filters
curl http://localhost:3000/api/performance?system=Swing&mode=backtest&timeframe=4h
```

**Response Format**:

```json
{
  "success": true,
  "data": {
    "runs": [
      {
        "id": "swing-tech-123",
        "timestamp": "2026-02-01T12:00:00.000Z",
        "system": "Swing",
        "mode": "backtest",
        "timeframe": "4h",
        "sector": "Technology",
        "config": {},
        "metrics": {
          "sharpe": 2.5,
          "sortino": 3.0,
          "maxDrawdown": 0.15,
          "winRate": 0.65,
          "totalReturn": 0.35,
          "trades": 150
        },
        "equityCurve": []
      }
    ],
    "stats": {
      "avgSharpe": 2.1,
      "avgReturn": 0.28,
      "avgMaxDrawdown": 0.18,
      "avgWinRate": 0.62,
      "totalTrades": 1500,
      "bestSharpe": 3.5,
      "worstDrawdown": 0.40
    },
    "count": 10
  }
}
```

## Tips & Tricks

### Sorting Results Table

- Click any column header to sort by that metric
- Click again to reverse sort order
- Arrow indicators show current sort direction

### Color Coding

- **Green**: Positive performance (Sharpe > 1, positive returns)
- **Red**: Negative performance (Sharpe < 0, negative returns, drawdowns)
- **Gray**: Neutral metrics

### Performance Thresholds

Generally accepted thresholds:
- **Sharpe Ratio**: >1 is good, >2 is excellent, >3 is exceptional
- **Sortino Ratio**: Similar to Sharpe, focuses on downside volatility
- **Max Drawdown**: <20% is good, <10% is excellent
- **Win Rate**: >50% is good, >60% is excellent

### Chart Interactions

- **Hover**: See exact values at each point
- **Zoom**: Scroll on chart area
- **Pan**: Click and drag (if zoom is enabled)

## Maintenance

### Refreshing Data

The dashboard loads data on page load. To see new results:

1. Add results to the log
2. Refresh the browser page

For automatic refresh, you could:
- Add a refresh button
- Implement WebSocket updates
- Use SWR for automatic revalidation

### Archiving Old Results

To keep the dashboard fast:

1. Keep only recent results in the main log
2. Move older results to archive files
3. Add date range filters to the dashboard

### Backup

Regularly backup:
- `trading_performance.json`
- All system-specific result files
- The entire dashboard codebase

## Customization

### Changing Colors

Edit `tailwind.config.js`:

```javascript
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: '#your-color',
        secondary: '#your-color',
      }
    }
  }
}
```

### Adding Metrics

1. Update `lib/types.ts` to add new metric to `PerformanceMetrics`
2. Update `lib/dataLoader.ts` to calculate new metric
3. Add display in components (MetricCard, PerformanceTable)

### Custom Charts

Add new chart components using Recharts:
- Bar charts for comparison
- Pie charts for allocation
- Scatter plots for correlation
- Heatmaps for feature importance

See Recharts docs: https://recharts.org
