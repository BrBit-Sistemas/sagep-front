import type { CrudService } from 'src/types';
import type { EmpresaConvenio, EmpresaConvenioListParams } from '../types';
import type { CreateEmpresaConvenioSchema, UpdateEmpresaConvenioSchema } from '../schemas';

import {
  getEmpresaConvenios,
  type ReadEmpresaConvenioDto,
  type CreateEmpresaConvenioDto,
  type EmpresaConvenioMetricsDto,
  type PaginateEmpresaConvenioDto,
  type CreateConvenioDistribuicaoProfissaoDto,
} from 'src/api/empresa-convenios/empresa-convenios';

export const regimesOptions = [
  { value: '1', label: 'Fechado' },
  { value: '2', label: 'Semiaberto' },
  { value: '3', label: 'Aberto' },
  { value: '4', label: 'Livramento Condicional' },
  { value: '5', label: 'CIME' },
];

const artigoDescricao: Record<number, string> = {
  121: 'Homicídio',
  122: 'Induzimento/instigação/auxílio a suicídio',
  123: 'Infanticídio',
  124: 'Aborto provocado pela gestante ou com seu consentimento',
  125: 'Aborto provocado por terceiro sem consentimento',
  126: 'Aborto provocado por terceiro com consentimento',
  127: 'Aborto qualificado',
  128: 'Aborto permitido em lei',
  129: 'Lesão corporal',
  138: 'Calúnia',
  139: 'Difamação',
  140: 'Injúria',
  146: 'Constrangimento ilegal',
  147: 'Ameaça',
  148: 'Sequestro e cárcere privado',
  150: 'Violação de domicílio',
  155: 'Furto',
  156: 'Furto de coisa comum',
  157: 'Roubo',
  158: 'Extorsão',
  159: 'Extorsão mediante sequestro',
  163: 'Dano',
  168: 'Apropriação indébita',
  171: 'Estelionato',
  180: 'Receptação',
  213: 'Estupro',
  217: 'Estupro de vulnerável',
  218: 'Satisfação de lascívia mediante presença de criança/adolescente',
  286: 'Incitação ao crime',
  287: 'Apologia de crime ou criminoso',
  288: 'Associação criminosa',
  289: 'Moeda falsa',
  296: 'Falsificação de selo ou sinal público',
  297: 'Falsificação de documento público',
  298: 'Falsificação de documento particular',
  299: 'Falsidade ideológica',
  304: 'Uso de documento falso',
  312: 'Peculato',
  313: 'Peculato culposo',
  317: 'Corrupção passiva',
  330: 'Desobediência',
  331: 'Desacato',
  334: 'Contrabando ou descaminho',
  333: 'Corrupção ativa',
};

const cpFaixas: Array<[number, number]> = [
  [121, 154],
  [155, 180],
  [213, 234],
  [286, 311],
  [312, 337],
];

const cpNumeros = new Set<number>();
cpFaixas.forEach(([ini, fim]) => {
  for (let n = ini; n <= fim; n += 1) cpNumeros.add(n);
});

export const artigosOptions: { value: string; label: string }[] = Array.from(cpNumeros)
  .sort((a, b) => a - b)
  .map((n) => ({
    value: String(n),
    label: artigoDescricao[n] ? `Art. ${n} - ${artigoDescricao[n]}` : `Art. ${n}`,
  }));

export const artigosCodigoIndex: Record<number, 'CP' | 'CTB' | 'ECA' | 'LD' | 'Outros'> = {};
Array.from(cpNumeros).forEach((n) => {
  artigosCodigoIndex[n] = 'CP';
});

export const artigosPorCodigo: Record<'CP' | 'CTB' | 'ECA' | 'LD' | 'Outros', number[]> = {
  CP: Array.from(cpNumeros).sort((a, b) => a - b),
  CTB: [],
  ECA: [],
  LD: [],
  Outros: [],
};

export const empresaConvenioService: CrudService<
  EmpresaConvenio,
  CreateEmpresaConvenioSchema,
  UpdateEmpresaConvenioSchema,
  EmpresaConvenioListParams
> = {
  paginate: async ({ page, limit, search, modalidade, status }) => {
    const api = getEmpresaConvenios();
    const backendPage = typeof page === 'number' ? Math.max(0, page - 1) : 0;
    const res: PaginateEmpresaConvenioDto = await api.findAll({
      page: backendPage,
      limit,
      search,
      ...(modalidade ? { modalidade } : {}),
      ...(status ? { status: status as 'ativo' | 'encerrado' } : {}),
    });
    return {
      totalPages: res.totalPages,
      page: (res.page ?? 0) + 1,
      limit: res.limit,
      total: res.total,
      hasNextPage: res.hasNextPage,
      hasPrevPage: res.hasPrevPage,
      items: res.items.map(fromApi),
    };
  },
  create: async (data) => {
    const api = getEmpresaConvenios();
    const created = await api.create(serializeDto(data));
    return fromApi(created);
  },
  read: async (id) => {
    const api = getEmpresaConvenios();
    const dto = await api.findOne(id);
    return fromApi(dto);
  },
  update: async (id, data) => {
    const api = getEmpresaConvenios();
    const dto = await api.update(id, serializeDto(data));
    return fromApi(dto);
  },
  delete: async (id) => {
    const api = getEmpresaConvenios();
    await api.remove(id);
  },
};

const fromApi = (dto: ReadEmpresaConvenioDto): EmpresaConvenio => ({
  ...dto,
  id: dto.convenio_id,
  artigos_vedados: dto.artigos_vedados ?? [],
  regimes_permitidos: dto.regimes_permitidos ?? [],
  max_reeducandos: dto.max_reeducandos ?? null,
  permite_variacao_quantidade: dto.permite_variacao_quantidade ?? true,
  permite_bonus_produtividade: dto.permite_bonus_produtividade ?? false,
  percentual_gestao: dto.percentual_gestao ?? null,
  percentual_contrapartida: dto.percentual_contrapartida ?? null,
  data_fim: dto.data_fim ?? null,
  data_repactuacao: dto.data_repactuacao ?? null,
  possui_seguro_acidente: dto.possui_seguro_acidente ?? false,
  template_contrato_id: dto.template_contrato_id,
  template_codigo: dto.template_codigo ?? null,
  locais_execucao: (dto.locais_execucao ?? []).map((local) => ({
    local_id: local.local_id!,
    logradouro: local.logradouro,
    numero: local.numero ?? null,
    complemento: local.complemento ?? null,
    bairro: local.bairro ?? null,
    cidade: local.cidade,
    estado: local.estado,
    cep: local.cep ?? null,
    referencia: local.referencia ?? null,
  })),
  responsaveis: dto.responsaveis,
  distribuicao_profissoes: dto.distribuicao_profissoes,
});

const serializeDto = (data: CreateEmpresaConvenioSchema | UpdateEmpresaConvenioSchema) => {
  const tabelaId = data.permite_bonus_produtividade
    ? String(data.tabela_produtividade_id || '').trim() || undefined
    : undefined;
  const responsaveis = (data.responsaveis ?? [])
    .filter((r) => r.nome?.trim())
    .map((r) => ({
      tipo: r.tipo,
      nome: r.nome!.trim(),
      cargo: r.cargo?.trim() || undefined,
      documento: r.documento?.trim() || undefined,
      email: r.email?.trim() || undefined,
      telefone: r.telefone?.trim() || undefined,
    }));
  const distRows = (data.distribuicao_profissoes ?? []).filter((r) => {
    const q = Number(r.quantidade);
    return Boolean(String(r.profissao_id || '').trim()) && !Number.isNaN(q) && q >= 1;
  });
  const distribuicao_profissoes = distRows.map((r) => {
    const nivelStr = r.nivel == null ? '' : String(r.nivel).trim();
    const nivelNorm: CreateConvenioDistribuicaoProfissaoDto['nivel'] =
      nivelStr === ''
        ? null
        : nivelStr === 'I' || nivelStr === 'II' || nivelStr === 'III'
          ? (nivelStr as 'I' | 'II' | 'III')
          : null;
    return {
      profissao_id: r.profissao_id as string,
      quantidade: Number(r.quantidade),
      nivel: nivelNorm,
      observacao: r.observacao?.trim() || undefined,
    };
  });
  const bonusJson =
    data.permite_bonus_produtividade &&
    Array.isArray(data.bonus_produtividade_tabela_json) &&
    data.bonus_produtividade_tabela_json.length > 0
      ? data.bonus_produtividade_tabela_json
      : undefined;
  const body: CreateEmpresaConvenioDto = {
    empresa_id: data.empresa_id,
    modalidade_execucao: data.modalidade_execucao,
    regimes_permitidos: data.regimes_permitidos,
    artigos_vedados: data.artigos_vedados,
    max_reeducandos:
      data.max_reeducandos != null && !Number.isNaN(Number(data.max_reeducandos))
        ? Number(data.max_reeducandos)
        : undefined,
    permite_variacao_quantidade: data.permite_variacao_quantidade,
    data_inicio: data.data_inicio,
    data_fim:
      data.data_fim != null && String(data.data_fim).trim() !== ''
        ? String(data.data_fim).trim()
        : null,
    data_repactuacao:
      data.data_repactuacao != null && String(data.data_repactuacao).trim() !== ''
        ? String(data.data_repactuacao).trim()
        : null,
    tipo_calculo_remuneracao: data.tipo_calculo_remuneracao,
    usa_nivel: data.usa_nivel,
    valor_nivel_i: data.valor_nivel_i,
    valor_nivel_ii: data.valor_nivel_ii,
    valor_nivel_iii: data.valor_nivel_iii,
    transporte_responsavel: data.transporte_responsavel,
    alimentacao_responsavel: data.alimentacao_responsavel,
    valor_transporte: data.valor_transporte,
    valor_alimentacao: data.valor_alimentacao,
    beneficio_variavel_por_dia: data.beneficio_variavel_por_dia,
    observacao_beneficio: data.observacao_beneficio?.trim() || undefined,
    quantidade_nivel_i:
      data.quantidade_nivel_i != null && !Number.isNaN(Number(data.quantidade_nivel_i))
        ? Number(data.quantidade_nivel_i)
        : undefined,
    quantidade_nivel_ii:
      data.quantidade_nivel_ii != null && !Number.isNaN(Number(data.quantidade_nivel_ii))
        ? Number(data.quantidade_nivel_ii)
        : undefined,
    quantidade_nivel_iii:
      data.quantidade_nivel_iii != null && !Number.isNaN(Number(data.quantidade_nivel_iii))
        ? Number(data.quantidade_nivel_iii)
        : undefined,
    permite_bonus_produtividade: data.permite_bonus_produtividade,
    bonus_produtividade_descricao: data.bonus_produtividade_descricao?.trim() || undefined,
    bonus_produtividade_tabela_json: bonusJson,
    percentual_gestao: data.percentual_gestao ?? undefined,
    percentual_contrapartida: data.percentual_contrapartida ?? undefined,
    observacoes: data.observacoes?.trim() || undefined,
    locais_execucao: data.locais_execucao?.map((local) => {
      const estadoNorm = String(local.estado ?? '')
        .trim()
        .toUpperCase();
      return {
        ...local,
        logradouro: String(local.logradouro ?? '').trim(),
        cidade: String(local.cidade ?? '').trim(),
        estado: estadoNorm,
        local_id: local.local_id || undefined,
        numero: local.numero?.trim() || undefined,
        complemento: local.complemento?.trim() || undefined,
        bairro: local.bairro?.trim() || undefined,
        referencia: local.referencia?.trim() || undefined,
        cep: local.cep ? local.cep.replace(/\D/g, '') : undefined,
      };
    }),
    template_contrato_id: data.template_contrato_id,
    jornada_tipo: data.jornada_tipo?.trim() || undefined,
    carga_horaria_semanal:
      data.carga_horaria_semanal != null &&
      !Number.isNaN(Number(data.carga_horaria_semanal))
        ? Number(data.carga_horaria_semanal)
        : undefined,
    escala: data.escala?.trim() || undefined,
    horario_inicio: data.horario_inicio ?? null,
    horario_fim: data.horario_fim ?? null,
    possui_seguro_acidente: data.possui_seguro_acidente,
    tipo_cobertura_seguro: data.tipo_cobertura_seguro?.trim() || undefined,
    observacao_seguro: data.observacao_seguro?.trim() || undefined,
    observacao_juridica: data.observacao_juridica?.trim() || undefined,
    clausula_adicional: data.clausula_adicional?.trim() || undefined,
    descricao_complementar_objeto: data.descricao_complementar_objeto?.trim() || undefined,
    observacao_operacional: data.observacao_operacional?.trim() || undefined,
    tabela_produtividade_id: tabelaId,
    responsaveis: responsaveis.length > 0 ? responsaveis : undefined,
    distribuicao_profissoes: distribuicao_profissoes.length > 0 ? distribuicao_profissoes : undefined,
  };
  return body;
};

export const empresaConvenioMetrics = async (): Promise<EmpresaConvenioMetricsDto> => {
  const api = getEmpresaConvenios();
  return api.metrics();
};
