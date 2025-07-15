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
  create: (data: CreateUserSchema) => api.create(data),
  update: (id: string, data: UpdateUserSchema) => api.update(id, data),
  delete: (id: string) => api.remove(id),
};
