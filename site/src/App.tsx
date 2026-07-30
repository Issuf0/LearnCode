import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { AboutSection } from './components/AboutSection';
import { ServicesSection } from './components/ServicesSection';
import { ProductsSection } from './components/ProductsSection';
import { CoursesSection } from './components/CoursesSection';
import { PortfolioSection } from './components/PortfolioSection';
import { FAQSection } from './components/FAQSection';
import { ContactSection } from './components/ContactSection';
import { Footer } from './components/Footer';
import { WhatsAppWidget } from './components/WhatsAppWidget';
import { NotFoundPage } from './components/NotFoundPage';
import { Toast } from './components/Toast';
import { ThemeMode } from './types';

const PUBLIC_PAGES = ['sobre', 'servicos', 'projectos', 'cursos', 'contacto'];

const PUBLIC_TITLES: Record<string, string> = {
  '': 'Learn Code — Websites, Sistemas e IA em Moçambique',
  sobre: 'Sobre Nós · Learn Code',
  servicos: 'Serviços · Learn Code',
  projectos: 'Projectos · Learn Code',
  cursos: 'Cursos · Learn Code',
  contacto: 'Contacto · Learn Code',
};

const PUBLIC_DESCRIPTIONS: Record<string, string> = {
  '': 'A Learn Code desenvolve websites, aplicações móveis, sistemas de gestão e soluções de IA para empresas em Moçambique. Fale connosco pelo WhatsApp.',
  sobre: 'Conheça a Learn Code: startup tecnológica moçambicana de software, inteligência artificial e formação, sediada em Marracuene, Maputo.',
  servicos: 'Websites, aplicações móveis, sistemas desktop, soluções com IA e design gráfico em Moçambique. Diagnóstico gratuito em 24h.',
  projectos: 'Projectos da Learn Code: casos de sucesso como SisPoupa e Quiz Code, e produtos digitais como EcoMaputo e RoadMZ, criados em Moçambique.',
  cursos: 'Cursos práticos de programação em Maputo: HTML/CSS, JavaScript, Python, Java e MySQL, com mentoria e certificado.',
  contacto: 'Fale com a Learn Code: WhatsApp +258 82 837 6317, email learncode.mz@gmail.com, Marracuene, Maputo.',
};

export default function App() {
  const navigate = useNavigate();
  const location = useLocation();
  const [pathRoot] = location.pathname.split('/').filter(Boolean);

  const publicPage = PUBLIC_PAGES.includes(pathRoot ?? '') ? (pathRoot as string) : '';
  const isNotFound = pathRoot !== undefined && !PUBLIC_PAGES.includes(pathRoot);

  const [themeMode, setThemeMode] = useState<ThemeMode>(() => {
    const stored = localStorage.getItem('lc-theme');
    return stored === 'dark' || stored === 'light' || stored === 'auto' ? stored : 'auto';
  });
  const [systemPrefersDark, setSystemPrefersDark] = useState<boolean>(
    () => window.matchMedia('(prefers-color-scheme: dark)').matches
  );
  const isDarkMode = themeMode === 'dark' || (themeMode === 'auto' && systemPrefersDark);

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const onChange = (e: MediaQueryListEvent) => setSystemPrefersDark(e.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDarkMode);
    localStorage.setItem('lc-theme', themeMode);
  }, [themeMode, isDarkMode]);

  useEffect(() => {
    document.title = isNotFound ? 'Página não encontrada · Learn Code' : PUBLIC_TITLES[publicPage];
    if (!isNotFound) {
      document.querySelector('meta[name="description"]')?.setAttribute('content', PUBLIC_DESCRIPTIONS[publicPage]);
    }
  }, [publicPage, isNotFound]);

  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [location.pathname]);

  // Antigo fluxo de orçamento removido: todos os CTAs levam ao contacto
  const goToContact = () => navigate('/contacto');
  const handleRequestQuote = () => navigate('/contacto');

  useEffect(() => {
    if (pathRoot === 'orcamento') navigate('/contacto', { replace: true });
    if (pathRoot === 'produtos' || pathRoot === 'portfolio') navigate('/projectos', { replace: true });
  }, [pathRoot, navigate]);

  return (
    <div className={`min-h-screen ${isDarkMode ? 'dark bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'} font-sans selection:bg-blue-600 selection:text-white transition-colors duration-200`}>
      <Toast message={toastMessage} onClose={() => setToastMessage(null)} />

      <div className="bg-white dark:bg-slate-950">
        <Navbar
          themeMode={themeMode}
          onChangeTheme={setThemeMode}
        />

        <main>
          {isNotFound && (
            <div className="pt-24 sm:pt-28 dark:bg-slate-950">
              <NotFoundPage />
            </div>
          )}

          {!isNotFound && publicPage === '' && (
            <>
              <Hero onContactClick={goToContact} onServicesClick={() => navigate('/servicos')} />
              <FAQSection />
            </>
          )}

          {publicPage === 'sobre' && (
            <div className="pt-24 sm:pt-28 bg-slate-50 dark:bg-slate-950"><AboutSection /></div>
          )}

          {publicPage === 'servicos' && (
            <div className="pt-24 sm:pt-28 dark:bg-slate-950"><ServicesSection onSelectServiceForQuote={handleRequestQuote} /></div>
          )}

          {publicPage === 'projectos' && (
            <div className="pt-24 sm:pt-28 bg-slate-50 dark:bg-slate-950">
              <PortfolioSection onInquireCase={handleRequestQuote} />
              <ProductsSection onInquireProduct={handleRequestQuote} />
            </div>
          )}

          {publicPage === 'cursos' && (
            <div className="pt-24 sm:pt-28 dark:bg-slate-950"><CoursesSection onEnrollCourse={handleRequestQuote} /></div>
          )}

          {publicPage === 'contacto' && (
            <div className="pt-24 sm:pt-28 dark:bg-slate-950"><ContactSection onSuccessToast={(msg) => setToastMessage(msg)} /></div>
          )}
        </main>

        <Footer />
        <WhatsAppWidget />
      </div>
    </div>
  );
}
