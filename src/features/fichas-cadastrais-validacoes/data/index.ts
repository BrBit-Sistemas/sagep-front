import type { ValidarFichaSchema, RevalidarFichaSchema } from '../schemas';
import type {
  ValidacaoStatus,
  RegimePrisional,
  ValidacoesMetrics,
  ValidacoesListParams,
  FichaCadastralValidacao,
} from '../types';

import {
  type ListValidacoesParams,
  getFichasCadastraisValidacoes,
  type ReadFichaCadastralValidacaoDto,
  type PaginateFichaCadastralValidacaoDto,
} from 'src/api/fichas-cadastrais-validacoes';

const normalizeRegime = (r: string | null): RegimePrisional | null => {
  if (!r) return null;
  const up = r.toUpperCase();
  if (['FECHADO', 'SEMIABERTO', 'ABERTO', 'PROVISORIO'].includes(up)) return up as RegimePrisional;
  return 'OUTRO';
};

const fromApi = (dto: ReadFichaCadastralValidacaoDto): FichaCadastralValidacao => ({
  id: dto.ficha_cadastral_id,
  ficha_cadastral_id: dto.ficha_cadastral_id,
  detento_id: dto.detento_id,
  detento_nome: dto.detento_nome,
  matricula: dto.matricula,
  ficha_cadastral_numero: dto.ficha_cadastral_numero,
  ficha_cadastral_status: dto.ficha_cadastral_status,
  status: dto.status,
  motivo_rejeicao: dto.motivo_rejeicao,
  autorizacao_trabalho: dto.autorizacao_trabalho,
  regime: normalizeRegime(dto.regime),
  artigos: Array.isArray(dto.artigos) ? dto.artigos : [],
  seeu_consultado: Boolean(dto.seeu_consultado),
  siapen_consultado: Boolean(dto.siapen_consultado),
  observacao: dto.observacao,
  validado_por_id: dto.validado_por_id,
  validado_por_nome: dto.validado_por_nome,
  validado_em: dto.validado_em,
  createdAt: dto.createdAt,
  updatedAt: dto.updatedAt,
});

const buildListParams = (p: ValidacoesListParams): ListValidacoesParams => {
  const out: ListValidacoesParams = {
    page: Math.max(0, p.page - 1),
    limit: p.limit,
  };
  if (p.search) out.search = p.search;
  if (p.status) out.status = p.status;
  if (p.motivo_rejeicao) out.motivo_rejeicao = p.motivo_rejeicao;
  if (p.sort) out.sort = p.sort;
  if (p.order) out.order = p.order;
  return out;
};

export const validacoesService = {
  paginate: async (params: ValidacoesListParams) => {
    const api = getFichasCadastraisValidacoes();
    const response: PaginateFichaCadastralValidacaoDto = await api.paginate(buildListParams(params));
    return {
      totalPages: response.totalPages,
      page: Number(response.page) + 1,
      limit: response.limit,
      total: response.total,
      hasNextPage: response.hasNextPage,
      hasPrevPage: response.hasPrevPage,
      items: response.items.map(fromApi),
    } as const;
  },

  read: async (fichaId: string): Promise<FichaCadastralValidacao> => {
    const api = getFichasCadastraisValidacoes();
    const dto = await api.findOne(fichaId);
    return fromApi(dto);
  },

  validar: async (
    fichaId: string,
    data: ValidarFichaSchema
  ): Promise<FichaCadastralValidacao> => {
    const api = getFichasCadastraisValidacoes();
    const dto = await api.validar({
      ficha_cadastral_id: fichaId,
      decisao: data.decisao,
      motivo_rejeicao:
        data.decisao === 'REPROVADO' ? (data.motivo_rejeicao || '').trim() : undefined,
      observacao: data.observacao?.trim() || undefined,
      autorizacao_trabalho: data.autorizacao_trabalho,
      seeu_consultado: data.seeu_consultado,
      siapen_consultado: data.siapen_consultado,
    });
    return fromApi(dto);
  },

  revalidar: async (
    fichaId: string,
    data: RevalidarFichaSchema
  ): Promise<FichaCadastralValidacao> => {
    const api = getFichasCadastraisValidacoes();
    const dto = await api.revalidar({
      ficha_cadastral_id: fichaId,
      motivo: data.motivo.trim(),
    });
    return fromApi(dto);
  },

  /**
   * KPIs do topo — quatro contagens por status + total de fichas ATIVAS.
   * Enquanto não existe endpoint dedicado /metrics, derivamos via `paginate({ limit: 1, status })`.
   */
  metrics: async (): Promise<ValidacoesMetrics> => {
    const api = getFichasCadastraisValidacoes();
    const statuses: ValidacaoStatus[] = ['APROVADO', 'REPROVADO', 'ALERTA', 'PENDENTE'];
    const [totalAtivasResp, aprovadas, reprovadas, alertas, pendentes] = await Promise.all([
      api.paginate({ page: 0, limit: 1 }),
      ...statuses.map((status) => api.paginate({ page: 0, limit: 1, status })),
    ]);
    return {
      totalAtivas: totalAtivasResp.total,
      aprovadas: aprovadas.total,
      reprovadas: reprovadas.total,
      alertas: alertas.total,
      pendentes: pendentes.total,
    };
  },
};
