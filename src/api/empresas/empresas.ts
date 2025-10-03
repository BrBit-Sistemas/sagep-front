import { type BodyType, customInstance } from 'src/lib/axios';

export type CreateEmpresaDto = {
  razao_social: string;
  cnpj: string;
};

export type UpdateEmpresaDto = Partial<CreateEmpresaDto>;

export type ReadEmpresaDto = CreateEmpresaDto & {
  empresa_id: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
};

export type PaginateEmpresaDto = {
  items: ReadEmpresaDto[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
};

export type ListEmpresaParams = {
  page?: number;
  limit?: number;
  search?: string;
  razao_social?: string;
  cnpj?: string;
  sort?: 'razao_social' | 'cnpj' | 'createdAt' | 'updatedAt';
  order?: 'asc' | 'desc';
};

export const getEmpresas = () => {
  const base = '/empresas';

  const create = (
    body: BodyType<CreateEmpresaDto>,
    options?: Parameters<typeof customInstance>[1]
  ) =>
    customInstance<ReadEmpresaDto>(
      { url: base, method: 'POST', headers: { 'Content-Type': 'application/json' }, data: body },
      options
    );

  const findAll = (params?: ListEmpresaParams, options?: Parameters<typeof customInstance>[1]) =>
    customInstance<PaginateEmpresaDto>({ url: base, method: 'GET', params }, options);

  const findOne = (id: string, options?: Parameters<typeof customInstance>[1]) =>
    customInstance<ReadEmpresaDto>({ url: `${base}/${id}`, method: 'GET' }, options);

  const update = (
    id: string,
    body: BodyType<UpdateEmpresaDto>,
    options?: Parameters<typeof customInstance>[1]
  ) =>
    customInstance<ReadEmpresaDto>(
      {
        url: `${base}/${id}`,
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        data: body,
      },
      options
    );

  const remove = (id: string, options?: Parameters<typeof customInstance>[1]) =>
    customInstance<void>({ url: `${base}/${id}`, method: 'DELETE' }, options);

  return { create, findAll, findOne, update, remove };
};
