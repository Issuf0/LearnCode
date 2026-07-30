import React, { useState } from 'react';
import {
  ArrowLeft,
  Calendar,
  Clock,
  User,
  CheckCircle2,
  Circle,
  MessageSquare,
  Paperclip,
  Send,
  Layers,
  FileText,
  ShieldCheck,
  CheckSquare
} from 'lucide-react';
import { Project, ProjectComment } from '../../../types';

interface ProjectDetailViewProps {
  project: Project | null;
  onBack: () => void;
  onAddComment: (projectId: string, text: string) => void;
  onToggleTask: (projectId: string, taskId: string) => void;
}

export const ProjectDetailView: React.FC<ProjectDetailViewProps> = ({
  project,
  onBack,
  onAddComment,
  onToggleTask
}) => {
  const [commentText, setCommentText] = useState('');
  const [activeSubTab, setActiveSubTab] = useState<'overview' | 'timeline' | 'tasks' | 'comments'>('overview');

  if (!project) return null;

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    onAddComment(project.id, commentText);
    setCommentText('');
  };

  const timelineSteps = [
    { title: 'Planeamento', status: 'completed' },
    { title: 'UI Design', status: 'completed' },
    { title: 'Frontend', status: 'completed' },
    { title: 'Backend', status: project.progress >= 70 ? 'completed' : 'in_progress' },
    { title: 'Testes', status: project.progress >= 90 ? 'in_progress' : 'pending' },
    { title: 'Implantação', status: project.progress === 100 ? 'completed' : 'pending' },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Top Navigation Back */}
      <button
        onClick={onBack}
        className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Voltar aos Meus Projectos</span>
      </button>

      {/* Main Project Header Card */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800">
                {project.category}
              </span>
              <span
                className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${
                  project.status === 'Concluído'
                    ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400'
                    : 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-400'
                }`}
              >
                {project.status}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white leading-tight">
              {project.name}
            </h1>

            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 max-w-3xl leading-relaxed">
              {project.description}
            </p>
          </div>

          {/* Project Manager Profile Badge */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 flex items-center gap-3 shrink-0">
            <img
              src={project.projectManager.avatar}
              alt={project.projectManager.name}
              className="w-11 h-11 rounded-xl object-cover ring-2 ring-blue-600/30"
            />
            <div className="text-xs">
              <p className="text-[10px] text-slate-400 uppercase font-bold">Gestor do Projecto</p>
              <p className="font-bold text-slate-900 dark:text-white">{project.projectManager.name}</p>
              <p className="text-[11px] text-blue-600 dark:text-blue-400">{project.projectManager.role}</p>
            </div>
          </div>
        </div>

        {/* Key Metrics Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 text-xs">
          <div>
            <span className="text-slate-400 block font-medium">Data de Início</span>
            <span className="font-bold text-slate-900 dark:text-white flex items-center gap-1 mt-0.5">
              <Calendar className="w-3.5 h-3.5 text-blue-600" />
              <span>{project.startDate}</span>
            </span>
          </div>

          <div>
            <span className="text-slate-400 block font-medium">Prazo Oficial</span>
            <span className="font-bold text-slate-900 dark:text-white flex items-center gap-1 mt-0.5">
              <Clock className="w-3.5 h-3.5 text-amber-500" />
              <span>{project.deadline}</span>
            </span>
          </div>

          <div>
            <span className="text-slate-400 block font-medium">Entrega Estimada</span>
            <span className="font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1 mt-0.5">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>{project.estimatedDelivery}</span>
            </span>
          </div>

          <div>
            <span className="text-slate-400 block font-medium">Progresso Global</span>
            <span className="font-black text-blue-600 dark:text-blue-400 text-sm">{project.progress}%</span>
          </div>
        </div>

        {/* Global Progress Bar */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs font-bold">
            <span className="text-slate-700 dark:text-slate-300">Progresso Geral de Engenharia</span>
            <span className="text-blue-600 dark:text-blue-400">{project.progress}% Concluído</span>
          </div>
          <div className="w-full h-3 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
            <div
              className="h-full bg-blue-600 rounded-full transition-all duration-500"
              style={{ width: `${project.progress}%` }}
            />
          </div>
        </div>

        {/* Development Timeline Sequence */}
        <div className="pt-2">
          <p className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-3">
            Fluxo de Desenvolvimento Agil
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-6 gap-2">
            {timelineSteps.map((step, idx) => (
              <div
                key={idx}
                className={`p-3 rounded-xl border text-center space-y-1 text-xs font-bold ${
                  step.status === 'completed'
                    ? 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-300 dark:border-emerald-800 text-emerald-700 dark:text-emerald-400'
                    : step.status === 'in_progress'
                    ? 'bg-blue-50 dark:bg-blue-950/60 border-blue-400 dark:border-blue-800 text-blue-700 dark:text-blue-400 animate-pulse'
                    : 'bg-slate-50 dark:bg-slate-800/30 border-slate-200 dark:border-slate-800 text-slate-400'
                }`}
              >
                <div className="flex justify-center">
                  {step.status === 'completed' ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  ) : step.status === 'in_progress' ? (
                    <Clock className="w-4 h-4 text-blue-600" />
                  ) : (
                    <Circle className="w-4 h-4 text-slate-300" />
                  )}
                </div>
                <span>{step.title}</span>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Sub Tabs Switcher */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-1">
        {[
          { id: 'overview', label: 'Visão Geral & Marcos' },
          { id: 'tasks', label: `Tarefas (${project.tasks.length})` },
          { id: 'comments', label: `Comentários & Suporte (${project.comments.length})` },
          { id: 'timeline', label: 'Linha do Tempo' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveSubTab(tab.id as any)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeSubTab === tab.id
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Sub Tab: Overview & Milestones */}
      {activeSubTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Milestones Panel */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <h3 className="text-sm font-extrabold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
              <Layers className="w-4 h-4 text-blue-600" />
              <span>Marcos de Entrega (Milestones)</span>
            </h3>

            <div className="space-y-3">
              {project.milestones.map((m) => (
                <div
                  key={m.id}
                  className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 flex items-center justify-between gap-3 text-xs"
                >
                  <div className="flex items-start gap-2.5">
                    <CheckCircle2 className={`w-4 h-4 mt-0.5 shrink-0 ${m.completed ? 'text-emerald-500' : 'text-slate-300'}`} />
                    <div>
                      <p className={`font-bold ${m.completed ? 'text-slate-900 dark:text-white line-through opacity-80' : 'text-slate-900 dark:text-white'}`}>
                        {m.title}
                      </p>
                      <p className="text-[10px] text-slate-400">Data limite: {m.dueDate}</p>
                    </div>
                  </div>

                  <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                    m.completed ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400' : 'bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-300'
                  }`}>
                    {m.percentage}%
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Updates Panel */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <h3 className="text-sm font-extrabold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
              <span>Actualizações Recentes de Desenvolvimento</span>
            </h3>

            <div className="space-y-3">
              {project.recentUpdates.map((upd, idx) => (
                <div key={idx} className="p-3.5 rounded-2xl bg-blue-50/50 dark:bg-blue-950/40 border border-blue-200/50 dark:border-blue-800/50 text-xs text-blue-950 dark:text-blue-200 space-y-1">
                  <p className="font-medium leading-relaxed">{upd}</p>
                  <p className="text-[10px] text-blue-600/70 dark:text-blue-400/70">Sincronizado pela equipa técnica</p>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* Sub Tab: Tasks List */}
      {activeSubTab === 'tasks' && (
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <h3 className="text-sm font-extrabold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
            <CheckSquare className="w-4 h-4 text-blue-600" />
            <span>Lista de Tarefas Técnicas</span>
          </h3>

          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {project.tasks.map((task) => (
              <div key={task.id} className="py-3 flex items-center justify-between gap-4 text-xs">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={task.status === 'completed'}
                    onChange={() => onToggleTask(project.id, task.id)}
                    className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500 cursor-pointer"
                  />
                  <span className={`font-medium ${task.status === 'completed' ? 'line-through text-slate-400' : 'text-slate-900 dark:text-white'}`}>
                    {task.title}
                  </span>
                </label>

                {task.assignedTo && (
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-500">
                    {task.assignedTo}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Sub Tab: Client Comments Feed */}
      {activeSubTab === 'comments' && (
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
          <h3 className="text-sm font-extrabold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-blue-600" />
            <span>Discussão do Projecto & Feed de Comentários</span>
          </h3>

          {/* Comments Feed */}
          <div className="space-y-4">
            {project.comments.length === 0 ? (
              <p className="text-xs text-slate-400 italic">Sem comentários adicionais até ao momento. Deixe a sua nota abaixo.</p>
            ) : (
              project.comments.map((cmt) => (
                <div
                  key={cmt.id}
                  className={`p-4 rounded-2xl text-xs space-y-2 border ${
                    cmt.isClient
                      ? 'bg-blue-50 dark:bg-blue-950/50 border-blue-200 dark:border-blue-800 text-blue-950 dark:text-blue-100 ml-6'
                      : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white mr-6'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <img src={cmt.authorAvatar} alt={cmt.authorName} className="w-6 h-6 rounded-lg object-cover" />
                      <span className="font-bold">{cmt.authorName}</span>
                      {cmt.isClient && (
                        <span className="text-[9px] font-bold uppercase px-1.5 py-0.5 rounded bg-blue-200 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                          Cliente
                        </span>
                      )}
                    </div>
                    <span className="text-[10px] text-slate-400">{cmt.timestamp}</span>
                  </div>
                  <p className="leading-relaxed">{cmt.text}</p>
                </div>
              ))
            )}
          </div>

          {/* Add Comment Input Form */}
          <form onSubmit={handleCommentSubmit} className="flex gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
            <input
              type="text"
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="Escreva uma nota ou feedback para a equipa da Learn Code..."
              className="flex-1 px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
            />
            <button
              type="submit"
              className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-md"
            >
              <Send className="w-4 h-4" />
              <span>Enviar</span>
            </button>
          </form>

        </div>
      )}

      {/* Sub Tab: Timeline */}
      {activeSubTab === 'timeline' && (
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <h3 className="text-sm font-extrabold text-slate-900 dark:text-white uppercase tracking-wider">
            Linha do Tempo de Actividades
          </h3>

          <div className="space-y-4 relative before:absolute before:left-3 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200 dark:before:bg-slate-800">
            {project.timelineHistory.map((tl) => (
              <div key={tl.id} className="flex items-start gap-3 relative pl-6 text-xs">
                <div className="absolute left-1.5 top-0.5 w-3 h-3 rounded-full bg-blue-600" />
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900 dark:text-white">{tl.title}</span>
                    <span className="text-[10px] font-mono text-slate-400">{tl.date}</span>
                  </div>
                  <p className="text-slate-500 dark:text-slate-400">{tl.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};
