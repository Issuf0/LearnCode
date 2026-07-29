import React from 'react';
import { Target, Compass, HeartHandshake, Shield, Award, CheckCircle2, Building2 } from 'lucide-react';
import { COMPANY_INFO } from '../data/mockData';

export const AboutSection: React.FC = () => {
  return (
    <section id="sobre" className="py-20 bg-slate-50 text-slate-900 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-blue-600 text-xs font-semibold uppercase tracking-wider">
            <Building2 className="w-3.5 h-3.5" />
            <span>Sobre a Learn Code</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Uma startup moçambicana comprometida com a{' '}
            <span className="text-blue-600">
              excelência digital.
            </span>
          </h2>

          <p className="text-slate-600 text-base sm:text-lg leading-relaxed">
            {COMPANY_INFO.aboutBrief}
          </p>
        </div>

        {/* Mission & Vision Cards */}
        <div className="mt-14 grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Mission Card */}
          <div className="p-8 rounded-2xl bg-white border border-slate-200 shadow-sm hover:border-blue-500/50 transition-all group relative overflow-hidden">
            <div className="absolute top-0 left-0 w-2 h-full bg-blue-600" />
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600 shrink-0 group-hover:scale-105 transition-transform">
                <Target className="w-6 h-6" />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-bold text-slate-900">Nossa Missão</h3>
                <p className="text-slate-800 leading-relaxed font-semibold text-lg">
                  "{COMPANY_INFO.mission}"
                </p>
                <p className="text-slate-500 text-sm">
                  Focamos na resolução de desafios práticos através de software robusto, inteligência artificial e formação técnica contínua.
                </p>
              </div>
            </div>
          </div>

          {/* Vision Card */}
          <div className="p-8 rounded-2xl bg-white border border-slate-200 shadow-sm hover:border-blue-500/50 transition-all group relative overflow-hidden">
            <div className="absolute top-0 left-0 w-2 h-full bg-sky-500" />
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600 shrink-0 group-hover:scale-105 transition-transform">
                <Compass className="w-6 h-6" />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-bold text-slate-900">Nossa Visão</h3>
                <p className="text-slate-800 leading-relaxed font-semibold text-lg">
                  "{COMPANY_INFO.vision}"
                </p>
                <p className="text-slate-500 text-sm">
                  Construir um ecossistema tecnológico sustentável que represente o talento moçambicano no cenário global.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Values Grid */}
        <div className="mt-14 space-y-6">
          <div className="text-center">
            <h3 className="text-2xl font-bold text-slate-900 tracking-tight">Nossos Valores Fundamentais</h3>
            <p className="text-slate-500 text-sm mt-1">Os princípios que orientam as nossas decisões, entregas e relações interpessoais.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {COMPANY_INFO.values.map((val, idx) => (
              <div
                key={idx}
                className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm hover:border-blue-300 transition-all space-y-3"
              >
                <div className="w-9 h-9 rounded-lg bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600 font-bold text-sm">
                  0{idx + 1}
                </div>
                <h4 className="text-lg font-bold text-slate-900">{val.title}</h4>
                <p className="text-xs text-slate-500 leading-relaxed">{val.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Highlight Slogan Card */}
        <div className="mt-14 p-8 rounded-3xl bg-white border border-slate-200 shadow-sm text-center relative overflow-hidden">
          <div className="absolute -right-24 -top-24 w-80 h-80 bg-[#29b6e8] rounded-full opacity-[0.06] blur-3xl pointer-events-none" />
          <div className="max-w-3xl mx-auto space-y-4 relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-600 text-xs font-semibold">
              <Award className="w-3.5 h-3.5 text-amber-500" />
              <span>Identidade de Marca Learn Code</span>
            </div>
            <blockquote className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight leading-snug">
              "{COMPANY_INFO.slogan}"
            </blockquote>
            <p className="text-slate-600 text-sm max-w-xl mx-auto">
              Cada linha de código que escrevemos reflete a nossa seriedade, transparência e empenho no sucesso dos nossos parceiros e clientes.
            </p>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="mt-12 grid grid-cols-2 lg:grid-cols-4 gap-6 text-center">
          {COMPANY_INFO.stats.map((stat, i) => (
            <div key={i} className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm">
              <p className="text-3xl sm:text-4xl font-extrabold text-blue-600">
                {stat.value}
              </p>
              <p className="text-xs sm:text-sm font-semibold text-slate-600 mt-1">{stat.label}</p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
