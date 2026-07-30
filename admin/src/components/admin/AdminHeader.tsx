import React from 'react';
import { Sun, Moon, Menu, LogOut, ShieldCheck, ExternalLink } from 'lucide-react';
import { avatarFor } from '../../api';
import logoIcon from '../../assets/images/learncode-icon.png';

interface AdminHeaderProps {
  adminName: string;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
  onSwitchToPublicSite: () => void;
  onLogout: () => void;
  onToggleMobileSidebar: () => void;
}

export const AdminHeader: React.FC<AdminHeaderProps> = ({
  adminName,
  isDarkMode,
  onToggleDarkMode,
  onSwitchToPublicSite,
  onLogout,
  onToggleMobileSidebar,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800">
      <div className="px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Left: menu + brand */}
        <div className="flex items-center gap-3">
          <button
            onClick={onToggleMobileSidebar}
            className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 lg:hidden"
            aria-label="Abrir menu"
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
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" />
                  Admin
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right: actions + profile */}
        <div className="flex items-center gap-2">
          <button
            onClick={onSwitchToPublicSite}
            className="p-2.5 rounded-xl text-slate-500 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            title="Ver site institucional"
          >
            <ExternalLink className="w-[18px] h-[18px]" />
          </button>

          <button
            onClick={onToggleDarkMode}
            className="p-2.5 rounded-xl text-slate-500 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            title={isDarkMode ? 'Modo claro' : 'Modo escuro'}
          >
            {isDarkMode ? <Sun className="w-[18px] h-[18px]" /> : <Moon className="w-[18px] h-[18px]" />}
          </button>

          <button
            onClick={onLogout}
            className="p-2.5 rounded-xl text-slate-500 dark:text-slate-300 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950 transition-colors cursor-pointer"
            title="Terminar sessão"
          >
            <LogOut className="w-[18px] h-[18px]" />
          </button>

          <div className="flex items-center gap-2.5 pl-2 ml-1 border-l border-slate-200 dark:border-slate-800">
            <img src={avatarFor(adminName)} alt={adminName} className="w-8 h-8 rounded-xl object-cover" />
            <div className="hidden md:block">
              <p className="text-xs font-bold text-slate-900 dark:text-white leading-tight">{adminName}</p>
              <p className="text-[10px] text-slate-500 dark:text-slate-400">Administrador</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
