import React from 'react';

interface ErrorBoundaryState {
  hasError: boolean;
}

export class ErrorBoundary extends React.Component<React.PropsWithChildren, ErrorBoundaryState> {
  state: ErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error('Erro inesperado na aplicação:', error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
          <div className="max-w-md w-full text-center space-y-4 p-8 rounded-3xl bg-white border border-slate-200 shadow-sm">
            <p className="text-4xl">⚠️</p>
            <h1 className="text-xl font-extrabold text-slate-900">Algo correu mal</h1>
            <p className="text-sm text-slate-500 leading-relaxed">
              Ocorreu um erro inesperado. Recarregue a página; se o problema persistir, contacte-nos pelo WhatsApp.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-3 rounded-xl font-bold text-sm text-white bg-[#1a9cd8] hover:bg-[#29b6e8] transition-all cursor-pointer"
            >
              Recarregar Página
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
