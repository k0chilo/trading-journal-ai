
import React, { useState } from 'react';
import { TraderProfile } from '../types';
import { Save, User, ShieldCheck, DollarSign, Target } from 'lucide-react';

interface ProfileViewProps {
  profile: TraderProfile;
  onUpdate: (profile: TraderProfile) => void;
}

const ProfileView: React.FC<ProfileViewProps> = ({ profile, onUpdate }) => {
  const [formData, setFormData] = useState<TraderProfile>(profile);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: parseFloat(value) }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdate(formData);
    alert('Configurações salvas com sucesso!');
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Configurações de <span className="text-red-600">Performance</span></h1>
        <p className="text-slate-500 mt-1">Defina seus objetivos e limites de risco.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <section className="bg-slate-900 border border-slate-800 p-6 rounded-2xl">
            <h3 className="text-sm font-bold text-red-500 uppercase mb-6 flex items-center gap-2">
              <DollarSign size={18} />
              Capital & Banca
            </h3>
            <div className="space-y-4">
              <div>
                <label className="text-xs text-slate-400 block mb-1 uppercase font-bold tracking-wider">Capital Inicial ($)</label>
                <input type="number" name="initialCapital" value={formData.initialCapital} onChange={handleInputChange} className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-lg font-bold mono focus:border-red-500 outline-none" />
              </div>
               <div>
                <label className="text-xs text-slate-400 block mb-1 uppercase font-bold tracking-wider">Capital Atual ($)</label>
                <input type="number" name="currentCapital" value={formData.currentCapital} onChange={handleInputChange} className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-lg font-bold mono focus:border-red-500 outline-none" />
                <p className="text-[10px] text-slate-600 mt-1">*Atualizado automaticamente ao salvar trades.</p>
              </div>
            </div>
          </section>

          <section className="bg-slate-900 border border-slate-800 p-6 rounded-2xl">
            <h3 className="text-sm font-bold text-red-500 uppercase mb-6 flex items-center gap-2">
              <ShieldCheck size={18} />
              Gerenciamento de Risco
            </h3>
            <div className="space-y-4">
              <div>
                <label className="text-xs text-slate-400 block mb-1 uppercase font-bold tracking-wider">Risco Máx por Trade (%)</label>
                <input type="number" step="0.1" name="maxTradeRisk" value={formData.maxTradeRisk} onChange={handleInputChange} className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-lg font-bold mono focus:border-red-500 outline-none" />
              </div>
               <div>
                <label className="text-xs text-slate-400 block mb-1 uppercase font-bold tracking-wider">Risco Máx Diário (%)</label>
                <input type="number" step="0.1" name="maxDailyRisk" value={formData.maxDailyRisk} onChange={handleInputChange} className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-lg font-bold mono focus:border-red-500 outline-none" />
              </div>
            </div>
          </section>

          <section className="bg-slate-900 border border-slate-800 p-6 rounded-2xl md:col-span-2">
            <h3 className="text-sm font-bold text-red-500 uppercase mb-6 flex items-center gap-2">
              <Target size={18} />
              Metas de Lucratividade
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="text-xs text-slate-400 block mb-1 uppercase font-bold tracking-wider">Meta Diária ($)</label>
                    <input type="number" name="dailyGoal" value={formData.dailyGoal} onChange={handleInputChange} className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-lg font-bold mono focus:border-red-500 outline-none" />
                </div>
                <div>
                    <label className="text-xs text-slate-400 block mb-1 uppercase font-bold tracking-wider">Meta Semanal ($)</label>
                    <input type="number" name="weeklyGoal" value={formData.weeklyGoal} onChange={handleInputChange} className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-lg font-bold mono focus:border-red-500 outline-none" />
                </div>
            </div>
          </section>
        </div>

        <div className="flex justify-end">
            <button type="submit" className="bg-red-600 hover:bg-red-700 text-white font-bold py-4 px-12 rounded-xl flex items-center gap-2 transition-all shadow-xl shadow-red-600/20 active:scale-95">
                <Save size={20} />
                SALVAR PERFIL E METAS
            </button>
        </div>
      </form>
    </div>
  );
};

export default ProfileView;
