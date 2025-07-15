import type { CrudService, PaginatedParams } from 'src/types';
import type {
  ReadRegionalDto,
  CreateRegionalDto,
  UpdateRegionalDto,
} from 'src/api/generated.schemas';

import { getRegionais } from 'src/api/regionais/regionais';

const api = getRegionais();

export const regionalService: CrudService<
  ReadRegionalDto,
  CreateRegionalDto,
  UpdateRegionalDto,
  PaginatedParams
> = {
  paginate: async (params: PaginatedParams) => api.findAll(params),
  create: async (data: CreateRegionalDto) => api.create(data),
  read: async (id: string) => api.findOne(id),
  update: async (id: string, data: UpdateRegionalDto) => api.update(id, data),
  delete: async (id: string) => api.remove(id),
};
