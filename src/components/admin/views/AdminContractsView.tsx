import React, { useState } from 'react';
import { Send, CheckCircle2, FileText, Plus, X, Download, PenTool, Clock } from 'lucide-react';
import { AdminClient, Contract } from '../../../types';

interface AdminContractsViewProps {
  contracts: Contract[];
  clients: AdminClient[];
  onCreateContract: (payload: {
    clientId: string;
    title: string;
    serviceDescription?: string;
    specifications?: string;
    startDate?: string;
    deliveryDate?: string;
    valueMzn: number;
    depositPercent: number;
    paymentMethod?: string;
  }) => void;
  onSendContract: (contractId: string) => void;
  onCountersign: (contract: Contract) => void;
  onDownloadPdf: (contract: Contract) => void;
}

const STATUS_STYLES: Record<Contract['status'], string> = {
  'Em Análise': 'bg-sky-50 dark:bg-sky-950 text-sky-700 dark:text-sky-400 border-sky-200 dark:border-sky-800',
  'Pendente Assinatura': 'bg-amber-50 dark:bg-amber-950 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-800',
  Assinado: 'bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-800',
  Concluído: 'bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800',
  Cancelado: 'bg-rose-50 dark:bg-rose-950 text-rose-700 dark:text-rose-400 border-rose-200 dark:border-rose-800',
};

const EMPTY_FORM = {
  clientId: '',
  title: '',
  serviceDescription: '',
  specifications: '',
  startDate: '',
  deliveryDate: '',
  valueMzn: '',
  depositPercent: '50',
  paymentMethod: 'M-Pesa / Transferência bancária',
};

export const AdminContractsView: React.FC<AdminContractsViewProps> = ({
  contracts,
  clients,
  onCreateContract,
  onSendContract,
  onCountersign,
  onDownloadPdf,
}) => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const amount = Number(form.valueMzn.replace(/[^0-9.]/g, ''));
    if (!form.clientId || !form.title || !amount) return;

    onCreateContract({
      clientId: form.clientId,
      title: form.title,
      serviceDescription: form.serviceDescription || undefined,
      specifications: form.specifications || undefined,
      startDate: form.startDate || undefined,
      deliveryDate: form.deliveryDate || undefined,
      valueMzn: amount,
      depositPercent: Number(form.depositPercent),
      paymentMethod: form.paymentMethod || undefined,
    });
    setForm(EMPTY_FORM);
    setIsFormOpen(false);
  };

  const inputClass =
    'w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 transition-colors';

  return (
    <div className="space-y-5 animate-in fade-in duration-300">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">Gestão de Contratos</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Fluxo oficial: criar → enviar → cliente preenche e assina → tu contra-assinas → PDF final.
          </p>
        </div>
        <button
          onClick={() => setIsFormOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-500 shadow-md shadow-blue-600/20 transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Novo Contrato</span>
        </button>
      </div>

      {contracts.length === 0 && (
        <p className="text-xs text-slate-500 dark:text-slate-400 p-8 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center">
          Ainda sem contratos. Cria o primeiro a partir do template oficial.
        </p>
      )}

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
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">{contract.clientName}</p>
                </div>
              </div>
              <span className={`shrink-0 px-2.5 py-1 rounded-full text-[10px] font-bold border ${STATUS_STYLES[contract.status]}`}>
                {contract.status}
              </span>
            </div>

            {contract.signedAt && (
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Cliente: {contract.signedByName} ({contract.signedAt})
                {contract.adminSignedByName && ` · Learn Code: ${contract.adminSignedByName} (${contract.adminSignedAt})`}
              </p>
            )}

            <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
              <span className="text-sm font-black text-slate-900 dark:text-white">{contract.valueMzn}</span>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={() => onDownloadPdf(contract)}
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-[11px] font-bold text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>PDF</span>
                </button>

                {contract.status === 'Em Análise' && (
                  <button
                    onClick={() => onSendContract(contract.id)}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-[11px] font-bold text-white bg-blue-600 hover:bg-blue-500 shadow-sm transition-all cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Enviar para Assinatura</span>
                  </button>
                )}

                {(contract.status === 'Assinado' || contract.status === 'Pendente Assinatura') && !contract.adminSignedByName && (
                  <button
                    onClick={() => onCountersign(contract)}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-[11px] font-bold text-white bg-emerald-600 hover:bg-emerald-500 shadow-sm transition-all cursor-pointer"
                  >
                    <PenTool className="w-3.5 h-3.5" />
                    <span>Contra-assinar</span>
                  </button>
                )}

                {contract.status === 'Pendente Assinatura' && (
                  <span className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    A aguardar o cliente
                  </span>
                )}

                {contract.status === 'Concluído' && (
                  <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Concluído</span>
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Create Contract Modal — campos do template oficial */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="w-full max-w-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl p-6 relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setIsFormOpen(false)}
              className="absolute top-4 right-4 p-2 rounded-xl text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <X className="w-4 h-4" />
            </button>

            <h3 className="text-lg font-extrabold text-slate-900 dark:text-white mb-1">Novo Contrato</h3>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mb-4">
              Baseado no template oficial. O cliente preenche a identificação dele ao assinar.
            </p>

            <form onSubmit={handleSubmit} className="space-y-3">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Cliente (Contratante)</label>
                <select required value={form.clientId} onChange={(e) => setForm((p) => ({ ...p, clientId: e.target.value }))} className={inputClass}>
                  <option value="">Seleccionar cliente...</option>
                  {clients.map((c) => (
                    <option key={c.id} value={c.id}>{c.name} — {c.company}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Título do Contrato</label>
                <input required placeholder="Ex: Desenvolvimento de Website Institucional" value={form.title} onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))} className={inputClass} />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Descrição do serviço (Cláusula 1)</label>
                <input placeholder="Ex: website institucional de 6 páginas" value={form.serviceDescription} onChange={(e) => setForm((p) => ({ ...p, serviceDescription: e.target.value }))} className={inputClass} />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Especificações e funcionalidades</label>
                <textarea rows={3} placeholder="Detalhar o escopo acordado — páginas, funcionalidades, integrações..." value={form.specifications} onChange={(e) => setForm((p) => ({ ...p, specifications: e.target.value }))} className={`${inputClass} resize-y`} />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Data de início</label>
                  <input type="date" value={form.startDate} onChange={(e) => setForm((p) => ({ ...p, startDate: e.target.value }))} className={inputClass} />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Data de entrega</label>
                  <input type="date" value={form.deliveryDate} onChange={(e) => setForm((p) => ({ ...p, deliveryDate: e.target.value }))} className={inputClass} />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Valor total (MZN)</label>
                  <input required type="number" min={1} placeholder="Ex: 15000" value={form.valueMzn} onChange={(e) => setForm((p) => ({ ...p, valueMzn: e.target.value }))} className={inputClass} />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Sinal (%)</label>
                  <select value={form.depositPercent} onChange={(e) => setForm((p) => ({ ...p, depositPercent: e.target.value }))} className={inputClass}>
                    {[30, 35, 40, 45, 50].map((pct) => (
                      <option key={pct} value={pct}>{pct}%</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Método de pagamento</label>
                <input value={form.paymentMethod} onChange={(e) => setForm((p) => ({ ...p, paymentMethod: e.target.value }))} className={inputClass} />
              </div>

              <button
                type="submit"
                className="w-full mt-2 py-3 rounded-xl font-bold text-sm text-white bg-blue-600 hover:bg-blue-500 shadow-md shadow-blue-600/20 transition-all cursor-pointer"
              >
                Criar Contrato
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
