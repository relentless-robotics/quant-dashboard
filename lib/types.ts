export type TradingSystem = 'Swing' | 'Quanttime' | 'MacroStrategy';
export type TradingMode = 'backtest' | 'paper' | 'live';
export type Timeframe = 'tick' | '1m' | '5m' | '15m' | '1h' | '4h' | 'daily' | 'weekly';

export interface PerformanceMetrics {
  sharpe: number;
  sortino: number;
  maxDrawdown: number;
  winRate: number;
  totalReturn: number;
  avgWin?: number;
  avgLoss?: number;
  profitFactor?: number;
  trades?: number;
  [key: string]: any;
}

export interface EquityCurvePoint {
  date: string;
  value: number;
}

export interface TradingRun {
  id: string;
  timestamp: string;
  system: TradingSystem;
  mode: TradingMode;
  timeframe: Timeframe;
  config: Record<string, any>;
  metrics: PerformanceMetrics;
  equityCurve: EquityCurvePoint[];
  sector?: string;
  symbol?: string;
  notes?: string;
}

export interface PerformanceLog {
  runs: TradingRun[];
  lastUpdated: string;
  version: string;
}
