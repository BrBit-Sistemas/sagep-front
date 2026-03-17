## Prerequisites

- Node.js >=20 (Recommended)

## Installation

**Using Yarn (Recommended)**

```sh
yarn install
yarn dev
```

**Using Npm**

```sh
npm i
npm run dev
```

## Build

```sh
yarn build
# or
npm run build
```

## Playwright E2E

Pré-requisitos:

- frontend rodando em `http://localhost:3030`
- API rodando em `http://localhost:3000`
- usuário com permissão de ficha cadastral para os testes internos e externos

Variáveis aceitas:

- `PLAYWRIGHT_BASE_URL` padrão `http://localhost:3030`
- `PLAYWRIGHT_API_URL` padrão `http://localhost:3000`
- `PLAYWRIGHT_ADMIN_CPF` padrão `11144477735`
- `PLAYWRIGHT_ADMIN_PASSWORD` padrão `admin@sagep`

Comandos:

```sh
yarn test:e2e
yarn test:e2e:headed
yarn test:e2e:ui
yarn test:e2e:update-snapshots
```

Notas:

- A suíte usa dados com prefixo `PW E2E` e evita apagar registros fora desse padrão.
- Os testes visuais salvam snapshots em `e2e/.snapshots`.
- Se houver falhas de ambiente local, verifique primeiro autenticação, disponibilidade da API e acesso aos serviços externos usados pelo formulário.

## Mock server

By default we provide demo data from : `https://api-dev-minimal-[version].vercel.app`

To set up your local server:

- **Guide:** [https://docs.minimals.cc/mock-server](https://docs.minimals.cc/mock-server).

- **Resource:** [Download](https://www.dropbox.com/scl/fo/bopqsyaatc8fbquswxwww/AKgu6V6ZGmxtu22MuzsL5L4?rlkey=8s55vnilwz2d8nsrcmdo2a6ci&dl=0).

## Full version

- Create React App ([migrate to CRA](https://docs.minimals.cc/migrate-to-cra/)).
- Next.js
- Vite.js

## Starter version

- To remove unnecessary components. This is a simplified version ([https://starter.minimals.cc/](https://starter.minimals.cc/))
- Good to start a new project. You can copy components from the full version.
- Make sure to install the dependencies exactly as compared to the full version.

---

**NOTE:**
_When copying folders remember to also copy hidden files like .env. This is important because .env files often contain environment variables that are crucial for the application to run correctly._
