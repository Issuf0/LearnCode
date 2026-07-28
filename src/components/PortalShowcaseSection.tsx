import React from 'react';
import { LayoutDashboard, FileSignature, MessagesSquare, TrendingUp, ArrowRight, MonitorSmartphone } from 'lucide-react';

interface PortalShowcaseSectionProps {
  onOpenPortal: () => void;
}

const HIGHLIGHTS = [
  {
    icon: TrendingUp,
    title: 'Progresso em tempo real',
    desc: 'Acompanhe milestones, checklist e percentagem de conclusão do seu projecto.',
  },
  {
    icon: FileSignature,
    title: 'Contratos digitais',
    desc: 'Leia, assine digitalmente e descarregue os seus contratos sem sair de casa.',
  },
  {
    icon: MessagesSquare,
    title: 'Comunicação registada',
    desc: 'Comentários e documentos organizados por projecto, com todo o histórico.',
  },
];

export const PortalShowcaseSection: React.FC<PortalShowcaseSectionProps> = ({ onOpenPortal }) => {
  return (
    <section id="portal" className="py-20 bg-slate-50 text-slate-900 relative border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 sm:p-12 rounded-3xl bg-white text-slate-900 shadow-sm border border-slate-200 relative overflow-hidden">
          <div className="absolute -right-24 -top-24 w-96 h-96 bg-[#29b6e8] rounded-full opacity-[0.06] blur-3xl pointer-events-none" />

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            {/* Left copy */}
            <div className="lg:col-span-6 space-y-5">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-blue-600 text-xs font-semibold tracking-wide">
                <MonitorSmartphone className="w-3.5 h-3.5" />
                <span>Exclusivo para Clientes Learn Code</span>
              </div>

              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight leading-tight text-slate-900">
                Veja como vai acompanhar o{' '}
                <span className="bg-gradient-to-r from-[#29b6e8] to-[#1a9cd8] bg-clip-text text-transparent">seu projecto.</span>
              </h2>

              <p className="text-slate-600 text-sm sm:text-base leading-relaxed max-w-xl">
                Cada cliente da Learn Code recebe acesso a um portal privado onde o projecto
                deixa de ser uma caixa negra: progresso, contratos, orçamentos e documentos,
                tudo transparente e sempre disponível.
              </p>

              <button
                onClick={onOpenPortal}
                className="inline-flex items-center gap-2.5 px-7 py-3.5 rounded-xl font-bold text-sm text-white bg-[#1a9cd8] hover:bg-[#29b6e8] shadow-lg shadow-[#1a9cd8]/25 transition-all cursor-pointer"
              >
                <LayoutDashboard className="w-4 h-4" />
                <span>Explorar demonstração do portal</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <p className="text-[11px] text-slate-500">
                Demonstração interactiva com dados fictícios — o seu portal real é criado quando o projecto arranca.
              </p>
            </div>

            {/* Right highlights */}
            <div className="lg:col-span-6 space-y-4">
              {HIGHLIGHTS.map((item) => (
                <div
                  key={item.title}
                  className="p-5 rounded-2xl bg-slate-50 border border-slate-200 flex items-start gap-4"
                >
                  <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-200 text-[#1a9cd8] flex items-center justify-center shrink-0">
                    <item.icon className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-bold text-sm text-slate-900">{item.title}</p>
                    <p className="text-xs text-slate-600 leading-relaxed mt-1">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
