export interface ServiceItem {
  id: string;
  title: string;
  shortDesc: string;
  fullDesc: string;
  iconName: string;
  benefits: string[];
  category: 'dev' | 'mobile' | 'ai' | 'design' | 'consulting' | 'education';
  priceFrom?: string;
}

export interface ProductItem {
  id: string;
  name: string;
  tagline: string;
  description: string;
  status: 'Activo' | 'Em Desenvolvimento' | 'Em Breve';
  statusColor: 'active' | 'development' | 'soon';
  category: string;
  features: string[];
  impactSummary: string;
  targetAudience: string;
  techStack: string[];
  link?: string;
}

export interface CourseItem {
  id: string;
  title: string;
  duration: string;
  priceMzn: number;
  formattedPrice: string;
  level: 'Iniciante' | 'Intermédio' | 'Avançado';
  prerequisites: string;
  summary: string;
  topics: string[];
  badge?: string;
}

export interface CaseStudy {
  id: string;
  title: string;
  clientCategory: string;
  problem: string;
  solution: string;
  impact: string;
  results: string[];
  technologies: string[];
  featuredProductRef?: string;
  imageSeed: string;
  link?: string;
}

export interface QuoteFormData {
  fullName: string;
  company: string;
  email: string;
  whatsapp: string;
  projectType: string;
  estimatedBudget: string;
  desiredTimeline: string;
  description: string;
}

export interface ContactFormData {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
}

// =====================================
// PORTAL TYPES (PHASE 2)
// =====================================

export type PortalTab =
  | 'dashboard'
  | 'projects'
  | 'project-detail'
  | 'contracts'
  | 'quotations'
  | 'meetings'
  | 'documents'
  | 'notifications'
  | 'profile'
  | 'new-project';

export interface ClientProfile {
  id: string;
  name: string;
  company: string;
  email: string;
  phone: string;
  address: string;
  country: string;
  avatarUrl: string;
  joinedDate: string;
  is2FAEnabled: boolean;
  preferences: {
    emailNotifications: boolean;
    whatsappNotifications: boolean;
    weeklyDigest: boolean;
  };
}

export interface ProjectManager {
  name: string;
  role: string;
  avatar: string;
  email: string;
  phone: string;
}

export interface Milestone {
  id: string;
  title: string;
  dueDate: string;
  completed: boolean;
  percentage: number;
}

export interface ProjectTask {
  id: string;
  title: string;
  status: 'todo' | 'in_progress' | 'completed';
  assignedTo?: string;
}

export interface ProjectComment {
  id: string;
  authorName: string;
  authorAvatar: string;
  isClient: boolean;
  text: string;
  timestamp: string;
}

export interface TimelineEvent {
  id: string;
  date: string;
  title: string;
  description: string;
  status: 'completed' | 'current' | 'upcoming';
  category: 'contract' | 'design' | 'dev' | 'testing' | 'payment';
}

export interface Project {
  id: string;
  name: string;
  description: string;
  category: string;
  status: 'Planeamento' | 'Em Desenvolvimento' | 'Testes' | 'Concluído' | 'Pausado';
  progress: number;
  techStack: string[];
  projectManager: ProjectManager;
  startDate: string;
  deadline: string;
  estimatedDelivery: string;
  milestones: Milestone[];
  tasks: ProjectTask[];
  recentUpdates: string[];
  comments: ProjectComment[];
  timelineHistory: TimelineEvent[];
}

export interface Contract {
  id: string;
  contractNumber: string;
  title: string;
  clientName: string;
  projectName: string;
  date: string;
  valueMzn: string;
  status: 'Pendente Assinatura' | 'Assinado' | 'Em Análise' | 'Cancelado';
  pdfPreviewUrl?: string;
  signedAt?: string;
  signatureDataUrl?: string;
  signedByName?: string;
  digitalCertHash?: string;
}

export interface Quotation {
  id: string;
  code: string;
  projectTitle: string;
  priceMzn: string;
  priceUsd: string;
  estimatedTime: string;
  technologies: string[];
  description: string;
  status: 'Draft' | 'Pendente' | 'Aprovado' | 'Recusado';
  date: string;
}

export interface ClientDocument {
  id: string;
  name: string;
  category: 'Branding & Logo' | 'Termos de Referência' | 'Contratos & SLA' | 'Faturas & Recibos' | 'Manuais & Guias';
  size: string;
  uploadDate: string;
  fileType: 'pdf' | 'zip' | 'docx' | 'png' | 'mp4';
}

// =====================================
// ADMIN TYPES (PHASE 3)
// =====================================

export type AdminTab =
  | 'dashboard'
  | 'clients'
  | 'projects'
  | 'quotations'
  | 'contracts'
  | 'meetings'
  | 'finance';

export interface Meeting {
  id: string;
  title: string;
  clientName: string;
  projectName: string;
  date: string;
  time: string;
  meetLink: string;
  status: 'Agendada' | 'Concluída' | 'Cancelada';
}

export interface AdminClient {
  id: string;
  name: string;
  company: string;
  email: string;
  phone: string;
  avatarUrl: string;
  status: 'Activo' | 'Pendente' | 'Inactivo';
  joinedDate: string;
  totalBilledMzn: number;
  activeProjects: number;
}

export interface Invoice {
  id: string;
  number: string;
  clientName: string;
  projectName: string;
  description: string;
  amountMzn: number;
  issuedDate: string;
  dueDate: string;
  status: 'Pendente' | 'Aguarda Confirmação' | 'Paga' | 'Vencida';
}

export interface MonthlyRevenuePoint {
  month: string;
  valueMzn: number;
}

export interface PortalNotification {
  id: string;
  title: string;
  message: string;
  date: string;
  type: 'project' | 'contract' | 'invoice' | 'quotation' | 'meeting';
  read: boolean;
  targetTab?: PortalTab;
}

