import React, { useState, useRef, useEffect } from 'react';
import { Sparkles, Send, Bot, User, X, CornerDownLeft, Loader2, Lightbulb } from 'lucide-react';
import { EtecLogo } from './EtecLogo';

interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
}

interface AIAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const INITIAL_MESSAGES: ChatMessage[] = [
  {
    id: 'm-1',
    sender: 'assistant',
    text: 'Olá! Sou o **Tira-Dúvidas Acadêmico da ETEC**, seu assistente virtual do Centro Paula Souza. Posso esclarecer dúvidas sobre frequência mínima (75%), requerimentos de passe escolar, entrega de atestados, aproveitamento de disciplinas e regimento escolar. Como posso ajudar?',
    timestamp: 'Agora',
  },
];

const SUGGESTIONS = [
  'Como solicitar o passe escolar SPTrans?',
  'Qual o limite de faltas para não reprovar?',
  'Qual o prazo para entregar atestado médico?',
  'Como funciona o estágio supervisionado e TCE?',
  'Como pedir aproveitamento de estudos?',
];

export const AIAssistantModal: React.FC<AIAssistantModalProps> = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState<ChatMessage[]>(INITIAL_MESSAGES);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  if (!isOpen) return null;

  const sendMessage = async (textToSend: string) => {
    const trimmed = textToSend.trim();
    if (!trimmed || isLoading) return;

    const userMsg: ChatMessage = {
      id: `u-${Date.now()}`,
      sender: 'user',
      text: trimmed,
      timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/gemini/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: trimmed,
          history: messages.slice(-4).map((m) => ({ sender: m.sender, text: m.text })),
        }),
      });

      if (!response.ok) {
        throw new Error('Falha na resposta do servidor.');
      }

      const data = await response.json();
      const assistantMsg: ChatMessage = {
        id: `a-${Date.now()}`,
        sender: 'assistant',
        text: data.reply || 'Desculpe, ocorreu uma instabilidade momentânea. Por favor, tente novamente.',
        timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, assistantMsg]);
    } catch {
      // Local fallback in case network has an issue
      const assistantMsg: ChatMessage = {
        id: `a-${Date.now()}`,
        sender: 'assistant',
        text: 'Não foi possível contatar o servidor no momento. Lembre-se: a frequência mínima na ETEC é de 75% por componente curricular e o atestado médico deve ser entregue em até 5 dias úteis.',
        timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, assistantMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      sendMessage(inputText);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:justify-end sm:p-6 bg-slate-900/50 backdrop-blur-xs">
      <div className="bg-white w-full sm:max-w-md h-[85vh] sm:h-[620px] rounded-t-2xl sm:rounded-2xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-6 duration-200">
        {/* Assistant Header */}
        <div className="bg-red-800 text-white p-4 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center text-white border border-white/20">
              <Sparkles className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="text-sm font-bold">Assistente Acadêmico ETEC</h3>
                <span className="text-[10px] bg-red-950/80 text-amber-300 px-1.5 py-0.2 rounded font-semibold uppercase">
                  IA
                </span>
              </div>
              <p className="text-[11px] text-red-200">
                Regimento Escolar · Centro Paula Souza
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-red-200 hover:text-white rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Chat History */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3.5 bg-slate-50 text-xs">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`flex items-start gap-2.5 ${m.sender === 'user' ? 'flex-row-reverse' : ''}`}
            >
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 text-white ${
                  m.sender === 'user' ? 'bg-slate-900' : 'bg-red-700'
                }`}
              >
                {m.sender === 'user' ? <User className="w-3.5 h-3.5" /> : <Bot className="w-3.5 h-3.5" />}
              </div>

              <div
                className={`max-w-[82%] p-3.5 rounded-2xl leading-relaxed ${
                  m.sender === 'user'
                    ? 'bg-slate-900 text-white rounded-tr-none'
                    : 'bg-white text-slate-800 border border-slate-200 rounded-tl-none shadow-xs'
                }`}
              >
                <div className="whitespace-pre-wrap">{m.text}</div>
                <div
                  className={`text-[9px] mt-1 text-right ${
                    m.sender === 'user' ? 'text-slate-400' : 'text-slate-400'
                  }`}
                >
                  {m.timestamp}
                </div>
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex items-center gap-2 text-slate-500 text-xs pl-2">
              <Loader2 className="w-4 h-4 animate-spin text-red-700" />
              <span>Consultando regimento acadêmico da ETEC...</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Suggestion Chips */}
        <div className="px-3 py-2 bg-white border-t border-slate-100 flex items-center gap-1.5 overflow-x-auto shrink-0">
          <Lightbulb className="w-3.5 h-3.5 text-amber-500 shrink-0" />
          {SUGGESTIONS.map((s, idx) => (
            <button
              key={idx}
              onClick={() => sendMessage(s)}
              className="px-2.5 py-1 text-[11px] bg-slate-100 hover:bg-red-50 hover:text-red-700 text-slate-700 rounded-md whitespace-nowrap transition-colors cursor-pointer shrink-0"
            >
              {s}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <div className="p-3 bg-white border-t border-slate-200 shrink-0">
          <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 focus-within:ring-2 focus-within:ring-red-600 focus-within:bg-white transition-all">
            <input
              type="text"
              placeholder="Digite sua dúvida acadêmica..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={handleKeyDown}
              className="flex-1 bg-transparent text-xs text-slate-900 focus:outline-none py-1"
            />
            <button
              onClick={() => sendMessage(inputText)}
              disabled={!inputText.trim() || isLoading}
              className="p-1.5 rounded-lg bg-red-700 hover:bg-red-800 disabled:opacity-40 text-white transition-colors cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </div>
          <div className="text-[10px] text-slate-400 text-center mt-1.5">
            Base oficial: Regimento Comum das ETECs · Centro Paula Souza
          </div>
        </div>
      </div>
    </div>
  );
};
