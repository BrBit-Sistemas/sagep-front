import type { PaginatedParams } from 'src/types';

export const unidadePrisionalKeys = {
  all: ['unidades-prisionais'] as const,
  list: (params: PaginatedParams) => [...unidadePrisionalKeys.all, params] as const,
};
