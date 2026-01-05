
export enum TradeType {
  BUY = 'BUY',
  SELL = 'SELL'
}

export enum TradeResult {
  GAIN = 'GAIN',
  LOSS = 'LOSS',
  BE = 'BE'
}

export enum Emotion {
  CALM = 'CALM',
  ANXIOUS = 'ANXIOUS',
  CONFIDENT = 'CONFIDENT',
  FEARFUL = 'FEARFUL'
}

export enum ErrorType {
  TECHNICAL = 'TECHNICAL',
  PSYCHOLOGICAL = 'PSYCHOLOGICAL',
  NONE = 'NONE'
}

export interface Trade {
  id: string;
  date: string;
  entryTime: string;
  exitTime: string;
  asset: string;
  timeframe: string;
  type: TradeType;
  setup: string;
  confluences: string[];
  entryPrice: number;
  stopLoss: number;
  takeProfit: number;
  riskPct: number;
  riskUSD: number;
  result: TradeResult;
  resultPips: number;
  resultUSD: number;
  resultPct: number;
  rrPlanned: number;
  rrActual: number;
  emotionBefore: Emotion;
  emotionDuring: Emotion;
  emotionAfter: Emotion;
  planFollowed: boolean;
  errorType: ErrorType;
  errorDetails: string[];
  notes: string;
  images: string[];
}

export interface TraderProfile {
  initialCapital: number;
  currentCapital: number;
  dailyGoal: number;
  weeklyGoal: number;
  maxDailyRisk: number;
  maxTradeRisk: number;
}

export interface AdvancedStats {
  totalPnL: number;
  winRate: number;
  expectancy: number;
  maxDrawdown: number;
  avgRR: number;
  maxWinStreak: number;
  maxLossStreak: number;
  avgWin: number;
  avgLoss: number;
  totalTrades: number;
}
