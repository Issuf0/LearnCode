import React from 'react';
import {
  FileText,
  CheckCircle2,
  Lock,
  Download,
  ShieldCheck,
  PenTool,
  Clock,
  ArrowRight,
  ExternalLink
} from 'lucide-react';
import { Contract } from '../../../types';

interface ContractsViewProps {
  contracts: Contract[];
  onOpenSignModal: (contract: Contract) => void;
}

export const ContractsView: React.FC<ContractsViewProps> = ({ contracts, onOpenSignModal }) => {
  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Header */}
      <div className="pb-4 border-b border-slate-200 dark:border-slate-800">
        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2.5">
          <FileText className="w-7 h-7 text-blue-600 dark:text-blue-400" />
          <span>Gestão de Contratos Digitais</span>
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Consulte os seus acordos de prestação de serviços, acordos de confidencialidade (NDA) e assine digitalmente com validade jurídica.
        </p>
      </div>

      {/* Contracts Grid */}
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

                <span
                  className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${
                    ctr.status === 'Assinado'
                      ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400'
                      : 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-400'
                  }`}
                >
                  {ctr.status}
                </span>
              </div>

              <div>
                <h3 className="text-base font-extrabold text-slate-900 dark:text-white leading-snug">
                  {ctr.title}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Projecto: <strong className="text-slate-700 dark:text-slate-300">{ctr.projectName}</strong>
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 grid grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="text-slate-400 block font-medium">Data de Emissão</span>
                  <span className="font-bold text-slate-900 dark:text-white">{ctr.date}</span>
                </div>
                <div>
                  <span className="text-slate-400 block font-medium">Valor Aprovado</span>
                  <span className="font-bold text-blue-600 dark:text-blue-400">{ctr.valueMzn}</span>
                </div>
              </div>

              {/* Signed Certificate Info if signed */}
              {ctr.status === 'Assinado' && ctr.signedAt && (
                <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 text-xs text-emerald-900 dark:text-emerald-200 space-y-1">
                  <div className="flex items-center gap-1.5 font-bold">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    <span>Contrato Selado Digitalmente</span>
                  </div>
                  <p className="text-[11px] text-slate-600 dark:text-slate-300">
                    Assinado por {ctr.signedByName} em {ctr.signedAt}
                  </p>
                  {ctr.digitalCertHash && (
                    <p className="text-[9px] font-mono text-emerald-700 dark:text-emerald-400 truncate">
                      {ctr.digitalCertHash}
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => alert(`A transferir cópia em PDF do contrato ${ctr.contractNumber}...`)}
                className="px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-1.5 cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>PDF</span>
              </button>

              {ctr.status === 'Pendente Assinatura' ? (
                <button
                  type="button"
                  onClick={() => onOpenSignModal(ctr)}
                  className="px-5 py-2.5 rounded-xl font-bold text-xs text-white bg-blue-600 hover:bg-blue-700 shadow-md flex items-center gap-2 cursor-pointer"
                >
                  <PenTool className="w-4 h-4" />
                  <span>Assinar Digitalmente</span>
                </button>
              ) : (
                <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Contrato Ativo</span>
                </span>
              )}
            </div>

          </div>
        ))}
      </div>

    </div>
  );
};
