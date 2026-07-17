# Trabalho Prático - Sistemas Distribuídos - 2026/1

## Sobre o Projeto

Este repositório contém o Trabalho Prático da disciplina de Sistemas Distribuídos da Universidade Federal do Espírito Santo (UFES).

O objetivo deste projeto é aplicar os conceitos teóricos de Tolerância a Falhas, Consenso, Observabilidade e Disponibilidade em sistemas computacionais. O projeto consiste em implantar uma arquitetura de microsserviços em ambiente conteinerizado e validar sua resiliência utilizando a prática de Chaos Engineering através da ferramenta Chaos Mesh.

## Arquitetura da Aplicação Alvo

Componentes:
- Microsserviço de Negócio (API): Desenvolvido em Ruby on Rails.
- Banco de Dados: PostgreSQL.
- Frontend: Desenvolvido em React.

## Como Clonar e Executar o Projeto

Para obter uma cópia local deste repositório, execute os comandos no terminal:

```bash
git clone https://github.com/isaiasaltoe/trabalho-SD.git
cd trabalho-SD
```

### Rodando o Sistema

Para rodar a aplicação por completo, você precisará iniciar o Backend e o Frontend em terminais separados.

#### 1. Iniciando o Backend

A API e o Banco de Dados são inicializados através do Docker Compose. Siga os passos:

1. Navegue até a pasta do backend:
```bash
cd backend
```

2. Suba os containers em segundo plano:
```bash
docker-compose up --build -d
```

3. Na primeira execução, crie o banco de dados e rode as migrações:
```bash
docker-compose exec api bin/rails db:create
docker-compose exec api bin/rails db:migrate
```

Após esses passos, a API estará rodando em `http://localhost:3000`.

#### 2. Iniciando o Frontend

O frontend foi desenvolvido em React utilizando a ferramenta Vite. Siga os passos:

1. Abra um novo terminal e navegue até a pasta do frontend:
```bash
cd frontend
```

2. Instale as dependências:
```bash
npm install
```

3. Inicie o servidor de desenvolvimento:
```bash
npm run dev
```

O frontend estará acessível no endereço exibido no terminal (geralmente `http://localhost:5173`).

### Criando um Usuário Administrador

Para acessar as rotas protegidas da API e do Frontend, é necessário criar um usuário administrador no banco de dados. 

Com os containers do backend em execução, siga os passos abaixo:

1. Acesse o console interativo do Rails dentro do container da API (certifique-se de estar na pasta `backend`):
```bash
docker-compose exec api bin/rails c
```

2. Dentro do console, execute o comando para criar o administrador com email e senha:
```ruby
Admin.create!(email: "admin@example.com", password: "password123")
```

3. Digite `exit` para sair do console. 

Com o usuário criado, você poderá utilizar estas credenciais no Frontend para fazer login, ou no painel do Swagger (http://localhost:3000/api-docs) para testar as requisições manualmente.

## Experimentos de Caos (Chaos Mesh)

- Falha de Rede (NetworkChaos):
- Falha de Instância (PodChaos):
- Falha de Recurso (StressChaos):

## Mecanismos de Tolerância a Falhas e Monitoramento



## Relatório Técnico e Entregáveis


