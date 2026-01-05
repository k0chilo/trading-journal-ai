
import React from 'react';
import { 
  LayoutDashboard, 
  PlusCircle, 
  History, 
  BrainCircuit, 
  User, 
  Settings, 
  TrendingUp, 
  TrendingDown, 
  Target, 
  Activity,
  AlertTriangle,
  FileText
} from 'lucide-react';

export const ASSETS_PRESETS = [
  'EURUSD', 'GBPUSD', 'USDJPY', 'AUDUSD', 'BTCUSDT', 'ETHUSDT', 'XAUUSD', 'US30', 'NAS100'
];

export const TIMEFRAMES = ['M1', 'M5', 'M15', 'H1', 'H4', 'D1', 'W1'];

export const SETUPS = [
  'Structure Break', 'Engulfing', 'Pullback', 'Supply/Demand', 'Order Block', 'Liquidity Sweep'
];

export const CONFLUENCES = [
  'Structure', 'Engulfing', 'Pullback', 'RSI Divergence', 'Volume', 'Fibonacci'
];

export const ERRORS = [
  'FOMO', 'Early Entry', 'Over-leveraged', 'Revenge Trading', 'Hedged Too Early', 'No SL', 'Greed'
];

export const EMOTIONS = [
  { value: 'CALM', label: 'Calmo', color: 'text-blue-400' },
  { value: 'ANXIOUS', label: 'Ansioso', color: 'text-yellow-400' },
  { value: 'CONFIDENT', label: 'Confiante', color: 'text-green-400' },
  { value: 'FEARFUL', label: 'Medo', color: 'text-red-400' }
];

export const NAV_ITEMS = [
  { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={20} /> },
  { id: 'new-trade', label: 'Novo Trade', icon: <PlusCircle size={20} /> },
  { id: 'history', label: 'Histórico', icon: <History size={20} /> },
  { id: 'ai-insights', label: 'Análise IA', icon: <BrainCircuit size={20} /> },
  { id: 'profile', label: 'Perfil', icon: <User size={20} /> }
];
