import type { BodyType } from '../../lib/axios';

/**
 * Hand-authored API client following the same pattern as regionais API.
 */
import { customInstance } from '../../lib/axios';

export interface ReadDetentoDto {
  id: string;
  nome: string;
  prontuario: string;
  cpf: string;
  data_nascimento: string;
  regime: string;
  escolaridade: string;
  unidade_id: string;
  createdAt: string;
  updatedAt: string;
  created_by: string;
  updated_by: string;
}

export interface CreateDetentoDto {
  nome: string;
  prontuario: string;
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
    params?: Record<string, any>,
    options?: SecondParameter<typeof customInstance>
  ) => customInstance<PaginateDetentoDto>({ url: `/detentos`, method: 'GET', params }, options);

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

  return { create, findAll, findOne, update, remove };
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
