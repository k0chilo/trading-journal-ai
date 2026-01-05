
import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Trade, AdvancedStats, TraderProfile } from '../types';
import { calculateStats, getEquityCurve } from '../utils/stats';
import StatCard from './StatCard';
import { TrendingUp, TrendingDown, Target, Activity, Zap, Percent, ShieldAlert } from 'lucide-react';

interface DashboardProps {
  trades: Trade[];
  profile: TraderProfile;
}

const Dashboard: React.FC<DashboardProps> = ({ trades, profile }) => {
  const stats = calculateStats(trades);
  const equityData = getEquityCurve(trades, profile.initialCapital);

  const winLossData = [
    { name: 'Gains', value: trades.filter(t => t.result === 'GAIN').length },
    { name: 'Losses', value: trades.filter(t => t.result === 'LOSS').length },
    { name: 'BE', value: trades.filter(t => t.result === 'BE').length },
  ];

  const COLORS = ['#10b981', '#ef4444', '#64748b'];

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Market Intelligence <span className="text-red-600">Dashboard</span></h1>
          <p className="text-slate-500 mt-1">Visão geral do seu desempenho e métricas de risco.</p>
        </div>
        <div className="bg-slate-900/50 p-3 rounded-lg border border-slate-800 flex items-center gap-4">
          <div className="text-right">
            <p className="text-xs text-slate-500 uppercase font-bold">Saldo Atual</p>
            <p className="text-xl font-bold mono text-red-500">${(profile.initialCapital + stats.totalPnL).toFixed(2)}</p>
          </div>
          <div className="h-10 w-px bg-slate-800"></div>
          <div className="text-right">
            <p className="text-xs text-slate-500 uppercase font-bold">Lucro Líquido</p>
            <p className={`text-xl font-bold mono ${stats.totalPnL >= 0 ? 'text-green-500' : 'text-red-500'}`}>
              {stats.totalPnL >= 0 ? '+' : ''}${stats.totalPnL.toFixed(2)}
            </p>
          </div>
        </div>
      </div>

      {/* Primary Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard 
          label="Win Rate" 
          value={`${stats.winRate.toFixed(1)}%`} 
          subValue={`${trades.filter(t => t.result === 'GAIN').length} Vitórias / ${trades.length} Trades`}
          icon={<Target size={20} />}
          trend={stats.winRate > 50 ? 'up' : 'down'}
        />
        <StatCard 
          label="Drawdown Máx" 
          value={`$${stats.maxDrawdown.toFixed(2)}`} 
          subValue="Maior queda desde o topo"
          icon={<ShieldAlert size={20} />}
          trend="neutral"
        />
        <StatCard 
          label="Expectância" 
          value={`$${stats.expectancy.toFixed(2)}`} 
          subValue="Lucro esperado por trade"
          icon={<Zap size={20} />}
          trend={stats.expectancy > 0 ? 'up' : 'down'}
        />
        <StatCard 
          label="Profit Factor" 
          value={(stats.avgWin / (stats.avgLoss || 1) * (stats.winRate / (100 - stats.winRate || 1))).toFixed(2)}
          subValue="Relação ganho/perda bruta"
          icon={<TrendingUp size={20} />}
          trend="neutral"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Equity Curve Chart */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold flex items-center gap-2">
              <TrendingUp size={18} className="text-red-500" />
              Curva de Equity
            </h3>
            <div className="flex gap-2">
              <span className="bg-green-500/10 text-green-500 text-[10px] font-bold px-2 py-1 rounded">LIVE EVOLUTION</span>
            </div>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={equityData}>
                <defs>
                  <linearGradient id="colorBalance" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                <XAxis dataKey="trade" stroke="#475569" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#475569" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(val) => `$${val}`} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '8px' }}
                  itemStyle={{ color: '#ef4444' }}
                />
                <Area type="monotone" dataKey="balance" stroke="#ef4444" strokeWidth={3} fillOpacity={1} fill="url(#colorBalance)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Win/Loss Distribution */}
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl">
          <h3 className="font-bold flex items-center gap-2 mb-6">
            <Percent size={18} className="text-red-500" />
            Distribuição de Resultados
          </h3>
          <div className="h-[250px] w-full flex items-center justify-center relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={winLossData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {winLossData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-3xl font-bold">{stats.winRate.toFixed(0)}%</span>
                <span className="text-[10px] text-slate-500 uppercase font-bold">Win Rate</span>
            </div>
          </div>
          <div className="mt-4 space-y-2">
            {winLossData.map((item, idx) => (
                <div key={item.name} className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[idx] }}></div>
                        <span className="text-sm text-slate-400">{item.name}</span>
                    </div>
                    <span className="text-sm font-bold mono">{item.value}</span>
                </div>
            ))}
          </div>
        </div>
      </div>

      {/* Advanced Performance Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
            <h4 className="text-xs font-bold text-slate-500 uppercase mb-4 tracking-widest">Sequências (Streaks)</h4>
            <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                    <p className="text-[10px] text-slate-500 font-bold uppercase mb-1">Max Wins</p>
                    <p className="text-2xl font-bold text-green-500 mono">{stats.maxWinStreak}</p>
                </div>
                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                    <p className="text-[10px] text-slate-500 font-bold uppercase mb-1">Max Losses</p>
                    <p className="text-2xl font-bold text-red-500 mono">{stats.maxLossStreak}</p>
                </div>
            </div>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
            <h4 className="text-xs font-bold text-slate-500 uppercase mb-4 tracking-widest">Médias Financeiras</h4>
            <div className="space-y-3">
                <div className="flex justify-between items-center">
                    <span className="text-sm text-slate-400">Ganho Médio</span>
                    <span className="text-sm font-bold text-green-500 mono">+${stats.avgWin.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center">
                    <span className="text-sm text-slate-400">Perda Média</span>
                    <span className="text-sm font-bold text-red-500 mono">-${stats.avgLoss.toFixed(2)}</span>
                </div>
                <div className="h-px bg-slate-800 my-2"></div>
                <div className="flex justify-between items-center">
                    <span className="text-sm text-slate-400">Ratio Ganho/Perda</span>
                    <span className="text-sm font-bold mono">{(stats.avgWin / (stats.avgLoss || 1)).toFixed(2)}</span>
                </div>
            </div>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
            <h4 className="text-xs font-bold text-slate-500 uppercase mb-4 tracking-widest">Eficiência Operacional</h4>
            <div className="space-y-3">
                <div className="flex justify-between items-center">
                    <span className="text-sm text-slate-400">R:R Planejado Médio</span>
                    <span className="text-sm font-bold mono">1:{stats.avgRR.toFixed(1)}</span>
                </div>
                <div className="flex justify-between items-center">
                    <span className="text-sm text-slate-400">Aderência ao Plano</span>
                    <span className="text-sm font-bold text-red-500 mono">
                        {((trades.filter(t => t.planFollowed).length / (trades.length || 1)) * 100).toFixed(0)}%
                    </span>
                </div>
                 <div className="flex justify-between items-center">
                    <span className="text-sm text-slate-400">Total de Ordens</span>
                    <span className="text-sm font-bold mono">{trades.length}</span>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
