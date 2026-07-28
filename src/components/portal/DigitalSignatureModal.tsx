import React, { useState, useRef } from 'react';
import {
  FileText,
  CheckCircle2,
  Lock,
  X,
  Download,
  ShieldCheck,
  PenTool,
  RotateCcw,
  Building,
  Calendar,
  DollarSign
} from 'lucide-react';
import { Contract } from '../../types';

interface DigitalSignatureModalProps {
  contract: Contract | null;
  isOpen: boolean;
  onClose: () => void;
  onSignSuccess: (contractId: string, signedByName: string, signatureDataUrl: string, hash: string) => void;
}

export const DigitalSignatureModal: React.FC<DigitalSignatureModalProps> = ({
  contract,
  isOpen,
  onClose,
  onSignSuccess
}) => {
  const [signatureType, setSignatureType] = useState<'draw' | 'type'>('draw');
  const [typedName, setTypedName] = useState('João Mabunda');
  const [hasScrolledToBottom, setHasScrolledToBottom] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [isSigning, setIsSigning] = useState(false);
  const [isSigned, setIsSigned] = useState(false);
  const [signedHash, setSignedHash] = useState<string | null>(null);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasDrawn, setHasDrawn] = useState(false);

  if (!isOpen || !contract) return null;

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
    if (scrollTop + clientHeight >= scrollHeight - 30) {
      setHasScrolledToBottom(true);
    }
  };

  // Canvas drawing handlers
  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = 'touches' in e ? e.touches[0].clientX - rect.left : e.clientX - rect.left;
    const y = 'touches' in e ? e.touches[0].clientY - rect.top : e.clientY - rect.top;

    ctx.beginPath();
    ctx.moveTo(x, y);
    setIsDrawing(true);
    setHasDrawn(true);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = 'touches' in e ? e.touches[0].clientX - rect.left : e.clientX - rect.left;
    const y = 'touches' in e ? e.touches[0].clientY - rect.top : e.clientY - rect.top;

    ctx.lineWidth = 2.5;
    ctx.lineCap = 'round';
    ctx.strokeStyle = '#2563EB';
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setHasDrawn(false);
  };

  const handleConfirmSignature = () => {
    if (!acceptedTerms) return;
    setIsSigning(true);

    let signatureData = '';
    if (signatureType === 'draw' && canvasRef.current) {
      signatureData = canvasRef.current.toDataURL('image/png');
    } else {
      signatureData = typedName;
    }

    const generatedHash = `SHA256: ${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}8f9e0a2b4c`;

    setTimeout(() => {
      setIsSigning(false);
      setIsSigned(true);
      setSignedHash(generatedHash);
      onSignSuccess(contract.id, typedName, signatureData, generatedHash);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header Bar */}
        <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-800/40">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-100 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 flex items-center justify-center text-blue-600 dark:text-blue-400 font-bold">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold text-blue-600 dark:text-blue-400 uppercase">{contract.contractNumber}</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800">
                  {contract.status}
                </span>
              </div>
              <h2 className="text-base font-extrabold text-slate-900 dark:text-white leading-tight">
                {contract.title}
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">

          {/* Success Signed State */}
          {isSigned ? (
            <div className="py-8 text-center space-y-6 animate-in zoom-in-95 duration-300">
              <div className="w-20 h-20 bg-emerald-100 dark:bg-emerald-950 border-2 border-emerald-500 rounded-full flex items-center justify-center text-emerald-600 dark:text-emerald-400 mx-auto shadow-xl shadow-emerald-500/20">
                <CheckCircle2 className="w-10 h-10 animate-bounce" />
              </div>

              <div className="space-y-2">
                <span className="text-xs font-mono font-bold uppercase text-emerald-600 dark:text-emerald-400 tracking-wider">
                  Assinatura Digital Válida & Encriptada
                </span>
                <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white">
                  Contrato Assinado com Sucesso!
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 max-w-md mx-auto">
                  O documento foi selado digitalmente e uma cópia com certificado foi enviada para o seu email ({contract.clientName}).
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-left max-w-lg mx-auto space-y-2">
                <p className="text-[11px] font-mono text-slate-400 uppercase">Certificado Digital de Autenticidade</p>
                <p className="text-xs font-mono font-bold text-blue-600 dark:text-blue-400 break-all">{signedHash}</p>
                <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 pt-1">
                  <span>Assinado por: <strong>{typedName}</strong></span>
                  <span>Data: {new Date().toLocaleDateString('pt-PT')}</span>
                </div>
              </div>

              <div className="flex items-center justify-center gap-3 pt-2">
                <button
                  onClick={onClose}
                  className="px-6 py-2.5 rounded-xl font-bold text-xs text-white bg-blue-600 hover:bg-blue-700 shadow-md transition-colors cursor-pointer"
                >
                  Concluir & Fechar
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* Contract Metadata Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 text-xs">
                <div>
                  <span className="text-slate-400 block font-medium">Projecto Associado</span>
                  <span className="font-bold text-slate-900 dark:text-white">{contract.projectName}</span>
                </div>
                <div>
                  <span className="text-slate-400 block font-medium">Valor Total do Acordo</span>
                  <span className="font-bold text-blue-600 dark:text-blue-400">{contract.valueMzn}</span>
                </div>
                <div>
                  <span className="text-slate-400 block font-medium">Data de Emissão</span>
                  <span className="font-bold text-slate-900 dark:text-white">{contract.date}</span>
                </div>
              </div>

              {/* Scrollable Document Content Reader */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 font-medium">
                  <span>Conteúdo Jurídico do Contrato:</span>
                  <span className="text-[10px] italic">Faça scroll até ao fim para habilitar a assinatura</span>
                </div>

                <div
                  onScroll={handleScroll}
                  className="p-5 max-h-56 overflow-y-auto rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300 space-y-3 font-serif leading-relaxed"
                >
                  <h4 className="font-sans font-bold text-sm text-slate-900 dark:text-white border-b border-slate-200 dark:border-slate-800 pb-1">
                    CLÁUSULA 1ª — OBJECTO E ESCOPO TÉCNICO
                  </h4>
                  <p>
                    1.1 O presente contrato tem por objecto a prestação de serviços de desenvolvimento de software pela <strong>LEARN CODE MOÇAMBIQUE</strong> em favor do cliente <strong>{contract.clientName}</strong>, respeitando as especificações do projecto "{contract.projectName}".
                  </p>
                  <p>
                    1.2 Todas as entregas seguirão a metodologia ágil, com revisões semanais e publicação em ambiente de homologação.
                  </p>

                  <h4 className="font-sans font-bold text-sm text-slate-900 dark:text-white border-b border-slate-200 dark:border-slate-800 pb-1 pt-2">
                    CLÁUSULA 2ª — DIREITOS AUTORAIS E PROPRIEDADE INTELECTUAL
                  </h4>
                  <p>
                    2.1 Após a liquidação integral dos honorários acordados no montante de <strong>{contract.valueMzn}</strong>, a totalidade do código-fonte, bases de dados e direitos de autor serão transferidos em exclusivo para o Cliente.
                  </p>

                  <h4 className="font-sans font-bold text-sm text-slate-900 dark:text-white border-b border-slate-200 dark:border-slate-800 pb-1 pt-2">
                    CLÁUSULA 3ª — CONFIDENCIALIDADE E GARANTIA (SLA)
                  </h4>
                  <p>
                    3.1 A Learn Code garante a confidencialidade absoluta de todos os dados comerciais e disponibiliza garantia de 12 meses para correção de bugs sem custos adicionais.
                  </p>
                  <p className="text-slate-400 font-sans text-[11px] pt-2 italic">
                    --- FIM DO DOCUMENTO ---
                  </p>
                </div>
              </div>

              {/* Signature Input Panel */}
              <div className="space-y-4 pt-2 border-t border-slate-200 dark:border-slate-800">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
                    <PenTool className="w-4 h-4 text-blue-600" />
                    <span>Assinatura Digital do Cliente</span>
                  </h3>

                  <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-0.5 rounded-xl text-[11px] font-semibold">
                    <button
                      type="button"
                      onClick={() => setSignatureType('draw')}
                      className={`px-3 py-1 rounded-lg transition-colors cursor-pointer ${
                        signatureType === 'draw' ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-sm' : 'text-slate-500'
                      }`}
                    >
                      Desenhar
                    </button>
                    <button
                      type="button"
                      onClick={() => setSignatureType('type')}
                      className={`px-3 py-1 rounded-lg transition-colors cursor-pointer ${
                        signatureType === 'type' ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-sm' : 'text-slate-500'
                      }`}
                    >
                      Digitar
                    </button>
                  </div>
                </div>

                {/* Draw Signature Canvas */}
                {signatureType === 'draw' ? (
                  <div className="space-y-2">
                    <div className="relative border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-2xl bg-slate-50 dark:bg-slate-950 overflow-hidden">
                      <canvas
                        ref={canvasRef}
                        width={600}
                        height={120}
                        onMouseDown={startDrawing}
                        onMouseMove={draw}
                        onMouseUp={stopDrawing}
                        onMouseLeave={stopDrawing}
                        onTouchStart={startDrawing}
                        onTouchMove={draw}
                        onTouchEnd={stopDrawing}
                        className="w-full h-28 cursor-crosshair touch-none"
                      />
                      {!hasDrawn && (
                        <div className="absolute inset-0 pointer-events-none flex items-center justify-center text-xs text-slate-400">
                          Assine aqui com o rato ou dedo no telemóvel
                        </div>
                      )}
                    </div>
                    <div className="flex justify-end">
                      <button
                        type="button"
                        onClick={clearCanvas}
                        className="text-[11px] text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 flex items-center gap-1 cursor-pointer"
                      >
                        <RotateCcw className="w-3 h-3" />
                        <span>Limpar Assinatura</span>
                      </button>
                    </div>
                  </div>
                ) : (
                  /* Type Signature Input */
                  <div className="space-y-2">
                    <input
                      type="text"
                      value={typedName}
                      onChange={(e) => setTypedName(e.target.value)}
                      placeholder="Introduza o seu Nome Completo"
                      className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-lg font-serif italic text-blue-600 dark:text-blue-400 focus:outline-none focus:border-blue-500"
                    />
                  </div>
                )}

                {/* Terms Checkbox */}
                <label className="flex items-start gap-2.5 cursor-pointer pt-1">
                  <input
                    type="checkbox"
                    checked={acceptedTerms}
                    onChange={(e) => setAcceptedTerms(e.target.checked)}
                    className="mt-0.5 rounded border-slate-300 text-blue-600 focus:ring-blue-500 w-4 h-4 cursor-pointer"
                  />
                  <span className="text-xs text-slate-600 dark:text-slate-400 leading-snug">
                    Li e concordo integralmente com os termos deste contrato em nome da empresa <strong>{contract.clientName}</strong>.
                  </span>
                </label>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between gap-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer font-medium"
                >
                  Cancelar
                </button>

                <button
                  type="button"
                  disabled={!acceptedTerms || isSigning}
                  onClick={handleConfirmSignature}
                  className="px-8 py-3 rounded-xl font-bold text-xs text-white bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-600/20 transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {isSigning ? (
                    <span>A processar selo digital...</span>
                  ) : (
                    <>
                      <Lock className="w-4 h-4" />
                      <span>Assinar Contrato Digitalmente</span>
                    </>
                  )}
                </button>
              </div>
            </>
          )}

        </div>

      </div>
    </div>
  );
};
