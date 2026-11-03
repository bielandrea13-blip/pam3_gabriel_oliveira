# 🎓 ETEC Atende - Sistema de Atendimento ao Aluno & Secretaria Digital

Sistema completo de atendimento acadêmico e secretaria escolar digital desenvolvido para as **Escolas Técnicas Estaduais (ETEC)** do **Centro Estadual de Educação Tecnológica Paula Souza (Governo do Estado de São Paulo)**.

---

## 🏛️ Sobre o Projeto

O **ETEC Atende** foi construído como parte da atividade prática de **Vibe Coding** utilizando o **Google AI Studio**, aplicando tecnologias modernas de desenvolvimento full-stack para resolver desafios do cotidiano escolar de estudantes, professores e funcionários da secretaria acadêmica.

### Principais Funcionalidades:
1. **Requerimentos & Serviços Acadêmicos Digitais:**
   - Emissão instantânea de **Declaração de Matrícula** com carimbo eletrônico, código criptográfico e QR Code de autenticidade jurídica.
   - Envio de cadastro e validação de **Passe Escolar** (SPTrans / EMTU / Cartão TOP / BOM).
   - Protocolo e justificativa de faltas com upload de **Atestado Médico** ou declaração de trabalho (regra regimental dos 5 dias úteis).
   - Requerimento de **Aproveitamento de Estudos** (dispensa de disciplinas).
   - Solicitação de Histórico Parcial e 2ª chamada de provas.

2. **Fila Virtual & Totem de Senhas Presenciais:**
   - Retirada de senhas por categoria: *[G] Geral*, *[P] Passe Escolar*, *[D] Retirada de Documentos*, *[C] Coordenação de Curso e Estágios*.
   - Painel eletrônico com aviso sonoro (sintetizador Web Audio API estilo chamada de guichê escolar).
   - Acompanhamento da posição do aluno na fila em tempo real.

3. **Assistente Virtual Acadêmico ETEC com Inteligência Artificial:**
   - Integrado com **Google Gemini AI (`@google/genai`)**.
   - Treinado com as diretrizes do **Regimento Comum das ETECs** (frequência mínima de 75%, regras de estágio e TCE, TCC, vestibulinho e rematrícula via NSA).

4. **Validador Oficial de Documentos:**
   - Ferramenta para verificação de autenticidade de declarações escolares emitidas pelo sistema com base no código verificador do NSA/SIGA.

5. **Carteirinha Digital do Estudante (DNE ETEC):**
   - Carteirinha estudantil com efeito de giro (frente e verso), foto do aluno, QR code, código de barras e dados da Lei de Meia-Entrada.

6. **Painel de Atendente da Secretaria (Modo Administrador):**
   - Controle de guichê, chamada de senhas, deferimento ou indeferimento de requerimentos com despacho oficial.

---

## 🛠️ Tecnologias Utilizadas

- **Frontend:**
  - [React 19](https://react.dev/)
  - [TypeScript](https://www.typescriptlang.org/)
  - [Vite 8](https://vitejs.dev/)
  - [Tailwind CSS v4](https://tailwindcss.com/)
  - [Lucide React](https://lucide.dev/) (ícones)
  - [Motion](https://motion.dev/)

- **Backend & Inteligência Artificial:**
  - [Express.js](https://expressjs.com/) (Node.js)
  - [Google GenAI SDK (`@google/genai`)](https://www.npmjs.com/package/@google/genai)
  - Modelo: **Gemini 2.5 Flash**

- **Design & Branding:**
  - Identidade visual institucional oficial da **ETEC** e do **Centro Paula Souza**
  - Tipografia: *Plus Jakarta Sans* e *JetBrains Mono*

---

## 🚀 Como Executar o Projeto Localmente

1. **Clone o repositório:**
   ```bash
   git clone https://github.com/SEU-USUARIO/etec-atendimento-aluno.git
   cd etec-atendimento-aluno
   ```

2. **Instale as dependências:**
   ```bash
   npm install
   ```

3. **Configure as variáveis de ambiente:**
   Crie um arquivo `.env` na raiz do projeto (ou copie do `.env.example`):
   ```env
   GEMINI_API_KEY="SUA_CHAVE_GEMINI_AQUI"
   PORT=3000
   ```

4. **Inicie o servidor de desenvolvimento:**
   ```bash
   npm run dev
   ```

5. **Acesse no navegador:**
   [http://localhost:3000](http://localhost:3000)

---

## 📦 Como Subir para o GitHub (Entrega da Atividade)

Execute os comandos abaixo no seu terminal para postar o projeto no seu GitHub:

```bash
git init
git add .
git commit -m "feat: Sistema de Atendimento ao Aluno ETEC com IA e Secretaria Digital"
git branch -M main
git remote add origin https://github.com/SEU-USUARIO/etec-atendimento-aluno.git
git push -u origin main
```

---

## 📜 Licença e Atribuições

Projeto desenvolvido para fins educacionais e acadêmicos.
Marca, símbolos e identidade pertencem ao **Centro Estadual de Educação Tecnológica Paula Souza** - Governo do Estado de São Paulo.
