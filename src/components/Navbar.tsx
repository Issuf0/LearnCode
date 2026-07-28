import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Menu, X, ArrowRight, MessageSquare, Phone, User } from 'lucide-react';
import { COMPANY_INFO } from '../data/mockData';
import logoIcon from '../assets/images/learncode-icon.png';

interface NavbarProps {
  onQuoteClick: () => void;
  onOpenPortal?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onQuoteClick, onOpenPortal }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const goTo = (path: string) => {
    setMobileMenuOpen(false);
    navigate(path);
  };

  const navLinks = [
    { path: '/', label: 'Início' },
    { path: '/sobre', label: 'Sobre' },
    { path: '/servicos', label: 'Serviços' },
    { path: '/produtos', label: 'Produtos' },
    { path: '/cursos', label: 'Cursos' },
    { path: '/portfolio', label: 'Portfólio' },
    { path: '/contacto', label: 'Contacto' },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 transition-all duration-300">
      {/* Top Banner Accent */}
      <div className="bg-slate-900 text-slate-300 text-xs py-1.5 px-4 hidden md:block border-b border-slate-800">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-4">
            <span className="inline-flex items-center gap-1.5 font-medium text-blue-400">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              Startup Tecnológica Moçambicana
            </span>
            <span className="text-slate-600">•</span>
            <span className="text-slate-300">Software, IA & Formação Tecnológica em Maputo</span>
          </div>
          <div className="flex items-center gap-6">
            <a
              href={`https://wa.me/${COMPANY_INFO.whatsappNumber.replace(/[^0-9]/g, '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-blue-400 transition-colors flex items-center gap-1.5"
            >
              <Phone className="w-3 h-3 text-emerald-400" />
              <span>{COMPANY_INFO.whatsappFormatted}</span>
            </a>
            <a href={`mailto:${COMPANY_INFO.email}`} className="hover:text-blue-400 transition-colors">
              {COMPANY_INFO.email}
            </a>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <nav
        className={`transition-all duration-300 ${
          isScrolled
            ? 'bg-white/95 backdrop-blur-md shadow-sm py-3 border-b border-slate-200'
            : 'bg-white/90 backdrop-blur-sm py-4 border-b border-slate-200/80'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          {/* Logo */}
          <button
            onClick={() => goTo('/')}
            className="flex items-center gap-2.5 text-left group cursor-pointer focus:outline-none"
          >
            <img
              src={logoIcon}
              alt="Learn Code"
              className="h-9 w-auto group-hover:scale-105 transition-transform"
            />
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-xl tracking-tight font-sans text-[#1a9cd8]">
                  Learn <span className="font-light text-[#29b6e8]">Code</span>
                </span>
                <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-blue-50 text-blue-600 border border-blue-200">
                  MZ
                </span>
              </div>
              <p className="text-[10px] text-slate-500 font-medium tracking-wider uppercase hidden sm:block">
                Tecnologia & Inovação
              </p>
            </div>
          </button>

          {/* Desktop Nav Links */}
          <div className="hidden lg:flex items-center space-x-1">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <button
                  key={link.path}
                  onClick={() => goTo(link.path)}
                  className={`px-3.5 py-2 rounded-lg text-sm transition-all cursor-pointer ${
                    isActive
                      ? 'text-blue-600 font-semibold bg-blue-50'
                      : 'text-slate-600 hover:text-blue-600 hover:bg-slate-100'
                  }`}
                >
                  {link.label}
                </button>
              );
            })}
          </div>

          {/* CTA Button & Client Portal Link */}
          <div className="hidden sm:flex items-center gap-3">
            {onOpenPortal && (
              <button
                onClick={onOpenPortal}
                className="px-5 py-2.5 rounded-full text-xs font-bold text-[#1a9cd8] bg-white border border-[#1a9cd8]/40 hover:bg-[#1a9cd8] hover:text-white hover:border-[#1a9cd8] transition-all inline-flex items-center gap-2 cursor-pointer shadow-sm"
              >
                <User className="w-3.5 h-3.5" />
                <span>Área do Cliente</span>
              </button>
            )}
            <button
              onClick={onQuoteClick}
              className="px-5 py-2.5 bg-slate-900 text-white rounded-full text-sm font-semibold hover:bg-slate-800 transition-colors shadow-sm inline-flex items-center gap-2 cursor-pointer"
            >
              <span>Solicitar Orçamento</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex lg:hidden items-center gap-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-slate-700 hover:text-slate-900 hover:bg-slate-100 focus:outline-none border border-slate-200"
              aria-label="Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-white border-b border-slate-200 px-4 pt-3 pb-6 space-y-2 shadow-xl animate-in slide-in-from-top duration-200">
            {navLinks.map((link) => (
              <button
                key={link.path}
                onClick={() => goTo(link.path)}
                className={`w-full text-left px-4 py-3 rounded-xl text-base font-medium transition-colors ${
                  location.pathname === link.path
                    ? 'text-blue-600 bg-blue-50 font-semibold'
                    : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                {link.label}
              </button>
            ))}
            <div className="pt-3 border-t border-slate-200 flex flex-col gap-2">
              {onOpenPortal && (
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenPortal();
                  }}
                  className="w-full flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-blue-600 bg-blue-50 border border-blue-200"
                >
                  <User className="w-4 h-4" />
                  <span>Área do Cliente</span>
                </button>
              )}
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onQuoteClick();
                }}
                className="w-full flex items-center justify-center gap-2 px-5 py-3 rounded-full font-semibold text-white bg-slate-900 hover:bg-slate-800 shadow-md"
              >
                <span>Solicitar Orçamento</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <a
                href={`https://wa.me/${COMPANY_INFO.whatsappNumber.replace(/[^0-9]/g, '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-sm text-slate-700 hover:bg-slate-100 border border-slate-200"
              >
                <MessageSquare className="w-4 h-4 text-emerald-600" />
                <span>Contacto WhatsApp ({COMPANY_INFO.whatsappFormatted})</span>
              </a>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};
