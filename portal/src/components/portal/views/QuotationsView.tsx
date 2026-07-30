import React from 'react';
import { BadgeDollarSign, Download, CheckCircle2, XCircle, Clock, Code2 } from 'lucide-react';
import { Quotation } from '../../../types';

interface QuotationsViewProps {
  quotations: Quotation[];
  onApproveQuotation: (quotationId: string) => void;
  onRejectQuotation: (quotationId: string) => void;
}

export const QuotationsView: React.FC<QuotationsViewProps> = ({
  quotations,
  onApproveQuotation,
  onRejectQuotation
}) => {
  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Header */}
      <div className="pb-4 border-b border-slate-200 dark:border-slate-800">
        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2.5">
          <BadgeDollarSign className="w-7 h-7 text-blue-600 dark:text-blue-400" />
          <span>Propostas Técnicas & Orçamentos</span>
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Analise a discriminação de custos, cronogramas e requisitos tecnológicos antes de aprovar.
        </p>
      </div>

      {/* Quotations List */}
      <div className="space-y-4">
        {quotations.map((qt) => (
          <div
            key={qt.id}
            className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold text-blue-600 dark:text-blue-400">{qt.code}</span>
                  <span
                    className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                      qt.status === 'Aprovado'
                        ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400'
                        : qt.status === 'Recusado'
                        ? 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-400'
                        : 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-400'
                    }`}
                  >
                    {qt.status}
                  </span>
                </div>
                <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">{qt.projectTitle}</h3>
              </div>

              <div className="text-left sm:text-right">
                <p className="text-2xl font-black text-blue-600 dark:text-blue-400">{qt.priceMzn}</p>
                <p className="text-[11px] text-slate-400 font-mono">Aproximado: {qt.priceUsd}</p>
              </div>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              {qt.description}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 text-xs">
              <div>
                <span className="text-slate-400 block font-medium">Prazo Estimado</span>
                <span className="font-bold text-slate-900 dark:text-white">{qt.estimatedTime}</span>
              </div>
              <div>
                <span className="text-slate-400 block font-medium">Stack Tecnológico</span>
                <div className="flex flex-wrap gap-1 mt-1">
                  {qt.technologies.map((t, idx) => (
                    <span key={idx} className="px-2 py-0.5 rounded bg-slate-200 dark:bg-slate-700 text-[10px] font-mono">
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => alert(`A descarregar proposta ${qt.code} em formato PDF...`)}
                className="px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-1.5 cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Descarregar PDF</span>
              </button>

              {qt.status === 'Pendente' && (
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => onRejectQuotation(qt.id)}
                    className="px-4 py-2 rounded-xl text-xs font-bold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/50 transition-colors cursor-pointer"
                  >
                    Recusar
                  </button>
                  <button
                    type="button"
                    onClick={() => onApproveQuotation(qt.id)}
                    className="px-5 py-2 rounded-xl font-bold text-xs text-white bg-blue-600 hover:bg-blue-700 shadow-md flex items-center gap-1.5 cursor-pointer"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Aprovar Proposta</span>
                  </button>
                </div>
              )}
            </div>

          </div>
        ))}
      </div>

    </div>
  );
};
