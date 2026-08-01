import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Globe, Smartphone, Monitor, Bot, Palette, GraduationCap, Layers, Briefcase, ArrowRight, TrendingUp } from 'lucide-react';
import { SERVICES, CASE_STUDIES, PRODUCTS } from '../data/mockData';

const getServiceIcon = (iconName: string) => {
  switch (iconName) {
    case 'Globe':
      return <Globe className="w-5 h-5" />;
    case 'Smartphone':
      return <Smartphone className="w-5 h-5" />;
    case 'Monitor':
      return <Monitor className="w-5 h-5" />;
    case 'Bot':
      return <Bot className="w-5 h-5" />;
    case 'Palette':
      return <Palette className="w-5 h-5" />;
    case 'GraduationCap':
      return <GraduationCap className="w-5 h-5" />;
    default:
      return <Layers className="w-5 h-5" />;
  }
};

export const HomeHighlightsSection: React.FC = () => {
  const navigate = useNavigate();

  const featuredServices = SERVICES.slice(0, 3);

  // Destaques escolhidos à mão: SisPoupa, RoadMZ (produto) e Quiz Code
  const roadmz = PRODUCTS.find((p) => p.id === 'roadmz');
  const featuredCases = [
    ...CASE_STUDIES.filter((c) => c.id === 'case-sispoupa').map((c) => ({
      id: c.id,
      category: c.clientCategory,
      title: c.title,
      body: c.impact,
      highlight: c.results[0],
    })),
    ...(roadmz
      ? [{
          id: roadmz.id,
          category: roadmz.category,
          title: roadmz.name,
          body: roadmz.description,
          highlight: 'Disponível na Google Play',
        }]
      : []),
    ...CASE_STUDIES.filter((c) => c.id === 'case-quiz-code').map((c) => ({
      id: c.id,
      category: c.clientCategory,
      title: c.title,
      body: c.impact,
      highlight: c.results[0],
    })),
  ];

  return (
    <>
      {/* ===== Prévia de Serviços ===== */}
      <section className="py-20 bg-white dark:bg-slate-950 text-slate-900 dark:text-white border-t border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900 text-blue-600 dark:text-blue-400 text-xs font-semibold uppercase tracking-wider">
              <Layers className="w-3.5 h-3.5" />
              <span>O que fazemos</span>
            </div>

            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              Soluções digitais para o seu{' '}
              <span className="text-blue-600 dark:text-blue-400">negócio ou instituição.</span>
            </h2>
          </div>

          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
            {featuredServices.map((service) => (
              <button
                key={service.id}
                onClick={() => navigate('/servicos')}
                className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:border-blue-500 hover:shadow-md transition-all duration-300 text-left group cursor-pointer"
              >
                <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-900 text-blue-600 dark:text-blue-400 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors">
                  {getServiceIcon(service.iconName)}
                </div>
                <h3 className="mt-4 text-lg font-bold group-hover:text-blue-600 transition-colors">{service.title}</h3>
                <p className="mt-1.5 text-sm text-slate-600 dark:text-slate-400 leading-relaxed">{service.shortDesc}</p>
                <span className="mt-4 inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 dark:text-blue-400">
                  <span>Saber mais</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </span>
              </button>
            ))}
          </div>

          <div className="mt-8 text-center">
            <button
              onClick={() => navigate('/servicos')}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold text-slate-800 dark:text-slate-100 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-all cursor-pointer"
            >
              <span>Ver todos os serviços</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* ===== Projectos em Destaque ===== */}
      <section className="py-20 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white border-t border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900 text-blue-600 dark:text-blue-400 text-xs font-semibold uppercase tracking-wider">
              <Briefcase className="w-3.5 h-3.5" />
              <span>Projectos em destaque</span>
            </div>

            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              Trabalho real, com{' '}
              <span className="text-blue-600 dark:text-blue-400">impacto comprovado.</span>
            </h2>
          </div>

          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
            {featuredCases.map((cs) => (
              <button
                key={cs.id}
                onClick={() => navigate('/projectos')}
                className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:border-blue-500 hover:shadow-md transition-all duration-300 text-left flex flex-col group cursor-pointer"
              >
                <span className="text-[11px] font-mono font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  {cs.category}
                </span>
                <h3 className="mt-2 text-lg font-bold group-hover:text-blue-600 transition-colors">{cs.title}</h3>
                <p className="mt-1.5 text-sm text-slate-600 dark:text-slate-400 leading-relaxed line-clamp-3 flex-1">
                  {cs.body}
                </p>
                <span className="mt-4 inline-flex items-center gap-1.5 text-xs font-bold text-emerald-600 dark:text-emerald-400">
                  <TrendingUp className="w-3.5 h-3.5" />
                  <span>{cs.highlight}</span>
                </span>
              </button>
            ))}
          </div>

          <div className="mt-8 text-center">
            <button
              onClick={() => navigate('/projectos')}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold text-white bg-[#1a9cd8] hover:bg-[#29b6e8] shadow-md shadow-[#1a9cd8]/25 transition-all cursor-pointer"
            >
              <span>Ver todos os projectos</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>
    </>
  );
};
