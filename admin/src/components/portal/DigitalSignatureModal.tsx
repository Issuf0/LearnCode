import React, { useState, useRef, useEffect } from 'react';
import {
  FileText,
  CheckCircle2,
  Lock,
  X,
  Download,
  PenTool,
  RotateCcw,
  UserRound,
  AlertCircle,
} from 'lucide-react';
import { Contract } from '../../types';

interface SignPayload {
  contractId: string;
  signedByName: string;
  signatureImage: string | null;
  contractor?: { fullName: string; idNumber: string; address: string; contact: string };
}

interface DigitalSignatureModalProps {
  contract: Contract | null;
  isOpen: boolean;
  mode: 'client' | 'admin';
  defaultName: string;
  onClose: () => void;
  onSign: (payload: SignPayload) => Promise<void>;
  onDownloadPdf: (contract: Contract) => void;
}

export const DigitalSignatureModal: React.FC<DigitalSignatureModalProps> = ({
  contract,
  isOpen,
  mode,
  defaultName,
  onClose,
  onSign,
  onDownloadPdf,
}) => {
  const needsContractorData = mode === 'client' && !contract?.contractorFullName;
  const [step, setStep] = useState<'details' | 'sign' | 'done'>(needsContractorData ? 'details' : 'sign');

  const [contractor, setContractor] = useState({ fullName: defaultName, idNumber: '', address: '', contact: '' });
  const [signedByName, setSignedByName] = useState(defaultName);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasDrawn, setHasDrawn] = useState(false);

  // Reinicia o estado interno sempre que o modal abre para um contrato diferente
  useEffect(() => {
    if (!contract) return;
    setStep(mode === 'client' && !contract.contractorFullName ? 'details' : 'sign');
    setContractor({ fullName: defaultName, idNumber: '', address: '', contact: '' });
    setSignedByName(defaultName);
    setAcceptedTerms(false);
    setHasDrawn(false);
    setErrorMsg(null);
    const canvas = canvasRef.current;
    canvas?.getContext('2d')?.clearRect(0, 0, canvas.width, canvas.height);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [contract?.id, mode]);

  if (!isOpen || !contract) return null;

  const pointerPos = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current!;
    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    // Escala coordenadas do ecrã para o tamanho real do canvas
    return {
      x: ((clientX - rect.left) / rect.width) * canvas.width,
      y: ((clientY - rect.top) / rect.height) * canvas.height,
    };
  };

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const ctx = canvasRef.current?.getContext('2d');
    if (!ctx) return;
    const { x, y } = pointerPos(e);
    ctx.beginPath();
    ctx.moveTo(x, y);
    setIsDrawing(true);
    setHasDrawn(true);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const ctx = canvasRef.current?.getContext('2d');
    if (!ctx) return;
    const { x, y } = pointerPos(e);
    ctx.lineWidth = 2.5;
    ctx.lineCap = 'round';
    ctx.strokeStyle = '#0e83ba';
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setHasDrawn(false);
  };

  const handleDetailsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setStep('sign');
  };

  const handleConfirmSignature = async () => {
    if (!acceptedTerms || !signedByName.trim()) return;
    setErrorMsg(null);
    setIsSubmitting(true);
    try {
      await onSign({
        contractId: contract.id,
        signedByName: signedByName.trim(),
        signatureImage: hasDrawn && canvasRef.current ? canvasRef.current.toDataURL('image/png') : null,
        contractor: needsContractorData ? contractor : undefined,
      });
      setStep('done');
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Não foi possível assinar o contrato.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputClass =
    'w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 transition-colors';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">

        {/* Header */}
        <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-800/40">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-100 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 flex items-center justify-center text-blue-600 dark:text-blue-400">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-mono font-bold text-blue-600 dark:text-blue-400 uppercase">
                {contract.contractNumber}
              </span>
              <h2 className="text-base font-extrabold text-slate-900 dark:text-white leading-tight">{contract.title}</h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto space-y-5 flex-1">

          {step === 'done' ? (
            /* -------- Sucesso -------- */
            <div className="py-8 text-center space-y-6 animate-in zoom-in-95 duration-300">
              <div className="w-20 h-20 bg-emerald-100 dark:bg-emerald-950 border-2 border-emerald-500 rounded-full flex items-center justify-center text-emerald-600 dark:text-emerald-400 mx-auto">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <div className="space-y-2">
                <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white">
                  {mode === 'admin' ? 'Contrato Contra-assinado!' : 'Contrato Assinado com Sucesso!'}
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 max-w-md mx-auto">
                  O documento foi selado digitalmente com certificado SHA-256.
                  {mode === 'client' && ' A Learn Code irá contra-assinar e o PDF final ficará disponível.'}
                </p>
              </div>
              <div className="flex items-center justify-center gap-3 pt-2">
                <button
                  onClick={() => onDownloadPdf(contract)}
                  className="px-5 py-2.5 rounded-xl font-bold text-xs text-blue-600 bg-blue-50 border border-blue-200 hover:bg-blue-100 flex items-center gap-2 cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                  <span>Descarregar PDF</span>
                </button>
                <button
                  onClick={onClose}
                  className="px-6 py-2.5 rounded-xl font-bold text-xs text-white bg-blue-600 hover:bg-blue-500 shadow-md transition-colors cursor-pointer"
                >
                  Concluir
                </button>
              </div>
            </div>
          ) : step === 'details' ? (
            /* -------- Passo 1: identificação do contratante -------- */
            <form onSubmit={handleDetailsSubmit} className="space-y-4">
              <div className="p-4 rounded-2xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                <p className="font-bold text-slate-900 dark:text-white mb-1 flex items-center gap-1.5">
                  <UserRound className="w-4 h-4 text-blue-600" />
                  Identificação do Contratante
                </p>
                Estes dados entram no contrato oficial como CONTRATANTE. Confirme que estão exactamente
                como no seu documento de identificação.
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1 sm:col-span-2">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Nome completo (ou razão social)</label>
                  <input required value={contractor.fullName} onChange={(e) => setContractor((p) => ({ ...p, fullName: e.target.value }))} className={inputClass} />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Bilhete de Identidade / NUIT</label>
                  <input required value={contractor.idNumber} onChange={(e) => setContractor((p) => ({ ...p, idNumber: e.target.value }))} className={inputClass} />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Contacto</label>
                  <input required placeholder="+258 ..." value={contractor.contact} onChange={(e) => setContractor((p) => ({ ...p, contact: e.target.value }))} className={inputClass} />
                </div>
                <div className="space-y-1 sm:col-span-2">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Domicílio / Sede</label>
                  <input required value={contractor.address} onChange={(e) => setContractor((p) => ({ ...p, address: e.target.value }))} className={inputClass} />
                </div>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="submit"
                  className="px-6 py-3 rounded-xl font-bold text-xs text-white bg-blue-600 hover:bg-blue-500 shadow-md cursor-pointer"
                >
                  Continuar para a Assinatura →
                </button>
              </div>
            </form>
          ) : (
            /* -------- Passo 2: assinatura -------- */
            <>
              {/* Resumo do contrato */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 text-xs">
                <div>
                  <span className="text-slate-400 block font-medium">Valor Total</span>
                  <span className="font-bold text-blue-600 dark:text-blue-400">{contract.valueMzn}</span>
                </div>
                <div>
                  <span className="text-slate-400 block font-medium">Sinal</span>
                  <span className="font-bold text-slate-900 dark:text-white">{contract.depositPercent ?? 50}%</span>
                </div>
                <div>
                  <span className="text-slate-400 block font-medium">Início</span>
                  <span className="font-bold text-slate-900 dark:text-white">{contract.startDate ?? '—'}</span>
                </div>
                <div>
                  <span className="text-slate-400 block font-medium">Entrega</span>
                  <span className="font-bold text-slate-900 dark:text-white">{contract.deliveryDate ?? '—'}</span>
                </div>
              </div>

              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Está a assinar o Contrato de Prestação de Serviços oficial da Learn Code (13 cláusulas: objecto,
                prazos, pagamento, garantia de 30 dias, confidencialidade, foro moçambicano).{' '}
                <button
                  type="button"
                  onClick={() => onDownloadPdf(contract)}
                  className="text-blue-600 dark:text-blue-400 font-semibold underline underline-offset-2 cursor-pointer"
                >
                  Ler o contrato completo em PDF
                </button>{' '}
                antes de assinar.
              </p>

              {/* Nome do signatário */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Nome do signatário</label>
                <input value={signedByName} onChange={(e) => setSignedByName(e.target.value)} className={inputClass} />
              </div>

              {/* Canvas de assinatura */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
                    <PenTool className="w-4 h-4 text-blue-600" />
                    Assinatura {mode === 'admin' ? 'do Prestador (Learn Code)' : 'do Contratante'}
                  </span>
                  <button
                    type="button"
                    onClick={clearCanvas}
                    className="text-[11px] text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 flex items-center gap-1 cursor-pointer"
                  >
                    <RotateCcw className="w-3 h-3" />
                    <span>Limpar</span>
                  </button>
                </div>
                <div className="relative border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-2xl bg-slate-50 dark:bg-slate-950 overflow-hidden">
                  <canvas
                    ref={canvasRef}
                    width={600}
                    height={140}
                    onMouseDown={startDrawing}
                    onMouseMove={draw}
                    onMouseUp={() => setIsDrawing(false)}
                    onMouseLeave={() => setIsDrawing(false)}
                    onTouchStart={startDrawing}
                    onTouchMove={draw}
                    onTouchEnd={() => setIsDrawing(false)}
                    className="w-full h-32 cursor-crosshair touch-none"
                  />
                  {!hasDrawn && (
                    <div className="absolute inset-0 pointer-events-none flex items-center justify-center text-xs text-slate-400">
                      Assine aqui com o rato ou o dedo
                    </div>
                  )}
                </div>
              </div>

              {/* Termos */}
              <label className="flex items-start gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={acceptedTerms}
                  onChange={(e) => setAcceptedTerms(e.target.checked)}
                  className="mt-0.5 rounded border-slate-300 text-blue-600 focus:ring-blue-500 w-4 h-4 cursor-pointer"
                />
                <span className="text-xs text-slate-600 dark:text-slate-400 leading-snug">
                  Li o contrato {contract.contractNumber} e concordo integralmente com os seus termos. A assinatura
                  será selada com certificado digital, data/hora e endereço IP.
                </span>
              </label>

              {errorMsg && (
                <p className="text-xs text-rose-600 font-medium flex items-center gap-1.5">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  {errorMsg}
                </p>
              )}

              {/* Acções */}
              <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between gap-4">
                {needsContractorData ? (
                  <button
                    type="button"
                    onClick={() => setStep('details')}
                    className="px-5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer font-medium"
                  >
                    ← Dados do Contratante
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer font-medium"
                  >
                    Cancelar
                  </button>
                )}

                <button
                  type="button"
                  disabled={!acceptedTerms || !hasDrawn || isSubmitting}
                  onClick={handleConfirmSignature}
                  className="px-8 py-3 rounded-xl font-bold text-xs text-white bg-blue-600 hover:bg-blue-500 shadow-lg shadow-blue-600/20 transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <span>A selar digitalmente...</span>
                  ) : (
                    <>
                      <Lock className="w-4 h-4" />
                      <span>{mode === 'admin' ? 'Contra-assinar Contrato' : 'Assinar Contrato'}</span>
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
