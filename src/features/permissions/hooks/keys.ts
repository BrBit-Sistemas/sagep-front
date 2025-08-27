import type { PaginatedParams } from 'src/types';

export const permissionsKeys = {
  all: ['permissions'] as const,
  list: () => [...permissionsKeys.all, 'list'] as const,
  rolesAll: ['roles'] as const,
  rolesList: (params: PaginatedParams) => [...permissionsKeys.rolesAll, params] as const,
  roleDetail: (id: string) => [...permissionsKeys.rolesAll, 'detail', id] as const,
};

