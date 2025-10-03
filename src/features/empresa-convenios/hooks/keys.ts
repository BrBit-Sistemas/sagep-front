import type { PaginatedParams } from 'src/types';

export const empresaConvenioKeys = {
  all: ['empresa-convenios'] as const,
  list: (params: PaginatedParams) => [...empresaConvenioKeys.all, params] as const,
};
