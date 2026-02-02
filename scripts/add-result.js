#!/usr/bin/env node

/**
 * Script to add new trading results to the centralized performance log
 *
 * Usage:
 *   node scripts/add-result.js --system Swing --mode backtest --timeframe 4h --sharpe 2.5 --return 0.35 --maxdd 0.15
 *
 * Or pass a JSON file:
 *   node scripts/add-result.js --file path/to/result.json
 */

const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('crypto').randomUUID || (() => Date.now().toString());

const LOG_PATH = path.join(__dirname, '..', '..', 'teleclaude-main', 'logs', 'trading_performance.json');

function loadLog() {
  try {
    if (fs.existsSync(LOG_PATH)) {
      const data = fs.readFileSync(LOG_PATH, 'utf-8');
      return JSON.parse(data);
    }
  } catch (error) {
    console.error('Error loading log:', error);
  }

  return {
    runs: [],
    lastUpdated: new Date().toISOString(),
    version: '1.0.0'
  };
}

function saveLog(log) {
  const dir = path.dirname(LOG_PATH);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  log.lastUpdated = new Date().toISOString();
  fs.writeFileSync(LOG_PATH, JSON.stringify(log, null, 2));
  console.log('✅ Result saved to:', LOG_PATH);
}

function parseArgs() {
  const args = process.argv.slice(2);
  const parsed = {};

  for (let i = 0; i < args.length; i += 2) {
    const key = args[i].replace(/^--/, '');
    const value = args[i + 1];
    parsed[key] = value;
  }

  return parsed;
}

function addResult(run) {
  const log = loadLog();

  // Validate required fields
  if (!run.system || !run.mode || !run.timeframe) {
    console.error('❌ Error: system, mode, and timeframe are required');
    process.exit(1);
  }

  // Ensure run has required structure
  const newRun = {
    id: run.id || `${run.system.toLowerCase()}-${Date.now()}`,
    timestamp: run.timestamp || new Date().toISOString(),
    system: run.system,
    mode: run.mode,
    timeframe: run.timeframe,
    config: run.config || {},
    metrics: {
      sharpe: parseFloat(run.metrics?.sharpe || run.sharpe || 0),
      sortino: parseFloat(run.metrics?.sortino || run.sortino || 0),
      maxDrawdown: parseFloat(run.metrics?.maxDrawdown || run.maxdd || 0),
      winRate: parseFloat(run.metrics?.winRate || run.winrate || 0.5),
      totalReturn: parseFloat(run.metrics?.totalReturn || run.return || 0),
      trades: parseInt(run.metrics?.trades || run.trades || 0),
    },
    equityCurve: run.equityCurve || run.equity || [],
    sector: run.sector,
    symbol: run.symbol,
    notes: run.notes
  };

  log.runs.push(newRun);
  saveLog(log);

  console.log('✅ Added result:', {
    id: newRun.id,
    system: newRun.system,
    sharpe: newRun.metrics.sharpe,
    return: newRun.metrics.totalReturn
  });
}

// Main
const args = parseArgs();

if (args.file) {
  // Load from JSON file
  const filePath = path.resolve(args.file);
  if (!fs.existsSync(filePath)) {
    console.error('❌ Error: File not found:', filePath);
    process.exit(1);
  }

  const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
  if (Array.isArray(data)) {
    data.forEach(run => addResult(run));
  } else {
    addResult(data);
  }
} else {
  // Parse from command line args
  addResult(args);
}
