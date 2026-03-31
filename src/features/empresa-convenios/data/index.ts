import type { EmpresaConvenio } from '../types';
import type { CrudService, PaginatedParams } from 'src/types';
import type { CreateEmpresaConvenioSchema, UpdateEmpresaConvenioSchema } from '../schemas';

import {
  getEmpresaConvenios,
  type ReadEmpresaConvenioDto,
  type PaginateEmpresaConvenioDto,
} from 'src/api/empresa-convenios/empresa-convenios';

// Regimes permitidos - mapeamento numérico (compatível com backend)
// 1: Fechado, 2: Semiaberto, 3: Aberto, 4: Livramento Condicional, 5: CIME
export const regimesOptions = [
  { value: '1', label: 'Fechado' },
  { value: '2', label: 'Semiaberto' },
  { value: '3', label: 'Aberto' },
  { value: '4', label: 'Livramento Condicional' },
  { value: '5', label: 'CIME' },
];

// Artigos vedados (Código Penal - Parte Especial)
// Mantemos apenas artigos da Parte Especial do CP (faixas com tipos penais),
// evitando artigos genéricos/parte geral e códigos de outros diplomas (ex.: CTB).
const artigoDescricao: Record<number, string> = {
  // Contra a pessoa e honra (faixa 121-154)
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
  // Dignidade sexual (faixa 213-234)
  213: 'Estupro',
  217: 'Estupro de vulnerável',
  218: 'Satisfação de lascívia mediante presença de criança/adolescente',
  // Paz pública / Fé pública (faixa 286-311)
  286: 'Incitação ao crime',
  287: 'Apologia de crime ou criminoso',
  288: 'Associação criminosa',
  289: 'Moeda falsa',
  296: 'Falsificação de selo ou sinal público',
  297: 'Falsificação de documento público',
  298: 'Falsificação de documento particular',
  299: 'Falsidade ideológica',
  304: 'Uso de documento falso',
  // Administração pública (faixa 312-337)
  312: 'Peculato',
  313: 'Peculato culposo',
  317: 'Corrupção passiva',
  330: 'Desobediência',
  331: 'Desacato',
  334: 'Contrabando ou descaminho',
  333: 'Corrupção ativa',
};

// Faixas de artigos da Parte Especial do CP (somente números inteiros, sem artigos com letras)
const cpFaixas: Array<[number, number]> = [
  [121, 154], // Crimes contra a pessoa (vida, integridade, honra - parte relevante numérica)
  [155, 180], // Patrimônio
  [213, 234], // Dignidade sexual (numéricos)
  [286, 311], // Paz pública, fé pública (numéricos)
  [312, 337], // Administração pública (numéricos)
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

// Índice para agrupar por código (por ora, todos CP)
export const artigosCodigoIndex: Record<number, 'CP' | 'CTB' | 'ECA' | 'LD' | 'Outros'> = {};
Array.from(cpNumeros).forEach((n) => {
  artigosCodigoIndex[n] = 'CP';
});

// Estrutura preparada para futuras leis
export const artigosPorCodigo: Record<'CP' | 'CTB' | 'ECA' | 'LD' | 'Outros', number[]> = {
  CP: Array.from(cpNumeros).sort((a, b) => a - b),
  CTB: [],
  ECA: [],
  LD: [], // Lei de Drogas (artigos não numéricos puros — normalmente referidos por lei 11.343/06)
  Outros: [],
};

export const empresaConvenioService: CrudService<
  EmpresaConvenio,
  CreateEmpresaConvenioSchema,
  UpdateEmpresaConvenioSchema,
  PaginatedParams
> = {
  paginate: async ({ page, limit, search }) => {
    const api = getEmpresaConvenios();
    const backendPage = typeof page === 'number' ? Math.max(0, page - 1) : 0; // backend 0-based
    const res: PaginateEmpresaConvenioDto = await api.findAll({ page: backendPage, limit, search });
    return {
      totalPages: res.totalPages,
      page: (res.page ?? 0) + 1, // converter de volta para 1-based
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
  quantidades_nivel: dto.quantidades_nivel,
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
  return {
    ...data,
    locais_execucao: data.locais_execucao?.map((local) => ({
      ...local,
      local_id: local.local_id || undefined,
      numero: local.numero || undefined,
      complemento: local.complemento || undefined,
      bairro: local.bairro || undefined,
      referencia: local.referencia || undefined,
      cep: local.cep ? local.cep.replace(/\D/g, '') : undefined,
      estado: local.estado?.toUpperCase(),
    })),
    max_reeducandos: data.max_reeducandos,
    percentual_gestao: data.percentual_gestao ?? undefined,
    percentual_contrapartida: data.percentual_contrapartida ?? undefined,
    horario_inicio: data.horario_inicio ?? null,
    horario_fim: data.horario_fim ?? null,
    tabela_produtividade_id: tabelaId,
    tipo_cobertura_seguro: data.tipo_cobertura_seguro?.trim() || undefined,
    observacao_seguro: data.observacao_seguro?.trim() || undefined,
    observacao_juridica: data.observacao_juridica?.trim() || undefined,
    clausula_adicional: data.clausula_adicional?.trim() || undefined,
    descricao_complementar_objeto: data.descricao_complementar_objeto?.trim() || undefined,
    observacao_operacional: data.observacao_operacional?.trim() || undefined,
    jornada_tipo: data.jornada_tipo?.trim() || undefined,
    escala: data.escala?.trim() || undefined,
    responsaveis: responsaveis.length > 0 ? responsaveis : undefined,
    quantidades_nivel: data.quantidades_nivel,
  };
};
