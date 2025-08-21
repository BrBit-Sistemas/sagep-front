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
  paginate: async (params: PaginatedParams): Promise<PaginatedResponse<ReadProfissaoDto>> => {
    const response = await api.findAll(params);
    return response;
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
