import type { CrudService } from 'src/types';
import type { UserListParams } from 'src/features/users/types';
import type { ReadUsuarioDto } from 'src/api/generated.schemas';
import type { CreateUserSchema, UpdateUserSchema } from 'src/features/users/schemas';

import { getUsuários } from 'src/api/usuários/usuários';

const api = getUsuários();

export const userService: CrudService<
  ReadUsuarioDto,
  CreateUserSchema,
  UpdateUserSchema,
  UserListParams
> = {
  paginate: async ({ page, limit, search, nome, email, sort, order }: any) => {
    // Converter página de 1-based (frontend) para 0-based (backend)
    const backendPage = page - 1;
    
    const res = await api.paginate({ page: backendPage, limit, search, nome, email, sort, order });
    return {
      items: res.items,
      page: Number(res.page) + 1, // Converter de volta para 1-based para o frontend
      limit: res.limit,
      total: res.total,
      totalPages: Math.ceil((res.total ?? 0) / (res.limit || 1)) || 0,
      hasNextPage: res.hasNextPage,
      hasPrevPage: res.hasPrevPage,
    } as const;
  },
  read: (id: string) => api.findOne(id),
  create: (data: CreateUserSchema) => {
    const payload = {
      nome: data.nome,
      cpf: data.cpf,
      email: data.email,
      senha: data.senha,
      secretariaId: data.secretariaId ?? '',
      regionalId: data.regionalId ?? '',
      unidadeId: data.unidadeId ?? '',
    };
    return api.create(payload);
  },
  update: (id: string, data: UpdateUserSchema) => {
    const payload: Record<string, unknown> = {};
    if (typeof data.nome !== 'undefined') payload.nome = data.nome;
    if (typeof data.cpf !== 'undefined') payload.cpf = data.cpf;
    if (typeof data.email !== 'undefined') payload.email = data.email;
    if (typeof data.senha !== 'undefined' && data.senha !== '') payload.senha = data.senha;
    if (typeof data.secretariaId !== 'undefined') payload.secretariaId = data.secretariaId;
    if (typeof data.regionalId !== 'undefined') payload.regionalId = data.regionalId;
    if (typeof data.unidadeId !== 'undefined') payload.unidadeId = data.unidadeId;
    return api.update(id, payload as UpdateUserSchema);
  },
  delete: (id: string) => api.remove(id),
};
