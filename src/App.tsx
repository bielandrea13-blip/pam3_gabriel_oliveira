/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Header } from './components/Header';
import { StudentHero } from './components/StudentHero';
import { ServiceCatalog } from './components/ServiceCatalog';
import { ProtocolsList } from './components/ProtocolsList';
import { QueueSystem } from './components/QueueSystem';
import { DocumentValidator } from './components/DocumentValidator';
import { OfficialDeclarationModal } from './components/OfficialDeclarationModal';
import { StudentCardModal } from './components/StudentCardModal';
import { AIAssistantModal } from './components/AIAssistantModal';
import { SecretariatAdminView } from './components/SecretariatAdminView';
import { GitHubSubmissionModal } from './components/GitHubSubmissionModal';
import { Footer } from './components/Footer';

import { 
  CURRENT_STUDENT, 
  INITIAL_SERVICES, 
  INITIAL_PROTOCOLS, 
  INITIAL_QUEUE_TICKETS 
} from './data/mockData';
import { Protocol, QueueTicket, ServiceItem } from './types';
import { Sparkles, CheckCircle2, Bell, AlertTriangle } from 'lucide-react';

export default function App() {
  const [currentTab, setCurrentTab] = useState<string>('inicio');
  const [isAdminMode, setIsAdminMode] = useState<boolean>(false);
  const [student, setStudent] = useState(CURRENT_STUDENT);
  const [protocols, setProtocols] = useState<Protocol[]>(INITIAL_PROTOCOLS);
  const [tickets, setTickets] = useState<QueueTicket[]>(INITIAL_QUEUE_TICKETS);
  
  // Modals
  const [isGitHubModalOpen, setIsGitHubModalOpen] = useState(false);
  const [isAIChatOpen, setIsAIChatOpen] = useState(false);
  const [isDeclarationModalOpen, setIsDeclarationModalOpen] = useState(false);
  const [isCardModalOpen, setIsCardModalOpen] = useState(false);
  const [activeValidationHash, setActiveValidationHash] = useState<string>('CPS-ETEC-2026-98124-78B4F');

  // Flash toast notification
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Student takes a queue ticket
  const handleTakeTicket = (
    type: 'Geral' | 'Passe Escolar' | 'Documentos' | 'Coordenação',
    prefix: 'G' | 'P' | 'D' | 'C'
  ) => {
    // Generate next ticket number
    const count = tickets.filter(t => t.prefix === prefix).length + 1;
    const ticketNumStr = `${prefix}${String(count).padStart(3, '0')}`;
    const nowTime = new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });

    const newTicket: QueueTicket = {
      id: `ticket-${Date.now()}`,
      number: ticketNumStr,
      type,
      prefix,
      createdAt: nowTime,
      status: 'Aguardando',
      isPriority: false,
      studentName: student.fullName,
    };

    setTickets(prev => [...prev, newTicket]);
    showToast(`Senha ${ticketNumStr} gerada com sucesso! Aguarde ser chamado no painel.`);
    setCurrentTab('fila');
  };

  // Attendant calls next ticket
  const handleCallTicket = (ticketId: string, desk: number) => {
    const nowTime = new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
    setTickets(prev =>
      prev.map(t => {
        if (t.id === ticketId) {
          return {
            ...t,
            status: 'Chamado',
            desk,
            calledAt: nowTime,
          };
        }
        return t;
      })
    );
    showToast(`Chamando senha no Guichê 0${desk}!`);
  };

  // Student requests new service/protocol
  const handleRequestService = (
    service: ServiceItem,
    details: { description: string; attachmentName?: string }
  ) => {
    const randomNum = Math.floor(10000 + Math.random() * 90000);
    const code = `ETEC-2026-${randomNum}`;
    const nowStr = new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' }) +
      ' às ' + new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });

    const newProtocol: Protocol = {
      id: `prot-${Date.now()}`,
      protocolCode: code,
      title: service.title,
      category: service.category,
      requestedAt: nowStr,
      status: service.isImmediate ? 'Concluído' : 'Pendente',
      description: details.description,
      urgency: 'Normal',
      estimatedCompletion: service.isImmediate ? 'Imediato' : `${service.estimatedDays} dias úteis`,
      attachmentName: details.attachmentName,
      validationHash: `CPS-ETEC-2026-${randomNum}-AUT`,
      notes: service.isImmediate
        ? 'Documento gerado automaticamente com certificação digital.'
        : 'Requerimento protocolado com sucesso. Aguardando triagem da secretaria escolar.',
    };

    setProtocols(prev => [newProtocol, ...prev]);
    showToast(`Requerimento protocolado com sucesso! Código: ${code}`);

    if (service.isImmediate) {
      setActiveValidationHash(newProtocol.validationHash || 'CPS-ETEC-2026-98124-78B4F');
      setIsDeclarationModalOpen(true);
    } else {
      setCurrentTab('protocolos');
    }
  };

  // Secretariat updates status of a protocol
  const handleUpdateProtocolStatus = (
    id: string,
    newStatus: 'Concluído' | 'Indeferido' | 'Em Análise',
    notes?: string
  ) => {
    setProtocols(prev =>
      prev.map(p => {
        if (p.id === id) {
          return {
            ...p,
            status: newStatus,
            notes: notes || p.notes,
          };
        }
        return p;
      })
    );
    showToast(`Protocolo atualizado para: ${newStatus}`);
  };

  // Open official declaration
  const handleOpenDeclaration = (protocol?: Protocol) => {
    if (protocol?.validationHash) {
      setActiveValidationHash(protocol.validationHash);
    } else {
      setActiveValidationHash('CPS-ETEC-2026-98124-78B4F');
    }
    setIsDeclarationModalOpen(true);
  };

  const activeProtocolsCount = protocols.filter(p => p.status === 'Pendente' || p.status === 'Em Análise').length;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      {/* Toast alert */}
      {toastMessage && (
        <div className="fixed top-20 right-4 z-50 bg-slate-900 text-white text-xs px-4 py-3 rounded-xl shadow-2xl flex items-center gap-3 border border-slate-700 animate-in fade-in slide-in-from-top-3 duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Institutional Top Bar */}
      <Header
        currentTab={currentTab}
        onTabChange={(tab) => {
          setCurrentTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        isAdminMode={isAdminMode}
        onToggleAdminMode={() => {
          setIsAdminMode(!isAdminMode);
          showToast(!isAdminMode ? 'Alternado para Modo Secretaria / Atendente' : 'Alternado para Modo Estudante');
        }}
        onOpenGitHubModal={() => setIsGitHubModalOpen(true)}
        onOpenAIChat={() => setIsAIChatOpen(true)}
      />

      {/* Main Viewport Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {isAdminMode ? (
          /* SECRETARIAT ATTENDANT / EMPLOYEE VIEW */
          <SecretariatAdminView
            protocols={protocols}
            onUpdateProtocolStatus={handleUpdateProtocolStatus}
            tickets={tickets}
            onCallTicket={handleCallTicket}
          />
        ) : (
          /* STUDENT VIEW */
          <div>
            {/* Always show student header summary on 'inicio' */}
            {currentTab === 'inicio' && (
              <>
                <StudentHero
                  student={student}
                  activeProtocolsCount={activeProtocolsCount}
                  onOpenServiceCatalog={() => setCurrentTab('servicos')}
                  onOpenDeclaration={() => handleOpenDeclaration()}
                  onOpenQueue={() => setCurrentTab('fila')}
                  onOpenCard={() => setIsCardModalOpen(true)}
                />

                {/* Home Highlights: Recent Protocols & Quick Queue Status */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                  {/* Recent Protocols Box */}
                  <div className="lg:col-span-8 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
                    <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-3">
                      <div>
                        <h2 className="text-base font-bold text-slate-900">
                          Meus Requerimentos Recentes
                        </h2>
                        <p className="text-xs text-slate-500">
                          Acompanhe os últimos pedidos enviados para a secretaria acadêmica.
                        </p>
                      </div>
                      <button
                        onClick={() => setCurrentTab('protocolos')}
                        className="text-xs font-semibold text-red-700 hover:text-red-800 cursor-pointer"
                      >
                        Ver Todos →
                      </button>
                    </div>

                    <div className="space-y-3">
                      {protocols.slice(0, 3).map((p) => (
                        <div
                          key={p.id}
                          className="flex flex-col sm:flex-row sm:items-center justify-between p-3.5 rounded-xl border border-slate-100 hover:bg-slate-50 transition-colors gap-2"
                        >
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-mono text-xs font-bold text-slate-800">
                                {p.protocolCode}
                              </span>
                              <span
                                className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                                  p.status === 'Concluído'
                                    ? 'bg-emerald-50 text-emerald-800'
                                    : p.status === 'Em Análise'
                                    ? 'bg-amber-50 text-amber-800'
                                    : 'bg-slate-100 text-slate-700'
                                }`}
                              >
                                {p.status}
                              </span>
                            </div>
                            <h4 className="text-xs font-semibold text-slate-900 mt-1">
                              {p.title}
                            </h4>
                          </div>

                          <div className="text-right">
                            <span className="text-[11px] text-slate-400">
                              {p.requestedAt}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Academic Notices & Important Deadlines */}
                  <div className="lg:col-span-4 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-red-700 mb-2">
                        <Bell className="w-3.5 h-3.5" />
                        <span>Mural da Secretaria ETEC</span>
                      </div>
                      <h3 className="text-sm font-bold text-slate-900 mb-3">
                        Prazos & Avisos Acadêmicos
                      </h3>

                      <div className="space-y-3 text-xs">
                        <div className="p-3 bg-red-50/60 rounded-xl border border-red-100">
                          <strong className="text-red-900 font-semibold block">
                            Passe Escolar SPTrans 2026.1
                          </strong>
                          <p className="text-[11px] text-red-800 mt-0.5">
                            Cadastro de matrícula regular já transmitido para a SPTrans. Acesse o portal da SPTrans para emitir seu bilhete.
                          </p>
                        </div>

                        <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                          <strong className="text-slate-900 font-semibold block">
                            Atestados Médicos - Regra de 5 Dias
                          </strong>
                          <p className="text-[11px] text-slate-600 mt-0.5">
                            Para justificar faltas, anexe seu atestado no menu Serviços em até 5 dias úteis após a alta médica.
                          </p>
                        </div>

                        <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                          <strong className="text-slate-900 font-semibold block">
                            Feira Tecnológica - FETEPS 2026
                          </strong>
                          <p className="text-[11px] text-slate-600 mt-0.5">
                            Inscrições de projetos inovadores de TCC abertas na coordenação de curso.
                          </p>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => setIsAIChatOpen(true)}
                      className="mt-4 w-full flex items-center justify-center gap-2 py-2 px-3 text-xs font-semibold text-red-700 bg-red-50 hover:bg-red-100 rounded-xl transition-colors border border-red-200 cursor-pointer"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Tirar Dúvida com Assistente IA</span>
                    </button>
                  </div>
                </div>
              </>
            )}

            {currentTab === 'servicos' && (
              <ServiceCatalog
                services={INITIAL_SERVICES}
                onRequestService={handleRequestService}
                onInstantDeclaration={() => handleOpenDeclaration()}
              />
            )}

            {currentTab === 'protocolos' && (
              <ProtocolsList
                protocols={protocols}
                onOpenDeclaration={handleOpenDeclaration}
                onNewRequest={() => setCurrentTab('servicos')}
              />
            )}

            {currentTab === 'fila' && (
              <QueueSystem
                tickets={tickets}
                currentStudentName={student.fullName}
                onTakeTicket={handleTakeTicket}
                isAdmin={false}
              />
            )}

            {currentTab === 'validador' && (
              <DocumentValidator currentStudent={student} />
            )}
          </div>
        )}
      </main>

      {/* Floating AI Assistant Action Trigger */}
      <div className="fixed bottom-6 right-6 z-30 no-print">
        <button
          onClick={() => setIsAIChatOpen(true)}
          className="flex items-center gap-2.5 px-4 py-3 rounded-full bg-red-700 hover:bg-red-800 text-white shadow-xl hover:shadow-2xl transition-all hover:scale-105 cursor-pointer font-semibold text-xs border-2 border-white"
          title="Tirar Dúvidas com o Assistente Acadêmico ETEC"
        >
          <Sparkles className="w-4 h-4 text-amber-300" />
          <span className="hidden sm:inline">Tira-Dúvidas ETEC</span>
          <span className="sm:hidden">Dúvidas</span>
        </button>
      </div>

      {/* Modals */}
      <OfficialDeclarationModal
        student={student}
        isOpen={isDeclarationModalOpen}
        onClose={() => setIsDeclarationModalOpen(false)}
        validationHash={activeValidationHash}
      />

      <StudentCardModal
        student={student}
        isOpen={isCardModalOpen}
        onClose={() => setIsCardModalOpen(false)}
      />

      <AIAssistantModal
        isOpen={isAIChatOpen}
        onClose={() => setIsAIChatOpen(false)}
      />

      <GitHubSubmissionModal
        isOpen={isGitHubModalOpen}
        onClose={() => setIsGitHubModalOpen(false)}
      />

      {/* Institutional Footer */}
      <Footer />
    </div>
  );
}
