# Deploy — Learn Code

Arquitectura: **3 frontends no Vercel** (site, portal, admin) + **API e MySQL no Railway**.

```
site/    → learncode.vercel.app            (público)
portal/  → clientes-learncode.vercel.app   (área do cliente)
admin/   → gestao-learncode.vercel.app     (painel interno)
backend/ → learncode-api.up.railway.app    (FastAPI + MySQL)
```

## 1. Backend no Railway (já configurado)

1. Serviço a partir do repo `Issuf0/LearnCode` com **Root Directory = `backend`** + serviço **MySQL** no mesmo projecto.
2. Variables do serviço LearnCode:

   | Variável | Valor |
   |---|---|
   | `DATABASE_URL` | `${{ MySQL.MYSQL_URL }}` |
   | `SECRET_KEY` | `python -c "import secrets; print(secrets.token_hex(32))"` |
   | `ACCESS_TOKEN_EXPIRE_MINUTES` | `1440` |
   | `ADMIN_NAME` | `Issufo Karimo` |
   | `ADMIN_EMAIL` | `learncode.mz@gmail.com` |
   | `ADMIN_PASSWORD` | senha forte de produção |
   | `CORS_ORIGINS` | **os 3 domínios Vercel, separados por vírgula, sem barra final** — ex.: `https://learncode.vercel.app,https://clientes-learncode.vercel.app,https://gestao-learncode.vercel.app` |

3. No arranque a API cria tabelas e admin automaticamente (idempotente). Testar: `https://<dominio-railway>/docs`.

## 2. Três projectos no Vercel (mesmo repositório)

Para **cada** app, em vercel.com → Add New → Project → importar `Issuf0/LearnCode`:

| Projecto | Root Directory | Environment Variables |
|---|---|---|
| `learncode-site` | `site` | `VITE_PORTAL_URL` = URL do projecto portal |
| `learncode-portal` | `portal` | `VITE_API_URL` = `https://<railway>/api` · `VITE_SITE_URL` = URL do site · `VITE_ADMIN_URL` = URL do admin |
| `learncode-admin` | `admin` | `VITE_API_URL` = `https://<railway>/api` · `VITE_SITE_URL` = URL do site · `VITE_PORTAL_URL` = URL do portal |

- O preset **Vite** é detectado automaticamente; cada pasta tem o seu `vercel.json` (fallback SPA).
- Como os URLs se referenciam em círculo, faz assim: **deploy dos 3 primeiro** (com variáveis vazias se necessário), anota os 3 domínios, depois preenche as variáveis e faz **Redeploy** de cada um (variáveis Vite entram no build).

## 3. Fecho

1. Actualiza `CORS_ORIGINS` no Railway com os 3 domínios definitivos → o serviço reinicia sozinho.
2. Checklist:
   - [ ] Site abre e o botão "Área do Cliente"/portal leva ao domínio do portal
   - [ ] Portal: login de cliente funciona; admin a entrar no portal é encaminhado para o painel
   - [ ] Admin: login do administrador funciona; fluxo contrato → assinatura → PDF
   - [ ] Sem erros de CORS na consola (F12)

## 4. Domínios próprios (futuro)

Sugestão com `learncode.co.mz`: site em `learncode.co.mz`, portal em `clientes.learncode.co.mz`, admin em `gestao.learncode.co.mz` — adicionar cada um no projecto Vercel respectivo e actualizar `CORS_ORIGINS` + variáveis `VITE_*_URL`.

## Notas

- Desenvolvimento local: API na porta 8001, site 3000, portal 3001, admin 3002 (`.env.example` em cada pasta).
- A colecção Bruno (`backend/bruno/`) funciona contra produção mudando o `baseUrl` do ambiente.
- Backups do MySQL: plano pago do Railway ou `mysqldump` agendado.
