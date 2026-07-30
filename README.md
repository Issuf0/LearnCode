# Learn Code — Plataforma Oficial

Monorepo da plataforma da **Learn Code** (Marracuene, Moçambique): site público, portal do cliente, painel administrativo e API.

## Estrutura

| Pasta | Aplicação | Stack | Deploy |
|---|---|---|---|
| [`site/`](site/) | Site público (aquisição de clientes) | React + Vite | Vercel |
| [`portal/`](portal/) | Portal do Cliente (projectos, contratos, faturas, reuniões) | React + Vite | Vercel |
| [`admin/`](admin/) | Painel Administrativo (gestão completa) | React + Vite | Vercel |
| [`backend/`](backend/) | Learn Code API (autenticação, dados, PDFs de contratos) | FastAPI + MySQL | Railway |

## Desenvolvimento local

```bash
# API (porta 8001) — ver backend/README.md para o setup completo
cd backend && .venv/bin/uvicorn app.main:app --reload --port 8001

# Site (3000) · Portal (3001) · Admin (3002)
cd site   && npm install && npm run dev
cd portal && npm install && npm run dev
cd admin  && npm install && npm run dev
```

Cada app tem um `.env.example` com as variáveis necessárias (`VITE_API_URL`, URLs cruzados entre apps).

## Deploy

Ver [DEPLOY.md](DEPLOY.md) — 3 projectos Vercel (um por app, com Root Directory próprio) + backend e MySQL no Railway.

## Testes da API

Colecção Bruno completa em [`backend/bruno/`](backend/bruno/) — 40 endpoints com payloads prontos e gestão automática de tokens.

---

*“Dignidade, compromisso e humildade em cada linha.”*
