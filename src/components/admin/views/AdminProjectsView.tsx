import React, { useState } from 'react';
import { Calendar, User, Plus, X } from 'lucide-react';
import { AdminClient, Project } from '../../../types';

interface AdminProjectsViewProps {
  projects: Project[];
  clients: AdminClient[];
  onCreateProject: (payload: {
    clientId: string;
    name: string;
    category?: string;
    description?: string;
    managerName?: string;
    startDate?: string;
    deadline?: string;
  }) => void;
  onUpdateProjectStatus: (projectId: string, status: Project['status']) => void;
  onUpdateProjectProgress: (projectId: string, progress: number) => void;
}

const STATUS_OPTIONS: Project['status'][] = ['Planeamento', 'Em Desenvolvimento', 'Testes', 'Concluído', 'Pausado'];

const STATUS_STYLES: Record<Project['status'], string> = {
  Planeamento: 'bg-sky-50 dark:bg-sky-950 text-sky-700 dark:text-sky-400 border-sky-200 dark:border-sky-800',
  'Em Desenvolvimento': 'bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-800',
  Testes: 'bg-violet-50 dark:bg-violet-950 text-violet-700 dark:text-violet-400 border-violet-200 dark:border-violet-800',
  Concluído: 'bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800',
  Pausado: 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700',
};

const EMPTY_FORM = { clientId: '', name: '', category: '', description: '', managerName: '', startDate: '', deadline: '' };

const ProgressSlider: React.FC<{ project: Project; onCommit: (value: number) => void }> = ({ project, onCommit }) => {
  const [value, setValue] = useState(project.progress);

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between text-xs">
        <span className="font-semibold text-slate-700 dark:text-slate-300">Progresso</span>
        <span className="font-black text-blue-600 dark:text-blue-400">{value}%</span>
      </div>
      <input
        type="range"
        min={0}
        max={100}
        step={5}
        value={value}
        onChange={(e) => setValue(Number(e.target.value))}
        onMouseUp={() => value !== project.progress && onCommit(value)}
        onTouchEnd={() => value !== project.progress && onCommit(value)}
        className="w-full accent-blue-600 cursor-pointer"
        aria-label={`Progresso de ${project.name}`}
      />
      <div className="w-full h-1.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
        <div className="h-full rounded-full bg-blue-600 transition-all duration-300" style={{ width: `${value}%` }} />
      </div>
    </div>
  );
};

export const AdminProjectsView: React.FC<AdminProjectsViewProps> = ({
  projects,
  clients,
  onCreateProject,
  onUpdateProjectStatus,
  onUpdateProjectProgress,
}) => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);

  const clientNameById = Object.fromEntries(clients.map((c) => [c.id, c.name]));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.clientId || !form.name) return;
    onCreateProject({
      clientId: form.clientId,
      name: form.name,
      category: form.category || undefined,
      description: form.description || undefined,
      managerName: form.managerName || undefined,
      startDate: form.startDate || undefined,
      deadline: form.deadline || undefined,
    });
    setForm(EMPTY_FORM);
    setIsFormOpen(false);
  };

  const inputClass =
    'w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 transition-colors';

  return (
    <div className="space-y-5 animate-in fade-in duration-300">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">Gestão de Projectos</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Actualiza o estado e o progresso — o cliente vê tudo no portal dele.
          </p>
        </div>
        <button
          onClick={() => setIsFormOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-500 shadow-md shadow-blue-600/20 transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Novo Projecto</span>
        </button>
      </div>

      {projects.length === 0 && (
        <p className="text-xs text-slate-500 dark:text-slate-400 p-8 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center">
          Ainda sem projectos. Cria o primeiro para um cliente.
        </p>
      )}

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        {projects.map((project) => (
          <div
            key={project.id}
            className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-[10px] font-mono font-bold text-slate-400 uppercase">
                  {clientNameById[project.clientId] ?? '—'} · {project.category}
                </p>
                <h3 className="text-base font-extrabold text-slate-900 dark:text-white leading-snug mt-0.5">
                  {project.name}
                </h3>
              </div>
              <span className={`shrink-0 px-2.5 py-1 rounded-full text-[10px] font-bold border ${STATUS_STYLES[project.status]}`}>
                {project.status}
              </span>
            </div>

            <div className="flex flex-wrap gap-x-4 gap-y-1 text-[11px] text-slate-500 dark:text-slate-400">
              <span className="flex items-center gap-1.5">
                <User className="w-3 h-3" />
                {project.projectManager.name}
              </span>
              <span className="flex items-center gap-1.5">
                <Calendar className="w-3 h-3" />
                {project.startDate} → {project.deadline}
              </span>
            </div>

            <ProgressSlider project={project} onCommit={(value) => onUpdateProjectProgress(project.id, value)} />

            <div className="flex items-center gap-2 pt-1">
              <label className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 shrink-0">
                Alterar estado:
              </label>
              <select
                value={project.status}
                onChange={(e) => onUpdateProjectStatus(project.id, e.target.value as Project['status'])}
                className="flex-1 px-3 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none focus:border-blue-500 cursor-pointer"
              >
                {STATUS_OPTIONS.map((status) => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>
            </div>
          </div>
        ))}
      </div>

      {/* Create Project Modal */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl p-6 relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setIsFormOpen(false)}
              className="absolute top-4 right-4 p-2 rounded-xl text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <X className="w-4 h-4" />
            </button>

            <h3 className="text-lg font-extrabold text-slate-900 dark:text-white mb-4">Novo Projecto</h3>

            <form onSubmit={handleSubmit} className="space-y-3">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Cliente</label>
                <select required value={form.clientId} onChange={(e) => setForm((p) => ({ ...p, clientId: e.target.value }))} className={inputClass}>
                  <option value="">Seleccionar cliente...</option>
                  {clients.map((c) => (
                    <option key={c.id} value={c.id}>{c.name} — {c.company}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Nome do Projecto</label>
                <input required placeholder="Ex: Website Institucional" value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} className={inputClass} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Categoria</label>
                  <input placeholder="Ex: Website" value={form.category} onChange={(e) => setForm((p) => ({ ...p, category: e.target.value }))} className={inputClass} />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Gestor</label>
                  <input placeholder="Ex: Issufo Karimo" value={form.managerName} onChange={(e) => setForm((p) => ({ ...p, managerName: e.target.value }))} className={inputClass} />
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Descrição</label>
                <textarea rows={2} value={form.description} onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))} className={`${inputClass} resize-y`} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Início</label>
                  <input type="date" value={form.startDate} onChange={(e) => setForm((p) => ({ ...p, startDate: e.target.value }))} className={inputClass} />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Prazo</label>
                  <input type="date" value={form.deadline} onChange={(e) => setForm((p) => ({ ...p, deadline: e.target.value }))} className={inputClass} />
                </div>
              </div>

              <button
                type="submit"
                className="w-full mt-2 py-3 rounded-xl font-bold text-sm text-white bg-blue-600 hover:bg-blue-500 shadow-md shadow-blue-600/20 transition-all cursor-pointer"
              >
                Criar Projecto e Notificar Cliente
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
