import React from 'react';
import { CalendarDays, Video, Clock, FolderKanban } from 'lucide-react';
import { Meeting } from '../../../types';

interface MeetingsViewProps {
  meetings: Meeting[];
}

const STATUS_STYLES: Record<Meeting['status'], string> = {
  Agendada: 'bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-800',
  Concluída: 'bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800',
  Cancelada: 'bg-rose-50 dark:bg-rose-950 text-rose-700 dark:text-rose-400 border-rose-200 dark:border-rose-800',
};

export const MeetingsView: React.FC<MeetingsViewProps> = ({ meetings }) => {
  const upcoming = meetings.filter((m) => m.status === 'Agendada');
  const past = meetings.filter((m) => m.status !== 'Agendada');

  const MeetingCard = ({ meeting }: { meeting: Meeting }) => (
    <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div className="flex items-start gap-3.5">
        <div className="w-11 h-11 rounded-xl bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
          <CalendarDays className="w-5 h-5" />
        </div>
        <div>
          <p className="text-sm font-extrabold text-slate-900 dark:text-white leading-snug">{meeting.title}</p>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 flex items-center gap-1.5">
            <FolderKanban className="w-3 h-3 shrink-0" />
            {meeting.projectName}
          </p>
          <p className="text-xs text-slate-700 dark:text-slate-300 font-semibold mt-1 flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-blue-500 shrink-0" />
            {meeting.date} às {meeting.time}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${STATUS_STYLES[meeting.status]}`}>
          {meeting.status}
        </span>
        {meeting.status === 'Agendada' && (
          <a
            href={meeting.meetLink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-[11px] font-bold text-white bg-blue-600 hover:bg-blue-500 shadow-sm transition-all cursor-pointer whitespace-nowrap"
          >
            <Video className="w-3.5 h-3.5" />
            <span>Entrar na Reunião</span>
          </a>
        )}
      </div>
    </div>
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div>
        <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">Reuniões</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Reuniões agendadas com a equipa Learn Code. O link do Google Meet fica activo à hora marcada.
        </p>
      </div>

      <div className="space-y-3">
        <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          Próximas ({upcoming.length})
        </h2>
        {upcoming.length === 0 ? (
          <p className="text-xs text-slate-500 dark:text-slate-400 p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center">
            Sem reuniões agendadas. A equipa entrará em contacto para marcar a próxima.
          </p>
        ) : (
          upcoming.map((m) => <MeetingCard key={m.id} meeting={m} />)
        )}
      </div>

      {past.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Histórico ({past.length})
          </h2>
          {past.map((m) => <MeetingCard key={m.id} meeting={m} />)}
        </div>
      )}
    </div>
  );
};
