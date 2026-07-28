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
      'Trabalhamos com faixas de referência claras: landing pages de 3.500 a 7.000 MT, websites institucionais de 8.000 a 20.000 MT, lojas online de 20.000 a 45.000 MT, apps móveis a partir de 25.000 MT e sistemas com IA a partir de 20.000 MT. O valor final depende das funcionalidades e é sempre confirmado por escrito antes de começarmos — diagnóstico gratuito em 24h.',
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
    <section id="faq" className="py-20 bg-white text-slate-900 relative border-t border-slate-200">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-blue-600 text-xs font-semibold uppercase tracking-wider">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Perguntas Frequentes</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Tudo o que precisa de saber{' '}
            <span className="text-blue-600">antes de começar.</span>
          </h2>

          <p className="text-slate-600 text-base sm:text-lg leading-relaxed max-w-2xl mx-auto">
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
                    ? 'bg-slate-50 border-blue-200 shadow-sm'
                    : 'bg-white border-slate-200 hover:border-slate-300'
                }`}
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  className="w-full flex items-center justify-between gap-4 px-5 sm:px-6 py-4 sm:py-5 text-left cursor-pointer"
                >
                  <span className="text-sm sm:text-base font-bold text-slate-900">
                    {item.question}
                  </span>
                  <ChevronDown
                    className={`w-5 h-5 text-blue-600 shrink-0 transition-transform duration-200 ${
                      isOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                {isOpen && (
                  <div className="px-5 sm:px-6 pb-5 text-sm text-slate-600 leading-relaxed animate-in fade-in duration-200">
                    {item.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Fallback CTA */}
        <div className="mt-10 text-center space-y-3">
          <p className="text-sm text-slate-500">Não encontrou a resposta que procurava?</p>
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
