import type { BodyType } from '../lib/axios';

import { customInstance } from '../lib/axios';

// ---- DTOs ----------------------------------------------------------------

export type ValidacaoStatusDto = 'PENDENTE' | 'APROVADO' | 'REPROVADO' | 'ALERTA';

export interface ReadFichaCadastralValidacaoDto {
  ficha_cadastral_id: string;
  detento_id: string;
  detento_nome: string;
  matricula: string | null;

  ficha_cadastral_numero: string | null;
  ficha_cadastral_status: string;

  status: ValidacaoStatusDto;
  motivo_rejeicao: string | null;

  autorizacao_trabalho: boolean | null;
  regime: string | null;
  artigos: string[];

  seeu_consultado: boolean;
  siapen_consultado: boolean;

  observacao: string | null;

  validado_por_id: string | null;
  validado_por_nome: string | null;
  validado_em: string | null;

  createdAt: string;
  updatedAt: string;
}

export interface PaginateFichaCadastralValidacaoDto {
  items: ReadFichaCadastralValidacaoDto[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface ValidarFichaCadastralBody {
  ficha_cadastral_id: string;
  decisao: 'APROVADO' | 'REPROVADO' | 'ALERTA';
  motivo_rejeicao?: string;
  observacao?: string;
  autorizacao_trabalho?: boolean;
  seeu_consultado?: boolean;
  siapen_consultado?: boolean;
}

export interface RevalidarFichaCadastralBody {
  ficha_cadastral_id: string;
  motivo: string;
}

export interface ListValidacoesParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: ValidacaoStatusDto | '';
  motivo_rejeicao?: string;
  sort?: string;
  order?: 'asc' | 'desc';
}

type SecondParameter<T extends (...args: never) => unknown> = Parameters<T>[1];

// ---- Factory -------------------------------------------------------------

export const getFichasCadastraisValidacoes = () => {
  /**
   * @summary Listar validações de fichas (paginação, filtros)
   */
  const paginate = (
    params?: ListValidacoesParams,
    options?: SecondParameter<typeof customInstance>
  ) =>
    customInstance<PaginateFichaCadastralValidacaoDto>(
      {
        url: `/fichas-cadastrais-validacoes`,
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        params,
      },
      options
    );

  /**
   * @summary Detalhe da validação por ficha
   */
  const findOne = (fichaId: string, options?: SecondParameter<typeof customInstance>) =>
    customInstance<ReadFichaCadastralValidacaoDto>(
      {
        url: `/fichas-cadastrais-validacoes/${fichaId}`,
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      },
      options
    );

  /**
   * @summary Emite a decisão de validação (APROVADO / REPROVADO / ALERTA)
   */
  const validar = (
    body: BodyType<ValidarFichaCadastralBody>,
    options?: SecondParameter<typeof customInstance>
  ) =>
    customInstance<ReadFichaCadastralValidacaoDto>(
      {
        url: `/fichas-cadastrais-validacoes/validar`,
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        data: body,
      },
      options
    );

  /**
   * @summary Reabre a validação de uma ficha já finalizada (volta para PENDENTE)
   */
  const revalidar = (
    body: BodyType<RevalidarFichaCadastralBody>,
    options?: SecondParameter<typeof customInstance>
  ) =>
    customInstance<ReadFichaCadastralValidacaoDto>(
      {
        url: `/fichas-cadastrais-validacoes/revalidar`,
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        data: body,
      },
      options
    );

  return { paginate, findOne, validar, revalidar };
};

export type ValidarResult = NonNullable<
  Awaited<ReturnType<ReturnType<typeof getFichasCadastraisValidacoes>['validar']>>
>;
export type RevalidarResult = NonNullable<
  Awaited<ReturnType<ReturnType<typeof getFichasCadastraisValidacoes>['revalidar']>>
>;
