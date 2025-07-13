import type { CrudService, PaginatedParams } from 'src/types';
import type {
  ReadUnidadePrisionalDto,
  CreateUnidadePrisionalDto,
  UpdateUnidadePrisionalDto,
} from 'src/api/generated';

import { getSAGEPCoreAPI } from 'src/api/generated';

const api = getSAGEPCoreAPI();

export const unidadePrisionalService: CrudService<
  ReadUnidadePrisionalDto,
  CreateUnidadePrisionalDto,
  UpdateUnidadePrisionalDto,
  PaginatedParams
> = {
  paginate: async ({ page, limit }) => api.unidadePrisionalFindAll({ page, limit }),
  create: async (data) => api.unidadePrisionalCreate(data),
  read: async (id) => api.unidadePrisionalFindOne(id),
  update: async (id, data) => api.unidadePrisionalUpdate(id, data),
  delete: async (id) => api.unidadePrisionalRemove(id),
};
