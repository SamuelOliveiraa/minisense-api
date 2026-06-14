# MiniSense - Sistema de Monitoramento IoT e Sensoreamento Remoto

O **MiniSense** é uma solução de backend robusta desenvolvida para a gestão e monitoramento de dispositivos de Internet das Coisas (IoT). O sistema permite o gerenciamento de gateways sensores, fluxos de dados (streams) e a persistência de medições em tempo real, fornecendo uma base sólida para alertas e acompanhamento de estados condicionais em ambientes monitorados.

---

## 🌐 Disponibilidade da Aplicação

A API encontra-se implantada e disponível para avaliação no seguinte endereço:

- **Endpoint Base:** [https://link-do-seu-dominio.com](https://link-do-seu-dominio.com)
- **Documentação Interativa (Swagger):** [https://link-do-seu-dominio.com/docs](https://link-do-seu-dominio.com/docs)

---

## 🛠️ Arquitetura e Stack Tecnológica

O projeto foi arquitetado priorizando performance, segurança de tipos e manutenibilidade, utilizando as seguintes tecnologias:

- **Ecossistema:** Node.js v20+ com TypeScript.
- **Framework Web:** [Fastify](https://www.fastify.io/) - Escolhido pela sua altíssima performance e baixo overhead, essencial para aplicações que lidam com ingestão frequente de dados.
- **Camada de Dados:** [Drizzle ORM](https://orm.drizzle.team/) com PostgreSQL - Utilizado para garantir consultas type-safe e uma integração fluida com o banco de dados relacional.
- **Validação e Tipagem:** [Zod](https://zod.dev/) - Implementado para validação rigorosa de payloads e parâmetros, garantindo a integridade dos dados na entrada e saída da API.
- **Documentação Técnica:** Swagger (OpenAPI 3.0) via `@fastify/swagger` - Gerada automaticamente a partir das definições de rota e schemas Zod.

---

## 📋 Modelagem do Domínio

A implementação segue estritamente o modelo de domínio proposto, estruturado da seguinte forma:

1.  **Users:** Entidade central que detém a propriedade dos dispositivos.
2.  **Sensor Devices:** Gateways físicos que agrupam diferentes fluxos de coleta de dados.
3.  **Measurement Units:** Catálogo de unidades de medida (ºC, %, lux, etc.) que padroniza as leituras do sistema.
4.  **Data Streams:** Representação lógica de um canal de dados específico dentro de um dispositivo (ex: Temperatura). Cada stream é vinculada a uma unidade de medida.
5.  **Sensor Data:** Registros temporais (time-series) contendo os valores coletados e seus respectivos timestamps.

A separação de responsabilidades foi aplicada através do padrão **Controller-Model**, facilitando a testabilidade e a evolução independente da lógica de negócio e da camada de persistência.

---

## 🧪 Estratégia de Qualidade e Testes

A qualidade técnica é garantida por uma suíte de **testes de integração (End-to-End)** abrangente, utilizando **Vitest** e **Supertest**.

- **Isolamento de Ambiente:** Utilização de um banco de dados de testes dedicado (`minisense-test`) via Docker.
- **Ciclo de Vida Controlado:** Migrações automáticas e limpeza completa das tabelas (`beforeEach`) garantem que cada teste seja executado em um estado limpo e previsível.
- **Cobertura de Cenários:** Foram implementados testes para fluxos de sucesso (Happy Path) e tratamentos rigorosos de erro (Bad Paths), incluindo validações de schemas (400 Bad Request), recursos inexistentes (404 Not Found) e restrições de unicidade.

---

## 🛠️ Instruções para Execução Local

### 1. Requisitos

- Docker e Docker Compose.
- Node.js v20+ e NPM.

### 2. Configuração e Execução

```bash
# Clone do repositório
git clone https://github.com/seu-usuario/minisense.git
cd minisense

# Configuração de ambiente
cp .env.example .env

# Provisionamento da infraestrutura (PostgreSQL)
docker compose up -d

# Instalação e Migrações
npm install
npm run db:migrate

# Execução em modo desenvolvimento
npm run dev

# Execução da suíte de testes
npm test
```

---

## 📖 Documentação Técnica (Swagger UI)

Para uma análise detalhada de todos os contratos, formatos de requisição e modelos de resposta, a API disponibiliza uma interface interativa do **Swagger UI**.

Esta interface permite testar os endpoints diretamente pelo navegador, fornecendo uma visão clara do funcionamento da API e do cumprimento da especificação OpenAPI.

**Acesse em:** `http://localhost:3333/docs`

### Ferramentas de Teste (API Clients)

Para facilitar a integração e os testes manuais, o projeto disponibiliza coleções prontas para uso nos principais clientes de API:

- **Insomnia:** Importe o arquivo `insomnia_minisense_export.json` localizado na raiz do projeto.
- **Postman:** Importe o arquivo `postman_minisense_export.json` localizado na raiz do projeto.

Ambas as coleções já possuem as variáveis de ambiente configuradas para apontar para o servidor local (`http://localhost:3333`).

---

## 🤵 Autor

Este projeto foi desenvolvido como entregável técnico para o desafio de desenvolvedor na empresa **SenseUp**, demonstrando competências em arquitetura de microsserviços, design de APIs RESTful e boas práticas de engenharia de software.

---
