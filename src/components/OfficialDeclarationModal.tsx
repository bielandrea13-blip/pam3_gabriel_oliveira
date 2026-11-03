import React from 'react';
import { StudentProfile } from '../types';
import { EtecLogo, CPSLogo } from './EtecLogo';
import { Printer, X, Download, ShieldCheck, QrCode } from 'lucide-react';

interface OfficialDeclarationModalProps {
  student: StudentProfile;
  isOpen: boolean;
  onClose: () => void;
  validationHash?: string;
}

export const OfficialDeclarationModal: React.FC<OfficialDeclarationModalProps> = ({
  student,
  isOpen,
  onClose,
  validationHash = 'CPS-ETEC-2026-98124-78B4F',
}) => {
  if (!isOpen) return null;

  const issueDate = new Date().toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/70 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-3xl w-full shadow-2xl border border-slate-200 overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-150">
        {/* Top Control Bar (Hidden when printing) */}
        <div className="no-print bg-slate-900 text-white p-4 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span className="text-xs font-semibold text-slate-200">
              Visualização de Documento Autêntico com Certificação Digital
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-red-700 hover:bg-red-800 rounded-lg transition-colors cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Imprimir / Salvar PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg transition-colors text-sm cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Printable Document Sheet (Standard A4 letterhead format) */}
        <div className="p-8 sm:p-12 bg-white text-slate-900 font-serif leading-relaxed">
          {/* Institutional Letterhead */}
          <div className="border-b-2 border-red-700 pb-6 mb-8 text-center">
            <div className="flex items-center justify-between gap-4 mb-4">
              <EtecLogo variant="full" className="h-9" />
              <div className="text-right">
                <div className="text-[11px] font-sans font-bold text-slate-900 uppercase tracking-tight">
                  Governo do Estado de São Paulo
                </div>
                <div className="text-[10px] font-sans text-slate-600">
                  Secretaria de Ciência, Tecnologia e Inovação
                </div>
                <div className="text-[10px] font-sans font-semibold text-red-700">
                  Centro Estadual de Educação Tecnológica Paula Souza
                </div>
              </div>
            </div>

            <h1 className="text-lg font-sans font-black uppercase tracking-wider text-slate-900 mt-4">
              {student.unit}
            </h1>
            <p className="text-xs font-sans text-slate-600">
              Secretaria Acadêmica · Código de Unidade CPS: {student.unitCode}
            </p>
          </div>

          {/* Document Title */}
          <div className="text-center my-8">
            <h2 className="text-2xl font-bold font-sans tracking-tight text-slate-900 uppercase underline decoration-red-700 underline-offset-8">
              Declaração de Matrícula
            </h2>
            <div className="text-xs font-sans text-slate-500 mt-2 font-mono">
              Processo NSA nº: 2026/001-34892
            </div>
          </div>

          {/* Declaration Body */}
          <div className="text-justify text-sm sm:text-base space-y-4 my-8 font-normal leading-relaxed text-slate-800">
            <p>
              Declaramos para os devidos fins de direito, a pedido da parte interessada, que o(a) aluno(a){' '}
              <strong className="font-bold font-sans text-slate-950 uppercase">{student.fullName}</strong>,
              portador(a) do Registro de Matrícula nº <strong className="font-mono font-bold">{student.rm}</strong>{' '}
              e inscrito(a) no CPF/MF sob o nº <strong className="font-mono">{student.cpf}</strong>, encontra-se
              regularmente matriculado(a) e com frequência ativa no curso:
            </p>

            <div className="bg-slate-50 border border-slate-200 p-4 rounded-lg my-4 font-sans text-xs sm:text-sm space-y-1">
              <div><strong>Curso:</strong> {student.course}</div>
              <div><strong>Habilitação Técnica:</strong> Nível Médio Profissionalizante</div>
              <div><strong>Módulo Atual:</strong> {student.semester}</div>
              <div><strong>Turma / Período:</strong> {student.classCode} · Período {student.period}</div>
              <div><strong>Frequência Global Registrada:</strong> {student.overallAttendance}% (Frequência Mínima Regimental: 75%)</div>
              <div><strong>Ano / Semestre Letivo:</strong> 2026 · 1º Semestre</div>
            </div>

            <p>
              Por ser a expressão da verdade, firmamos a presente declaração que possui validade em todo o
              território nacional para comprovação de matrícula, concessão de estágio remunerado nos termos da
              Lei Federal nº 11.788/2008, e requisição de benefícios estudantis.
            </p>

            <p className="text-right pt-6">
              São Paulo, {issueDate}.
            </p>
          </div>

          {/* Signatures & Seal */}
          <div className="pt-10 border-t border-slate-200 grid grid-cols-1 sm:grid-cols-2 gap-8 items-end">
            <div className="flex items-center gap-4">
              {/* Simulated QR Code */}
              <div className="w-20 h-20 bg-slate-900 text-white p-2 rounded-lg flex flex-col items-center justify-center shrink-0 shadow">
                <QrCode className="w-12 h-12" />
                <span className="text-[7px] font-mono tracking-tighter mt-0.5">VALIDAR CPS</span>
              </div>
              <div className="text-[10px] font-sans text-slate-600 space-y-0.5">
                <div className="font-bold text-slate-900">Autenticidade Digital:</div>
                <div className="font-mono font-bold text-red-700 break-all">{validationHash}</div>
                <div>Valide em: etec.sp.gov.br/autenticidade</div>
                <div className="text-emerald-700 font-semibold">✓ Certificado ICP-Brasil / CPS</div>
              </div>
            </div>

            <div className="text-center font-sans border-t border-slate-400 pt-2">
              <div className="font-bold text-xs text-slate-900">Secretaria Acadêmica</div>
              <div className="text-[10px] text-slate-600">ETEC de São Paulo · Centro Paula Souza</div>
              <div className="text-[9px] text-slate-400 mt-0.5">Assinado eletronicamente via NSA</div>
            </div>
          </div>
        </div>

        {/* Modal Bottom Close */}
        <div className="no-print bg-slate-50 p-4 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
          <span>Documento emitido gratuitamente conforme regimento do Centro Paula Souza.</span>
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};
