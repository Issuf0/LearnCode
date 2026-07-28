import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowUp, Phone, Mail, MapPin, Facebook, Instagram } from 'lucide-react';
import { COMPANY_INFO } from '../data/mockData';
import logoFull from '../assets/images/learncode-logo.png';

const FOOTER_LINKS = [
  { path: '/', label: 'Início' },
  { path: '/sobre', label: 'Sobre' },
  { path: '/servicos', label: 'Serviços' },
  { path: '/produtos', label: 'Produtos' },
  { path: '/cursos', label: 'Cursos' },
  { path: '/portfolio', label: 'Portfólio' },
  { path: '/contacto', label: 'Contacto' },
];

export const Footer: React.FC = () => {
  const navigate = useNavigate();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-slate-50 text-slate-600 pt-16 pb-8 border-t border-slate-200 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* Top Footer Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-slate-200">

          {/* Brand & Slogan Column */}
          <div className="lg:col-span-2 space-y-4">
            <img src={logoFull} alt="Learn Code" className="h-20 w-auto" loading="lazy" />

            <p className="text-xs text-slate-800 leading-relaxed font-semibold">
              "{COMPANY_INFO.slogan}"
            </p>

            <p className="text-xs text-slate-600 leading-relaxed">
              Startup tecnológica dedicada a impulsionar a transformação digital em Moçambique através de desenvolvimento de software, inteligência artificial e formação de talentos.
            </p>

            <div className="flex items-center gap-2 text-xs font-mono text-blue-600 font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>Sede Principal: Maputo, Moçambique</span>
            </div>
          </div>

          {/* Navigation Quick Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900">Navegação</h4>
            <ul className="space-y-2 text-xs">
              {FOOTER_LINKS.map((link) => (
                <li key={link.path}>
                  <button
                    onClick={() => navigate(link.path)}
                    className="text-slate-600 hover:text-blue-600 transition-colors cursor-pointer font-medium"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Services Quick List */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900">Soluções</h4>
            <ul className="space-y-2 text-xs text-slate-600">
              <li>Websites & Portais</li>
              <li>Aplicações Móveis</li>
              <li>Sistemas Desktop</li>
              <li>Inteligência Artificial</li>
              <li>Design Gráfico</li>
              <li>Cursos de Programação</li>
            </ul>
          </div>

          {/* Contact Summary */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900">Contactos</h4>
            <div className="space-y-2 text-xs text-slate-600">
              <p className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-emerald-600" />
                <span>{COMPANY_INFO.whatsappFormatted}</span>
              </p>
              <p className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-blue-600" />
                <span>{COMPANY_INFO.email}</span>
              </p>
              <p className="flex items-start gap-2">
                <MapPin className="w-3.5 h-3.5 text-slate-600 shrink-0 mt-0.5" />
                <span>{COMPANY_INFO.address}</span>
              </p>
            </div>

            {/* Social Icons */}
            <div className="pt-2 flex items-center gap-2">
              <a href={COMPANY_INFO.socials.facebook} target="_blank" rel="noopener noreferrer" className="p-2 rounded-lg bg-white border border-slate-200 text-slate-600 hover:text-blue-600 transition-colors shadow-sm">
                <Facebook className="w-4 h-4" />
              </a>
              <a href={COMPANY_INFO.socials.instagram} target="_blank" rel="noopener noreferrer" className="p-2 rounded-lg bg-white border border-slate-200 text-slate-600 hover:text-pink-600 transition-colors shadow-sm">
                <Instagram className="w-4 h-4" />
              </a>
            </div>
          </div>

        </div>

        {/* Bottom Copyright Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} Learn Code Moçambique. Todos os direitos reservados.</p>

          <div className="flex items-center gap-4">
            <span className="text-[11px] text-slate-500">Orgulhosamente desenvolvido em Maputo 🇲🇿</span>
            <button
              onClick={scrollToTop}
              className="p-2 rounded-xl bg-white border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer shadow-sm"
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
