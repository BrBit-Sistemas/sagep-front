import type { SecretariaListParams } from 'src/features/secretarias/types';

export const secretariaKeys = {
  all: ['secretarias'] as const,
  list: (params: SecretariaListParams) => [...secretariaKeys.all, params] as const,
  detail: (id: string) => [...secretariaKeys.all, 'detail', id] as const,
};
