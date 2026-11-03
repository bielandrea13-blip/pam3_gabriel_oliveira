import React from 'react';
import { EtecLogo } from './EtecLogo';
import { Github, UserCheck, ShieldCheck, Sparkles } from 'lucide-react';

interface HeaderProps {
  currentTab: string;
  onTabChange: (tab: string) => void;
  isAdminMode: boolean;
  onToggleAdminMode: () => void;
  onOpenGitHubModal: () => void;
  onOpenAIChat: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  onTabChange,
  isAdminMode,
  onToggleAdminMode,
  onOpenGitHubModal,
  onOpenAIChat,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-8 h-16">
          {/* Zone 1: Brand Wordmark */}
          <button
            onClick={() => onTabChange('inicio')}
            className="flex items-center gap-2 text-left focus:outline-none cursor-pointer"
          >
            <EtecLogo variant="full" />
          </button>

          {/* Zone 2: 4-5 Nav Links */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
            <button
              onClick={() => onTabChange('inicio')}
              className={`hover:text-red-700 transition-colors whitespace-nowrap shrink-0 py-1 ${
                currentTab === 'inicio' ? 'text-red-700 font-semibold border-b-2 border-red-700' : ''
              }`}
            >
              Início
            </button>
            <button
              onClick={() => onTabChange('servicos')}
              className={`hover:text-red-700 transition-colors whitespace-nowrap shrink-0 py-1 ${
                currentTab === 'servicos' ? 'text-red-700 font-semibold border-b-2 border-red-700' : ''
              }`}
            >
              Serviços & Protocolos
            </button>
            <button
              onClick={() => onTabChange('protocolos')}
              className={`hover:text-red-700 transition-colors whitespace-nowrap shrink-0 py-1 ${
                currentTab === 'protocolos' ? 'text-red-700 font-semibold border-b-2 border-red-700' : ''
              }`}
            >
              Acompanhar Pedidos
            </button>
            <button
              onClick={() => onTabChange('fila')}
              className={`hover:text-red-700 transition-colors whitespace-nowrap shrink-0 py-1 ${
                currentTab === 'fila' ? 'text-red-700 font-semibold border-b-2 border-red-700' : ''
              }`}
            >
              Fila & Senhas
            </button>
            <button
              onClick={() => onTabChange('validador')}
              className={`hover:text-red-700 transition-colors whitespace-nowrap shrink-0 py-1 ${
                currentTab === 'validador' ? 'text-red-700 font-semibold border-b-2 border-red-700' : ''
              }`}
            >
              Validar Documento
            </button>
          </nav>

          {/* Zone 3: Primary Action & Tools */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* AI Assistant Quick Trigger */}
            <button
              onClick={onOpenAIChat}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-red-700 bg-red-50 hover:bg-red-100 rounded-lg transition-colors border border-red-200 whitespace-nowrap shrink-0"
              title="Abrir Assistente Virtual ETEC com IA"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Assistente</span> IA
            </button>

            {/* Mode Switch: Student vs Secretariat Attendant */}
            <button
              onClick={onToggleAdminMode}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap shrink-0 border ${
                isAdminMode
                  ? 'bg-slate-900 text-white border-slate-900 hover:bg-slate-800'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
              }`}
              title="Alternar visão entre Aluno e Secretaria"
            >
              {isAdminMode ? (
                <>
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Painel Secretaria</span>
                </>
              ) : (
                <>
                  <UserCheck className="w-3.5 h-3.5 text-slate-500" />
                  <span className="hidden sm:inline">Visão:</span> <span>Aluno</span>
                </>
              )}
            </button>

            {/* GitHub Project Modal (As requested for the homework delivery) */}
            <button
              onClick={onOpenGitHubModal}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-medium text-white bg-red-700 hover:bg-red-800 rounded-lg transition-colors shadow-sm whitespace-nowrap shrink-0"
              title="Postar no GitHub / Ver Repositório"
            >
              <Github className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Entregar</span> GitHub
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
