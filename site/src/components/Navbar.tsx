import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Menu, X, MessageSquare, Phone, Sun, Moon, MonitorSmartphone } from 'lucide-react';
import { COMPANY_INFO } from '../data/mockData';
import { ThemeMode } from '../types';
import logoIcon from '../assets/images/learncode-icon.png';

interface NavbarProps {
  themeMode: ThemeMode;
  onChangeTheme: (mode: ThemeMode) => void;
}

const THEME_CYCLE: Record<ThemeMode, ThemeMode> = { auto: 'light', light: 'dark', dark: 'auto' };

const THEME_LABEL: Record<ThemeMode, string> = {
  auto: 'Automático (segue o sistema)',
  light: 'Claro',
  dark: 'Escuro',
};

const ThemeIcon: React.FC<{ mode: ThemeMode; className?: string }> = ({ mode, className }) =>
  mode === 'light' ? (
    <Sun className={className} />
  ) : mode === 'dark' ? (
    <Moon className={className} />
  ) : (
    <MonitorSmartphone className={className} />
  );

export const Navbar: React.FC<NavbarProps> = ({ themeMode, onChangeTheme }) => {
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
    { path: '/projectos', label: 'Projectos' },
    { path: '/cursos', label: 'Cursos' },
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
            ? 'bg-white dark:bg-slate-900 shadow-sm py-3 border-b border-slate-200 dark:border-slate-800'
            : 'bg-white dark:bg-slate-900 py-4 border-b border-slate-200/80 dark:border-slate-800'
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
                <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-900">
                  MZ
                </span>
              </div>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium tracking-wider uppercase hidden sm:block">
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
                      ? 'text-blue-600 dark:text-blue-400 font-semibold bg-blue-50 dark:bg-blue-950/40'
                      : 'text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  {link.label}
                </button>
              );
            })}
          </div>

          {/* Tema */}
          <div className="hidden sm:flex items-center gap-3">
            <button
              onClick={() => onChangeTheme(THEME_CYCLE[themeMode])}
              title={`Tema: ${THEME_LABEL[themeMode]} — clique para mudar`}
              aria-label={`Tema: ${THEME_LABEL[themeMode]}`}
              className="p-2.5 rounded-full text-slate-500 hover:text-blue-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-blue-400 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 transition-colors cursor-pointer"
            >
              <ThemeIcon mode={themeMode} className="w-4 h-4" />
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex lg:hidden items-center gap-2">
            <button
              onClick={() => onChangeTheme(THEME_CYCLE[themeMode])}
              title={`Tema: ${THEME_LABEL[themeMode]}`}
              aria-label={`Tema: ${THEME_LABEL[themeMode]}`}
              className="p-2 rounded-xl text-slate-500 hover:text-blue-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-blue-400 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 sm:hidden"
            >
              <ThemeIcon mode={themeMode} className="w-5 h-5" />
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 focus:outline-none border border-slate-200 dark:border-slate-700"
              aria-label="Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-4 pt-3 pb-6 space-y-2 shadow-xl animate-in slide-in-from-top duration-200">
            {navLinks.map((link) => (
              <button
                key={link.path}
                onClick={() => goTo(link.path)}
                className={`w-full text-left px-4 py-3 rounded-xl text-base font-medium transition-colors ${
                  location.pathname === link.path
                    ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/40 font-semibold'
                    : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                {link.label}
              </button>
            ))}
            <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex flex-col gap-2">
              <a
                href={`https://wa.me/${COMPANY_INFO.whatsappNumber.replace(/[^0-9]/g, '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700"
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
