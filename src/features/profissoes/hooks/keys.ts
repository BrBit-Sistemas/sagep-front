import type { PaginatedParams } from 'src/types';

export const profissaoKeys = {
  all: ['profissoes'] as const,
  list: (params: PaginatedParams) => [...profissaoKeys.all, params] as const,
};
