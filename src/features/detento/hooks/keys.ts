import type { DetentoListParams } from '../types';

export const detentoKeys = {
  all: ['detentos'] as const,
  list: (params: DetentoListParams) => [...detentoKeys.all, params] as const,
};
