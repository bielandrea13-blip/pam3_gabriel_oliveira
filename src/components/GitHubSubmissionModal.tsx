import React, { useState, useEffect } from 'react';
import { Github, Check, Copy, ExternalLink, Terminal, BookOpen, Share2, Sparkles, X } from 'lucide-react';

interface GitHubSubmissionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GitHubSubmissionModal: React.FC<GitHubSubmissionModalProps> = ({ isOpen, onClose }) => {
  const [repoUrl, setRepoUrl] = useState(() => {
    return localStorage.getItem('etec_github_repo_url') || 'https://github.com/gabriel-moreira/etec-atendimento-aluno';
  });
  const [copiedSection, setCopiedSection] = useState<string | null>(null);

  useEffect(() => {
    localStorage.setItem('etec_github_repo_url', repoUrl);
  }, [repoUrl]);

  if (!isOpen) return null;

  const gitCommands = `git init
git add .
git commit -m "feat: Sistema de Atendimento ao Aluno ETEC com IA e Secretaria Digital"
git branch -M main
git remote add origin ${repoUrl || 'https://github.com/SEU-USUARIO/etec-atendimento-aluno.git'}
git push -u origin main`;

  const submissionSummary = `🎓 ATIVIDADE ACADÊMICA: Sistema de Atendimento ao Aluno - ETEC
🏛️ Instituição: ETEC / Centro Paula Souza (Governo do Estado de São Paulo)
💻 Repositório no GitHub: ${repoUrl}
⚡ Metodologia: Vibe Coding com Google AI Studio
🛠️ Tecnologias Utilizadas:
• React 19 + TypeScript + Vite + Tailwind CSS v4
• Express.js + Node.js (Full-stack)
• Google Gemini AI (@google/genai) para Assistente Virtual Acadêmico
• Design System Institucional ETEC / Centro Paula Souza
• Geração de Declaração de Matrícula com Hash e Impressão
• Sistema de Fila & Chamada Sonora de Senhas Eletrônicas`;

  const copyToClipboard = (text: string, sectionId: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSection(sectionId);
    setTimeout(() => setCopiedSection(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/70 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl border border-slate-200 overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="bg-slate-950 text-white p-5 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-red-700 text-white flex items-center justify-center">
              <Github className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[11px] font-semibold text-red-400 uppercase tracking-wider">
                Entrega da Atividade Acadêmica
              </span>
              <h3 className="text-lg font-bold">Publicação no GitHub & Relatório</h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6 text-xs text-slate-700">
          {/* Submission Info Box */}
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-red-950 space-y-1">
            <div className="font-bold text-sm flex items-center gap-1.5 text-red-900">
              <Sparkles className="w-4 h-4 text-red-700" />
              <span>Instruções de Postagem da Atividade</span>
            </div>
            <p className="text-xs text-red-800 leading-relaxed">
              Conforme solicitado na aula, este projeto foi estruturado seguindo as cores e identidade visual da ETEC/Centro Paula Souza e pronto para envio ao GitHub.
            </p>
          </div>

          {/* Repo URL Input */}
          <div className="space-y-1.5">
            <label className="block font-bold text-slate-900 text-xs">
              Link do seu Repositório no GitHub:
            </label>
            <div className="flex items-center gap-2">
              <input
                type="url"
                value={repoUrl}
                onChange={(e) => setRepoUrl(e.target.value)}
                placeholder="https://github.com/seu-usuario/etec-atendimento-aluno"
                className="flex-1 px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600 focus:bg-white font-mono"
              />
              <button
                onClick={() => copyToClipboard(repoUrl, 'url')}
                className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold bg-slate-900 hover:bg-slate-800 text-white rounded-lg transition-colors cursor-pointer shrink-0"
              >
                {copiedSection === 'url' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>Copiar Link</span>
              </button>
            </div>
          </div>

          {/* Git Terminal Commands */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-900 flex items-center gap-1.5">
                <Terminal className="w-4 h-4 text-slate-600" />
                <span>Comandos no Terminal para Subir o Projeto:</span>
              </span>
              <button
                onClick={() => copyToClipboard(gitCommands, 'terminal')}
                className="text-red-700 hover:text-red-800 font-semibold text-xs flex items-center gap-1 cursor-pointer"
              >
                {copiedSection === 'terminal' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>Copiar Comandos</span>
              </button>
            </div>
            <div className="bg-slate-950 text-slate-200 p-3.5 rounded-xl font-mono text-[11px] leading-relaxed overflow-x-auto border border-slate-800">
              <pre>{gitCommands}</pre>
            </div>
          </div>

          {/* Teacher Submission Summary Text */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-900 flex items-center gap-1.5">
                <BookOpen className="w-4 h-4 text-slate-600" />
                <span>Texto Pronto para Postar no Classroom / Formulário:</span>
              </span>
              <button
                onClick={() => copyToClipboard(submissionSummary, 'summary')}
                className="text-red-700 hover:text-red-800 font-semibold text-xs flex items-center gap-1 cursor-pointer"
              >
                {copiedSection === 'summary' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>Copiar Texto Completo</span>
              </button>
            </div>
            <div className="bg-slate-50 border border-slate-200 p-3.5 rounded-xl text-slate-800 text-xs whitespace-pre-wrap leading-relaxed max-h-44 overflow-y-auto font-sans">
              {submissionSummary}
            </div>
          </div>
        </div>

        <div className="bg-slate-50 p-4 border-t border-slate-200 flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="px-5 py-2 text-xs font-semibold text-white bg-red-700 hover:bg-red-800 rounded-lg transition-colors cursor-pointer"
          >
            Entendido e Salvo
          </button>
        </div>
      </div>
    </div>
  );
};
