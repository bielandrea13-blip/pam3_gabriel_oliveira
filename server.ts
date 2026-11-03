import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json());

// Initialize Google GenAI client if API key is present
const apiKey = process.env.GEMINI_API_KEY;
let aiClient: GoogleGenAI | null = null;
if (apiKey) {
  try {
    aiClient = new GoogleGenAI({ apiKey });
  } catch (err) {
    console.error('Falha ao inicializar Google GenAI:', err);
  }
}

// System instructions for the ETEC Virtual Assistant
const ETEC_SYSTEM_INSTRUCTION = `
Você é o "Tira-Dúvidas Acadêmico da ETEC", o assistente virtual oficial das Escolas Técnicas Estaduais (ETEC) do Centro Paula Souza (Governo do Estado de São Paulo).
Seu objetivo é ajudar alunos, responsáveis e a comunidade escolar com dúvidas sobre a vida acadêmica e serviços da secretaria.

Diretrizes e Regras Oficiais do Regimento Comum das ETECs:
1. Frequência Mínima: A frequência mínima para aprovação é de 75% em cada componente curricular. Em caso de atestado médico ou declaração de trabalho, o aluno tem até 5 dias úteis para protocolar a justificativa na secretaria.
2. Passe Escolar: O benefício de gratuidade/meia-tarifa (SPTrans para a capital, EMTU para região metropolitana, ou cartões municipais/BOM/TOP) exige que o aluno solicite a inclusão dos dados no sistema da secretaria no início de cada semestre letivo.
3. Aproveitamento de Estudos / Dispensa de Componentes: Alunos que já cursaram disciplinas equivalentes em outras instituições de ensino técnico ou superior podem solicitar dispensa mediante apresentação de histórico e ementa curricular no prazo do calendário letivo.
4. Trancamento de Matrícula: Permitido a partir do 2º módulo por até 2 semestres letivos, mediante requerimento fundamentado na secretaria.
5. Rematrícula: É obrigatória semestralmente através do NSA (Novo Sistema Acadêmico) ou SIGA para garantir a vaga no próximo módulo.
6. TCC (Trabalho de Conclusão de Curso): Componente obrigatório para certificação técnica, com apresentação pública perante banca avaliadora.
7. Estágio Supervisionado: Não obrigatório para alguns cursos, mas quando realizado deve ter termo de compromisso de estágio (TCE) assinado pela coordenação e direção da ETEC antes do início das atividades.
8. Tom de voz: Cordial, claro, motivador, formal-acessível e institucional (padrão Centro Paula Souza / ETEC).

Responda sempre em português do Brasil de forma concisa e estruturada.
`;

// Fallback intelligent responses if Gemini API Key is missing or rate limited
function getLocalETECResponse(prompt: string): string {
  const query = prompt.toLowerCase();
  
  if (query.includes('passe') || query.includes('sptrans') || query.includes('emtu') || query.includes('transporte') || query.includes('bilhete')) {
    return `🚌 **Solicitação de Passe Escolar (SPTrans / EMTU / TOP):**\n\n1. O estudante deve solicitar a validação de matrícula aqui no portal em **Serviços & Protocolos > Passe Escolar**.\n2. A secretaria da ETEC enviará seus dados para a operadora de transporte em até 3 dias úteis.\n3. Após a liberação, acesse o site da SPTrans (sptrans.com.br) ou EMTU e solicite a revalidação ou emissão do Bilhete Único do Estudante.`;
  }
  
  if (query.includes('falta') || query.includes('atestado') || query.includes('frequência') || query.includes('frequencia') || query.includes('reprova')) {
    return `📋 **Regras de Frequência e Atestados (Regimento ETEC):**\n\n- O aluno deve ter no mínimo **75% de frequência** em cada componente curricular para aprovação.\n- Em caso de ausência por saúde ou serviço, protocole o **Atestado Médico** na aba **Serviços & Protocolos > Justificativa de Faltas** em até **5 dias úteis** após o término do afastamento.\n- O abono legal aplica-se a serviço militar e licença maternidade; atestados médicos justificam a ausência para fins pedagógicos.`;
  }
  
  if (query.includes('declaração') || query.includes('declaracao') || query.includes('matricula') || query.includes('documento')) {
    return `📄 **Emissão de Declaração de Matrícula:**\n\nVocê pode gerar a **Declaração de Matrícula Digital** instantaneamente clicando no botão **Emitir Declaração** na tela inicial ou na seção de protocolos. O documento possui código verificador criptográfico e autenticidade comprovada perante o Centro Paula Souza.`;
  }
  
  if (query.includes('estágio') || query.includes('estagio') || query.includes('tce') || query.includes('trabalho')) {
    return `💼 **Estágio Supervisionado na ETEC:**\n\n1. Antes de iniciar qualquer estágio, o Termo de Compromisso de Estágio (TCE) e o Plano de Atividades devem ser aprovados pelo Professor Orientador de Estágio da sua unidade.\n2. É vedado iniciar atividades sem assinatura prévia da Direção da ETEC.\n3. Dúvidas específicas de convênio podem ser tratadas retirando uma senha para a **Coordenação de Curso / Estágio**.`;
  }
  
  if (query.includes('trancamento') || query.includes('desistir') || query.includes('transferência') || query.includes('transferencia')) {
    return `⏸️ **Trancamento e Transferência:**\n\n- O trancamento de matrícula é permitido a partir do **2º módulo**, por até 2 semestres letivos consecutivos ou alternados.\n- Solicitações devem ser protocoladas dentro do prazo estipulado no calendário acadêmico da unidade pelo portal em **Requerimentos Acadêmicos**.`;
  }

  return `Olá! Sou o assistente acadêmico da ETEC. Posso tirar dúvidas sobre:
• Emissão de Declaração de Matrícula e Histórico Escolar
• Passe Escolar (SPTrans, EMTU e TOP)
• Justificativa de faltas e entrega de atestados (regra de 75%)
• Aproveitamento de estudos e dispensas
• Trancamento, rematrícula no NSA e estágio supervisionado

Como posso ajudar você hoje?`;
}

// Gemini Chat Endpoint
app.post('/api/gemini/chat', async (req, res) => {
  try {
    const { message, history } = req.body;
    if (!message || typeof message !== 'string') {
      return res.status(400).json({ error: 'Mensagem inválida ou ausente.' });
    }

    if (!aiClient) {
      // Graceful instant fallback with rich ETEC knowledge
      const fallbackReply = getLocalETECResponse(message);
      return res.json({ reply: fallbackReply, source: 'knowledge_base' });
    }

    // Call Gemini 2.5 Flash
    const formattedHistory = Array.isArray(history) 
      ? history.map((item: { sender: string; text: string }) => ({
          role: item.sender === 'user' ? 'user' : 'model',
          parts: [{ text: item.text }]
        }))
      : [];

    const response = await aiClient.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: [
        ...formattedHistory,
        { role: 'user', parts: [{ text: message }] }
      ],
      config: {
        systemInstruction: ETEC_SYSTEM_INSTRUCTION,
        temperature: 0.7,
      }
    });

    const reply = response.text || getLocalETECResponse(message);
    return res.json({ reply, source: 'gemini' });
  } catch (error) {
    console.error('Erro na chamada do Gemini:', error);
    // Fallback if API fails
    const fallbackReply = getLocalETECResponse(req.body?.message || '');
    return res.json({ reply: fallbackReply, source: 'fallback_error' });
  }
});

// Setup Vite middleware in dev or static files in production
async function startServer() {
  const isProduction = process.env.NODE_ENV === 'production';

  if (!isProduction) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Servidor ETEC Atende rodando na porta ${PORT}`);
  });
}

startServer();
