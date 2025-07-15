import type { CrudService, PaginatedParams } from 'src/types';
import type {
  ReadSecretariaDto,
  CreateSecretariaDto,
  UpdateSecretariaDto,
} from 'src/api/generated.schemas';

import { getSecretarias } from 'src/api/secretarias/secretarias';

const api = getSecretarias();

export const secretariaService: CrudService<
  ReadSecretariaDto,
  CreateSecretariaDto,
  UpdateSecretariaDto,
  PaginatedParams
> = {
  paginate: async (params: PaginatedParams) => api.findAll(params),
  create: async (data: CreateSecretariaDto) => api.create(data),
  read: async (id: string) => api.findOne(id),
  update: async (id: string, data: UpdateSecretariaDto) => api.update(id, data),
  delete: async (id: string) => api.remove(id),
};
