import React from 'react';
import { Calendar, User } from 'lucide-react';
import { Project } from '../../../types';

interface AdminProjectsViewProps {
  projects: Project[];
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

export const AdminProjectsView: React.FC<AdminProjectsViewProps> = ({
  projects,
  onUpdateProjectStatus,
  onUpdateProjectProgress,
}) => {
  return (
    <div className="space-y-5 animate-in fade-in duration-300">
      <div>
        <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">Gestão de Projectos</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Actualiza o estado e o progresso — o cliente vê as alterações no portal dele em tempo real.
        </p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        {projects.map((project) => (
          <div
            key={project.id}
            className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4"
          >
            {/* Header */}
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-[10px] font-mono font-bold text-slate-400 uppercase">{project.id} · {project.category}</p>
                <h3 className="text-base font-extrabold text-slate-900 dark:text-white leading-snug mt-0.5">
                  {project.name}
                </h3>
              </div>
              <span className={`shrink-0 px-2.5 py-1 rounded-full text-[10px] font-bold border ${STATUS_STYLES[project.status]}`}>
                {project.status}
              </span>
            </div>

            {/* Meta */}
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

            {/* Progress control */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-700 dark:text-slate-300">Progresso</span>
                <span className="font-black text-blue-600 dark:text-blue-400">{project.progress}%</span>
              </div>
              <input
                type="range"
                min={0}
                max={100}
                step={5}
                value={project.progress}
                onChange={(e) => onUpdateProjectProgress(project.id, Number(e.target.value))}
                className="w-full accent-blue-600 cursor-pointer"
                aria-label={`Progresso de ${project.name}`}
              />
              <div className="w-full h-1.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                <div
                  className="h-full rounded-full bg-blue-600 transition-all duration-300"
                  style={{ width: `${project.progress}%` }}
                />
              </div>
            </div>

            {/* Status select */}
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
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </div>

            {/* Tasks summary */}
            <p className="text-[11px] text-slate-500 dark:text-slate-400 pt-1 border-t border-slate-100 dark:border-slate-800">
              {project.tasks.filter((t) => t.status === 'completed').length} de {project.tasks.length} tarefas concluídas ·{' '}
              {project.milestones.filter((m) => m.completed).length} de {project.milestones.length} milestones
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};
