import React, { useState } from 'react';
import { Search, Plus, Pencil, Trash2, X, Mail, Phone } from 'lucide-react';
import { AdminClient } from '../../../types';
import { formatMzn } from '../../../data/adminMockData';

interface AdminClientsViewProps {
  clients: AdminClient[];
  onSaveClient: (client: AdminClient) => void;
  onDeleteClient: (clientId: string) => void;
}

const EMPTY_FORM = { name: '', company: '', email: '', phone: '' };

const STATUS_STYLES: Record<AdminClient['status'], string> = {
  Activo: 'bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800',
  Pendente: 'bg-amber-50 dark:bg-amber-950 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-800',
  Inactivo: 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700',
};

export const AdminClientsView: React.FC<AdminClientsViewProps> = ({ clients, onSaveClient, onDeleteClient }) => {
  const [search, setSearch] = useState('');
  const [editingClient, setEditingClient] = useState<AdminClient | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);

  const filtered = clients.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.company.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase())
  );

  const openCreate = () => {
    setEditingClient(null);
    setForm(EMPTY_FORM);
    setIsFormOpen(true);
  };

  const openEdit = (client: AdminClient) => {
    setEditingClient(client);
    setForm({ name: client.name, company: client.company, email: client.email, phone: client.phone });
    setIsFormOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email) return;

    if (editingClient) {
      onSaveClient({ ...editingClient, ...form });
    } else {
      onSaveClient({
        id: `cli-${Date.now()}`,
        ...form,
        company: form.company || 'Particular',
        avatarUrl: 'https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=150&auto=format&fit=crop&q=80',
        status: 'Pendente',
        joinedDate: 'Julho 2026',
        totalBilledMzn: 0,
        activeProjects: 0,
      });
    }
    setIsFormOpen(false);
  };

  return (
    <div className="space-y-5 animate-in fade-in duration-300">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">Gestão de Clientes</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{clients.length} clientes registados</p>
        </div>
        <button
          onClick={openCreate}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-500 shadow-md shadow-blue-600/20 transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Novo Cliente</span>
        </button>
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3.5 top-2.5 w-4 h-4 text-slate-400" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Pesquisar por nome, empresa ou email..."
          className="w-full pl-9 pr-4 py-2 rounded-xl text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:border-blue-500 transition-all"
        />
      </div>

      {/* Clients table */}
      <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm overflow-x-auto">
        <table className="w-full text-left min-w-[720px]">
          <thead>
            <tr className="border-b border-slate-100 dark:border-slate-800 text-[10px] uppercase tracking-wider text-slate-400">
              <th className="px-5 py-3.5 font-bold">Cliente</th>
              <th className="px-5 py-3.5 font-bold">Contacto</th>
              <th className="px-5 py-3.5 font-bold">Estado</th>
              <th className="px-5 py-3.5 font-bold text-right">Facturado</th>
              <th className="px-5 py-3.5 font-bold text-center">Projectos</th>
              <th className="px-5 py-3.5 font-bold text-right">Acções</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((client) => (
              <tr key={client.id} className="border-b border-slate-50 dark:border-slate-800/60 last:border-0 hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors">
                <td className="px-5 py-4">
                  <div className="flex items-center gap-3">
                    <img src={client.avatarUrl} alt={client.name} className="w-9 h-9 rounded-xl object-cover" loading="lazy" />
                    <div>
                      <p className="text-sm font-bold text-slate-900 dark:text-white leading-tight">{client.name}</p>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400">{client.company}</p>
                    </div>
                  </div>
                </td>
                <td className="px-5 py-4">
                  <p className="text-xs text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                    <Mail className="w-3 h-3 text-slate-400" />
                    {client.email}
                  </p>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1.5 mt-0.5">
                    <Phone className="w-3 h-3 text-slate-400" />
                    {client.phone}
                  </p>
                </td>
                <td className="px-5 py-4">
                  <span className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-bold border ${STATUS_STYLES[client.status]}`}>
                    {client.status}
                  </span>
                </td>
                <td className="px-5 py-4 text-right text-sm font-bold text-slate-900 dark:text-white">
                  {formatMzn(client.totalBilledMzn)}
                </td>
                <td className="px-5 py-4 text-center text-sm font-semibold text-slate-700 dark:text-slate-300">
                  {client.activeProjects}
                </td>
                <td className="px-5 py-4">
                  <div className="flex items-center justify-end gap-1">
                    <button
                      onClick={() => openEdit(client)}
                      className="p-2 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950 transition-colors cursor-pointer"
                      title="Editar"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => {
                        if (window.confirm(`Eliminar o cliente ${client.name}?`)) onDeleteClient(client.id);
                      }}
                      className="p-2 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950 transition-colors cursor-pointer"
                      title="Eliminar"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={6} className="px-5 py-10 text-center text-xs text-slate-500 dark:text-slate-400">
                  Nenhum cliente encontrado para "{search}".
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Create / Edit Modal */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl p-6 relative">
            <button
              onClick={() => setIsFormOpen(false)}
              className="absolute top-4 right-4 p-2 rounded-xl text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <X className="w-4 h-4" />
            </button>

            <h3 className="text-lg font-extrabold text-slate-900 dark:text-white mb-4">
              {editingClient ? 'Editar Cliente' : 'Novo Cliente'}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-3">
              {[
                { key: 'name', label: 'Nome Completo', type: 'text', required: true },
                { key: 'company', label: 'Empresa / Instituição', type: 'text', required: false },
                { key: 'email', label: 'Email', type: 'email', required: true },
                { key: 'phone', label: 'Telefone / WhatsApp', type: 'text', required: false },
              ].map((field) => (
                <div key={field.key} className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">{field.label}</label>
                  <input
                    type={field.type}
                    required={field.required}
                    value={form[field.key as keyof typeof form]}
                    onChange={(e) => setForm((prev) => ({ ...prev, [field.key]: e.target.value }))}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-blue-500 transition-colors"
                  />
                </div>
              ))}

              <button
                type="submit"
                className="w-full mt-2 py-3 rounded-xl font-bold text-sm text-white bg-blue-600 hover:bg-blue-500 shadow-md shadow-blue-600/20 transition-all cursor-pointer"
              >
                {editingClient ? 'Guardar Alterações' : 'Criar Cliente'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
