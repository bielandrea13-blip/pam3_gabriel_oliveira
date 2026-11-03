import React, { useState } from 'react';
import { Protocol, ProtocolStatus } from '../types';
import { 
  Search, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  FileText, 
  Copy, 
  Check, 
  ExternalLink, 
  FileDown,
  Paperclip,
  Printer
} from 'lucide-react';

interface ProtocolsListProps {
  protocols: Protocol[];
  onOpenDeclaration: (protocol?: Protocol) => void;
  onNewRequest: () => void;
}

export const ProtocolsList: React.FC<ProtocolsListProps> = ({
  protocols,
  onOpenDeclaration,
  onNewRequest,
}) => {
  const [filterStatus, setFilterStatus] = useState<string>('todos');
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const filtered = protocols.filter((p) => {
    const matchesFilter = filterStatus === 'todos' || p.status === filterStatus;
    const matchesSearch = 
      p.protocolCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const getStatusBadge = (status: ProtocolStatus) => {
    switch (status) {
      case 'Concluído':
        return (
          <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Concluído
          </span>
        );
      case 'Pronto para Retirada':
        return (
          <span className="inline-flex items-center gap-1 text-xs font-semibold text-blue-800 bg-blue-50 border border-blue-200 px-2.5 py-0.5 rounded-full">
            <Check className="w-3.5 h-3.5 text-blue-600" /> Pronto no Balcão
          </span>
        );
      case 'Em Análise':
        return (
          <span className="inline-flex items-center gap-1 text-xs font-semibold text-amber-800 bg-amber-50 border border-amber-200 px-2.5 py-0.5 rounded-full">
            <Clock className="w-3.5 h-3.5 text-amber-600" /> Em Análise
          </span>
        );
      case 'Indeferido':
        return (
          <span className="inline-flex items-center gap-1 text-xs font-semibold text-rose-800 bg-rose-50 border border-rose-200 px-2.5 py-0.5 rounded-full">
            <AlertCircle className="w-3.5 h-3.5 text-rose-600" /> Indeferido
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 text-xs font-semibold text-slate-700 bg-slate-100 border border-slate-200 px-2.5 py-0.5 rounded-full">
            <Clock className="w-3.5 h-3.5 text-slate-500" /> Pendente
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Search and Filters */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 sm:p-5 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="w-full sm:max-w-md relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Buscar por código ou assunto (ex: ETEC-2026)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600 focus:bg-white transition-all"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto p-1 bg-slate-100 rounded-lg">
            {['todos', 'Pendente', 'Em Análise', 'Concluído'].map((status) => (
              <button
                key={status}
                onClick={() => setFilterStatus(status)}
                className={`px-3 py-1.5 text-xs font-medium rounded-md whitespace-nowrap transition-colors cursor-pointer ${
                  filterStatus === status
                    ? 'bg-white text-slate-900 shadow-sm font-semibold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {status === 'todos' ? 'Todos os Pedidos' : status}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Protocols List */}
      <div className="space-y-4">
        {filtered.map((item) => {
          const isCompleted = item.status === 'Concluído' || item.status === 'Pronto para Retirada';
          const isDoc = item.title.toLowerCase().includes('declaração') || item.title.toLowerCase().includes('matricula');

          return (
            <div
              key={item.id}
              className="bg-white border border-slate-200 rounded-xl p-5 sm:p-6 shadow-sm hover:border-slate-300 transition-all space-y-4"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1.5 bg-slate-100 px-2.5 py-1 rounded-md font-mono text-xs font-bold text-slate-800">
                    <span>{item.protocolCode}</span>
                    <button
                      onClick={() => handleCopyCode(item.protocolCode)}
                      className="text-slate-400 hover:text-slate-700 ml-1"
                      title="Copiar código do protocolo"
                    >
                      {copiedCode === item.protocolCode ? (
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                  <span className="text-xs text-slate-500 font-medium">
                    Aberto em {item.requestedAt}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  {getStatusBadge(item.status)}
                </div>
              </div>

              <div>
                <h3 className="text-base font-bold text-slate-900">{item.title}</h3>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                  {item.description}
                </p>
              </div>

              {/* Secretariat Attendant Notes */}
              {item.notes && (
                <div className="bg-slate-50 border border-slate-200/80 rounded-lg p-3 text-xs text-slate-700">
                  <div className="font-semibold text-slate-800 text-[11px] uppercase tracking-wider mb-0.5">
                    Parecer da Secretaria Escolar:
                  </div>
                  <p>{item.notes}</p>
                </div>
              )}

              {/* Attachments / Validation Hash info */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-2 text-xs text-slate-500">
                <div className="flex items-center gap-4">
                  {item.attachmentName && (
                    <span className="inline-flex items-center gap-1 text-slate-700 bg-slate-100 px-2.5 py-1 rounded">
                      <Paperclip className="w-3.5 h-3.5 text-slate-500" />
                      <span className="truncate max-w-[200px]">{item.attachmentName}</span>
                    </span>
                  )}
                  {item.validationHash && (
                    <span className="inline-flex items-center gap-1 text-[11px] font-mono text-slate-600">
                      <span>Autenticação:</span>
                      <strong className="text-slate-800">{item.validationHash}</strong>
                    </span>
                  )}
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2">
                  {isCompleted && isDoc && (
                    <button
                      onClick={() => onOpenDeclaration(item)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-red-700 hover:bg-red-800 rounded-lg transition-colors shadow-sm cursor-pointer"
                    >
                      <Printer className="w-3.5 h-3.5" />
                      <span>Imprimir Declaração Oficial</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}

        {filtered.length === 0 && (
          <div className="text-center py-12 bg-white border border-slate-200 rounded-xl p-8">
            <FileText className="w-10 h-10 text-slate-300 mx-auto mb-3" />
            <h4 className="text-sm font-semibold text-slate-900">Nenhum protocolo encontrado</h4>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              Você ainda não possui requerimentos cadastrados com estes filtros.
            </p>
            <button
              onClick={onNewRequest}
              className="mt-4 px-4 py-2 text-xs font-semibold text-white bg-red-700 hover:bg-red-800 rounded-lg transition-colors cursor-pointer"
            >
              Criar Novo Requerimento
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
