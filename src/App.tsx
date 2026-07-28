import React, { useState, useEffect, lazy, Suspense } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

// Public Landing Components
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { AboutSection } from './components/AboutSection';
import { ServicesSection } from './components/ServicesSection';
import { ProductsSection } from './components/ProductsSection';
import { CoursesSection } from './components/CoursesSection';
import { PortfolioSection } from './components/PortfolioSection';
import { QuoteSection } from './components/QuoteSection';
import { PortalShowcaseSection } from './components/PortalShowcaseSection';
import { FAQSection } from './components/FAQSection';
import { ContactSection } from './components/ContactSection';
import { Footer } from './components/Footer';
import { WhatsAppWidget } from './components/WhatsAppWidget';
import { NotFoundPage } from './components/NotFoundPage';
import { Toast } from './components/Toast';

// Portal e Admin carregam sob demanda (code-splitting) — o site público fica leve
const PortalHeader = lazy(() => import('./components/portal/PortalHeader').then((m) => ({ default: m.PortalHeader })));
const PortalSidebar = lazy(() => import('./components/portal/PortalSidebar').then((m) => ({ default: m.PortalSidebar })));
const AuthModal = lazy(() => import('./components/portal/AuthModal').then((m) => ({ default: m.AuthModal })));
const DigitalSignatureModal = lazy(() => import('./components/portal/DigitalSignatureModal').then((m) => ({ default: m.DigitalSignatureModal })));
const NewProjectWizardModal = lazy(() => import('./components/portal/NewProjectWizardModal').then((m) => ({ default: m.NewProjectWizardModal })));
const DashboardView = lazy(() => import('./components/portal/views/DashboardView').then((m) => ({ default: m.DashboardView })));
const ProjectsView = lazy(() => import('./components/portal/views/ProjectsView').then((m) => ({ default: m.ProjectsView })));
const ProjectDetailView = lazy(() => import('./components/portal/views/ProjectDetailView').then((m) => ({ default: m.ProjectDetailView })));
const ContractsView = lazy(() => import('./components/portal/views/ContractsView').then((m) => ({ default: m.ContractsView })));
const MeetingsView = lazy(() => import('./components/portal/views/MeetingsView').then((m) => ({ default: m.MeetingsView })));
const QuotationsView = lazy(() => import('./components/portal/views/QuotationsView').then((m) => ({ default: m.QuotationsView })));
const DocumentsView = lazy(() => import('./components/portal/views/DocumentsView').then((m) => ({ default: m.DocumentsView })));
const NotificationsView = lazy(() => import('./components/portal/views/NotificationsView').then((m) => ({ default: m.NotificationsView })));
const ProfileView = lazy(() => import('./components/portal/views/ProfileView').then((m) => ({ default: m.ProfileView })));
const AdminHeader = lazy(() => import('./components/admin/AdminHeader').then((m) => ({ default: m.AdminHeader })));
const AdminSidebar = lazy(() => import('./components/admin/AdminSidebar').then((m) => ({ default: m.AdminSidebar })));
const AdminDashboardView = lazy(() => import('./components/admin/views/AdminDashboardView').then((m) => ({ default: m.AdminDashboardView })));
const AdminClientsView = lazy(() => import('./components/admin/views/AdminClientsView').then((m) => ({ default: m.AdminClientsView })));
const AdminProjectsView = lazy(() => import('./components/admin/views/AdminProjectsView').then((m) => ({ default: m.AdminProjectsView })));
const AdminQuotationsView = lazy(() => import('./components/admin/views/AdminQuotationsView').then((m) => ({ default: m.AdminQuotationsView })));
const AdminContractsView = lazy(() => import('./components/admin/views/AdminContractsView').then((m) => ({ default: m.AdminContractsView })));
const AdminFinanceView = lazy(() => import('./components/admin/views/AdminFinanceView').then((m) => ({ default: m.AdminFinanceView })));
const AdminMeetingsView = lazy(() => import('./components/admin/views/AdminMeetingsView').then((m) => ({ default: m.AdminMeetingsView })));

// Portal Components & Views (Phase 2)


// Admin Panel (Phase 3)

// Initial Mock Data
import {
  INITIAL_CLIENT_PROFILE,
  INITIAL_PROJECTS,
  INITIAL_CONTRACTS,
  INITIAL_QUOTATIONS,
  INITIAL_DOCUMENTS,
  INITIAL_NOTIFICATIONS
} from './data/portalMockData';

import { INITIAL_ADMIN_CLIENTS, INITIAL_INVOICES, INITIAL_MEETINGS } from './data/adminMockData';

import {
  PortalTab,
  AdminTab,
  AdminClient,
  Invoice,
  Meeting,
  ClientProfile,
  Project,
  Contract,
  Quotation,
  ClientDocument,
  PortalNotification
} from './types';

const PORTAL_TABS: PortalTab[] = ['dashboard', 'projects', 'project-detail', 'contracts', 'quotations', 'meetings', 'documents', 'notifications', 'profile'];
const ADMIN_TABS: AdminTab[] = ['dashboard', 'clients', 'projects', 'quotations', 'contracts', 'meetings', 'finance'];
const PUBLIC_PAGES = ['sobre', 'servicos', 'produtos', 'cursos', 'portfolio', 'orcamento', 'contacto'];

const PUBLIC_TITLES: Record<string, string> = {
  '': 'Learn Code — Websites, Sistemas e IA em Moçambique',
  sobre: 'Sobre Nós · Learn Code',
  servicos: 'Serviços · Learn Code',
  produtos: 'Produtos · Learn Code',
  cursos: 'Cursos · Learn Code',
  portfolio: 'Portfólio · Learn Code',
  orcamento: 'Solicitar Orçamento · Learn Code',
  contacto: 'Contacto · Learn Code',
};

const PUBLIC_DESCRIPTIONS: Record<string, string> = {
  '': 'A Learn Code desenvolve websites, aplicações móveis, sistemas de gestão e soluções de IA para empresas em Moçambique. Peça o seu orçamento pelo WhatsApp.',
  sobre: 'Conheça a Learn Code: startup tecnológica moçambicana de software, inteligência artificial e formação, sediada em Marracuene, Maputo.',
  servicos: 'Websites a partir de 3.500 MT, aplicações móveis, sistemas desktop, soluções com IA e design gráfico em Moçambique. Diagnóstico gratuito em 24h.',
  produtos: 'Produtos digitais da Learn Code: Script Code, Utiwi e outras soluções tecnológicas criadas em Moçambique.',
  cursos: 'Cursos práticos de programação em Maputo: HTML/CSS, JavaScript, Python, Java e MySQL, com mentoria e certificado.',
  portfolio: 'Projectos reais da Learn Code: SisPoupa (xitique digital), Quiz Code na Google Play e mais casos de sucesso em Moçambique.',
  orcamento: 'Peça um orçamento gratuito à Learn Code — resposta em menos de 24 horas pelo WhatsApp.',
  contacto: 'Fale com a Learn Code: WhatsApp +258 82 837 6317, email learncode.mz@gmail.com, Marracuene, Maputo.',
};

export default function App() {
  // Navegação por URL: / (site), /portal/<aba>, /admin/<aba>
  const navigate = useNavigate();
  const location = useLocation();
  const [pathRoot, pathTab] = location.pathname.split('/').filter(Boolean);

  const currentView: 'public' | 'portal' | 'admin' =
    pathRoot === 'admin' ? 'admin' : pathRoot === 'portal' ? 'portal' : 'public';

  const activePortalTab: PortalTab = PORTAL_TABS.includes(pathTab as PortalTab)
    ? (pathTab as PortalTab)
    : 'dashboard';
  const activeAdminTab: AdminTab = ADMIN_TABS.includes(pathTab as AdminTab)
    ? (pathTab as AdminTab)
    : 'dashboard';

  const publicPage = PUBLIC_PAGES.includes(pathRoot ?? '') ? (pathRoot as string) : '';
  // URL público desconhecido (ex: /xyz) → página 404
  const isNotFound = currentView === 'public' && pathRoot !== undefined && !PUBLIC_PAGES.includes(pathRoot);

  const setActivePortalTab = (tab: PortalTab) => navigate(`/portal/${tab}`);
  const setActiveAdminTab = (tab: AdminTab) => navigate(`/admin/${tab}`);
  const setCurrentView = (view: 'public' | 'portal' | 'admin') =>
    navigate(view === 'public' ? '/' : `/${view}/dashboard`);

  const [adminMobileSidebarOpen, setAdminMobileSidebarOpen] = useState(false);
  const [isAdminSidebarCollapsed, setIsAdminSidebarCollapsed] = useState(false);
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>('prj-101');
  // A preferência de tema persiste entre sessões
  const [isDarkMode, setIsDarkMode] = useState<boolean>(
    () => localStorage.getItem('lc-theme') === 'dark'
  );

  // Data States
  const [profile, setProfile] = useState<ClientProfile>(INITIAL_CLIENT_PROFILE);
  const [projects, setProjects] = useState<Project[]>(INITIAL_PROJECTS);
  const [contracts, setContracts] = useState<Contract[]>(INITIAL_CONTRACTS);
  const [quotations, setQuotations] = useState<Quotation[]>(INITIAL_QUOTATIONS);
  const [documents, setDocuments] = useState<ClientDocument[]>(INITIAL_DOCUMENTS);
  const [notifications, setNotifications] = useState<PortalNotification[]>(INITIAL_NOTIFICATIONS);
  const [adminClients, setAdminClients] = useState<AdminClient[]>(INITIAL_ADMIN_CLIENTS);
  const [invoices, setInvoices] = useState<Invoice[]>(INITIAL_INVOICES);
  const [meetings, setMeetings] = useState<Meeting[]>(INITIAL_MEETINGS);

  // Modal States
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isNewProjectWizardOpen, setIsNewProjectWizardOpen] = useState(false);
  const [digitalSignatureContract, setDigitalSignatureContract] = useState<Contract | null>(null);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  // Toast State for Public Site
  const [selectedServiceForQuote, setSelectedServiceForQuote] = useState<string>('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Toggle dark mode class on container / root
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('lc-theme', isDarkMode ? 'dark' : 'light');
  }, [isDarkMode]);

  // Título e meta description do separador do browser por página
  useEffect(() => {
    document.title =
      currentView === 'admin'
        ? 'Painel Administrativo · Learn Code'
        : currentView === 'portal'
        ? 'Portal do Cliente · Learn Code'
        : isNotFound
        ? 'Página não encontrada · Learn Code'
        : PUBLIC_TITLES[publicPage];

    if (currentView === 'public' && !isNotFound) {
      document
        .querySelector('meta[name="description"]')
        ?.setAttribute('content', PUBLIC_DESCRIPTIONS[publicPage]);
    }
  }, [currentView, publicPage, isNotFound]);

  // Ao mudar de página, volta ao topo
  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [location.pathname]);

  // Selected Project Object
  const selectedProject = projects.find((p) => p.id === selectedProjectId) || projects[0] || null;

  // Counters
  const pendingContractsCount = contracts.filter((c) => c.status === 'Pendente Assinatura').length;
  const pendingQuotationsCount = quotations.filter((q) => q.status === 'Pendente').length;
  const unreadNotificationsCount = notifications.filter((n) => !n.read).length;

  // Handlers
  const handleSelectProject = (projectId: string) => {
    setSelectedProjectId(projectId);
    setActivePortalTab('project-detail');
  };

  const handleDigitalSignatureSuccess = (
    contractId: string,
    signedByName: string,
    signatureDataUrl: string,
    hash: string
  ) => {
    setContracts((prev) =>
      prev.map((c) =>
        c.id === contractId
          ? {
              ...c,
              status: 'Assinado',
              signedAt: new Date().toLocaleString('pt-PT'),
              signedByName,
              signatureDataUrl,
              digitalCertHash: hash,
            }
          : c
      )
    );

    // Add activity log notification
    const newNotif: PortalNotification = {
      id: `notif-${Date.now()}`,
      title: 'Contrato Assinado com Sucesso',
      message: `O contrato ${contractId} foi assinado digitalmente e selado com o certificado ${hash}.`,
      date: 'Agora mesmo',
      type: 'contract',
      read: false,
      targetTab: 'contracts',
    };
    setNotifications((prev) => [newNotif, ...prev]);
  };

  const handleProjectCreated = (newProject: Project, newQuotation: Quotation) => {
    setProjects((prev) => [newProject, ...prev]);
    setQuotations((prev) => [newQuotation, ...prev]);
    setSelectedProjectId(newProject.id);
    setActivePortalTab('projects');

    const newNotif: PortalNotification = {
      id: `notif-${Date.now()}`,
      title: 'Nova Solução Solicitada',
      message: `A sua solicitação "${newProject.name}" foi registada com sucesso.`,
      date: 'Agora mesmo',
      type: 'project',
      read: false,
      targetTab: 'projects',
    };
    setNotifications((prev) => [newNotif, ...prev]);
  };

  const handleAddProjectComment = (projectId: string, text: string) => {
    setProjects((prev) =>
      prev.map((p) => {
        if (p.id === projectId) {
          const newComment = {
            id: `c-${Date.now()}`,
            authorName: profile.name,
            authorAvatar: profile.avatarUrl,
            isClient: true,
            text,
            timestamp: 'Agora mesmo',
          };
          return {
            ...p,
            comments: [...p.comments, newComment],
          };
        }
        return p;
      })
    );
  };

  const handleToggleTask = (projectId: string, taskId: string) => {
    setProjects((prev) =>
      prev.map((p) => {
        if (p.id === projectId) {
          return {
            ...p,
            tasks: p.tasks.map((t) =>
              t.id === taskId
                ? { ...t, status: t.status === 'completed' ? 'in_progress' : 'completed' }
                : t
            ),
          };
        }
        return p;
      })
    );
  };

  const handleUploadDocument = (newDoc: ClientDocument) => {
    setDocuments((prev) => [newDoc, ...prev]);
  };

  const handleApproveQuotation = (quotationId: string) => {
    setQuotations((prev) =>
      prev.map((q) => (q.id === quotationId ? { ...q, status: 'Aprovado' } : q))
    );
  };

  const handleRejectQuotation = (quotationId: string) => {
    setQuotations((prev) =>
      prev.map((q) => (q.id === quotationId ? { ...q, status: 'Recusado' } : q))
    );
  };

  const handleMarkAllNotificationsAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  // ===================== Admin Handlers =====================
  // Alterações do admin reflectem-se no estado partilhado — o portal do cliente vê tudo.

  const pushClientNotification = (title: string, message: string, type: PortalNotification['type'], targetTab?: PortalTab) => {
    setNotifications((prev) => [
      {
        id: `notif-${Date.now()}`,
        title,
        message,
        date: 'Agora mesmo',
        type,
        read: false,
        targetTab,
      },
      ...prev,
    ]);
  };

  const handleSaveClient = (client: AdminClient) => {
    setAdminClients((prev) => {
      const exists = prev.some((c) => c.id === client.id);
      return exists ? prev.map((c) => (c.id === client.id ? client : c)) : [client, ...prev];
    });
  };

  const handleDeleteClient = (clientId: string) => {
    setAdminClients((prev) => prev.filter((c) => c.id !== clientId));
  };

  const handleUpdateProjectStatus = (projectId: string, status: Project['status']) => {
    setProjects((prev) => prev.map((p) => (p.id === projectId ? { ...p, status } : p)));
  };

  const handleUpdateProjectProgress = (projectId: string, progress: number) => {
    setProjects((prev) => prev.map((p) => (p.id === projectId ? { ...p, progress } : p)));
  };

  const handleAdminCreateQuotation = (quotation: Quotation) => {
    setQuotations((prev) => [quotation, ...prev]);
    pushClientNotification(
      'Novo Orçamento Disponível',
      `O orçamento ${quotation.code} (${quotation.projectTitle}) está disponível para a sua aprovação.`,
      'quotation',
      'quotations'
    );
  };

  const handleAdminSendContract = (contractId: string) => {
    setContracts((prev) =>
      prev.map((c) => (c.id === contractId ? { ...c, status: 'Pendente Assinatura' } : c))
    );
    const contract = contracts.find((c) => c.id === contractId);
    pushClientNotification(
      'Contrato Enviado para Assinatura',
      `O contrato ${contract?.contractNumber || contractId} aguarda a sua assinatura digital no portal.`,
      'contract',
      'contracts'
    );
  };

  const handleAdminCreateInvoice = (invoice: Invoice) => {
    setInvoices((prev) => [invoice, ...prev]);
    pushClientNotification(
      'Nova Factura Emitida',
      `A factura ${invoice.number} no valor de ${invoice.amountMzn.toLocaleString('pt-PT')} MZN foi emitida.`,
      'invoice'
    );
  };

  const handleAdminCreateMeeting = (meeting: Meeting) => {
    setMeetings((prev) => [meeting, ...prev]);
    pushClientNotification(
      'Nova Reunião Agendada',
      `${meeting.title} — ${meeting.date} às ${meeting.time}. O link do Meet está disponível na área de Reuniões.`,
      'meeting',
      'meetings'
    );
  };

  const handleAdminUpdateMeetingStatus = (meetingId: string, status: Meeting['status']) => {
    setMeetings((prev) => prev.map((m) => (m.id === meetingId ? { ...m, status } : m)));
    if (status === 'Cancelada') {
      const meeting = meetings.find((m) => m.id === meetingId);
      pushClientNotification(
        'Reunião Cancelada',
        `A reunião "${meeting?.title || ''}" de ${meeting?.date || ''} foi cancelada. Entraremos em contacto para reagendar.`,
        'meeting',
        'meetings'
      );
    }
  };

  const handleSubmitPaymentProof = (invoiceId: string) => {
    setInvoices((prev) =>
      prev.map((i) => (i.id === invoiceId ? { ...i, status: 'Aguarda Confirmação' } : i))
    );
  };

  const handleAdminConfirmPayment = (invoiceId: string) => {
    setInvoices((prev) => prev.map((i) => (i.id === invoiceId ? { ...i, status: 'Paga' } : i)));
    const invoice = invoices.find((i) => i.id === invoiceId);
    pushClientNotification(
      'Pagamento Confirmado',
      `O pagamento da factura ${invoice?.number || invoiceId} foi confirmado. O recibo já está disponível.`,
      'invoice'
    );
  };

  // Navegação do site público (páginas separadas)
  const handleScrollToQuote = () => navigate('/orcamento');
  const handleScrollToServices = () => navigate('/servicos');

  // Pré-selecciona o serviço e leva o visitante à página de orçamento
  const handleRequestQuote = (title: string) => {
    setSelectedServiceForQuote(title);
    navigate('/orcamento');
  };

  return (
    <div className={`min-h-screen ${isDarkMode ? 'dark bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'} font-sans selection:bg-blue-600 selection:text-white transition-colors duration-200`}>
      
      {/* Toast Notifications */}
      <Toast message={toastMessage} onClose={() => setToastMessage(null)} />

      {/* ======================================================== */}
      {/* VIEW 1: PRIVATE CLIENT PORTAL (PHASE 2)                  */}
      {/* ======================================================== */}
      {currentView === 'portal' ? (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="w-8 h-8 border-2 border-slate-200 border-t-[#1a9cd8] rounded-full animate-spin" /></div>}>
        <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 transition-colors">

          {/* Demo Mode Banner */}
          <div className="bg-amber-50 dark:bg-amber-950/60 border-b border-amber-200 dark:border-amber-800 text-amber-900 dark:text-amber-200 text-[11px] sm:text-xs px-4 py-2 flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-4 text-center">
            <span>
              <span className="font-bold">Ambiente de demonstração</span> — dados fictícios que ilustram como acompanhará o seu projecto real.
            </span>
            <span className="flex items-center gap-3 shrink-0 font-semibold">
              <button
                onClick={() => setCurrentView('admin')}
                className="underline underline-offset-2 hover:opacity-70 cursor-pointer"
              >
                Painel Admin
              </button>
              <span className="text-amber-300 dark:text-amber-700">|</span>
              <button
                onClick={() => setCurrentView('public')}
                className="underline underline-offset-2 hover:opacity-70 cursor-pointer"
              >
                Voltar ao site
              </button>
            </span>
          </div>

          {/* Header Bar */}
          <PortalHeader
            profile={profile}
            notifications={notifications}
            activeTab={activePortalTab}
            setActiveTab={setActivePortalTab}
            isDarkMode={isDarkMode}
            onToggleDarkMode={() => setIsDarkMode(!isDarkMode)}
            onOpenNewProjectWizard={() => setIsNewProjectWizardOpen(true)}
            onSwitchToPublicSite={() => setCurrentView('public')}
            onOpenAuthModal={() => setIsAuthModalOpen(true)}
            onToggleMobileSidebar={() => setMobileSidebarOpen(!mobileSidebarOpen)}
          />

          {/* Main Portal Body */}
          <div className={`flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-20 lg:pb-8 transition-all duration-300 ${
            isSidebarCollapsed ? 'lg:pl-24' : 'lg:pl-68'
          }`}>
            
            {/* Sidebar */}
            <PortalSidebar
              activeTab={activePortalTab}
              setActiveTab={setActivePortalTab}
              pendingContractsCount={pendingContractsCount}
              pendingQuotationsCount={pendingQuotationsCount}
              unreadNotificationsCount={unreadNotificationsCount}
              onOpenNewProjectWizard={() => setIsNewProjectWizardOpen(true)}
              mobileSidebarOpen={mobileSidebarOpen}
              onCloseMobileSidebar={() => setMobileSidebarOpen(false)}
              isCollapsed={isSidebarCollapsed}
              onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
            />

            {/* Active View Content */}
            <main className="w-full min-h-[80vh]">
              {activePortalTab === 'dashboard' && (
                <DashboardView
                  profile={profile}
                  projects={projects}
                  contracts={contracts}
                  quotations={quotations}
                  invoices={invoices}
                  notifications={notifications}
                  setActiveTab={setActivePortalTab}
                  onSelectProject={handleSelectProject}
                  onOpenNewProjectWizard={() => setIsNewProjectWizardOpen(true)}
                  onOpenSignContractModal={(c) => setDigitalSignatureContract(c)}
                  onSubmitPaymentProof={handleSubmitPaymentProof}
                />
              )}

              {activePortalTab === 'projects' && (
                <ProjectsView
                  projects={projects}
                  onSelectProject={handleSelectProject}
                  onOpenNewProjectWizard={() => setIsNewProjectWizardOpen(true)}
                />
              )}

              {activePortalTab === 'project-detail' && (
                <ProjectDetailView
                  project={selectedProject}
                  onBack={() => setActivePortalTab('projects')}
                  onAddComment={handleAddProjectComment}
                  onToggleTask={handleToggleTask}
                />
              )}

              {activePortalTab === 'contracts' && (
                <ContractsView
                  contracts={contracts}
                  onOpenSignModal={(c) => setDigitalSignatureContract(c)}
                />
              )}

              {activePortalTab === 'quotations' && (
                <QuotationsView
                  quotations={quotations}
                  onApproveQuotation={handleApproveQuotation}
                  onRejectQuotation={handleRejectQuotation}
                />
              )}

              {activePortalTab === 'meetings' && (
                <MeetingsView meetings={meetings.filter((m) => m.clientName === profile.name)} />
              )}

              {activePortalTab === 'documents' && (
                <DocumentsView
                  documents={documents}
                  onUploadDocument={handleUploadDocument}
                />
              )}

              {activePortalTab === 'notifications' && (
                <NotificationsView
                  notifications={notifications}
                  onMarkAllAsRead={handleMarkAllNotificationsAsRead}
                  setActiveTab={setActivePortalTab}
                />
              )}

              {activePortalTab === 'profile' && (
                <ProfileView
                  profile={profile}
                  onUpdateProfile={(updated) => setProfile(updated)}
                />
              )}
            </main>

          </div>

          {/* Digital Signature Experience Modal */}
          <DigitalSignatureModal
            contract={digitalSignatureContract}
            isOpen={!!digitalSignatureContract}
            onClose={() => setDigitalSignatureContract(null)}
            onSignSuccess={handleDigitalSignatureSuccess}
          />

          {/* Request New Project 7-Step Wizard Modal */}
          <NewProjectWizardModal
            isOpen={isNewProjectWizardOpen}
            onClose={() => setIsNewProjectWizardOpen(false)}
            onProjectCreated={handleProjectCreated}
          />

          {/* Auth Modal */}
          <AuthModal
            isOpen={isAuthModalOpen}
            onClose={() => setIsAuthModalOpen(false)}
            onLoginSuccess={(newProfile) => {
              setProfile(newProfile);
              setCurrentView('portal');
            }}
            onAdminLoginSuccess={() => setCurrentView('admin')}
            currentProfile={profile}
          />

        </div>
        </Suspense>
      ) : currentView === 'admin' ? (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="w-8 h-8 border-2 border-slate-200 border-t-[#1a9cd8] rounded-full animate-spin" /></div>}>
        {/* VIEW 3: ADMIN PANEL (PHASE 3) */}
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors">
          <AdminHeader
            isDarkMode={isDarkMode}
            onToggleDarkMode={() => setIsDarkMode(!isDarkMode)}
            onSwitchToPublicSite={() => setCurrentView('public')}
            onSwitchToClientPortal={() => setCurrentView('portal')}
            onToggleMobileSidebar={() => setAdminMobileSidebarOpen(!adminMobileSidebarOpen)}
          />

          <AdminSidebar
            activeTab={activeAdminTab}
            setActiveTab={setActiveAdminTab}
            pendingQuotationsCount={quotations.filter((q) => q.status === 'Pendente').length}
            pendingContractsCount={contracts.filter((c) => c.status === 'Pendente Assinatura' || c.status === 'Em Análise').length}
            pendingInvoicesCount={invoices.filter((i) => i.status !== 'Paga').length}
            mobileSidebarOpen={adminMobileSidebarOpen}
            onCloseMobileSidebar={() => setAdminMobileSidebarOpen(false)}
            isCollapsed={isAdminSidebarCollapsed}
            onToggleCollapse={() => setIsAdminSidebarCollapsed(!isAdminSidebarCollapsed)}
          />

          <main className={`transition-all duration-300 ${isAdminSidebarCollapsed ? 'lg:pl-[72px]' : 'lg:pl-60'}`}>
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              {activeAdminTab === 'dashboard' && (
                <AdminDashboardView
                  clients={adminClients}
                  projects={projects}
                  quotations={quotations}
                  contracts={contracts}
                  invoices={invoices}
                  setActiveTab={setActiveAdminTab}
                />
              )}

              {activeAdminTab === 'clients' && (
                <AdminClientsView
                  clients={adminClients}
                  onSaveClient={handleSaveClient}
                  onDeleteClient={handleDeleteClient}
                />
              )}

              {activeAdminTab === 'projects' && (
                <AdminProjectsView
                  projects={projects}
                  onUpdateProjectStatus={handleUpdateProjectStatus}
                  onUpdateProjectProgress={handleUpdateProjectProgress}
                />
              )}

              {activeAdminTab === 'quotations' && (
                <AdminQuotationsView
                  quotations={quotations}
                  onCreateQuotation={handleAdminCreateQuotation}
                />
              )}

              {activeAdminTab === 'contracts' && (
                <AdminContractsView
                  contracts={contracts}
                  onSendContract={handleAdminSendContract}
                />
              )}

              {activeAdminTab === 'meetings' && (
                <AdminMeetingsView
                  meetings={meetings}
                  onCreateMeeting={handleAdminCreateMeeting}
                  onUpdateMeetingStatus={handleAdminUpdateMeetingStatus}
                />
              )}

              {activeAdminTab === 'finance' && (
                <AdminFinanceView
                  invoices={invoices}
                  onCreateInvoice={handleAdminCreateInvoice}
                  onConfirmPayment={handleAdminConfirmPayment}
                />
              )}
            </div>
          </main>
        </div>
        </Suspense>
      ) : (
        /* ======================================================== */
        /* VIEW 2: PUBLIC INSTITUTIONAL SITE (PHASE 1)              */
        /* ======================================================== */
        <div>
          {/* Header / Navbar */}
          <Navbar
            onQuoteClick={handleScrollToQuote}
            onOpenPortal={() => {
              // Em produção este fluxo é o login real; na demo abre o modal com as duas contas
              setCurrentView('portal');
              setIsAuthModalOpen(true);
            }}
          />

          {/* Uma página por rota */}
          <main>
            {isNotFound && (
              <div className="pt-24 sm:pt-28">
                <NotFoundPage />
              </div>
            )}

            {!isNotFound && publicPage === '' && (
              <>
                <Hero
                  onQuoteClick={handleScrollToQuote}
                  onServicesClick={handleScrollToServices}
                />
                <PortalShowcaseSection onOpenPortal={() => setCurrentView('portal')} />
                <FAQSection />
              </>
            )}

            {publicPage === 'sobre' && (
              <div className="pt-24 sm:pt-28">
                <AboutSection />
              </div>
            )}

            {publicPage === 'servicos' && (
              <div className="pt-24 sm:pt-28">
                <ServicesSection onSelectServiceForQuote={handleRequestQuote} />
              </div>
            )}

            {publicPage === 'produtos' && (
              <div className="pt-24 sm:pt-28">
                <ProductsSection onInquireProduct={handleRequestQuote} />
              </div>
            )}

            {publicPage === 'cursos' && (
              <div className="pt-24 sm:pt-28">
                <CoursesSection onEnrollCourse={handleRequestQuote} />
              </div>
            )}

            {publicPage === 'portfolio' && (
              <div className="pt-24 sm:pt-28">
                <PortfolioSection onInquireCase={handleRequestQuote} />
              </div>
            )}

            {publicPage === 'orcamento' && (
              <div className="pt-24 sm:pt-28">
                <QuoteSection
                  preselectedService={selectedServiceForQuote}
                  onSuccessToast={(msg) => setToastMessage(msg)}
                />
                <FAQSection />
              </div>
            )}

            {publicPage === 'contacto' && (
              <div className="pt-24 sm:pt-28">
                <ContactSection onSuccessToast={(msg) => setToastMessage(msg)} />
              </div>
            )}
          </main>

          <Footer />
          <WhatsAppWidget />
        </div>
      )}

    </div>
  );
}
