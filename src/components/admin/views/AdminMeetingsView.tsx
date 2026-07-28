import React, { useState } from 'react';
import { Plus, X, CalendarDays, Video, Clock, CheckCircle2, Ban } from 'lucide-react';
import { Meeting } from '../../../types';

interface AdminMeetingsViewProps {
  meetings: Meeting[];
  onCreateMeeting: (meeting: Meeting) => void;
  onUpdateMeetingStatus: (meetingId: string, status: Meeting['status']) => void;
}

const STATUS_STYLES: Record<Meeting['status'], string> = {
  Agendada: 'bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-800',
  Concluída: 'bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800',
  Cancelada: 'bg-rose-50 dark:bg-rose-950 text-rose-700 dark:text-rose-400 border-rose-200 dark:border-rose-800',
};

const EMPTY_FORM = { title: '', clientName: '', projectName: '', date: '', time: '', meetLink: '' };

export const AdminMeetingsView: React.FC<AdminMeetingsViewProps> = ({
  meetings,
  onCreateMeeting,
  onUpdateMeetingStatus,
}) => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title || !form.clientName || !form.date || !form.time) return;

    onCreateMeeting({
      id: `meet-${Date.now()}`,
      title: form.title,
      clientName: form.clientName,
      projectName: form.projectName || '—',
      date: form.date,
      time: form.time,
      meetLink: form.meetLink || 'https://meet.google.com',
      status: 'Agendada',
    });
    setForm(EMPTY_FORM);
    setIsFormOpen(false);
  };

  const FORM_FIELDS = [
    { key: 'title', label: 'Assunto da Reunião', placeholder: 'Ex: Revisão do protótipo', required: true },
    { key: 'clientName', label: 'Cliente', placeholder: 'Ex: João Mabunda', required: true },
    { key: 'projectName', label: 'Projecto', placeholder: 'Ex: Portal Corporativo', required: false },
    { key: 'date', label: 'Data', placeholder: 'Ex: 05 Aug 2026', required: true },
    { key: 'time', label: 'Hora', placeholder: 'Ex: 14:30', required: true },
    { key: 'meetLink', label: 'Link do Google Meet', placeholder: 'https://meet.google.com/...', required: false },
  ];

  return (
    <div className="space-y-5 animate-in fade-in duration-300">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">Agendamentos</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Cria a reunião, cola o link do Meet e o cliente vê tudo no portal dele.
          </p>
        </div>
        <button
          onClick={() => setIsFormOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-500 shadow-md shadow-blue-600/20 transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Nova Reunião</span>
        </button>
      </div>

      <div className="space-y-3">
        {meetings.map((meeting) => (
          <div
            key={meeting.id}
            className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col lg:flex-row lg:items-center justify-between gap-4"
          >
            <div className="flex items-start gap-3.5">
              <div className="w-11 h-11 rounded-xl bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
                <CalendarDays className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm font-extrabold text-slate-900 dark:text-white leading-snug">{meeting.title}</p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                  {meeting.clientName} · {meeting.projectName}
                </p>
                <p className="text-xs text-slate-700 dark:text-slate-300 font-semibold mt-1 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                  {meeting.date} às {meeting.time}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2 shrink-0">
              <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${STATUS_STYLES[meeting.status]}`}>
                {meeting.status}
              </span>

              {meeting.status === 'Agendada' && (
                <>
                  <a
                    href={meeting.meetLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-[11px] font-bold text-white bg-blue-600 hover:bg-blue-500 shadow-sm transition-all cursor-pointer"
                  >
                    <Video className="w-3.5 h-3.5" />
                    <span>Entrar</span>
                  </a>
                  <button
                    onClick={() => onUpdateMeetingStatus(meeting.id, 'Concluída')}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-[11px] font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950 border border-emerald-200 dark:border-emerald-800 hover:bg-emerald-100 transition-all cursor-pointer"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Concluir</span>
                  </button>
                  <button
                    onClick={() => onUpdateMeetingStatus(meeting.id, 'Cancelada')}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-[11px] font-bold text-rose-700 dark:text-rose-400 bg-rose-50 dark:bg-rose-950 border border-rose-200 dark:border-rose-800 hover:bg-rose-100 transition-all cursor-pointer"
                  >
                    <Ban className="w-3.5 h-3.5" />
                    <span>Cancelar</span>
                  </button>
                </>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Create Meeting Modal */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl p-6 relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setIsFormOpen(false)}
              className="absolute top-4 right-4 p-2 rounded-xl text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <X className="w-4 h-4" />
            </button>

            <h3 className="text-lg font-extrabold text-slate-900 dark:text-white mb-4">Nova Reunião</h3>

            <form onSubmit={handleSubmit} className="space-y-3">
              {FORM_FIELDS.map((field) => (
                <div key={field.key} className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">{field.label}</label>
                  <input
                    type="text"
                    required={field.required}
                    placeholder={field.placeholder}
                    value={form[field.key as keyof typeof form]}
                    onChange={(e) => setForm((prev) => ({ ...prev, [field.key]: e.target.value }))}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 transition-colors"
                  />
                </div>
              ))}

              <button
                type="submit"
                className="w-full mt-2 py-3 rounded-xl font-bold text-sm text-white bg-blue-600 hover:bg-blue-500 shadow-md shadow-blue-600/20 transition-all cursor-pointer"
              >
                Agendar e Notificar Cliente
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
