<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

---

# DNC NestJS API

API RESTful desenvolvida com NestJS, TypeORM e MySQL para gerenciamento de usuários com autenticação JWT.

## 🚀 Tecnologias

- **[NestJS](https://nestjs.com/)** - Framework Node.js progressivo para construção de aplicações server-side eficientes e escaláveis
- **[TypeORM](https://typeorm.io/)** - ORM (Object-Relational Mapping) para TypeScript e JavaScript
- **[MySQL](https://www.mysql.com/)** - Sistema de gerenciamento de banco de dados relacional
- **[bcrypt](https://www.npmjs.com/package/bcrypt)** - Biblioteca para hash de senhas
- **[JWT](https://jwt.io/)** - JSON Web Token para autenticação stateless
- **[Passport](http://www.passportjs.org/)** - Middleware de autenticação

## 📊 Modelagem do Banco de Dados

### User (Usuário)

| Campo     | Tipo      | Descrição                      |
| --------- | --------- | ------------------------------ |
| id        | UUID/INT  | Identificador único            |
| name      | VARCHAR   | Nome completo do usuário       |
| username  | VARCHAR   | Nome de usuário (único)        |
| email     | VARCHAR   | E-mail (único)                 |
| password  | VARCHAR   | Senha criptografada com bcrypt |
| createdAt | TIMESTAMP | Data de criação                |
| updatedAt | TIMESTAMP | Data de atualização            |

## 📦 Instalação

### Pré-requisitos

- Node.js (v16 ou superior)
- MySQL (v8.0 ou superior)
- npm ou yarn

### Passo a passo

1. **Clone o repositório**

```bash
git clone https://github.com/mikasampaio/dnc_nest_js
cd dnc_nest_js
```

2. **Instale as dependências**

```bash
npm install
```

3. **Configure o banco de dados MySQL**

Acesse o MySQL:

```bash
mysql -u root -p
```

Crie o banco de dados:

```sql
CREATE DATABASE dnc_nest_js;
```

4. **Configure as variáveis de ambiente**

Copie o arquivo de exemplo e edite conforme necessário:

```bash
cp .env.example .env
```

Conteúdo do `.env`:

```env
DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=root
DB_PASSWORD=sua_senha_aqui
DB_DATABASE=dnc_nest_js

JWT_SECRET="2e65b84aa32bf0f74599ed9e9fa8574a9a2cbd05"

PORT=3000
```

5. **Inicie a aplicação**

```bash
npm run start:dev
```

A API estará disponível em `http://localhost:3000`

## 📡 Endpoints

### Autenticação

#### Registrar novo usuário

```http
POST /auth/register
Content-Type: application/json

{
  "name": "João Silva",
  "username": "joaosilva",
  "email": "joao@email.com",
  "password": "senha123"
}
```

#### Login

```http
POST /auth/login
Content-Type: application/json

{
  "email": "joao@email.com",
  "password": "senha123"
}
```



### Usuários (Requer autenticação)

#### Listar todos os usuários

```http
GET /users
Authorization: Bearer {token}
```

#### Buscar usuário por ID

```http
GET /users/:id
Authorization: Bearer {token}
```

#### Atualizar usuário

```http
PATCH /users/:id
Authorization: Bearer {token}
Content-Type: application/json

{
  "name": "João Pedro Silva",
  "email": "joaopedro@email.com"
}
```

#### Deletar usuário

```http
DELETE /users/:id
Authorization: Bearer {token}
```

## 📁 Estrutura de Pastas

```
dnc_nest_js/
├── src/
│   ├── modules/                      # Módulos da aplicação
│   │   ├── auth/                     # Módulo de autenticação
│   │   │   ├── domain/
│   │   │   │   └── dtos/
│   │   │   │       └── auth.dtos.ts  # DTOs de autenticação (login, register)
│   │   │   ├── strategies/
│   │   │   │   └── jwt.strategy.ts   # Estratégia JWT do Passport
│   │   │   ├── auth.controller.ts    # Controller de autenticação
│   │   │   ├── auth.module.ts        # Módulo de autenticação
│   │   │   └── auth.service.ts       # Serviço de autenticação
│   │   │
│   │   └── users/                    # Módulo de usuários
│   │       ├── dtos/
│   │       │   └── user.dtos.ts      # DTOs de usuário (create, update)
│   │       ├── entities/
│   │       │   └── user.entity.ts    # Entidade User do TypeORM
│   │       ├── user.controllers.ts   # Controller de usuários
│   │       ├── user.module.ts        # Módulo de usuários
│   │       └── user.services.ts      # Serviço de usuários
│   │
│   ├── shared/                       # Recursos compartilhados
│   │   ├── decorators/
│   │   │   └── params.decorator.ts   # Decorators customizados
│   │   ├── guards/
│   │   │   └── jwt.guard.ts          # Guard JWT para proteção de rotas
│   │   ├── interceptors/
│   │   │   └── logging.interceptor.ts # Interceptor para logging
│   │   └── middlewares/
│   │       └── userId.middleware.ts  # Middleware para validação de userId
│   │
│   ├── app.module.ts                 # Módulo raiz da aplicação
│   └── main.ts                       # Arquivo de entrada (bootstrap)
│
├── .env                              # Variáveis de ambiente (não versionado)
├── .env.example                      # Exemplo de variáveis de ambiente
├── .gitignore                        # Arquivos ignorados pelo Git
├── package.json                      # Dependências do projeto
├── tsconfig.json                     # Configuração do TypeScript
└── README.md                         # Documentação do projeto
```

### Descrição da Estrutura

- **`modules/`**: Contém os módulos de domínio da aplicação (auth, users)
  - Cada módulo possui sua própria estrutura interna (DTOs, entities, services, controllers)
  
- **`shared/`**: Recursos compartilhados entre módulos
  - **`decorators/`**: Decorators customizados reutilizáveis
  - **`guards/`**: Guards de autenticação e autorização
  - **`interceptors/`**: Interceptors para logging, transformação de dados, etc.
  - **`middlewares/`**: Middlewares para processamento de requisições

## 🔐 Segurança

- Senhas são criptografadas usando **bcrypt** antes de serem armazenadas
- Autenticação via **JWT** (JSON Web Token)
- Rotas protegidas requerem token válido no header `Authorization: Bearer {token}`
- Validação de dados de entrada com **class-validator**


## 📝 Licença

Este projeto está sob a licença MIT.


## 👨‍💻 Autor

**Mikaeli Sampaio** - [GitHub](https://github.com/mikasampaio)
