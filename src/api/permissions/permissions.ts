import type { BodyType } from '../../lib/axios';

import { customInstance } from '../../lib/axios';

export type PermissionDto = {
  id: string;
  action: string;
  subject: string;
};

export type RoleDto = {
  id: string;
  nome: string;
  descricao: string;
  permissions: PermissionDto[];
};

export type PaginateDto<T> = {
  totalPages: number;
  page: number;
  limit: number;
  total: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
  items: T[];
};

type SecondParameter<T extends (...args: never) => unknown> = Parameters<T>[1];

export const getPermissionsApi = () => {
  const listPermissions = (options?: SecondParameter<typeof customInstance>) =>
    customInstance<PermissionDto[]>({ url: `/auth/permissions`, method: 'GET' }, options);

  const paginateRoles = (
    params?: { page?: number; limit?: number; search?: string },
    options?: SecondParameter<typeof customInstance>
  ) => customInstance<PaginateDto<RoleDto>>({ url: `/auth/roles`, method: 'GET', params }, options);

  const createRole = (
    dto: BodyType<{ nome: string; descricao: string; permissionIds?: string[] }>,
    options?: SecondParameter<typeof customInstance>
  ) =>
    customInstance<RoleDto>(
      {
        url: `/auth/roles`,
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        data: dto,
      },
      options
    );

  const updateRole = (
    id: string,
    dto: BodyType<{ nome?: string; descricao?: string; permissionIds?: string[] }>,
    options?: SecondParameter<typeof customInstance>
  ) =>
    customInstance<RoleDto>(
      {
        url: `/auth/roles/${id}`,
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        data: dto,
      },
      options
    );

  const removeRole = (id: string, options?: SecondParameter<typeof customInstance>) =>
    customInstance<void>({ url: `/auth/roles/${id}`, method: 'DELETE' }, options);

  const updateUserRoles = (
    id: string,
    roleIds: string[],
    options?: SecondParameter<typeof customInstance>
  ) =>
    customInstance(
      {
        url: `/usuarios/${id}`,
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        data: { roleIds } as any,
      },
      options
    );

  return {
    listPermissions,
    paginateRoles,
    createRole,
    updateRole,
    removeRole,
    updateUserRoles,
  };
};
