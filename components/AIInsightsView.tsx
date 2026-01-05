import React, { useState, useEffect } from 'react';
import { Trade, TraderProfile } from '../types';
import { getAIInsights } from '../services/geminiService';
import { BrainCircuit, Sparkles, Loader2, RefreshCcw } from 'lucide-react';

interface AIInsightsViewProps {
  trades: Trade[];
  profile: TraderProfile;
}

const AIInsightsView: React.FC<AIInsightsViewProps> = ({ trades, profile }) => {
  const [insight, setInsight] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const generateAnalysis = async () => {
    setLoading(true);
    const result = await getAIInsights(trades, profile);
    setInsight(result);
    setLoading(false);
  };

  useEffect(() => {
    if (trades.length > 0 && !insight) {
      generateAnalysis();
    }
  }, []);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">AI Analytical <span className="text-red-600">Mentor</span></h1>
          <p className="text-slate-500 mt-1">Seu analista de performance automatizado.</p>
        </div>
        <button 
          onClick={generateAnalysis}
          disabled={loading}
          className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-white px-4 py-2 rounded-lg transition-colors disabled:opacity-50"
        >
          {loading ? <Loader2 className="animate-spin" size={18} /> : <RefreshCcw size={18} />}
          Atualizar Análise
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl">
            <h3 className="text-sm font-bold text-red-500 uppercase mb-4 flex items-center gap-2">
              <Sparkles size={16} />
              O que eu analiso?
            </h3>
            <ul className="text-xs text-slate-400 space-y-3">
              <li className="flex gap-2">
                <span className="text-red-500">•</span>
                Padrões de erros técnicos frequentes
              </li>
               <li className="flex gap-2">
                <span className="text-red-500">•</span>
                Gatilhos emocionais recorrentes
              </li>
               <li className="flex gap-2">
                <span className="text-red-500">•</span>
                Melhores janelas de horário
              </li>
               <li className="flex gap-2">
                <span className="text-red-500">•</span>
                Eficiência dos seus setups
              </li>
               <li className="flex gap-2">
                <span className="text-red-500">•</span>
                Qualidade do gerenciamento de risco
              </li>
            </ul>
          </div>

          <div className="bg-red-600/10 border border-red-600/20 p-6 rounded-2xl">
            <h3 className="text-sm font-bold text-red-500 uppercase mb-2">Dica Pro</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Quanto mais detalhado você for nas "Notas" de cada trade, melhor será minha análise. Registre suas emoções reais!
            </p>
          </div>
        </div>

        <div className="lg:col-span-3 bg-slate-900 border border-slate-800 rounded-2xl min-h-[500px] shadow-2xl relative overflow-hidden">
          {loading ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-900/50 backdrop-blur-sm z-10">
              <div className="w-16 h-16 border-4 border-red-600/20 border-t-red-600 rounded-full animate-spin mb-4"></div>
              <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Processando estatísticas...</p>
              <p className="text-slate-600 text-xs mt-1">Escaneando padrões nos seus últimos trades</p>
            </div>
          ) : (
             <div className="p-8">
                {insight ? (
                    <div className="prose prose-invert prose-red max-w-none">
                        {/* Fix: Avoid dangerouslySetInnerHTML for better security and use standard rendering with pre-wrap */}
                        <div className="text-slate-300 leading-relaxed whitespace-pre-wrap">
                          {insight}
                        </div>
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center h-full text-center space-y-4">
                        <BrainCircuit size={64} className="text-slate-800" />
                        <h2 className="text-xl font-bold">Inicie sua evolução</h2>
                        <p className="text-slate-500 max-w-md">Registre pelo menos 5 operações para que a Inteligência Artificial possa começar a mapear sua curva de aprendizado.</p>
                        <button onClick={generateAnalysis} className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-8 rounded-xl transition-all">GERAR PRIMEIRA ANÁLISE</button>
                    </div>
                )}
             </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AIInsightsView;