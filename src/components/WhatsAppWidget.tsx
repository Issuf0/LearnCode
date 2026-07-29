import React, { useState } from 'react';
import { MessageSquare, X, Send } from 'lucide-react';
import { COMPANY_INFO } from '../data/mockData';

export const WhatsAppWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [quickMsg, setQuickMsg] = useState('Olá! Gostaria de informações sobre os serviços da Learn Code.');

  const handleSend = () => {
    const url = `https://wa.me/${COMPANY_INFO.whatsappNumber.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(quickMsg)}`;
    window.open(url, '_blank');
    setIsOpen(false);
  };

  const directUrl = `https://wa.me/${COMPANY_INFO.whatsappNumber.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
    'Olá Learn Code! Gostaria de pedir um orçamento.'
  )}`;

  return (
    <>
    {/* Mobile: fixed bottom CTA bar (sempre visível, converte mais que um ícone) */}
    <div className="sm:hidden fixed bottom-0 left-0 right-0 z-40 p-3 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 shadow-[0_-4px_20px_rgba(0,0,0,0.08)]">
      <a
        href={directUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="w-full flex items-center justify-center gap-2.5 px-5 py-3.5 rounded-xl font-bold text-sm text-white bg-emerald-600 active:bg-emerald-700 shadow-md"
      >
        <MessageSquare className="w-5 h-5" />
        <span>Pedir Orçamento no WhatsApp</span>
      </a>
    </div>

    {/* Desktop: floating widget */}
    <div className="hidden sm:flex fixed bottom-6 right-6 z-40 flex-col items-end">
      {/* Quick Chat Popup */}
      {isOpen && (
        <div className="mb-4 w-80 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-4 text-white animate-in slide-in-from-bottom duration-200">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-emerald-500/20 border border-emerald-500/50 flex items-center justify-center text-emerald-400">
                <MessageSquare className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-bold">Atendimento Learn Code</p>
                <p className="text-[10px] text-emerald-400">Online no WhatsApp</p>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="p-1 rounded text-slate-400 hover:text-white cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="py-3 text-xs text-slate-300 space-y-2">
            <p className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 leading-relaxed">
              👋 Olá! Como podemos ajudar o seu negócio ou instituição hoje?
            </p>

            <textarea
              rows={2}
              value={quickMsg}
              onChange={(e) => setQuickMsg(e.target.value)}
              className="w-full p-2 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-100 focus:outline-none focus:border-emerald-500 resize-none"
            />
          </div>

          <button
            onClick={handleSend}
            className="w-full py-2.5 px-4 rounded-xl font-bold text-xs text-white bg-emerald-600 hover:bg-emerald-500 flex items-center justify-center gap-2 shadow-md shadow-emerald-600/30 cursor-pointer"
          >
            <span>Iniciar Conversa</span>
            <Send className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Floating Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative group p-4 rounded-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold shadow-xl shadow-emerald-500/30 transition-all hover:scale-105 active:scale-95 cursor-pointer flex items-center justify-center"
        title="Falar no WhatsApp"
        aria-label="Atendimento WhatsApp"
      >
        <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-emerald-400 border-2 border-slate-950 animate-ping"></span>
        <MessageSquare className="w-6 h-6 fill-current" />
      </button>
    </div>
    </>
  );
};
