import { useCallback, useEffect, useState, lazy, Suspense } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { LoginPage } from './components/LoginPage';
import { Toast } from './components/Toast';
import { api, ApiUser, AdminSummary, avatarFor } from './api';
import { clearToken, getToken } from './api/client';
import {
  AdminTab,
  AdminClient,
  Contract,
  Invoice,
  Meeting,
  MonthlyRevenuePoint,
  Project,
  Quotation,
  ThemeMode,
} from './types';

const AdminHeader = lazy(() => import('./components/admin/AdminHeader').then((m) => ({ default: m.AdminHeader })));
const AdminSidebar = lazy(() => import('./components/admin/AdminSidebar').then((m) => ({ default: m.AdminSidebar })));
const DigitalSignatureModal = lazy(() => import('./components/portal/DigitalSignatureModal').then((m) => ({ default: m.DigitalSignatureModal })));
const AdminDashboardView = lazy(() => import('./components/admin/views/AdminDashboardView').then((m) => ({ default: m.AdminDashboardView })));
const AdminClientsView = lazy(() => import('./components/admin/views/AdminClientsView').then((m) => ({ default: m.AdminClientsView })));
const AdminProjectsView = lazy(() => import('./components/admin/views/AdminProjectsView').then((m) => ({ default: m.AdminProjectsView })));
const AdminQuotationsView = lazy(() => import('./components/admin/views/AdminQuotationsView').then((m) => ({ default: m.AdminQuotationsView })));
const AdminContractsView = lazy(() => import('./components/admin/views/AdminContractsView').then((m) => ({ default: m.AdminContractsView })));
const AdminFinanceView = lazy(() => import('./components/admin/views/AdminFinanceView').then((m) => ({ default: m.AdminFinanceView })));
const AdminMeetingsView = lazy(() => import('./components/admin/views/AdminMeetingsView').then((m) => ({ default: m.AdminMeetingsView })));

const SITE_URL = (import.meta.env.VITE_SITE_URL as string | undefined) ?? 'http://localhost:3000';
const PORTAL_URL = (import.meta.env.VITE_PORTAL_URL as string | undefined) ?? 'http://localhost:3001';

const ADMIN_TABS: AdminTab[] = ['dashboard', 'clients', 'projects', 'quotations', 'contracts', 'meetings', 'finance'];
const PT_MONTHS_SHORT = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];

const LoadingScreen = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="w-8 h-8 border-2 border-slate-200 border-t-[#1a9cd8] rounded-full animate-spin" />
  </div>
);

export default function App() {
  const navigate = useNavigate();
  const location = useLocation();
  const [pathTab] = location.pathname.split('/').filter(Boolean);
  const activeTab: AdminTab = ADMIN_TABS.includes(pathTab as AdminTab) ? (pathTab as AdminTab) : 'dashboard';
  const setActiveTab = (tab: AdminTab) => navigate(`/${tab}`);

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
  const [clientsRaw, setClientsRaw] = useState<ApiUser[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [quotations, setQuotations] = useState<Quotation[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [adminSummary, setAdminSummary] = useState<AdminSummary | null>(null);
  const [signatureContract, setSignatureContract] = useState<Contract | null>(null);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showError = (err: unknown) =>
    setToastMessage(err instanceof Error ? err.message : 'Ocorreu um erro inesperado.');

  const namesById = useCallback(
    (): Record<number, string> => Object.fromEntries(clientsRaw.map((c) => [c.id, c.name])),
    [clientsRaw]
  );
  const projectNamesById = useCallback(
    (): Record<number, string> => Object.fromEntries(projects.map((p) => [Number(p.id), p.name])),
    [projects]
  );

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

  useEffect(() => {
    if (!authUser || authUser.role !== 'admin') return;
    (async () => {
      try {
        const { raw } = await api.listClients();
        setClientsRaw(raw);
        const names = Object.fromEntries(raw.map((c) => [c.id, c.name]));
        setAdminSummary(await api.adminSummary());

        const projectList = await api.listProjects();
        setProjects(projectList);
        const projectNames = Object.fromEntries(projectList.map((p) => [Number(p.id), p.name]));

        const [contractList, quotationList, invoiceList, meetingList] = await Promise.all([
          api.listContracts(names),
          api.listQuotations(),
          api.listInvoices(names, projectNames),
          api.listMeetings(names, projectNames),
        ]);
        setContracts(contractList);
        setQuotations(quotationList);
        setInvoices(invoiceList);
        setMeetings(meetingList);
      } catch (err) {
        showError(err);
      }
    })();
  }, [authUser]);

  // ===================== Derivados =====================
  const pendingQuotationsCount = quotations.filter((q) => q.status === 'Pendente').length;

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

  // ===================== Handlers =====================
  const run = async (action: () => Promise<void>, successMsg?: string) => {
    try {
      await action();
      if (successMsg) setToastMessage(successMsg);
    } catch (err) {
      showError(err);
    }
  };

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

  const handleCreateQuotation = (payload: { clientId: string; projectTitle: string; priceMzn: number; estimatedTime?: string; description?: string }) =>
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

  const handleCreateContract = (payload: {
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

  const handleSendContract = (contractId: string) =>
    run(async () => {
      await api.sendContract(Number(contractId));
      await loadContracts();
    }, 'Contrato enviado — o cliente foi notificado.');

  const handleSignContract = async (payload: {
    contractId: string;
    signedByName: string;
    signatureImage: string | null;
  }) => {
    await api.countersignContract(Number(payload.contractId), payload.signedByName, payload.signatureImage);
    await loadContracts();
  };

  const handleDownloadContractPdf = (contract: Contract) =>
    run(() => api.downloadContractPdf(Number(contract.id), contract.contractNumber));

  const handleCreateInvoice = (payload: { clientId: string; description?: string; amountMzn: number; issuedDate: string; dueDate: string }) =>
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

  const handleConfirmPayment = (invoiceId: string) =>
    run(async () => {
      await api.confirmPayment(Number(invoiceId));
      await loadInvoices();
      setAdminSummary(await api.adminSummary());
    }, 'Pagamento confirmado — o cliente foi notificado.');

  const handleCreateMeeting = (payload: { clientId: string; title: string; scheduledAt: string; meetLink?: string }) =>
    run(async () => {
      await api.createMeeting({
        client_id: Number(payload.clientId),
        title: payload.title,
        scheduled_at: payload.scheduledAt,
        meet_link: payload.meetLink,
      });
      await loadMeetings();
    }, 'Reunião agendada e cliente notificado.');

  const handleUpdateMeetingStatus = (meetingId: string, status: Meeting['status']) =>
    run(async () => {
      await api.updateMeetingStatus(Number(meetingId), status);
      await loadMeetings();
    });

  // ===================== Render =====================
  if (!authChecked) return <LoadingScreen />;

  if (!authUser) {
    return (
      <div className={isDarkMode ? 'dark' : ''}>
        <LoginPage
          subtitle="Painel Administrativo — acesso exclusivo à equipa Learn Code."
          onLoginSuccess={(user) => {
            setAuthUser(user);
            if (user.role === 'admin') navigate('/dashboard');
          }}
        />
      </div>
    );
  }

  // Um cliente não usa esta app — indica-lhe o portal certo
  if (authUser.role !== 'admin') {
    return (
      <div className={`min-h-screen flex items-center justify-center p-4 ${isDarkMode ? 'dark bg-slate-950' : 'bg-slate-50'}`}>
        <div className="max-w-md w-full text-center space-y-4 p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <h1 className="text-xl font-extrabold text-slate-900 dark:text-white">Este é o painel de gestão</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            A sua conta é de cliente. Utilize o Portal do Cliente Learn Code.
          </p>
          <a
            href={PORTAL_URL}
            className="inline-block px-6 py-3 rounded-xl font-bold text-sm text-white bg-blue-600 hover:bg-blue-500 transition-all"
          >
            Ir para o Portal do Cliente
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
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors">
          <AdminHeader
            adminName={authUser.name}
            isDarkMode={isDarkMode}
            onToggleDarkMode={() => setThemeMode(isDarkMode ? 'light' : 'dark')}
            onSwitchToPublicSite={() => { window.location.href = SITE_URL; }}
            onLogout={handleLogout}
            onToggleMobileSidebar={() => setMobileSidebarOpen(!mobileSidebarOpen)}
          />

          <AdminSidebar
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            pendingQuotationsCount={pendingQuotationsCount}
            pendingContractsCount={contracts.filter((c) => c.status === 'Pendente Assinatura' || c.status === 'Em Análise' || c.status === 'Assinado').length}
            pendingInvoicesCount={invoices.filter((i) => i.status !== 'Paga').length}
            mobileSidebarOpen={mobileSidebarOpen}
            onCloseMobileSidebar={() => setMobileSidebarOpen(false)}
            isCollapsed={isSidebarCollapsed}
            onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
          />

          <main className={`transition-all duration-300 ${isSidebarCollapsed ? 'lg:pl-[72px]' : 'lg:pl-60'}`}>
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              {activeTab === 'dashboard' && (
                <AdminDashboardView
                  clients={adminClients}
                  projects={projects}
                  quotations={quotations}
                  contracts={contracts}
                  invoices={invoices}
                  monthlyRevenue={monthlyRevenue}
                  setActiveTab={setActiveTab}
                />
              )}

              {activeTab === 'clients' && (
                <AdminClientsView
                  clients={adminClients}
                  onCreateClient={handleCreateClient}
                  onUpdateClient={handleUpdateClient}
                  onDeleteClient={handleDeleteClient}
                />
              )}

              {activeTab === 'projects' && (
                <AdminProjectsView
                  projects={projects}
                  clients={adminClients}
                  onCreateProject={handleCreateProject}
                  onUpdateProjectStatus={handleUpdateProjectStatus}
                  onUpdateProjectProgress={handleUpdateProjectProgress}
                />
              )}

              {activeTab === 'quotations' && (
                <AdminQuotationsView
                  quotations={quotations}
                  clients={adminClients}
                  onCreateQuotation={handleCreateQuotation}
                />
              )}

              {activeTab === 'contracts' && (
                <AdminContractsView
                  contracts={contracts}
                  clients={adminClients}
                  onCreateContract={handleCreateContract}
                  onSendContract={handleSendContract}
                  onCountersign={(c) => setSignatureContract(c)}
                  onDownloadPdf={handleDownloadContractPdf}
                />
              )}

              {activeTab === 'meetings' && (
                <AdminMeetingsView
                  meetings={meetings}
                  clients={adminClients}
                  onCreateMeeting={handleCreateMeeting}
                  onUpdateMeetingStatus={handleUpdateMeetingStatus}
                />
              )}

              {activeTab === 'finance' && (
                <AdminFinanceView
                  invoices={invoices}
                  clients={adminClients}
                  onCreateInvoice={handleCreateInvoice}
                  onConfirmPayment={handleConfirmPayment}
                />
              )}
            </div>
          </main>

          <DigitalSignatureModal
            contract={signatureContract}
            isOpen={!!signatureContract}
            mode="admin"
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
