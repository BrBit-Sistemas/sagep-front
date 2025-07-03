import type { PaginatedParams } from 'src/types';

export const empresaKeys = {
  all: ['empresas'] as const,
  list: (params: PaginatedParams) => [...empresaKeys.all, params] as const,
};
