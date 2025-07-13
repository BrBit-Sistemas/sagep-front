import type { PaginatedParams } from 'src/types';

export const regionalKeys = {
  all: ['regionais'] as const,
  list: (params: PaginatedParams) => [...regionalKeys.all, params] as const,
  detail: (id: string) => [...regionalKeys.all, 'detail', id] as const,
};
