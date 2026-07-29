import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Home, MessageSquare, SearchX } from 'lucide-react';
import { COMPANY_INFO } from '../data/mockData';

export const NotFoundPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <section className="min-h-[70vh] flex items-center justify-center px-4 py-20">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="w-20 h-20 rounded-3xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900 text-[#1a9cd8] flex items-center justify-center mx-auto">
          <SearchX className="w-10 h-10" />
        </div>

        <div className="space-y-2">
          <p className="text-6xl font-black text-slate-200 dark:text-slate-800">404</p>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">Página não encontrada</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
            O endereço que procurou não existe ou foi movido. Verifique o link ou volte à página inicial.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={() => navigate('/')}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-bold text-sm text-white bg-[#1a9cd8] hover:bg-[#29b6e8] shadow-md shadow-[#1a9cd8]/25 transition-all cursor-pointer"
          >
            <Home className="w-4 h-4" />
            <span>Voltar ao Início</span>
          </button>
          <a
            href={`https://wa.me/${COMPANY_INFO.whatsappNumber.replace(/[^0-9]/g, '')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-bold text-sm text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-all cursor-pointer"
          >
            <MessageSquare className="w-4 h-4 text-emerald-600" />
            <span>Falar Connosco</span>
          </a>
        </div>
      </div>
    </section>
  );
};
