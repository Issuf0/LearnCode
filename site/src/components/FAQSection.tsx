import React, { useState } from 'react';
import { ChevronDown, HelpCircle, MessageSquare } from 'lucide-react';
import { COMPANY_INFO } from '../data/mockData';

interface FAQItem {
  question: string;
  answer: string;
}

const FAQ_ITEMS: FAQItem[] = [
  {
    question: 'Quanto custa um website ou sistema?',
    answer:
      'Cada projecto é único, por isso preparamos sempre um orçamento à medida, com base nas funcionalidades, na complexidade e nos prazos pretendidos. Fazemos um diagnóstico gratuito em 24h e apresentamos uma proposta detalhada por escrito, sem qualquer compromisso, antes de começarmos.',
  },
  {
    question: 'Quanto tempo demora um projecto?',
    answer:
      'Websites institucionais ficam prontos em 2 a 4 semanas. Sistemas e aplicações personalizadas levam tipicamente de 4 a 12 semanas, conforme a complexidade. O prazo é definido no contrato e pode acompanhar o progresso em tempo real no nosso Portal do Cliente.',
  },
  {
    question: 'Como funciona o pagamento?',
    answer:
      'Trabalhamos com um modelo simples e seguro: sinal de 30% a 50% do valor total antes de começarmos o desenvolvimento, e o restante na entrega. Aceitamos M-Pesa, e-Mola e transferência bancária, sempre com factura e recibo emitidos.',
  },
  {
    question: 'Como acompanho o meu projecto depois de fechar?',
    answer:
      'Cada cliente recebe acesso ao Portal do Cliente Learn Code, onde vê o progresso, milestones, contratos, faturas e documentos do projecto — além do contacto directo com a equipa pelo WhatsApp.',
  },
  {
    question: 'E se eu precisar de alterações depois da entrega?',
    answer:
      'Todos os projectos incluem um período de garantia para correcções sem custo. Depois disso, oferecemos planos de manutenção e suporte contínuo para manter a sua solução actualizada e segura.',
  },
];

export const FAQSection: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const whatsappUrl = `https://wa.me/${COMPANY_INFO.whatsappNumber.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
    'Olá Learn Code! Tenho uma dúvida que não encontrei nas FAQ do site.'
  )}`;

  return (
    <section id="faq" className="py-20 bg-white dark:bg-slate-950 text-slate-900 dark:text-white relative border-t border-slate-200 dark:border-slate-800">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900 text-blue-600 dark:text-blue-400 text-xs font-semibold uppercase tracking-wider">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Perguntas Frequentes</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Tudo o que precisa de saber{' '}
            <span className="text-blue-600 dark:text-blue-400">antes de começar.</span>
          </h2>

          <p className="text-slate-600 dark:text-slate-400 text-base sm:text-lg leading-relaxed max-w-2xl mx-auto">
            Respostas directas às dúvidas mais comuns sobre preços, prazos e como trabalhamos.
          </p>
        </div>

        {/* Accordion */}
        <div className="mt-12 space-y-3">
          {FAQ_ITEMS.map((item, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={index}
                className={`rounded-2xl border transition-all ${
                  isOpen
                    ? 'bg-slate-50 dark:bg-slate-800/50 border-blue-200 dark:border-blue-900 shadow-sm'
                    : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                }`}
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  className="w-full flex items-center justify-between gap-4 px-5 sm:px-6 py-4 sm:py-5 text-left cursor-pointer"
                >
                  <span className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
                    {item.question}
                  </span>
                  <ChevronDown
                    className={`w-5 h-5 text-blue-600 dark:text-blue-400 shrink-0 transition-transform duration-200 ${
                      isOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                {isOpen && (
                  <div className="px-5 sm:px-6 pb-5 text-sm text-slate-600 dark:text-slate-400 leading-relaxed animate-in fade-in duration-200">
                    {item.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Fallback CTA */}
        <div className="mt-10 text-center space-y-3">
          <p className="text-sm text-slate-500 dark:text-slate-400">Não encontrou a resposta que procurava?</p>
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl font-bold text-sm text-white bg-emerald-600 hover:bg-emerald-500 shadow-md shadow-emerald-600/20 transition-all cursor-pointer"
          >
            <MessageSquare className="w-4 h-4" />
            <span>Perguntar no WhatsApp</span>
          </a>
        </div>

      </div>
    </section>
  );
};
