import React from 'react';
import { StudentProfile } from '../types';
import { FileText, Ticket, CreditCard, PlusCircle, CheckCircle2, AlertCircle, Building2, Calendar } from 'lucide-react';

interface StudentHeroProps {
  student: StudentProfile;
  activeProtocolsCount: number;
  onOpenServiceCatalog: () => void;
  onOpenDeclaration: () => void;
  onOpenQueue: () => void;
  onOpenCard: () => void;
}

export const StudentHero: React.FC<StudentHeroProps> = ({
  student,
  activeProtocolsCount,
  onOpenServiceCatalog,
  onOpenDeclaration,
  onOpenQueue,
  onOpenCard,
}) => {
  return (
    <div className="relative overflow-hidden bg-white border border-slate-200 rounded-2xl shadow-sm mb-8">
      {/* Visual Header Banner with Campus Photography */}
      <div className="relative h-48 md:h-56 w-full overflow-hidden bg-slate-900">
        <img
          src="/src/assets/images/etec_campus_entrance_1793731140984.jpg"
          alt="Campus da ETEC São Paulo"
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover opacity-60"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/40 to-transparent" />
        
        {/* Banner Content */}
        <div className="absolute bottom-4 left-4 right-4 md:left-8 md:right-8 flex flex-col md:flex-row md:items-end justify-between gap-4 text-white">
          <div className="flex items-center gap-4">
            <img
              src={student.avatarUrl}
              alt={student.fullName}
              referrerPolicy="no-referrer"
              className="w-16 h-16 md:w-20 md:h-20 rounded-full border-2 border-white shadow-md object-cover bg-slate-800"
            />
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl md:text-2xl font-bold tracking-tight text-white">
                  {student.fullName}
                </h1>
                <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-300 bg-emerald-950/70 border border-emerald-500/30 px-2 py-0.5 rounded">
                  <CheckCircle2 className="w-3 h-3" /> {student.status}
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-300 mt-1">
                <span>RM: <strong className="text-white font-mono">{student.rm}</strong></span>
                <span aria-hidden="true">·</span>
                <span>{student.course}</span>
                <span aria-hidden="true">·</span>
                <span>{student.semester} ({student.period})</span>
              </div>
            </div>
          </div>

          <div className="text-xs text-slate-300 hidden lg:block text-right">
            <div className="flex items-center justify-end gap-1.5 text-slate-200 font-medium">
              <Building2 className="w-3.5 h-3.5 text-red-400" />
              <span>{student.unit}</span>
            </div>
            <div className="flex items-center justify-end gap-1.5 mt-1 text-slate-400">
              <Calendar className="w-3.5 h-3.5" />
              <span>Semestre Letivo 2026.1 · NSA Integrado</span>
            </div>
          </div>
        </div>
      </div>

      {/* KPI & Metric Strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 border-b border-slate-100 bg-slate-50/70">
        <div className="p-4 border-r border-slate-100">
          <div className="text-xs text-slate-500 font-medium">Frequência Geral</div>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-bold font-mono tabular-nums text-slate-900">
              {student.overallAttendance}%
            </span>
            <span className="text-[11px] text-emerald-700 font-medium">
              (Mínimo 75%)
            </span>
          </div>
          <div className="w-full bg-slate-200 h-1.5 rounded-full mt-2 overflow-hidden">
            <div
              className="bg-emerald-600 h-1.5 rounded-full"
              style={{ width: `${student.overallAttendance}%` }}
            />
          </div>
        </div>

        <div className="p-4 border-r border-slate-100">
          <div className="text-xs text-slate-500 font-medium">Pedidos em Análise</div>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-bold font-mono tabular-nums text-slate-900">
              {activeProtocolsCount}
            </span>
            <span className="text-[11px] text-amber-700 font-medium">Em tramitação</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-2 truncate">Prazo médio: 2 a 3 dias úteis</p>
        </div>

        <div className="p-4 border-r border-slate-100">
          <div className="text-xs text-slate-500 font-medium">Turma & Sala</div>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-bold font-mono text-slate-900">
              {student.classCode}
            </span>
            <span className="text-[11px] text-slate-600 font-medium">Lab 04 / Sala 12</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-2">Período Noturno (19h às 22h45)</p>
        </div>

        <div className="p-4">
          <div className="text-xs text-slate-500 font-medium">Passe Escolar 2026</div>
          <div className="flex items-baseline gap-1.5 mt-1 text-emerald-700 font-semibold text-sm">
            <CheckCircle2 className="w-4 h-4" />
            <span>Homologado SPTrans</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-2">DNE Cadastrado no SIGA</p>
        </div>
      </div>

      {/* Quick Action Toolbar */}
      <div className="p-4 sm:p-6 bg-white">
        <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
          Ações Rápidas da Secretaria
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <button
            onClick={onOpenDeclaration}
            className="flex items-center gap-3 p-3.5 text-left rounded-xl border border-slate-200 hover:border-red-600 hover:bg-red-50/40 transition-all group cursor-pointer"
          >
            <div className="w-10 h-10 rounded-lg bg-red-50 flex items-center justify-center text-red-700 group-hover:bg-red-700 group-hover:text-white transition-colors shrink-0">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm font-semibold text-slate-900 group-hover:text-red-700 transition-colors">
                Emitir Declaração
              </div>
              <div className="text-xs text-slate-500">Matrícula imediata com hash</div>
            </div>
          </button>

          <button
            onClick={onOpenQueue}
            className="flex items-center gap-3 p-3.5 text-left rounded-xl border border-slate-200 hover:border-red-600 hover:bg-red-50/40 transition-all group cursor-pointer"
          >
            <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center text-slate-700 group-hover:bg-red-700 group-hover:text-white transition-colors shrink-0">
              <Ticket className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm font-semibold text-slate-900 group-hover:text-red-700 transition-colors">
                Tirar Senha Presencial
              </div>
              <div className="text-xs text-slate-500">Balcão da secretaria ETEC</div>
            </div>
          </button>

          <button
            onClick={onOpenServiceCatalog}
            className="flex items-center gap-3 p-3.5 text-left rounded-xl border border-slate-200 hover:border-red-600 hover:bg-red-50/40 transition-all group cursor-pointer"
          >
            <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center text-slate-700 group-hover:bg-red-700 group-hover:text-white transition-colors shrink-0">
              <PlusCircle className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm font-semibold text-slate-900 group-hover:text-red-700 transition-colors">
                Novo Requerimento
              </div>
              <div className="text-xs text-slate-500">Atestados, histórico, passe</div>
            </div>
          </button>

          <button
            onClick={onOpenCard}
            className="flex items-center gap-3 p-3.5 text-left rounded-xl border border-slate-200 hover:border-red-600 hover:bg-red-50/40 transition-all group cursor-pointer"
          >
            <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center text-slate-700 group-hover:bg-red-700 group-hover:text-white transition-colors shrink-0">
              <CreditCard className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm font-semibold text-slate-900 group-hover:text-red-700 transition-colors">
                Carteirinha Digital
              </div>
              <div className="text-xs text-slate-500">DNE com QR code do aluno</div>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};
