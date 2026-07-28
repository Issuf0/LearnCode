import React from 'react';
import {
  Users,
  FolderKanban,
  Wallet,
  Clock,
  FileText,
  BadgeDollarSign,
  ArrowRight,
  AlertCircle,
} from 'lucide-react';
import { AdminClient, AdminTab, Contract, Invoice, Project, Quotation } from '../../../types';
import { formatMzn, MONTHLY_REVENUE } from '../../../data/adminMockData';

interface AdminDashboardViewProps {
  clients: AdminClient[];
  projects: Project[];
  quotations: Quotation[];
  contracts: Contract[];
  invoices: Invoice[];
  setActiveTab: (tab: AdminTab) => void;
}

export const AdminDashboardView: React.FC<AdminDashboardViewProps> = ({
  clients,
  projects,
  quotations,
  contracts,
  invoices,
  setActiveTab,
}) => {
  const activeClients = clients.filter((c) => c.status === 'Activo').length;
  const activeProjects = projects.filter((p) => p.status !== 'Concluído' && p.status !== 'Pausado').length;
  const revenueReceived = invoices.filter((i) => i.status === 'Paga').reduce((acc, i) => acc + i.amountMzn, 0);
  const revenuePending = invoices.filter((i) => i.status !== 'Paga').reduce((acc, i) => acc + i.amountMzn, 0);
  const pendingQuotations = quotations.filter((q) => q.status === 'Pendente').length;
  const pendingContracts = contracts.filter((c) => c.status === 'Pendente Assinatura' || c.status === 'Em Análise').length;

  const maxRevenue = Math.max(...MONTHLY_REVENUE.map((m) => m.valueMzn));

  const kpis = [
    { label: 'Clientes Activos', value: String(activeClients), sub: `${clients.length} registados`, icon: Users, tab: 'clients' as AdminTab },
    { label: 'Projectos em Curso', value: String(activeProjects), sub: `${projects.length} no total`, icon: FolderKanban, tab: 'projects' as AdminTab },
    { label: 'Receita Recebida', value: formatMzn(revenueReceived), sub: 'faturas pagas', icon: Wallet, tab: 'finance' as AdminTab },
    { label: 'Por Receber', value: formatMzn(revenuePending), sub: 'faturas em aberto', icon: Clock, tab: 'finance' as AdminTab },
    { label: 'Orçamentos Pendentes', value: String(pendingQuotations), sub: 'a aguardar o cliente', icon: BadgeDollarSign, tab: 'quotations' as AdminTab },
    { label: 'Contratos por Fechar', value: String(pendingContracts), sub: 'em análise ou por assinar', icon: FileText, tab: 'contracts' as AdminTab },
  ];

  const actionItems: { text: string; tab: AdminTab }[] = [
    ...invoices
      .filter((i) => i.status === 'Aguarda Confirmação')
      .map((i) => ({ text: `Confirmar pagamento da ${i.number} (${i.clientName})`, tab: 'finance' as AdminTab })),
    ...invoices
      .filter((i) => i.status === 'Vencida')
      .map((i) => ({ text: `Factura ${i.number} vencida — contactar ${i.clientName}`, tab: 'finance' as AdminTab })),
    ...contracts
      .filter((c) => c.status === 'Pendente Assinatura')
      .map((c) => ({ text: `Contrato ${c.contractNumber} aguarda assinatura de ${c.clientName}`, tab: 'contracts' as AdminTab })),
    ...quotations
      .filter((q) => q.status === 'Pendente')
      .map((q) => ({ text: `Orçamento ${q.code} aguarda decisão do cliente`, tab: 'quotations' as AdminTab })),
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div>
        <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">Visão Geral do Negócio</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          O estado da Learn Code num só ecrã: clientes, projectos, dinheiro e o que precisa da tua acção.
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
        {kpis.map((kpi) => (
          <button
            key={kpi.label}
            onClick={() => setActiveTab(kpi.tab)}
            className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:border-blue-500 dark:hover:border-blue-500 hover:shadow-md transition-all text-left cursor-pointer group"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="w-9 h-9 rounded-xl bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 flex items-center justify-center group-hover:scale-105 transition-transform">
                <kpi.icon className="w-5 h-5" />
              </div>
            </div>
            <p className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white leading-tight">{kpi.value}</p>
            <p className="text-xs font-semibold text-slate-700 dark:text-slate-300 mt-1">{kpi.label}</p>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">{kpi.sub}</p>
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        {/* Revenue Chart */}
        <div className="lg:col-span-3 p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-baseline justify-between mb-1">
            <h3 className="text-sm font-extrabold text-slate-900 dark:text-white">Receita Recebida por Mês</h3>
            <span className="text-[11px] text-slate-500 dark:text-slate-400">2026 · MZN</span>
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mb-5">Total de faturas pagas em cada mês.</p>

          <div className="relative h-48">
            {/* Recessive gridlines */}
            {[0, 0.5, 1].map((frac) => (
              <div
                key={frac}
                className="absolute left-0 right-0 border-t border-slate-100 dark:border-slate-800"
                style={{ bottom: `${frac * 100}%` }}
              />
            ))}

            {/* Bars */}
            <div className="absolute inset-0 flex items-end justify-between gap-3 sm:gap-5 px-1">
              {MONTHLY_REVENUE.map((point) => {
                const heightPct = Math.max((point.valueMzn / maxRevenue) * 100, 2);
                return (
                  <div key={point.month} className="flex-1 h-full flex flex-col items-center justify-end group relative">
                    {/* Hover value label */}
                    <span className="absolute -top-1 opacity-0 group-hover:opacity-100 transition-opacity text-[10px] font-bold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md px-1.5 py-0.5 shadow-sm whitespace-nowrap z-10">
                      {formatMzn(point.valueMzn)}
                    </span>
                    <div
                      role="img"
                      aria-label={`${point.month}: ${formatMzn(point.valueMzn)}`}
                      className="w-full max-w-10 rounded-t bg-[#1a9cd8] group-hover:bg-[#1587bd] transition-colors"
                      style={{ height: `${heightPct}%` }}
                    />
                  </div>
                );
              })}
            </div>
          </div>

          {/* X axis labels */}
          <div className="flex justify-between gap-3 sm:gap-5 px-1 mt-2">
            {MONTHLY_REVENUE.map((point) => (
              <span key={point.month} className="flex-1 text-center text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                {point.month}
              </span>
            ))}
          </div>
        </div>

        {/* Action Required */}
        <div className="lg:col-span-2 p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <h3 className="text-sm font-extrabold text-slate-900 dark:text-white mb-1 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-amber-500" />
            <span>Requer a Tua Acção</span>
          </h3>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mb-4">
            {actionItems.length} {actionItems.length === 1 ? 'item pendente' : 'itens pendentes'}
          </p>

          {actionItems.length === 0 ? (
            <p className="text-xs text-slate-500 dark:text-slate-400 py-6 text-center">
              Tudo em dia. Nenhuma acção pendente.
            </p>
          ) : (
            <ul className="space-y-2">
              {actionItems.slice(0, 6).map((item, idx) => (
                <li key={idx}>
                  <button
                    onClick={() => setActiveTab(item.tab)}
                    className="w-full flex items-center justify-between gap-2 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 hover:bg-blue-50 dark:hover:bg-slate-800 border border-slate-100 dark:border-slate-800 text-left transition-colors cursor-pointer group"
                  >
                    <span className="text-xs text-slate-700 dark:text-slate-300 font-medium leading-snug">{item.text}</span>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-600 shrink-0" />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};
