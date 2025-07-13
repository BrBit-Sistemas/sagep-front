import type { CrudService, PaginatedParams } from 'src/types';
import type {
  ReadSecretariaDto,
  CreateSecretariaDto,
  UpdateSecretariaDto,
} from 'src/api/generated';

import { getSAGEPCoreAPI } from 'src/api/generated';

const api = getSAGEPCoreAPI();

export const secretariaService: CrudService<
  ReadSecretariaDto,
  CreateSecretariaDto,
  UpdateSecretariaDto,
  PaginatedParams
> = {
  paginate: async (params: PaginatedParams) => api.secretariaFindAll(params),
  create: async (data: CreateSecretariaDto) => api.secretariaCreate(data),
  read: async (id: string) => api.secretariaFindOne(id),
  update: async (id: string, data: UpdateSecretariaDto) => api.secretariaUpdate(id, data),
  delete: async (id: string) => api.secretariaRemove(id),
};
