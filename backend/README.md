# Backend API - Trabalho de Sistemas Distribuídos

Este é o microsserviço de negócio da aplicação. A API foi desenvolvida em Ruby on Rails (modo API) e utiliza o PostgreSQL como banco de dados.

## Tecnologias e Infraestrutura

- Linguagem: Ruby
- Framework: Ruby on Rails (v8.1.3)
- Banco de Dados: PostgreSQL 15
- Infraestrutura: Docker e Docker Compose

O ambiente de desenvolvimento está conteinerizado no arquivo docker-compose.yml com os seguintes serviços:
- db: Container do PostgreSQL com um volume mapeado para persistência de dados.
- api: Container da aplicação Rails, exposta na porta 3000.

## Funcionalidades e Decisões Técnicas

- Autenticação: Implementada com a gem devise e devise-jwt para autenticação stateless baseada em tokens JWT.
- Entidades de Domínio:
  - Admin: Possui email e password, autenticado via JWT.
  - Category: Entidade pertencente a um Admin.
  - Item: Pertence a uma Category e a um Admin. Armazena name, description e value.
- Documentação API: Documentação OpenAPI/Swagger integrada através das gems rswag-api e rswag-ui, acessível em /api-docs.

## Como rodar o projeto localmente

Pré-requisitos: Docker e Docker Compose instalados.

1. Navegue até o diretório do backend:
   ```bash
   cd backend
   ```

2. Certifique-se de que o arquivo .env está na raiz do diretório backend com as variáveis necessárias.

3. Suba os containers em segundo plano:
   ```bash
   docker-compose up --build -d
   ```

4. Execute a criação e as migrações do banco de dados:
   ```bash
   docker-compose exec api bin/rails db:create
   docker-compose exec api bin/rails db:migrate
   ```

5. A API estará acessível em http://localhost:3000. O Swagger pode ser acessado em http://localhost:3000/api-docs.

## Testes

Os testes utilizam o framework RSpec, factory_bot_rails e faker.

Os testes estão divididos em:
- Testes de Modelo: Garantem validações e associações entre as entidades.
- Testes de Requisição: Validam a camada externa da API e os status codes.

Para rodar os testes:
```bash
docker-compose exec api bundle exec rspec
```
