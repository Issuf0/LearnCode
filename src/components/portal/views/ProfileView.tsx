import React, { useState } from 'react';
import {
  User,
  Building,
  Mail,
  Phone,
  MapPin,
  Lock,
  ShieldCheck,
  Smartphone,
  Save,
  CheckCircle2,
  KeyRound,
  Globe,
  Bell
} from 'lucide-react';
import { ClientProfile } from '../../../types';

interface ProfileViewProps {
  profile: ClientProfile;
  onUpdateProfile: (updated: ClientProfile) => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({ profile, onUpdateProfile }) => {
  const [formData, setFormData] = useState<ClientProfile>(profile);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [show2FAModal, setShow2FAModal] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateProfile(formData);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Header */}
      <div className="pb-4 border-b border-slate-200 dark:border-slate-800">
        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2.5">
          <User className="w-7 h-7 text-blue-600 dark:text-blue-400" />
          <span>Perfil & Definições da Conta</span>
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Gerencie os seus dados empresariais, preferências de notificação e segurança de acesso.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Profile Card & Avatar */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6 text-center">
          <div className="relative inline-block">
            <img
              src={formData.avatarUrl}
              alt={formData.name}
              className="w-24 h-24 rounded-3xl object-cover ring-4 ring-blue-600/30 mx-auto shadow-xl"
            />
            <span className="absolute bottom-0 right-0 w-5 h-5 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-slate-900" />
          </div>

          <div>
            <h2 className="text-lg font-extrabold text-slate-900 dark:text-white">{formData.name}</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">{formData.company}</p>
            <div className="mt-2 inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 text-[10px] font-bold">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Cliente Verificado desde {formData.joinedDate}</span>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 text-left text-xs space-y-2">
            <p className="font-bold text-slate-900 dark:text-white">Segurança da Conta:</p>
            <div className="flex items-center justify-between">
              <span>Autenticação 2FA:</span>
              <span className={`font-bold ${formData.is2FAEnabled ? 'text-emerald-600' : 'text-slate-400'}`}>
                {formData.is2FAEnabled ? 'Ativada' : 'Desativada'}
              </span>
            </div>
          </div>
        </div>

        {/* Profile Edit Form */}
        <div className="lg:col-span-2 space-y-6">
          <form onSubmit={handleSubmit} className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
            <h3 className="text-sm font-extrabold text-slate-900 dark:text-white uppercase tracking-wider">
              Informação Pessoal & Empresa
            </h3>

            {saveSuccess && (
              <div className="p-3.5 rounded-2xl bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-200 text-xs font-bold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Perfil actualizado com sucesso!</span>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="space-y-1.5">
                <label className="font-semibold text-slate-700 dark:text-slate-300">Nome Completo</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-slate-700 dark:text-slate-300">Empresa / Instituição</label>
                <input
                  type="text"
                  value={formData.company}
                  onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-slate-700 dark:text-slate-300">Email Corporativo</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-slate-700 dark:text-slate-300">Telefone / WhatsApp</label>
                <input
                  type="text"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="sm:col-span-2 space-y-1.5">
                <label className="font-semibold text-slate-700 dark:text-slate-300">Endereço Físico</label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex justify-end">
              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl font-bold text-xs text-white bg-blue-600 hover:bg-blue-700 shadow-md flex items-center gap-2 cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>Guardar Alterações</span>
              </button>
            </div>
          </form>

          {/* Change Password & 2FA */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4 text-xs">
            <h3 className="text-sm font-extrabold text-slate-900 dark:text-white uppercase tracking-wider">
              Segurança & Senhas
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="font-semibold text-slate-700 dark:text-slate-300">Senha Actual</label>
                <input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-slate-700 dark:text-slate-300">Nova Senha</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none"
                />
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <button
                type="button"
                onClick={() => alert('Palavra-passe actualizada!')}
                className="px-4 py-2 rounded-xl font-bold text-xs bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 cursor-pointer"
              >
                Actualizar Senha
              </button>

              <button
                type="button"
                onClick={() => {
                  setFormData({ ...formData, is2FAEnabled: !formData.is2FAEnabled });
                  alert(formData.is2FAEnabled ? '2FA Desativado' : '2FA Ativado com sucesso!');
                }}
                className="px-4 py-2 rounded-xl font-bold text-xs text-blue-600 bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 cursor-pointer"
              >
                {formData.is2FAEnabled ? 'Desativar 2FA' : 'Ativar 2FA'}
              </button>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
