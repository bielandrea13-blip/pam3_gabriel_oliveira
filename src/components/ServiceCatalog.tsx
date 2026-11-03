import React, { useState } from 'react';
import { ServiceItem, RequestCategory } from '../types';
import { 
  FileText, 
  Clock, 
  CheckCircle, 
  Search, 
  ArrowRight, 
  UploadCloud, 
  Sparkles, 
  AlertCircle,
  HelpCircle,
  FileCheck
} from 'lucide-react';

interface ServiceCatalogProps {
  services: ServiceItem[];
  onRequestService: (service: ServiceItem, details: { description: string; attachmentName?: string }) => void;
  onInstantDeclaration: () => void;
}

export const ServiceCatalog: React.FC<ServiceCatalogProps> = ({
  services,
  onRequestService,
  onInstantDeclaration,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<RequestCategory | 'todos'>('todos');
  const [activeModalService, setActiveModalService] = useState<ServiceItem | null>(null);
  const [requestNotes, setRequestNotes] = useState('');
  const [attachedFile, setAttachedFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const filteredServices = services.filter((srv) => {
    const matchesSearch = 
      srv.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      srv.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      srv.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesCategory = selectedCategory === 'todos' || srv.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleOpenForm = (srv: ServiceItem) => {
    if (srv.isImmediate && srv.id === 'dec-matr') {
      onInstantDeclaration();
      return;
    }
    setActiveModalService(srv);
    setRequestNotes('');
    setAttachedFile(null);
  };

  const handleSubmitRequest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeModalService) return;

    setIsSubmitting(true);
    setTimeout(() => {
      onRequestService(activeModalService, {
        description: requestNotes.trim() || `Requerimento padrão de ${activeModalService.title}`,
        attachmentName: attachedFile ? attachedFile.name : undefined,
      });
      setIsSubmitting(false);
      setActiveModalService(null);
    }, 600);
  };

  return (
    <div className="space-y-6">
      {/* Search and Category Filter Toolbar */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 sm:p-5 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="w-full sm:max-w-md relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Buscar serviço (ex: atestado, passe, histórico)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600 focus:bg-white transition-all"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto p-1 bg-slate-100 rounded-lg">
            {(['todos', 'documentos', 'beneficios', 'frequencia', 'academico'] as const).map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 text-xs font-medium rounded-md whitespace-nowrap transition-colors cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-white text-slate-900 shadow-sm font-semibold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {cat === 'todos' && 'Todos os Serviços'}
                {cat === 'documentos' && 'Documentos'}
                {cat === 'beneficios' && 'Passe & Benefícios'}
                {cat === 'frequencia' && 'Frequência & Atestados'}
                {cat === 'academico' && 'Acadêmico & Matrícula'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredServices.map((srv) => (
          <div
            key={srv.id}
            className="bg-white border border-slate-200 rounded-xl p-5 hover:border-red-600/60 hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between gap-2 mb-2">
                <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                  {srv.category}
                </span>
                {srv.isImmediate ? (
                  <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                    <CheckCircle className="w-3 h-3" /> Emissão Instantânea
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-500">
                    <Clock className="w-3 h-3" /> {srv.estimatedDays} {srv.estimatedDays === 1 ? 'dia útil' : 'dias úteis'}
                  </span>
                )}
              </div>

              <h3 className="text-base font-bold text-slate-900 group-hover:text-red-700 transition-colors">
                {srv.title}
              </h3>

              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                {srv.description}
              </p>

              {/* Tags */}
              <div className="flex flex-wrap items-center gap-1.5 mt-3 pt-3 border-t border-slate-100">
                {srv.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-[10px] text-slate-500 bg-slate-50 border border-slate-100 px-2 py-0.5 rounded"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            <div className="mt-5 pt-3">
              <button
                onClick={() => handleOpenForm(srv)}
                className={`w-full inline-flex items-center justify-center gap-2 px-4 py-2 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                  srv.isImmediate
                    ? 'bg-red-700 hover:bg-red-800 text-white shadow-sm'
                    : 'bg-slate-900 hover:bg-slate-800 text-white'
                }`}
              >
                <span>{srv.isImmediate ? 'Emitir Agora' : 'Solicitar Requerimento'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredServices.length === 0 && (
        <div className="text-center py-12 bg-white border border-slate-200 rounded-xl p-8">
          <HelpCircle className="w-10 h-10 text-slate-300 mx-auto mb-3" />
          <h4 className="text-sm font-semibold text-slate-900">Nenhum serviço encontrado</h4>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            Tente buscar com outros termos ou selecione outra categoria acima.
          </p>
        </div>
      )}

      {/* Interactive Protocol Request Modal */}
      {activeModalService && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="bg-slate-900 text-white p-5 flex items-center justify-between">
              <div>
                <span className="text-[11px] font-semibold text-red-400 uppercase tracking-wider">
                  Requerimento Acadêmico ETEC
                </span>
                <h3 className="text-lg font-bold mt-0.5">{activeModalService.title}</h3>
              </div>
              <button
                onClick={() => setActiveModalService(null)}
                className="text-slate-400 hover:text-white p-1 rounded-lg text-sm"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmitRequest} className="p-6 space-y-4">
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 text-xs text-slate-700">
                <div className="flex items-center gap-2 font-semibold text-slate-900 mb-1">
                  <Clock className="w-4 h-4 text-red-700" />
                  <span>Prazo estimado de análise: {activeModalService.estimatedDays} dias úteis</span>
                </div>
                <p className="text-slate-600">{activeModalService.description}</p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-800 mb-1.5">
                  Finalidade / Observações do Requerimento
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="Descreva o motivo do pedido ou detalhes relevantes (ex: para entrega no RH da empresa, consulta no posto de saúde, etc.)..."
                  value={requestNotes}
                  onChange={(e) => setRequestNotes(e.target.value)}
                  className="w-full text-xs p-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-red-600"
                />
              </div>

              {activeModalService.requiresAttachment && (
                <div>
                  <label className="block text-xs font-semibold text-slate-800 mb-1.5">
                    Anexar Documento Comprobatório (PDF, JPG ou PNG)
                  </label>
                  <label className="border-2 border-dashed border-slate-200 hover:border-red-600/70 rounded-xl p-4 flex flex-col items-center justify-center cursor-pointer bg-slate-50/50 hover:bg-red-50/30 transition-all">
                    <UploadCloud className="w-7 h-7 text-red-700 mb-1" />
                    <span className="text-xs font-medium text-slate-700">
                      {attachedFile ? attachedFile.name : 'Clique para selecionar arquivo do computador'}
                    </span>
                    <span className="text-[10px] text-slate-400 mt-0.5">
                      {attachedFile ? `${(attachedFile.size / 1024).toFixed(1)} KB` : 'Máximo 10MB (Atestado médico, declaração ou RG)'}
                    </span>
                    <input
                      type="file"
                      required
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                          setAttachedFile(e.target.files[0]);
                        }
                      }}
                      className="hidden"
                    />
                  </label>
                </div>
              )}

              <div className="bg-red-50 border border-red-200/60 rounded-lg p-3 text-[11px] text-red-900 flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-red-700 shrink-0 mt-0.5" />
                <span>
                  O protocolo será gerado no NSA (Novo Sistema Acadêmico da ETEC) e você poderá acompanhar o andamento na aba <strong>Acompanhar Pedidos</strong>.
                </span>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setActiveModalService(null)}
                  className="px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex items-center gap-2 px-5 py-2 text-xs font-semibold text-white bg-red-700 hover:bg-red-800 rounded-lg transition-colors shadow-sm disabled:opacity-50 cursor-pointer"
                >
                  <FileCheck className="w-3.5 h-3.5" />
                  <span>{isSubmitting ? 'Gerando Protocolo...' : 'Confirmar e Protocolar'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
