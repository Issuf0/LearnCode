import React from 'react';
import { ArrowRight, Code2, CheckCircle2, ShieldCheck, Bot, Award } from 'lucide-react';
import { COMPANY_INFO } from '../data/mockData';

interface HeroProps {
  onContactClick: () => void;
  onServicesClick: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onContactClick, onServicesClick }) => {
  return (
    <section id="inicio" className="pt-28 pb-12 sm:pt-32 sm:pb-16 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Clean Minimalist Hero Card — fundo claro, acentos na cor da marca */}
        <div className="p-8 sm:p-12 lg:p-16 bg-white dark:bg-slate-900 rounded-3xl text-slate-900 dark:text-white relative overflow-hidden shadow-sm border border-slate-200 dark:border-slate-800">
          <div className="absolute -right-24 -top-24 w-96 h-96 bg-[#29b6e8] rounded-full opacity-[0.07] blur-3xl pointer-events-none" />
          <div className="absolute -left-24 -bottom-24 w-96 h-96 bg-[#1a9cd8] rounded-full opacity-[0.05] blur-3xl pointer-events-none" />

          <div className="max-w-3xl mx-auto space-y-6 text-center relative z-10">
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold leading-[1.15] tracking-tight text-slate-900 dark:text-white">
              Transformamos ideias em <br className="hidden sm:inline" />
              <span className="bg-gradient-to-r from-[#29b6e8] to-[#1a9cd8] bg-clip-text text-transparent">soluções digitais.</span>
            </h1>

            <p className="text-slate-600 dark:text-slate-400 text-base sm:text-lg max-w-xl mx-auto leading-relaxed">
              {COMPANY_INFO.subheadline}
            </p>

            {/* Value checks */}
            <div className="flex flex-wrap justify-center gap-y-2 gap-x-5 text-xs sm:text-sm text-slate-700 dark:text-slate-300 pt-1">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-[#1a9cd8] shrink-0" />
                <span>Websites & Apps</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Bot className="w-4 h-4 text-[#1a9cd8] shrink-0" />
                <span>Agentes & IA</span>
              </div>
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-[#1a9cd8] shrink-0" />
                <span>Qualidade & Segurança</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-3 flex flex-col sm:flex-row justify-center gap-3">
              <button
                onClick={onContactClick}
                className="px-7 py-3.5 bg-[#1a9cd8] hover:bg-[#29b6e8] text-white rounded-xl font-bold text-sm transition-all shadow-lg shadow-[#1a9cd8]/25 inline-flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Fale Connosco</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={onServicesClick}
                className="px-7 py-3.5 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800/60 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-100 rounded-xl font-bold text-sm transition-all inline-flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Conhecer Serviços</span>
                <Code2 className="w-4 h-4 text-[#1a9cd8]" />
              </button>
            </div>

            <div className="pt-4 border-t border-slate-200 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400 italic flex items-center justify-center gap-2">
              <Award className="w-4 h-4 text-amber-500 shrink-0" />
              <span>"{COMPANY_INFO.slogan}"</span>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
