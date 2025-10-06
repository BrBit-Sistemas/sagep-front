import type { RegionalListParams } from 'src/features/regionais/types';

export const regionalKeys = {
  all: ['regionais'] as const,
  list: (params: RegionalListParams) => [...regionalKeys.all, params] as const,
  detail: (id: string) => [...regionalKeys.all, 'detail', id] as const,
};
