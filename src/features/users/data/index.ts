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
  paginate: (params: UserListParams) => api.paginate(params),
  read: (id: string) => api.findOne(id),
  create: (data: CreateUserSchema) => {
    const payload = {
      nome: data.nome,
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
    if (typeof data.email !== 'undefined') payload.email = data.email;
    if (typeof data.senha !== 'undefined' && data.senha !== '') payload.senha = data.senha;
    if (typeof data.secretariaId !== 'undefined') payload.secretariaId = data.secretariaId;
    if (typeof data.regionalId !== 'undefined') payload.regionalId = data.regionalId;
    if (typeof data.unidadeId !== 'undefined') payload.unidadeId = data.unidadeId;
    return api.update(id, payload as UpdateUserSchema);
  },
  delete: (id: string) => api.remove(id),
};
