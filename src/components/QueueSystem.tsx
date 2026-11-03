import React, { useState } from 'react';
import { QueueTicket } from '../types';
import { 
  Ticket, 
  Volume2, 
  Clock, 
  User, 
  CheckCircle2, 
  Monitor, 
  AlertTriangle,
  Play
} from 'lucide-react';

interface QueueSystemProps {
  tickets: QueueTicket[];
  currentStudentName: string;
  onTakeTicket: (type: 'Geral' | 'Passe Escolar' | 'Documentos' | 'Coordenação', prefix: 'G' | 'P' | 'D' | 'C') => void;
  onCallNextTicket?: (ticketId: string, desk: number) => void;
  isAdmin?: boolean;
}

export const QueueSystem: React.FC<QueueSystemProps> = ({
  tickets,
  currentStudentName,
  onTakeTicket,
  onCallNextTicket,
  isAdmin = false,
}) => {
  const [selectedDesk, setSelectedDesk] = useState<number>(1);
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Web Audio Synthesizer for the classic airport / bank "Ding-Dong" queue chime
  const playQueueChime = () => {
    if (!soundEnabled) return;
    try {
      const audioCtx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
      
      const playTone = (freq: number, startTime: number, duration: number) => {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, startTime);
        gain.gain.setValueAtTime(0, startTime);
        gain.gain.linearRampToValueAtTime(0.3, startTime + 0.05);
        gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start(startTime);
        osc.stop(startTime + duration);
      };

      const now = audioCtx.currentTime;
      playTone(587.33, now, 0.4); // D5
      playTone(880.00, now + 0.25, 0.7); // A5
    } catch {
      // AudioContext muted or blocked by browser policy
    }
  };

  const calledTickets = tickets.filter(t => t.status === 'Chamado');
  const waitingTickets = tickets.filter(t => t.status === 'Aguardando');
  const latestCalled = calledTickets[calledTickets.length - 1] || null;

  // Check if current logged-in student has an active ticket
  const myTicket = tickets.find(t => t.studentName === currentStudentName && t.status !== 'Atendido');

  return (
    <div className="space-y-6">
      {/* Top Banner / Secretariat Information */}
      <div className="bg-slate-900 text-white rounded-2xl p-6 sm:p-8 shadow-xl border border-slate-800">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-red-400">
              <Monitor className="w-4 h-4" />
              <span>Painel Eletrônico · Secretaria Acadêmica ETEC</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight mt-1">
              Fila & Senhas de Atendimento
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Horário de atendimento presencial: Segunda a Sexta, das 08h às 21h30.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                setSoundEnabled(!soundEnabled);
                playQueueChime();
              }}
              className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-medium rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors border border-slate-700 cursor-pointer"
            >
              <Volume2 className={`w-4 h-4 ${soundEnabled ? 'text-emerald-400' : 'text-slate-500'}`} />
              <span>{soundEnabled ? 'Aviso Sonoro Ativo' : 'Mudo'}</span>
            </button>
          </div>
        </div>

        {/* Big TV Screen Display */}
        <div className="mt-6 pt-6 border-t border-slate-800 grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Main Calling Display */}
          <div className="md:col-span-7 bg-slate-950 border border-slate-800 rounded-2xl p-6 sm:p-8 text-center flex flex-col items-center justify-center min-h-[220px] shadow-inner">
            <span className="text-xs uppercase font-bold text-red-400 tracking-widest">
              Senha Chamada
            </span>
            <div className="text-5xl sm:text-7xl font-mono font-black tracking-tight text-white my-3 animate-pulse">
              {latestCalled ? latestCalled.number : 'AGUARDE'}
            </div>
            <div className="text-sm sm:text-base font-semibold text-slate-300">
              {latestCalled ? `GUICHÊ 0${latestCalled.desk || 1} · ${latestCalled.type}` : 'Nenhum chamado no momento'}
            </div>
          </div>

          {/* Historical Last Called Tickets */}
          <div className="md:col-span-5 bg-slate-800/60 rounded-2xl p-5 border border-slate-800 flex flex-col justify-between">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                Últimas Chamadas
              </h3>
              <div className="space-y-2">
                {calledTickets.slice(-4).reverse().map((t, idx) => (
                  <div
                    key={t.id}
                    className={`flex items-center justify-between p-2.5 rounded-lg text-xs font-mono ${
                      idx === 0
                        ? 'bg-red-950/40 text-red-300 border border-red-500/30'
                        : 'bg-slate-900/60 text-slate-300'
                    }`}
                  >
                    <span className="font-bold text-sm">{t.number}</span>
                    <span className="text-[11px] text-slate-400">Guichê 0{t.desk || 1}</span>
                    <span className="text-[10px] text-slate-400">{t.calledAt || t.createdAt}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="text-[11px] text-slate-400 mt-3 pt-3 border-t border-slate-700/60 flex items-center justify-between">
              <span>Pessoas aguardando:</span>
              <strong className="text-white font-mono">{waitingTickets.length}</strong>
            </div>
          </div>
        </div>
      </div>

      {/* Student's Personal Ticket Alert if active */}
      {myTicket && (
        <div className="bg-emerald-50 border-2 border-emerald-400 rounded-2xl p-5 sm:p-6 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-xl bg-emerald-600 text-white font-mono font-black text-2xl flex items-center justify-center shadow">
                {myTicket.number}
              </div>
              <div>
                <span className="text-xs font-semibold text-emerald-800 uppercase tracking-wider">
                  Sua Senha Ativa
                </span>
                <h4 className="text-base font-bold text-slate-900">
                  {myTicket.type} · Retirada às {myTicket.createdAt}
                </h4>
                <p className="text-xs text-slate-600 mt-0.5">
                  {myTicket.status === 'Chamado'
                    ? `Dirija-se ao Guichê 0${myTicket.desk} imediatamente!`
                    : 'Aguarde ser chamado no painel ou sonoro.'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <span className={`px-3 py-1 text-xs font-bold rounded-lg ${
                myTicket.status === 'Chamado' ? 'bg-red-700 text-white animate-bounce' : 'bg-emerald-100 text-emerald-800'
              }`}>
                {myTicket.status === 'Chamado' ? 'CHAMANDO AGORA' : 'Na Fila'}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Ticket Dispenser / Totem */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
        <div className="border-b border-slate-100 pb-4 mb-6">
          <h3 className="text-lg font-bold text-slate-900">
            Retirar Senha de Atendimento Presencial
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            Selecione a categoria de serviço desejada para ingressar na fila do balcão da secretaria.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <button
            onClick={() => onTakeTicket('Geral', 'G')}
            className="p-5 rounded-xl border border-slate-200 hover:border-red-600 hover:bg-red-50/20 text-left transition-all group cursor-pointer"
          >
            <div className="w-10 h-10 rounded-lg bg-red-100 text-red-700 font-mono font-bold text-lg flex items-center justify-center group-hover:bg-red-700 group-hover:text-white transition-colors mb-3">
              G
            </div>
            <h4 className="text-sm font-bold text-slate-900 group-hover:text-red-700 transition-colors">
              Geral / Secretaria
            </h4>
            <p className="text-xs text-slate-500 mt-1">
              Dúvidas gerais, matrículas, declarações rápidas e atendimento balcão.
            </p>
          </button>

          <button
            onClick={() => onTakeTicket('Passe Escolar', 'P')}
            className="p-5 rounded-xl border border-slate-200 hover:border-red-600 hover:bg-red-50/20 text-left transition-all group cursor-pointer"
          >
            <div className="w-10 h-10 rounded-lg bg-blue-100 text-blue-700 font-mono font-bold text-lg flex items-center justify-center group-hover:bg-blue-700 group-hover:text-white transition-colors mb-3">
              P
            </div>
            <h4 className="text-sm font-bold text-slate-900 group-hover:text-blue-700 transition-colors">
              Passe Escolar / Benefícios
            </h4>
            <p className="text-xs text-slate-500 mt-1">
              SPTrans, EMTU, Cartão TOP, declarações de transporte e cota estudantil.
            </p>
          </button>

          <button
            onClick={() => onTakeTicket('Documentos', 'D')}
            className="p-5 rounded-xl border border-slate-200 hover:border-red-600 hover:bg-red-50/20 text-left transition-all group cursor-pointer"
          >
            <div className="w-10 h-10 rounded-lg bg-amber-100 text-amber-800 font-mono font-bold text-lg flex items-center justify-center group-hover:bg-amber-700 group-hover:text-white transition-colors mb-3">
              D
            </div>
            <h4 className="text-sm font-bold text-slate-900 group-hover:text-amber-800 transition-colors">
              Retirada de Documentos
            </h4>
            <p className="text-xs text-slate-500 mt-1">
              Histórico assinado, certificados, diplomas e vias originais emitidas.
            </p>
          </button>

          <button
            onClick={() => onTakeTicket('Coordenação', 'C')}
            className="p-5 rounded-xl border border-slate-200 hover:border-red-600 hover:bg-red-50/20 text-left transition-all group cursor-pointer"
          >
            <div className="w-10 h-10 rounded-lg bg-purple-100 text-purple-700 font-mono font-bold text-lg flex items-center justify-center group-hover:bg-purple-700 group-hover:text-white transition-colors mb-3">
              C
            </div>
            <h4 className="text-sm font-bold text-slate-900 group-hover:text-purple-700 transition-colors">
              Coordenação & Estágios
            </h4>
            <p className="text-xs text-slate-500 mt-1">
              Assinatura de TCE de estágio, aproveitamento de estudos e TCC.
            </p>
          </button>
        </div>
      </div>

      {/* Admin Quick Caller (If Secretariat mode is on) */}
      {isAdmin && onCallNextTicket && (
        <div className="bg-slate-900 text-white border border-slate-800 rounded-2xl p-6 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
            <div>
              <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
                Operação de Guichê · Atendente ETEC
              </span>
              <h3 className="text-base font-bold text-white mt-0.5">
                Chamar Próxima Senha da Fila
              </h3>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400">Meu Guichê:</span>
              <select
                value={selectedDesk}
                onChange={(e) => setSelectedDesk(Number(e.target.value))}
                className="bg-slate-800 text-white text-xs border border-slate-700 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-red-500"
              >
                <option value={1}>Guichê 01</option>
                <option value={2}>Guichê 02</option>
                <option value={3}>Guichê 03</option>
                <option value={4}>Coordenação</option>
              </select>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              disabled={waitingTickets.length === 0}
              onClick={() => {
                if (waitingTickets[0]) {
                  onCallNextTicket(waitingTickets[0].id, selectedDesk);
                  playQueueChime();
                }
              }}
              className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-bold text-white bg-red-700 hover:bg-red-800 rounded-xl transition-colors shadow disabled:opacity-40 cursor-pointer"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>
                {waitingTickets.length > 0
                  ? `Chamar Próxima (${waitingTickets[0].number})`
                  : 'Nenhuma senha aguardando'}
              </span>
            </button>
            <span className="text-xs text-slate-400">
              {waitingTickets.length} senhas aguardando na fila presencial
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
