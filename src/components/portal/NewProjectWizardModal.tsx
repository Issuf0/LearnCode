import React, { useState } from 'react';
import {
  Globe,
  Smartphone,
  Monitor,
  Bot,
  Palette,
  Lightbulb,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  X,
  Upload,
  FileText,
  Calendar,
  DollarSign
} from 'lucide-react';
import { Project, Quotation } from '../../types';

interface NewProjectWizardModalProps {
  isOpen: boolean;
  onClose: () => void;
  onProjectCreated: (newProject: Project, newQuotation: Quotation) => void;
}

export const NewProjectWizardModal: React.FC<NewProjectWizardModalProps> = ({
  isOpen,
  onClose,
  onProjectCreated
}) => {
  const [currentStep, setCurrentStep] = useState(1);

  // Form State
  const [selectedType, setSelectedType] = useState('Website Corporativo / Sistema Web');
  const [projectName, setProjectName] = useState('');
  const [projectDescription, setProjectDescription] = useState('');
  const [selectedBudget, setSelectedBudget] = useState('50.000,00 MZN — 100.000,00 MZN');
  const [desiredTimeline, setDesiredTimeline] = useState('Médio prazo (2 a 3 meses)');
  const [uploadedFileNames, setUploadedFileNames] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const projectTypesOptions = [
    { id: 'web', title: 'Website / Portal Web', desc: 'Sites institucionais, e-commerce e portais de serviço', icon: Globe },
    { id: 'mobile', title: 'Aplicação Móvel', desc: 'Apps nativas ou híbridas para Android e iOS', icon: Smartphone },
    { id: 'desktop', title: 'Sistema Desktop / ERP', desc: 'Software de gestão empresarial e faturação', icon: Monitor },
    { id: 'ai', title: 'Inteligência Artificial & Bot', desc: 'Assistentes virtuais, IA e automação inteligente', icon: Bot },
    { id: 'design', title: 'Design & Branding UI/UX', desc: 'Identidade visual, protótipos e materiais de marca', icon: Palette },
    { id: 'consulting', title: 'Consultoria Tecnológica', desc: 'Arquitectura cloud, segurança e diagnóstico de TI', icon: Lightbulb },
  ];

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const names = Array.from(e.target.files).map((f: File) => f.name);
      setUploadedFileNames([...uploadedFileNames, ...names]);
    }
  };

  const handleSubmit = () => {
    setIsSubmitting(true);

    const generatedId = `prj-${Math.floor(100 + Math.random() * 900)}`;
    const generatedQuoteId = `QT-2026-${Math.floor(100 + Math.random() * 900)}`;

    const newProject: Project = {
      id: generatedId,
      name: projectName || `${selectedType} - ${new Date().toLocaleDateString('pt-PT')}`,
      description: projectDescription || 'Projecto submetido através do assistente do Portal do Cliente.',
      category: selectedType,
      status: 'Planeamento',
      progress: 5,
      techStack: ['React', 'Node.js', 'PostgreSQL', 'Tailwind CSS'],
      projectManager: {
        name: 'Albino Mabunda',
        role: 'Lead Architect',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
        email: 'albino@learncode.co.mz',
        phone: '+258 84 000 0000',
      },
      startDate: new Date().toLocaleDateString('pt-PT'),
      deadline: 'Em definição',
      estimatedDelivery: '30 a 60 dias',
      milestones: [
        { id: 'm1', title: 'Revisão Técnica do Briefing', dueDate: 'Em breve', completed: true, percentage: 100 },
        { id: 'm2', title: 'Emissão de Proposta & Contrato', dueDate: 'Em breve', completed: false, percentage: 0 },
      ],
      tasks: [
        { id: 't1', title: 'Análise de viabilidade técnica', status: 'in_progress', assignedTo: 'Albino Mabunda' },
      ],
      recentUpdates: ['Solicitação recebida com sucesso pela equipa técnica Learn Code.'],
      comments: [],
      timelineHistory: [
        { id: 'tl1', date: 'Hoje', title: 'Solicitação Registada', description: 'Pedido recebido via Portal do Cliente.', status: 'completed', category: 'contract' },
      ],
    };

    const newQuotation: Quotation = {
      id: generatedQuoteId.toLowerCase(),
      code: generatedQuoteId,
      projectTitle: newProject.name,
      priceMzn: selectedBudget,
      priceUsd: '$1,200 USD',
      estimatedTime: desiredTimeline,
      technologies: ['React', 'TypeScript', 'Node.js'],
      description: projectDescription,
      status: 'Pendente',
      date: new Date().toLocaleDateString('pt-PT'),
    };

    setTimeout(() => {
      setIsSubmitting(false);
      setCurrentStep(7); // Success Step
      onProjectCreated(newProject, newQuotation);
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-800/40">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
              Assistente de Novo Projecto
            </span>
            <h2 className="text-lg font-extrabold text-slate-900 dark:text-white">
              Solicitar Nova Solução Tecnológica
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Progress Step Bar */}
        {currentStep <= 6 && (
          <div className="px-6 py-3 bg-slate-100 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1.5">
              <span>Passo {currentStep} de 6</span>
              <span className="text-blue-600 dark:text-blue-400 font-bold">
                {currentStep === 1 && 'Tipo de Solução'}
                {currentStep === 2 && 'Detalhes do Projecto'}
                {currentStep === 3 && 'Orçamento Estimado'}
                {currentStep === 4 && 'Prazo Desejado'}
                {currentStep === 5 && 'Ficheiros de Apoio'}
                {currentStep === 6 && 'Revisão Final'}
              </span>
            </div>
            <div className="w-full h-1.5 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
              <div
                className="h-full bg-blue-600 transition-all duration-300"
                style={{ width: `${(currentStep / 6) * 100}%` }}
              />
            </div>
          </div>
        )}

        {/* Wizard Step Content */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">

          {/* STEP 1: Choose Type */}
          {currentStep === 1 && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Qual é a categoria principal da solução que pretende desenvolver?
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {projectTypesOptions.map((opt) => {
                  const Icon = opt.icon;
                  const isSelected = selectedType === opt.title;
                  return (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => setSelectedType(opt.title)}
                      className={`p-4 rounded-2xl border text-left transition-all cursor-pointer flex items-start gap-3.5 ${
                        isSelected
                          ? 'bg-blue-50 dark:bg-blue-950/80 border-blue-600 dark:border-blue-500 ring-2 ring-blue-600/20 shadow-md'
                          : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                      }`}
                    >
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                        isSelected ? 'bg-blue-600 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                      }`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-slate-900 dark:text-white">{opt.title}</h4>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-tight mt-0.5">{opt.desc}</p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 2: Project Details */}
          {currentStep === 2 && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Descreva os detalhes e objetivos do seu projecto
              </h3>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Nome do Projecto / Identificador
                </label>
                <input
                  type="text"
                  placeholder="Ex: Portal de Vendas & App Mobile Enterprise"
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Descrição dos Requisitos & Público-Alvo
                </label>
                <textarea
                  rows={4}
                  placeholder="Descreva resumidamente as funcionalidades desejadas, integrações necessárias ou problemas a resolver..."
                  value={projectDescription}
                  onChange={(e) => setProjectDescription(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>
          )}

          {/* STEP 3: Budget Range */}
          {currentStep === 3 && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Qual é a estimativa de investimento prevista em MZN?
              </h3>

              <div className="space-y-2">
                {[
                  'Até 25.000,00 MZN',
                  '25.000,00 MZN — 50.000,00 MZN',
                  '50.000,00 MZN — 100.000,00 MZN',
                  '100.000,00 MZN — 250.000,00 MZN',
                  'Mais de 250.000,00 MZN',
                  'Ainda a definir / Preciso de recomendação técnica',
                ].map((b, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setSelectedBudget(b)}
                    className={`w-full p-3.5 rounded-xl border text-xs font-bold text-left transition-colors cursor-pointer flex items-center justify-between ${
                      selectedBudget === b
                        ? 'bg-blue-50 dark:bg-blue-950/80 border-blue-600 text-blue-600 dark:text-blue-400'
                        : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <span>{b}</span>
                    {selectedBudget === b && <CheckCircle2 className="w-4 h-4 text-blue-600" />}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* STEP 4: Deadline */}
          {currentStep === 4 && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Qual é a expectativa de prazo para a entrega do projecto?
              </h3>

              <div className="space-y-2">
                {[
                  'Urgente (1 a 2 semanas)',
                  'Curto prazo (1 mês)',
                  'Médio prazo (2 a 3 meses)',
                  'Longo prazo (+ 3 meses)',
                  'Flexível / Em fase de planeamento',
                ].map((t, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setDesiredTimeline(t)}
                    className={`w-full p-3.5 rounded-xl border text-xs font-bold text-left transition-colors cursor-pointer flex items-center justify-between ${
                      desiredTimeline === t
                        ? 'bg-blue-50 dark:bg-blue-950/80 border-blue-600 text-blue-600 dark:text-blue-400'
                        : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <span>{t}</span>
                    {desiredTimeline === t && <CheckCircle2 className="w-4 h-4 text-blue-600" />}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* STEP 5: File Attachments */}
          {currentStep === 5 && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Deseja anexar documentos de apoio ou briefings? (Opcional)
              </h3>

              <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-950 border-2 border-dashed border-slate-300 dark:border-slate-800 text-center space-y-3 relative cursor-pointer hover:border-blue-500 transition-colors">
                <input
                  type="file"
                  multiple
                  onChange={handleFileUpload}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                />
                <Upload className="w-8 h-8 text-blue-600 mx-auto" />
                <div>
                  <p className="text-xs font-bold text-slate-900 dark:text-white">
                    Clique ou arraste ficheiros (PDF, DOCX, PNG, ZIP até 25MB)
                  </p>
                  <p className="text-[11px] text-slate-400">
                    Anexe os Termos de Referência, requisitos de marca ou esboços
                  </p>
                </div>
              </div>

              {uploadedFileNames.length > 0 && (
                <div className="space-y-1">
                  <p className="text-xs font-bold text-slate-700 dark:text-slate-300">Ficheiros Anexados:</p>
                  {uploadedFileNames.map((fn, idx) => (
                    <div key={idx} className="p-2 rounded-lg bg-blue-50 dark:bg-blue-950 text-xs text-blue-600 dark:text-blue-400 flex items-center gap-2">
                      <FileText className="w-3.5 h-3.5" />
                      <span className="truncate">{fn}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* STEP 6: Review Summary */}
          {currentStep === 6 && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Revise os dados antes de submeter à equipa Learn Code
              </h3>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 space-y-3 text-xs">
                <div>
                  <span className="text-slate-400 block font-medium">Categoria</span>
                  <span className="font-bold text-slate-900 dark:text-white">{selectedType}</span>
                </div>
                <div>
                  <span className="text-slate-400 block font-medium">Nome do Projecto</span>
                  <span className="font-bold text-slate-900 dark:text-white">{projectName || 'Projecto Personalizado'}</span>
                </div>
                <div>
                  <span className="text-slate-400 block font-medium">Orçamento Estimado</span>
                  <span className="font-bold text-blue-600 dark:text-blue-400">{selectedBudget}</span>
                </div>
                <div>
                  <span className="text-slate-400 block font-medium">Prazo Pretendido</span>
                  <span className="font-bold text-slate-900 dark:text-white">{desiredTimeline}</span>
                </div>
                {projectDescription && (
                  <div>
                    <span className="text-slate-400 block font-medium">Descrição</span>
                    <p className="text-slate-700 dark:text-slate-300 italic">{projectDescription}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* STEP 7: Success State */}
          {currentStep === 7 && (
            <div className="py-8 text-center space-y-6 animate-in zoom-in-95 duration-300">
              <div className="w-20 h-20 bg-emerald-100 dark:bg-emerald-950 border-2 border-emerald-500 rounded-full flex items-center justify-center text-emerald-600 dark:text-emerald-400 mx-auto shadow-xl shadow-emerald-500/20">
                <CheckCircle2 className="w-10 h-10 animate-bounce" />
              </div>

              <div className="space-y-2">
                <span className="text-xs font-mono font-bold uppercase text-emerald-600 dark:text-emerald-400 tracking-wider">
                  Projecto Submetido com Sucesso
                </span>
                <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white">
                  Obrigado pela confiança!
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 max-w-md mx-auto">
                  A nossa equipa técnica já foi notificada. Foi gerado um registo na sua lista de projectos e orçamentos.
                </p>
              </div>

              <div className="flex justify-center pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-8 py-3 rounded-xl font-bold text-xs text-white bg-blue-600 hover:bg-blue-700 shadow-md cursor-pointer"
                >
                  Ir para os Meus Projectos
                </button>
              </div>
            </div>
          )}

        </div>

        {/* Navigation Buttons */}
        {currentStep <= 6 && (
          <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 flex items-center justify-between">
            <button
              type="button"
              disabled={currentStep === 1}
              onClick={() => setCurrentStep(currentStep - 1)}
              className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 disabled:opacity-40 flex items-center gap-1.5 cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Anterior</span>
            </button>

            {currentStep < 6 ? (
              <button
                type="button"
                onClick={() => setCurrentStep(currentStep + 1)}
                className="px-6 py-2.5 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 flex items-center gap-1.5 cursor-pointer shadow-md"
              >
                <span>Próximo</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="button"
                disabled={isSubmitting}
                onClick={handleSubmit}
                className="px-8 py-2.5 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 flex items-center gap-1.5 cursor-pointer shadow-md"
              >
                {isSubmitting ? 'A registar...' : 'Submeter Projecto'}
              </button>
            )}
          </div>
        )}

      </div>
    </div>
  );
};
