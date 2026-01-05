
import { Trade, AdvancedStats, TradeResult } from '../types';

export const calculateStats = (trades: Trade[]): AdvancedStats => {
  if (trades.length === 0) {
    return {
      totalPnL: 0,
      winRate: 0,
      expectancy: 0,
      maxDrawdown: 0,
      avgRR: 0,
      maxWinStreak: 0,
      maxLossStreak: 0,
      avgWin: 0,
      avgLoss: 0,
      totalTrades: 0
    };
  }

  const wins = trades.filter(t => t.result === TradeResult.GAIN);
  const losses = trades.filter(t => t.result === TradeResult.LOSS);
  const totalPnL = trades.reduce((sum, t) => sum + t.resultUSD, 0);
  const winRate = (wins.length / trades.length) * 100;
  
  const avgWin = wins.length > 0 ? wins.reduce((sum, t) => sum + t.resultUSD, 0) / wins.length : 0;
  const avgLoss = losses.length > 0 ? Math.abs(losses.reduce((sum, t) => sum + t.resultUSD, 0) / losses.length) : 0;
  
  // Expectancy = (WinRate * AvgWin) - (LossRate * AvgLoss)
  const lossRate = 1 - (winRate / 100);
  const expectancy = ((winRate / 100) * avgWin) - (lossRate * avgLoss);

  const avgRR = trades.reduce((sum, t) => sum + t.rrActual, 0) / trades.length;

  // Streaks
  let maxWinStreak = 0;
  let maxLossStreak = 0;
  let currentWinStreak = 0;
  let currentLossStreak = 0;

  trades.forEach(t => {
    if (t.result === TradeResult.GAIN) {
      currentWinStreak++;
      currentLossStreak = 0;
      maxWinStreak = Math.max(maxWinStreak, currentWinStreak);
    } else if (t.result === TradeResult.LOSS) {
      currentLossStreak++;
      currentWinStreak = 0;
      maxLossStreak = Math.max(maxLossStreak, currentLossStreak);
    }
  });

  // Basic Drawdown (simplified)
  let peak = 0;
  let maxDD = 0;
  let runningPnL = 0;
  trades.forEach(t => {
    runningPnL += t.resultUSD;
    if (runningPnL > peak) peak = runningPnL;
    const dd = peak - runningPnL;
    if (dd > maxDD) maxDD = dd;
  });

  return {
    totalPnL,
    winRate,
    expectancy,
    maxDrawdown: maxDD,
    avgRR,
    maxWinStreak,
    maxLossStreak,
    avgWin,
    avgLoss,
    totalTrades: trades.length
  };
};

export const getEquityCurve = (trades: Trade[], initialCapital: number) => {
  let current = initialCapital;
  return trades.map((t, idx) => {
    current += t.resultUSD;
    return {
      trade: idx + 1,
      balance: current,
      date: t.date
    };
  });
};
