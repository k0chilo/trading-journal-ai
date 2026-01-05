
import React, { useState } from 'react';
import { Trade, TradeResult } from '../types';
import { Calendar, Search, Filter, ArrowUpRight, ArrowDownRight, MoreHorizontal, Eye } from 'lucide-react';

interface HistoryViewProps {
  trades: Trade[];
  onDelete: (id: string) => void;
}

const HistoryView: React.FC<HistoryViewProps> = ({ trades, onDelete }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAsset, setSelectedAsset] = useState('ALL');

  const filteredTrades = trades.filter(t => {
    const matchesSearch = t.asset.toLowerCase().includes(searchTerm.toLowerCase()) || t.setup.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesAsset = selectedAsset === 'ALL' || t.asset === selectedAsset;
    return matchesSearch && matchesAsset;
  }).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const assets = Array.from(new Set(trades.map(t => t.asset)));

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Journal de <span className="text-red-600">Bordo</span></h1>
        <p className="text-slate-500 mt-1">Histórico completo de suas operações.</p>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        {/* Filters */}
        <div className="p-4 border-b border-slate-800 flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative w-full md:w-64">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input 
              type="text" 
              placeholder="Buscar por ativo ou setup..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg py-2 pl-10 pr-4 text-sm focus:border-red-500 outline-none"
            />
          </div>
          <div className="flex gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
             <button 
                onClick={() => setSelectedAsset('ALL')}
                className={`px-3 py-1 rounded-full text-xs font-bold transition-all border ${selectedAsset === 'ALL' ? 'bg-red-600 border-red-500 text-white' : 'bg-slate-950 border-slate-800 text-slate-500 hover:text-white'}`}
              >
                TODOS
              </button>
              {assets.map(asset => (
                <button 
                  key={asset}
                  onClick={() => setSelectedAsset(asset)}
                  className={`px-3 py-1 rounded-full text-xs font-bold transition-all border ${selectedAsset === asset ? 'bg-red-600 border-red-500 text-white' : 'bg-slate-950 border-slate-800 text-slate-500 hover:text-white'}`}
                >
                  {asset}
                </button>
              ))}
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-950/50 text-[10px] text-slate-500 uppercase font-bold tracking-wider">
                <th className="px-6 py-4">Data / Ativo</th>
                <th className="px-6 py-4">Tipo / Setup</th>
                <th className="px-6 py-4">Entrada / Saída</th>
                <th className="px-6 py-4">R:R</th>
                <th className="px-6 py-4">Resultado</th>
                <th className="px-6 py-4 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {filteredTrades.map((trade) => (
                <tr key={trade.id} className="hover:bg-slate-800/30 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="text-sm font-bold text-white">{trade.asset}</span>
                      <span className="text-[10px] text-slate-500 mono">{trade.date}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${trade.type === 'BUY' ? 'bg-green-500/10 text-green-500 border border-green-500/20' : 'bg-red-500/10 text-red-500 border border-red-500/20'}`}>
                        {trade.type}
                      </span>
                      <span className="text-xs text-slate-400">{trade.setup}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                     <div className="flex flex-col">
                      <span className="text-xs font-medium mono">${trade.entryPrice.toFixed(4)}</span>
                      <span className="text-[10px] text-slate-500 mono">{trade.entryTime}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-xs font-bold mono">1:{trade.rrActual || trade.rrPlanned}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className={`flex flex-col ${trade.result === 'GAIN' ? 'text-green-500' : trade.result === 'LOSS' ? 'text-red-500' : 'text-slate-400'}`}>
                      <span className="text-sm font-bold mono">{trade.result === 'GAIN' ? '+' : ''}{trade.resultUSD.toFixed(2)}</span>
                      <span className="text-[10px] font-bold uppercase">{trade.result}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                        <button className="p-2 text-slate-500 hover:text-white transition-colors">
                            <Eye size={16} />
                        </button>
                        <button onClick={() => onDelete(trade.id)} className="p-2 text-slate-500 hover:text-red-500 transition-colors">
                            <MoreHorizontal size={16} />
                        </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredTrades.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-slate-500">
                    Nenhum trade encontrado com esses filtros.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default HistoryView;
