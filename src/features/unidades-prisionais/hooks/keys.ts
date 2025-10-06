import type { UnidadePrisionalListParams } from 'src/features/unidades-prisionais/types';

export const unidadePrisionalKeys = {
  all: ['unidades-prisionais'] as const,
  list: (params: UnidadePrisionalListParams) => [...unidadePrisionalKeys.all, params] as const,
};
