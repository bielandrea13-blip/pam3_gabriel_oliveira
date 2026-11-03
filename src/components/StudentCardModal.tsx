import React, { useState } from 'react';
import { StudentProfile } from '../types';
import { EtecLogo } from './EtecLogo';
import { X, QrCode, CreditCard, RotateCw, Printer, ShieldCheck } from 'lucide-react';

interface StudentCardModalProps {
  student: StudentProfile;
  isOpen: boolean;
  onClose: () => void;
}

export const StudentCardModal: React.FC<StudentCardModalProps> = ({
  student,
  isOpen,
  onClose,
}) => {
  const [isFlipped, setIsFlipped] = useState(false);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/70 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-150">
        <div className="bg-slate-900 text-white p-4 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-2">
            <CreditCard className="w-4 h-4 text-red-500" />
            <span className="text-xs font-semibold text-slate-200">
              Carteirinha Digital do Estudante · ETEC
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsFlipped(!isFlipped)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg transition-colors cursor-pointer"
            >
              <RotateCw className="w-3.5 h-3.5" />
              <span>Girar Cartão</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg text-sm cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="p-6 sm:p-8 flex flex-col items-center justify-center bg-slate-100">
          {/* Card Presentation Frame */}
          {!isFlipped ? (
            /* FRONT OF STUDENT ID CARD */
            <div className="w-full max-w-sm rounded-2xl bg-gradient-to-br from-slate-950 via-slate-900 to-red-950 text-white p-5 shadow-2xl border-2 border-red-700/60 relative overflow-hidden">
              {/* Subtle decorative watermark */}
              <div className="absolute -right-8 -bottom-8 opacity-10 pointer-events-none">
                <EtecLogo variant="white" className="h-44" />
              </div>

              {/* Top Header of Card */}
              <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-4">
                <EtecLogo variant="white" className="h-6" />
                <div className="text-right">
                  <div className="text-[9px] uppercase tracking-wider text-slate-300 font-bold">
                    Centro Paula Souza
                  </div>
                  <div className="text-[8px] text-red-400 font-medium">Governo de São Paulo</div>
                </div>
              </div>

              {/* Student Information and Photo */}
              <div className="flex items-start gap-4">
                <img
                  src={student.avatarUrl}
                  alt={student.fullName}
                  referrerPolicy="no-referrer"
                  className="w-20 h-24 rounded-lg object-cover border-2 border-red-600/80 shadow-md bg-slate-800 shrink-0"
                />
                <div className="space-y-1 text-xs">
                  <div>
                    <div className="text-[9px] uppercase tracking-wider text-slate-400">Estudante</div>
                    <div className="font-bold text-white text-sm leading-tight">{student.fullName}</div>
                  </div>
                  <div>
                    <div className="text-[9px] uppercase tracking-wider text-slate-400">Curso</div>
                    <div className="font-semibold text-slate-200 text-xs">{student.course}</div>
                  </div>
                  <div className="flex items-center gap-3 pt-1">
                    <div>
                      <div className="text-[9px] uppercase tracking-wider text-slate-400">RM</div>
                      <div className="font-mono font-bold text-red-400">{student.rm}</div>
                    </div>
                    <div>
                      <div className="text-[9px] uppercase tracking-wider text-slate-400">Validade</div>
                      <div className="font-mono font-bold text-emerald-400">12/2026</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Barcode and Security Stripe */}
              <div className="mt-5 pt-3 border-t border-white/10 flex items-center justify-between">
                <div>
                  <div className="h-7 w-36 bg-white/90 rounded px-1.5 flex items-center justify-between space-x-0.5">
                    {/* Stylized Barcode */}
                    {Array.from({ length: 24 }).map((_, i) => (
                      <div
                        key={i}
                        className={`h-full bg-slate-900 ${i % 3 === 0 ? 'w-1' : i % 2 === 0 ? 'w-0.5' : 'w-1.5'}`}
                      />
                    ))}
                  </div>
                  <div className="text-[8px] font-mono text-slate-400 mt-1">
                    DNE-SP: {student.rm.replace('-', '')}0012026
                  </div>
                </div>

                <div className="w-10 h-10 bg-white text-slate-900 p-1 rounded flex items-center justify-center">
                  <QrCode className="w-8 h-8" />
                </div>
              </div>
            </div>
          ) : (
            /* BACK OF STUDENT ID CARD */
            <div className="w-full max-w-sm rounded-2xl bg-slate-900 text-white p-5 shadow-2xl border-2 border-slate-700 relative overflow-hidden space-y-3">
              <div className="border-b border-white/10 pb-2">
                <div className="text-[10px] font-bold text-slate-200 uppercase tracking-wider">
                  Documento Nacional do Estudante (DNE)
                </div>
                <div className="text-[8px] text-slate-400">
                  Emitido em conformidade com a Lei Federal nº 12.933/2013
                </div>
              </div>

              <div className="space-y-1.5 text-[10px] text-slate-300">
                <div><strong>Unidade de Ensino:</strong> {student.unit}</div>
                <div><strong>Código da Unidade:</strong> {student.unitCode}</div>
                <div><strong>CPF:</strong> {student.cpf}</div>
                <div><strong>Turma / Período:</strong> {student.classCode} ({student.period})</div>
                <div><strong>Vínculo:</strong> Regularmente Matriculado</div>
              </div>

              <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800 text-[8px] text-slate-400 leading-tight">
                Válido para concessão de 50% de desconto em salas de cinema, cineclubes, teatros, espetáculos musicais e circenses em todo o território nacional.
              </div>

              <div className="pt-2 border-t border-white/10 text-center">
                <div className="text-[9px] font-mono text-emerald-400 font-bold">
                  AUTENTICAÇÃO: CPS-DNE-2026-34892
                </div>
              </div>
            </div>
          )}

          <p className="text-xs text-slate-500 mt-4 text-center">
            Clique em <strong>Girar Cartão</strong> para visualizar o verso com dados da Lei de Meia-Entrada.
          </p>
        </div>

        <div className="bg-white p-4 border-t border-slate-200 flex items-center justify-between">
          <button
            onClick={() => window.print()}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Imprimir Carteirinha</span>
          </button>
          <button
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};
