import { useCallback, useEffect, useState, lazy, Suspense } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { LoginPage } from './components/LoginPage';
import { Toast } from './components/Toast';
import { api, ApiUser, avatarFor } from './api';
import { clearToken, getToken } from './api/client';
import { COMPANY_INFO } from './data/mockData';
import {
  PortalTab,
  ClientProfile,
  Contract,
  Invoice,
  Meeting,
  PortalNotification,
  Project,
  Quotation,
  ThemeMode,
} from './types';

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

const SITE_URL = (import.meta.env.VITE_SITE_URL as string | undefined) ?? 'http://localhost:3000';
const ADMIN_URL = (import.meta.env.VITE_ADMIN_URL as string | undefined) ?? 'http://localhost:3002';

const PORTAL_TABS: PortalTab[] = ['dashboard', 'projects', 'project-detail', 'contracts', 'quotations', 'meetings', 'notifications', 'profile'];

const whatsappUrl = (text: string) =>
  `https://wa.me/${COMPANY_INFO.whatsappNumber.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(text)}`;

const LoadingScreen = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="w-8 h-8 border-2 border-slate-200 border-t-[#1a9cd8] rounded-full animate-spin" />
  </div>
);

export default function App() {
  const navigate = useNavigate();
  const location = useLocation();
  const [pathTab] = location.pathname.split('/').filter(Boolean);
  const activeTab: PortalTab = PORTAL_TABS.includes(pathTab as PortalTab) ? (pathTab as PortalTab) : 'dashboard';
  const setActiveTab = (tab: PortalTab) => navigate(`/${tab}`);

  // ===================== Autenticação =====================
  const [authUser, setAuthUser] = useState<ApiUser | null>(null);
  const [authChecked, setAuthChecked] = useState(false);

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

  const handleLogout = useCallback(() => {
    clearToken();
    setAuthUser(null);
    navigate('/');
  }, [navigate]);

  // ===================== Tema =====================
  const [themeMode, setThemeMode] = useState<ThemeMode>(() => {
    const stored = localStorage.getItem('lc-theme');
    return stored === 'dark' || stored === 'light' || stored === 'auto' ? stored : 'auto';
  });
  const [systemPrefersDark, setSystemPrefersDark] = useState<boolean>(
    () => window.matchMedia('(prefers-color-scheme: dark)').matches
  );
  const isDarkMode = themeMode === 'dark' || (themeMode === 'auto' && systemPrefersDark);

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
    window.scrollTo({ top: 0 });
  }, [location.pathname]);

  // ===================== Dados =====================
  const [projects, setProjects] = useState<Project[]>([]);
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [quotations, setQuotations] = useState<Quotation[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [notifications, setNotifications] = useState<PortalNotification[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [signatureContract, setSignatureContract] = useState<Contract | null>(null);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showError = (err: unknown) =>
    setToastMessage(err instanceof Error ? err.message : 'Ocorreu um erro inesperado.');

  const names = useCallback(
    (): Record<number, string> => (authUser ? { [authUser.id]: authUser.name } : {}),
    [authUser]
  );
  const projectNames = useCallback(
    (): Record<number, string> => Object.fromEntries(projects.map((p) => [Number(p.id), p.name])),
    [projects]
  );

  const loadContracts = useCallback(async () => setContracts(await api.listContracts(names())), [names]);
  const loadQuotations = useCallback(async () => setQuotations(await api.listQuotations()), []);
  const loadInvoices = useCallback(
    async () => setInvoices(await api.listInvoices(names(), projectNames())),
    [names, projectNames]
  );
  const loadNotifications = useCallback(async () => setNotifications(await api.listNotifications()), []);

  useEffect(() => {
    if (!authUser || authUser.role !== 'client') return;
    (async () => {
      try {
        const projectList = await api.listProjects();
        setProjects(projectList);
        const pNames = Object.fromEntries(projectList.map((p) => [Number(p.id), p.name]));
        const n = { [authUser.id]: authUser.name };
        const [contractList, quotationList, invoiceList, meetingList, notificationList] = await Promise.all([
          api.listContracts(n),
          api.listQuotations(),
          api.listInvoices(n, pNames),
          api.listMeetings(n, pNames),
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
  }, [authUser]);

  // ===================== Perfil =====================
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

  const pendingContractsCount = contracts.filter((c) => c.status === 'Pendente Assinatura').length;
  const pendingQuotationsCount = quotations.filter((q) => q.status === 'Pendente').length;
  const unreadNotificationsCount = notifications.filter((n) => !n.read).length;
  const selectedProject = projects.find((p) => p.id === selectedProjectId) || projects[0] || null;

  // ===================== Handlers =====================
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
    navigate('/project-detail');
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

  const handleSignContract = async (payload: {
    contractId: string;
    signedByName: string;
    signatureImage: string | null;
    contractor?: { fullName: string; idNumber: string; address: string; contact: string };
  }) => {
    const id = Number(payload.contractId);
    if (payload.contractor) {
      await api.fillContract(id, {
        contractor_full_name: payload.contractor.fullName,
        contractor_id_number: payload.contractor.idNumber,
        contractor_address: payload.contractor.address,
        contractor_contact: payload.contractor.contact,
      });
    }
    await api.signContract(id, payload.signedByName, payload.signatureImage);
    await loadContracts();
    await loadNotifications().catch(() => undefined);
  };

  const handleDownloadContractPdf = (contract: Contract) =>
    run(() => api.downloadContractPdf(Number(contract.id), contract.contractNumber));

  const openNewProjectRequest = () =>
    window.open(whatsappUrl(`Olá Learn Code! Sou ${authUser?.name ?? 'cliente'} e gostaria de solicitar um novo projecto.`), '_blank');

  // ===================== Render =====================
  if (!authChecked) return <LoadingScreen />;

  if (!authUser) {
    return (
      <div className={isDarkMode ? 'dark' : ''}>
        <LoginPage
          subtitle="Portal do Cliente — acesso reservado. As contas são criadas pela Learn Code após o início do projecto."
          onLoginSuccess={(user) => {
            if (user.role === 'admin') {
              setAuthUser(user);
            } else {
              setAuthUser(user);
              navigate('/dashboard');
            }
          }}
        />
      </div>
    );
  }

  // Um administrador não usa esta app — indica-lhe o painel certo
  if (authUser.role !== 'client') {
    return (
      <div className={`min-h-screen flex items-center justify-center p-4 ${isDarkMode ? 'dark bg-slate-950' : 'bg-slate-50'}`}>
        <div className="max-w-md w-full text-center space-y-4 p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <h1 className="text-xl font-extrabold text-slate-900 dark:text-white">Esta é a área de clientes</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            A sua conta é de administrador. Utilize o painel de gestão da Learn Code.
          </p>
          <a
            href={ADMIN_URL}
            className="inline-block px-6 py-3 rounded-xl font-bold text-sm text-white bg-blue-600 hover:bg-blue-500 transition-all"
          >
            Ir para o Painel Administrativo
          </a>
          <button onClick={handleLogout} className="block mx-auto text-xs text-slate-500 underline cursor-pointer">
            Terminar sessão
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${isDarkMode ? 'dark bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'} font-sans selection:bg-blue-600 selection:text-white transition-colors duration-200`}>
      <Toast message={toastMessage} onClose={() => setToastMessage(null)} />

      <Suspense fallback={<LoadingScreen />}>
        <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 transition-colors">
          <PortalHeader
            profile={profile}
            notifications={notifications}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            isDarkMode={isDarkMode}
            onToggleDarkMode={() => setThemeMode(isDarkMode ? 'light' : 'dark')}
            onOpenNewProjectWizard={openNewProjectRequest}
            onSwitchToPublicSite={() => { window.location.href = SITE_URL; }}
            onOpenAuthModal={handleLogout}
            onToggleMobileSidebar={() => setMobileSidebarOpen(!mobileSidebarOpen)}
          />

          <div className={`flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-20 lg:pb-8 transition-all duration-300 ${
            isSidebarCollapsed ? 'lg:pl-24' : 'lg:pl-68'
          }`}>
            <PortalSidebar
              activeTab={activeTab}
              setActiveTab={setActiveTab}
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
              {activeTab === 'dashboard' && (
                <DashboardView
                  profile={profile}
                  projects={projects}
                  contracts={contracts}
                  quotations={quotations}
                  invoices={invoices}
                  notifications={notifications}
                  setActiveTab={setActiveTab}
                  onSelectProject={handleSelectProject}
                  onOpenNewProjectWizard={openNewProjectRequest}
                  onOpenSignContractModal={(c) => setSignatureContract(c)}
                  onSubmitPaymentProof={handleSubmitPaymentProof}
                />
              )}

              {activeTab === 'projects' && (
                <ProjectsView
                  projects={projects}
                  onSelectProject={handleSelectProject}
                  onOpenNewProjectWizard={openNewProjectRequest}
                />
              )}

              {activeTab === 'project-detail' && (
                <ProjectDetailView
                  project={selectedProject}
                  onBack={() => setActiveTab('projects')}
                  onAddComment={handleAddProjectComment}
                  onToggleTask={handleToggleTask}
                />
              )}

              {activeTab === 'contracts' && (
                <ContractsView
                  contracts={contracts}
                  onOpenSignModal={(c) => setSignatureContract(c)}
                  onDownloadPdf={handleDownloadContractPdf}
                />
              )}

              {activeTab === 'quotations' && (
                <QuotationsView
                  quotations={quotations}
                  onApproveQuotation={handleApproveQuotation}
                  onRejectQuotation={handleRejectQuotation}
                />
              )}

              {activeTab === 'meetings' && <MeetingsView meetings={meetings} />}

              {activeTab === 'notifications' && (
                <NotificationsView
                  notifications={notifications}
                  onMarkAllAsRead={handleMarkAllNotificationsAsRead}
                  setActiveTab={setActiveTab}
                />
              )}

              {activeTab === 'profile' && (
                <ProfileView profile={profile} onChangePassword={handleChangePassword} onLogout={handleLogout} />
              )}
            </main>
          </div>

          <DigitalSignatureModal
            contract={signatureContract}
            isOpen={!!signatureContract}
            mode="client"
            defaultName={authUser.name}
            onClose={() => setSignatureContract(null)}
            onSign={handleSignContract}
            onDownloadPdf={handleDownloadContractPdf}
          />
        </div>
      </Suspense>
    </div>
  );
}
