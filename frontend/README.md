# Frontend - Cardapio Admin (React)

Frontend do Trabalho de Sistemas Distribuidos. Feito em **React + Vite**, consome
a API Rails do backend (login JWT + CRUD de categorias e itens). E o **3o componente**
da arquitetura distribuida (Frontend + API + Banco), containerizado para rodar no
Kubernetes junto com os demais.

> **FASE 1 - Versao VULNERAVEL (sem protecoes de resiliencia).**
> Codigo proposital e deliberadamente "cru" para os testes de Chaos Engineering.
> Na Fase 2 serao adicionadas as protecoes (ver `../../guia_de_protecoes.md`).

## Tecnologias
- React 18 + Vite 5
- React Router 6 (rotas / rota protegida)
- Axios (cliente HTTP)
- Docker (build multi-stage) + nginx (serve o estatico)

## Fluxo da aplicacao
1. Tela de login (`/login`) - cadastra ou entra como admin. O token JWT vem no
   header `Authorization` da resposta e e salvo no `localStorage`.
2. Dashboard (`/`) - rota protegida. CRUD de **Categorias** e **Itens** do cardapio.

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
> Fase 1 (vulneravel): sem readiness/liveness probes e sem limites de recurso,
> igual ao `api-deployment.yaml` atual.

## O que NAO tem nesta fase (proposital - para os testes de caos)
Protecoes de resiliencia que entram na Fase 2 (pontos marcados no codigo com
comentarios `FASE 1 (vulneravel)`):
- [ ] Timeout nas requisicoes (Axios)
- [ ] Retry automatico quando a API falhar
- [ ] Fallback com cache local (localStorage) quando a API cair
- [ ] Skeleton screens no carregamento
- [ ] Banner de "conexao lenta"
- [ ] Debounce nos botoes de acao

## Estrutura
```
frontend/
  Dockerfile             # build multi-stage (Vite -> nginx)
  nginx.conf             # fallback SPA para o React Router
  .dockerignore
  src/
    api/client.js          # Axios cru (sem timeout/retry/cache) + injeta o JWT
    auth/AuthContext.jsx   # login / cadastro / logout
    auth/RequireAuth.jsx   # protege rotas
    pages/Login.jsx        # tela de login/cadastro
    pages/Dashboard.jsx    # CRUD de categorias e itens
    styles.css
```
