import type { CrudService, PaginatedParams } from 'src/types';
import type {
  ReadUnidadePrisionalDto,
  CreateUnidadePrisionalDto,
  UpdateUnidadePrisionalDto,
} from 'src/api/generated.schemas';

import { getUnidadesPrisionais } from 'src/api/unidades-prisionais/unidades-prisionais';

const api = getUnidadesPrisionais();

export const unidadePrisionalService: CrudService<
  ReadUnidadePrisionalDto,
  CreateUnidadePrisionalDto,
  UpdateUnidadePrisionalDto,
  PaginatedParams
> = {
  paginate: async (params) => api.findAll(params),
  create: async (data) => api.create(data),
  read: async (id) => api.findOne(id),
  update: async (id, data) => api.update(id, data),
  delete: async (id) => api.remove(id),
};
