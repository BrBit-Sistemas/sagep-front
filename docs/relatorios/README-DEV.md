# 🧱 SAGEP Core — Catálogo Técnico de Relatórios
> **Propósito:** Documento técnico e funcional para implementação dos relatórios do **SAGEP Core**.  
> Cada relatório possui:
> - Descrição leiga (para o time de negócio)
> - Campos e tabelas de origem no banco
> - Filtros esperados e critérios de aceite

---

## ⚙️ Padrões Gerais

**Formato de endpoint**
GET /reports/<slug>


**Parâmetros comuns**
| Param | Tipo | Descrição |
|--------|------|------------|
| `limit` | int | tamanho da página (default: 50, max: 200) |
| `offset` | int | início da paginação |
| `mode` | enum[`table`,`chart`,`export`] | modo de retorno |
| `tenant_id` | uuid | obtido via JWT |
| `Authorization` | Bearer Token | obrigatório |

**Modos**
- `table`: retorno completo (listagem)
- `chart`: agrupamentos e KPIs
- `export`: CSV/PDF

**Banco:** PostgreSQL  
**Autorização:** escopo `secretaria → regional → unidade`  
**Status padrão:** 400 (filtro inválido) | 401 (não autenticado) | 403 (sem escopo) | 404 (não encontrado)

---

## 👥 Relatórios Reeducandos

### 1. `/reports/reeducandos`
**Descrição leiga:** lista geral dos reeducandos, com informações cadastrais básicas, regime e escolaridade.  
**Tabela base:** `detentos`

**Campos principais:**
| Campo | Origem | Descrição |
|--------|---------|-----------|
| `nome` | detentos.nome | Nome completo |
| `cpf` | detentos.cpf | CPF do reeducando |
| `prontuario` | detentos.prontuario | Código interno do sistema |
| `data_nascimento` | detentos.data_nascimento | Data de nascimento |
| `regime` | detentos.regime | Regime prisional atual |
| `escolaridade` | detentos.escolaridade | Nível educacional |
| `unidade_id` | detentos.unidade_id → unidades_prisionais.id | Unidade de custódia |
| `mae` | detentos.mae | Nome da mãe |

**Filtros:** `unidade_id`, `regional_id`, `regime`, `status`, `q`  
**Agrupar:** `unidade`, `regional`  
**Aceite:** lista paginada e exportável em csv e pdf.

---

### 3. `/reports/reeducandos-perfil`
**Descrição leiga:** exibe o percentual de reeducandos por regime e escolaridade.  
**Tabelas:** `detentos`  

**Campos:**  
`regime`, `escolaridade`, `quantidade`, `percentual`

**Filtros:** `periodo_ini`, `periodo_fim`, `regional_id`, `unidade_id`  
**Aceite:** soma percentual total = 100%.

---

### 4. `/reports/reeducandos-pendencias`
**Descrição leiga:** mostra reeducandos sem ficha ativa ou com cadastro inativo.  
**Tabelas:** `detentos`, `fichas_cadastrais`

**Campos:**
| Campo | Origem | Descrição |
|--------|---------|-----------|
| `nome` | detentos.nome | Nome do reeducando |
| `cpf` | detentos.cpf | CPF |
| `unidade_prisional` | fichas_cadastrais.unidade_prisional | Unidade associada |
| `status` | fichas_cadastrais.status | Status da ficha |
| `ultima_atualizacao` | fichas_cadastrais.updated_at | Última atualização |

**Filtros:** `unidade_id`, `regional_id`, `status_ficha`  
**Aceite:** ordenado por tempo de pendência.

---

### 5. `/reports/reeducando-dossie`
**Descrição leiga:** ficha socioassistencial completa do reeducando.  
**Tabelas:** `fichas_cadastrais`

**Campos:**  
`nome, cpf, rg, filiacao_mae, filiacao_pai, endereco, telefone, escolaridade, problema_saude, experiencia_profissional, fez_curso_sistema_prisional, ja_trabalhou_funap, profissoes, status`

**Filtro obrigatório:** `reeducando_id`  
**Aceite:** 404 se não encontrado; mascarar dados sensíveis (LGPD).

---

### 6. `/reports/reeducandos-documentacao`
**Descrição leiga:** lista status de anexos/documentos cadastrais (em fichas).  
**Tabelas:** `fichas_cadastrais`

**Campos:**  
`nome, cpf, pdf_path, status, data_assinatura`

**Filtros:** `unidade_id`, `status_arquivo`  
**Aceite:** verificação automática de tipo e tamanho.

---

### 7. `/reports/reeducandos-saude`
**Descrição leiga:** mostra reeducandos com problemas de saúde ou restrições.  
**Tabela:** `fichas_cadastrais`

**Campos:**  
`nome, cpf, tem_problema_saude, problema_saude, unidade_prisional, telefone`

**Filtros:** `unidade_id`, `tipo_restricao`, `status`  
**Aceite:** LGPD aplicado.

---

### 8. `/reports/reeducandos-profissoes`
**Descrição leiga:** apresenta as profissões informadas pelos reeducandos e histórico profissional.  
**Tabelas:** `fichas_cadastrais`, `profissoes`

**Campos:**  
`nome, cpf, profissoes (profissao_01, profissao_02), experiencia_profissional, unidade_prisional`

**Filtros:** `unidade_id`, `profissao`, `regime`  
**Aceite:** campos de origem identificados (`ficha`).

---

### 9. `/reports/reeducandos-movimentacao`
**Descrição leiga:** mostra entradas e saídas mensais de reeducandos.  
**Tabelas:** `fichas_cadastrais` (usar data_assinatura como referência)

**Campos:**  
`mes, entradas, saidas, saldo, unidade_prisional`

**Filtros:** `periodo_ini`, `periodo_fim`, `regional_id`, `unidade_id`  
**Aceite:** série mensal sem buracos.

---

## 💼 Relatórios de Empresas e Convênios

### 10. `/reports/empresas`
**Descrição leiga:** lista de empresas conveniadas.  
**Tabelas:** `empresa_convenios`

**Campos:**  
`empresa_id, tipo_codigo, modalidade_execucao, regimes_permitidos, data_inicio, data_fim, status`

**Filtros:** `status`, `cadastro_ini`, `cadastro_fim`  
**Aceite:** exportação e ordenação por data_fim.

---

### 12. `/reports/convenios`
**Descrição leiga:** mostra os convênios ativos e inativos.  
**Tabela:** `empresa_convenios`

**Campos:**  
`convenio_id, empresa_id, modalidade_execucao, quantitativo_maximo, data_inicio, data_fim, status`

**Filtros:** `status`, `modalidade`, `vig_ini`, `vig_fim`  
**Aceite:** marcar “vence_em_breve” para convênios com `data_fim ≤ 30 dias`.

---

### 13. `/reports/convenios-vagas`
**Descrição leiga:** consolida número de vagas disponíveis por profissão e unidade.  
**Tabela:** `empresa_convenios`

**Campos:**  
`empresa_id, quantitativo_maximo, quantitativos_profissoes (jsonb), regimes_permitidos, status`

**Filtros:** `profissao`, `unidade_id`, `regime`  
**Aceite:** considerar apenas `status = ativo`.

---

### 14. `/reports/convenios-locais`
**Descrição leiga:** detalha os locais de execução de cada convênio.  
**Tabela:** `empresa_convenio_locais`

**Campos:**  
`logradouro, numero, complemento, bairro, cidade, estado, cep, referencia, convenio_id`

**Filtros:** `cidade`, `uf`, `convenio_id`  
**Aceite:** normalização de UF e CEP.

---

### 15. `/reports/capacidade-demanda`
**Descrição leiga:** compara o total de vagas disponíveis com o número de reeducandos aptos.  
**Tabelas:** `empresa_convenios`, `fichas_cadastrais`

**Campos:**  
`profissao, convenio_id, quantitativo_maximo, reeducandos_aptos (count), gap`

**Filtros:** `profissao`, `convenio_id`, `unidade_id`  
**Aceite:** `gap = vagas - aptos`.

---

## 🏛️ Governança e Acesso

### 16. `/reports/estrutura`
**Descrição leiga:** exibe a hierarquia completa do sistema prisional.  
**Tabela:** `unidades_prisionais`

**Campos:**  
`id, nome, secretariaId, regionalId`

**Filtros:** `secretaria_id`, `regional_id`  
**Aceite:** hierarquia completa mesmo sem filtro.

---

---

## 📦 Estrutura de Desenvolvimento

