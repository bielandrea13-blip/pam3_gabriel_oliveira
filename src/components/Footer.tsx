import React from 'react';
import { EtecLogo, CPSLogo } from './EtecLogo';
import { ExternalLink, ShieldCheck, Heart } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="no-print bg-slate-900 text-slate-400 text-xs border-t border-slate-800 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8 pb-8 border-b border-slate-800">
          {/* Col 1: Brand & Gov */}
          <div className="space-y-3 md:col-span-1">
            <EtecLogo variant="white" className="h-7" />
            <p className="text-slate-400 text-[11px] leading-relaxed">
              Sistema de Atendimento e Secretaria Acadêmica Digital para alunos e comunidade das Escolas Técnicas Estaduais.
            </p>
            <div className="text-[10px] text-slate-500">
              Centro Paula Souza · Governo de São Paulo
            </div>
          </div>

          {/* Col 2: Serviços Acadêmicos */}
          <div className="space-y-2">
            <h4 className="text-white text-xs font-bold uppercase tracking-wider">
              Serviços Escolares
            </h4>
            <ul className="space-y-1.5 text-[11px]">
              <li><span className="hover:text-white transition-colors cursor-pointer">Declaração de Matrícula Digital</span></li>
              <li><span className="hover:text-white transition-colors cursor-pointer">Passe Escolar (SPTrans & EMTU)</span></li>
              <li><span className="hover:text-white transition-colors cursor-pointer">Entrega de Atestados Médicos</span></li>
              <li><span className="hover:text-white transition-colors cursor-pointer">Histórico Escolar e Certificados</span></li>
            </ul>
          </div>

          {/* Col 3: Links Institucionais */}
          <div className="space-y-2">
            <h4 className="text-white text-xs font-bold uppercase tracking-wider">
              Portais Oficiais CPS
            </h4>
            <ul className="space-y-1.5 text-[11px]">
              <li>
                <a href="https://nsa.cps.sp.gov.br" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors inline-flex items-center gap-1">
                  <span>NSA - Novo Sistema Acadêmico</span>
                  <ExternalLink className="w-3 h-3 text-slate-500" />
                </a>
              </li>
              <li>
                <a href="https://www.vestibulinhoetec.com.br" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors inline-flex items-center gap-1">
                  <span>Vestibulinho ETEC</span>
                  <ExternalLink className="w-3 h-3 text-slate-500" />
                </a>
              </li>
              <li>
                <a href="https://www.cps.sp.gov.br" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors inline-flex items-center gap-1">
                  <span>Portal Centro Paula Souza</span>
                  <ExternalLink className="w-3 h-3 text-slate-500" />
                </a>
              </li>
              <li>
                <span className="hover:text-white transition-colors cursor-pointer">Regimento Comum das ETECs</span>
              </li>
            </ul>
          </div>

          {/* Col 4: Atendimento Presencial */}
          <div className="space-y-2">
            <h4 className="text-white text-xs font-bold uppercase tracking-wider">
              Secretaria Presencial
            </h4>
            <div className="text-[11px] space-y-1 text-slate-400">
              <div>Horário: Segunda a Sexta, 08h às 21h30</div>
              <div>Guichês 01 a 03 · Térreo - Prédio Administrativo</div>
              <div className="text-red-400 font-semibold pt-1">
                Atendimento por ordem de senha virtual
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
          <div>
            © {new Date().getFullYear()} Centro Estadual de Educação Tecnológica Paula Souza. Todos os direitos reservados.
          </div>
          <div className="flex items-center gap-4">
            <span>Desenvolvido no Google AI Studio (Vibe Coding)</span>
            <span aria-hidden="true">·</span>
            <span>Atividade Acadêmica ETEC</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
