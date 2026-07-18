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

## Testes

Os testes utilizam o framework RSpec, factory_bot_rails e faker.

Os testes estão divididos em:
- Testes de Modelo: Garantem validações e associações entre as entidades.
- Testes de Requisição: Validam a camada externa da API e os status codes.
