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
  create: async (data: CreateSecretariaDto) => api.create(data),
  read: async (id: string) => api.findOne(id),
  update: async (id: string, data: UpdateSecretariaDto) => api.update(id, data),
  delete: async (id: string) => api.remove(id),
};
