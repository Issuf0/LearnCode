import React, { useState } from 'react';
import { Briefcase, ArrowRight, CheckCircle2, AlertTriangle, Lightbulb, TrendingUp, ExternalLink } from 'lucide-react';
import { CASE_STUDIES } from '../data/mockData';
import { CaseStudy } from '../types';

interface PortfolioSectionProps {
  onInquireCase: (caseTitle: string) => void;
}

export const PortfolioSection: React.FC<PortfolioSectionProps> = ({ onInquireCase }) => {
  const [activeTab, setActiveTab] = useState<string>(CASE_STUDIES[0].id);

  const activeCase = CASE_STUDIES.find((c) => c.id === activeTab) || CASE_STUDIES[0];

  const scrollToQuote = (title: string) => {
    onInquireCase(title);
  };

  return (
    <section id="portfolio" className="py-20 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900 text-blue-600 dark:text-blue-400 text-xs font-semibold uppercase tracking-wider">
            <Briefcase className="w-3.5 h-3.5" />
            <span>Projectos & Casos de Sucesso</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Impacto real comprovado em{' '}
            <span className="text-blue-600 dark:text-blue-400">
              projectos tecnológicos.
            </span>
          </h2>

          <p className="text-slate-600 dark:text-slate-400 text-base sm:text-lg leading-relaxed">
            Conheça alguns dos projectos e estudos de caso desenvolvidos pela Learn Code para resolver problemas complexos na sociedade e no mercado moçambicano.
          </p>
        </div>

        {/* Project Selector Nav Pills */}
        <div className="mt-12 flex items-center justify-center gap-2 overflow-x-auto pb-2">
          {CASE_STUDIES.map((c) => (
            <button
              key={c.id}
              onClick={() => setActiveTab(c.id)}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                activeTab === c.id
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800'
              }`}
            >
              {c.title}
            </button>
          ))}
        </div>

        {/* Case Study Inspector Panel */}
        <div className="mt-8 p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-8">

          {/* Title Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-6">
            <div>
              <span className="text-xs font-mono font-semibold uppercase text-blue-600 dark:text-blue-400 tracking-wider">
                {activeCase.clientCategory}
              </span>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
                {activeCase.title}
              </h3>
            </div>

            <div className="flex flex-wrap items-center gap-2 self-start md:self-auto">
              {activeCase.link && (
                <a
                  href={activeCase.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/40 hover:bg-blue-100 dark:hover:bg-blue-900/40 border border-blue-200 dark:border-blue-900 transition-all cursor-pointer"
                >
                  <span>{activeCase.link.includes('play.google.com') ? 'Ver na Google Play' : 'Visitar plataforma'}</span>
                  <ExternalLink className="w-4 h-4" />
                </a>
              )}
              <button
                onClick={() => scrollToQuote(`Projecto idêntico a: ${activeCase.title}`)}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs text-white bg-blue-600 hover:bg-blue-700 shadow-sm transition-all cursor-pointer"
              >
                <span>Quero um projecto idêntico</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Problem -> Solution -> Impact Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

            {/* Problem Box */}
            <div className="p-6 rounded-2xl bg-rose-50/50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-900 space-y-3 relative overflow-hidden">
              <div className="w-10 h-10 rounded-xl bg-rose-100 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-900 flex items-center justify-center text-rose-600">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <h4 className="text-lg font-bold text-slate-900 dark:text-white">1. O Desafio / Problema</h4>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">{activeCase.problem}</p>
            </div>

            {/* Solution Box */}
            <div className="p-6 rounded-2xl bg-blue-50/50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900 space-y-3 relative overflow-hidden">
              <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-950/50 border border-blue-200 dark:border-blue-900 flex items-center justify-center text-blue-600">
                <Lightbulb className="w-5 h-5" />
              </div>
              <h4 className="text-lg font-bold text-slate-900 dark:text-white">2. A Solução Learn Code</h4>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">{activeCase.solution}</p>
            </div>

            {/* Impact Box */}
            <div className="p-6 rounded-2xl bg-emerald-50/50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-900 space-y-3 relative overflow-hidden">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-900 flex items-center justify-center text-emerald-600">
                <TrendingUp className="w-5 h-5" />
              </div>
              <h4 className="text-lg font-bold text-slate-900 dark:text-white">3. Impacto Alcançado</h4>
              <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-semibold">{activeCase.impact}</p>
            </div>

          </div>

          {/* Results Checklist & Tech Stack */}
          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                <TrendingUp className="w-4 h-4 text-amber-500" />
                <span>Métricas & Resultados Alcançados</span>
              </h4>
              <div className="space-y-2">
                {activeCase.results.map((res, i) => (
                  <div key={i} className="flex items-center gap-2.5 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 text-xs text-slate-800 dark:text-slate-100">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>{res}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Stack Tecnológica Utilizada</h4>
              <div className="flex flex-wrap gap-2 pt-1">
                {activeCase.technologies.map((tech, i) => (
                  <span
                    key={i}
                    className="px-3 py-1.5 rounded-lg bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-900 text-xs font-mono font-medium"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
