# Frontend - Cardapio Admin (React)

Frontend do Trabalho de Sistemas Distribuidos. Feito em **React + Vite**, consome
a API Rails do backend (login JWT + CRUD de categorias e itens). E o **3o componente**
da arquitetura distribuida (Frontend + API + Banco), containerizado para rodar no
Kubernetes junto com os demais.

> **FASE 2 - Versao PROTEGIDA (com protecoes de resiliencia).**
> As protecoes de frontend do `../../guia_de_protecoes.md` estao implementadas para
> o sistema sobreviver/degradar elegantemente durante os 3 testes de Chaos Mesh.

## Tecnologias
- React 18 + Vite 5
- React Router 6 (rotas / rota protegida)
- Axios (cliente HTTP com timeout + retry)
- Docker (build multi-stage) + nginx (serve o estatico)

## Fluxo da aplicacao
1. Tela de login (`/login`) - login de admin. O token JWT vem no header
   `Authorization` da resposta e e salvo no `localStorage`.
2. Dashboard (`/`) - rota protegida. CRUD de **Categorias** e **Itens** do cardapio.

---

## Protecoes de resiliencia (Fase 2) - escopo do Frontend

| Protecao | Onde | Cobre o teste |
|----------|------|---------------|
| **Timeout de 3s** nas requisicoes | `src/api/client.js` | Atraso de rede |
| **Skeleton screens** no carregamento | `src/components/Skeleton.jsx` | Atraso de rede |
| **Banner de "conexao lenta"** (apos 2s) | `src/components/ConnectionBanner.jsx` | Atraso de rede |
| **Retry automatico** (GET, 3x com 2s) | `src/api/client.js` | Pod Kill |
| **Cache local** (localStorage) de fallback | `src/lib/cache.js` | Pod Kill |
| **Fallback visual** amigavel | `src/components/ErrorFallback.jsx` | Pod Kill |
| **Debounce** nos botoes de acao | `src/lib/useDebouncedAction.js` | Sobrecarga |
| **Lazy loading** (import dinamico do Dashboard) | `src/App.jsx` | Sobrecarga |

Comportamento sob falha da API:
1. GET falha -> Axios re-tenta 3x (banner "Tentando novamente...").
2. Esgotou -> se ha copia no cache, mostra os dados salvos + aviso
   "dados da ultima atualizacao" (banner verde).
3. Sem cache -> tela amigavel "Estamos voltando em instantes" com botao de retry.
4. API volta -> banners somem e os dados frescos carregam.

> **Nota sobre "Fila de requisicoes" (guia):** a sugestao de agrupar varias acoes
> em uma unica requisicao (buffer de 500ms) nao se aplica a este painel de CRUD -
> cada acao cria um recurso distinto, nao ha o cenario de "10 acoes rapidas iguais".
> O anti-spam necessario aqui e coberto pelo **debounce** nos botoes.

---

## Como rodar

### A) Desenvolvimento (hot reload) - para codar/testar rapido
Requer Node 18+ e o **backend rodando** em `http://localhost:3000`.
```bash
npm install
npm run dev            # http://localhost:5173
```
A URL da API pode ser ajustada via `.env` (copie de `.env.example`):
```
VITE_API_URL=http://localhost:3000
```

### B) Imagem Docker (entrega / Kubernetes) - o que vai pro cluster
Gera a imagem de producao (build estatico servido por nginx na porta 80):
```bash
docker build -t frontend:latest .
```
A URL da API e embutida no build. Para apontar para outro endereco:
```bash
docker build -t frontend:latest --build-arg VITE_API_URL=http://SEU_HOST:3000 .
```
Rodar so o container (fora do k8s), publicando na 8080:
```bash
docker run --rm -p 8080:80 frontend:latest    # http://localhost:8080
```

---

## Integracao com o Kubernetes (handoff p/ Infra)
Esta imagem (`frontend:latest`) e o artefato que o cluster consome. Para o frontend
entrar como componente no k8s, a Infra precisa: buildar a imagem no ambiente do
Minikube (`eval $(minikube docker-env)` antes do `docker build`) e criar um
`k8s/frontend-deployment.yaml` + `k8s/frontend-service.yaml` (mesmo padrao do
`api-deployment.yaml`: namespace `cardapio`, `imagePullPolicy: Never`).

## Estrutura
```
frontend/
  Dockerfile             # build multi-stage (Vite -> nginx)
  nginx.conf             # fallback SPA para o React Router
  .dockerignore
  src/
    api/client.js              # Axios: timeout + retry + status de conexao
    lib/
      connectionStatus.js      # pub/sub do status de conexao
      useConnStatus.js         # hook do status
      cache.js                 # cache local (localStorage) de fallback
      useDebouncedAction.js    # debounce/anti-duplo-clique
    components/
      ConnectionBanner.jsx     # banner de lentidao/retry/offline
      Skeleton.jsx             # skeleton screens
      ErrorFallback.jsx        # tela de erro amigavel
    auth/AuthContext.jsx       # login / logout
    auth/RequireAuth.jsx       # protege rotas
    pages/Login.jsx            # tela de login
    pages/Dashboard.jsx        # CRUD de categorias e itens
    styles.css
```
