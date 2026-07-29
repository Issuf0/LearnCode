import React, { useState, useEffect, useCallback, lazy, Suspense } from 'react';
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
import { AuthModal } from './components/portal/AuthModal';

import { api, ApiUser, AdminSummary, avatarFor } from './api';
import { clearToken, getToken } from './api/client';
import { COMPANY_INFO } from './data/mockData';

// Portal e Admin carregam sob demanda (code-splitting) — o site público fica leve
const PortalHeader = lazy(() => import('./components/portal/PortalHeader').then((m) => ({ default: m.PortalHeader })));
const PortalSidebar = lazy(() => import('./components/portal/PortalSidebar').then((m) => ({ default: m.PortalSidebar })));
const DigitalSignatureModal = lazy(() => import('./components/portal/DigitalSignatureModal').then((m) => ({ default: m.DigitalSignatureModal })));
const DashboardView = lazy(() => import('./components/portal/views/DashboardView').then((m) => ({ default: m.DashboardView })));
const ProjectsView = lazy(() => import('./components/portal/views/ProjectsView').then((m) => ({ default: m.ProjectsView })));
const ProjectDetailView = lazy(() => import('./components/portal/views/ProjectDetailView').then((m) => ({ default: m.ProjectDetailView })));
const ContractsView = lazy(() => import('./components/portal/views/ContractsView').then((m) => ({ default: m.ContractsView })));
const MeetingsView = lazy(() => import('./components/portal/views/MeetingsView').then((m) => ({ default: m.MeetingsView })));
const QuotationsView = lazy(() => import('./components/portal/views/QuotationsView').then((m) => ({ default: m.QuotationsView })));
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
  MonthlyRevenuePoint,
  PortalNotification,
  ThemeMode,
} from './types';

const PORTAL_TABS: PortalTab[] = ['dashboard', 'projects', 'project-detail', 'contracts', 'quotations', 'meetings', 'notifications', 'profile'];
const ADMIN_TABS: AdminTab[] = ['dashboard', 'clients', 'projects', 'quotations', 'contracts', 'meetings', 'finance'];
const PUBLIC_PAGES = ['sobre', 'servicos', 'produtos', 'cursos', 'portfolio', 'orcamento', 'contacto'];

const PT_MONTHS_SHORT = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];

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
  servicos: 'Websites a partir de 15.000 MT, aplicações móveis, sistemas desktop, soluções com IA e design gráfico em Moçambique. Diagnóstico gratuito em 24h.',
  produtos: 'Produtos digitais da Learn Code: EcoMaputo, RoadMZ e outras soluções tecnológicas criadas em Moçambique.',
  cursos: 'Cursos práticos de programação em Maputo: HTML/CSS, JavaScript, Python, Java e MySQL, com mentoria e certificado.',
  portfolio: 'Projectos reais da Learn Code: SisPoupa (xitique digital), Quiz Code na Google Play e mais casos de sucesso em Moçambique.',
  orcamento: 'Peça um orçamento gratuito à Learn Code — resposta em menos de 24 horas pelo WhatsApp.',
  contacto: 'Fale com a Learn Code: WhatsApp +258 82 837 6317, email learncode.mz@gmail.com, Marracuene, Maputo.',
};

const whatsappUrl = (text: string) =>
  `https://wa.me/${COMPANY_INFO.whatsappNumber.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(text)}`;

const LoadingScreen = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="w-8 h-8 border-2 border-slate-200 border-t-[#1a9cd8] rounded-full animate-spin" />
  </div>
);

export default function App() {
  // Navegação por URL: / (site), /portal/<aba>, /admin/<aba>
  const navigate = useNavigate();
  const location = useLocation();
  const [pathRoot, pathTab] = location.pathname.split('/').filter(Boolean);

  const currentView: 'public' | 'portal' | 'admin' =
    pathRoot === 'admin' ? 'admin' : pathRoot === 'portal' ? 'portal' : 'public';

  const activePortalTab: PortalTab = PORTAL_TABS.includes(pathTab as PortalTab) ? (pathTab as PortalTab) : 'dashboard';
  const activeAdminTab: AdminTab = ADMIN_TABS.includes(pathTab as AdminTab) ? (pathTab as AdminTab) : 'dashboard';

  const publicPage = PUBLIC_PAGES.includes(pathRoot ?? '') ? (pathRoot as string) : '';
  const isNotFound = currentView === 'public' && pathRoot !== undefined && !PUBLIC_PAGES.includes(pathRoot);

  const setActivePortalTab = (tab: PortalTab) => navigate(`/portal/${tab}`);
  const setActiveAdminTab = (tab: AdminTab) => navigate(`/admin/${tab}`);

  // ===================== Autenticação =====================
  const [authUser, setAuthUser] = useState<ApiUser | null>(null);
  const [authChecked, setAuthChecked] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  useEffect(() => {
    if (!getToken()) {
      setAuthChecked(true);
      return;
    }
    api
      .me()
      .then(setAuthUser)
      .catch(() => clearToken())
      .finally(() => setAuthChecked(true));
  }, []);

  const handleLoginSuccess = (user: ApiUser) => {
    setAuthUser(user);
    navigate(user.role === 'admin' ? '/admin/dashboard' : '/portal/dashboard');
  };

  const handleLogout = useCallback(() => {
    clearToken();
    setAuthUser(null);
    navigate('/');
  }, [navigate]);

  // Guardas de rota: área privada exige sessão com o papel certo
  useEffect(() => {
    if (!authChecked || currentView === 'public') return;
    if (!authUser) {
      navigate('/');
      setIsAuthModalOpen(true);
      return;
    }
    if (currentView === 'admin' && authUser.role !== 'admin') navigate('/portal/dashboard');
    if (currentView === 'portal' && authUser.role !== 'client') navigate('/admin/dashboard');
  }, [authChecked, authUser, currentView, navigate]);

  // ===================== Estado de dados (API) =====================
  const [clientsRaw, setClientsRaw] = useState<ApiUser[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [quotations, setQuotations] = useState<Quotation[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [notifications, setNotifications] = useState<PortalNotification[]>([]);
  const [adminSummary, setAdminSummary] = useState<AdminSummary | null>(null);

  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [themeMode, setThemeMode] = useState<ThemeMode>(() => {
    const stored = localStorage.getItem('lc-theme');
    return stored === 'dark' || stored === 'light' || stored === 'auto' ? stored : 'auto';
  });
  const [systemPrefersDark, setSystemPrefersDark] = useState<boolean>(
    () => window.matchMedia('(prefers-color-scheme: dark)').matches
  );
  const isDarkMode = themeMode === 'dark' || (themeMode === 'auto' && systemPrefersDark);

  // Modal / UI state
  const [signatureContract, setSignatureContract] = useState<Contract | null>(null);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [adminMobileSidebarOpen, setAdminMobileSidebarOpen] = useState(false);
  const [isAdminSidebarCollapsed, setIsAdminSidebarCollapsed] = useState(false);
  const [selectedServiceForQuote, setSelectedServiceForQuote] = useState<string>('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const isAdmin = authUser?.role === 'admin';

  const namesById = useCallback((): Record<number, string> => {
    if (isAdmin) {
      return Object.fromEntries(clientsRaw.map((c) => [c.id, c.name]));
    }
    return authUser ? { [authUser.id]: authUser.name } : {};
  }, [isAdmin, clientsRaw, authUser]);

  const projectNamesById = useCallback(
    (): Record<number, string> => Object.fromEntries(projects.map((p) => [Number(p.id), p.name])),
    [projects]
  );

  const showError = (err: unknown) =>
    setToastMessage(err instanceof Error ? err.message : 'Ocorreu um erro inesperado.');

  // ---------- Carregadores ----------
  const loadContracts = useCallback(async () => setContracts(await api.listContracts(namesById())), [namesById]);
  const loadProjects = useCallback(async () => setProjects(await api.listProjects()), []);
  const loadQuotations = useCallback(async () => setQuotations(await api.listQuotations()), []);
  const loadInvoices = useCallback(
    async () => setInvoices(await api.listInvoices(namesById(), projectNamesById())),
    [namesById, projectNamesById]
  );
  const loadMeetings = useCallback(
    async () => setMeetings(await api.listMeetings(namesById(), projectNamesById())),
    [namesById, projectNamesById]
  );
  const loadNotifications = useCallback(async () => setNotifications(await api.listNotifications()), []);

  // Carrega tudo ao entrar numa área privada
  useEffect(() => {
    if (!authUser || currentView === 'public') return;
    (async () => {
      try {
        let names: Record<number, string> = { [authUser.id]: authUser.name };
        if (authUser.role === 'admin') {
          const { raw } = await api.listClients();
          setClientsRaw(raw);
          names = Object.fromEntries(raw.map((c) => [c.id, c.name]));
          setAdminSummary(await api.adminSummary());
        }
        const projectList = await api.listProjects();
        setProjects(projectList);
        const projectNames = Object.fromEntries(projectList.map((p) => [Number(p.id), p.name]));

        const [contractList, quotationList, invoiceList, meetingList, notificationList] = await Promise.all([
          api.listContracts(names),
          api.listQuotations(),
          api.listInvoices(names, projectNames),
          api.listMeetings(names, projectNames),
          api.listNotifications(),
        ]);
        setContracts(contractList);
        setQuotations(quotationList);
        setInvoices(invoiceList);
        setMeetings(meetingList);
        setNotifications(notificationList);
      } catch (err) {
        showError(err);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authUser, currentView]);

  // ===================== Efeitos de interface =====================
  // Modo automático: acompanha a preferência do sistema operativo em tempo real
  useEffect(() => {
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const onChange = (e: MediaQueryListEvent) => setSystemPrefersDark(e.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDarkMode);
    localStorage.setItem('lc-theme', themeMode);
  }, [themeMode, isDarkMode]);

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
      document.querySelector('meta[name="description"]')?.setAttribute('content', PUBLIC_DESCRIPTIONS[publicPage]);
    }
  }, [currentView, publicPage, isNotFound]);

  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [location.pathname]);

  // ===================== Perfil do utilizador =====================
  const profile: ClientProfile = {
    id: String(authUser?.id ?? ''),
    name: authUser?.name ?? '',
    company: authUser?.company ?? '',
    email: authUser?.email ?? '',
    phone: authUser?.phone ?? '',
    address: '',
    country: 'Moçambique',
    avatarUrl: authUser?.avatar_url ?? avatarFor(authUser?.name ?? 'Cliente'),
    joinedDate: '',
    is2FAEnabled: false,
    preferences: { emailNotifications: true, whatsappNotifications: true, weeklyDigest: false },
  };

  // ===================== Contadores =====================
  const pendingContractsCount = contracts.filter((c) => c.status === 'Pendente Assinatura').length;
  const pendingQuotationsCount = quotations.filter((q) => q.status === 'Pendente').length;
  const unreadNotificationsCount = notifications.filter((n) => !n.read).length;

  const selectedProject = projects.find((p) => p.id === selectedProjectId) || projects[0] || null;

  // Agregados por cliente para o painel admin
  const adminClients: AdminClient[] = clientsRaw.map((c) => ({
    id: String(c.id),
    name: c.name,
    company: c.company ?? 'Particular',
    email: c.email,
    phone: c.phone ?? '—',
    avatarUrl: c.avatar_url ?? avatarFor(c.name),
    status: c.is_active ? 'Activo' : 'Inactivo',
    joinedDate: c.created_at
      ? new Date(c.created_at).toLocaleDateString('pt-PT', { month: 'short', year: 'numeric' })
      : '—',
    totalBilledMzn: invoices
      .filter((i) => i.clientName === c.name && i.status === 'Paga')
      .reduce((acc, i) => acc + i.amountMzn, 0),
    activeProjects: projects.filter(
      (p) => p.clientId === String(c.id) && p.status !== 'Concluído' && p.status !== 'Pausado'
    ).length,
  }));

  const monthlyRevenue: MonthlyRevenuePoint[] = (adminSummary?.monthly_revenue ?? []).map((m) => ({
    month: PT_MONTHS_SHORT[m.month - 1],
    valueMzn: Number(m.total_mzn),
  }));

  // ===================== Handlers (todos via API) =====================
  const run = async (action: () => Promise<void>, successMsg?: string) => {
    try {
      await action();
      if (successMsg) setToastMessage(successMsg);
    } catch (err) {
      showError(err);
    }
  };

  const handleSelectProject = (projectId: string) => {
    setSelectedProjectId(projectId);
    navigate('/portal/project-detail');
    // Carrega o detalhe (inclui comentários)
    api
      .getProject(Number(projectId))
      .then((detail) => setProjects((prev) => prev.map((p) => (p.id === detail.id ? detail : p))))
      .catch(showError);
  };

  const handleAddProjectComment = (projectId: string, text: string) =>
    run(async () => {
      const comment = await api.addComment(Number(projectId), text);
      setProjects((prev) =>
        prev.map((p) => (p.id === projectId ? { ...p, comments: [...p.comments, comment] } : p))
      );
    });

  const handleToggleTask = (projectId: string, taskId: string) =>
    run(async () => {
      await api.toggleTask(Number(projectId), Number(taskId));
      const detail = await api.getProject(Number(projectId));
      setProjects((prev) => prev.map((p) => (p.id === detail.id ? detail : p)));
    });

  const handleApproveQuotation = (id: string) =>
    run(async () => {
      await api.approveQuotation(Number(id));
      await loadQuotations();
    }, 'Orçamento aprovado. A Learn Code foi notificada.');

  const handleRejectQuotation = (id: string) =>
    run(async () => {
      await api.rejectQuotation(Number(id));
      await loadQuotations();
    });

  const handleSubmitPaymentProof = (invoiceId: string) =>
    run(async () => {
      await api.submitPaymentProof(Number(invoiceId));
      await loadInvoices();
    }, 'Comprovativo registado. Aguarda confirmação da Learn Code.');

  const handleMarkAllNotificationsAsRead = () =>
    run(async () => {
      await api.markAllNotificationsRead();
      await loadNotifications();
    });

  const handleChangePassword = async (currentPassword: string, newPassword: string) => {
    await api.changePassword(currentPassword, newPassword);
    setToastMessage('Palavra-passe alterada com sucesso.');
  };

  // Assinatura de contratos (cliente preenche+assina; admin contra-assina)
  const handleSignContract = async (payload: {
    contractId: string;
    signedByName: string;
    signatureImage: string | null;
    contractor?: { fullName: string; idNumber: string; address: string; contact: string };
  }) => {
    const id = Number(payload.contractId);
    if (isAdmin) {
      await api.countersignContract(id, payload.signedByName, payload.signatureImage);
    } else {
      if (payload.contractor) {
        await api.fillContract(id, {
          contractor_full_name: payload.contractor.fullName,
          contractor_id_number: payload.contractor.idNumber,
          contractor_address: payload.contractor.address,
          contractor_contact: payload.contractor.contact,
        });
      }
      await api.signContract(id, payload.signedByName, payload.signatureImage);
    }
    await loadContracts();
    await loadNotifications().catch(() => undefined);
  };

  const handleDownloadContractPdf = (contract: Contract) =>
    run(() => api.downloadContractPdf(Number(contract.id), contract.contractNumber));

  // ---------- Admin ----------
  const reloadClients = async () => {
    const { raw } = await api.listClients();
    setClientsRaw(raw);
  };

  const handleCreateClient = (payload: { name: string; email: string; phone?: string; company?: string; initial_password: string }) =>
    run(async () => {
      await api.createClient(payload);
      await reloadClients();
    }, 'Cliente criado. Partilhe as credenciais de acesso com ele.');

  const handleUpdateClient = (id: string, payload: { name?: string; phone?: string; company?: string; is_active?: boolean }) =>
    run(async () => {
      await api.updateClient(Number(id), payload);
      await reloadClients();
    });

  const handleDeleteClient = (id: string) =>
    run(async () => {
      await api.deleteClient(Number(id));
      await reloadClients();
    });

  const handleCreateProject = (payload: {
    clientId: string; name: string; category?: string; description?: string;
    managerName?: string; startDate?: string; deadline?: string;
  }) =>
    run(async () => {
      await api.createProject({
        client_id: Number(payload.clientId),
        name: payload.name,
        category: payload.category,
        description: payload.description,
        manager_name: payload.managerName,
        start_date: payload.startDate || undefined,
        deadline: payload.deadline || undefined,
      });
      await loadProjects();
    }, 'Projecto criado e cliente notificado.');

  const handleUpdateProjectStatus = (projectId: string, status: Project['status']) =>
    run(async () => {
      await api.updateProject(Number(projectId), { status });
      await loadProjects();
    });

  const handleUpdateProjectProgress = (projectId: string, progress: number) =>
    run(async () => {
      await api.updateProject(Number(projectId), { progress });
      await loadProjects();
    });

  const handleAdminCreateQuotation = (payload: { clientId: string; projectTitle: string; priceMzn: number; estimatedTime?: string; description?: string }) =>
    run(async () => {
      await api.createQuotation({
        client_id: Number(payload.clientId),
        project_title: payload.projectTitle,
        price_mzn: payload.priceMzn,
        estimated_time: payload.estimatedTime,
        description: payload.description,
      });
      await loadQuotations();
    }, 'Orçamento enviado ao cliente.');

  const handleAdminCreateContract = (payload: {
    clientId: string; title: string; serviceDescription?: string; specifications?: string;
    startDate?: string; deliveryDate?: string; valueMzn: number; depositPercent: number; paymentMethod?: string;
  }) =>
    run(async () => {
      await api.createContract({
        client_id: Number(payload.clientId),
        title: payload.title,
        service_description: payload.serviceDescription,
        specifications: payload.specifications,
        start_date: payload.startDate || undefined,
        delivery_date: payload.deliveryDate || undefined,
        value_mzn: payload.valueMzn,
        deposit_percent: payload.depositPercent,
        payment_method: payload.paymentMethod,
      });
      await loadContracts();
    }, 'Contrato criado. Envie-o para assinatura quando estiver pronto.');

  const handleAdminSendContract = (contractId: string) =>
    run(async () => {
      await api.sendContract(Number(contractId));
      await loadContracts();
    }, 'Contrato enviado — o cliente foi notificado.');

  const handleAdminCreateInvoice = (payload: { clientId: string; description?: string; amountMzn: number; issuedDate: string; dueDate: string }) =>
    run(async () => {
      await api.createInvoice({
        client_id: Number(payload.clientId),
        description: payload.description,
        amount_mzn: payload.amountMzn,
        issued_date: payload.issuedDate,
        due_date: payload.dueDate,
      });
      await loadInvoices();
    }, 'Factura emitida e cliente notificado.');

  const handleAdminConfirmPayment = (invoiceId: string) =>
    run(async () => {
      await api.confirmPayment(Number(invoiceId));
      await loadInvoices();
      setAdminSummary(await api.adminSummary());
    }, 'Pagamento confirmado — o cliente foi notificado.');

  const handleAdminCreateMeeting = (payload: { clientId: string; title: string; scheduledAt: string; meetLink?: string }) =>
    run(async () => {
      await api.createMeeting({
        client_id: Number(payload.clientId),
        title: payload.title,
        scheduled_at: payload.scheduledAt,
        meet_link: payload.meetLink,
      });
      await loadMeetings();
    }, 'Reunião agendada e cliente notificado.');

  const handleAdminUpdateMeetingStatus = (meetingId: string, status: Meeting['status']) =>
    run(async () => {
      await api.updateMeetingStatus(Number(meetingId), status);
      await loadMeetings();
    });

  // ---------- Site público ----------
  const handleScrollToQuote = () => navigate('/orcamento');
  const handleScrollToServices = () => navigate('/servicos');
  const handleRequestQuote = (title: string) => {
    setSelectedServiceForQuote(title);
    navigate('/orcamento');
  };
  const openNewProjectRequest = () =>
    window.open(whatsappUrl(`Olá Learn Code! Sou ${authUser?.name ?? 'cliente'} e gostaria de solicitar um novo projecto.`), '_blank');

  const privateAreaLoading = !authChecked || (currentView !== 'public' && !authUser);

  return (
    <div className={`min-h-screen ${isDarkMode ? 'dark bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'} font-sans selection:bg-blue-600 selection:text-white transition-colors duration-200`}>
      <Toast message={toastMessage} onClose={() => setToastMessage(null)} />

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onLoginSuccess={handleLoginSuccess}
      />

      {privateAreaLoading && currentView !== 'public' ? (
        <LoadingScreen />
      ) : currentView === 'portal' ? (
        <Suspense fallback={<LoadingScreen />}>
        <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 transition-colors">
          <PortalHeader
            profile={profile}
            notifications={notifications}
            activeTab={activePortalTab}
            setActiveTab={setActivePortalTab}
            isDarkMode={isDarkMode}
            onToggleDarkMode={() => setThemeMode(isDarkMode ? 'light' : 'dark')}
            onOpenNewProjectWizard={openNewProjectRequest}
            onSwitchToPublicSite={() => navigate('/')}
            onOpenAuthModal={handleLogout}
            onToggleMobileSidebar={() => setMobileSidebarOpen(!mobileSidebarOpen)}
          />

          <div className={`flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-20 lg:pb-8 transition-all duration-300 ${
            isSidebarCollapsed ? 'lg:pl-24' : 'lg:pl-68'
          }`}>
            <PortalSidebar
              activeTab={activePortalTab}
              setActiveTab={setActivePortalTab}
              pendingContractsCount={pendingContractsCount}
              pendingQuotationsCount={pendingQuotationsCount}
              unreadNotificationsCount={unreadNotificationsCount}
              onOpenNewProjectWizard={openNewProjectRequest}
              mobileSidebarOpen={mobileSidebarOpen}
              onCloseMobileSidebar={() => setMobileSidebarOpen(false)}
              isCollapsed={isSidebarCollapsed}
              onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
            />

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
                  onOpenNewProjectWizard={openNewProjectRequest}
                  onOpenSignContractModal={(c) => setSignatureContract(c)}
                  onSubmitPaymentProof={handleSubmitPaymentProof}
                />
              )}

              {activePortalTab === 'projects' && (
                <ProjectsView
                  projects={projects}
                  onSelectProject={handleSelectProject}
                  onOpenNewProjectWizard={openNewProjectRequest}
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
                  onOpenSignModal={(c) => setSignatureContract(c)}
                  onDownloadPdf={handleDownloadContractPdf}
                />
              )}

              {activePortalTab === 'quotations' && (
                <QuotationsView
                  quotations={quotations}
                  onApproveQuotation={handleApproveQuotation}
                  onRejectQuotation={handleRejectQuotation}
                />
              )}

              {activePortalTab === 'meetings' && <MeetingsView meetings={meetings} />}

              {activePortalTab === 'notifications' && (
                <NotificationsView
                  notifications={notifications}
                  onMarkAllAsRead={handleMarkAllNotificationsAsRead}
                  setActiveTab={setActivePortalTab}
                />
              )}

              {activePortalTab === 'profile' && (
                <ProfileView profile={profile} onChangePassword={handleChangePassword} onLogout={handleLogout} />
              )}
            </main>
          </div>

          <DigitalSignatureModal
            contract={signatureContract}
            isOpen={!!signatureContract}
            mode={isAdmin ? 'admin' : 'client'}
            defaultName={authUser?.name ?? ''}
            onClose={() => setSignatureContract(null)}
            onSign={handleSignContract}
            onDownloadPdf={handleDownloadContractPdf}
          />
        </div>
        </Suspense>
      ) : currentView === 'admin' ? (
        <Suspense fallback={<LoadingScreen />}>
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors">
          <AdminHeader
            adminName={authUser?.name ?? 'Administrador'}
            isDarkMode={isDarkMode}
            onToggleDarkMode={() => setThemeMode(isDarkMode ? 'light' : 'dark')}
            onSwitchToPublicSite={() => navigate('/')}
            onLogout={handleLogout}
            onToggleMobileSidebar={() => setAdminMobileSidebarOpen(!adminMobileSidebarOpen)}
          />

          <AdminSidebar
            activeTab={activeAdminTab}
            setActiveTab={setActiveAdminTab}
            pendingQuotationsCount={pendingQuotationsCount}
            pendingContractsCount={contracts.filter((c) => c.status === 'Pendente Assinatura' || c.status === 'Em Análise' || c.status === 'Assinado').length}
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
                  monthlyRevenue={monthlyRevenue}
                  setActiveTab={setActiveAdminTab}
                />
              )}

              {activeAdminTab === 'clients' && (
                <AdminClientsView
                  clients={adminClients}
                  onCreateClient={handleCreateClient}
                  onUpdateClient={handleUpdateClient}
                  onDeleteClient={handleDeleteClient}
                />
              )}

              {activeAdminTab === 'projects' && (
                <AdminProjectsView
                  projects={projects}
                  clients={adminClients}
                  onCreateProject={handleCreateProject}
                  onUpdateProjectStatus={handleUpdateProjectStatus}
                  onUpdateProjectProgress={handleUpdateProjectProgress}
                />
              )}

              {activeAdminTab === 'quotations' && (
                <AdminQuotationsView
                  quotations={quotations}
                  clients={adminClients}
                  onCreateQuotation={handleAdminCreateQuotation}
                />
              )}

              {activeAdminTab === 'contracts' && (
                <AdminContractsView
                  contracts={contracts}
                  clients={adminClients}
                  onCreateContract={handleAdminCreateContract}
                  onSendContract={handleAdminSendContract}
                  onCountersign={(c) => setSignatureContract(c)}
                  onDownloadPdf={handleDownloadContractPdf}
                />
              )}

              {activeAdminTab === 'meetings' && (
                <AdminMeetingsView
                  meetings={meetings}
                  clients={adminClients}
                  onCreateMeeting={handleAdminCreateMeeting}
                  onUpdateMeetingStatus={handleAdminUpdateMeetingStatus}
                />
              )}

              {activeAdminTab === 'finance' && (
                <AdminFinanceView
                  invoices={invoices}
                  clients={adminClients}
                  onCreateInvoice={handleAdminCreateInvoice}
                  onConfirmPayment={handleAdminConfirmPayment}
                />
              )}
            </div>
          </main>

          <DigitalSignatureModal
            contract={signatureContract}
            isOpen={!!signatureContract}
            mode="admin"
            defaultName={authUser?.name ?? ''}
            onClose={() => setSignatureContract(null)}
            onSign={handleSignContract}
            onDownloadPdf={handleDownloadContractPdf}
          />
        </div>
        </Suspense>
      ) : (
        /* ================= SITE PÚBLICO ================= */
        <div className="bg-white dark:bg-slate-950">
          <Navbar
            onQuoteClick={handleScrollToQuote}
            themeMode={themeMode}
            onChangeTheme={setThemeMode}
            onOpenPortal={() => {
              if (authUser) {
                navigate(authUser.role === 'admin' ? '/admin/dashboard' : '/portal/dashboard');
              } else {
                setIsAuthModalOpen(true);
              }
            }}
          />

          <main>
            {isNotFound && (
              <div className="pt-24 sm:pt-28 dark:bg-slate-950">
                <NotFoundPage />
              </div>
            )}

            {!isNotFound && publicPage === '' && (
              <>
                <Hero onQuoteClick={handleScrollToQuote} onServicesClick={handleScrollToServices} />
                <PortalShowcaseSection onOpenPortal={() => setIsAuthModalOpen(true)} />
                <FAQSection />
              </>
            )}

            {publicPage === 'sobre' && (
              <div className="pt-24 sm:pt-28 bg-slate-50 dark:bg-slate-950"><AboutSection /></div>
            )}

            {publicPage === 'servicos' && (
              <div className="pt-24 sm:pt-28 dark:bg-slate-950"><ServicesSection onSelectServiceForQuote={handleRequestQuote} /></div>
            )}

            {publicPage === 'produtos' && (
              <div className="pt-24 sm:pt-28 bg-slate-50 dark:bg-slate-950"><ProductsSection onInquireProduct={handleRequestQuote} /></div>
            )}

            {publicPage === 'cursos' && (
              <div className="pt-24 sm:pt-28 dark:bg-slate-950"><CoursesSection onEnrollCourse={handleRequestQuote} /></div>
            )}

            {publicPage === 'portfolio' && (
              <div className="pt-24 sm:pt-28 bg-slate-50 dark:bg-slate-950"><PortfolioSection onInquireCase={handleRequestQuote} /></div>
            )}

            {publicPage === 'orcamento' && (
              <div className="pt-24 sm:pt-28 bg-slate-50 dark:bg-slate-950">
                <QuoteSection preselectedService={selectedServiceForQuote} onSuccessToast={(msg) => setToastMessage(msg)} />
                <FAQSection />
              </div>
            )}

            {publicPage === 'contacto' && (
              <div className="pt-24 sm:pt-28 dark:bg-slate-950"><ContactSection onSuccessToast={(msg) => setToastMessage(msg)} /></div>
            )}
          </main>

          <Footer />
          <WhatsAppWidget />
        </div>
      )}
    </div>
  );
}
