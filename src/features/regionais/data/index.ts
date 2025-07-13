import type { CrudService, PaginatedParams } from 'src/types';
import type { ReadRegionalDto, CreateRegionalDto, UpdateRegionalDto } from 'src/api/generated';

import { getSAGEPCoreAPI } from 'src/api/generated';

const api = getSAGEPCoreAPI();

export const regionalService: CrudService<
  ReadRegionalDto,
  CreateRegionalDto,
  UpdateRegionalDto,
  PaginatedParams
> = {
  paginate: async (params: PaginatedParams) => api.regionalFindAll(params),
  create: async (data: CreateRegionalDto) => api.regionalCreate(data),
  read: async (id: string) => api.regionalFindOne(id),
  update: async (id: string, data: UpdateRegionalDto) => api.regionalUpdate(id, data),
  delete: async (id: string) => api.regionalRemove(id),
};
