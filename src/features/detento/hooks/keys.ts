import type { PaginatedParams } from 'src/types';

export const detentoKeys = {
  all: ['detentos'] as const,
  list: (params: PaginatedParams) => [...detentoKeys.all, params] as const,
  read: (id: string) => [...detentoKeys.all, 'read', id] as const,
};
