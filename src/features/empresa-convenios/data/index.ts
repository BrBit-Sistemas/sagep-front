import type { EmpresaConvenio } from '../types';
import type { Empresa } from 'src/features/empresas/types';
import type { CrudService, PaginatedParams } from 'src/types';
import type { CreateEmpresaConvenioSchema, UpdateEmpresaConvenioSchema } from '../schemas';

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

// Mock de empresas importadas do módulo de empresas
import { empresas as empresasMock } from 'src/features/empresas/data';

export const empresaConvenios: EmpresaConvenio[] = [
  {
    convenio_id: 'c1',
    empresa_id: empresasMock[0]?.empresa_id || '1',
    tipo_codigo: 'CON',
    modalidade_execucao: 'INTRAMUROS',
    regimes_permitidos: [1, 2],
    artigos_vedados: [157, 171],
    quantitativo_maximo: 30,
    data_inicio: '2024-01-01',
    data_fim: null,
    status: 'ATIVO',
    observacoes: 'Execução de obras internas.',
    createdAt: '2024-01-01',
    updatedAt: '2024-01-10',
    created_by: '1',
    updated_by: '1',
  },
  {
    convenio_id: 'c2',
    empresa_id: empresasMock[1]?.empresa_id || '2',
    tipo_codigo: 'LIM',
    modalidade_execucao: 'EXTRAMUROS',
    regimes_permitidos: [2, 3],
    artigos_vedados: [121],
    quantitativo_maximo: 15,
    data_inicio: '2023-09-01',
    data_fim: '2024-09-01',
    status: 'ENCERRADO',
    observacoes: 'Serviços concluídos.',
    createdAt: '2023-08-15',
    updatedAt: '2024-09-01',
    created_by: '1',
    updated_by: '1',
  },
];

export const empresaConvenioService: CrudService<
  EmpresaConvenio,
  CreateEmpresaConvenioSchema,
  UpdateEmpresaConvenioSchema,
  PaginatedParams
> = {
  paginate: async ({ page, limit, search }) => {
    let items = empresaConvenios;

    if (search) {
      const searchLower = search.toLowerCase();
      // Enriquecer busca por razão social
      const empresasIndex = new Map<string, Empresa>(empresasMock.map((e) => [e.empresa_id, e]));
      items = items.filter((c) => {
        const empresa = empresasIndex.get(c.empresa_id);
        const empresaMatch = empresa?.razao_social?.toLowerCase().includes(searchLower);
        return (
          c.tipo_codigo.toLowerCase().includes(searchLower) ||
          c.status.toLowerCase().includes(searchLower) ||
          !!empresaMatch
        );
      });
    }

    return {
      totalPages: 1,
      page,
      limit,
      total: items.length,
      hasNextPage: false,
      hasPrevPage: false,
      items,
    };
  },
  create: async (data) => {
    const newItem: EmpresaConvenio = {
      ...data,
      convenio_id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      created_by: '1',
      updated_by: '1',
    } as EmpresaConvenio;
    empresaConvenios.push(newItem);
    return newItem;
  },
  read: async (id) => {
    const item = empresaConvenios.find((e) => e.convenio_id === id);
    if (!item) throw new Error('Convênio não encontrado');
    return item;
  },
  update: async (id, data) => {
    const idx = empresaConvenios.findIndex((e) => e.convenio_id === id);
    if (idx === -1) throw new Error('Convênio não encontrado');
    empresaConvenios[idx] = {
      ...empresaConvenios[idx],
      ...data,
      updatedAt: new Date().toISOString(),
      updated_by: '1',
    } as EmpresaConvenio;
    return empresaConvenios[idx];
  },
  delete: async (id) => {
    const idx = empresaConvenios.findIndex((e) => e.convenio_id === id);
    if (idx === -1) throw new Error('Convênio não encontrado');
    empresaConvenios.splice(idx, 1);
  },
};
