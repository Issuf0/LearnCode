import React from 'react';
import {
  LayoutDashboard,
  CalendarDays,
  Users,
  FolderKanban,
  BadgeDollarSign,
  FileText,
  Wallet,
  X,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { AdminTab } from '../../types';

interface AdminSidebarProps {
  activeTab: AdminTab;
  setActiveTab: (tab: AdminTab) => void;
  pendingQuotationsCount: number;
  pendingContractsCount: number;
  pendingInvoicesCount: number;
  mobileSidebarOpen: boolean;
  onCloseMobileSidebar: () => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

export const AdminSidebar: React.FC<AdminSidebarProps> = ({
  activeTab,
  setActiveTab,
  pendingQuotationsCount,
  pendingContractsCount,
  pendingInvoicesCount,
  mobileSidebarOpen,
  onCloseMobileSidebar,
  isCollapsed,
  onToggleCollapse,
}) => {
  const navItems = [
    { id: 'dashboard' as AdminTab, label: 'Dashboard', icon: LayoutDashboard, badge: 0 },
    { id: 'clients' as AdminTab, label: 'Clientes', icon: Users, badge: 0 },
    { id: 'projects' as AdminTab, label: 'Projectos', icon: FolderKanban, badge: 0 },
    { id: 'quotations' as AdminTab, label: 'Orçamentos', icon: BadgeDollarSign, badge: pendingQuotationsCount },
    { id: 'contracts' as AdminTab, label: 'Contratos', icon: FileText, badge: pendingContractsCount },
    { id: 'meetings' as AdminTab, label: 'Agendamentos', icon: CalendarDays, badge: 0 },
    { id: 'finance' as AdminTab, label: 'Financeiro', icon: Wallet, badge: pendingInvoicesCount },
  ];

  const handleSelect = (tab: AdminTab) => {
    setActiveTab(tab);
    onCloseMobileSidebar();
  };

  const renderNav = (collapsed: boolean) => (
    <nav className="space-y-1">
      {navItems.map((item) => {
        const isActive = activeTab === item.id;
        return (
          <button
            key={item.id}
            onClick={() => handleSelect(item.id)}
            title={item.label}
            className={`w-full flex items-center rounded-xl text-sm font-semibold transition-colors cursor-pointer relative ${
              collapsed ? 'justify-center px-0 py-2.5' : 'justify-between px-3.5 py-2.5'
            } ${
              isActive
                ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <span className={`flex items-center ${collapsed ? '' : 'gap-3'}`}>
              <item.icon className="w-[18px] h-[18px]" />
              {!collapsed && <span>{item.label}</span>}
            </span>
            {!collapsed && item.badge > 0 && (
              <span
                className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                  isActive ? 'bg-white/20 text-white' : 'bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-400'
                }`}
              >
                {item.badge}
              </span>
            )}
            {collapsed && item.badge > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-amber-500" />
            )}
          </button>
        );
      })}
    </nav>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside
        className={`hidden lg:block fixed left-0 top-[93px] bottom-0 border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-y-auto transition-all duration-300 ${
          isCollapsed ? 'w-[72px] px-3 py-6' : 'w-60 px-4 py-6'
        }`}
      >
        <div className={`flex items-center pb-3 ${isCollapsed ? 'justify-center' : 'justify-between px-3.5'}`}>
          {!isCollapsed && (
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Gestão Learn Code
            </p>
          )}
          <button
            onClick={onToggleCollapse}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            title={isCollapsed ? 'Expandir menu' : 'Minimizar menu'}
          >
            {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>
        {renderNav(isCollapsed)}
      </aside>

      {/* Mobile drawer */}
      {mobileSidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-50">
          <div className="absolute inset-0 bg-slate-950/60" onClick={onCloseMobileSidebar} />
          <div className="absolute left-0 top-0 bottom-0 w-72 bg-white dark:bg-slate-900 p-5 shadow-2xl animate-in slide-in-from-left duration-200">
            <div className="flex items-center justify-between mb-6">
              <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Gestão Learn Code</p>
              <button
                onClick={onCloseMobileSidebar}
                className="p-2 rounded-xl text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            {renderNav(false)}
          </div>
        </div>
      )}
    </>
  );
};
