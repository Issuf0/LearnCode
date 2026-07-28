import React, { useState } from 'react';
import { Plus, X, CheckCircle2, Receipt, Wallet, Clock } from 'lucide-react';
import { Invoice } from '../../../types';
import { formatMzn } from '../../../data/adminMockData';

interface AdminFinanceViewProps {
  invoices: Invoice[];
  onCreateInvoice: (invoice: Invoice) => void;
  onConfirmPayment: (invoiceId: string) => void;
}

const STATUS_STYLES: Record<Invoice['status'], string> = {
  Pendente: 'bg-sky-50 dark:bg-sky-950 text-sky-700 dark:text-sky-400 border-sky-200 dark:border-sky-800',
  'Aguarda Confirmação': 'bg-amber-50 dark:bg-amber-950 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-800',
  Paga: 'bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800',
  Vencida: 'bg-rose-50 dark:bg-rose-950 text-rose-700 dark:text-rose-400 border-rose-200 dark:border-rose-800',
};

const EMPTY_FORM = { clientName: '', projectName: '', description: '', amountMzn: '' };

export const AdminFinanceView: React.FC<AdminFinanceViewProps> = ({
  invoices,
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
    const amount = Number(form.amountMzn.replace(/[^0-9]/g, ''));
    if (!form.clientName || !amount) return;

    onCreateInvoice({
      id: `inv-${Date.now()}`,
      number: `FT 2026/${String(45 + invoices.length)}`,
      clientName: form.clientName,
      projectName: form.projectName || '—',
      description: form.description || 'Serviços de desenvolvimento',
      amountMzn: amount,
      issuedDate: '28 Jul 2026',
      dueDate: '04 Aug 2026',
      status: 'Pendente',
    });
    setForm(EMPTY_FORM);
    setIsFormOpen(false);
  };

  const summary = [
    { label: 'Total Facturado', value: formatMzn(totalIssued), icon: Receipt },
    { label: 'Recebido', value: formatMzn(totalReceived), icon: Wallet },
    { label: 'Em Aberto', value: formatMzn(totalOutstanding), icon: Clock },
  ];

  return (
    <div className="space-y-5 animate-in fade-in duration-300">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">Gestão Financeira</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Faturas, confirmação de pagamentos por comprovativo e recibos.
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

      {/* Summary tiles */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
        {summary.map((item) => (
          <div
            key={item.label}
            className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm"
          >
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

      {/* Invoices table */}
      <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm overflow-x-auto">
        <table className="w-full text-left min-w-[760px]">
          <thead>
            <tr className="border-b border-slate-100 dark:border-slate-800 text-[10px] uppercase tracking-wider text-slate-400">
              <th className="px-5 py-3.5 font-bold">Factura</th>
              <th className="px-5 py-3.5 font-bold">Cliente / Projecto</th>
              <th className="px-5 py-3.5 font-bold">Vencimento</th>
              <th className="px-5 py-3.5 font-bold text-right">Valor</th>
              <th className="px-5 py-3.5 font-bold">Estado</th>
              <th className="px-5 py-3.5 font-bold text-right">Acções</th>
            </tr>
          </thead>
          <tbody>
            {invoices.map((invoice) => (
              <tr
                key={invoice.id}
                className="border-b border-slate-50 dark:border-slate-800/60 last:border-0 hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors"
              >
                <td className="px-5 py-4">
                  <p className="text-sm font-bold text-slate-900 dark:text-white">{invoice.number}</p>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">{invoice.description}</p>
                </td>
                <td className="px-5 py-4">
                  <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">{invoice.clientName}</p>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 max-w-[220px] truncate">{invoice.projectName}</p>
                </td>
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
                  {invoice.status === 'Aguarda Confirmação' || invoice.status === 'Vencida' || invoice.status === 'Pendente' ? (
                    <button
                      onClick={() => onConfirmPayment(invoice.id)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-bold text-white bg-emerald-600 hover:bg-emerald-500 shadow-sm transition-all cursor-pointer whitespace-nowrap"
                      title="Marcar como paga e emitir recibo"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Confirmar Pagamento</span>
                    </button>
                  ) : (
                    <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold inline-flex items-center gap-1">
                      <Receipt className="w-3.5 h-3.5" />
                      Recibo emitido
                    </span>
                  )}
                </td>
              </tr>
            ))}
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
              {[
                { key: 'clientName', label: 'Cliente', placeholder: 'Ex: João Mabunda', required: true },
                { key: 'projectName', label: 'Projecto', placeholder: 'Ex: Portal Corporativo', required: false },
                { key: 'description', label: 'Descrição', placeholder: 'Ex: Sinal de 50%', required: false },
                { key: 'amountMzn', label: 'Valor (MZN)', placeholder: 'Ex: 50000', required: true },
              ].map((field) => (
                <div key={field.key} className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">{field.label}</label>
                  <input
                    type="text"
                    required={field.required}
                    placeholder={field.placeholder}
                    value={form[field.key as keyof typeof form]}
                    onChange={(e) => setForm((prev) => ({ ...prev, [field.key]: e.target.value }))}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 transition-colors"
                  />
                </div>
              ))}

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
