import type { EmpresaConvenio } from '../types';
import type { CrudService, PaginatedParams } from 'src/types';
import type { CreateEmpresaConvenioSchema, UpdateEmpresaConvenioSchema } from '../schemas';

import {
  getEmpresaConvenios,
  type ReadEmpresaConvenioDto,
  type PaginateEmpresaConvenioDto,
} from 'src/api/empresa-convenios/empresa-convenios';

// Tipos de convênio (mock)
export const convenioTipos = [
  { codigo: 'ADM', descricao: 'Administração' },
  { codigo: 'LIM', descricao: 'Limpeza' },
  { codigo: 'CON', descricao: 'Construção Civil' },
  { codigo: 'TEC', descricao: 'Tecnologia' },
];

// Regimes permitidos (mock)
export const regimesOptions: { value: string; label: string }[] = [
  { value: '1', label: 'Fechado' },
  { value: '2', label: 'Semiaberto' },
  { value: '3', label: 'Aberto' },
  { value: '4', label: 'Provisório' },
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
    const res: PaginateEmpresaConvenioDto = await api.findAll({ page, limit, search });
    return {
      totalPages: res.totalPages,
      page: res.page,
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
  artigos_vedados: dto.artigos_vedados ?? [],
  regimes_permitidos: dto.regimes_permitidos ?? [],
  quantitativos_profissoes: dto.quantitativos_profissoes ?? [],
  data_fim: dto.data_fim ?? null,
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
});

const serializeDto = (data: CreateEmpresaConvenioSchema | UpdateEmpresaConvenioSchema) => ({
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
});
