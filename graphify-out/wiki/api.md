# API Clients

← [index](index.md) · [features](features.md) · [routes](routes.md) · [auth](auth.md) · [hooks](hooks.md) · [flows](flows.md)

79 nós em `src/api/` — clients HTTP gerados pelo **Orval** a partir do OpenAPI do back-end + wrappers.

**Convenção (Orval v7):** cada endpoint vira uma `factory` (request) + um `hook` (TanStack Query). Tipos `*Dto` / `*Body` / `*Params` também gerados.

## `src/api/autenticação/`

- `autenticação.ts` — `src/api/autenticação/autenticação.ts`
- `getAutenticação()` — `src/api/autenticação/autenticação.ts`
- `getAutenticação factory` — `src/api/autenticação/autenticação.ts`
- `auth/login endpoint` — `src/api/autenticação/autenticação.ts`
- `auth/me endpoint` — `src/api/autenticação/autenticação.ts`
- `auth/roles paginate` — `src/api/autenticação/autenticação.ts`
- `auth/change-password` — `src/api/autenticação/autenticação.ts`

## `src/api/dashboard/`

- `dashboard.ts` — `src/api/dashboard/dashboard.ts`
- `getDashboard()` — `src/api/dashboard/dashboard.ts`
- `getDashboard factory` — `src/api/dashboard/dashboard.ts`
- `DashboardMetricsDto` — `src/api/dashboard/dashboard.ts`

## `src/api/detentos/`

- `detentos.ts` — `src/api/detentos/detentos.ts`
- `getDetentos()` — `src/api/detentos/detentos.ts`
- `getDetentos factory` — `src/api/detentos/detentos.ts`
- `ReadDetentoDto` — `src/api/detentos/detentos.ts`

## `src/api/empresa-convenios/`

- `convenioContratoCatalog` — `src/api/empresa-convenios/convenio-contrato-catalog`
- `convenio-contrato-catalog.ts` — `src/api/empresa-convenios/convenio-contrato-catalog.ts`
- `getConvenioContratoCatalog()` — `src/api/empresa-convenios/convenio-contrato-catalog.ts`
- `getConvenioContratoCatalog` — `src/api/empresa-convenios/convenio-contrato-catalog.ts`
- `ReadTemplateContratoDto` — `src/api/empresa-convenios/convenio-contrato-catalog.ts`
- `ReadTabelaProdutividadeDto` — `src/api/empresa-convenios/convenio-contrato-catalog.ts`
- `CodigoTemplateContrato enum` — `src/api/empresa-convenios/convenio-contrato-catalog.ts`
- `convenio-enums.ts` — `src/api/empresa-convenios/convenio-enums.ts`
- `NivelRemuneracao enum` — `src/api/empresa-convenios/convenio-enums.ts`
- `TipoCalculoRemuneracao enum` — `src/api/empresa-convenios/convenio-enums.ts`
- `ResponsavelBeneficio enum` — `src/api/empresa-convenios/convenio-enums.ts`
- `empresaConvenios.getContratoPreview` — `src/api/empresa-convenios/empresa-convenios`
- `empresa-convenios.ts` — `src/api/empresa-convenios/empresa-convenios.ts`
- `getEmpresaConvenios()` — `src/api/empresa-convenios/empresa-convenios.ts`
- `getEmpresaConvenios factory` — `src/api/empresa-convenios/empresa-convenios.ts`
- `CreateEmpresaConvenioDto` — `src/api/empresa-convenios/empresa-convenios.ts`
- `ContratoPreviewDto` — `src/api/empresa-convenios/empresa-convenios.ts`
- `getContratoPreview endpoint` — `src/api/empresa-convenios/empresa-convenios.ts`

## `src/api/empresas/`

- `getEmpresas` — `src/api/empresas/empresas`
- `empresas.ts` — `src/api/empresas/empresas.ts`
- `getEmpresas()` — `src/api/empresas/empresas.ts`
- `getEmpresas factory` — `src/api/empresas/empresas.ts`
- `ReadEmpresaDto` — `src/api/empresas/empresas.ts`

## `src/api/fichas-cadastrais.ts/`

- `fichas-cadastrais.ts` — `src/api/fichas-cadastrais.ts`
- `getFichasCadastrais()` — `src/api/fichas-cadastrais.ts`
- `getFichasCadastrais factory` — `src/api/fichas-cadastrais.ts`
- `uploadDocumento multipart` — `src/api/fichas-cadastrais.ts`
- `findInativasByDetento` — `src/api/fichas-cadastrais.ts`

## `src/api/generated.schemas/`

- `ReadUsuarioDto` — `src/api/generated.schemas`

## `src/api/generated.schemas.ts/`

- `generated.schemas.ts` — `src/api/generated.schemas.ts`

## `src/api/health/`

- `health.ts` — `src/api/health/health.ts`
- `getHealth()` — `src/api/health/health.ts`
- `getHealth factory` — `src/api/health/health.ts`

## `src/api/permissions/`

- `permissions.ts` — `src/api/permissions/permissions.ts`
- `getPermissionsApi()` — `src/api/permissions/permissions.ts`
- `getPermissionsApi factory` — `src/api/permissions/permissions.ts`
- `RoleDto` — `src/api/permissions/permissions.ts`
- `PermissionDto` — `src/api/permissions/permissions.ts`
- `updateUserRoles endpoint` — `src/api/permissions/permissions.ts`
- `getPermissionsApi (orval)` — `src/api/permissions/permissions.ts`

## `src/api/profissoes/`

- `getProfissoes` — `src/api/profissoes/profissoes`
- `profissoes.ts` — `src/api/profissoes/profissoes.ts`
- `getProfissoes()` — `src/api/profissoes/profissoes.ts`
- `getProfissoes factory` — `src/api/profissoes/profissoes.ts`

## `src/api/regionais/`

- `getRegionais API` — `src/api/regionais/regionais`
- `regionais.ts` — `src/api/regionais/regionais.ts`
- `getRegionais()` — `src/api/regionais/regionais.ts`
- `getRegionais factory` — `src/api/regionais/regionais.ts`

## `src/api/telao-vagas-fila/`

- `telao-vagas-fila.ts` — `src/api/telao-vagas-fila/telao-vagas-fila.ts`
- `getTelaoVagasFila()` — `src/api/telao-vagas-fila/telao-vagas-fila.ts`
- `getTelaoVagasFila factory` — `src/api/telao-vagas-fila/telao-vagas-fila.ts`
- `TelaoVagasFilaResponse` — `src/api/telao-vagas-fila/telao-vagas-fila.ts`
- `VagaTelao` — `src/api/telao-vagas-fila/telao-vagas-fila.ts`
- `FilaItemTelao` — `src/api/telao-vagas-fila/telao-vagas-fila.ts`
- `reservar vaga endpoint` — `src/api/telao-vagas-fila/telao-vagas-fila.ts`
- `alocar vaga endpoint` — `src/api/telao-vagas-fila/telao-vagas-fila.ts`
- `pular fila endpoint` — `src/api/telao-vagas-fila/telao-vagas-fila.ts`

## `src/api/unidades-prisionais/`

- `unidades-prisionais.ts` — `src/api/unidades-prisionais/unidades-prisionais.ts`
- `getUnidadesPrisionais()` — `src/api/unidades-prisionais/unidades-prisionais.ts`
- `getUnidadesPrisionais factory` — `src/api/unidades-prisionais/unidades-prisionais.ts`

## `src/api/usuários/`

- `getUsuários API client` — `src/api/usuários/usuários`
- `usuários.ts` — `src/api/usuários/usuários.ts`
- `getUsuários()` — `src/api/usuários/usuários.ts`
- `getUsuários factory` — `src/api/usuários/usuários.ts`
