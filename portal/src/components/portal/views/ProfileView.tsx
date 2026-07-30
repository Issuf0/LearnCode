import React, { useState } from 'react';
import { UserRound, Lock, LogOut, Building, Mail, Phone, AlertCircle, CheckCircle2 } from 'lucide-react';
import { ClientProfile } from '../../../types';
import { COMPANY_INFO } from '../../../data/mockData';

interface ProfileViewProps {
  profile: ClientProfile;
  onChangePassword: (currentPassword: string, newPassword: string) => Promise<void>;
  onLogout: () => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({ profile, onChangePassword, onLogout }) => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [feedback, setFeedback] = useState<{ type: 'ok' | 'error'; text: string } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFeedback(null);
    if (newPassword.length < 6) {
      setFeedback({ type: 'error', text: 'A nova palavra-passe deve ter pelo menos 6 caracteres.' });
      return;
    }
    if (newPassword !== confirmPassword) {
      setFeedback({ type: 'error', text: 'A confirmação não coincide com a nova palavra-passe.' });
      return;
    }
    setIsSubmitting(true);
    try {
      await onChangePassword(currentPassword, newPassword);
      setFeedback({ type: 'ok', text: 'Palavra-passe alterada com sucesso.' });
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      setFeedback({ type: 'error', text: err instanceof Error ? err.message : 'Não foi possível alterar a palavra-passe.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputClass =
    'w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-blue-500 transition-colors';

  return (
    <div className="space-y-6 animate-in fade-in duration-300 max-w-3xl">
      <div>
        <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">Perfil & Conta</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Os seus dados de acesso ao portal Learn Code.
        </p>
      </div>

      {/* Dados da conta */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="flex items-center gap-4 pb-5 border-b border-slate-100 dark:border-slate-800">
          <img src={profile.avatarUrl} alt={profile.name} className="w-16 h-16 rounded-2xl object-cover" />
          <div>
            <p className="text-lg font-extrabold text-slate-900 dark:text-white">{profile.name}</p>
            <p className="text-xs text-slate-500 dark:text-slate-400">Cliente Learn Code</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-5 text-sm">
          <p className="flex items-center gap-2.5 text-slate-700 dark:text-slate-300">
            <Mail className="w-4 h-4 text-blue-600 shrink-0" />
            {profile.email}
          </p>
          <p className="flex items-center gap-2.5 text-slate-700 dark:text-slate-300">
            <Phone className="w-4 h-4 text-blue-600 shrink-0" />
            {profile.phone || '—'}
          </p>
          <p className="flex items-center gap-2.5 text-slate-700 dark:text-slate-300 sm:col-span-2">
            <Building className="w-4 h-4 text-blue-600 shrink-0" />
            {profile.company || 'Particular'}
          </p>
        </div>

        <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-4">
          Para actualizar o nome, empresa ou contacto,{' '}
          <a
            href={`https://wa.me/${COMPANY_INFO.whatsappNumber.replace(/[^0-9]/g, '')}?text=${encodeURIComponent('Olá! Gostaria de actualizar os meus dados no portal.')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 dark:text-blue-400 font-semibold underline underline-offset-2"
          >
            fale connosco no WhatsApp
          </a>.
        </p>
      </div>

      {/* Alterar palavra-passe */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
        <h2 className="text-sm font-extrabold text-slate-900 dark:text-white flex items-center gap-2 mb-4">
          <Lock className="w-4 h-4 text-blue-600" />
          <span>Alterar Palavra-passe</span>
        </h2>

        <form onSubmit={handleSubmit} className="space-y-3 max-w-md">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Palavra-passe actual</label>
            <input type="password" required autoComplete="current-password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} className={inputClass} />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Nova palavra-passe</label>
            <input type="password" required autoComplete="new-password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className={inputClass} />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Confirmar nova palavra-passe</label>
            <input type="password" required autoComplete="new-password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className={inputClass} />
          </div>

          {feedback && (
            <p className={`text-xs font-medium flex items-center gap-1.5 ${feedback.type === 'ok' ? 'text-emerald-600' : 'text-rose-600'}`}>
              {feedback.type === 'ok' ? <CheckCircle2 className="w-3.5 h-3.5" /> : <AlertCircle className="w-3.5 h-3.5" />}
              {feedback.text}
            </p>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-2.5 rounded-xl font-bold text-xs text-white bg-blue-600 hover:bg-blue-500 shadow-md transition-all cursor-pointer disabled:opacity-50"
          >
            {isSubmitting ? 'A guardar...' : 'Guardar Nova Palavra-passe'}
          </button>
        </form>
      </div>

      {/* Sessão */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <UserRound className="w-5 h-5 text-slate-400" />
          <p className="text-xs text-slate-600 dark:text-slate-400">Sessão iniciada como {profile.email}</p>
        </div>
        <button
          onClick={onLogout}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold text-rose-700 dark:text-rose-400 bg-rose-50 dark:bg-rose-950 border border-rose-200 dark:border-rose-800 hover:bg-rose-100 transition-all cursor-pointer"
        >
          <LogOut className="w-4 h-4" />
          <span>Terminar Sessão</span>
        </button>
      </div>
    </div>
  );
};
