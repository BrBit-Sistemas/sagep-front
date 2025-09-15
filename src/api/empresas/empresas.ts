import { customInstance } from 'src/lib/axios';

export type ReadEmpresaDto = {
  empresa_id: string;
  razao_social: string;
  cnpj: string;
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

export const getEmpresas = () => {
  const base = '/empresas';

  const findAll = (params: { page?: number; limit?: number; search?: string }) =>
    customInstance<PaginateEmpresaDto>({ url: base, method: 'GET', params });

  return { findAll };
};

