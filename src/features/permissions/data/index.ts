import type { PaginatedParams } from 'src/types';
import type { RoleDto } from 'src/api/permissions/permissions';

import { getPermissionsApi } from 'src/api/permissions/permissions';

const api = getPermissionsApi();

export type CreateRoleInput = {
  nome: string;
  descricao: string;
  permissionIds?: string[];
};

export type UpdateRoleInput = Partial<CreateRoleInput>;

export const roleService = {
  paginate: async (params: PaginatedParams) => api.paginateRoles(params).then((r) => r),
  create: async (data: CreateRoleInput) => api.createRole(data).then((r) => r),
  read: async (id: string) => fetchRole(id),
  update: async (id: string, data: UpdateRoleInput) => api.updateRole(id, data).then((r) => r),
  delete: async (id: string) => api.removeRole(id).then((r) => r),
};

async function fetchRole(id: string): Promise<RoleDto> {
  // Minimal fetch using the same axios instance
  const { customInstance } = await import('src/lib/axios');
  const res = await customInstance<RoleDto>({ url: `/auth/roles/${id}`, method: 'GET' });
  return res;
}
