import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowUp, Phone, Mail, MapPin, Facebook, Instagram } from 'lucide-react';
import { COMPANY_INFO } from '../data/mockData';
import logoFull from '../assets/images/learncode-logo.png';

const FOOTER_LINKS = [
  { path: '/', label: 'Início' },
  { path: '/sobre', label: 'Sobre' },
  { path: '/servicos', label: 'Serviços' },
  { path: '/projectos', label: 'Projectos' },
  { path: '/cursos', label: 'Cursos' },
  { path: '/contacto', label: 'Contacto' },
];

const SOLUTION_LINKS = [
  { path: '/servicos', label: 'Websites & Portais' },
  { path: '/servicos', label: 'Aplicações Móveis' },
  { path: '/servicos', label: 'Sistemas Desktop' },
  { path: '/servicos', label: 'Inteligência Artificial' },
  { path: '/servicos', label: 'Design Gráfico' },
  { path: '/cursos', label: 'Cursos de Programação' },
];

export const Footer: React.FC = () => {
  const navigate = useNavigate();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const linkClass =
    'text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer';

  return (
    <footer className="bg-slate-50 dark:bg-slate-950 text-slate-600 dark:text-slate-400 pt-14 pb-6 border-t border-slate-200 dark:border-slate-800 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* Top Footer Row */}
        <div className="grid grid-cols-2 lg:grid-cols-12 gap-x-6 gap-y-10 pb-10 border-b border-slate-200 dark:border-slate-800">

          {/* Brand Column */}
          <div className="col-span-2 lg:col-span-4 space-y-4 lg:pr-10">
            <img src={logoFull} alt="Learn Code" className="h-12 w-auto" loading="lazy" />

            <p className="text-sm leading-relaxed max-w-sm">
              Startup tecnológica dedicada a impulsionar a transformação digital em Moçambique através de software, inteligência artificial e formação de talentos.
            </p>

            <div className="flex items-center gap-2 text-xs font-medium text-blue-600 dark:text-blue-400">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>Maputo, Moçambique</span>
            </div>

            <div className="flex items-center gap-2 pt-1">
              <a
                href={COMPANY_INFO.socials.facebook}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:border-blue-300 dark:hover:border-blue-800 transition-colors shadow-sm"
              >
                <Facebook className="w-4 h-4" />
              </a>
              <a
                href={COMPANY_INFO.socials.instagram}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 hover:text-pink-600 dark:hover:text-pink-400 hover:border-pink-300 dark:hover:border-pink-900 transition-colors shadow-sm"
              >
                <Instagram className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Navigation Quick Links */}
          <div className="lg:col-span-2 space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">Navegação</h4>
            <ul className="space-y-2.5 text-sm">
              {FOOTER_LINKS.map((link) => (
                <li key={link.path}>
                  <button onClick={() => navigate(link.path)} className={linkClass}>
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Solutions Quick Links */}
          <div className="lg:col-span-3 space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">Soluções</h4>
            <ul className="space-y-2.5 text-sm">
              {SOLUTION_LINKS.map((link) => (
                <li key={link.label}>
                  <button onClick={() => navigate(link.path)} className={linkClass}>
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Summary */}
          <div className="col-span-2 lg:col-span-3 space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">Contactos</h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <a
                  href={`https://wa.me/${COMPANY_INFO.whatsappNumber.replace(/[^0-9]/g, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`flex items-center gap-2.5 ${linkClass}`}
                >
                  <Phone className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{COMPANY_INFO.whatsappFormatted}</span>
                </a>
              </li>
              <li>
                <a href={`mailto:${COMPANY_INFO.email}`} className={`flex items-center gap-2.5 ${linkClass}`}>
                  <Mail className="w-4 h-4 text-blue-600 shrink-0" />
                  <span>{COMPANY_INFO.email}</span>
                </a>
              </li>
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{COMPANY_INFO.address}</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Copyright Bar */}
        <div className="pt-6 flex flex-col-reverse sm:flex-row items-center justify-between gap-3 text-xs text-slate-500 dark:text-slate-400 text-center sm:text-left">
          <p>© {new Date().getFullYear()} Learn Code Moçambique. Todos os direitos reservados.</p>

          <div className="flex items-center gap-4">
            <span className="text-[11px]">Orgulhosamente desenvolvido em Maputo 🇲🇿</span>
            <button
              onClick={scrollToTop}
              className="p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer shadow-sm"
              title="Voltar ao Topo"
            >
              <ArrowUp className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>
    </footer>
  );
};
