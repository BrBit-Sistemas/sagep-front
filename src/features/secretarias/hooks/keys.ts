import type { PaginatedParams } from 'src/types';

export const secretariaKeys = {
  all: ['secretarias'] as const,
  list: (params: PaginatedParams) => [...secretariaKeys.all, params] as const,
  detail: (id: string) => [...secretariaKeys.all, 'detail', id] as const,
};
