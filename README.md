# MiniSense - Sistema de Monitoramento IoT e Sensoreamento Remoto

O **MiniSense** é uma solução de backend robusta desenvolvida para a gestão e monitoramento de dispositivos de Internet das Coisas (IoT). O sistema permite o gerenciamento de gateways sensores, fluxos de dados (streams) e a persistência de medições em tempo real, fornecendo uma base sólida para alertas e acompanhamento de estados condicionais em ambientes monitorados.

---

## 🌐 Disponibilidade da Aplicação

A API encontra-se implantada e disponível para avaliação no seguinte endereço:

- **Endpoint Base:** [https://minisense-api-production.up.railway.app/](https://minisense-api-production.up.railway.app/)
- **Documentação Interativa (Swagger):** [https://minisense-api-production.up.railway.app/docs](https://minisense-api-production.up.railway.app/docs)

---

## 🛠️ Arquitetura e Stack Tecnológica

O projeto foi arquitetado priorizando performance, segurança de tipos e manutenibilidade, utilizando as seguintes tecnologias:

- **Ecossistema:** Node.js v20+ com TypeScript (ES Modules).
- **Framework Web:** [Fastify](https://www.fastify.io/) - Escolhido pela sua altíssima performance e baixo overhead, essencial para aplicações que lidam com ingestão frequente de dados.
- **Camada de Dados:** [Drizzle ORM](https://orm.drizzle.team/) com PostgreSQL - Utilizado para garantir consultas type-safe e uma integração fluida com o banco de dados relacional.
- **Validação e Tipagem:** [Zod](https://zod.dev/) - Implementado para validação rigorosa de payloads e parâmetros via `fastify-type-provider-zod`.
- **Documentação Técnica:** Swagger (OpenAPI 3.0) via `@fastify/swagger` - Gerada automaticamente a partir das definições de rota e schemas Zod.

---

## 📋 Modelagem do Domínio

A implementação segue um modelo de domínio estruturado para IoT:

1.  **Users:** Entidade central que detém a propriedade dos dispositivos.
2.  **Sensor Devices:** Gateways físicos (dispositivos) vinculados a um usuário.
3.  **Measurement Units:** Catálogo de unidades de medida (ºC, %, Lux, etc.).
4.  **Data Streams:** Canais de dados específicos de um dispositivo (ex: Sensor de Temperatura da Sala A).
5.  **Sensor Data:** Registros temporais (Time-Series) contendo os valores coletados.

A arquitetura segue o padrão **Controller-Model**, garantindo separação de responsabilidades e facilidade de manutenção.

---

## 🧪 Estratégia de Qualidade e Testes

A qualidade técnica é garantida por uma suíte de **testes de integração (End-to-End)** determinísticos:

- **Execução Sequencial:** O Vitest está configurado para executar os testes em fila única (`maxWorkers: 1`), evitando colisões de dados no banco de dados compartilhado.
- **Reset Determinístico:** Utilização de um utilitário centralizado (`resetDatabase`) que limpa todas as tabelas na ordem correta de dependências (Foreign Keys) antes de cada teste individual.
- **Ambiente Isolado:** Banco de dados de testes dedicado via Docker Compose (`db-test`).
- **Cobertura:** Testes abrangentes para fluxos de criação, listagem, atualização, deleção e tratamentos de erro (400, 404, conflitos de unicidade).

---

## 🚀 Instruções para Execução Local

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
cp .env.test.example .env.test

# Provisionamento da infraestrutura (PostgreSQL)
docker compose up -d

# Instalação de dependências
npm install

# Preparação do Banco de Dados
npm run db:generate  # Gera as migrações
npm run db:migrate   # Aplica as migrações no banco local

# População de Dados (Opcional)
npm run db:seed      # Popula o banco com dados iniciais e medições de exemplo

# Execução em modo desenvolvimento
npm run dev
```

### 3. Comandos Disponíveis

| Comando              | Descrição                                                                 |
| :------------------- | :------------------------------------------------------------------------ |
| `npm run dev`        | Inicia o servidor em modo watch com `tsx`.                                |
| `npm run build`      | Compila o projeto para produção usando `tsup`.                            |
| `npm run db:seed`    | Popula o banco com usuário admin, unidades, sensores e 48 medições reais. |
| `npm run test`       | Executa os testes de integração uma única vez.                            |
| `npm run test:watch` | Sobe o banco de teste via Docker e inicia o modo watch do Vitest.         |
| `npm run db:studio`  | Abre a interface visual do Drizzle para explorar os dados.                |

---

## 📖 Documentação Técnica (Swagger UI)

Acesse a documentação completa dos endpoints em: `http://localhost:3333/docs`

### Ferramentas de Teste (API Clients)

O projeto inclui coleções prontas para uso:

- **Insomnia:** `insomnia_minisense_export.json`
- **Postman:** `postman_minisense_export.json`

---

## 🤵 Autor

Este projeto foi desenvolvido como entregável técnico para o desafio de desenvolvedor na empresa **SenseUp**.

---
