import React, { useState } from 'react';
import { ShieldCheck, Mail, Lock, User, Building, Smartphone, CheckCircle2, ArrowRight, X, KeyRound } from 'lucide-react';
import { ClientProfile } from '../../types';
import logoIcon from '../../assets/images/learncode-icon.png';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (profile: ClientProfile) => void;
  onAdminLoginSuccess?: () => void;
  currentProfile: ClientProfile;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onLoginSuccess, onAdminLoginSuccess, currentProfile }) => {
  const [authMode, setAuthMode] = useState<'login' | 'forgot' | '2fa' | 'success'>('login');
  const [email, setEmail] = useState(currentProfile.email);
  const [password, setPassword] = useState('••••••••••••');
  const [otpCode, setOtpCode] = useState(['', '', '', '', '', '']);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleDemoLogin = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      onLoginSuccess(currentProfile);
      onClose();
    }, 600);
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      if (currentProfile.is2FAEnabled) {
        setAuthMode('2fa');
      } else {
        onLoginSuccess(currentProfile);
        onClose();
      }
    }, 800);
  };

  const handle2FAVerify = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      onLoginSuccess(currentProfile);
      onClose();
    }, 600);
  };

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) value = value[0];
    const newOtp = [...otpCode];
    newOtp[index] = value;
    setOtpCode(newOtp);

    // Auto focus next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      nextInput?.focus();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl overflow-hidden p-6 sm:p-8">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Brand Header */}
        <div className="text-center space-y-2 mb-6">
          <img src={logoIcon} alt="Learn Code" className="h-12 w-auto mx-auto mb-1" />
          <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Portal do Cliente Learn Code
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Acesso reservado a clientes e parceiros autorizados
          </p>
        </div>

        {/* Auth Mode Switch */}
        {authMode === 'login' && (
          <form onSubmit={handleLoginSubmit} className="space-y-4">
            {/* Quick Demo Fill Alert */}
            <div className="p-3.5 rounded-2xl bg-blue-50 dark:bg-blue-950/50 border border-blue-200 dark:border-blue-800/80 flex items-start gap-3">
              <KeyRound className="w-5 h-5 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
              <div className="text-xs text-blue-900 dark:text-blue-200 space-y-1">
                <p className="font-bold">Acesso Rápido de Demonstração:</p>
                <p>Entre imediatamente como <span className="underline font-semibold">João Mabunda (Enterprise MZ)</span>.</p>
                <button
                  type="button"
                  onClick={handleDemoLogin}
                  className="mt-1 font-bold text-blue-700 dark:text-blue-300 hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <span>Entrar como João Mabunda (Cliente)</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
                {onAdminLoginSuccess && (
                  <button
                    type="button"
                    onClick={() => {
                      onAdminLoginSuccess();
                      onClose();
                    }}
                    className="font-bold text-slate-700 dark:text-slate-300 hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <span>Entrar como Albino Mabunda (Administrador)</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>

            {/* Email Field */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Email Corporativo
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 transition-colors"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Palavra-passe
                </label>
                <button
                  type="button"
                  onClick={() => setAuthMode('forgot')}
                  className="text-xs text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
                >
                  Esqueceu a senha?
                </button>
              </div>
              <div className="relative">
                <Lock className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-blue-500 transition-colors"
                />
              </div>
            </div>

            {errorMsg && (
              <p className="text-xs text-rose-500 font-medium">{errorMsg}</p>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 px-4 rounded-xl font-bold text-sm text-white bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-600/20 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isSubmitting ? (
                <span>A autenticar...</span>
              ) : (
                <>
                  <span>Entrar no Portal</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

            <div className="pt-2 text-center">
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Conexão encriptada SSL de 256 bits • Learn Code MZ
              </p>
            </div>
          </form>
        )}

        {/* 2FA OTP Mode */}
        {authMode === '2fa' && (
          <form onSubmit={handle2FAVerify} className="space-y-5 animate-in fade-in duration-200">
            <div className="text-center space-y-1">
              <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950 border border-indigo-200 dark:border-indigo-800 flex items-center justify-center text-indigo-600 dark:text-indigo-400 mx-auto mb-2">
                <KeyRound className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Autenticação de 2 Factores (2FA)</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Digite o código de 6 dígitos gerado pelo seu aplicativo autenticador ou enviado por SMS.
              </p>
            </div>

            <div className="flex justify-center gap-2 my-4">
              {otpCode.map((digit, idx) => (
                <input
                  key={idx}
                  id={`otp-${idx}`}
                  type="text"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleOtpChange(idx, e.target.value)}
                  className="w-11 h-12 text-center text-lg font-bold font-mono rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none focus:border-blue-500 transition-colors"
                />
              ))}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 px-4 rounded-xl font-bold text-sm text-white bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-600/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              {isSubmitting ? 'A verificar...' : 'Confirmar Código'}
            </button>

            <button
              type="button"
              onClick={() => setAuthMode('login')}
              className="w-full text-center text-xs text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 cursor-pointer"
            >
              Voltar ao Login
            </button>
          </form>
        )}

        {/* Forgot Password Mode */}
        {authMode === 'forgot' && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Recuperar Palavra-passe</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Introduza o seu email cadastrado para receber as instruções de redefinição de senha.
            </p>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Email Corporativo</label>
              <input
                type="email"
                placeholder="exemplo@empresa.co.mz"
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
              />
            </div>

            <button
              type="button"
              onClick={() => {
                alert('Email de redefinição enviado com sucesso para ' + email);
                setAuthMode('login');
              }}
              className="w-full py-3 px-4 rounded-xl font-bold text-sm text-white bg-blue-600 hover:bg-blue-700 cursor-pointer"
            >
              Enviar Instruções por Email
            </button>

            <button
              type="button"
              onClick={() => setAuthMode('login')}
              className="w-full text-center text-xs text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 cursor-pointer"
            >
              Voltar ao Login
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
