# ChatBot AIDA — Documentação do Projeto

**AIDA** (Assistente Inteligente Digital Acadêmica) é um chatbot educacional para unidades escolares,
com frontend em React/TypeScript e backend em Python/Flask integrado ao MySQL e à IA da Anthropic (Claude).

---

## 📁 Estrutura do Projeto

```
ChatBotAIDA/
├── backend/                       ← API Flask (Python)
│   ├── app/
│   │   ├── __init__.py            ← Factory da aplicação Flask
│   │   ├── config.py              ← Configurações (DB, JWT, IA)
│   │   ├── models/
│   │   │   └── models.py          ← User, Conversation, Message (SQLAlchemy)
│   │   ├── routes/
│   │   │   ├── auth.py            ← POST /api/auth/login, /register, GET /me
│   │   │   ├── chat.py            ← CRUD conversas + envio de mensagens
│   │   │   └── users.py           ← Perfil e senha do usuário
│   │   └── services/
│   │       └── ai_service.py      ← Integração com Claude (Anthropic)
│   ├── run.py                     ← Ponto de entrada Flask
│   ├── requirements.txt
│   └── .env.example               ← Variáveis de ambiente necessárias
│
├── frontend/                      ← App React + Vite + MUI
│   └── src/
│       ├── api.ts                 ← Camada única de acesso à API REST
│       └── app/
│           ├── context/
│           │   └── AuthContext.tsx ← Autenticação real com JWT
│           └── pages/
│               ├── Login.tsx      ← Login + cadastro
│               └── ChatPage.tsx   ← Chat integrado com backend
│
└── database/
    └── schema.sql                 ← DDL MySQL (tabelas users, conversations, messages)
```

---

## ⚙️ Configuração

### 1. Banco de Dados (MySQL)

```bash
# Criar o banco
mysql -u root -p < database/schema.sql
```

### 2. Backend (Flask)

```bash
cd backend

# Crie e ative o ambiente virtual
python -m venv venv
source venv/bin/activate      # Linux/Mac
# venv\Scripts\activate       # Windows

# Instale dependências
pip install -r requirements.txt

# Configure variáveis de ambiente
cp .env.example .env
# Edite .env com suas credenciais MySQL e chave da IA

# Inicie o servidor
python run.py
# → http://localhost:5000
```

### 3. Frontend (React)

```bash
cd frontend

# Instale dependências (o projeto já tem package.json)
npm install

# Configure variável de ambiente
cp .env.example .env
# .env: VITE_API_URL=http://localhost:5000/api

# Inicie em desenvolvimento
npm run dev
# → http://localhost:5173
```

---

## 🔌 API REST — Endpoints

### Autenticação
| Método | Rota | Descrição |
|--------|------|-----------|
| POST | `/api/auth/register` | Cadastra usuário |
| POST | `/api/auth/login` | Login, retorna JWT |
| GET | `/api/auth/me` | Dados do usuário autenticado |

### Chat
| Método | Rota | Descrição |
|--------|------|-----------|
| GET | `/api/chat/conversations` | Lista conversas do usuário |
| POST | `/api/chat/conversations` | Cria nova conversa |
| DELETE | `/api/chat/conversations/:id` | Remove conversa |
| GET | `/api/chat/conversations/:id/messages` | Lista mensagens |
| POST | `/api/chat/conversations/:id/messages` | Envia mensagem → IA responde |

### Usuários
| Método | Rota | Descrição |
|--------|------|-----------|
| PUT | `/api/users/profile` | Atualiza nome/avatar |
| PUT | `/api/users/change-password` | Troca senha |

Todos os endpoints de chat e usuários requerem header:
```
Authorization: Bearer <jwt_token>
```

---

## 🚀 Melhorias Realizadas

### Estrutura
- **Separação backend/frontend** — projeto dividido em dois contextos independentes
- **Arquitetura em camadas** no backend: routes → services → models
- **`api.ts`** no frontend: camada centralizada de acesso ao backend, nenhuma chamada HTTP fora dela

### Backend (criado do zero)
- **Flask com Blueprints** para organização modular das rotas
- **SQLAlchemy ORM** — modelos `User`, `Conversation`, `Message` com relacionamentos e cascade delete
- **JWT** (flask-jwt-extended) para autenticação stateless
- **CORS** configurado por variável de ambiente
- **Integração com Claude (Anthropic)** em `ai_service.py`, com fallback para desenvolvimento sem chave
- **Prompt do sistema** personalizado para contexto escolar
- **Histórico de conversa** enviado à IA a cada mensagem (contexto persistente)
- Hash de senha com `werkzeug.security` (PBKDF2-SHA256)

### Frontend
- **`AuthContext`** agora autentica via API real + restaura sessão com JWT do localStorage
- **`Login.tsx`** ganhou aba de **cadastro** sem precisar de página nova
- **`ChatPage.tsx`** completamente refatorado:
  - CRUD real de conversas (criar, listar, deletar)
  - Mensagens persistidas no banco
  - **Mensagem otimista** do usuário aparece instantaneamente
  - **Indicador de digitação** animado enquanto a IA responde
  - Scroll automático para última mensagem
  - Tratamento de erros com rollback da mensagem otimista

### Banco de Dados
- **Schema SQL documentado** com índices nas colunas mais consultadas
- Tabelas com `CASCADE DELETE`: apagar conversa remove as mensagens automaticamente
- Suporte a `utf8mb4` para emojis e caracteres especiais

---

## 🔑 Variáveis de Ambiente

### backend/.env
```env
DATABASE_URL=mysql+pymysql://root:senha@localhost:3306/chatbot_aida
JWT_SECRET_KEY=<string-aleatoria-segura>
AI_API_KEY=sk-ant-...          # Chave Anthropic
AI_MODEL=claude-sonnet-4-20250514
FRONTEND_URL=http://localhost:5173
```

### frontend/.env
```env
VITE_API_URL=http://localhost:5000/api
```

---

## 🛣️ Próximos Passos Sugeridos

- [ ] Painel de administração para gestão de usuários
- [ ] Upload real de arquivos (PDF, imagens) no chat
- [ ] Integração com banco de dados acadêmico (notas, faltas, horários)
- [ ] Notificações em tempo real (WebSocket / Server-Sent Events)
- [ ] Testes automatizados (pytest para backend, Vitest para frontend)
- [ ] Deploy com Docker Compose
