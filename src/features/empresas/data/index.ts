import type { Empresa } from '../types';
import type { CrudService, PaginatedParams } from 'src/types';
import type { CreateEmpresaSchema, UpdateEmpresaSchema } from '../schemas';

import {
  getEmpresas,
  type ReadEmpresaDto,
  type PaginateEmpresaDto,
} from 'src/api/empresas/empresas';

const sanitizeCnpj = (value: string) => value.replace(/\D/g, '');

const fromApi = (dto: ReadEmpresaDto): Empresa => ({
  empresa_id: dto.empresa_id,
  razao_social: dto.razao_social,
  cnpj: dto.cnpj,
  createdAt: dto.createdAt,
  updatedAt: dto.updatedAt,
  created_by: undefined,
  updated_by: undefined,
});

export const empresaService: CrudService<
  Empresa,
  CreateEmpresaSchema,
  UpdateEmpresaSchema,
  PaginatedParams
> = {
  paginate: async ({ page, limit, search }) => {
    const api = getEmpresas();
    const response: PaginateEmpresaDto = await api.findAll({ page, limit, search });

    return {
      totalPages: response.totalPages,
      page: response.page,
      limit: response.limit,
      total: response.total,
      hasNextPage: response.hasNextPage,
      hasPrevPage: response.hasPrevPage,
      items: response.items.map(fromApi),
    };
  },
  create: async (data) => {
    const api = getEmpresas();
    const dto = await api.create({
      razao_social: data.razao_social,
      cnpj: sanitizeCnpj(data.cnpj),
    });
    return fromApi(dto);
  },
  read: async (id) => {
    const api = getEmpresas();
    const dto = await api.findOne(id);
    return fromApi(dto);
  },
  update: async (id, data) => {
    const api = getEmpresas();
    const payload = {
      ...(data.razao_social ? { razao_social: data.razao_social } : {}),
      ...(data.cnpj ? { cnpj: sanitizeCnpj(data.cnpj) } : {}),
    };
    const dto = await api.update(id, payload);
    return fromApi(dto);
  },
  delete: async (id) => {
    const api = getEmpresas();
    await api.remove(id);
  },
};
