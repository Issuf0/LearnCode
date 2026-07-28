import React from 'react';
import { Send, CheckCircle2, FileText } from 'lucide-react';
import { Contract } from '../../../types';

interface AdminContractsViewProps {
  contracts: Contract[];
  onSendContract: (contractId: string) => void;
}

const STATUS_STYLES: Record<Contract['status'], string> = {
  'Em Análise': 'bg-sky-50 dark:bg-sky-950 text-sky-700 dark:text-sky-400 border-sky-200 dark:border-sky-800',
  'Pendente Assinatura': 'bg-amber-50 dark:bg-amber-950 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-800',
  Assinado: 'bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800',
  Cancelado: 'bg-rose-50 dark:bg-rose-950 text-rose-700 dark:text-rose-400 border-rose-200 dark:border-rose-800',
};

export const AdminContractsView: React.FC<AdminContractsViewProps> = ({ contracts, onSendContract }) => {
  return (
    <div className="space-y-5 animate-in fade-in duration-300">
      <div>
        <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">Gestão de Contratos</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Envia contratos para assinatura digital — o cliente assina directamente no portal.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {contracts.map((contract) => (
          <div
            key={contract.id}
            className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-[10px] font-mono font-bold text-slate-400 uppercase">
                    {contract.contractNumber} · {contract.date}
                  </p>
                  <h3 className="text-sm font-extrabold text-slate-900 dark:text-white leading-snug mt-0.5">
                    {contract.title}
                  </h3>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                    {contract.clientName} · {contract.projectName}
                  </p>
                </div>
              </div>
              <span className={`shrink-0 px-2.5 py-1 rounded-full text-[10px] font-bold border ${STATUS_STYLES[contract.status]}`}>
                {contract.status}
              </span>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800">
              <span className="text-sm font-black text-slate-900 dark:text-white">{contract.valueMzn}</span>

              {contract.status === 'Em Análise' && (
                <button
                  onClick={() => onSendContract(contract.id)}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-[11px] font-bold text-white bg-blue-600 hover:bg-blue-500 shadow-sm transition-all cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Enviar para Assinatura</span>
                </button>
              )}

              {contract.status === 'Assinado' && (
                <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>
                    Assinado por {contract.signedByName || contract.clientName}
                    {contract.signedAt ? ` · ${contract.signedAt}` : ''}
                  </span>
                </span>
              )}

              {contract.status === 'Pendente Assinatura' && (
                <span className="text-[11px] text-slate-500 dark:text-slate-400">A aguardar o cliente</span>
              )}
            </div>

            {contract.digitalCertHash && (
              <p className="text-[10px] font-mono text-slate-400 truncate">Certificado: {contract.digitalCertHash}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
