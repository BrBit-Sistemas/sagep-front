# Hooks

← [index](index.md) · [features](features.md) · [routes](routes.md) · [api](api.md) · [auth](auth.md) · [flows](flows.md)

70 hooks customizados nas features. Convenções:

- `keys.ts` — factories de query keys por feature (ex.: `empresaKeys.list(params)`).
- `use-<feature>-list.ts` — lista paginada (TanStack `useQuery`).
- `use-read-<feature>.ts` / `use-suspense-read-<feature>.ts` — leitura única por id, variante `Suspense` para rotas com `<Suspense>` + `<Await>`.
- `use-create-<feature>.ts` / `use-update-<feature>.ts` / `use-delete-<feature>.ts` — mutations com invalidação automática de keys.
- `use-<feature>-cadastro-store.ts` — store Zustand local à feature (estado transitório de formulário).

## Query Keys (9)

- `keys.ts` — `src/features/dashboard/hooks/keys.ts`
- `keys.ts` — `src/features/detento/hooks/keys.ts`
- `keys.ts` — `src/features/empresa-convenios/hooks/keys.ts`
- `keys.ts` — `src/features/empresas/hooks/keys.ts`
- `keys.ts` — `src/features/permissions/hooks/keys.ts`
- `keys.ts` — `src/features/profissoes/hooks/keys.ts`
- `keys.ts` — `src/features/regionais/hooks/keys.ts`
- `keys.ts` — `src/features/unidades-prisionais/hooks/keys.ts`
- `keys.ts` — `src/features/users/hooks/keys.ts`

## Queries (19)

- `use-detento-list-table.tsx` — `src/features/detento/hooks/use-detento-list-table.tsx`
- `use-detento-list.ts` — `src/features/detento/hooks/use-detento-list.ts`
- `use-get-detento-fichas-cadastrais.ts` — `src/features/detento/hooks/use-get-detento-fichas-cadastrais.ts`
- `use-get-detento-fichas-inativas.ts` — `src/features/detento/hooks/use-get-detento-fichas-inativas.ts`
- `use-read-details.ts` — `src/features/detento/hooks/use-read-details.ts`
- `use-empresa-convenio-list-table.tsx` — `src/features/empresa-convenios/hooks/use-empresa-convenio-list-table.tsx`
- `use-empresa-convenio-list.ts` — `src/features/empresa-convenios/hooks/use-empresa-convenio-list.ts`
- `use-empresa-list-table.tsx` — `src/features/empresas/hooks/use-empresa-list-table.tsx`
- `use-empresa-list.ts` — `src/features/empresas/hooks/use-empresa-list.ts`
- `use-list-roles.ts` — `src/features/permissions/hooks/use-list-roles.ts`
- `use-list-profissoes.ts` — `src/features/profissoes/hooks/use-list-profissoes.ts`
- `use-profissao-list-table.tsx` — `src/features/profissoes/hooks/use-profissao-list-table.tsx`
- `use-list-regionais.ts` — `src/features/regionais/hooks/use-list-regionais.ts`
- `use-regional-list-table.tsx` — `src/features/regionais/hooks/use-regional-list-table.tsx`
- `useListSecretarias` — `src/features/secretarias/hooks/use-list-secretaria`
- `use-unidade-prisional-list-table.tsx` — `src/features/unidades-prisionais/hooks/use-unidade-prisional-list-table.tsx`
- `use-unidade-prisional-list.ts` — `src/features/unidades-prisionais/hooks/use-unidade-prisional-list.ts`
- `use-user-list-table.tsx` — `src/features/users/hooks/use-user-list-table.tsx`
- `use-user-list.ts` — `src/features/users/hooks/use-user-list.ts`

## Mutations (25)

- `use-create-detento.ts` — `src/features/detento/hooks/use-create-detento.ts`
- `use-delete-detento.ts` — `src/features/detento/hooks/use-delete-detento.ts`
- `use-update-detento.ts` — `src/features/detento/hooks/use-update-detento.ts`
- `use-create-empresa-convenio.ts` — `src/features/empresa-convenios/hooks/use-create-empresa-convenio.ts`
- `use-delete-empresa-convenio.ts` — `src/features/empresa-convenios/hooks/use-delete-empresa-convenio.ts`
- `use-update-empresa-convenio.ts` — `src/features/empresa-convenios/hooks/use-update-empresa-convenio.ts`
- `useCreateEmpresa` — `src/features/empresas/hooks/use-create-empresa`
- `use-create-empresa.ts` — `src/features/empresas/hooks/use-create-empresa.ts`
- `useDeleteEmpresa` — `src/features/empresas/hooks/use-delete-empresa`
- `use-delete-empresa.ts` — `src/features/empresas/hooks/use-delete-empresa.ts`
- `useUpdateEmpresa` — `src/features/empresas/hooks/use-update-empresa`
- `use-update-empresa.ts` — `src/features/empresas/hooks/use-update-empresa.ts`
- `use-create-profissao.tsx` — `src/features/profissoes/hooks/use-create-profissao.tsx`
- `use-delete-profissao.tsx` — `src/features/profissoes/hooks/use-delete-profissao.tsx`
- `use-update-profissao.ts` — `src/features/profissoes/hooks/use-update-profissao.ts`
- `useUpdateProfissao` — `src/features/profissoes/hooks/use-update-profissao.tsx`
- `use-create-regional.tsx` — `src/features/regionais/hooks/use-create-regional.tsx`
- `use-delete-regional.tsx` — `src/features/regionais/hooks/use-delete-regional.tsx`
- `use-update-regional.ts` — `src/features/regionais/hooks/use-update-regional.ts`
- `use-create-unidade-prisional.ts` — `src/features/unidades-prisionais/hooks/use-create-unidade-prisional.ts`
- `use-delete-unidade-prisional.ts` — `src/features/unidades-prisionais/hooks/use-delete-unidade-prisional.ts`
- `use-update-unidade-prisional.ts` — `src/features/unidades-prisionais/hooks/use-update-unidade-prisional.ts`
- `use-create-user.ts` — `src/features/users/hooks/use-create-user.ts`
- `use-delete-user.ts` — `src/features/users/hooks/use-delete-user.ts`
- `use-update-user.ts` — `src/features/users/hooks/use-update-user.ts`

## Outros (17)

- `useDashboardMetrics` — `src/features/dashboard/hooks/use-dashboard-metrics`
- `use-dashboard-metrics.ts` — `src/features/dashboard/hooks/use-dashboard-metrics.ts`
- `use-dentento-detalhes-search-params.ts` — `src/features/detento/hooks/use-dentento-detalhes-search-params.ts`
- `use-detento-filters.ts` — `src/features/detento/hooks/use-detento-filters.ts`
- `use-detento-search-params.ts` — `src/features/detento/hooks/use-detento-search-params.ts`
- `use-contrato-preview.ts` — `src/features/empresa-convenios/hooks/use-contrato-preview.ts`
- `use-convenio-contrato-catalog.ts` — `src/features/empresa-convenios/hooks/use-convenio-contrato-catalog.ts`
- `use-empresa-convenio-detail.ts` — `src/features/empresa-convenios/hooks/use-empresa-convenio-detail.ts`
- `use-empresa-convenio-search-params.ts` — `src/features/empresa-convenios/hooks/use-empresa-convenio-search-params.ts`
- `use-empresas-options.ts` — `src/features/empresa-convenios/hooks/use-empresas-options.ts`
- `use-profissoes-options.ts` — `src/features/empresa-convenios/hooks/use-profissoes-options.ts`
- `use-empresa-search-params.ts` — `src/features/empresas/hooks/use-empresa-search-params.ts`
- `use-permissions.ts` — `src/features/permissions/hooks/use-permissions.ts`
- `use-profissao-search-params.ts` — `src/features/profissoes/hooks/use-profissao-search-params.ts`
- `use-regional-search-params.ts` — `src/features/regionais/hooks/use-regional-search-params.ts`
- `use-unidade-prisional-search-params.ts` — `src/features/unidades-prisionais/hooks/use-unidade-prisional-search-params.ts`
- `use-user-search-params.ts` — `src/features/users/hooks/use-user-search-params.ts`
