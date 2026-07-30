import React, { useState } from 'react';
import { Mail, Lock, ArrowRight, MessageSquare, AlertCircle, Eye, EyeOff, Globe } from 'lucide-react';
import { api, ApiUser } from '../api';
import { COMPANY_INFO } from '../data/mockData';
import logoIcon from '../assets/images/learncode-icon.png';

const SITE_URL = (import.meta.env.VITE_SITE_URL as string | undefined) ?? 'http://localhost:3000';

interface LoginPageProps {
  subtitle: string;
  onLoginSuccess: (user: ApiUser) => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ subtitle, onLoginSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setIsSubmitting(true);
    try {
      const user = await api.login(email.trim(), password);
      onLoginSuccess(user);
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Não foi possível iniciar sessão.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-slate-50 dark:bg-slate-950">
      <div className="w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-xl p-6 sm:p-8">
        <div className="text-center space-y-2 mb-6">
          <img src={logoIcon} alt="Learn Code" className="h-12 w-auto mx-auto mb-1" />
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Learn Code
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">{subtitle}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Email</label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
              <input
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 transition-colors"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Palavra-passe</label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-11 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-blue-500 transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-3 top-2.5 p-0.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors cursor-pointer"
                aria-label={showPassword ? 'Ocultar palavra-passe' : 'Mostrar palavra-passe'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {errorMsg && (
            <p className="text-xs text-rose-600 font-medium flex items-center gap-1.5">
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
              {errorMsg}
            </p>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 px-4 rounded-xl font-bold text-sm text-white bg-blue-600 hover:bg-blue-500 shadow-lg shadow-blue-600/20 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {isSubmitting ? (
              <span>A autenticar...</span>
            ) : (
              <>
                <span>Entrar</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>

          <a
            href={`https://wa.me/${COMPANY_INFO.whatsappNumber.replace(/[^0-9]/g, '')}?text=${encodeURIComponent('Olá Learn Code! Preciso de ajuda com o acesso.')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full flex items-center justify-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400 hover:text-emerald-600 transition-colors pt-1"
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Esqueceu a senha? Fale connosco no WhatsApp</span>
          </a>

          <a
            href={SITE_URL}
            className="w-full flex items-center justify-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400 hover:text-blue-600 transition-colors"
          >
            <Globe className="w-3.5 h-3.5" />
            <span>Voltar ao site learncode</span>
          </a>

          <p className="text-center text-[11px] text-slate-400 dark:text-slate-500 pt-1">
            Ligação segura · Learn Code Moçambique
          </p>
        </form>
      </div>
    </div>
  );
};
