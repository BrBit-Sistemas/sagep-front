# SAGEP-DF Admin — Wiki

Painel administrativo (React 19 + Vite + MUI v7) do sistema SAGEP. Gestão de reeducandos, convênios de trabalho, cadastros tenant (secretaria/regional/unidade) e fluxo de alocação em vagas.

## Stack

- **React 19** + **Vite 6** + **TypeScript 5.8**
- **UI**: MUI v7 (+ Emotion, Iconify, DataGrid, DatePickers, TreeView)
- **Form**: React Hook Form + Zod 4
- **Data**: TanStack Query v5 + Axios + **Orval** (API client gerado a partir do OpenAPI)
- **Routing**: React Router 7
- **State global leve**: Zustand 5
- **Query params**: nuqs
- **Auth**: JWT (context + guards + sessão persistida)
- **PDF**: @react-pdf-viewer + pdfjs-dist
- **E2E**: Playwright
- **Template base**: minimal-kit (UI components pré-existentes em `src/components/` — fora do grafo)

## Mapa da Wiki

- [Features](features.md) — features de domínio organizadas (detento, convênios, empresas, etc.)
- [Routes](routes.md) — rotas, layouts, guards
- [API](api.md) — clients Orval e serviços HTTP
- [Auth](auth.md) — fluxo JWT, contextos e guards
- [Hooks](hooks.md) — hooks customizados (TanStack Query, stores)
- [Flows](flows.md) — fluxos de negócio e hyperedges do grafo

## Núcleos funcionais (features)

| Feature | Responsabilidade |
|---|---|
| [`artigos-penais`](features.md#artigos-penais) | Catálogo de artigos penais (proxy ThereTech). |
| [`configuracoes`](features.md#configuracoes) | Configurações gerais do admin. |
| [`dashboard`](features.md#dashboard) | Métricas agregadas para telas de visão gerencial. |
| [`detento`](features.md#detento) | Cadastro de reeducandos, ficha cadastral, histórico. |
| [`empresa-convenios`](features.md#empresa-convenios) | Convênios de trabalho: raiz do agregado + vagas, responsáveis, tabelas de produtividade, templates de contrato. |
| [`empresas`](features.md#empresas) | CRUD de empresas conveniadas. |
| [`permissions`](features.md#permissions) | Roles e permissões (RBAC). |
| [`profissoes`](features.md#profissoes) | Catálogo de profissões compartilhado. |
| [`regionais`](features.md#regionais) | CRUD tenant de regionais. |
| [`secretarias`](features.md#secretarias) | CRUD tenant de secretarias (topo da hierarquia). |
| [`telao-vagas-fila`](features.md#telao-vagas-fila) | Telão de fila de reeducandos e alocação de vagas. |
| [`unidades-prisionais`](features.md#unidades-prisionais) | CRUD tenant de unidades prisionais. |
| [`users`](features.md#users) | Gestão de usuários do sistema. |

## God nodes (pontos de maior acoplamento)

| Nó | Edges | Arquivo |
|---|---:|---|
| `CONFIG (global-config)` | 23 | `src/global-config` |
| `ficha-cadastral-externa.tsx` | 15 | `src/features/detento/pages/ficha-cadastral-externa.tsx` |
| `PermissionGuard` | 13 | `src/auth/guard` |
| `convenio-contrato-preview-page.tsx` | 12 | `src/features/empresa-convenios/pages/convenio-contrato-preview-page.tsx` |
| `NovoSuperSagepBrView` | 12 | `src/sections/novo-super-sagep-br/view/novo-super-sagep-br-view.tsx` |
| `userService (CRUD)` | 11 | `src/features/users/data/index.ts` |
| `permissions.tsx` | 9 | `src/features/permissions/pages/permissions.tsx` |
| `detentoService (CRUD)` | 9 | `src/features/detento/data/index.ts` |
| `UserCadastroPage` | 9 | `src/features/users/pages/cadastro.tsx` |
| `routesSection (root)` | 9 | `src/routes/sections/index.tsx` |

## Estado do grafo

- **895** nós · **826** edges · **263** comunidades
- Extração: AST (TypeScript) + análise semântica (subagentes LLM)
- **Escopo deste build**: `src/features/`, `src/pages/`, `src/routes/`, `src/api/`, `src/auth/`, `src/sections/`, `src/services/` + docs root. Excluídos: `src/components/` (UI genérico minimal-kit), `src/layouts/`, `src/utils/`, `src/lib/`, `src/types/`, `src/constants/` e entrypoints.
