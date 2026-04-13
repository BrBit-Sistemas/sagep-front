# Features

← [index](index.md) · [routes](routes.md) · [api](api.md) · [auth](auth.md) · [hooks](hooks.md) · [flows](flows.md)

13 features de domínio em `src/features/<feature>/`. Cada feature segue o padrão `components/`, `hooks/` (TanStack Query + stores Zustand), `data/` (schemas Zod + mappers), `pages/`, `types/`.

## artigos-penais

_Catálogo de artigos penais (proxy ThereTech)._

**Components** (1)

- `articles-selector.tsx` — `artigos-penais/components/articles-selector.tsx`

**Data (schemas/mappers)** (1)

- `index.ts` — `artigos-penais/data/index.ts`

## configuracoes

_Configurações gerais do admin._

**Pages** (1)

- `configuracoes.tsx` — `configuracoes/pages/configuracoes.tsx`

## dashboard

_Métricas agregadas para telas de visão gerencial._

**Hooks** (3)

- `keys.ts` — `dashboard/hooks/keys.ts`
- `useDashboardMetrics` — `dashboard/hooks/use-dashboard-metrics`
- `use-dashboard-metrics.ts` — `dashboard/hooks/use-dashboard-metrics.ts`

**Data (schemas/mappers)** (1)

- `index.ts` — `dashboard/data/index.ts`

## detento

_Cadastro de reeducandos, ficha cadastral, histórico._

**Pages** (4)

- `cadastro.tsx` — `detento/pages/cadastro.tsx`
- `detalhes.tsx` — `detento/pages/detalhes.tsx`
- `ficha-cadastral-externa.tsx` — `detento/pages/ficha-cadastral-externa.tsx`
- `ficha-cadastral-form.tsx` — `detento/pages/ficha-cadastral-form.tsx`

**Components** (12)

- `detento-delete-dialog.tsx` — `detento/components/cadastro/detento-delete-dialog.tsx`
- `detento-form-dialog.tsx` — `detento/components/cadastro/detento-form-dialog.tsx`
- `detento-table-toolbar.tsx` — `detento/components/cadastro/detento-table-toolbar.tsx`
- `detento-detalhes-cover.tsx` — `detento/components/detalhes/detento-detalhes-cover.tsx`
- `detento-detalhes.tsx` — `detento/components/detalhes/detento-detalhes.tsx`
- `detento-ficha-cadastral-add-card.tsx` — `detento/components/detalhes/detento-ficha-cadastral-add-card.tsx`
- `detento-ficha-cadastral-card.tsx` — `detento/components/detalhes/detento-ficha-cadastral-card.tsx`
- `detento-ficha-cadastral-dialog-form.tsx` — `detento/components/detalhes/detento-ficha-cadastral-dialog-form.tsx`
- `detento-ficha-inativa-selector.tsx` — `detento/components/detalhes/detento-ficha-inativa-selector.tsx`
- `detento-details-tab.tsx` — `detento/components/detalhes/tabs/detento-details-tab.tsx`
- `detento-ficha-cadastral-tab.tsx` — `detento/components/detalhes/tabs/detento-ficha-cadastral-tab.tsx`
- `ficha-documentos-field.tsx` — `detento/components/ficha-documentos-field.tsx`

**Hooks** (12)

- `keys.ts` — `detento/hooks/keys.ts`
- `use-create-detento.ts` — `detento/hooks/use-create-detento.ts`
- `use-delete-detento.ts` — `detento/hooks/use-delete-detento.ts`
- `use-dentento-detalhes-search-params.ts` — `detento/hooks/use-dentento-detalhes-search-params.ts`
- `use-detento-filters.ts` — `detento/hooks/use-detento-filters.ts`
- `use-detento-list-table.tsx` — `detento/hooks/use-detento-list-table.tsx`
- `use-detento-list.ts` — `detento/hooks/use-detento-list.ts`
- `use-detento-search-params.ts` — `detento/hooks/use-detento-search-params.ts`
- `use-get-detento-fichas-cadastrais.ts` — `detento/hooks/use-get-detento-fichas-cadastrais.ts`
- `use-get-detento-fichas-inativas.ts` — `detento/hooks/use-get-detento-fichas-inativas.ts`
- `use-read-details.ts` — `detento/hooks/use-read-details.ts`
- `use-update-detento.ts` — `detento/hooks/use-update-detento.ts`

**Data (schemas/mappers)** (1)

- `index.ts` — `detento/data/index.ts`

**Types** (1)

- `index.ts` — `detento/types/index.ts`

**Outros** (3)

- `index.ts` — `detento/helper/index.ts`
- `index.ts` — `detento/schemas/index.ts`
- `detento-cadastro-store.ts` — `detento/stores/detento-cadastro-store.ts`

## empresa-convenios

_Convênios de trabalho: raiz do agregado + vagas, responsáveis, tabelas de produtividade, templates de contrato._

**Pages** (3)

- `cadastro.tsx` — `empresa-convenios/pages/cadastro.tsx`
- `convenio-contrato-preview-page.tsx` — `empresa-convenios/pages/convenio-contrato-preview-page.tsx`
- `convenio-form-page.tsx` — `empresa-convenios/pages/convenio-form-page.tsx`

**Components** (2)

- `empresa-convenio-delete-dialog.tsx` — `empresa-convenios/components/cadastro/empresa-convenio-delete-dialog.tsx`
- `convenio-profissao-autocomplete.tsx` — `empresa-convenios/components/convenio-profissao-autocomplete.tsx`

**Hooks** (12)

- `keys.ts` — `empresa-convenios/hooks/keys.ts`
- `use-contrato-preview.ts` — `empresa-convenios/hooks/use-contrato-preview.ts`
- `use-convenio-contrato-catalog.ts` — `empresa-convenios/hooks/use-convenio-contrato-catalog.ts`
- `use-create-empresa-convenio.ts` — `empresa-convenios/hooks/use-create-empresa-convenio.ts`
- `use-delete-empresa-convenio.ts` — `empresa-convenios/hooks/use-delete-empresa-convenio.ts`
- `use-empresa-convenio-detail.ts` — `empresa-convenios/hooks/use-empresa-convenio-detail.ts`
- `use-empresa-convenio-list-table.tsx` — `empresa-convenios/hooks/use-empresa-convenio-list-table.tsx`
- `use-empresa-convenio-list.ts` — `empresa-convenios/hooks/use-empresa-convenio-list.ts`
- `use-empresa-convenio-search-params.ts` — `empresa-convenios/hooks/use-empresa-convenio-search-params.ts`
- `use-empresas-options.ts` — `empresa-convenios/hooks/use-empresas-options.ts`
- `use-profissoes-options.ts` — `empresa-convenios/hooks/use-profissoes-options.ts`
- `use-update-empresa-convenio.ts` — `empresa-convenios/hooks/use-update-empresa-convenio.ts`

**Data (schemas/mappers)** (2)

- `empresaConvenioService` — `empresa-convenios/data`
- `index.ts` — `empresa-convenios/data/index.ts`

**Types** (1)

- `index.ts` — `empresa-convenios/types/index.ts`

**Outros** (3)

- `index.ts` — `empresa-convenios/helper/index.ts`
- `index.ts` — `empresa-convenios/schemas/index.ts`
- `empresa-convenio-cadastro-store.ts` — `empresa-convenios/stores/empresa-convenio-cadastro-store.ts`

## empresas

_CRUD de empresas conveniadas._

**Pages** (1)

- `cadastro.tsx` — `empresas/pages/cadastro.tsx`

**Components** (2)

- `empresa-delete-dialog.tsx` — `empresas/components/cadastro/empresa-delete-dialog.tsx`
- `empresa-form-dialog.tsx` — `empresas/components/cadastro/empresa-form-dialog.tsx`

**Hooks** (10)

- `keys.ts` — `empresas/hooks/keys.ts`
- `useCreateEmpresa` — `empresas/hooks/use-create-empresa`
- `use-create-empresa.ts` — `empresas/hooks/use-create-empresa.ts`
- `useDeleteEmpresa` — `empresas/hooks/use-delete-empresa`
- `use-delete-empresa.ts` — `empresas/hooks/use-delete-empresa.ts`
- `use-empresa-list-table.tsx` — `empresas/hooks/use-empresa-list-table.tsx`
- `use-empresa-list.ts` — `empresas/hooks/use-empresa-list.ts`
- `use-empresa-search-params.ts` — `empresas/hooks/use-empresa-search-params.ts`
- `useUpdateEmpresa` — `empresas/hooks/use-update-empresa`
- `use-update-empresa.ts` — `empresas/hooks/use-update-empresa.ts`

**Data (schemas/mappers)** (1)

- `index.ts` — `empresas/data/index.ts`

**Types** (1)

- `index.ts` — `empresas/types/index.ts`

**Outros** (4)

- `index.ts` — `empresas/helper/index.ts`
- `index.ts` — `empresas/schemas/index.ts`
- `useEmpresaCadastroStore` — `empresas/stores/empresa-cadastro-store`
- `empresa-cadastro-store.ts` — `empresas/stores/empresa-cadastro-store.ts`

## permissions

_Roles e permissões (RBAC)._

**Pages** (1)

- `permissions.tsx` — `permissions/pages/permissions.tsx`

**Hooks** (3)

- `keys.ts` — `permissions/hooks/keys.ts`
- `use-list-roles.ts` — `permissions/hooks/use-list-roles.ts`
- `use-permissions.ts` — `permissions/hooks/use-permissions.ts`

**Data (schemas/mappers)** (1)

- `index.ts` — `permissions/data/index.ts`

## profissoes

_Catálogo de profissões compartilhado._

**Pages** (1)

- `cadastro.tsx` — `profissoes/pages/cadastro.tsx`

**Components** (4)

- `ProfissaoFormDialog` — `profissoes/components`
- `profissao-delete-dialog.tsx` — `profissoes/components/cadastro/profissao-delete-dialog.tsx`
- `profissao-form-dialog.tsx` — `profissoes/components/cadastro/profissao-form-dialog.tsx`
- `index.ts` — `profissoes/components/index.ts`

**Hooks** (8)

- `keys.ts` — `profissoes/hooks/keys.ts`
- `use-create-profissao.tsx` — `profissoes/hooks/use-create-profissao.tsx`
- `use-delete-profissao.tsx` — `profissoes/hooks/use-delete-profissao.tsx`
- `use-list-profissoes.ts` — `profissoes/hooks/use-list-profissoes.ts`
- `use-profissao-list-table.tsx` — `profissoes/hooks/use-profissao-list-table.tsx`
- `use-profissao-search-params.ts` — `profissoes/hooks/use-profissao-search-params.ts`
- `use-update-profissao.ts` — `profissoes/hooks/use-update-profissao.ts`
- `useUpdateProfissao` — `profissoes/hooks/use-update-profissao.tsx`

**Data (schemas/mappers)** (1)

- `index.ts` — `profissoes/data/index.ts`

**Types** (1)

- `index.ts` — `profissoes/types/index.ts`

**Outros** (5)

- `profissaoToFormValues` — `profissoes/helper`
- `index.ts` — `profissoes/helper/index.ts`
- `index.ts` — `profissoes/schemas/index.ts`
- `index.ts` — `profissoes/stores/index.ts`
- `profissao-cadastro-store.ts` — `profissoes/stores/profissao-cadastro-store.ts`

## regionais

_CRUD tenant de regionais._

**Pages** (1)

- `regional-cadastro.tsx` — `regionais/pages/regional-cadastro.tsx`

**Components** (3)

- `index.ts` — `regionais/components/index.ts`
- `regional-delete-dialog.tsx` — `regionais/components/regional-delete-dialog.tsx`
- `regional-form-dialog.tsx` — `regionais/components/regional-form-dialog.tsx`

**Hooks** (7)

- `keys.ts` — `regionais/hooks/keys.ts`
- `use-create-regional.tsx` — `regionais/hooks/use-create-regional.tsx`
- `use-delete-regional.tsx` — `regionais/hooks/use-delete-regional.tsx`
- `use-list-regionais.ts` — `regionais/hooks/use-list-regionais.ts`
- `use-regional-list-table.tsx` — `regionais/hooks/use-regional-list-table.tsx`
- `use-regional-search-params.ts` — `regionais/hooks/use-regional-search-params.ts`
- `use-update-regional.ts` — `regionais/hooks/use-update-regional.ts`

**Data (schemas/mappers)** (1)

- `index.ts` — `regionais/data/index.ts`

**Types** (1)

- `index.ts` — `regionais/types/index.ts`

**Outros** (5)

- `index.ts` — `regionais/helper/index.ts`
- `regional schemas` — `regionais/schemas`
- `index.ts` — `regionais/schemas/index.ts`
- `useRegionalCadastroStore` — `regionais/stores`
- `index.ts` — `regionais/stores/index.ts`

## secretarias

_CRUD tenant de secretarias (topo da hierarquia)._

**Hooks** (1)

- `useListSecretarias` — `secretarias/hooks/use-list-secretaria`

## telao-vagas-fila

_Telão de fila de reeducandos e alocação de vagas._

**Pages** (1)

- `telao-vagas-fila-page.tsx` — `telao-vagas-fila/pages/telao-vagas-fila-page.tsx`

## unidades-prisionais

_CRUD tenant de unidades prisionais._

**Pages** (1)

- `cadastro.tsx` — `unidades-prisionais/pages/cadastro.tsx`

**Components** (2)

- `unidade-prisional-delete-dialog.tsx` — `unidades-prisionais/components/cadastro/unidade-prisional-delete-dialog.tsx`
- `unidade-prisional-form-dialog.tsx` — `unidades-prisionais/components/cadastro/unidade-prisional-form-dialog.tsx`

**Hooks** (7)

- `keys.ts` — `unidades-prisionais/hooks/keys.ts`
- `use-create-unidade-prisional.ts` — `unidades-prisionais/hooks/use-create-unidade-prisional.ts`
- `use-delete-unidade-prisional.ts` — `unidades-prisionais/hooks/use-delete-unidade-prisional.ts`
- `use-unidade-prisional-list-table.tsx` — `unidades-prisionais/hooks/use-unidade-prisional-list-table.tsx`
- `use-unidade-prisional-list.ts` — `unidades-prisionais/hooks/use-unidade-prisional-list.ts`
- `use-unidade-prisional-search-params.ts` — `unidades-prisionais/hooks/use-unidade-prisional-search-params.ts`
- `use-update-unidade-prisional.ts` — `unidades-prisionais/hooks/use-update-unidade-prisional.ts`

**Data (schemas/mappers)** (1)

- `index.ts` — `unidades-prisionais/data/index.ts`

**Types** (1)

- `index.ts` — `unidades-prisionais/types/index.ts`

**Outros** (3)

- `index.ts` — `unidades-prisionais/helper/index.ts`
- `index.ts` — `unidades-prisionais/schemas/index.ts`
- `unidade-prisional-cadastro-store.ts` — `unidades-prisionais/stores/unidade-prisional-cadastro-store.ts`

## users

_Gestão de usuários do sistema._

**Pages** (1)

- `cadastro.tsx` — `users/pages/cadastro.tsx`

**Components** (4)

- `UserDeleteDialog` — `users/components/cadastro/user-delete-dialog`
- `user-delete-dialog.tsx` — `users/components/cadastro/user-delete-dialog.tsx`
- `UserFormDialog` — `users/components/cadastro/user-form-dialog`
- `user-form-dialog.tsx` — `users/components/cadastro/user-form-dialog.tsx`

**Hooks** (7)

- `keys.ts` — `users/hooks/keys.ts`
- `use-create-user.ts` — `users/hooks/use-create-user.ts`
- `use-delete-user.ts` — `users/hooks/use-delete-user.ts`
- `use-update-user.ts` — `users/hooks/use-update-user.ts`
- `use-user-list-table.tsx` — `users/hooks/use-user-list-table.tsx`
- `use-user-list.ts` — `users/hooks/use-user-list.ts`
- `use-user-search-params.ts` — `users/hooks/use-user-search-params.ts`

**Data (schemas/mappers)** (1)

- `index.ts` — `users/data/index.ts`

**Types** (1)

- `index.ts` — `users/types/index.ts`

**Outros** (3)

- `index.ts` — `users/helper/index.ts`
- `index.ts` — `users/schemas/index.ts`
- `user-cadastro-store.ts` — `users/stores/user-cadastro-store.ts`
