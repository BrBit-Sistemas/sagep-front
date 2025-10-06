import type { CrudService, PaginatedParams, PaginatedResponse } from 'src/types';
import type {
  ReadProfissaoDto,
  CreateProfissaoDto,
  UpdateProfissaoDto,
} from 'src/api/generated.schemas';

import { getProfissoes } from 'src/api/profissoes/profissoes';

const api = getProfissoes();

export const profissaoService: CrudService<
  ReadProfissaoDto,
  CreateProfissaoDto,
  UpdateProfissaoDto,
  PaginatedParams
> = {
  paginate: async ({ page, limit, search }: PaginatedParams): Promise<PaginatedResponse<ReadProfissaoDto>> => {
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
  create: async (data: CreateProfissaoDto): Promise<ReadProfissaoDto> => {
    const response = await api.create(data);
    return response;
  },
  read: async (id: string): Promise<ReadProfissaoDto> => {
    const response = await api.findOne(id);
    return response;
  },
  update: async (id: string, data: UpdateProfissaoDto): Promise<ReadProfissaoDto> => {
    const response = await api.update(id, data);
    return response;
  },
  delete: async (id: string): Promise<void> => {
    await api.remove(id);
  },
};
