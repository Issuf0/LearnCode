import React, { useState } from 'react';
import {
  Sun,
  Moon,
  Bell,
  Search,
  User,
  LogOut,
  ExternalLink,
  ChevronDown,
  Menu,
  X,
  ShieldCheck,
  Building,
  Plus
} from 'lucide-react';
import { ClientProfile, PortalNotification, PortalTab } from '../../types';
import logoIcon from '../../assets/images/learncode-icon.png';

interface PortalHeaderProps {
  profile: ClientProfile;
  notifications: PortalNotification[];
  activeTab: PortalTab;
  setActiveTab: (tab: PortalTab) => void;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
  onOpenNewProjectWizard: () => void;
  onSwitchToPublicSite: () => void;
  onOpenAuthModal: () => void;
  onToggleMobileSidebar: () => void;
}

export const PortalHeader: React.FC<PortalHeaderProps> = ({
  profile,
  notifications,
  activeTab,
  setActiveTab,
  isDarkMode,
  onToggleDarkMode,
  onOpenNewProjectWizard,
  onSwitchToPublicSite,
  onOpenAuthModal,
  onToggleMobileSidebar
}) => {
  const [showNotificationsDropdown, setShowNotificationsDropdown] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);

  const unreadNotificationsCount = notifications.filter((n) => !n.read).length;

  return (
    <header className="sticky top-0 z-30 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        
        {/* Left Section: Mobile Menu Button + Brand Logo */}
        <div className="flex items-center gap-3">
          <button
            onClick={onToggleMobileSidebar}
            className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 lg:hidden focus:outline-none"
            aria-label="Toggle Navigation"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2.5">
            <img src={logoIcon} alt="Learn Code" className="h-8 w-auto" />
            <div className="hidden sm:block">
              <div className="flex items-center gap-1.5">
                <span className="font-black text-lg tracking-tight text-[#1a9cd8]">
                  Learn <span className="font-light text-[#29b6e8]">Code</span>
                </span>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800">
                  Portal do Cliente
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Center: Quick Search Bar */}
        <div className="hidden md:flex items-center flex-1 max-w-xs lg:max-w-md mx-4">
          <div className="relative w-full">
            <Search className="absolute left-3.5 top-2.5 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Pesquisar projectos, contratos, faturas..."
              className="w-full pl-9 pr-4 py-2 rounded-xl text-xs bg-slate-100 dark:bg-slate-800/80 border border-transparent focus:border-blue-500 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none transition-all"
            />
          </div>
        </div>

        {/* Right Section: Actions & Profile */}
        <div className="flex items-center gap-2 sm:gap-3">
          
          {/* Quick "+ Solicitar Projecto" CTA */}
          <button
            onClick={onOpenNewProjectWizard}
            className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-md shadow-blue-600/20 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Solicitar Projecto</span>
          </button>

          {/* Dark / Light Mode Toggle */}
          <button
            onClick={onToggleDarkMode}
            className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            title={isDarkMode ? 'Alternar para Modo Claro' : 'Alternar para Modo Escuro'}
          >
            {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
          </button>

          {/* Notifications Dropdown Toggle */}
          <div className="relative">
            <button
              onClick={() => {
                setShowNotificationsDropdown(!showNotificationsDropdown);
                setShowProfileDropdown(false);
              }}
              className="relative p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              title="Notificações"
            >
              <Bell className="w-4 h-4" />
              {unreadNotificationsCount > 0 && (
                <span className="absolute top-1 right-1 w-2.5 h-2.5 rounded-full bg-rose-500 ring-2 ring-white dark:ring-slate-900 animate-pulse" />
              )}
            </button>

            {/* Notifications Dropdown Panel */}
            {showNotificationsDropdown && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl p-4 z-50 animate-in fade-in zoom-in-95 duration-150">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-2">
                    <Bell className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                    <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                      Notificações ({unreadNotificationsCount})
                    </h3>
                  </div>
                  <button
                    onClick={() => {
                      setActiveTab('notifications');
                      setShowNotificationsDropdown(false);
                    }}
                    className="text-[11px] text-blue-600 dark:text-blue-400 font-semibold hover:underline"
                  >
                    Ver todas
                  </button>
                </div>

                <div className="divide-y divide-slate-100 dark:divide-slate-800 max-h-64 overflow-y-auto my-2">
                  {notifications.slice(0, 4).map((n) => (
                    <div
                      key={n.id}
                      onClick={() => {
                        if (n.targetTab) setActiveTab(n.targetTab);
                        setShowNotificationsDropdown(false);
                      }}
                      className={`p-2.5 rounded-xl text-xs space-y-1 hover:bg-slate-50 dark:hover:bg-slate-800/60 cursor-pointer transition-colors ${
                        !n.read ? 'font-semibold' : 'text-slate-600 dark:text-slate-400'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-slate-900 dark:text-white font-medium">{n.title}</span>
                        <span className="text-[10px] text-slate-400">{n.date}</span>
                      </div>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2">{n.message}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Client Profile Dropdown */}
          <div className="relative">
            <button
              onClick={() => {
                setShowProfileDropdown(!showProfileDropdown);
                setShowNotificationsDropdown(false);
              }}
              className="flex items-center gap-2.5 p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer border border-transparent hover:border-slate-200 dark:hover:border-slate-700"
            >
              <img
                src={profile.avatarUrl}
                alt={profile.name}
                className="w-8 h-8 rounded-lg object-cover ring-2 ring-blue-600/30"
              />
              <div className="hidden lg:block text-left">
                <p className="text-xs font-bold text-slate-900 dark:text-white leading-tight">{profile.name}</p>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate max-w-[120px]">{profile.company}</p>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden lg:block" />
            </button>

            {/* Profile Dropdown Panel */}
            {showProfileDropdown && (
              <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl p-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl mb-1">
                  <p className="text-xs font-bold text-slate-900 dark:text-white">{profile.name}</p>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">{profile.email}</p>
                  <div className="mt-1.5 inline-flex items-center gap-1 px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 text-[10px] font-bold">
                    <ShieldCheck className="w-3 h-3" />
                    <span>Conta Verificada</span>
                  </div>
                </div>

                <div className="space-y-0.5 text-xs text-slate-700 dark:text-slate-300">
                  <button
                    onClick={() => {
                      setActiveTab('profile');
                      setShowProfileDropdown(false);
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-left transition-colors cursor-pointer"
                  >
                    <User className="w-4 h-4 text-blue-500" />
                    <span>Meu Perfil & Segurança</span>
                  </button>

                  <button
                    onClick={() => {
                      onSwitchToPublicSite();
                      setShowProfileDropdown(false);
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-left transition-colors cursor-pointer text-slate-600 dark:text-slate-400"
                  >
                    <ExternalLink className="w-4 h-4" />
                    <span>Ver Site Institucional</span>
                  </button>

                  <div className="border-t border-slate-100 dark:border-slate-800 my-1" />

                  <button
                    onClick={() => {
                      setShowProfileDropdown(false);
                      onOpenAuthModal();
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-rose-50 dark:hover:bg-rose-950/40 text-rose-600 dark:text-rose-400 text-left transition-colors cursor-pointer font-medium"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Terminar Sessão</span>
                  </button>
                </div>
              </div>
            )}
          </div>

        </div>

      </div>
    </header>
  );
};
