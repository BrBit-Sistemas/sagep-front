import type { PaginatedParams } from 'src/types';

export const detentoKeys = {
  all: ['detentos'] as const,
  list: (params: PaginatedParams) => [...detentoKeys.all, params] as const,
};
