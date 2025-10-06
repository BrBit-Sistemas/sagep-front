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
  paginate: async ({ page, limit, search }: PaginatedParams) => {
    // Converter página de 1-based (frontend) para 0-based (backend)
    const backendPage = page - 1;
    
    const res = await api.findAll({ page: backendPage, limit, search });
    
    return {
      items: res.items,
      page: Number(res.page) + 1, // Converter de volta para 1-based para o frontend
      limit: res.limit,
      total: res.total,
      totalPages: Math.ceil((res.total ?? 0) / (res.limit || 1)) || 0,
      hasNextPage: res.hasNextPage,
      hasPrevPage: res.hasPrevPage,
    };
  },
  create: async (data) => api.create(data),
  read: async (id) => api.findOne(id),
  update: async (id, data) => api.update(id, data),
  delete: async (id) => api.remove(id),
};
