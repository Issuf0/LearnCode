import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, Facebook, Instagram, CheckCircle2, MessageSquare, AlertCircle } from 'lucide-react';
import { COMPANY_INFO } from '../data/mockData';
import { ContactFormData } from '../types';

interface ContactSectionProps {
  onSuccessToast?: (msg: string) => void;
}

export const ContactSection: React.FC<ContactSectionProps> = ({ onSuccessToast }) => {
  const [formData, setFormData] = useState<ContactFormData>({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });

  const [sentSuccess, setSentSuccess] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof ContactFormData, string>>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const validate = (): boolean => {
    const next: Partial<Record<keyof ContactFormData, string>> = {};
    if (!formData.name.trim()) next.name = 'Indique o seu nome.';
    if (!formData.email.trim()) next.email = 'Indique o seu email.';
    else if (!/^\S+@\S+\.\S+$/.test(formData.email)) next.email = 'O email não parece válido.';
    if (!formData.message.trim()) next.message = 'Escreva a sua mensagem.';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    // A mensagem segue directamente para o WhatsApp comercial da Learn Code
    const text = `Olá Learn Code! Mensagem enviada pelo site.
*Nome:* ${formData.name}
*Email:* ${formData.email}
*Telemóvel:* ${formData.phone || 'Não indicado'}
*Assunto:* ${formData.subject || 'Contacto geral'}
*Mensagem:* ${formData.message}`;

    const url = `https://wa.me/${COMPANY_INFO.whatsappNumber.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank', 'noopener,noreferrer');

    setSentSuccess(true);
    if (onSuccessToast) {
      onSuccessToast('A abrir o WhatsApp com a sua mensagem...');
    }
  };

  return (
    <section id="contacto" className="py-20 bg-white text-slate-900 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-blue-600 text-xs font-semibold uppercase tracking-wider">
            <Mail className="w-3.5 h-3.5" />
            <span>Contacto & Atendimento</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Fale directamente com a nossa{' '}
            <span className="text-blue-600">
              equipa técnica.
            </span>
          </h2>

          <p className="text-slate-600 text-base sm:text-lg leading-relaxed">
            Estamos prontos para esclarecer dúvidas, agendar reuniões presenciais ou virtuais e discutir o seu próximo projecto.
          </p>
        </div>

        <div className="mt-14 grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">

          {/* Left Info Column */}
          <div className="lg:col-span-5 space-y-8">
            <div className="space-y-4">
              <h3 className="text-2xl font-bold text-slate-900">Canais de Atendimento Directo</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Entre em contacto connosco através do canal que lhe for mais conveniente.
              </p>
            </div>

            {/* Direct Contact Cards */}
            <div className="space-y-4">

              {/* WhatsApp Card */}
              <a
                href={`https://wa.me/${COMPANY_INFO.whatsappNumber.replace(/[^0-9]/g, '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="p-5 rounded-2xl bg-white border border-slate-200 hover:border-emerald-500 shadow-sm transition-all flex items-center gap-4 group cursor-pointer"
              >
                <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 shrink-0 group-hover:scale-105 transition-transform">
                  <Phone className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-xs text-slate-500 font-mono">WhatsApp Directo</p>
                  <p className="text-base font-bold text-slate-900 group-hover:text-emerald-600 transition-colors">
                    {COMPANY_INFO.whatsappFormatted}
                  </p>
                  <p className="text-[11px] text-emerald-600 font-semibold">Atendimento rápido em Português</p>
                </div>
              </a>

              {/* Email Card */}
              <a
                href={`mailto:${COMPANY_INFO.email}`}
                className="p-5 rounded-2xl bg-white border border-slate-200 hover:border-blue-500 shadow-sm transition-all flex items-center gap-4 group cursor-pointer"
              >
                <div className="w-12 h-12 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600 shrink-0 group-hover:scale-105 transition-transform">
                  <Mail className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-xs text-slate-500 font-mono">Email Institucional</p>
                  <p className="text-base font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                    {COMPANY_INFO.email}
                  </p>
                  <p className="text-[11px] text-slate-500">Resposta em até 24 horas</p>
                </div>
              </a>

              {/* Location Card */}
              <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-700 shrink-0">
                  <MapPin className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-xs text-slate-500 font-mono">Localização</p>
                  <p className="text-base font-bold text-slate-900">{COMPANY_INFO.address}</p>
                  <p className="text-[11px] text-slate-500">Atendimento presencial mediante marcação</p>
                </div>
              </div>

            </div>

            {/* Social Networks List */}
            <div className="space-y-3 pt-2">
              <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Siga a Learn Code nas Redes</p>
              <div className="flex items-center gap-3">
                <a
                  href={COMPANY_INFO.socials.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-xl bg-slate-100 border border-slate-200 hover:border-blue-500 flex items-center justify-center text-slate-600 hover:text-blue-600 transition-colors cursor-pointer"
                  title="Facebook"
                >
                  <Facebook className="w-5 h-5" />
                </a>

                <a
                  href={COMPANY_INFO.socials.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-xl bg-slate-100 border border-slate-200 hover:border-pink-500 flex items-center justify-center text-slate-600 hover:text-pink-600 transition-colors cursor-pointer"
                  title="Instagram"
                >
                  <Instagram className="w-5 h-5" />
                </a>


              </div>
            </div>

            {/* Friendly Closing Quote */}
            <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm text-center">
              <blockquote className="text-lg font-bold text-slate-900 italic">
                "Vamos construir o seu próximo projecto juntos."
              </blockquote>
              <p className="text-xs text-blue-600 mt-1 font-medium">Equipa Learn Code Moçambique</p>
            </div>

          </div>

          {/* Right Contact Form Column */}
          <div className="lg:col-span-7 bg-slate-50 border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm">
            <h3 className="text-xl font-bold text-slate-900 mb-2">Envie-nos uma Mensagem</h3>
            <p className="text-slate-500 text-xs mb-6">
              Preencha o formulário para questões gerais, suporte técnico ou parcerias.
            </p>

            {sentSuccess ? (
              <div className="py-12 text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-emerald-100 border border-emerald-500 text-emerald-600 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h4 className="text-2xl font-bold text-slate-900">Mensagem Encaminhada!</h4>
                <p className="text-slate-600 text-sm max-w-sm mx-auto">
                  A sua mensagem foi encaminhada para o nosso WhatsApp comercial. Responderemos o mais rápido possível.
                </p>
                <button
                  onClick={() => {
                    setSentSuccess(false);
                    setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
                  }}
                  className="px-5 py-2.5 rounded-xl bg-white border border-slate-200 text-xs text-slate-700 hover:bg-slate-100 cursor-pointer"
                >
                  Enviar outra mensagem
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-700">Seu Nome</label>
                    <input
                      type="text"
                      name="name"
                      placeholder="Ex: Carlos Sitoe"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500 transition-colors"
                    />
                    {errors.name && <p className="text-[11px] text-rose-600 font-medium flex items-center gap-1"><AlertCircle className="w-3 h-3" />{errors.name}</p>}
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-700">Email</label>
                    <input
                      type="email"
                      name="email"
                      placeholder="seu.email@dominio.co.mz"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500 transition-colors"
                    />
                    {errors.email && <p className="text-[11px] text-rose-600 font-medium flex items-center gap-1"><AlertCircle className="w-3 h-3" />{errors.email}</p>}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-700">Telemóvel / WhatsApp</label>
                    <input
                      type="text"
                      name="phone"
                      placeholder="+258 84 000 0000"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500 transition-colors"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-700">Assunto</label>
                    <input
                      type="text"
                      name="subject"
                      placeholder="Ex: Informações sobre Cursos / Parceria"
                      value={formData.subject}
                      onChange={handleChange}
                      className="w-full px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500 transition-colors"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">Mensagem</label>
                  <textarea
                    name="message"
                    rows={4}
                    placeholder="Escreva a sua mensagem aqui..."
                    value={formData.message}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500 transition-colors resize-y"
                  />
                    {errors.message && <p className="text-[11px] text-rose-600 font-medium flex items-center gap-1"><AlertCircle className="w-3 h-3" />{errors.message}</p>}
                </div>

                <button
                  type="submit"
                  className="w-full py-3 px-6 rounded-xl font-bold text-xs text-white bg-emerald-600 hover:bg-emerald-500 shadow-sm flex items-center justify-center gap-2 cursor-pointer"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Enviar via WhatsApp</span>
                  <Send className="w-3.5 h-3.5" />
                </button>
              </form>
            )}
          </div>

        </div>

      </div>
    </section>
  );
};
