import React, { useState } from 'react';
import { Plus, X, CheckCircle2, Receipt, Wallet, Clock } from 'lucide-react';
import { AdminClient, Invoice } from '../../../types';
import { formatMzn } from '../../../api';

interface AdminFinanceViewProps {
  invoices: Invoice[];
  clients: AdminClient[];
  onCreateInvoice: (payload: {
    clientId: string;
    description?: string;
    amountMzn: number;
    issuedDate: string;
    dueDate: string;
  }) => void;
  onConfirmPayment: (invoiceId: string) => void;
}

const STATUS_STYLES: Record<Invoice['status'], string> = {
  Pendente: 'bg-sky-50 dark:bg-sky-950 text-sky-700 dark:text-sky-400 border-sky-200 dark:border-sky-800',
  'Aguarda Confirmação': 'bg-amber-50 dark:bg-amber-950 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-800',
  Paga: 'bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800',
  Vencida: 'bg-rose-50 dark:bg-rose-950 text-rose-700 dark:text-rose-400 border-rose-200 dark:border-rose-800',
};

const today = () => new Date().toISOString().slice(0, 10);
const inDays = (days: number) => new Date(Date.now() + days * 86_400_000).toISOString().slice(0, 10);

const EMPTY_FORM = { clientId: '', description: '', amountMzn: '', issuedDate: today(), dueDate: inDays(7) };

export const AdminFinanceView: React.FC<AdminFinanceViewProps> = ({
  invoices,
  clients,
  onCreateInvoice,
  onConfirmPayment,
}) => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);

  const totalIssued = invoices.reduce((acc, i) => acc + i.amountMzn, 0);
  const totalReceived = invoices.filter((i) => i.status === 'Paga').reduce((acc, i) => acc + i.amountMzn, 0);
  const totalOutstanding = totalIssued - totalReceived;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const amount = Number(form.amountMzn);
    if (!form.clientId || !amount) return;

    onCreateInvoice({
      clientId: form.clientId,
      description: form.description || undefined,
      amountMzn: amount,
      issuedDate: form.issuedDate,
      dueDate: form.dueDate,
    });
    setForm({ ...EMPTY_FORM, issuedDate: today(), dueDate: inDays(7) });
    setIsFormOpen(false);
  };

  const summary = [
    { label: 'Total Facturado', value: formatMzn(totalIssued), icon: Receipt },
    { label: 'Recebido', value: formatMzn(totalReceived), icon: Wallet },
    { label: 'Em Aberto', value: formatMzn(totalOutstanding), icon: Clock },
  ];

  const inputClass =
    'w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 transition-colors';

  return (
    <div className="space-y-5 animate-in fade-in duration-300">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">Gestão Financeira</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Faturas e confirmação de pagamentos por comprovativo (M-Pesa / transferência).
          </p>
        </div>
        <button
          onClick={() => setIsFormOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-500 shadow-md shadow-blue-600/20 transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Nova Factura</span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
        {summary.map((item) => (
          <div key={item.label} className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
                <item.icon className="w-5 h-5" />
              </div>
              <div>
                <p className="text-lg font-black text-slate-900 dark:text-white leading-tight">{item.value}</p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">{item.label}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm overflow-x-auto">
        <table className="w-full text-left min-w-[760px]">
          <thead>
            <tr className="border-b border-slate-100 dark:border-slate-800 text-[10px] uppercase tracking-wider text-slate-400">
              <th className="px-5 py-3.5 font-bold">Factura</th>
              <th className="px-5 py-3.5 font-bold">Cliente</th>
              <th className="px-5 py-3.5 font-bold">Vencimento</th>
              <th className="px-5 py-3.5 font-bold text-right">Valor</th>
              <th className="px-5 py-3.5 font-bold">Estado</th>
              <th className="px-5 py-3.5 font-bold text-right">Acções</th>
            </tr>
          </thead>
          <tbody>
            {invoices.map((invoice) => (
              <tr key={invoice.id} className="border-b border-slate-50 dark:border-slate-800/60 last:border-0 hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors">
                <td className="px-5 py-4">
                  <p className="text-sm font-bold text-slate-900 dark:text-white">{invoice.number}</p>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">{invoice.description}</p>
                </td>
                <td className="px-5 py-4 text-xs font-semibold text-slate-700 dark:text-slate-300">{invoice.clientName}</td>
                <td className="px-5 py-4 text-xs text-slate-600 dark:text-slate-400">{invoice.dueDate}</td>
                <td className="px-5 py-4 text-right text-sm font-black text-slate-900 dark:text-white">
                  {formatMzn(invoice.amountMzn)}
                </td>
                <td className="px-5 py-4">
                  <span className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-bold border whitespace-nowrap ${STATUS_STYLES[invoice.status]}`}>
                    {invoice.status}
                  </span>
                </td>
                <td className="px-5 py-4 text-right">
                  {invoice.status !== 'Paga' ? (
                    <button
                      onClick={() => onConfirmPayment(invoice.id)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-bold text-white bg-emerald-600 hover:bg-emerald-500 shadow-sm transition-all cursor-pointer whitespace-nowrap"
                      title="Marcar como paga"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Confirmar Pagamento</span>
                    </button>
                  ) : (
                    <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold inline-flex items-center gap-1">
                      <Receipt className="w-3.5 h-3.5" />
                      Paga
                    </span>
                  )}
                </td>
              </tr>
            ))}
            {invoices.length === 0 && (
              <tr>
                <td colSpan={6} className="px-5 py-10 text-center text-xs text-slate-500 dark:text-slate-400">
                  Ainda sem faturas emitidas.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Create Invoice Modal */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl p-6 relative">
            <button
              onClick={() => setIsFormOpen(false)}
              className="absolute top-4 right-4 p-2 rounded-xl text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <X className="w-4 h-4" />
            </button>

            <h3 className="text-lg font-extrabold text-slate-900 dark:text-white mb-4">Nova Factura</h3>

            <form onSubmit={handleSubmit} className="space-y-3">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Cliente</label>
                <select required value={form.clientId} onChange={(e) => setForm((p) => ({ ...p, clientId: e.target.value }))} className={inputClass}>
                  <option value="">Seleccionar cliente...</option>
                  {clients.map((c) => (
                    <option key={c.id} value={c.id}>{c.name} — {c.company}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Descrição</label>
                <input placeholder="Ex: Sinal de 40% — Website Institucional" value={form.description} onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))} className={inputClass} />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Valor (MZN)</label>
                <input required type="number" min={1} placeholder="Ex: 6000" value={form.amountMzn} onChange={(e) => setForm((p) => ({ ...p, amountMzn: e.target.value }))} className={inputClass} />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Data de emissão</label>
                  <input type="date" required value={form.issuedDate} onChange={(e) => setForm((p) => ({ ...p, issuedDate: e.target.value }))} className={inputClass} />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Vencimento</label>
                  <input type="date" required value={form.dueDate} onChange={(e) => setForm((p) => ({ ...p, dueDate: e.target.value }))} className={inputClass} />
                </div>
              </div>

              <button
                type="submit"
                className="w-full mt-2 py-3 rounded-xl font-bold text-sm text-white bg-blue-600 hover:bg-blue-500 shadow-md shadow-blue-600/20 transition-all cursor-pointer"
              >
                Emitir Factura
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
