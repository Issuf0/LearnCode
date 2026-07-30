/** Endpoints da Learn Code API + adaptadores para os tipos do frontend. */

import { downloadFile, http, setToken } from './client';
import {
  AdminClient,
  Contract,
  Invoice,
  Meeting,
  PortalNotification,
  PortalTab,
  Project,
  ProjectComment,
  Quotation,
} from '../types';

// ---------------------------------------------------------------- Tipos da API

export interface ApiUser {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  company: string | null;
  avatar_url: string | null;
  role: 'admin' | 'client';
  is_active: boolean;
  created_at?: string;
}

interface ApiMilestone { id: number; title: string; due_date: string | null; completed: boolean }
interface ApiTask { id: number; title: string; status: 'todo' | 'in_progress' | 'completed'; assigned_to: string | null }
interface ApiComment { id: number; text: string; created_at: string; author_name: string; is_client: boolean }

interface ApiProject {
  id: number;
  client_id: number;
  name: string;
  category: string | null;
  description: string | null;
  status: Project['status'];
  progress: number;
  manager_name: string | null;
  start_date: string | null;
  deadline: string | null;
  created_at: string;
  milestones: ApiMilestone[];
  tasks: ApiTask[];
  comments?: ApiComment[];
}

interface ApiQuotation {
  id: number; code: string; client_id: number; project_title: string;
  description: string | null; price_mzn: string; estimated_time: string | null;
  status: Quotation['status']; created_at: string;
}

export interface ApiContract {
  id: number; number: string; client_id: number; project_id: number | null;
  title: string; status: Contract['status'];
  service_description: string | null; specifications: string | null;
  start_date: string | null; delivery_date: string | null;
  value_mzn: string; deposit_percent: number; payment_method: string | null;
  contractor_full_name: string | null; contractor_id_number: string | null;
  contractor_address: string | null; contractor_contact: string | null;
  signed_at: string | null; signed_by_name: string | null; signature_hash: string | null;
  admin_signed_at: string | null; admin_signed_by_name: string | null;
  created_at: string;
}

interface ApiInvoice {
  id: number; number: string; client_id: number; project_id: number | null;
  description: string | null; amount_mzn: string; issued_date: string; due_date: string;
  status: Invoice['status']; proof_note: string | null;
  proof_submitted_at: string | null; paid_at: string | null;
}

interface ApiMeeting {
  id: number; client_id: number; project_id: number | null; title: string;
  scheduled_at: string; meet_link: string | null; status: Meeting['status']; created_at: string;
}

interface ApiNotification {
  id: number; title: string; message: string;
  type: PortalNotification['type']; target_tab: string | null; read: boolean; created_at: string;
}

export interface AdminSummary {
  active_clients: number;
  active_projects: number;
  revenue_received_mzn: string;
  revenue_pending_mzn: string;
  pending_quotations: number;
  pending_contracts: number;
  awaiting_confirmation_invoices: number;
  monthly_revenue: { month: number; total_mzn: string }[];
}

// ------------------------------------------------------------------ Utilidades

export const formatMzn = (value: number): string =>
  `${value.toLocaleString('pt-PT', { maximumFractionDigits: 0 }).replace(/\s/g, '.')} MZN`;

export const avatarFor = (name: string): string =>
  `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=0e83ba&color=fff&bold=true`;

const fmtDate = (iso: string | null): string =>
  iso ? new Date(iso).toLocaleDateString('pt-PT', { day: '2-digit', month: 'short', year: 'numeric' }) : '—';

const fmtDateTime = (iso: string | null): string =>
  iso ? new Date(iso).toLocaleString('pt-PT', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' }) : '—';

export type NameById = Record<number, string>;

// ---------------------------------------------------------------- Adaptadores

const adaptProject = (p: ApiProject): Project => ({
  id: String(p.id),
  clientId: String(p.client_id),
  name: p.name,
  description: p.description ?? '',
  category: p.category ?? 'Projecto',
  status: p.status,
  progress: p.progress,
  techStack: [],
  projectManager: {
    name: p.manager_name ?? 'Equipa Learn Code',
    role: 'Gestor de Projecto',
    avatar: avatarFor(p.manager_name ?? 'Learn Code'),
    email: '',
    phone: '',
  },
  startDate: fmtDate(p.start_date),
  deadline: fmtDate(p.deadline),
  estimatedDelivery: fmtDate(p.deadline),
  milestones: p.milestones.map((m) => ({
    id: String(m.id),
    title: m.title,
    dueDate: fmtDate(m.due_date),
    completed: m.completed,
    percentage: m.completed ? 100 : 0,
  })),
  tasks: p.tasks.map((t) => ({
    id: String(t.id),
    title: t.title,
    status: t.status,
    assignedTo: t.assigned_to ?? undefined,
  })),
  recentUpdates: [],
  comments: (p.comments ?? []).map(adaptComment),
  timelineHistory: [],
});

const adaptComment = (c: ApiComment): ProjectComment => ({
  id: String(c.id),
  authorName: c.author_name,
  authorAvatar: avatarFor(c.author_name),
  isClient: c.is_client,
  text: c.text,
  timestamp: fmtDateTime(c.created_at),
});

const adaptQuotation = (q: ApiQuotation): Quotation => ({
  id: String(q.id),
  code: q.code,
  projectTitle: q.project_title,
  priceMzn: formatMzn(Number(q.price_mzn)),
  priceUsd: '',
  estimatedTime: q.estimated_time ?? 'A definir',
  technologies: [],
  description: q.description ?? '',
  status: q.status,
  date: fmtDate(q.created_at),
});

const adaptContract = (c: ApiContract, names: NameById): Contract => ({
  id: String(c.id),
  contractNumber: c.number,
  title: c.title,
  clientName: names[c.client_id] ?? '—',
  projectName: c.service_description ?? c.title,
  date: fmtDate(c.created_at),
  valueMzn: formatMzn(Number(c.value_mzn)),
  status: c.status,
  signedAt: c.signed_at ? fmtDateTime(c.signed_at) : undefined,
  signedByName: c.signed_by_name ?? undefined,
  digitalCertHash: c.signature_hash ? `SHA-256 ${c.signature_hash}` : undefined,
  serviceDescription: c.service_description ?? undefined,
  specifications: c.specifications ?? undefined,
  depositPercent: c.deposit_percent,
  paymentMethod: c.payment_method ?? undefined,
  startDate: c.start_date ? fmtDate(c.start_date) : undefined,
  deliveryDate: c.delivery_date ? fmtDate(c.delivery_date) : undefined,
  contractorFullName: c.contractor_full_name ?? undefined,
  contractorIdNumber: c.contractor_id_number ?? undefined,
  contractorAddress: c.contractor_address ?? undefined,
  contractorContact: c.contractor_contact ?? undefined,
  adminSignedAt: c.admin_signed_at ? fmtDateTime(c.admin_signed_at) : undefined,
  adminSignedByName: c.admin_signed_by_name ?? undefined,
});

const adaptInvoice = (i: ApiInvoice, names: NameById, projectNames: NameById): Invoice => ({
  id: String(i.id),
  number: i.number,
  clientName: names[i.client_id] ?? '—',
  projectName: (i.project_id && projectNames[i.project_id]) || i.description || '—',
  description: i.description ?? '',
  amountMzn: Number(i.amount_mzn),
  issuedDate: fmtDate(i.issued_date),
  dueDate: fmtDate(i.due_date),
  status: i.status,
});

const adaptMeeting = (m: ApiMeeting, names: NameById, projectNames: NameById): Meeting => ({
  id: String(m.id),
  title: m.title,
  clientName: names[m.client_id] ?? '—',
  projectName: (m.project_id && projectNames[m.project_id]) || '—',
  date: fmtDate(m.scheduled_at),
  time: new Date(m.scheduled_at).toLocaleTimeString('pt-PT', { hour: '2-digit', minute: '2-digit' }),
  meetLink: m.meet_link ?? '',
  status: m.status,
});

const adaptNotification = (n: ApiNotification): PortalNotification => ({
  id: String(n.id),
  title: n.title,
  message: n.message,
  date: fmtDateTime(n.created_at),
  type: n.type,
  read: n.read,
  targetTab: (n.target_tab as PortalTab | null) ?? undefined,
});

const adaptAdminClient = (u: ApiUser): AdminClient => ({
  id: String(u.id),
  name: u.name,
  company: u.company ?? 'Particular',
  email: u.email,
  phone: u.phone ?? '—',
  avatarUrl: u.avatar_url ?? avatarFor(u.name),
  status: u.is_active ? 'Activo' : 'Inactivo',
  joinedDate: u.created_at ? fmtDate(u.created_at) : '—',
  totalBilledMzn: 0,
  activeProjects: 0,
});

// ------------------------------------------------------------------- Endpoints

export const api = {
  // Autenticação
  async login(email: string, password: string): Promise<ApiUser> {
    const { access_token } = await http.post<{ access_token: string }>('/auth/login', { email, password });
    setToken(access_token);
    return http.get<ApiUser>('/auth/me');
  },
  me: () => http.get<ApiUser>('/auth/me'),
  changePassword: (current_password: string, new_password: string) =>
    http.post<void>('/auth/change-password', { current_password, new_password }),

  // Clientes (admin)
  listClients: async (): Promise<{ raw: ApiUser[]; adapted: AdminClient[] }> => {
    const raw = await http.get<ApiUser[]>('/clients');
    return { raw, adapted: raw.map(adaptAdminClient) };
  },
  createClient: (payload: { name: string; email: string; phone?: string; company?: string; initial_password: string }) =>
    http.post<ApiUser>('/clients', payload),
  updateClient: (id: number, payload: { name?: string; phone?: string; company?: string; is_active?: boolean }) =>
    http.patch<ApiUser>(`/clients/${id}`, payload),
  deleteClient: (id: number) => http.delete<void>(`/clients/${id}`),

  // Projectos
  listProjects: async (): Promise<Project[]> =>
    (await http.get<ApiProject[]>('/projects')).map(adaptProject),
  getProject: async (id: number): Promise<Project> => adaptProject(await http.get<ApiProject>(`/projects/${id}`)),
  createProject: (payload: {
    client_id: number; name: string; category?: string; description?: string;
    manager_name?: string; start_date?: string; deadline?: string;
    milestones?: { title: string; due_date?: string }[];
  }) => http.post<ApiProject>('/projects', payload),
  updateProject: (id: number, payload: Partial<{ status: Project['status']; progress: number }>) =>
    http.patch<ApiProject>(`/projects/${id}`, payload),
  addComment: async (projectId: number, text: string): Promise<ProjectComment> =>
    adaptComment(await http.post<ApiComment>(`/projects/${projectId}/comments`, { text })),
  toggleTask: (projectId: number, taskId: number) =>
    http.patch<ApiTask>(`/projects/${projectId}/tasks/${taskId}`, {}),

  // Orçamentos
  listQuotations: async (): Promise<Quotation[]> =>
    (await http.get<ApiQuotation[]>('/quotations')).map(adaptQuotation),
  createQuotation: (payload: {
    client_id: number; project_title: string; description?: string; price_mzn: number; estimated_time?: string;
  }) => http.post<ApiQuotation>('/quotations', payload),
  approveQuotation: (id: number) => http.post<ApiQuotation>(`/quotations/${id}/approve`),
  rejectQuotation: (id: number) => http.post<ApiQuotation>(`/quotations/${id}/reject`),

  // Contratos
  listContracts: async (names: NameById): Promise<Contract[]> =>
    (await http.get<ApiContract[]>('/contracts')).map((c) => adaptContract(c, names)),
  createContract: (payload: {
    client_id: number; title: string; service_description?: string; specifications?: string;
    start_date?: string; delivery_date?: string; value_mzn: number; deposit_percent: number; payment_method?: string;
  }) => http.post<ApiContract>('/contracts', payload),
  sendContract: (id: number) => http.post<ApiContract>(`/contracts/${id}/send`),
  fillContract: (id: number, payload: {
    contractor_full_name: string; contractor_id_number: string;
    contractor_address: string; contractor_contact: string;
  }) => http.patch<ApiContract>(`/contracts/${id}/fill`, payload),
  signContract: (id: number, signed_by_name: string, signature_image: string | null) =>
    http.post<ApiContract>(`/contracts/${id}/sign`, { signed_by_name, signature_image }),
  countersignContract: (id: number, signed_by_name: string, signature_image: string | null) =>
    http.post<ApiContract>(`/contracts/${id}/countersign`, { signed_by_name, signature_image }),
  downloadContractPdf: (id: number, number: string) =>
    downloadFile(`/contracts/${id}/pdf`, `Contrato_${number.replace(/\//g, '-')}.pdf`),

  // Faturas
  listInvoices: async (names: NameById, projectNames: NameById): Promise<Invoice[]> =>
    (await http.get<ApiInvoice[]>('/invoices')).map((i) => adaptInvoice(i, names, projectNames)),
  createInvoice: (payload: {
    client_id: number; project_id?: number; description?: string;
    amount_mzn: number; issued_date: string; due_date: string;
  }) => http.post<ApiInvoice>('/invoices', payload),
  submitPaymentProof: (id: number, note?: string) =>
    http.post<ApiInvoice>(`/invoices/${id}/submit-proof`, { note: note ?? null }),
  confirmPayment: (id: number) => http.post<ApiInvoice>(`/invoices/${id}/confirm`),

  // Reuniões
  listMeetings: async (names: NameById, projectNames: NameById): Promise<Meeting[]> =>
    (await http.get<ApiMeeting[]>('/meetings')).map((m) => adaptMeeting(m, names, projectNames)),
  createMeeting: (payload: {
    client_id: number; project_id?: number; title: string; scheduled_at: string; meet_link?: string;
  }) => http.post<ApiMeeting>('/meetings', payload),
  updateMeetingStatus: (id: number, status: Meeting['status']) =>
    http.patch<ApiMeeting>(`/meetings/${id}/status`, { status }),

  // Notificações
  listNotifications: async (): Promise<PortalNotification[]> =>
    (await http.get<ApiNotification[]>('/notifications')).map(adaptNotification),
  markAllNotificationsRead: () => http.post<void>('/notifications/read-all'),

  // Dashboard
  adminSummary: () => http.get<AdminSummary>('/dashboard/admin'),
};
