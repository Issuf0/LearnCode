import React from 'react';
import { Bell, CheckCircle2, FileText, MessageSquare, FolderKanban, BadgeDollarSign, Check } from 'lucide-react';
import { PortalNotification, PortalTab } from '../../../types';

interface NotificationsViewProps {
  notifications: PortalNotification[];
  onMarkAllAsRead: () => void;
  setActiveTab: (tab: PortalTab) => void;
}

export const NotificationsView: React.FC<NotificationsViewProps> = ({
  notifications,
  onMarkAllAsRead,
  setActiveTab
}) => {
  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2.5">
            <Bell className="w-7 h-7 text-blue-600 dark:text-blue-400" />
            <span>Centro de Notificações</span>
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Mantenha-se informado sobre alterações de estado, aprovações e alertas de conta.
          </p>
        </div>

        <button
          onClick={onMarkAllAsRead}
          className="px-4 py-2 rounded-xl text-xs font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 hover:bg-blue-100 transition-colors flex items-center gap-1.5 cursor-pointer"
        >
          <Check className="w-4 h-4" />
          <span>Marcar todas como lidas</span>
        </button>
      </div>

      {/* List */}
      <div className="space-y-3">
        {notifications.map((n) => (
          <div
            key={n.id}
            onClick={() => {
              if (n.targetTab) setActiveTab(n.targetTab);
            }}
            className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-start gap-4 ${
              !n.read
                ? 'bg-blue-50/60 dark:bg-blue-950/40 border-blue-200 dark:border-blue-800'
                : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 opacity-80'
            }`}
          >
            <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0">
              <Bell className="w-5 h-5" />
            </div>

            <div className="flex-1 space-y-1">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold text-slate-900 dark:text-white">{n.title}</h3>
                <span className="text-[10px] text-slate-400 font-mono">{n.date}</span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300">{n.message}</p>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};
