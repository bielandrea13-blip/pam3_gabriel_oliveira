export type RequestCategory = 
  | 'documentos' 
  | 'frequencia' 
  | 'academico' 
  | 'beneficios' 
  | 'carteirinha';

export type ProtocolStatus = 
  | 'Pendente' 
  | 'Em Análise' 
  | 'Pronto para Retirada' 
  | 'Concluído' 
  | 'Indeferido';

export interface Protocol {
  id: string;
  protocolCode: string;
  title: string;
  category: RequestCategory;
  requestedAt: string;
  status: ProtocolStatus;
  description: string;
  urgency: 'Normal' | 'Urgente';
  estimatedCompletion: string;
  notes?: string;
  attachmentName?: string;
  validationHash?: string;
}

export interface QueueTicket {
  id: string;
  number: string;
  type: 'Geral' | 'Passe Escolar' | 'Documentos' | 'Coordenação';
  prefix: 'G' | 'P' | 'D' | 'C';
  createdAt: string;
  calledAt?: string;
  desk?: number;
  status: 'Aguardando' | 'Chamado' | 'Atendido';
  isPriority: boolean;
  studentName?: string;
}

export interface StudentProfile {
  rm: string;
  fullName: string;
  cpf: string;
  course: string;
  period: 'Manhã' | 'Tarde' | 'Noite' | 'Integral';
  semester: string;
  classCode: string;
  unit: string;
  unitCode: string;
  email: string;
  overallAttendance: number;
  status: 'Regular / Ativa' | 'Trancada' | 'Concluída';
  avatarUrl: string;
}

export interface ServiceItem {
  id: string;
  title: string;
  category: RequestCategory;
  description: string;
  estimatedDays: number;
  requiresAttachment: boolean;
  isImmediate: boolean;
  tags: string[];
}
