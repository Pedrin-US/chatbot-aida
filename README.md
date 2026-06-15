# 🤖 AIDA — Assistente Inteligente de Direcionamento Automatizado

AIDA (Assistente Inteligente de Direcionamento Automatizado) é uma plataforma web desenvolvida para auxiliar alunos, professores, responsáveis e administradores em ambientes escolares por meio de Inteligência Artificial.

O sistema tem como objetivo automatizar o direcionamento de informações acadêmicas, facilitar a comunicação entre os usuários e fornecer suporte inteligente para dúvidas, orientações e consultas dentro do ambiente educacional.

---

# 🚀 Tecnologias Utilizadas

## Backend

* Python 3.12+
* Flask
* Google Gemini API
* MySQL

## Frontend

* React
* TypeScript
* Vite
* Material UI (MUI)
* Tailwind CSS
* Context API

## Banco de Dados

* MySQL

---

# 📁 Estrutura do Projeto

```text
ChatBotAIDA
│
├── backend
│   ├── app
│   │   ├── models
│   │   │   ├── __init__.py
│   │   │   └── models.py
│   │   │
│   │   ├── routes
│   │   │   ├── auth.py
│   │   │   ├── admin.py
│   │   │   ├── chat.py
│   │   │   ├── student.py
│   │   │   ├── users.py
│   │   │   └── __init__.py
│   │   │
│   │   ├── services
│   │   │   ├── ai_service.py
│   │   │   ├── permissions.py
│   │   │   └── __init__.py
│   │   │
│   │   ├── config.py
│   │   └── __init__.py
│   │
│   ├── create_admin.py
│   ├── requirements.txt
│   ├── run.py
│   └── .env.example
│
├── frontend
│   ├── src
│   │   ├── app
│   │   │   ├── context
│   │   │   │   └── AuthContext.tsx
│   │   │   │
│   │   │   └── pages
│   │   │       ├── Login.tsx
│   │   │       ├── Dashboard.tsx
│   │   │       ├── ChatPage.tsx
│   │   │       ├── AdminPanel.tsx
│   │   │       ├── UsersPage.tsx
│   │   │       ├── StudentHome.tsx
│   │   │       └── ForgotPassword.tsx
│   │   │
│   │   ├── components
│   │   │   └── ProtectedRoute.tsx
│   │   │
│   │   ├── assets
│   │   │   └── aida-logo.png
│   │   │
│   │   ├── styles
│   │   ├── api.ts
│   │   └── main.tsx
│   │
│   ├── index.html
│   ├── package.json
│   ├── package-lock.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── .env.example
│
├── database
│   └── schema.sql
│
├── README.md
├── package.json
├── package-lock.json
└── .gitignore
```

---

# 🎯 Objetivos do Projeto

A AIDA foi criada para modernizar o atendimento acadêmico dentro das instituições de ensino, oferecendo:

* Atendimento automatizado através de Inteligência Artificial
* Centralização de informações escolares
* Suporte para alunos, professores e responsáveis
* Comunicação rápida e eficiente
* Redução da carga de atendimentos repetitivos
* Acesso simplificado às informações acadêmicas

---

# 👥 Perfis de Usuário

O sistema possui diferentes níveis de acesso.

## 👨‍🎓 Aluno

* Utilização do chatbot
* Visualização de avisos
* Acesso às funcionalidades acadêmicas

## 👨‍🏫 Professor

* Utilização do chatbot
* Gerenciamento de informações acadêmicas
* Publicação de avisos

## 👤 Usuário

* Acesso básico ao sistema
* Utilização da IA

## 👑 Administrador

* Controle total da plataforma
* Gerenciamento de usuários
* Alteração de cargos e permissões
* Monitoramento do sistema

---

# 🤖 Inteligência Artificial

A plataforma utiliza a API do Google Gemini para fornecer respostas inteligentes e contextualizadas.

Principais recursos:

* Atendimento automatizado
* Respostas contextualizadas
* Histórico de conversa
* Suporte educacional
* Direcionamento de informações acadêmicas

---

# 🔐 Segurança

O sistema implementa:

* Autenticação JWT
* Rotas protegidas
* Controle de permissões
* Senhas criptografadas
* Proteção de credenciais através de variáveis de ambiente
* Separação entre frontend e backend

---

# ⚙️ Instalação

## 1. Clonar o Repositório

```bash
git clone https://github.com/Pedrin-US/chatbot-aida.git

cd chatbot-aida
```

---

## 2. Configurar o Banco de Dados

Criar o banco:

```sql
CREATE DATABASE chatbot_aida;
```

Importar o schema:

```bash
mysql -u root -p chatbot_aida < database/schema.sql
```

---

## 3. Configurar o Backend

Acessar a pasta:

```bash
cd backend
```

Criar ambiente virtual:

```bash
python -m venv venv
```

### Windows

```bash
venv\Scripts\activate
```

### Linux / MacOS

```bash
source venv/bin/activate
```

Instalar dependências:

```bash
pip install -r requirements.txt
```

Criar arquivo de ambiente:

```bash
copy .env.example .env
```

Configurar:

```env
DATABASE_URL=mysql+pymysql://root:SUA_SENHA@localhost:3306/chatbot_aida

JWT_SECRET_KEY=sua_chave_jwt

AI_PROVIDER=gemini

AI_API_KEY=sua_chave_gemini

AI_MODEL=gemini-1.5-flash

FRONTEND_URL=http://localhost:5173
```

Executar:

```bash
python run.py
```

Backend disponível em:

```text
http://localhost:5000
```

---

## 4. Configurar o Frontend

Acessar:

```bash
cd frontend
```

Instalar dependências:

```bash
npm install
```

Criar arquivo:

```bash
copy .env.example .env
```

Configurar:

```env
VITE_API_URL=http://localhost:5000/api
```

Executar:

```bash
npm run dev
```

Frontend disponível em:

```text
http://localhost:5173
```

---

# 🔌 Principais Rotas da API

## Autenticação

```http
POST /api/auth/register
POST /api/auth/login
GET  /api/auth/me
```

## Chat

```http
GET    /api/chat/conversations
POST   /api/chat/conversations
DELETE /api/chat/conversations/<id>

GET    /api/chat/conversations/<id>/messages
POST   /api/chat/conversations/<id>/messages
```

## Administração

```http
GET /api/admin/users
PUT /api/admin/users/<id>
```

## Usuários

```http
GET /api/users
PUT /api/users/<id>
```

## Alunos

```http
GET /api/student/avisos
```

---

# 📌 Funcionalidades Implementadas

✅ Sistema de autenticação

✅ Login e cadastro de usuários

✅ Controle de acesso por perfil

✅ Integração com Google Gemini

✅ Chat inteligente

✅ Histórico de conversas

✅ Painel administrativo

✅ Gerenciamento de usuários

✅ Área exclusiva para alunos

✅ Proteção de rotas

✅ Estrutura preparada para recuperação de senha

---

# 🔮 Melhorias Futuras

* Recuperação de senha por e-mail
* Upload de arquivos
* Integração com calendário acadêmico
* Sistema de notas e frequência
* Dashboard com métricas avançadas
* Notificações em tempo real
* Testes automatizados
* Deploy em produção

---

# 📄 Licença

Este projeto é destinado para fins educacionais e acadêmicos.
