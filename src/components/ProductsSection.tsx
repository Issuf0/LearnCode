import React, { useState } from 'react';
import { Package, ArrowRight, CheckCircle2, ChevronRight, Info } from 'lucide-react';
import { PRODUCTS } from '../data/mockData';
import { ProductItem } from '../types';
import { ProductModal } from './ProductModal';

interface ProductsSectionProps {
  onInquireProduct: (productName: string) => void;
}

export const ProductsSection: React.FC<ProductsSectionProps> = ({ onInquireProduct }) => {
  const [selectedProduct, setSelectedProduct] = useState<ProductItem | null>(null);

  const scrollToQuote = (productName: string) => {
    onInquireProduct(productName);
  };

  return (
    <section id="produtos" className="py-20 bg-slate-50 text-slate-900 relative border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-blue-600 text-xs font-semibold uppercase tracking-wider">
            <Package className="w-3.5 h-3.5" />
            <span>Produtos e Iniciativas</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Tecnologia de alto impacto com{' '}
            <span className="text-blue-600">
              Selo Moçambicano.
            </span>
          </h2>

          <p className="text-slate-600 text-base sm:text-lg leading-relaxed">
            Desenvolvemos plataformas proprietárias focadas em educação, automação legal, cidades inteligentes e soluções de inteligência artificial.
          </p>
        </div>

        {/* Products Grid */}
        <div className="mt-14 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {PRODUCTS.map((prod) => (
            <div
              key={prod.id}
              className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm hover:border-blue-500 transition-all duration-300 flex flex-col justify-between group relative overflow-hidden"
            >
              {/* Top status bar accent */}
              <div
                className={`absolute top-0 left-0 right-0 h-1 ${
                  prod.status === 'Activo'
                    ? 'bg-emerald-500'
                    : 'bg-amber-500'
                }`}
              />

              <div className="space-y-4 pt-1">
                {/* Status & Category */}
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-mono text-blue-600 font-semibold uppercase tracking-wider px-2.5 py-0.5 rounded bg-blue-50 border border-blue-200">
                    {prod.category}
                  </span>

                  <span
                    className={`inline-flex items-center gap-1.5 text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${
                      prod.status === 'Activo'
                        ? 'bg-emerald-100 text-emerald-800 border-emerald-200'
                        : 'bg-amber-100 text-amber-800 border-amber-200'
                    }`}
                  >
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${
                        prod.status === 'Activo' ? 'bg-emerald-600 animate-pulse' : 'bg-amber-600'
                      }`}
                    />
                    {prod.status}
                  </span>
                </div>

                {/* Title & Tagline */}
                <div>
                  <h3 className="text-2xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                    {prod.name}
                  </h3>
                  <p className="text-xs font-bold text-blue-600 mt-1">{prod.tagline}</p>
                  <p className="text-slate-600 text-sm leading-relaxed mt-2">{prod.description}</p>
                </div>

                {/* Key Features preview */}
                <div className="space-y-1.5 pt-2 border-t border-slate-100">
                  <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Recursos de destaque:</p>
                  <ul className="space-y-1 text-xs text-slate-600">
                    {prod.features.slice(0, 2).map((feat, idx) => (
                      <li key={idx} className="flex items-center gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                        <span className="truncate">{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-5 mt-5 border-t border-slate-100 grid grid-cols-2 gap-3">
                <button
                  onClick={() => setSelectedProduct(prod)}
                  className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors cursor-pointer"
                >
                  <Info className="w-3.5 h-3.5 text-blue-600" />
                  <span>Saiba mais</span>
                </button>

                <button
                  onClick={() => scrollToQuote(`Parceria: ${prod.name}`)}
                  className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-sm transition-all cursor-pointer"
                >
                  <span>Pedir Demo</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>

      </div>

      {/* Product Detail Modal */}
      <ProductModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onInquire={(prodName) => scrollToQuote(`Interesse em Produto: ${prodName}`)}
      />
    </section>
  );
};
