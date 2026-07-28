import React from 'react';
import {
  FolderKanban,
  FileText,
  FileSignature,
  BadgeDollarSign,
  Wallet,
  Bell,
  CheckCircle2,
  Clock,
  PlusCircle,
  ArrowRight,
  MessageSquare,
  PhoneCall,
  Flag,
  Upload,
  Receipt,
} from 'lucide-react';
import { ClientProfile, Project, Contract, Quotation, Invoice, PortalNotification, PortalTab } from '../../../types';
import { formatMzn } from '../../../data/adminMockData';
import { COMPANY_INFO } from '../../../data/mockData';

interface DashboardViewProps {
  profile: ClientProfile;
  projects: Project[];
  contracts: Contract[];
  quotations: Quotation[];
  invoices: Invoice[];
  notifications: PortalNotification[];
  setActiveTab: (tab: PortalTab) => void;
  onSelectProject: (projectId: string) => void;
  onOpenNewProjectWizard: () => void;
  onOpenSignContractModal: (contract: Contract) => void;
  onSubmitPaymentProof: (invoiceId: string) => void;
}

const INVOICE_STATUS_STYLES: Record<Invoice['status'], string> = {
  Pendente: 'bg-sky-50 dark:bg-sky-950 text-sky-700 dark:text-sky-400 border-sky-200 dark:border-sky-800',
  'Aguarda Confirmação': 'bg-amber-50 dark:bg-amber-950 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-800',
  Paga: 'bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800',
  Vencida: 'bg-rose-50 dark:bg-rose-950 text-rose-700 dark:text-rose-400 border-rose-200 dark:border-rose-800',
};

export const DashboardView: React.FC<DashboardViewProps> = ({
  profile,
  projects,
  contracts,
  quotations,
  invoices,
  notifications,
  setActiveTab,
  onSelectProject,
  onOpenNewProjectWizard,
  onOpenSignContractModal,
  onSubmitPaymentProof,
}) => {
  const firstName = profile.name.split(' ')[0];

  // ---- Estado real do cliente ----
  const activeProjects = projects.filter((p) => p.status !== 'Concluído' && p.status !== 'Pausado');
  const pendingContract = contracts.find((c) => c.status === 'Pendente Assinatura');
  const pendingQuotation = quotations.find((q) => q.status === 'Pendente');
  const myInvoices = invoices.filter((i) => i.clientName === profile.name);
  const openInvoices = myInvoices.filter((i) => i.status === 'Pendente' || i.status === 'Vencida');
  const awaitingConfirmation = myInvoices.filter((i) => i.status === 'Aguarda Confirmação');
  const totalOwed = openInvoices.reduce((acc, i) => acc + i.amountMzn, 0);
  const unreadNotifications = notifications.filter((n) => !n.read);
  const avgProgress = activeProjects.length > 0
    ? Math.round(activeProjects.reduce((acc, p) => acc + p.progress, 0) / activeProjects.length)
    : 0;

  // ---- Próximo passo dinâmico: a resposta a "o que falta de mim agora?" ----
  const nextStep = pendingContract
    ? {
        icon: FileSignature,
        title: 'Tem um contrato à espera da sua assinatura',
        desc: `${pendingContract.title} (${pendingContract.contractNumber}) — o projecto avança assim que assinar.`,
        cta: 'Assinar Agora',
        action: () => onOpenSignContractModal(pendingContract),
      }
    : pendingQuotation
    ? {
        icon: BadgeDollarSign,
        title: 'Tem um orçamento à espera da sua decisão',
        desc: `${pendingQuotation.projectTitle} — ${pendingQuotation.priceMzn}. Aprove para darmos início.`,
        cta: 'Rever Orçamento',
        action: () => setActiveTab('quotations'),
      }
    : openInvoices.length > 0
    ? {
        icon: Wallet,
        title: `Tem ${openInvoices.length === 1 ? '1 factura em aberto' : `${openInvoices.length} faturas em aberto`}`,
        desc: `Total: ${formatMzn(totalOwed)}. Pague por M-Pesa ou transferência e envie o comprovativo abaixo.`,
        cta: 'Ver Pagamentos',
        action: () => {
          const el = document.getElementById('client-payments');
          el?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        },
      }
    : null;

  return (
    <div className="space-y-6 animate-in fade-in duration-300">

      {/* Welcome + Next Step */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-5">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
              Portal do Cliente
            </p>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight leading-tight text-slate-900 dark:text-white mt-1">
              Olá, {firstName}.
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
              {activeProjects.length > 0
                ? `${activeProjects.length === 1 ? '1 projecto activo' : `${activeProjects.length} projectos activos`} · progresso médio de ${avgProgress}%`
                : 'Sem projectos activos de momento.'}
            </p>
          </div>

          <button
            onClick={onOpenNewProjectWizard}
            className="shrink-0 px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md shadow-blue-600/20 transition-all flex items-center gap-2 cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Solicitar Novo Projecto</span>
          </button>
        </div>

        {/* Next action card */}
        {nextStep ? (
          <div className="p-4 sm:p-5 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center shrink-0">
                <nextStep.icon className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm font-bold text-slate-900 dark:text-white leading-snug">{nextStep.title}</p>
                <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5 leading-relaxed">{nextStep.desc}</p>
              </div>
            </div>
            <button
              onClick={nextStep.action}
              className="shrink-0 px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-amber-500 hover:bg-amber-600 shadow-md transition-all cursor-pointer flex items-center gap-1.5"
            >
              <span>{nextStep.cta}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        ) : (
          <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <p className="text-xs text-slate-700 dark:text-slate-200">
              Está tudo em dia da sua parte — a nossa equipa está a trabalhar. Acompanhe o progresso abaixo.
            </p>
          </div>
        )}
      </div>

      {/* KPI Cards — todos com dados reais */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {[
          {
            label: 'Projectos activos',
            value: activeProjects.length,
            sub: `${projects.length} no total`,
            icon: FolderKanban,
            tab: 'projects' as PortalTab,
            accent: 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950',
          },
          {
            label: 'Contratos por assinar',
            value: contracts.filter((c) => c.status === 'Pendente Assinatura').length,
            sub: `${contracts.length} contratos`,
            icon: FileText,
            tab: 'contracts' as PortalTab,
            accent: 'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950',
          },
          {
            label: 'Orçamentos por aprovar',
            value: quotations.filter((q) => q.status === 'Pendente').length,
            sub: `${quotations.length} orçamentos`,
            icon: BadgeDollarSign,
            tab: 'quotations' as PortalTab,
            accent: 'text-violet-600 dark:text-violet-400 bg-violet-50 dark:bg-violet-950',
          },
          {
            label: 'Notificações novas',
            value: unreadNotifications.length,
            sub: 'por ler',
            icon: Bell,
            tab: 'notifications' as PortalTab,
            accent: 'text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950',
          },
        ].map((card) => (
          <button
            key={card.label}
            onClick={() => setActiveTab(card.tab)}
            className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md hover:border-blue-500 dark:hover:border-blue-500 transition-all cursor-pointer group text-left"
          >
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center mb-3 group-hover:scale-105 transition-transform ${card.accent}`}>
              <card.icon className="w-5 h-5" />
            </div>
            <p className="text-2xl font-black text-slate-900 dark:text-white">{card.value}</p>
            <p className="text-xs font-semibold text-slate-700 dark:text-slate-300 mt-0.5">{card.label}</p>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">{card.sub}</p>
          </button>
        ))}
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Left: Projects + Payments */}
        <div className="lg:col-span-2 space-y-6">

          {/* Active Projects */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
              <h2 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                <FolderKanban className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                <span>Os Meus Projectos</span>
              </h2>
              <button
                onClick={() => setActiveTab('projects')}
                className="text-xs text-blue-600 dark:text-blue-400 font-bold hover:underline flex items-center gap-1 cursor-pointer"
              >
                <span>Ver todos</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-4">
              {activeProjects.length === 0 && (
                <p className="text-xs text-slate-500 dark:text-slate-400 py-4 text-center">
                  Sem projectos activos. Solicite um novo projecto para começar.
                </p>
              )}
              {activeProjects.map((prj) => {
                const nextMilestone = prj.milestones.find((m) => !m.completed);
                return (
                  <div
                    key={prj.id}
                    onClick={() => onSelectProject(prj.id)}
                    className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 hover:border-blue-500/80 transition-all cursor-pointer space-y-3 group"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                            {prj.name}
                          </span>
                          <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-400">
                            {prj.status}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                          Gestor: {prj.projectManager.name} · Prazo: {prj.deadline}
                        </p>
                      </div>
                      <span className="text-base font-black text-blue-600 dark:text-blue-400 shrink-0">
                        {prj.progress}%
                      </span>
                    </div>

                    <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                      <div
                        className="h-full bg-blue-600 rounded-full transition-all duration-500"
                        style={{ width: `${prj.progress}%` }}
                      />
                    </div>

                    {nextMilestone && (
                      <p className="text-[11px] text-slate-600 dark:text-slate-300 flex items-center gap-1.5">
                        <Flag className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                        <span>
                          Próxima etapa: <span className="font-semibold">{nextMilestone.title}</span> · {nextMilestone.dueDate}
                        </span>
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Payments Panel */}
          <div id="client-payments" className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4 scroll-mt-24">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
              <h2 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                <Wallet className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                <span>Os Meus Pagamentos</span>
              </h2>
              {totalOwed > 0 && (
                <span className="text-xs font-bold text-rose-600 dark:text-rose-400">
                  Em aberto: {formatMzn(totalOwed)}
                </span>
              )}
            </div>

            {myInvoices.length === 0 ? (
              <p className="text-xs text-slate-500 dark:text-slate-400 py-4 text-center">
                Sem faturas emitidas de momento.
              </p>
            ) : (
              <div className="space-y-3">
                {myInvoices.map((invoice) => (
                  <div
                    key={invoice.id}
                    className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-9 h-9 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 flex items-center justify-center shrink-0">
                        <Receipt className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-900 dark:text-white">
                          {invoice.number} · {formatMzn(invoice.amountMzn)}
                        </p>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400">
                          {invoice.description} · vence a {invoice.dueDate}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border whitespace-nowrap ${INVOICE_STATUS_STYLES[invoice.status]}`}>
                        {invoice.status}
                      </span>
                      {(invoice.status === 'Pendente' || invoice.status === 'Vencida') && (
                        <button
                          onClick={() => onSubmitPaymentProof(invoice.id)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-bold text-white bg-emerald-600 hover:bg-emerald-500 shadow-sm transition-all cursor-pointer whitespace-nowrap"
                          title="Após pagar por M-Pesa ou transferência, envie o comprovativo"
                        >
                          <Upload className="w-3.5 h-3.5" />
                          <span>Enviar Comprovativo</span>
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {awaitingConfirmation.length > 0 && (
              <p className="text-[11px] text-amber-600 dark:text-amber-400 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 shrink-0" />
                <span>
                  {awaitingConfirmation.length === 1
                    ? 'Um comprovativo está a ser verificado pela nossa equipa.'
                    : `${awaitingConfirmation.length} comprovativos estão a ser verificados pela nossa equipa.`}
                </span>
              </p>
            )}
          </div>
        </div>

        {/* Right: Notifications + Account Manager */}
        <div className="space-y-6">

          {/* Real notifications feed */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-sm font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                <Bell className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                <span>Últimas Actualizações</span>
              </h3>
              <button
                onClick={() => setActiveTab('notifications')}
                className="text-[11px] text-blue-600 dark:text-blue-400 font-bold hover:underline cursor-pointer"
              >
                Ver todas
              </button>
            </div>

            <div className="space-y-1">
              {notifications.slice(0, 5).map((notif) => (
                <button
                  key={notif.id}
                  onClick={() => setActiveTab(notif.targetTab || 'notifications')}
                  className="w-full text-left p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors cursor-pointer group"
                >
                  <div className="flex items-start gap-2.5">
                    <span className={`mt-1.5 w-2 h-2 rounded-full shrink-0 ${notif.read ? 'bg-slate-300 dark:bg-slate-700' : 'bg-blue-600'}`} />
                    <div>
                      <p className={`text-xs leading-snug ${notif.read ? 'font-medium text-slate-600 dark:text-slate-400' : 'font-bold text-slate-900 dark:text-white'}`}>
                        {notif.title}
                      </p>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-snug mt-0.5 line-clamp-2">
                        {notif.message}
                      </p>
                      <p className="text-[10px] text-slate-400 font-mono mt-1">{notif.date}</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Account Manager */}
          <div className="p-5 rounded-3xl bg-slate-100 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 space-y-3">
            <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
              <PhoneCall className="w-4 h-4 text-blue-600" />
              <span>Gestor de Conta Dedicado</span>
            </h3>

            <div className="flex items-center gap-3 pt-1">
              <img
                src={projects[0]?.projectManager.avatar}
                alt={projects[0]?.projectManager.name || 'Gestor de conta'}
                className="w-10 h-10 rounded-xl object-cover ring-2 ring-blue-600/30"
                loading="lazy"
              />
              <div>
                <p className="text-xs font-bold text-slate-900 dark:text-white">
                  {projects[0]?.projectManager.name || 'Equipa Learn Code'}
                </p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  {projects[0]?.projectManager.role || 'Maputo, Moçambique'}
                </p>
              </div>
            </div>

            <a
              href={`https://wa.me/${COMPANY_INFO.whatsappNumber.replace(/[^0-9]/g, '')}?text=${encodeURIComponent('Olá! Sou o João Mabunda (Enterprise MZ) e gostaria de falar sobre o meu projecto.')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <MessageSquare className="w-4 h-4" />
              <span>Falar no WhatsApp</span>
            </a>
          </div>

        </div>
      </div>
    </div>
  );
};
