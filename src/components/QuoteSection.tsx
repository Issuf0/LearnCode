import React, { useState, useEffect } from 'react';
import { Send, CheckCircle2, Calculator, ShieldCheck, MessageSquare, AlertCircle } from 'lucide-react';
import { PROJECT_TYPES, BUDGET_RANGES, TIMELINES, COMPANY_INFO } from '../data/mockData';
import { QuoteFormData } from '../types';

interface QuoteSectionProps {
  preselectedService?: string;
  onSuccessToast?: (msg: string) => void;
}

export const QuoteSection: React.FC<QuoteSectionProps> = ({ preselectedService, onSuccessToast }) => {
  const [formData, setFormData] = useState<QuoteFormData>({
    fullName: '',
    company: '',
    email: '',
    whatsapp: '',
    projectType: PROJECT_TYPES[0],
    estimatedBudget: BUDGET_RANGES[1],
    desiredTimeline: TIMELINES[1],
    description: '',
  });

  useEffect(() => {
    if (preselectedService) {
      // match or set projectType
      const match = PROJECT_TYPES.find((pt) => pt.toLowerCase().includes(preselectedService.toLowerCase()));
      if (match) {
        setFormData((prev) => ({ ...prev, projectType: match }));
      } else {
        setFormData((prev) => ({ ...prev, projectType: preselectedService }));
      }
    }
  }, [preselectedService]);

  const [submittedRef, setSubmittedRef] = useState<string | null>(null);
  const [errors, setErrors] = useState<Partial<Record<keyof QuoteFormData, string>>>({});

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Limpa o erro do campo assim que o utilizador começa a corrigir
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const validate = (): boolean => {
    const next: Partial<Record<keyof QuoteFormData, string>> = {};
    if (!formData.fullName.trim()) next.fullName = 'Indique o seu nome completo.';
    if (!formData.email.trim()) next.email = 'Indique o seu email.';
    else if (!/^\S+@\S+\.\S+$/.test(formData.email)) next.email = 'O email não parece válido.';
    if (!formData.whatsapp.trim()) next.whatsapp = 'Indique o seu número de WhatsApp.';
    if (!formData.description.trim()) next.description = 'Descreva o seu projecto.';
    else if (formData.description.trim().length < 20) next.description = 'A descrição deve ter pelo menos 20 caracteres.';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const buildWhatsAppUrl = (refNum: string) => {
    const text = `Olá Learn Code! Gostaria de pedir um orçamento (Ref: ${refNum}).
*Nome:* ${formData.fullName}
*Empresa:* ${formData.company || 'Particular'}
*Email:* ${formData.email}
*WhatsApp:* ${formData.whatsapp}
*Tipo de Projecto:* ${formData.projectType}
*Orçamento:* ${formData.estimatedBudget}
*Prazo:* ${formData.desiredTimeline}
*Descrição:* ${formData.description}`;

    return `https://wa.me/${COMPANY_INFO.whatsappNumber.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(text)}`;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const refNum = `LC-MZ-${Math.floor(100000 + Math.random() * 900000)}`;
    setSubmittedRef(refNum);

    // O pedido segue directamente para o WhatsApp comercial da Learn Code
    window.open(buildWhatsAppUrl(refNum), '_blank', 'noopener,noreferrer');

    if (onSuccessToast) {
      onSuccessToast('A abrir o WhatsApp com o seu pedido de orçamento...');
    }
  };

  const generateWhatsAppMessage = () => buildWhatsAppUrl(submittedRef || '');

  const resetForm = () => {
    setSubmittedRef(null);
    setFormData({
      fullName: '',
      company: '',
      email: '',
      whatsapp: '',
      projectType: PROJECT_TYPES[0],
      estimatedBudget: BUDGET_RANGES[1],
      desiredTimeline: TIMELINES[1],
      description: '',
    });
  };

  return (
    <section id="orcamento" className="py-20 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900 text-blue-600 dark:text-blue-400 text-xs font-semibold uppercase tracking-wider">
            <Calculator className="w-3.5 h-3.5" />
            <span>Solicitar Orçamento</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Pronto para transformar a sua ideia em{' '}
            <span className="text-blue-600 dark:text-blue-400">
              realidade digital?
            </span>
          </h2>

          <p className="text-slate-600 dark:text-slate-400 text-base sm:text-lg leading-relaxed">
            Conte-nos a sua ideia e ajudaremos a transformá-la em realidade. Receba uma proposta técnica e financeira detalhada em menos de 24 horas.
          </p>
        </div>

        {/* Form Container */}
        <div className="mt-12 max-w-4xl mx-auto bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-10 shadow-sm relative">

          {submittedRef ? (
            /* Success Feedback Card */
            <div className="py-12 px-4 text-center space-y-6">
              <div className="w-20 h-20 bg-emerald-100 dark:bg-emerald-950/50 border-2 border-emerald-500 rounded-full flex items-center justify-center text-emerald-600 mx-auto shadow-md">
                <CheckCircle2 className="w-10 h-10 animate-bounce" />
              </div>

              <div className="space-y-2">
                <span className="text-xs font-mono font-bold uppercase text-blue-600 dark:text-blue-400 tracking-wider">
                  Pedido Registado com Sucesso
                </span>
                <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
                  Obrigado, {formData.fullName}!
                </h3>
                <p className="text-slate-600 dark:text-slate-400 text-sm max-w-md mx-auto">
                  O seu pedido foi encaminhado para o nosso WhatsApp comercial. Se a janela não abriu automaticamente, use o botão abaixo.
                </p>
              </div>

              {/* Reference Badge */}
              <div className="inline-block p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 space-y-1">
                <p className="text-[11px] font-mono text-slate-500 dark:text-slate-400 uppercase">Número de Referência do Pedido</p>
                <p className="text-2xl font-mono font-extrabold text-blue-600 dark:text-blue-400">{submittedRef}</p>
                <p className="text-[11px] text-emerald-600 font-semibold">Tempo estimado de resposta: &lt; 24 horas</p>
              </div>

              {/* Direct WhatsApp CTA */}
              <div className="pt-4 max-w-md mx-auto space-y-3">
                <a
                  href={generateWhatsAppMessage()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-2.5 px-6 py-4 rounded-xl font-bold text-white bg-emerald-600 hover:bg-emerald-700 shadow-md transition-all cursor-pointer"
                >
                  <MessageSquare className="w-5 h-5" />
                  <span>Acelerar resposta no WhatsApp</span>
                </a>

                <button
                  onClick={resetForm}
                  className="text-xs text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white underline cursor-pointer"
                >
                  Enviar novo pedido de orçamento
                </button>
              </div>
            </div>
          ) : (
            /* Main Form */
            <form onSubmit={handleSubmit} className="space-y-8">

              {/* Personal & Company Info */}
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-2 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 text-xs flex items-center justify-center font-bold">1</span>
                  <span>Identificação do Cliente / Instituição</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Nome */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1">
                      <span>Nome Completo</span>
                      <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="fullName"
                      placeholder="Ex: Albino Mabunda"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:bg-white dark:focus:bg-slate-800 transition-colors"
                    />
                    {errors.fullName && <p className="text-[11px] text-rose-600 font-medium flex items-center gap-1"><AlertCircle className="w-3 h-3" />{errors.fullName}</p>}
                  </div>

                  {/* Empresa / Instituição */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                      Empresa / Instituição (Opcional)
                    </label>
                    <input
                      type="text"
                      name="company"
                      placeholder="Ex: BCI / Startup X / Particular"
                      value={formData.company}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:bg-white dark:focus:bg-slate-800 transition-colors"
                    />
                  </div>

                  {/* Email */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1">
                      <span>Endereço de Email</span>
                      <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="email"
                      name="email"
                      placeholder="exemplo@empresa.co.mz"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:bg-white dark:focus:bg-slate-800 transition-colors"
                    />
                    {errors.email && <p className="text-[11px] text-rose-600 font-medium flex items-center gap-1"><AlertCircle className="w-3 h-3" />{errors.email}</p>}
                  </div>

                  {/* WhatsApp */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1">
                      <span>WhatsApp / Contacto Telefónico</span>
                      <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="whatsapp"
                      placeholder="+258 84/85/86/87 000 0000"
                      value={formData.whatsapp}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:bg-white dark:focus:bg-slate-800 transition-colors"
                    />
                    {errors.whatsapp && <p className="text-[11px] text-rose-600 font-medium flex items-center gap-1"><AlertCircle className="w-3 h-3" />{errors.whatsapp}</p>}
                  </div>
                </div>
              </div>

              {/* Project Scope & Specifications */}
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-2 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 text-xs flex items-center justify-center font-bold">2</span>
                  <span>Especificações do Projecto</span>
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Tipo de projecto */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Tipo de Projecto</label>
                    <select
                      name="projectType"
                      value={formData.projectType}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-blue-500 focus:bg-white dark:focus:bg-slate-800 transition-colors"
                    >
                      {PROJECT_TYPES.map((pt, i) => (
                        <option key={i} value={pt}>
                          {pt}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Orçamento estimado */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Orçamento Estimado (MZN)</label>
                    <select
                      name="estimatedBudget"
                      value={formData.estimatedBudget}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-blue-500 focus:bg-white dark:focus:bg-slate-800 transition-colors"
                    >
                      {BUDGET_RANGES.map((b, i) => (
                        <option key={i} value={b}>
                          {b}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Prazo desejado */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Prazo Desejado</label>
                    <select
                      name="desiredTimeline"
                      value={formData.desiredTimeline}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-blue-500 focus:bg-white dark:focus:bg-slate-800 transition-colors"
                    >
                      {TIMELINES.map((t, i) => (
                        <option key={i} value={t}>
                          {t}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Descrição do projecto */}
                <div className="space-y-1.5 pt-2">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center justify-between">
                    <span className="flex items-center gap-1">
                      <span>Descrição do Projecto / Objetivos</span>
                      <span className="text-rose-500">*</span>
                    </span>
                    <span className="text-[10px] text-slate-400">Mínimo 20 caracteres</span>
                  </label>
                  <textarea
                    name="description"
                    rows={4}
                    placeholder="Explique resumidamente os seus objetivos, funcionalidades desejadas, público-alvo ou quaisquer requisitos específicos..."
                    value={formData.description}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:bg-white dark:focus:bg-slate-800 transition-colors resize-y"
                  />
                  {errors.description && <p className="text-[11px] text-rose-600 font-medium flex items-center gap-1"><AlertCircle className="w-3 h-3" />{errors.description}</p>}
                </div>

              </div>

              {/* Submit Bar & Helper text */}
              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-4">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Os seus dados estão protegidos sob total confidencialidade.</span>
                  </div>

                  <button
                    type="submit"
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-xl font-bold text-base text-white bg-emerald-600 hover:bg-emerald-500 shadow-md shadow-emerald-600/20 transition-all cursor-pointer"
                  >
                    <MessageSquare className="w-5 h-5" />
                    <span>Pedir Orçamento no WhatsApp</span>
                    <Send className="w-4 h-4" />
                  </button>
                </div>

                <p className="text-center text-xs text-slate-500 dark:text-slate-400 italic">
                  “Conte-nos a sua ideia e ajudaremos a transformá-la em realidade.”
                </p>
              </div>

            </form>
          )}

        </div>

      </div>
    </section>
  );
};
