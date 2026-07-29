# Deploy — Learn Code

Frontend no **Vercel** · Backend + MySQL no **Railway**.

## 1. Backend no Railway

1. Em [railway.app](https://railway.app) → **New Project** → **Deploy from GitHub repo** → escolhe `Issuf0/LearnCode`.
2. No serviço criado → **Settings → Root Directory** = `backend` (essencial: o repositório é um monorepo).
   O Railway detecta Python pelo `requirements.txt` e usa o `Procfile` (`uvicorn app.main:app --host 0.0.0.0 --port $PORT`).
3. **+ New → Database → MySQL** no mesmo projecto.
4. No serviço do backend → **Variables**:

   | Variável | Valor |
   |---|---|
   | `DATABASE_URL` | `${{ MySQL.MYSQL_URL }}` (referência à base de dados; o formato `mysql://` é convertido automaticamente pelo código) |
   | `SECRET_KEY` | gerar: `python -c "import secrets; print(secrets.token_hex(32))"` |
   | `ACCESS_TOKEN_EXPIRE_MINUTES` | `1440` |
   | `ADMIN_NAME` | `Issufo Karimo` |
   | `ADMIN_EMAIL` | `learncode.mz@gmail.com` |
   | `ADMIN_PASSWORD` | senha forte (⚠️ não usar a de desenvolvimento) |
   | `CORS_ORIGINS` | `https://<o-teu-dominio>.vercel.app` (vem do passo 2; separar múltiplos por vírgula) |

5. **Deploy**. No arranque, a aplicação cria as tabelas e a conta de administrador automaticamente (idempotente — seguro em cada restart).
6. Em **Settings → Networking → Generate Domain** obténs o URL público, ex.: `https://learncode-api.up.railway.app`. Testa: abrir `/docs`.

## 2. Frontend no Vercel

1. Em [vercel.com](https://vercel.com) → **Add New → Project** → importa `Issuf0/LearnCode`.
2. O Vercel detecta Vite automaticamente (build `npm run build`, output `dist`). O `vercel.json` já trata do fallback de SPA (as rotas `/portal/...`, `/admin/...` funcionam em refresh directo).
3. **Environment Variables**:

   | Variável | Valor |
   |---|---|
   | `VITE_API_URL` | `https://<dominio-do-railway>.up.railway.app/api` |

4. **Deploy**. Guarda o domínio gerado (ex.: `https://learncode.vercel.app`).
5. Volta ao Railway e confirma que `CORS_ORIGINS` contém exactamente esse domínio (sem barra final). Redeploy do backend se o alterares.

## 3. Verificação pós-deploy

- [ ] `https://<railway>/` responde `{"status": "ok"}` e `/docs` abre
- [ ] Site público abre no domínio Vercel; refresh em `/servicos` não dá 404
- [ ] Login do admin funciona (sem erros de CORS na consola do browser)
- [ ] Criar um cliente de teste, orçamento e contrato; assinar e descarregar o PDF (fontes incluídas no repo — funciona no container)
- [ ] Trocar a senha do admin se ainda não for definitiva

## 4. Domínio próprio (quando tiveres learncode.co.mz)

- Vercel → Project → **Domains** → adicionar `learncode.co.mz` e seguir as instruções de DNS.
- Actualizar `CORS_ORIGINS` no Railway para incluir o novo domínio.

## Notas

- O MySQL local de desenvolvimento não é afectado — o `.env` local continua a apontar para `localhost`.
- Custos: Railway tem plano gratuito limitado (o backend "adormece"/consome créditos); para produção real considerar o plano Hobby. Vercel é gratuito para este volume.
- Backups: no Railway, o MySQL tem backups no plano pago; em alternativa, agendar `mysqldump` periódico.
