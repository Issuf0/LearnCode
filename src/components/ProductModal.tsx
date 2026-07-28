import React from 'react';
import { X, CheckCircle2, ArrowRight, Code, Users, Rocket, ExternalLink } from 'lucide-react';
import { ProductItem } from '../types';

interface ProductModalProps {
  product: ProductItem | null;
  onClose: () => void;
  onInquire: (productName: string) => void;
}

export const ProductModal: React.FC<ProductModalProps> = ({ product, onClose, onInquire }) => {
  if (!product) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">

        {/* Modal Header */}
        <div className="p-6 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-950 border border-blue-800 flex items-center justify-center text-sky-400">
              <Code className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-bold text-white">{product.name}</h3>
                <span
                  className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full border ${
                    product.status === 'Activo'
                      ? 'bg-emerald-950/80 text-emerald-400 border-emerald-800/60'
                      : 'bg-amber-950/80 text-amber-400 border-amber-800/60'
                  }`}
                >
                  {product.status}
                </span>
              </div>
              <p className="text-xs text-sky-400 font-medium">{product.tagline}</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-sm text-slate-300">

          {/* Description */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Descrição do Produto</h4>
            <p className="text-slate-200 leading-relaxed text-base">{product.description}</p>
          </div>

          {/* Impact Summary */}
          <div className="p-4 rounded-xl bg-slate-950/80 border border-blue-900/40 space-y-1">
            <div className="flex items-center gap-2 text-sky-400 font-bold text-xs uppercase tracking-wider">
              <Rocket className="w-3.5 h-3.5" />
              <span>Impacto & Resultados</span>
            </div>
            <p className="text-slate-300 text-xs leading-relaxed">{product.impactSummary}</p>
          </div>

          {/* Features */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Funcionalidades Principais</h4>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {product.features.map((feat, i) => (
                <li key={i} className="flex items-start gap-2 p-2.5 rounded-lg bg-slate-950/50 border border-slate-800/60 text-xs text-slate-200">
                  <CheckCircle2 className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
                  <span>{feat}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Target Audience & Tech Stack */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 space-y-1">
              <div className="flex items-center gap-1.5 text-slate-400 text-xs font-semibold">
                <Users className="w-3.5 h-3.5 text-sky-400" />
                <span>Público-Alvo</span>
              </div>
              <p className="text-xs text-slate-300">{product.targetAudience}</p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 space-y-1">
              <div className="flex items-center gap-1.5 text-slate-400 text-xs font-semibold">
                <Rocket className="w-3.5 h-3.5 text-sky-400" />
                <span>Tecnologias Envolvidas</span>
              </div>
              <div className="flex flex-wrap gap-1.5 pt-1">
                {product.techStack.map((tech, idx) => (
                  <span key={idx} className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-950/80 text-sky-300 border border-blue-800/50">
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          </div>

        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between gap-4">
          <p className="text-xs text-slate-400 hidden sm:block">
            Interessado em integrar este produto na sua instituição?
          </p>

          <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-medium text-slate-300 hover:text-white bg-slate-800 border border-slate-700 cursor-pointer"
            >
              Fechar
            </button>

            <button
              onClick={() => {
                onInquire(product.name);
                onClose();
              }}
              className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-blue-600 to-sky-500 hover:from-blue-500 hover:to-sky-400 shadow-md shadow-blue-600/30 flex items-center gap-2 cursor-pointer"
            >
              <span>Pedir Parceria / Demonstração</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
