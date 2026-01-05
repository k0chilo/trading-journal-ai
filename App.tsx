
import React, { useState, useEffect } from 'react';
import { Trade, TraderProfile } from './types';
import { NAV_ITEMS } from './constants';
import Dashboard from './components/Dashboard';
import HistoryView from './components/HistoryView';
import TradeEntryForm from './components/TradeEntryForm';
import AIInsightsView from './components/AIInsightsView';
import ProfileView from './components/ProfileView';
import { LayoutDashboard, PlusCircle, History, BrainCircuit, User, Bell, LogOut } from 'lucide-react';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showEntryForm, setShowEntryForm] = useState(false);
  const [trades, setTrades] = useState<Trade[]>([]);
  const [profile, setProfile] = useState<TraderProfile>({
    initialCapital: 1000,
    currentCapital: 1000,
    dailyGoal: 50,
    weeklyGoal: 200,
    maxDailyRisk: 3,
    maxTradeRisk: 1
  });

  // Load state from localStorage
  useEffect(() => {
    const savedTrades = localStorage.getItem('stj_trades');
    const savedProfile = localStorage.getItem('stj_profile');
    if (savedTrades) setTrades(JSON.parse(savedTrades));
    if (savedProfile) setProfile(JSON.parse(savedProfile));
  }, []);

  // Save state to localStorage
  useEffect(() => {
    localStorage.setItem('stj_trades', JSON.stringify(trades));
    localStorage.setItem('stj_profile', JSON.stringify(profile));
  }, [trades, profile]);

  const handleSaveTrade = (trade: Trade) => {
    setTrades(prev => [trade, ...prev]);
    setShowEntryForm(false);
    // Update current capital automatically
    setProfile(prev => ({
        ...prev,
        currentCapital: prev.currentCapital + trade.resultUSD
    }));
  };

  const handleDeleteTrade = (id: string) => {
    if (window.confirm('Deseja realmente excluir este registro?')) {
      setTrades(prev => prev.filter(t => t.id !== id));
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard': return <Dashboard trades={trades} profile={profile} />;
      case 'history': return <HistoryView trades={trades} onDelete={handleDeleteTrade} />;
      case 'ai-insights': return <AIInsightsView trades={trades} profile={profile} />;
      case 'profile': return <ProfileView profile={profile} onUpdate={setProfile} />;
      default: return <Dashboard trades={trades} profile={profile} />;
    }
  };

  return (
    <div className="flex h-screen bg-slate-950 text-slate-100 overflow-hidden">
      {/* Sidebar Navigation */}
      <aside className="w-20 md:w-64 bg-slate-900 border-r border-slate-800 flex flex-col transition-all">
        <div className="p-6 mb-8 flex items-center gap-3">
          <div className="w-10 h-10 bg-red-600 rounded-xl flex items-center justify-center shadow-lg shadow-red-600/30">
            <span className="text-2xl font-black italic">S</span>
          </div>
          <h1 className="hidden md:block text-sm font-black tracking-tighter uppercase leading-none">
            Smart Trading<br/>
            <span className="text-red-500">Journal Pro</span>
          </h1>
        </div>

        <nav className="flex-1 px-4 space-y-2">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                if (item.id === 'new-trade') {
                  setShowEntryForm(true);
                } else {
                  setActiveTab(item.id);
                }
              }}
              className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-all font-medium ${
                activeTab === item.id ? 'bg-red-600 text-white shadow-lg shadow-red-600/20' : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }`}
            >
              {item.icon}
              <span className="hidden md:block">{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-800">
          <button className="w-full flex items-center gap-4 px-4 py-3 text-slate-500 hover:text-red-500 transition-colors">
            <LogOut size={20} />
            <span className="hidden md:block">Sair</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Header/Topbar */}
        <header className="h-20 border-b border-slate-800 flex items-center justify-between px-8 bg-slate-900/50 backdrop-blur-md sticky top-0 z-30">
          <div className="flex items-center gap-4">
             <div className="hidden sm:flex items-center gap-2 bg-slate-950 border border-slate-800 px-3 py-1.5 rounded-full">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Global Markets Live</span>
             </div>
          </div>
          <div className="flex items-center gap-6">
            <button className="relative text-slate-400 hover:text-white transition-colors">
              <Bell size={20} />
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-600 rounded-full text-[8px] flex items-center justify-center font-bold border-2 border-slate-900">2</span>
            </button>
            <div className="flex items-center gap-3 pl-6 border-l border-slate-800">
              <div className="text-right">
                <p className="text-xs font-bold leading-none">Trader Pro</p>
                <p className="text-[10px] text-slate-500 font-medium">Conta VIP</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-slate-800 border-2 border-slate-700 overflow-hidden ring-2 ring-red-500/20">
                 <img src="https://picsum.photos/100/100" alt="Avatar" />
              </div>
            </div>
          </div>
        </header>

        {/* Dynamic Content */}
        <div className="flex-1 overflow-y-auto bg-slate-950 scroll-smooth">
          {renderContent()}
        </div>
      </main>

      {/* Modals */}
      {showEntryForm && (
        <TradeEntryForm 
          onSave={handleSaveTrade} 
          onClose={() => setShowEntryForm(false)} 
        />
      )}
    </div>
  );
};

export default App;
