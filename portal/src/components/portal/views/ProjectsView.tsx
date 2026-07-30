import React, { useState } from 'react';
import {
  FolderKanban,
  Search,
  Filter,
  PlusCircle,
  Calendar,
  User,
  ArrowRight,
  CheckCircle2,
  Clock,
  Layers,
  ChevronRight
} from 'lucide-react';
import { Project } from '../../../types';

interface ProjectsViewProps {
  projects: Project[];
  onSelectProject: (projectId: string) => void;
  onOpenNewProjectWizard: () => void;
}

export const ProjectsView: React.FC<ProjectsViewProps> = ({
  projects,
  onSelectProject,
  onOpenNewProjectWizard
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const filteredProjects = projects.filter((prj) => {
    const matchesSearch = prj.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      prj.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || prj.status.toLowerCase() === statusFilter.toLowerCase();
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2.5">
            <FolderKanban className="w-7 h-7 text-blue-600 dark:text-blue-400" />
            <span>Meus Projectos</span>
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Acompanhe o estado de desenvolvimento, tarefas, prazos e entregáveis técnicos.
          </p>
        </div>

        <button
          onClick={onOpenNewProjectWizard}
          className="px-5 py-2.5 rounded-xl font-bold text-xs text-white bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-600/20 transition-all flex items-center gap-2 cursor-pointer shrink-0"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Solicitar Novo Projecto</span>
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        {/* Search */}
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3.5 top-2.5 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Pesquisar por nome ou tecnologia..."
            className="w-full pl-9 pr-4 py-2 rounded-xl text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 transition-colors"
          />
        </div>

        {/* Status Filters */}
        <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
          {[
            { id: 'all', label: 'Todos' },
            { id: 'Em Desenvolvimento', label: 'Em Desenvolvimento' },
            { id: 'Planeamento', label: 'Planeamento' },
            { id: 'Concluído', label: 'Concluído' },
          ].map((st) => (
            <button
              key={st.id}
              onClick={() => setStatusFilter(st.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                statusFilter === st.id
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              {st.label}
            </button>
          ))}
        </div>
      </div>

      {/* Projects Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProjects.map((prj) => (
          <div
            key={prj.id}
            onClick={() => onSelectProject(prj.id)}
            className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-xl hover:border-blue-500/80 transition-all cursor-pointer flex flex-col justify-between group space-y-4"
          >
            <div className="space-y-3">
              <div className="flex items-start justify-between gap-3">
                <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                  {prj.category}
                </span>

                <span
                  className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${
                    prj.status === 'Concluído'
                      ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400'
                      : prj.status === 'Em Desenvolvimento'
                      ? 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-400'
                      : 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-400'
                  }`}
                >
                  {prj.status}
                </span>
              </div>

              <div>
                <h3 className="text-base font-extrabold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors leading-snug">
                  {prj.name}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mt-1">
                  {prj.description}
                </p>
              </div>

              {/* Progress Bar */}
              <div className="space-y-1 pt-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-500 font-medium">Progresso Técnico</span>
                  <span className="font-extrabold text-blue-600 dark:text-blue-400">{prj.progress}%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                  <div
                    className="h-full bg-blue-600 rounded-full transition-all duration-500"
                    style={{ width: `${prj.progress}%` }}
                  />
                </div>
              </div>

              {/* Tech Stack Tags */}
              <div className="flex flex-wrap gap-1 pt-1">
                {prj.techStack.map((tech, idx) => (
                  <span
                    key={idx}
                    className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-mono text-[10px]"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            {/* Footer Details */}
            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
              <div className="flex items-center gap-2">
                <img
                  src={prj.projectManager.avatar}
                  alt={prj.projectManager.name}
                  className="w-6 h-6 rounded-lg object-cover"
                />
                <span className="text-[11px] font-medium truncate max-w-[100px]">{prj.projectManager.name}</span>
              </div>

              <div className="flex items-center gap-1 font-bold text-blue-600 dark:text-blue-400 group-hover:translate-x-1 transition-transform">
                <span>Detalhes</span>
                <ChevronRight className="w-4 h-4" />
              </div>
            </div>

          </div>
        ))}
      </div>

    </div>
  );
};
