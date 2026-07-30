import React, { useState } from 'react';
import { Plus, X, CalendarDays, Video, Clock, CheckCircle2, Ban } from 'lucide-react';
import { AdminClient, Meeting } from '../../../types';

interface AdminMeetingsViewProps {
  meetings: Meeting[];
  clients: AdminClient[];
  onCreateMeeting: (payload: { clientId: string; title: string; scheduledAt: string; meetLink?: string }) => void;
  onUpdateMeetingStatus: (meetingId: string, status: Meeting['status']) => void;
}

const STATUS_STYLES: Record<Meeting['status'], string> = {
  Agendada: 'bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-800',
  Concluída: 'bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800',
  Cancelada: 'bg-rose-50 dark:bg-rose-950 text-rose-700 dark:text-rose-400 border-rose-200 dark:border-rose-800',
};

const EMPTY_FORM = { clientId: '', title: '', scheduledAt: '', meetLink: '' };

export const AdminMeetingsView: React.FC<AdminMeetingsViewProps> = ({
  meetings,
  clients,
  onCreateMeeting,
  onUpdateMeetingStatus,
}) => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.clientId || !form.title || !form.scheduledAt) return;

    onCreateMeeting({
      clientId: form.clientId,
      title: form.title,
      scheduledAt: new Date(form.scheduledAt).toISOString(),
      meetLink: form.meetLink || undefined,
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
          <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">Agendamentos</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Cria a reunião, cola o link do Meet e o cliente é notificado no portal.
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

      {meetings.length === 0 && (
        <p className="text-xs text-slate-500 dark:text-slate-400 p-8 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center">
          Sem reuniões agendadas.
        </p>
      )}

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
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">{meeting.clientName}</p>
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
                  {meeting.meetLink && (
                    <a
                      href={meeting.meetLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-[11px] font-bold text-white bg-blue-600 hover:bg-blue-500 shadow-sm transition-all cursor-pointer"
                    >
                      <Video className="w-3.5 h-3.5" />
                      <span>Entrar</span>
                    </a>
                  )}
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
          <div className="w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl p-6 relative">
            <button
              onClick={() => setIsFormOpen(false)}
              className="absolute top-4 right-4 p-2 rounded-xl text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <X className="w-4 h-4" />
            </button>

            <h3 className="text-lg font-extrabold text-slate-900 dark:text-white mb-4">Nova Reunião</h3>

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
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Assunto</label>
                <input required placeholder="Ex: Revisão do protótipo" value={form.title} onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))} className={inputClass} />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Data e hora</label>
                <input type="datetime-local" required value={form.scheduledAt} onChange={(e) => setForm((p) => ({ ...p, scheduledAt: e.target.value }))} className={inputClass} />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Link do Google Meet</label>
                <input placeholder="https://meet.google.com/..." value={form.meetLink} onChange={(e) => setForm((p) => ({ ...p, meetLink: e.target.value }))} className={inputClass} />
              </div>

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
