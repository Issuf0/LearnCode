import React from 'react';
import {
  CalendarDays,
  LayoutDashboard,
  FolderKanban,
  FileText,
  BadgeDollarSign,
  FolderClosed,
  Bell,
  Settings,
  PlusCircle,
  Code2,
  X,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { PortalTab } from '../../types';

interface PortalSidebarProps {
  activeTab: PortalTab;
  setActiveTab: (tab: PortalTab) => void;
  pendingContractsCount: number;
  pendingQuotationsCount: number;
  unreadNotificationsCount: number;
  onOpenNewProjectWizard: () => void;
  mobileSidebarOpen: boolean;
  onCloseMobileSidebar: () => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

export const PortalSidebar: React.FC<PortalSidebarProps> = ({
  activeTab,
  setActiveTab,
  pendingContractsCount,
  pendingQuotationsCount,
  unreadNotificationsCount,
  onOpenNewProjectWizard,
  mobileSidebarOpen,
  onCloseMobileSidebar,
  isCollapsed,
  onToggleCollapse
}) => {
  const navItems = [
    {
      id: 'dashboard' as PortalTab,
      label: 'Dashboard',
      icon: LayoutDashboard,
    },
    {
      id: 'projects' as PortalTab,
      label: 'Meus Projectos',
      icon: FolderKanban,
    },
    {
      id: 'contracts' as PortalTab,
      label: 'Contratos',
      icon: FileText,
      badge: pendingContractsCount > 0 ? pendingContractsCount : undefined,
      badgeColor: 'bg-amber-500 text-white',
    },
    {
      id: 'quotations' as PortalTab,
      label: 'Orçamentos',
      icon: BadgeDollarSign,
      badge: pendingQuotationsCount > 0 ? pendingQuotationsCount : undefined,
      badgeColor: 'bg-blue-600 text-white',
    },
    {
      id: 'meetings' as PortalTab,
      label: 'Reuniões',
      icon: CalendarDays,
    },
    {
      id: 'notifications' as PortalTab,
      label: 'Notificações',
      icon: Bell,
      badge: unreadNotificationsCount > 0 ? unreadNotificationsCount : undefined,
      badgeColor: 'bg-rose-500 text-white',
    },
    {
      id: 'profile' as PortalTab,
      label: 'Perfil & Conta',
      icon: Settings,
    },
  ];

  return (
    <>
      {/* Mobile Drawer Overlay */}
      {mobileSidebarOpen && (
        <div
          onClick={onCloseMobileSidebar}
          className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-40 lg:hidden"
        />
      )}

      {/* Main Desktop Sidebar + Mobile Drawer */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-40 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 transition-all duration-300 lg:translate-x-0 pt-16 flex flex-col justify-between ${
          isCollapsed ? 'lg:w-20' : 'lg:w-64'
        } ${
          mobileSidebarOpen ? 'w-64 translate-x-0' : 'w-64 -translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="px-3 py-4 space-y-5 overflow-y-auto overflow-x-hidden">
          
          {/* Desktop Minimize Toggle Bar */}
          <div className="hidden lg:flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
            {!isCollapsed && (
              <div className="flex items-center gap-2 px-1">
                <Code2 className="w-4 h-4 text-blue-600" />
                <span className="font-extrabold text-[11px] text-slate-800 dark:text-slate-200 uppercase tracking-wider">
                  Navegação
                </span>
              </div>
            )}
            <button
              onClick={onToggleCollapse}
              title={isCollapsed ? "Expandir menu lateral" : "Minimizar menu lateral"}
              className={`p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer ${
                isCollapsed ? 'mx-auto' : ''
              }`}
            >
              {isCollapsed ? <ChevronRight className="w-5 h-5 text-blue-600" /> : <ChevronLeft className="w-5 h-5" />}
            </button>
          </div>

          {/* Mobile Close Button */}
          <div className="flex lg:hidden items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <Code2 className="w-5 h-5 text-blue-600" />
              <span className="font-bold text-sm text-slate-900 dark:text-white">Navegação</span>
            </div>
            <button
              onClick={onCloseMobileSidebar}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* "+ Request New Project" Quick Action Card */}
          {isCollapsed ? (
            <button
              onClick={() => {
                onOpenNewProjectWizard();
                onCloseMobileSidebar();
              }}
              title="Solicitar Novo Projecto"
              className="w-full py-3 px-2 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 text-white shadow-md hover:shadow-lg flex items-center justify-center transition-all cursor-pointer group"
            >
              <PlusCircle className="w-5 h-5 group-hover:scale-110 transition-transform" />
            </button>
          ) : (
            <div className="p-4 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 text-white shadow-lg shadow-blue-600/20 relative overflow-hidden">
              <div className="relative z-10 space-y-2">
                <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-white/20 text-[10px] font-bold uppercase tracking-wider text-white">
                  <span>Nova Solução</span>
                </div>
                <h3 className="text-sm font-extrabold leading-snug">Tenha uma nova ideia para a sua empresa?</h3>
                <p className="text-[11px] text-blue-100 leading-relaxed">
                  Solicite uma proposta técnica e orçamento personalizado.
                </p>
                <button
                  onClick={() => {
                    onOpenNewProjectWizard();
                    onCloseMobileSidebar();
                  }}
                  className="w-full mt-2 py-2 px-3 rounded-xl bg-white text-blue-700 hover:bg-blue-50 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-sm"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>Solicitar Projecto</span>
                </button>
              </div>
            </div>
          )}

          {/* Navigation Links */}
          <div className="space-y-1">
            {!isCollapsed && (
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 px-3 pb-1">
                Menu Principal
              </p>
            )}

            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id || (activeTab === 'project-detail' && item.id === 'projects');

              return (
                <button
                  key={item.id}
                  title={item.label}
                  onClick={() => {
                    setActiveTab(item.id);
                    onCloseMobileSidebar();
                  }}
                  className={`relative flex items-center transition-all cursor-pointer ${
                    isCollapsed
                      ? 'w-full justify-center p-3 rounded-2xl'
                      : 'w-full justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold'
                  } ${
                    isActive
                      ? 'bg-blue-50 dark:bg-blue-950/80 text-blue-600 dark:text-blue-400 border border-blue-200/80 dark:border-blue-800/80 shadow-sm'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60'
                  }`}
                >
                  <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'gap-3'}`}>
                    <Icon className={`w-4 h-4 ${isActive ? 'text-blue-600 dark:text-blue-400' : 'text-slate-400'}`} />
                    {!isCollapsed && <span>{item.label}</span>}
                  </div>

                  {item.badge !== undefined && (
                    isCollapsed ? (
                      <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-500 text-white text-[9px] font-bold flex items-center justify-center shadow-sm">
                        {item.badge}
                      </span>
                    ) : (
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          item.badgeColor || 'bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                        }`}
                      >
                        {item.badge}
                      </span>
                    )
                  )}
                </button>
              );
            })}
          </div>

        </div>

        {/* Sidebar Footer */}
        <div className="p-3 border-t border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
          {isCollapsed ? (
            <div className="flex justify-center" title="Suporte Técnico Online">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            </div>
          ) : (
            <>
              <div className="flex items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>Suporte Técnico Online</span>
              </div>
              <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5">Maputo, Moçambique • v2.4 SaaS</p>
            </>
          )}
        </div>
      </aside>

      {/* Mobile Bottom Navigation Bar (Linear/Notion Mobile Style) */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-30 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 px-2 py-2 flex items-center justify-around shadow-xl">
        {[
          { id: 'dashboard' as PortalTab, label: 'Dashboard', icon: LayoutDashboard },
          { id: 'projects' as PortalTab, label: 'Projectos', icon: FolderKanban },
          { id: 'notifications' as PortalTab, label: 'Avisos', icon: Bell, badge: unreadNotificationsCount },
          { id: 'contracts' as PortalTab, label: 'Contratos', icon: FileText, badge: pendingContractsCount },
          { id: 'profile' as PortalTab, label: 'Perfil', icon: Settings },
        ].map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id || (activeTab === 'project-detail' && item.id === 'projects');

          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`relative flex flex-col items-center justify-center py-1 px-2 rounded-xl text-[10px] font-medium transition-all ${
                isActive ? 'text-blue-600 dark:text-blue-400 font-bold' : 'text-slate-500 dark:text-slate-400'
              }`}
            >
              <div className="relative">
                <Icon className="w-5 h-5 mb-0.5" />
                {item.badge && item.badge > 0 ? (
                  <span className="absolute -top-1 -right-2 w-4 h-4 rounded-full bg-rose-500 text-white text-[9px] font-bold flex items-center justify-center">
                    {item.badge}
                  </span>
                ) : null}
              </div>
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>
    </>
  );
};

