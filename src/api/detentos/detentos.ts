import type { BodyType } from '../../lib/axios';

/**
 * Hand-authored API client following the same pattern as regionais API.
 */
import { customInstance } from '../../lib/axios';

export interface ReadDetentoDto {
  id: string;
  nome: string;
  mae?: string;
  prontuario?: string | null;
  cpf: string;
  data_nascimento: string;
  regime: string;
  escolaridade: string;
  unidade_id: string;
  createdAt: string;
  updatedAt: string;
  created_by: string;
  updated_by: string;
  ficha_cadastral_created_at?: string | null;
  ficha_cadastral_created_by_name?: string | null;
  /** Status da ficha cadastral ATIVA (vem do join no back). null = sem ficha. */
  status_validacao?:
    | 'AGUARDANDO_VALIDACAO'
    | 'VALIDADO'
    | 'REQUER_CORRECAO'
    | 'FILA_DISPONIVEL'
    | null;
  /** Motivo da reprovação da ficha ativa (preenchido quando REQUER_CORRECAO). */
  motivo_reprovacao?: string | null;
}

export interface DetentoIndicadoresValidacaoDto {
  total: number;
  aprovados: number;
  aguardando: number;
  requer_correcao: number;
  sem_ficha: number;
}

export type DetentoStatusValidacaoFilter =
  | 'AGUARDANDO_VALIDACAO'
  | 'VALIDADO'
  | 'REQUER_CORRECAO'
  | 'FILA_DISPONIVEL'
  | 'SEM_FICHA';

export interface PaginateDetentosParams {
  page?: number;
  limit?: number;
  search?: string;
  sort?: string;
  order?: 'asc' | 'desc';
  cpf?: string;
  status_validacao?: DetentoStatusValidacaoFilter;
  motivo_reprovacao?: string;
}

export interface CreateDetentoDto {
  nome: string;
  mae?: string;
  prontuario?: string | null;
  cpf: string;
  data_nascimento: string;
  regime: string;
  escolaridade: string;
  unidade_id: string;
}

export interface UpdateDetentoDto extends CreateDetentoDto {}

export interface PaginateDetentoDto {
  items: ReadDetentoDto[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

type SecondParameter<T extends (...args: never) => unknown> = Parameters<T>[1];

export const getDetentos = () => {
  const create = (
    createDetentoDto: BodyType<CreateDetentoDto>,
    options?: SecondParameter<typeof customInstance>
  ) =>
    customInstance<ReadDetentoDto>(
      {
        url: `/detentos`,
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        data: createDetentoDto,
      },
      options
    );

  const findAll = (
    params?: PaginateDetentosParams,
    options?: SecondParameter<typeof customInstance>
  ) => customInstance<PaginateDetentoDto>({ url: `/detentos`, method: 'GET', params }, options);

  const indicadoresValidacao = (options?: SecondParameter<typeof customInstance>) =>
    customInstance<DetentoIndicadoresValidacaoDto>(
      {
        url: `/detentos/indicadores-validacao`,
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      },
      options
    );

  const findOne = (id: string, options?: SecondParameter<typeof customInstance>) =>
    customInstance<ReadDetentoDto>({ url: `/detentos/${id}`, method: 'GET' }, options);

  const update = (
    id: string,
    updateDetentoDto: BodyType<UpdateDetentoDto>,
    options?: SecondParameter<typeof customInstance>
  ) =>
    customInstance<ReadDetentoDto>(
      {
        url: `/detentos/${id}`,
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        data: updateDetentoDto,
      },
      options
    );

  const remove = (id: string, options?: SecondParameter<typeof customInstance>) =>
    customInstance<void>({ url: `/detentos/${id}`, method: 'DELETE' }, options);

  return { create, findAll, findOne, update, remove, indicadoresValidacao };
};

export type CreateResult = NonNullable<
  Awaited<ReturnType<ReturnType<typeof getDetentos>['create']>>
>;
export type FindAllResult = NonNullable<
  Awaited<ReturnType<ReturnType<typeof getDetentos>['findAll']>>
>;
export type FindOneResult = NonNullable<
  Awaited<ReturnType<ReturnType<typeof getDetentos>['findOne']>>
>;
export type UpdateResult = NonNullable<
  Awaited<ReturnType<ReturnType<typeof getDetentos>['update']>>
>;
export type RemoveResult = NonNullable<
  Awaited<ReturnType<ReturnType<typeof getDetentos>['remove']>>
>;
