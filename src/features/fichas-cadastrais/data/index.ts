import type {
  FichaCadastral,
  FichasCadastraisMetrics,
  FichasCadastraisListParams,
} from '../types';

import {
  getFichasCadastrais,
  type ValidateCpfDto,
  type StatusValidacaoFicha,
  type ReadFichaCadastralDto,
  type PaginateFichasCadastraisParams,
} from 'src/api/fichas-cadastrais';

const fromApi = (dto: ReadFichaCadastralDto): FichaCadastral => ({
  id: dto.id,
  status: (dto.status as string) ?? 'ativa',
  status_validacao: (dto.status_validacao as StatusValidacaoFicha) ?? 'AGUARDANDO_VALIDACAO',
  substatus_operacional: dto.substatus_operacional ?? null,
  motivo_reprovacao: dto.motivo_reprovacao ?? null,
  validado_em: dto.validado_em ?? null,
  validado_por: dto.validado_por ?? null,
  validado_por_nome: dto.validado_por_nome ?? null,
  nome: (dto.nome as string) ?? dto.detento?.nome ?? null,
  cpf: (dto.cpf as string) ?? dto.detento?.cpf ?? null,
  regime: (dto.regime as string) ?? null,
  prontuario: (dto.prontuario as string | null) ?? dto.detento?.prontuario ?? null,
  unidade_prisional: (dto.unidade_prisional as string) ?? null,
  artigos_penais: Array.isArray(dto.artigos_penais) ? (dto.artigos_penais as string[]) : [],
  detento_id: (dto.detento_id as string) ?? dto.detento?.id ?? null,
  detento: dto.detento ?? null,
  createdAt: dto.createdAt,
  updatedAt: dto.updatedAt,
});

const buildListParams = (p: FichasCadastraisListParams): PaginateFichasCadastraisParams => {
  const out: PaginateFichasCadastraisParams = {
    page: Math.max(1, p.page),
    limit: p.limit,
  };
  if (p.search) out.search = p.search;
  if (p.status_validacao) out.status_validacao = p.status_validacao;
  if (p.cpf) out.cpf = p.cpf;
  if (p.sort) out.sort = p.sort;
  if (p.order) out.order = p.order;
  out.status = 'ativa';
  return out;
};

export const fichasCadastraisService = {
  paginate: async (params: FichasCadastraisListParams) => {
    const api = getFichasCadastrais();
    const response = await api.paginate(buildListParams(params));
    return {
      totalPages: response.totalPages,
      page: response.page,
      limit: response.limit,
      total: response.total,
      hasNextPage: response.hasNextPage,
      hasPrevPage: response.hasPrevPage,
      items: response.items.map(fromApi),
    } as const;
  },

  metrics: async (): Promise<FichasCadastraisMetrics> => {
    const api = getFichasCadastrais();
    return api.indicadoresValidacao();
  },

  validateCpf: async (cpf: string): Promise<ValidateCpfDto> => {
    const api = getFichasCadastrais();
    return api.validateCpf(cpf);
  },
};
