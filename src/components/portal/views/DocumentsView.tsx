import React, { useState } from 'react';
import { FolderClosed, Download, Upload, Search, FileText, Image, Film, Eye, Plus } from 'lucide-react';
import { ClientDocument } from '../../../types';

interface DocumentsViewProps {
  documents: ClientDocument[];
  onUploadDocument: (newDoc: ClientDocument) => void;
}

export const DocumentsView: React.FC<DocumentsViewProps> = ({ documents, onUploadDocument }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [previewDoc, setPreviewDoc] = useState<ClientDocument | null>(null);

  const categories = [
    'all',
    'Branding & Logo',
    'Termos de Referência',
    'Contratos & SLA',
    'Faturas & Recibos',
    'Manuais & Guias',
  ];

  const filteredDocs = documents.filter((doc) => {
    const matchesCat = selectedCategory === 'all' || doc.category === selectedCategory;
    const matchesSearch = doc.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const handleSimulatedUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const newDoc: ClientDocument = {
        id: `doc-${Date.now()}`,
        name: file.name,
        category: 'Termos de Referência',
        size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
        uploadDate: new Date().toLocaleDateString('pt-PT'),
        fileType: 'pdf',
      };
      onUploadDocument(newDoc);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2.5">
            <FolderClosed className="w-7 h-7 text-blue-600 dark:text-blue-400" />
            <span>Centro de Documentos & Ficheiros</span>
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Repositório seguro de logótipos, manuais de marca, contratos, faturas e relatórios técnicos.
          </p>
        </div>

        {/* Upload Button */}
        <label className="px-5 py-2.5 rounded-xl font-bold text-xs text-white bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-600/20 transition-all flex items-center gap-2 cursor-pointer shrink-0">
          <Upload className="w-4 h-4" />
          <span>Carregar Novo Ficheiro</span>
          <input type="file" onChange={handleSimulatedUpload} className="hidden" />
        </label>
      </div>

      {/* Categories & Search */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3.5 top-2.5 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Pesquisar documento..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              {cat === 'all' ? 'Todos os Ficheiros' : cat}
            </button>
          ))}
        </div>
      </div>

      {/* Documents Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredDocs.map((doc) => (
          <div
            key={doc.id}
            className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:border-blue-500/80 transition-all flex flex-col justify-between space-y-3 group"
          >
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
                <FileText className="w-5 h-5" />
              </div>
              <div className="truncate">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">{doc.category}</span>
                <h3 className="text-xs font-bold text-slate-900 dark:text-white truncate group-hover:text-blue-600 transition-colors">
                  {doc.name}
                </h3>
                <p className="text-[11px] text-slate-400 mt-0.5">{doc.size} • {doc.uploadDate}</p>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
              <button
                onClick={() => setPreviewDoc(doc)}
                className="text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 flex items-center gap-1 cursor-pointer"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>Visualizar</span>
              </button>

              <button
                onClick={() => alert(`A transferir ${doc.name}...`)}
                className="text-blue-600 font-bold hover:underline flex items-center gap-1 cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Descarregar</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Document Preview Modal */}
      {previewDoc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 max-w-lg w-full space-y-4">
            <h3 className="font-extrabold text-base text-slate-900 dark:text-white">{previewDoc.name}</h3>
            <div className="p-8 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-center space-y-2">
              <FileText className="w-12 h-12 text-blue-600 mx-auto" />
              <p className="text-xs text-slate-500">Pré-visualização encriptada do ficheiro ({previewDoc.size})</p>
            </div>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setPreviewDoc(null)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 cursor-pointer"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
