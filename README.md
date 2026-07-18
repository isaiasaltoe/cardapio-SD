# Trabalho Prático - Sistemas Distribuídos - 2026/1

## Sobre o Projeto
Este repositório contém o Trabalho Prático da disciplina de Sistemas Distribuídos da Universidade Federal do Espírito Santo (UFES).

O objetivo deste projeto é aplicar os conceitos teóricos de Tolerância a Falhas, Consenso, Observabilidade e Disponibilidade em sistemas computacionais. O projeto consiste em implantar uma arquitetura de microsserviços em ambiente conteinerizado e validar sua resiliência utilizando a prática de Chaos Engineering através da ferramenta **Chaos Mesh**.

## Arquitetura da Aplicação Alvo
A nossa aplicação base é um **Cardápio Digital** composto por 3 microsserviços:
- **API (Microsserviço de Negócio):** Desenvolvido em Ruby on Rails.
- **Banco de Dados:** PostgreSQL (com armazenamento persistente em disco via K8s).
- **Frontend:** Desenvolvido em React (Vite).

---

## Como Clonar o Projeto
Para obter uma cópia local deste repositório, execute os comandos no terminal:
```bash
git clone https://github.com/isaiasaltoe/trabalho-SD.git
cd trabalho-SD
```
> **Nota:** Certifique-se de estar na branch `phase2-protected-complete` para visualizar as configurações finais de tolerância a falhas.

---

## 🛠️ Opção 1: Rodando o Sistema Localmente (Docker Compose)
*Recomendado apenas para desenvolvimento rápido ou testes da interface.*

**1. Iniciando o Backend**
Navegue até a pasta do backend e suba a API e o Banco:
```bash
cd backend
docker-compose up --build -d
docker-compose exec api bin/rails db:create db:migrate
```

**2. Criando o Administrador**
Ainda na pasta do backend, abra o console do Rails:
```bash
docker-compose exec api bin/rails c
# Dentro do console, cole o comando abaixo e tecle Enter:
Admin.create!(email: "admin@example.com", password: "password123")
```
*Digite `exit` para sair do console. A API estará rodando em http://localhost:3000.*

**3. Iniciando o Frontend**
Em um novo terminal, abra a pasta do frontend e inicie o React:
```bash
cd frontend
npm install
npm run dev
```
*O site estará disponível em http://localhost:5173.*

---

##  Opção 2: Rodando para a Avaliação (Kubernetes + Chaos Mesh)
*Obrigatório para a execução dos testes de tolerância a falhas do trabalho prático.*

Para que o Chaos Mesh funcione e consiga atacar a aplicação, o projeto precisa rodar orquestrado pelo **Minikube** na sua máquina local. 

### Passo 1: Construindo as Imagens no Minikube
Abra o seu terminal Linux e rode os comandos abaixo para fazer o *build* das imagens utilizando o Docker embutido no Minikube:
```bash
minikube start
eval $(minikube docker-env)

# Build das imagens locais
docker build -t backend:latest ./backend
docker build -t frontend:latest ./frontend
```

### Passo 2: Subindo o Sistema Protegido e Criando Admin
```bash
# Aplica todas as regras do cluster, ingressos e auto-scaling
kubectl apply -f k8s/

# Aguarde os pods entrarem em status Running (kubectl get pods -n cardapio). Depois crie o Admin:
kubectl exec -it deployment/api -n cardapio -- bin/rails c
# No console, crie a conta:
Admin.create!(email: "admin@example.com", password: "password123")
# Digite exit para sair.
```

### Passo 3: Abrindo as Portas de Acesso (Port-Forward)
Para acessar as ferramentas pelo seu navegador, abra **3 terminais separados** e execute um comando em cada:

**Terminal 1 (Acesso à API):**
```bash
kubectl port-forward svc/api 3000:80 -n cardapio
```
**Terminal 2 (Acesso ao Site React):**
```bash
kubectl port-forward svc/frontend 5173:80 -n cardapio
```
**Terminal 3 (Painel do Chaos Mesh):**
```bash
kubectl port-forward svc/chaos-dashboard 2333:2333 -n chaos-mesh
```

> **Para acessar o site da aplicação:** Entre em `http://localhost:5173` e faça o login com `admin@example.com` e `password123`.
> **Para acessar o painel visual do Caos:** Entre em `http://localhost:2333`. *(Se for solicitado um Token, abra um terminal e rode `kubectl create token account-cluster-manager-dashboard -n chaos-mesh` para gerá-lo).*

---

##  Experimentos de Caos (Demonstração Prática)

Com o cluster rodando (Opção 2), você pode testar a resiliência do sistema aplicando os seguintes ataques. A nossa arquitetura foi projetada com **Timeouts, Retries, Limites de Recursos, HPA (Auto-Scaling) e Fallback de Cache** para suportar todos os 3 testes abaixo sem deixar o usuário offline.

**1. Falha de Rede (NetworkChaos)**
* Injeta um atraso de 3 segundos no tráfego da API.
* **Comando:** `kubectl apply -f chaos/network-chaos.yaml`
* **Defesa Observada:** O frontend ativa um Timeout, cancela a requisição, exibe os produtos salvos no Cache Local e mostra um Banner Laranja alertando o usuário. O Kubernetes bloqueia o pod através da *Readiness Probe*.

**2. Falha de Instância (PodChaos)**
* Exclui (mata) aleatoriamente os pods da API simulando queda física.
* **Comando:** `kubectl apply -f chaos/pod-chaos.yaml`
* **Defesa Observada:** Como configuramos 3 réplicas (Redundância), o tráfego é instantaneamente redirecionado aos pods saudáveis. O *Self-Healing* do Kubernetes identifica a falta do pod morto e recria um novo automaticamente. Zero indisponibilidade.

**3. Falha de Recurso (StressChaos)**
* Injeta um consumo forçado de 100% de CPU na API.
* **Comando:** `kubectl apply -f chaos/stress-chaos.yaml`
* **Defesa Observada:** O limite de recursos (`resources: limits`) estrangula a CPU, impedindo que o banco de dados seja afetado. O `HorizontalPodAutoscaler` detecta que o limite estourou e escala automaticamente o sistema de 3 para 5 réplicas para absorver o impacto.

*(Para limpar qualquer ataque, troque a palavra `apply` por `delete` nos comandos acima).*
