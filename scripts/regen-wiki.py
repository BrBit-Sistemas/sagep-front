#!/usr/bin/env python3
"""
Regenera a wiki em graphify-out/wiki/ a partir de graphify-out/graph.json
+ graphify-out/GRAPH_REPORT.md.

Adaptado para o stack do admin (React 19 + Vite + MUI + TanStack Query + Zustand).

Uso:  python3 scripts/regen-wiki.py [project_root]
Dependências: stdlib apenas.
"""
import json
import re
import sys
from collections import defaultdict
from pathlib import Path

ROOT = Path(sys.argv[1] if len(sys.argv) > 1 else '.').resolve()
GRAPH = ROOT / 'graphify-out' / 'graph.json'
REPORT = ROOT / 'graphify-out' / 'GRAPH_REPORT.md'
WIKI = ROOT / 'graphify-out' / 'wiki'

if not GRAPH.exists():
    sys.exit(f'ERRO: {GRAPH} não encontrado. Rode /graphify primeiro.')

WIKI.mkdir(parents=True, exist_ok=True)

G = json.loads(GRAPH.read_text())
nodes = {n['id']: n for n in G['nodes']}
edges = G.get('links', G.get('edges', []))

out_edges = defaultdict(list)
in_edges = defaultdict(list)
for e in edges:
    out_edges[e['source']].append(e)
    in_edges[e['target']].append(e)


def classify(sf: str) -> str:
    """Bucket a source file into a wiki section."""
    if not sf:
        return 'other'
    if sf.startswith('src/features/'):
        return 'feature'
    if sf.startswith('src/pages/') or sf.startswith('src/routes/'):
        return 'route'
    if sf.startswith('src/auth/'):
        return 'auth'
    if sf.startswith('src/api/'):
        return 'api'
    if sf.startswith('src/sections/'):
        return 'section'
    if sf.startswith('src/services/'):
        return 'service'
    if sf.endswith('.md'):
        return 'doc'
    return 'other'


def feature_of(sf: str) -> str:
    parts = sf.split('/')
    if len(parts) >= 3 and parts[0] == 'src' and parts[1] == 'features':
        return parts[2]
    return ''


def kind_in_feature(sf: str) -> str:
    parts = sf.split('/')
    # src/features/<feature>/<kind>/...
    if len(parts) >= 4 and parts[0] == 'src' and parts[1] == 'features':
        return parts[3]
    return ''


def is_hook(sf: str, label: str) -> bool:
    return '/hooks/' in sf or Path(sf).stem.startswith('use-') or (label.startswith('use') and label[3:4].isupper())


def is_zustand_store(label: str) -> bool:
    return 'useStore' in label or label.lower().endswith('store') or 'zustand' in label.lower()


def is_page(sf: str, label: str) -> bool:
    return sf.endswith('-page.tsx') or '/pages/' in sf or 'Page' in label


def clean_label(lbl: str) -> str:
    for suf in [
        ' (external)', ' (external ref)', ' (code ref)',
        ' (cross-chunk ref)', ' Entity', ' Page', ' Component',
    ]:
        if lbl.endswith(suf):
            lbl = lbl[: -len(suf)]
    return lbl.strip()


# ---------------------------- indexar por feature/bucket
features = defaultdict(lambda: {'pages': [], 'components': [], 'hooks': [], 'data': [], 'types': [], 'other': []})
routes = []
auth = []
api = []
sections = []
services = []
docs = []

for n in G['nodes']:
    sf = n.get('source_file') or ''
    lbl = n.get('label', '')
    b = classify(sf)
    if b == 'feature':
        feat = feature_of(sf)
        kind = kind_in_feature(sf)
        bucket = 'pages' if kind == 'pages' else \
                 'components' if kind == 'components' else \
                 'hooks' if kind == 'hooks' else \
                 'data' if kind == 'data' else \
                 'types' if kind == 'types' else 'other'
        features[feat][bucket].append(n)
    elif b == 'route':
        routes.append(n)
    elif b == 'auth':
        auth.append(n)
    elif b == 'api':
        api.append(n)
    elif b == 'section':
        sections.append(n)
    elif b == 'service':
        services.append(n)
    elif b == 'doc':
        docs.append(n)


# Unique by source_file for each feature bucket (one entry per file, not per symbol)
def dedupe_by_file(nlist):
    by_sf = {}
    for n in nlist:
        sf = n.get('source_file') or ''
        # prefer the node whose label matches the filename stem (usually the component/hook itself)
        stem = Path(sf).stem
        cur = by_sf.get(sf)
        lbl = n.get('label', '')
        score = 2 if (stem.lower().replace('-', '') in lbl.lower().replace(' ', '').replace('-', '')) else 1
        if not cur or score > cur[1]:
            by_sf[sf] = (n, score)
    return [v[0] for v in by_sf.values()]


for f in features:
    for k in features[f]:
        features[f][k] = dedupe_by_file(features[f][k])


# ---------------------------- hyperedges from report
hyperedges_raw = []
if REPORT.exists():
    in_he = False
    for line in REPORT.read_text().splitlines():
        if line.startswith('## Hyperedges'):
            in_he = True
            continue
        if in_he:
            if line.startswith('## '):
                break
            if line.startswith('- **'):
                hyperedges_raw.append(line)


# ---------------------------- index.md
stats_nodes = len(G['nodes'])
stats_edges = len(edges)
communities = {n.get('community') for n in G['nodes'] if n.get('community') is not None}

# Find top God nodes from degree
degree = defaultdict(int)
for e in edges:
    degree[e['source']] += 1
    degree[e['target']] += 1
gods = sorted(G['nodes'], key=lambda n: -degree[n['id']])[:10]

DOMAIN_FEATURES = {
    'detento': 'Cadastro de reeducandos, ficha cadastral, histórico.',
    'empresa-convenios': 'Convênios de trabalho: raiz do agregado + vagas, responsáveis, tabelas de produtividade, templates de contrato.',
    'empresas': 'CRUD de empresas conveniadas.',
    'profissoes': 'Catálogo de profissões compartilhado.',
    'trabalho-penal': 'Execução do trabalho: contratos, apuração, folha.',
    'telao-vagas-fila': 'Telão de fila de reeducandos e alocação de vagas.',
    'regionais': 'CRUD tenant de regionais.',
    'unidades-prisionais': 'CRUD tenant de unidades prisionais.',
    'secretarias': 'CRUD tenant de secretarias (topo da hierarquia).',
    'users': 'Gestão de usuários do sistema.',
    'permissions': 'Roles e permissões (RBAC).',
    'artigos-penais': 'Catálogo de artigos penais (proxy ThereTech).',
    'dashboard': 'Métricas agregadas para telas de visão gerencial.',
    'configuracoes': 'Configurações gerais do admin.',
}

index = f"""# SAGEP-DF Admin — Wiki

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
""" + '\n'.join(f"| [`{f}`](features.md#{f}) | {DOMAIN_FEATURES.get(f, '_(feature)_')} |" for f in sorted(features.keys())) + f"""

## God nodes (pontos de maior acoplamento)

| Nó | Edges | Arquivo |
|---|---:|---|
""" + '\n'.join(f"| `{clean_label(g['label'])}` | {degree[g['id']]} | `{g.get('source_file','')}` |" for g in gods) + f"""

## Estado do grafo

- **{stats_nodes:,}** nós · **{stats_edges:,}** edges · **{len(communities)}** comunidades
- Extração: AST (TypeScript) + análise semântica (subagentes LLM)
- **Escopo deste build**: `src/features/`, `src/pages/`, `src/routes/`, `src/api/`, `src/auth/`, `src/sections/`, `src/services/` + docs root. Excluídos: `src/components/` (UI genérico minimal-kit), `src/layouts/`, `src/utils/`, `src/lib/`, `src/types/`, `src/constants/` e entrypoints.
"""
(WIKI / 'index.md').write_text(index)


# ---------------------------- features.md
def short_path(sf: str) -> str:
    # trim common prefix
    return sf.replace('src/features/', '')


def node_line(n) -> str:
    lbl = clean_label(n.get('label', ''))
    sf = n.get('source_file', '')
    return f"- `{lbl}` — `{short_path(sf)}`"


feat_md = ["# Features", "",
           "← [index](index.md) · [routes](routes.md) · [api](api.md) · [auth](auth.md) · [hooks](hooks.md) · [flows](flows.md)",
           "",
           f"{len(features)} features de domínio em `src/features/<feature>/`. Cada feature segue o padrão `components/`, `hooks/` (TanStack Query + stores Zustand), `data/` (schemas Zod + mappers), `pages/`, `types/`.",
           ""]

for feat in sorted(features.keys()):
    data = features[feat]
    feat_md.append(f"## {feat}")
    feat_md.append("")
    desc = DOMAIN_FEATURES.get(feat)
    if desc:
        feat_md.append(f"_{desc}_")
        feat_md.append("")
    for label, key in [('Pages', 'pages'), ('Components', 'components'),
                       ('Hooks', 'hooks'), ('Data (schemas/mappers)', 'data'),
                       ('Types', 'types'), ('Outros', 'other')]:
        items = data[key]
        if not items:
            continue
        feat_md.append(f"**{label}** ({len(items)})")
        feat_md.append("")
        for n in sorted(items, key=lambda x: x.get('source_file', '')):
            feat_md.append(node_line(n))
        feat_md.append("")

(WIKI / 'features.md').write_text('\n'.join(feat_md))


# ---------------------------- routes.md
routes_md = ["# Routes & Layouts", "",
             "← [index](index.md) · [features](features.md) · [api](api.md) · [auth](auth.md) · [hooks](hooks.md) · [flows](flows.md)",
             "",
             f"{len(routes)} nós em `src/pages/` + `src/routes/` — entrypoints de rota, rotas aninhadas e layouts.",
             ""]

pages_nodes = [n for n in routes if 'src/pages/' in n.get('source_file', '')]
routes_nodes = [n for n in routes if 'src/routes/' in n.get('source_file', '')]

routes_md.append(f"## `src/routes/` ({len(routes_nodes)})")
routes_md.append("")
for n in sorted(routes_nodes, key=lambda x: x.get('source_file', '')):
    routes_md.append(f"- `{clean_label(n['label'])}` — `{n.get('source_file','')}`")
routes_md.append("")
routes_md.append(f"## `src/pages/` ({len(pages_nodes)})")
routes_md.append("")
for n in sorted(pages_nodes, key=lambda x: x.get('source_file', '')):
    routes_md.append(f"- `{clean_label(n['label'])}` — `{n.get('source_file','')}`")

(WIKI / 'routes.md').write_text('\n'.join(routes_md))


# ---------------------------- api.md
api_md = ["# API Clients", "",
          "← [index](index.md) · [features](features.md) · [routes](routes.md) · [auth](auth.md) · [hooks](hooks.md) · [flows](flows.md)",
          "",
          f"{len(api)} nós em `src/api/` — clients HTTP gerados pelo **Orval** a partir do OpenAPI do back-end + wrappers.",
          "",
          "**Convenção (Orval v7):** cada endpoint vira uma `factory` (request) + um `hook` (TanStack Query). Tipos `*Dto` / `*Body` / `*Params` também gerados.",
          ""]

by_dir = defaultdict(list)
for n in api:
    sf = n.get('source_file', '')
    parts = sf.split('/')
    d = parts[2] if len(parts) >= 3 else 'raiz'
    by_dir[d].append(n)

for d in sorted(by_dir.keys()):
    api_md.append(f"## `src/api/{d}/`")
    api_md.append("")
    for n in sorted(by_dir[d], key=lambda x: x.get('source_file', '')):
        api_md.append(f"- `{clean_label(n['label'])}` — `{n.get('source_file','')}`")
    api_md.append("")

(WIKI / 'api.md').write_text('\n'.join(api_md))


# ---------------------------- auth.md
auth_md = ["# Auth", "",
           "← [index](index.md) · [features](features.md) · [routes](routes.md) · [api](api.md) · [hooks](hooks.md) · [flows](flows.md)",
           "",
           f"{len(auth)} nós em `src/auth/`. Estratégia JWT com `AuthContext` + `AuthProvider` + guards (`AuthGuard`, `GuestGuard`, `PermissionGuard`).",
           "",
           "## Fluxo de login",
           "",
           "```",
           "JwtSignInView → signInWithPassword()  → POST /auth/login",
           "                ↓",
           "                setSession(token)      → salva em STORAGE_KEY + injeta no axios",
           "                ↓",
           "                AuthContext.checkUserSession()  → GET /auth/me → preenche usuário",
           "                ↓",
           "                AuthGuard libera rotas protegidas",
           "```",
           "",
           "## Guards",
           "",
           "- **AuthGuard** — bloqueia se `!user`; redireciona para `/auth/jwt/sign-in` preservando `returnTo`.",
           "- **GuestGuard** — inverso; usado em rotas públicas (`/auth/*`).",
           "- **PermissionGuard** — verifica permissão CASL-like via `usePermissionCheck()`.",
           "",
           "## Arquivos",
           ""]

auth_by_dir = defaultdict(list)
for n in auth:
    sf = n.get('source_file', '')
    parts = sf.split('/')
    d = parts[2] if len(parts) >= 3 else 'raiz'
    auth_by_dir[d].append(n)

for d in sorted(auth_by_dir.keys()):
    auth_md.append(f"### `src/auth/{d}/`")
    auth_md.append("")
    for n in sorted(auth_by_dir[d], key=lambda x: x.get('source_file', '')):
        auth_md.append(f"- `{clean_label(n['label'])}` — `{n.get('source_file','')}`")
    auth_md.append("")

(WIKI / 'auth.md').write_text('\n'.join(auth_md))


# ---------------------------- hooks.md
# Collect all hook-like nodes across features
all_hooks = []
for feat in features.values():
    all_hooks.extend(feat['hooks'])

# Classify hook by pattern
def hook_kind(n):
    lbl = clean_label(n.get('label', '')).lower()
    sf = n.get('source_file', '')
    if 'keys' in Path(sf).stem:
        return 'Query Keys'
    if lbl.startswith('use') and 'suspense' in lbl:
        return 'Suspense Query'
    if 'mutation' in lbl or Path(sf).stem.startswith(('use-create', 'use-update', 'use-delete', 'use-activate', 'use-deactivate')):
        return 'Mutations'
    if Path(sf).stem.startswith('use-') and ('list' in Path(sf).stem or 'get' in Path(sf).stem or 'read' in Path(sf).stem):
        return 'Queries'
    if 'store' in lbl or 'store' in Path(sf).stem:
        return 'Zustand Stores'
    return 'Outros'


hook_groups = defaultdict(list)
for n in all_hooks:
    hook_groups[hook_kind(n)].append(n)

hooks_md = ["# Hooks", "",
            "← [index](index.md) · [features](features.md) · [routes](routes.md) · [api](api.md) · [auth](auth.md) · [flows](flows.md)",
            "",
            f"{len(all_hooks)} hooks customizados nas features. Convenções:",
            "",
            "- `keys.ts` — factories de query keys por feature (ex.: `empresaKeys.list(params)`).",
            "- `use-<feature>-list.ts` — lista paginada (TanStack `useQuery`).",
            "- `use-read-<feature>.ts` / `use-suspense-read-<feature>.ts` — leitura única por id, variante `Suspense` para rotas com `<Suspense>` + `<Await>`.",
            "- `use-create-<feature>.ts` / `use-update-<feature>.ts` / `use-delete-<feature>.ts` — mutations com invalidação automática de keys.",
            "- `use-<feature>-cadastro-store.ts` — store Zustand local à feature (estado transitório de formulário).",
            ""]

for kind in ['Query Keys', 'Queries', 'Suspense Query', 'Mutations', 'Zustand Stores', 'Outros']:
    items = hook_groups.get(kind, [])
    if not items:
        continue
    hooks_md.append(f"## {kind} ({len(items)})")
    hooks_md.append("")
    for n in sorted(items, key=lambda x: x.get('source_file', '')):
        hooks_md.append(f"- `{clean_label(n['label'])}` — `{n.get('source_file','')}`")
    hooks_md.append("")

(WIKI / 'hooks.md').write_text('\n'.join(hooks_md))


# ---------------------------- flows.md
flows_md = ["# Flows", "",
            "← [index](index.md) · [features](features.md) · [routes](routes.md) · [api](api.md) · [auth](auth.md) · [hooks](hooks.md)",
            "",
            "Fluxos de negócio e padrões recorrentes extraídos dos hyperedges + edges do grafo.",
            "",
            "## 1. Fluxo CRUD padrão (todas as features)",
            "",
            "```",
            "Listagem → DataGrid (<feature>-list-page.tsx)",
            "   ↓ row click / edit",
            "Dialog (<feature>-form-dialog.tsx) com React Hook Form + Zod",
            "   ↓ submit",
            "use-create-<feature> / use-update-<feature> (mutation TanStack Query)",
            "   ↓ success",
            "invalidateQueries(keys.list) + toast (sonner)",
            "```",
            "",
            "**Artefatos por feature:**",
            "",
            "| Arquivo | Papel |",
            "|---|---|",
            "| `data/schemas.ts` | Zod schema de form |",
            "| `data/mappers.ts` | `xToFormValues` / `fromApi` / `serializeDto` |",
            "| `hooks/keys.ts` | factories de query keys |",
            "| `hooks/use-*-list.ts` | query paginada |",
            "| `hooks/use-read-*.ts` | detalhe |",
            "| `hooks/use-create-*.ts` / `use-update-*.ts` | mutations |",
            "| `components/*-form-dialog.tsx` | form |",
            "| `components/*-delete-dialog.tsx` | confirmação destrutiva |",
            "| `pages/*-list-page.tsx` | listagem |",
            "| `pages/*-cadastro-page.tsx` | criação/edição |",
            "",
            "## 2. Auth — login JWT",
            "",
            "Ver [auth.md](auth.md) para detalhes.",
            "",
            "## 3. Convênio de trabalho (feature central)",
            "",
            "A feature `empresa-convenios` é o agregado mais complexo do admin. Estruturada em abas:",
            "",
            "- **Identificação** — data, vigência, template de contrato",
            "- **Vagas & Profissões** — distribuição de vagas por profissão (`ConvenioProfissaoAutocomplete`)",
            "- **Locais** — locais físicos de execução",
            "- **Responsáveis** — pessoas responsáveis (RH da empresa)",
            "- **Benefícios** — bônus, seguro, auxílio",
            "- **Tabela de produtividade** — regras de cálculo de remuneração",
            "- **Preview do contrato** — `useContratoPreview()` → PDF renderizado",
            "",
            "### Schemas Zod",
            "",
            "- `buildEmpresaConvenioSchema()` — schema dinâmico que reflete template escolhido",
            "- `clearEmpresaConvenioFieldsHiddenByTemplate()` — limpa campos desabilitados antes de enviar",
            "- `defaultDistribuicaoProfissoesForm()` / `defaultResponsaveisForm()` — estados iniciais por template",
            "- `empresaConvenioToFormValues()` — reidrata da API pro form",
            "",
            "### Store Zustand",
            "",
            "`useEmpresaConvenioCadastroStore` guarda aba ativa + estado transitório entre navegações.",
            "",
            "## 4. Ficha Cadastral do Reeducando",
            "",
            "Feature `detento` gerencia a candidatura do reeducando a vagas:",
            "",
            "- `DetentoFichaCadastralForm` (tab) — dados pessoais, endereço, escolaridade, profissão",
            "- `ArticlesSelector` — seleciona artigos penais aplicáveis (via proxy `/artigos-penais`)",
            "- `use-create-detento-ficha-cadastral` — upload de documentos PDF + dados",
            "- Status: AGUARDANDO_VALIDACAO → VALIDADO → FILA_DISPONIVEL (máquina de estados no back-end)",
            "",
            "## 5. Matching / Telão de Vagas",
            "",
            "Feature `telao-vagas-fila` exibe a fila de reeducandos candidatos às vagas:",
            "",
            "- **Algoritmo 70 FIFO / 30 CEP** (ver docs em `src/sections/sagep-docs/`) — 70% ordena por data, 30% por proximidade",
            "- Blacklist + FUNAP + CNJ SEEU influenciam elegibilidade",
            "- `MatchingDemoSectionInteractive` exibe calculadora didática do score",
            "",
            "## 6. Hyperedges (agrupamentos 3+ nós do grafo)",
            ""]

for line in hyperedges_raw:
    flows_md.append(line)
flows_md.append("")

(WIKI / 'flows.md').write_text('\n'.join(flows_md))


# ---------------------------- summary
total_bytes = sum((WIKI / f'{n}.md').stat().st_size for n in ['index', 'features', 'routes', 'api', 'auth', 'hooks', 'flows'])
print(f'Wiki regenerada: 7 arquivos, {total_bytes:,} bytes em {WIKI}')
