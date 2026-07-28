# Learn Code API

Backend FastAPI + MySQL da plataforma Learn Code.

## Estrutura

```
backend/
├── app/
│   ├── core/          # Configuração, segurança (JWT/bcrypt), dependências
│   ├── models/        # Tabelas SQLAlchemy (a máquina de estados do negócio)
│   ├── schemas/       # Validação Pydantic (entrada/saída da API)
│   ├── routers/       # Endpoints por domínio
│   ├── services/      # Lógica partilhada (notificações)
│   ├── database.py    # Engine e sessão MySQL
│   └── main.py        # Aplicação FastAPI
├── scripts/seed.py    # Cria tabelas + admin inicial
├── requirements.txt
└── .env.example
```

## Arranque rápido

```bash
# 1. Base de dados (uma vez, no MySQL)
mysql -u root -p -e "CREATE DATABASE learncode CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"

# 2. Ambiente Python
cd backend
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt

# 3. Configuração
cp .env.example .env   # editar DATABASE_URL, SECRET_KEY e credenciais do admin

# 4. Tabelas + conta de administrador
python -m scripts.seed

# 5. Servidor de desenvolvimento
uvicorn app.main:app --reload --port 8000
```

Documentação interactiva: http://localhost:8000/docs

## Fluxo do negócio (máquina de estados)

```
Admin cria cliente (portal por convite)
  → Admin cria orçamento          → cliente Aprova/Recusa
  → Admin cria contrato → envia   → cliente Assina (hash + IP + timestamp)
  → Admin emite factura           → cliente paga e Submete comprovativo
  → Admin Confirma pagamento      → factura Paga
  → Admin agenda reuniões (link Google Meet)
Cada transição notifica a outra parte (tabela notifications).
```

## Papéis

- **admin** — gestão completa; criado pelo `scripts/seed.py` com as credenciais do `.env`.
- **client** — criado pelo admin em `POST /api/clients` com senha temporária; vê apenas os seus dados; troca a senha em `POST /api/auth/change-password`.

## Autenticação

`POST /api/auth/login` com `{"email", "password"}` → `access_token` (JWT).
Enviar em todos os pedidos: `Authorization: Bearer <token>`.

## Próximos passos planeados

- Migrações com Alembic (antes da primeira alteração de esquema em produção)
- Geração de PDFs (contratos, faturas, recibos) com WeasyPrint
- Notificações externas: WhatsApp Cloud API / SMTP no `services/notifications.py`
- Upload real de comprovativos e documentos (Cloudinary/S3)
