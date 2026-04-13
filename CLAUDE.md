## Project Primer

**Domínio**: Painel administrativo (SPA) do sistema SAGEP-DF — gestão prisional do DF. Hierarquia tenant Secretaria → Regional → UnidadePrisional, cadastros de reeducandos, convênios de trabalho com empresas, fila/matching e folha de pagamento.

**Stack**: React 19 + Vite 6 + TypeScript · MUI v7 (+ Emotion) · React Hook Form + Zod · TanStack Query v5 · **Orval** (API client gerado do OpenAPI) · React Router 7 · Zustand (estado transitório) · JWT (context + guards) · Playwright (E2E).

**Template base**: minimal-kit (`src/components/`, `src/layouts/`, `src/theme/`) — UI boilerplate pré-existente, **fora do grafo de conceitos** do projeto. Foco do grafo: `src/features/`, `src/pages/`, `src/routes/`, `src/api/`, `src/auth/`, `src/sections/`, `src/services/`.

**Convenção por feature** (`src/features/<feature>/`):
- `components/` — dialogs, forms, tabs, selects
- `hooks/` — keys, queries, mutations, stores Zustand
- `data/` — schemas Zod, mappers (`toFormValues` / `fromApi` / `serializeDto`)
- `pages/` — telas de listagem e cadastro
- `types/` — tipos de domínio

**Features de domínio**: `detento` · `empresa-convenios` · `empresas` · `profissoes` · `trabalho-penal` · `telao-vagas-fila` · `regionais` · `unidades-prisionais` · `secretarias` · `users` · `permissions` · `artigos-penais` · `dashboard` · `configuracoes`.

**God nodes** (mais acoplados — grande blast radius):
- `CONFIG` em `src/global-config.ts` (23 edges) — config global consumida em todo lugar
- `PermissionGuard` (13 edges) — guard CASL-like presente em rotas e ações
- `ficha-cadastral-externa.tsx` (15 edges) — página pública de ficha (fora do dashboard)
- `convenio-contrato-preview-page.tsx` (12 edges) — preview PDF do contrato
- `userService (CRUD)` (11 edges) e `detentoService (CRUD)` (9 edges) — fachadas de API por feature
- `routesSection (root)` (9 edges) — raiz de rotas

**Fluxo central (CRUD padrão)**:
```
<feature>-list-page  →  DataGrid
      ↓ edit/new
<feature>-form-dialog  ←  Zod schema + React Hook Form
      ↓ submit
use-create-<feature> / use-update-<feature>  (TanStack mutation)
      ↓ success
invalidateQueries(keys.list)  +  sonner toast
```

**Fluxo auth (JWT)**:
```
JwtSignInView → signInWithPassword → POST /auth/login
  → setSession(token) → axios default header + localStorage
  → AuthContext.checkUserSession → GET /auth/me
  → AuthGuard libera rotas protegidas
```

**Recursos de exploração** (use sob demanda, não pré-carregue):
- `graphify-out/wiki/index.md` — índice da wiki gerada
- `graphify-out/wiki/features.md` — catálogo de features com arquivos por bucket
- `graphify-out/wiki/flows.md` — fluxos de negócio + hyperedges
- `graphify-out/GRAPH_REPORT.md` — relatório com god nodes, comunidades, surprising connections
- `graphify query "<termo>"` — BFS cirúrgico para relacionamentos específicos
- `graphify-out/graph.json` — grafo completo (NÃO carregar direto)

## Context Usage

- Work only within this project directory
- Ignore external tools, plugins, and unrelated folders
- Prefer using the knowledge graph for understanding structure and relationships
- Only read raw files when necessary
- UI primitives em `src/components/*` são minimal-kit (ignorar a menos que seja bug específico)

## Workflow

1. Entenda o contexto (feature, rota ou fluxo)
2. Use o grafo / wiki para mapear partes relevantes
3. Abra só os arquivos necessários
4. Implemente as mudanças

## Rules

- Do not scan the entire project
- Do not explore `src/components/` unless debugging a minimal-kit primitive
- Keep focus on the requested task

## graphify

This project has a graphify knowledge graph at graphify-out/.

Rules:
- Before answering architecture or codebase questions, read graphify-out/GRAPH_REPORT.md for god nodes and community structure
- If graphify-out/wiki/index.md exists, navigate it instead of reading raw files
- After modifying code files in this session, run `python3 -c "from graphify.watch import _rebuild_code; from pathlib import Path; _rebuild_code(Path('.'))"` to keep the graph current
- Para regenerar a wiki a partir do grafo atualizado: `python3 scripts/regen-wiki.py`
