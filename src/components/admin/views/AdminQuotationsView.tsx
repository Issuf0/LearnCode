import React, { useState } from 'react';
import { Plus, X, Send } from 'lucide-react';
import { Quotation } from '../../../types';

interface AdminQuotationsViewProps {
  quotations: Quotation[];
  onCreateQuotation: (quotation: Quotation) => void;
}

const STATUS_STYLES: Record<Quotation['status'], string> = {
  Draft: 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700',
  Pendente: 'bg-amber-50 dark:bg-amber-950 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-800',
  Aprovado: 'bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800',
  Recusado: 'bg-rose-50 dark:bg-rose-950 text-rose-700 dark:text-rose-400 border-rose-200 dark:border-rose-800',
};

const EMPTY_FORM = { projectTitle: '', priceMzn: '', estimatedTime: '', description: '' };

export const AdminQuotationsView: React.FC<AdminQuotationsViewProps> = ({ quotations, onCreateQuotation }) => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.projectTitle || !form.priceMzn) return;

    onCreateQuotation({
      id: `qt-${Date.now()}`,
      code: `ORC-2026-${String(quotations.length + 1).padStart(3, '0')}`,
      projectTitle: form.projectTitle,
      priceMzn: form.priceMzn,
      priceUsd: '—',
      estimatedTime: form.estimatedTime || 'A definir',
      technologies: [],
      description: form.description,
      status: 'Pendente',
      date: '28 Jul 2026',
    });
    setForm(EMPTY_FORM);
    setIsFormOpen(false);
  };

  return (
    <div className="space-y-5 animate-in fade-in duration-300">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">Gestão de Orçamentos</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Cria e envia orçamentos — o cliente aprova ou recusa no portal dele.
          </p>
        </div>
        <button
          onClick={() => setIsFormOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-500 shadow-md shadow-blue-600/20 transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Novo Orçamento</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {quotations.map((q) => (
          <div
            key={q.id}
            className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-[10px] font-mono font-bold text-slate-400 uppercase">{q.code} · {q.date}</p>
                <h3 className="text-base font-extrabold text-slate-900 dark:text-white leading-snug mt-0.5">
                  {q.projectTitle}
                </h3>
              </div>
              <span className={`shrink-0 px-2.5 py-1 rounded-full text-[10px] font-bold border ${STATUS_STYLES[q.status]}`}>
                {q.status}
              </span>
            </div>

            {q.description && (
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">{q.description}</p>
            )}

            <div className="flex items-baseline justify-between pt-2 border-t border-slate-100 dark:border-slate-800">
              <span className="text-[11px] text-slate-500 dark:text-slate-400">Prazo: {q.estimatedTime}</span>
              <span className="text-lg font-black text-blue-600 dark:text-blue-400">{q.priceMzn}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Create Modal */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl p-6 relative">
            <button
              onClick={() => setIsFormOpen(false)}
              className="absolute top-4 right-4 p-2 rounded-xl text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <X className="w-4 h-4" />
            </button>

            <h3 className="text-lg font-extrabold text-slate-900 dark:text-white mb-4">Novo Orçamento</h3>

            <form onSubmit={handleSubmit} className="space-y-3">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Título do Projecto</label>
                <input
                  type="text"
                  required
                  value={form.projectTitle}
                  onChange={(e) => setForm((p) => ({ ...p, projectTitle: e.target.value }))}
                  placeholder="Ex: Website Institucional Escola Horizonte"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 transition-colors"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Valor (MZN)</label>
                  <input
                    type="text"
                    required
                    value={form.priceMzn}
                    onChange={(e) => setForm((p) => ({ ...p, priceMzn: e.target.value }))}
                    placeholder="Ex: 85.000 MZN"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 transition-colors"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Prazo Estimado</label>
                  <input
                    type="text"
                    value={form.estimatedTime}
                    onChange={(e) => setForm((p) => ({ ...p, estimatedTime: e.target.value }))}
                    placeholder="Ex: 4 semanas"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 transition-colors"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Descrição / Âmbito</label>
                <textarea
                  rows={3}
                  value={form.description}
                  onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
                  placeholder="Resumo do que está incluído neste orçamento..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 transition-colors resize-y"
                />
              </div>

              <button
                type="submit"
                className="w-full mt-2 py-3 rounded-xl font-bold text-sm text-white bg-blue-600 hover:bg-blue-500 shadow-md shadow-blue-600/20 transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4" />
                <span>Criar e Enviar ao Cliente</span>
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
