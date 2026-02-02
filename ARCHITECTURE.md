# Architecture Overview

## Technology Stack

### Frontend
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Charts**: Recharts
- **Icons**: Lucide React

### Backend
- **API**: Next.js API Routes (serverless functions)
- **Data Storage**: JSON files (filesystem)
- **Deployment**: Vercel (serverless)

## Project Structure

```
quant-dashboard/
├── app/                      # Next.js 14 App Router
│   ├── layout.tsx           # Root layout with metadata
│   ├── globals.css          # Global styles with Tailwind
│   ├── page.tsx             # Overview page (/)
│   ├── swing/               # Swing system page
│   │   └── page.tsx
│   ├── quanttime/           # Quanttime system page
│   │   └── page.tsx
│   ├── macro/               # MacroStrategy page
│   │   └── page.tsx
│   └── api/                 # API routes
│       └── performance/
│           └── route.ts     # GET /api/performance
│
├── components/              # React components
│   ├── Sidebar.tsx          # Navigation menu
│   ├── MetricCard.tsx       # Metric display card
│   ├── EquityCurveChart.tsx # Line chart component
│   └── PerformanceTable.tsx # Sortable results table
│
├── lib/                     # Utilities and types
│   ├── types.ts             # TypeScript interfaces
│   └── dataLoader.ts        # Data loading and aggregation
│
├── scripts/                 # Helper scripts
│   └── add-result.js        # CLI tool to add results
│
├── public/                  # Static assets
│
├── *.md                     # Documentation
├── package.json             # Dependencies
├── tsconfig.json            # TypeScript config
├── tailwind.config.js       # Tailwind CSS config
├── postcss.config.js        # PostCSS config
└── next.config.js           # Next.js config
```

## Data Flow

### Reading Data

```
User Request
    ↓
Next.js Page (SSR)
    ↓
/api/performance (GET)
    ↓
dataLoader.ts
    ↓
Load from multiple sources:
- trading_performance.json (centralized)
- Swing/results/backtest_results.json
- Quanttime/results/*.json (future)
    ↓
Convert to TradingRun[] format
    ↓
Apply filters (system/mode/timeframe)
    ↓
Calculate aggregated stats
    ↓
Return JSON response
    ↓
Render in React components
```

### Writing Data

```
New Trading Results
    ↓
Option 1: CLI Script
    node scripts/add-result.js --system Swing --sharpe 2.5 ...
    ↓
Option 2: System-specific file
    Swing writes to backtest_results.json
    ↓
Option 3: Direct JSON edit
    Edit trading_performance.json manually
    ↓
Data persisted to filesystem
    ↓
Next page refresh reads updated data
```

## Data Model

### TradingRun (Core Type)

```typescript
interface TradingRun {
  id: string;                    // Unique identifier
  timestamp: string;             // ISO 8601 datetime
  system: TradingSystem;         // 'Swing' | 'Quanttime' | 'MacroStrategy'
  mode: TradingMode;             // 'backtest' | 'paper' | 'live'
  timeframe: Timeframe;          // 'tick' | '1m' | '4h' | 'daily' | etc.
  config: Record<string, any>;   // Model configuration
  metrics: PerformanceMetrics;   // Performance data
  equityCurve: EquityCurvePoint[]; // Time series data
  sector?: string;               // Optional sector name
  symbol?: string;               // Optional symbol
  notes?: string;                // Optional notes
}
```

### PerformanceMetrics

```typescript
interface PerformanceMetrics {
  sharpe: number;        // Sharpe ratio
  sortino: number;       // Sortino ratio
  maxDrawdown: number;   // Max drawdown (0-1)
  winRate: number;       // Win rate (0-1)
  totalReturn: number;   // Total return (0-1)
  avgWin?: number;       // Average winning trade
  avgLoss?: number;      // Average losing trade
  profitFactor?: number; // Profit factor
  trades?: number;       // Number of trades
}
```

### EquityCurvePoint

```typescript
interface EquityCurvePoint {
  date: string;   // Date string (YYYY-MM-DD)
  value: number;  // Portfolio value or return
}
```

## Component Architecture

### Page Structure

```
Page Component (page.tsx)
  ├── useEffect → fetch('/api/performance?system=Swing')
  ├── State Management (useState)
  └── Render:
      ├── Sidebar (navigation)
      ├── MetricCard × 4 (key metrics)
      ├── EquityCurveChart (visualization)
      ├── PerformanceTable (sortable results)
      └── Additional info sections
```

### Component Hierarchy

```
Root Layout (app/layout.tsx)
└── Page (app/page.tsx or app/[system]/page.tsx)
    ├── Sidebar
    │   └── Menu Items
    ├── MetricCard
    │   └── Metric Display
    ├── EquityCurveChart
    │   └── Recharts LineChart
    └── PerformanceTable
        └── Sortable Table Rows
```

## API Design

### GET /api/performance

**Purpose**: Retrieve trading performance data with optional filtering

**Query Parameters**:
- `system`: Filter by trading system
- `mode`: Filter by trading mode
- `timeframe`: Filter by timeframe

**Response Format**:
```json
{
  "success": boolean,
  "data": {
    "runs": TradingRun[],
    "stats": AggregatedStats,
    "count": number
  },
  "error"?: string
}
```

**Implementation**:
- Loads data from multiple sources
- Merges and deduplicates runs
- Applies filters
- Calculates aggregated statistics
- Returns JSON response

## Data Storage

### Centralized Log

**Location**: `teleclaude-main/logs/trading_performance.json`

**Format**:
```json
{
  "runs": TradingRun[],
  "lastUpdated": "ISO 8601 timestamp",
  "version": "1.0.0"
}
```

**Purpose**:
- Single source of truth
- Cross-system aggregation
- Historical tracking

### System-Specific Files

**Swing**: `Swing/results/backtest_results.json`
- Contains sector-level fold performance
- Feature importance data
- Training/validation metrics

**Quanttime**: `Quanttime/results/*.json` (future)
**MacroStrategy**: `MacroStrategy/results/*.json` (future)

### Data Transformation

Each system's format is converted to `TradingRun[]` by:
- System-specific converter functions
- Defined in `lib/dataLoader.ts`
- Handles different data structures

## Rendering Strategy

### Static Site Generation (SSG)

Pages are pre-rendered at build time:
- Overview page
- System-specific pages (Swing, Quanttime, Macro)

**Advantages**:
- Fast initial load
- SEO-friendly
- Low server cost

**Limitation**:
- Data is snapshot from build time
- Requires rebuild for updates

### Dynamic API Routes

API routes are serverless functions:
- Run on-demand
- Always fetch latest data
- No caching by default

**Flow**:
1. User visits page → Sees static HTML
2. Page loads → useEffect runs
3. Fetches `/api/performance` → Runs serverless function
4. Function reads latest data → Returns JSON
5. Page updates with fresh data

## Deployment Architecture

### Vercel Platform

```
GitHub Repository
    ↓
Git Push
    ↓
Vercel Automatic Build
    ↓
Build Process:
- npm install
- next build
- Generate static pages
    ↓
Deploy to CDN:
- Static pages → Edge network
- API routes → Serverless functions
    ↓
Live at: https://your-app.vercel.app
```

### Environment Variables (Optional)

For production features:
- Database URLs
- API keys
- Feature flags

Set in Vercel dashboard under Project Settings → Environment Variables.

## Scalability Considerations

### Current Design (File-based)

**Pros**:
- Simple to implement
- No database needed
- Easy to version control

**Cons**:
- Limited to local files
- No concurrent writes
- No real-time updates

**Suitable for**: Development, small-scale backtesting

### Future Enhancements (Database)

For production/scale:

1. **PostgreSQL/MongoDB**
   - Store runs in database
   - Query with SQL/NoSQL
   - Support concurrent writes

2. **Real-time Updates**
   - WebSocket connections
   - Live trading updates
   - Push notifications

3. **Analytics**
   - Time-series database (InfluxDB)
   - Advanced aggregations
   - Historical analysis

4. **Authentication**
   - NextAuth.js
   - Protect routes
   - User-specific views

## Performance Optimization

### Current Optimizations

- Static page generation
- Client-side data fetching
- Lightweight dependencies
- Tree-shaking with Webpack

### Future Optimizations

- **ISR (Incremental Static Regeneration)**
  ```typescript
  export const revalidate = 60; // Revalidate every 60s
  ```

- **SWR (Stale-While-Revalidate)**
  ```typescript
  import useSWR from 'swr';
  const { data } = useSWR('/api/performance', fetcher);
  ```

- **Image Optimization**
  - Use Next.js `Image` component
  - Lazy load charts

- **Code Splitting**
  - Dynamic imports for charts
  - Reduce initial bundle size

## Security Considerations

### Current State

- Public dashboard (no auth)
- Read-only operations
- No sensitive data in code

### Production Recommendations

1. **Authentication**
   - Add login system
   - Protect sensitive data
   - Role-based access control

2. **API Security**
   - Rate limiting
   - Input validation
   - CORS configuration

3. **Data Privacy**
   - Don't expose P&L amounts
   - Anonymize sensitive info
   - Encrypt at rest

4. **Environment Variables**
   - Never commit secrets
   - Use `.env.local`
   - Vercel environment variables

## Testing Strategy

### Recommended Tests

1. **Unit Tests**
   - Data loader functions
   - Converters
   - Aggregation logic

2. **Integration Tests**
   - API endpoints
   - Data fetching
   - Error handling

3. **E2E Tests**
   - Page navigation
   - Chart rendering
   - Table sorting

### Testing Tools

- **Jest**: Unit/integration tests
- **React Testing Library**: Component tests
- **Playwright**: E2E tests

## Monitoring & Logging

### Production Monitoring

1. **Vercel Analytics**
   - Page views
   - Performance metrics
   - Web vitals

2. **Error Tracking**
   - Sentry integration
   - Error boundaries in React
   - API error logging

3. **Performance**
   - Lighthouse scores
   - Core Web Vitals
   - API response times

## Extension Points

### Adding New Systems

1. Create converter in `lib/dataLoader.ts`
2. Add page in `app/[system]/page.tsx`
3. Update sidebar navigation
4. Update types if needed

### Adding New Metrics

1. Extend `PerformanceMetrics` interface
2. Update converters to calculate metric
3. Add to `MetricCard` displays
4. Add to `PerformanceTable` columns

### Adding New Visualizations

1. Install chart library (if needed)
2. Create component in `components/`
3. Integrate into page layouts
4. Pass data from API

### Custom Dashboards

Create custom pages:
- Comparison views
- Strategy analysis
- Risk dashboards
- Live trading monitors

## Maintenance

### Regular Tasks

- Update dependencies
- Review security vulnerabilities
- Backup data files
- Monitor disk usage

### Upgrade Path

- Next.js updates: `npm install next@latest`
- React updates: `npm install react@latest react-dom@latest`
- Dependency audits: `npm audit fix`

## Resources

- **Next.js**: https://nextjs.org/docs
- **TypeScript**: https://www.typescriptlang.org/docs
- **Tailwind CSS**: https://tailwindcss.com/docs
- **Recharts**: https://recharts.org/en-US/api
- **Vercel**: https://vercel.com/docs
