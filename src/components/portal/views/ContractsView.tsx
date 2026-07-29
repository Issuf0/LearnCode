import React from 'react';
import { FileText, CheckCircle2, Download, ShieldCheck, PenTool, Clock } from 'lucide-react';
import { Contract } from '../../../types';

interface ContractsViewProps {
  contracts: Contract[];
  onOpenSignModal: (contract: Contract) => void;
  onDownloadPdf: (contract: Contract) => void;
}

const STATUS_STYLES: Record<Contract['status'], string> = {
  'Em Análise': 'bg-sky-100 text-sky-700 dark:bg-sky-950 dark:text-sky-400',
  'Pendente Assinatura': 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-400',
  Assinado: 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-400',
  Concluído: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400',
  Cancelado: 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-400',
};

export const ContractsView: React.FC<ContractsViewProps> = ({ contracts, onOpenSignModal, onDownloadPdf }) => {
  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="pb-4 border-b border-slate-200 dark:border-slate-800">
        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2.5">
          <FileText className="w-7 h-7 text-blue-600 dark:text-blue-400" />
          <span>Os Meus Contratos</span>
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Contratos de prestação de serviços com a Learn Code — leia, assine digitalmente e descarregue o PDF oficial.
        </p>
      </div>

      {contracts.length === 0 && (
        <p className="text-xs text-slate-500 dark:text-slate-400 p-8 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center">
          Ainda não tem contratos. Quando a Learn Code preparar o seu contrato, ele aparecerá aqui.
        </p>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {contracts.map((ctr) => (
          <div
            key={ctr.id}
            className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4 flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-blue-600 dark:text-blue-400 uppercase">
                  {ctr.contractNumber}
                </span>
                <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${STATUS_STYLES[ctr.status]}`}>
                  {ctr.status}
                </span>
              </div>

              <div>
                <h3 className="text-base font-extrabold text-slate-900 dark:text-white leading-snug">{ctr.title}</h3>
                {ctr.serviceDescription && (
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">{ctr.serviceDescription}</p>
                )}
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 grid grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="text-slate-400 block font-medium">Valor Total</span>
                  <span className="font-bold text-blue-600 dark:text-blue-400">{ctr.valueMzn}</span>
                </div>
                <div>
                  <span className="text-slate-400 block font-medium">Sinal</span>
                  <span className="font-bold text-slate-900 dark:text-white">{ctr.depositPercent ?? 50}% para iniciar</span>
                </div>
              </div>

              {ctr.signedAt && (
                <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 text-xs space-y-1">
                  <div className="flex items-center gap-1.5 font-bold text-emerald-900 dark:text-emerald-200">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    <span>Selado Digitalmente</span>
                  </div>
                  <p className="text-[11px] text-slate-600 dark:text-slate-300">
                    Assinado por {ctr.signedByName} em {ctr.signedAt}
                    {ctr.adminSignedByName && ` · Learn Code: ${ctr.adminSignedByName}`}
                  </p>
                  {ctr.digitalCertHash && (
                    <p className="text-[9px] font-mono text-emerald-700 dark:text-emerald-400 truncate">{ctr.digitalCertHash}</p>
                  )}
                </div>
              )}
            </div>

            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => onDownloadPdf(ctr)}
                className="px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-1.5 cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>PDF</span>
              </button>

              {ctr.status === 'Pendente Assinatura' ? (
                <button
                  type="button"
                  onClick={() => onOpenSignModal(ctr)}
                  className="px-5 py-2.5 rounded-xl font-bold text-xs text-white bg-blue-600 hover:bg-blue-500 shadow-md flex items-center gap-2 cursor-pointer"
                >
                  <PenTool className="w-4 h-4" />
                  <span>Preencher & Assinar</span>
                </button>
              ) : ctr.status === 'Assinado' ? (
                <span className="text-xs font-bold text-blue-600 dark:text-blue-400 flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  <span>Aguarda a Learn Code</span>
                </span>
              ) : ctr.status === 'Concluído' ? (
                <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Assinado por ambos</span>
                </span>
              ) : (
                <span className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  <span>Em preparação</span>
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
