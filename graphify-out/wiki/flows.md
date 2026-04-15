# Flows

← [index](index.md) · [features](features.md) · [routes](routes.md) · [api](api.md) · [auth](auth.md) · [hooks](hooks.md)

Fluxos de negócio e padrões recorrentes extraídos dos hyperedges + edges do grafo.

## 1. Fluxo CRUD padrão (todas as features)

```
Listagem → DataGrid (<feature>-list-page.tsx)
   ↓ row click / edit
Dialog (<feature>-form-dialog.tsx) com React Hook Form + Zod
   ↓ submit
use-create-<feature> / use-update-<feature> (mutation TanStack Query)
   ↓ success
invalidateQueries(keys.list) + toast (sonner)
```

**Artefatos por feature:**

| Arquivo | Papel |
|---|---|
| `data/schemas.ts` | Zod schema de form |
| `data/mappers.ts` | `xToFormValues` / `fromApi` / `serializeDto` |
| `hooks/keys.ts` | factories de query keys |
| `hooks/use-*-list.ts` | query paginada |
| `hooks/use-read-*.ts` | detalhe |
| `hooks/use-create-*.ts` / `use-update-*.ts` | mutations |
| `components/*-form-dialog.tsx` | form |
| `components/*-delete-dialog.tsx` | confirmação destrutiva |
| `pages/*-list-page.tsx` | listagem |
| `pages/*-cadastro-page.tsx` | criação/edição |

## 2. Auth — login JWT

Ver [auth.md](auth.md) para detalhes.

## 3. Convênio de trabalho (feature central)

A feature `empresa-convenios` é o agregado mais complexo do admin. Estruturada em abas:

- **Identificação** — data, vigência, template de contrato
- **Vagas & Profissões** — distribuição de vagas por profissão (`ConvenioProfissaoAutocomplete`)
- **Locais** — locais físicos de execução
- **Responsáveis** — pessoas responsáveis (RH da empresa)
- **Benefícios** — bônus, seguro, auxílio
- **Tabela de produtividade** — regras de cálculo de remuneração
- **Preview do contrato** — `useContratoPreview()` → PDF renderizado

### Schemas Zod

- `buildEmpresaConvenioSchema()` — schema dinâmico que reflete template escolhido
- `clearEmpresaConvenioFieldsHiddenByTemplate()` — limpa campos desabilitados antes de enviar
- `defaultDistribuicaoProfissoesForm()` / `defaultResponsaveisForm()` — estados iniciais por template
- `empresaConvenioToFormValues()` — reidrata da API pro form

### Store Zustand

`useEmpresaConvenioCadastroStore` guarda aba ativa + estado transitório entre navegações.

## 4. Ficha Cadastral do Reeducando

Feature `detento` gerencia a candidatura do reeducando a vagas:

- `DetentoFichaCadastralForm` (tab) — dados pessoais, endereço, escolaridade, profissão
- `ArticlesSelector` — seleciona artigos penais aplicáveis (via proxy `/artigos-penais`)
- `use-create-detento-ficha-cadastral` — upload de documentos PDF + dados
- Status: AGUARDANDO_VALIDACAO → VALIDADO → FILA_DISPONIVEL (máquina de estados no back-end)

## 5. Matching / Telão de Vagas

Feature `telao-vagas-fila` exibe a fila de reeducandos candidatos às vagas:

- **Algoritmo 70 FIFO / 30 CEP** (ver docs em `src/sections/sagep-docs/`) — 70% ordena por data, 30% por proximidade
- Blacklist + FUNAP + CNJ SEEU influenciam elegibilidade
- `MatchingDemoSectionInteractive` exibe calculadora didática do score

## 6. Hyperedges (agrupamentos 3+ nós do grafo)

- **Convenio Contrato Preview Composition** — convenios_getEmpresaConvenios, convenios_contrato_preview, catalog_template_contrato_dto, catalog_tabela_produtividade_dto [EXTRACTED 0.95]
- **Telão Vagas Fila Matching Flow** — telao_getTelaoVagasFila, telao_vaga, telao_fila_item, telao_reservar, telao_alocar [EXTRACTED 0.90]
- **Auth + RBAC Permissions Stack** — autenticacao_getAutenticacao, permissions_getPermissionsApi, permissions_role_dto, permissions_permission_dto, usuarios_getUsuarios [INFERRED 0.85]
- **JWT session lifecycle flow** — utils_setSession, utils_jwtDecode, utils_tokenExpired, constant_JWT_STORAGE_KEY [INFERRED 0.90]
- **React auth provider context pattern** — auth_context_AuthContext, auth_provider_AuthProvider, use_auth_context_hook, types_AuthTypes [INFERRED 0.90]
- **Route guard family** — auth_guard_AuthGuard, guest_guard_GuestGuard, permission_guard_PermissionGuard, role_based_guard_RoleBasedGuard [INFERRED 0.85]
- **Detento details page flow (cover + tabs)** — detento_detalhes, detento_detalhes_cover, detento_details_tab, detento_ficha_cadastral_tab [EXTRACTED 0.90]
- **Ficha cadastral CRUD flow** — ficha_cadastral_card, ficha_cadastral_add_card, ficha_cadastral_dialog_form, ficha_inativa_selector, detento_service [INFERRED 0.85]
- **Detento cadastro flow (form + delete + hook + service)** — detento_form_dialog, detento_delete_dialog, use_create_detento, detento_service, detento_keys [INFERRED 0.85]
- **Detento list page flow** — DetentoCadastroPage, useDetentoList, useDetentoListTable, useDetentoSearchParams, useDetentoCadastroStore [EXTRACTED 0.95]
- **Detento react-query hooks sharing detentoKeys + detentoService** — useDetentoList, useReadDetentoDetails, useGetDetentoFichasCadastrais, useGetDetentoFichasInativas, useUpdateDetento, useDeleteDetento [INFERRED 0.90]
- **Ficha cadastral form page flow** — DetentoFichaCadastralFormPage, useSuspenseReadDetentoDetails, useSuspenseGetDetentoFichasCadastrais, DetentoFichaCadastralForm, createDetentoFichaCadastralBaseSchema [EXTRACTED 0.90]
- **Convenio CRUD mutations sharing invalidation key** — hook:useCreateEmpresaConvenio, hook:useUpdateEmpresaConvenio, hook:useDeleteEmpresaConvenio, obj:empresaConvenioKeys, svc:empresaConvenioService [EXTRACTED 0.95]
- **Convenio form page orchestrates hooks, schema and catalogs** — page:ConvenioFormPage, hook:useCreateEmpresaConvenio, hook:useUpdateEmpresaConvenio, hook:useEmpresaConvenioDetail, hook:useTemplateContratosCatalog, hook:useTabelasProdutividadeCatalog, schema:empresaConvenioSchemas [EXTRACTED 0.90]
- **Empresa cadastro dialogs share store and CRUD hooks** — comp:EmpresaDeleteDialog, comp:EmpresaFormDialog, store:useEmpresaCadastroStore, hook:useDeleteEmpresa, hook:useCreateEmpresa, hook:useUpdateEmpresa [EXTRACTED 0.90]
- **Empresas CRUD cluster** — empresas:use-create-empresa, empresas:use-update-empresa, empresas:use-delete-empresa, empresas:use-empresa-list, empresas:service:external [EXTRACTED 0.95]
- **Empresa cadastro page composition** — empresas:page:cadastro, empresas:use-empresa-list, empresas:use-empresa-list-table, empresas:use-empresa-search-params, empresas:store [EXTRACTED 0.95]
- **Permissions management UI** — permissions:page, permissions:data, permissions:use-list-roles, permissions:use-permissions, permissions:api:external [EXTRACTED 0.90]
- **Profissao CRUD mutations share service + keys** — profissoes.hooks.useDeleteProfissao, profissoes.hooks.useUpdateProfissao, external.profissaoService, external.profissaoKeys [INFERRED 0.90]
- **Regional CRUD hooks over regionalService** — regionais.hooks.useCreateRegional, regionais.hooks.useUpdateRegional, regionais.hooks.useDeleteRegional, regionais.hooks.useListRegionais, regionais.data.regionalService, regionais.hooks.regionalKeys [EXTRACTED 1.00]
- **ProfissaoCadastroPage composition** — profissoes.pages.cadastro.ProfissaoCadastroPage, profissoes.hooks.useListProfissoes, profissoes.hooks.useProfissaoListTable, profissoes.hooks.useProfissaoSearchParams, profissoes.stores.index.useProfissaoCadastroStore [EXTRACTED 1.00]
- **Unidade Prisional CRUD feature** — unidade_prisional_cadastro_page, unidade_prisional_form_dialog, unidade_prisional_delete_dialog, use_create_unidade_prisional, use_update_unidade_prisional, use_delete_unidade_prisional, use_unidade_prisional_list, unidade_prisional_service, use_unidade_prisional_cadastro_store [EXTRACTED 0.95]
- **Regional cadastro module** — regional_cadastro_page, use_regional_cadastro_store, create_regional_schema, update_regional_schema, regional_type [EXTRACTED 0.90]
- **User form hierarchy (secretaria -> regional -> unidade)** — user_form_dialog, regional_type, unidade_prisional_type, use_unidade_prisional_list [INFERRED 0.80]
- **User CRUD mutations cluster** — users_hooks_useCreateUser, users_hooks_useUpdateUser, users_hooks_useDeleteUser, users_data_service, users_hooks_keys_userKeys [INFERRED 0.90]
- **User cadastro feature composition** — users_pages_cadastro, users_hooks_useUserList, users_hooks_useUserListTable, users_hooks_useUserSearchParams, users_stores_useUserCadastroStore, users_helper_userToFormValues [INFERRED 0.85]
- **Dashboard placeholder pages** — page_dashboard_two, page_dashboard_three, page_dashboard_four, page_dashboard_five, page_dashboard_six, ext_BlankView [INFERRED 0.80]
- **React Router custom hooks suite** — use_params, use_pathname, use_router, use_search_params [EXTRACTED 0.95]
- **Application route tree composition** — routes_section, auth_routes, dashboard_routes [EXTRACTED 0.95]
- **Error pages and views aggregate** — page_401, page_404, not_found_view, unauthorized_view, error_boundary [INFERRED 0.85]
- **Novo Super SAGEP Landing Page Composition** — nss_view, nss_hero_section, nss_journey_section, nss_stats_section, nss_use_cases_section, nss_features_section, nss_modules_section, nss_integrations_section, nss_tech_stack_section, nss_roadmap_section, nss_cta_section [EXTRACTED 1.00]
- **SAGEP Docs Landing Page Sections** — docs_hero_section, docs_how_it_works_section, docs_matching_demo, docs_matching_demo_interactive, docs_metrics_section, docs_faq_section, docs_cta_section [EXTRACTED 1.00]
- **Matching Algorithm Conceptual Cluster** — concept_matching_algorithm, fn_calcular_score, docs_matching_demo_interactive, docs_matching_demo, docs_faq_section, docs_how_it_works_section [INFERRED 0.85]
- **DocumentacaoView aggregates 7 flow sections as tab pages** — documentacao-view, vagas-flow-section, matching-flow-section, blacklist-flow-section, regras-negocio-section, ocorrencias-flow-section, ficha-cadastral-flow-section, empresas-convenios-flow-section [EXTRACTED 1.00]
- **SAGEP landing docs sections (overview, tech stack, use cases)** — overview-section, tech-stack-section, use-cases-section [INFERRED 0.80]
- **Matching domain entities (FC + Vaga + Convenio + Blacklist + Algorithm)** — concept-matching-algorithm, concept-ficha-cadastral, concept-vaga, concept-convenio, concept-blacklist [INFERRED 0.85]
