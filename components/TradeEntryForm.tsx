import React, { useState } from 'react';
import { Trade, TradeType, TradeResult, Emotion, ErrorType } from '../types';
import { ASSETS_PRESETS, TIMEFRAMES, SETUPS, CONFLUENCES, EMOTIONS, ERRORS } from '../constants';
import { X, Camera, Save, Trash2 } from 'lucide-react';

interface TradeEntryFormProps {
  onSave: (trade: Trade) => void;
  onClose: () => void;
}

const TradeEntryForm: React.FC<TradeEntryFormProps> = ({ onSave, onClose }) => {
  const [formData, setFormData] = useState<Partial<Trade>>({
    id: crypto.randomUUID(),
    date: new Date().toISOString().split('T')[0],
    entryTime: '',
    exitTime: '',
    asset: 'EURUSD',
    timeframe: 'H1',
    type: TradeType.BUY,
    setup: 'Structure Break',
    confluences: [],
    entryPrice: 0,
    stopLoss: 0,
    takeProfit: 0,
    riskPct: 1,
    riskUSD: 0,
    result: TradeResult.BE,
    resultPips: 0,
    resultUSD: 0,
    resultPct: 0,
    rrPlanned: 0,
    rrActual: 0,
    emotionBefore: Emotion.CALM,
    emotionDuring: Emotion.CALM,
    emotionAfter: Emotion.CALM,
    planFollowed: true,
    errorType: ErrorType.NONE,
    errorDetails: [],
    notes: '',
    images: []
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? parseFloat(value) : value
    }));
  };

  const handleCheckboxChange = (field: 'confluences' | 'errorDetails', value: string) => {
    setFormData(prev => {
      const current = (prev[field] as string[]) || [];
      const updated = current.includes(value) 
        ? current.filter(i => i !== value) 
        : [...current, value];
      return { ...prev, [field]: updated };
    });
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      // Fix: Use a standard for loop to avoid Array.from iteration type issues with FileList
      // This ensures 'file' is correctly typed as File, which extends Blob.
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        if (file) {
          const reader = new FileReader();
          reader.onloadend = () => {
            setFormData(prev => ({
              ...prev,
              images: [...(prev.images || []), reader.result as string]
            }));
          };
          reader.readAsDataURL(file);
        }
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData as Trade);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-4xl shadow-2xl my-8">
        <form onSubmit={handleSubmit}>
          {/* Header */}
          <div className="flex justify-between items-center p-6 border-b border-slate-800">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <span className="w-2 h-6 bg-red-600 rounded-full"></span>
              Registrar Operação
            </h2>
            <button type="button" onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
              <X size={24} />
            </button>
          </div>

          <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-8 max-h-[70vh] overflow-y-auto">
            {/* Col 1: General Info */}
            <div className="space-y-6">
              <section>
                <h3 className="text-sm font-semibold text-red-500 uppercase mb-4">Dados Básicos</h3>
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <label className="text-xs text-slate-400 block mb-1">Data</label>
                    <input type="date" name="date" value={formData.date} onChange={handleInputChange} className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-sm focus:border-red-500 outline-none" required />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-xs text-slate-400 block mb-1">Entrada</label>
                      <input type="time" name="entryTime" value={formData.entryTime} onChange={handleInputChange} className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-sm focus:border-red-500 outline-none" required />
                    </div>
                    <div>
                      <label className="text-xs text-slate-400 block mb-1">Saída</label>
                      <input type="time" name="exitTime" value={formData.exitTime} onChange={handleInputChange} className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-sm focus:border-red-500 outline-none" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-xs text-slate-400 block mb-1">Ativo</label>
                      <select name="asset" value={formData.asset} onChange={handleInputChange} className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-sm focus:border-red-500 outline-none">
                        {ASSETS_PRESETS.map(a => <option key={a} value={a}>{a}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="text-xs text-slate-400 block mb-1">Timeframe</label>
                      <select name="timeframe" value={formData.timeframe} onChange={handleInputChange} className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-sm focus:border-red-500 outline-none">
                        {TIMEFRAMES.map(t => <option key={t} value={t}>{t}</option>)}
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="text-xs text-slate-400 block mb-1">Tipo de Operação</label>
                    <div className="flex bg-slate-950 p-1 rounded-lg border border-slate-800">
                      <button type="button" onClick={() => setFormData(p => ({...p, type: TradeType.BUY}))} className={`flex-1 py-1 text-sm font-bold rounded-md transition-all ${formData.type === TradeType.BUY ? 'bg-green-600 text-white' : 'text-slate-500 hover:text-white'}`}>BUY</button>
                      <button type="button" onClick={() => setFormData(p => ({...p, type: TradeType.SELL}))} className={`flex-1 py-1 text-sm font-bold rounded-md transition-all ${formData.type === TradeType.SELL ? 'bg-red-600 text-white' : 'text-slate-500 hover:text-white'}`}>SELL</button>
                    </div>
                  </div>
                </div>
              </section>

              <section>
                <h3 className="text-sm font-semibold text-red-500 uppercase mb-4">Execução</h3>
                <div className="space-y-4">
                  <div>
                    <label className="text-xs text-slate-400 block mb-1">Setup Principal</label>
                    <select name="setup" value={formData.setup} onChange={handleInputChange} className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-sm focus:border-red-500 outline-none">
                      {SETUPS.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-xs text-slate-400 block mb-1">Entrada ($)</label>
                      <input type="number" step="any" name="entryPrice" value={formData.entryPrice} onChange={handleInputChange} className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-sm focus:border-red-500 outline-none" required />
                    </div>
                    <div>
                      <label className="text-xs text-slate-400 block mb-1">Stop Loss ($)</label>
                      <input type="number" step="any" name="stopLoss" value={formData.stopLoss} onChange={handleInputChange} className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-sm focus:border-red-500 outline-none" required />
                    </div>
                  </div>
                </div>
              </section>
            </div>

            {/* Col 2: Result & Psych */}
            <div className="space-y-6 border-x border-slate-800 px-8">
              <section>
                <h3 className="text-sm font-semibold text-red-500 uppercase mb-4">Resultado Realizado</h3>
                <div className="space-y-4">
                   <div className="grid grid-cols-3 gap-2">
                    <button type="button" onClick={() => setFormData(p => ({...p, result: TradeResult.GAIN}))} className={`py-2 text-xs font-bold rounded-lg border ${formData.result === TradeResult.GAIN ? 'bg-green-600/20 border-green-500 text-green-500' : 'bg-slate-950 border-slate-800 text-slate-500'}`}>GAIN</button>
                    <button type="button" onClick={() => setFormData(p => ({...p, result: TradeResult.LOSS}))} className={`py-2 text-xs font-bold rounded-lg border ${formData.result === TradeResult.LOSS ? 'bg-red-600/20 border-red-500 text-red-500' : 'bg-slate-950 border-slate-800 text-slate-500'}`}>LOSS</button>
                    <button type="button" onClick={() => setFormData(p => ({...p, result: TradeResult.BE}))} className={`py-2 text-xs font-bold rounded-lg border ${formData.result === TradeResult.BE ? 'bg-slate-700/20 border-slate-600 text-slate-400' : 'bg-slate-950 border-slate-800 text-slate-500'}`}>BE</button>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-xs text-slate-400 block mb-1">Pips / Pontos</label>
                      <input type="number" name="resultPips" value={formData.resultPips} onChange={handleInputChange} className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-sm focus:border-red-500 outline-none" />
                    </div>
                    <div>
                      <label className="text-xs text-slate-400 block mb-1">Resultado USD ($)</label>
                      <input type="number" step="any" name="resultUSD" value={formData.resultUSD} onChange={handleInputChange} className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-sm focus:border-red-500 outline-none" />
                    </div>
                  </div>
                  <div>
                    <label className="text-xs text-slate-400 block mb-1">R:R Atingido</label>
                    <input type="number" step="0.1" name="rrActual" value={formData.rrActual} onChange={handleInputChange} className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-sm focus:border-red-500 outline-none" />
                  </div>
                </div>
              </section>

              <section>
                <h3 className="text-sm font-semibold text-red-500 uppercase mb-4">Psicológico</h3>
                <div className="space-y-4">
                  <div>
                    <label className="text-xs text-slate-400 block mb-1">Estado Antes</label>
                    <select name="emotionBefore" value={formData.emotionBefore} onChange={handleInputChange} className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-sm focus:border-red-500 outline-none">
                      {EMOTIONS.map(e => <option key={e.value} value={e.value}>{e.label}</option>)}
                    </select>
                  </div>
                  <div className="flex items-center gap-4">
                    <label className="text-xs text-slate-400">Seguiu o Plano?</label>
                    <div className="flex gap-2">
                      <button type="button" onClick={() => setFormData(p => ({...p, planFollowed: true}))} className={`px-3 py-1 text-xs rounded-full border ${formData.planFollowed ? 'bg-green-600 border-green-500 text-white' : 'border-slate-800 text-slate-500'}`}>SIM</button>
                      <button type="button" onClick={() => setFormData(p => ({...p, planFollowed: false}))} className={`px-3 py-1 text-xs rounded-full border ${!formData.planFollowed ? 'bg-red-600 border-red-500 text-white' : 'border-slate-800 text-slate-500'}`}>NÃO</button>
                    </div>
                  </div>
                  <div>
                     <label className="text-xs text-slate-400 block mb-2">Erros Cometidos</label>
                     <div className="grid grid-cols-2 gap-1 h-32 overflow-y-auto bg-slate-950 border border-slate-800 p-2 rounded-lg">
                        {ERRORS.map(e => (
                          <label key={e} className="flex items-center gap-2 text-[10px] cursor-pointer hover:text-white text-slate-400">
                            <input type="checkbox" checked={formData.errorDetails?.includes(e)} onChange={() => handleCheckboxChange('errorDetails', e)} className="accent-red-500" />
                            {e}
                          </label>
                        ))}
                     </div>
                  </div>
                </div>
              </section>
            </div>

            {/* Col 3: Media & Notes */}
            <div className="space-y-6">
              <section>
                <h3 className="text-sm font-semibold text-red-500 uppercase mb-4">Evidências Gráficas</h3>
                <div className="grid grid-cols-2 gap-2 mb-2">
                  {formData.images?.map((img, idx) => (
                    <div key={idx} className="relative aspect-video bg-slate-950 border border-slate-800 rounded-lg group overflow-hidden">
                      <img src={img} className="w-full h-full object-cover" />
                      <button type="button" onClick={() => setFormData(p => ({...p, images: p.images?.filter((_, i) => i !== idx)}))} className="absolute top-1 right-1 bg-red-600 rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Trash2 size={12} />
                      </button>
                    </div>
                  ))}
                  <label className="aspect-video bg-slate-950 border-2 border-dashed border-slate-800 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-red-500/50 transition-colors">
                    <Camera size={24} className="text-slate-600 mb-1" />
                    <span className="text-[10px] text-slate-600 font-bold uppercase">Upload Print</span>
                    <input type="file" multiple accept="image/*" onChange={handleImageUpload} className="hidden" />
                  </label>
                </div>
              </section>

              <section>
                <h3 className="text-sm font-semibold text-red-500 uppercase mb-4">Notas & Reflexão</h3>
                <textarea name="notes" value={formData.notes} onChange={handleInputChange} rows={6} placeholder="O que você sentiu? O que o gráfico estava mostrando?" className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-sm focus:border-red-500 outline-none resize-none placeholder:text-slate-700"></textarea>
              </section>

              <div className="pt-4">
                <button type="submit" className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-red-600/20 active:scale-[0.98]">
                  <Save size={20} />
                  SALVAR TRADE NO JOURNAL
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TradeEntryForm;