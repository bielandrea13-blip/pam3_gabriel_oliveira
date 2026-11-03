import React, { useState } from 'react';
import { Protocol, QueueTicket } from '../types';
import { 
  ShieldCheck, 
  Check, 
  X, 
  Clock, 
  Search, 
  Users, 
  FileCheck, 
  AlertCircle,
  Building,
  Sparkles
} from 'lucide-react';

interface SecretariatAdminViewProps {
  protocols: Protocol[];
  onUpdateProtocolStatus: (id: string, newStatus: 'Concluído' | 'Indeferido' | 'Em Análise', notes?: string) => void;
  tickets: QueueTicket[];
  onCallTicket: (id: string, desk: number) => void;
}

export const SecretariatAdminView: React.FC<SecretariatAdminViewProps> = ({
  protocols,
  onUpdateProtocolStatus,
  tickets,
  onCallTicket,
}) => {
  const [search, setSearch] = useState('');
  const [selectedProtocol, setSelectedProtocol] = useState<Protocol | null>(null);
  const [reviewNotes, setReviewNotes] = useState('');
  const [currentDesk, setCurrentDesk] = useState<number>(1);

  const filtered = protocols.filter(
    (p) =>
      p.protocolCode.toLowerCase().includes(search.toLowerCase()) ||
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.description.toLowerCase().includes(search.toLowerCase())
  );

  const pendingCount = protocols.filter((p) => p.status === 'Pendente' || p.status === 'Em Análise').length;
  const completedCount = protocols.filter((p) => p.status === 'Concluído').length;
  const waitingTickets = tickets.filter((t) => t.status === 'Aguardando');

  const handleOpenReview = (p: Protocol) => {
    setSelectedProtocol(p);
    setReviewNotes(p.notes || '');
  };

  const handleConfirmDecision = (decision: 'Concluído' | 'Indeferido') => {
    if (!selectedProtocol) return;
    onUpdateProtocolStatus(
      selectedProtocol.id,
      decision,
      reviewNotes.trim() || (decision === 'Concluído' ? 'Deferido pela Secretaria Acadêmica.' : 'Indeferido por falta de documentação comprobatória.')
    );
    setSelectedProtocol(null);
  };

  return (
    <div className="space-y-6">
      {/* Admin Top Header Banner */}
      <div className="bg-slate-900 text-white rounded-2xl p-6 shadow-sm border border-slate-800">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400 uppercase tracking-wider">
              <ShieldCheck className="w-4 h-4" />
              <span>Módulo Administrativo · Balcão da Secretaria</span>
            </div>
            <h2 className="text-2xl font-bold tracking-tight mt-1">
              Gestão de Atendimento & Protocolos ETEC
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Unidade: ETEC de São Paulo (001) · Operador: Secretário Acadêmico
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs bg-slate-800 border border-slate-700 px-3 py-1.5 rounded-lg text-slate-300">
              Guichê Ativo: <strong className="text-white">0{currentDesk}</strong>
            </span>
          </div>
        </div>

        {/* Admin KPI Counters */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-6 pt-6 border-t border-slate-800">
          <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800">
            <span className="text-xs text-slate-400">Requerimentos Pendentes</span>
            <div className="text-2xl font-bold font-mono text-amber-400 mt-1">{pendingCount}</div>
          </div>
          <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800">
            <span className="text-xs text-slate-400">Documentos Deferidos</span>
            <div className="text-2xl font-bold font-mono text-emerald-400 mt-1">{completedCount}</div>
          </div>
          <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800">
            <span className="text-xs text-slate-400">Pessoas na Fila Balcão</span>
            <div className="text-2xl font-bold font-mono text-blue-400 mt-1">{waitingTickets.length}</div>
          </div>
          <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800">
            <span className="text-xs text-slate-400">Tempo Médio de Resposta</span>
            <div className="text-2xl font-bold font-mono text-white mt-1">1.4 dias</div>
          </div>
        </div>
      </div>

      {/* Protocols Table */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h3 className="text-base font-bold text-slate-900">
              Fila de Requerimentos de Alunos
            </h3>
            <p className="text-xs text-slate-500">
              Analise, defira ou indefira as solicitações protocoladas pelos estudantes.
            </p>
          </div>

          <div className="w-full sm:max-w-xs relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Filtrar por protocolo ou aluno..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-red-600 focus:bg-white"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold">
              <tr>
                <th className="py-3 px-4">Código / Data</th>
                <th className="py-3 px-4">Serviço / Aluno</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Anexos</th>
                <th className="py-3 px-4 text-right">Ação</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((p) => (
                <tr key={p.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3.5 px-4 font-mono">
                    <div className="font-bold text-slate-900">{p.protocolCode}</div>
                    <div className="text-[10px] text-slate-400">{p.requestedAt}</div>
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="font-semibold text-slate-900">{p.title}</div>
                    <div className="text-slate-500 text-[11px] truncate max-w-sm">{p.description}</div>
                  </td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold ${
                        p.status === 'Concluído'
                          ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                          : p.status === 'Em Análise'
                          ? 'bg-amber-50 text-amber-800 border border-amber-200'
                          : p.status === 'Indeferido'
                          ? 'bg-rose-50 text-rose-800 border border-rose-200'
                          : 'bg-slate-100 text-slate-800'
                      }`}
                    >
                      {p.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    {p.attachmentName ? (
                      <span className="font-mono text-slate-700 bg-slate-100 px-2 py-0.5 rounded text-[10px]">
                        {p.attachmentName}
                      </span>
                    ) : (
                      <span className="text-slate-400 text-[10px]">Sem anexo</span>
                    )}
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={() => handleOpenReview(p)}
                      className="px-3 py-1.5 text-xs font-semibold text-red-700 hover:bg-red-50 rounded-lg border border-red-200 transition-colors cursor-pointer"
                    >
                      Avaliar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Review Modal */}
      {selectedProtocol && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in duration-150">
            <div className="bg-slate-900 text-white p-5 flex items-center justify-between">
              <div>
                <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">
                  Parecer da Secretaria Escolar
                </span>
                <h3 className="text-base font-bold mt-0.5">{selectedProtocol.protocolCode}</h3>
              </div>
              <button
                onClick={() => setSelectedProtocol(null)}
                className="text-slate-400 hover:text-white p-1"
              >
                ✕
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs text-slate-700">
              <div>
                <span className="font-semibold text-slate-500">Requerimento:</span>
                <div className="text-sm font-bold text-slate-900">{selectedProtocol.title}</div>
              </div>

              <div>
                <span className="font-semibold text-slate-500">Justificativa do Estudante:</span>
                <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 mt-1">
                  {selectedProtocol.description}
                </div>
              </div>

              {selectedProtocol.attachmentName && (
                <div>
                  <span className="font-semibold text-slate-500">Documento Comprobatório Anexado:</span>
                  <div className="text-xs font-mono font-medium text-slate-800 bg-slate-100 p-2 rounded mt-1">
                    📄 {selectedProtocol.attachmentName}
                  </div>
                </div>
              )}

              <div>
                <label className="block font-semibold text-slate-800 mb-1">
                  Parecer e Despacho da Secretaria (visível ao aluno):
                </label>
                <textarea
                  rows={3}
                  value={reviewNotes}
                  onChange={(e) => setReviewNotes(e.target.value)}
                  placeholder="Ex: Documentação conferida e aprovada. Declaração emitida e assinada digitalmente."
                  className="w-full text-xs p-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => handleConfirmDecision('Indeferido')}
                  className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-rose-700 hover:bg-rose-50 border border-rose-200 rounded-lg transition-colors cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                  <span>Indeferir Pedido</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleConfirmDecision('Concluído')}
                  className="inline-flex items-center gap-1.5 px-5 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors shadow-sm cursor-pointer"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Deferir / Concluir</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
