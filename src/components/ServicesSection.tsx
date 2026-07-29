import React from 'react';
import { Globe, Smartphone, Monitor, Bot, Palette, Lightbulb, GraduationCap, ArrowRight, CheckCircle, Layers } from 'lucide-react';
import { SERVICES } from '../data/mockData';
import { ServiceItem } from '../types';

interface ServicesSectionProps {
  onSelectServiceForQuote: (serviceTitle: string) => void;
}

export const ServicesSection: React.FC<ServicesSectionProps> = ({ onSelectServiceForQuote }) => {
  const getIcon = (iconName: string) => {
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
      case 'Lightbulb':
        return <Lightbulb className="w-5 h-5" />;
      case 'GraduationCap':
        return <GraduationCap className="w-5 h-5" />;
      default:
        return <Layers className="w-5 h-5" />;
    }
  };

  const scrollToQuote = (serviceTitle: string) => {
    onSelectServiceForQuote(serviceTitle);
  };

  return (
    <section id="servicos" className="py-20 bg-white dark:bg-slate-950 text-slate-900 dark:text-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900 text-blue-600 dark:text-blue-400 text-xs font-semibold uppercase tracking-wider">
            <Layers className="w-3.5 h-3.5" />
            <span>Nossos Serviços</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Soluções completas de engenharia de software e{' '}
            <span className="text-blue-600 dark:text-blue-400">
              inovação digital.
            </span>
          </h2>

          <p className="text-slate-600 dark:text-slate-400 text-base sm:text-lg leading-relaxed">
            Desenvolvemos tecnologias personalizadas com padrões internacionais, alinhadas às necessidades estratégicas de negócios e instituições em Moçambique.
          </p>
        </div>

        {/* Services Grid */}
        <div className="mt-14 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {SERVICES.map((service: ServiceItem) => (
            <div
              key={service.id}
              className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:border-blue-500 hover:shadow-md transition-all duration-300 flex flex-col justify-between group"
            >
              <div className="space-y-4">
                {/* Icon & Category */}
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-900 text-blue-600 dark:text-blue-400 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors">
                    {getIcon(service.iconName)}
                  </div>
                  <span className="text-[11px] font-mono font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider px-2.5 py-0.5 rounded bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800">
                    Learn Code Tech
                  </span>
                </div>

                {/* Title & Desc */}
                <div className="space-y-1.5">
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white group-hover:text-blue-600 transition-colors">
                    {service.title}
                  </h3>
                  <p className="text-slate-700 dark:text-slate-300 text-sm font-semibold leading-relaxed">
                    "{service.shortDesc}"
                  </p>
                  <p className="text-slate-500 dark:text-slate-400 text-xs leading-relaxed pt-1">
                    {service.fullDesc}
                  </p>
                </div>

                {/* Benefits List */}
                <div className="pt-2 space-y-2 border-t border-slate-100 dark:border-slate-800">
                  <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">Vantagens chave:</p>
                  <ul className="space-y-1.5 text-xs text-slate-600 dark:text-slate-400">
                    {service.benefits.map((benefit, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <CheckCircle className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
                        <span>{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Price Anchor & Action Button */}
              <div className="pt-5 mt-5 border-t border-slate-100 dark:border-slate-800 space-y-3">
                {service.priceFrom ? (
                  <div className="flex items-baseline justify-between">
                    <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">Investimento a partir de</span>
                    <span className="text-lg font-black text-blue-600 dark:text-blue-400">{service.priceFrom}</span>
                  </div>
                ) : (
                  <div className="flex items-baseline justify-between">
                    <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">Investimento</span>
                    <span className="text-sm font-bold text-slate-700 dark:text-slate-300">Sob consulta</span>
                  </div>
                )}
                <button
                  onClick={() => scrollToQuote(service.title)}
                  className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-bold text-white bg-slate-900 dark:bg-blue-600 hover:bg-blue-600 dark:hover:bg-blue-500 transition-all cursor-pointer group/btn shadow-sm"
                >
                  <span>Solicitar este serviço</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Pricing Note */}
        <p className="mt-8 text-center text-xs text-slate-500 dark:text-slate-400 italic">
          * Os preços apresentados são valores de referência e variam conforme a complexidade e os requisitos de cada sistema. Solicite um orçamento personalizado.
        </p>

      </div>
    </section>
  );
};
