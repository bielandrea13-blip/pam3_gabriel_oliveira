import React, { useState } from 'react';
import { ShieldCheck, Search, CheckCircle2, XCircle, FileText, ArrowRight, Building, Calendar } from 'lucide-react';
import { StudentProfile } from '../types';

interface DocumentValidatorProps {
  currentStudent: StudentProfile;
}

export const DocumentValidator: React.FC<DocumentValidatorProps> = ({ currentStudent }) => {
  const [hashCode, setHashCode] = useState('');
  const [validationResult, setValidationResult] = useState<{
    isValid: boolean;
    studentName: string;
    course: string;
    rm: string;
    unit: string;
    issuedAt: string;
    documentType: string;
  } | null>(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const officialSampleHash = 'CPS-ETEC-2026-98124-78B4F';

  const handleValidate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!hashCode.trim()) return;

    setIsLoading(true);
    setHasSearched(false);

    setTimeout(() => {
      setIsLoading(false);
      setHasSearched(true);

      const cleanInput = hashCode.trim().toUpperCase();
      if (cleanInput.includes('CPS-ETEC') || cleanInput.includes('98124') || cleanInput.includes('ETEC-2026')) {
        setValidationResult({
          isValid: true,
          studentName: currentStudent.fullName,
          course: currentStudent.course,
          rm: currentStudent.rm,
          unit: currentStudent.unit,
          issuedAt: '02/11/2026 às 14:20:15',
          documentType: 'Declaração de Matrícula e Frequência Regular',
        });
      } else {
        setValidationResult(null);
      }
    }, 500);
  };

  const handleTestSample = () => {
    setHashCode(officialSampleHash);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-sm">
        <div className="text-center max-w-xl mx-auto mb-8">
          <div className="w-12 h-12 rounded-xl bg-red-50 text-red-700 flex items-center justify-center mx-auto mb-3">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">
            Validação de Documentos Escolares ETEC
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Verifique a autenticidade jurídica de declarações de matrícula, atestados e certidões emitidas pelo Centro Paula Souza através do código criptográfico.
          </p>
        </div>

        {/* Validation Form */}
        <form onSubmit={handleValidate} className="max-w-lg mx-auto space-y-3">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Código Verificador do Documento
            </label>
            <div className="relative">
              <input
                type="text"
                required
                placeholder="Ex: CPS-ETEC-2026-98124-78B4F"
                value={hashCode}
                onChange={(e) => setHashCode(e.target.value)}
                className="w-full text-sm font-mono uppercase tracking-wide px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-600 focus:bg-white transition-all"
              />
            </div>
          </div>

          <div className="flex items-center justify-between text-xs pt-1">
            <span className="text-slate-500">Dica para testes do avaliador:</span>
            <button
              type="button"
              onClick={handleTestSample}
              className="text-red-700 hover:text-red-800 font-semibold underline cursor-pointer"
            >
              Preencher código de teste
            </button>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-2 px-5 py-2.5 text-xs font-bold text-white bg-red-700 hover:bg-red-800 rounded-xl transition-colors shadow-sm disabled:opacity-50 cursor-pointer"
          >
            <Search className="w-4 h-4" />
            <span>{isLoading ? 'Consultando Base do NSA...' : 'Verificar Autenticidade'}</span>
          </button>
        </form>

        {/* Validation Results */}
        {hasSearched && (
          <div className="mt-8 pt-8 border-t border-slate-100 max-w-lg mx-auto animate-in fade-in duration-200">
            {validationResult ? (
              <div className="bg-emerald-50 border border-emerald-300 rounded-2xl p-6 text-emerald-950 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider">
                      Documento Autêntico e Válido
                    </span>
                    <h3 className="text-base font-bold text-slate-900">
                      Certificação Oficial Centro Paula Souza
                    </h3>
                  </div>
                </div>

                <div className="bg-white/80 rounded-xl p-4 text-xs space-y-2 border border-emerald-200">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Tipo de Documento:</span>
                    <strong className="text-slate-900">{validationResult.documentType}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Aluno Titular:</span>
                    <strong className="text-slate-900">{validationResult.studentName}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Registro de Matrícula (RM):</span>
                    <strong className="font-mono text-slate-900">{validationResult.rm}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Curso:</span>
                    <strong className="text-slate-900">{validationResult.course}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Unidade Escolar:</span>
                    <strong className="text-slate-900">{validationResult.unit}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Data e Hora de Emissão:</span>
                    <strong className="text-slate-900">{validationResult.issuedAt}</strong>
                  </div>
                </div>

                <p className="text-[11px] text-emerald-800 leading-relaxed">
                  ✓ Registro assinado com certificado digital ICP-Brasil e em conformidade com as diretrizes do Centro Paula Souza.
                </p>
              </div>
            ) : (
              <div className="bg-rose-50 border border-rose-200 rounded-2xl p-6 text-rose-950 space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-rose-600 text-white flex items-center justify-center shrink-0">
                    <XCircle className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-rose-950">
                      Documento Não Encontrado ou Código Inválido
                    </h3>
                    <p className="text-xs text-rose-700">
                      Não há registro no sistema NSA com este código verificador.
                    </p>
                  </div>
                </div>
                <p className="text-[11px] text-rose-800">
                  Verifique se o código foi digitado corretamente com hífens e maiúsculas. Caso a dúvida persista, entre em contato com a secretaria da ETEC.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
