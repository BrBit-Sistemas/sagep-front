import type { FichasCadastraisListParams } from '../types';

export const fichasCadastraisKeys = {
  all: ['fichas-cadastrais'] as const,
  lists: () => [...fichasCadastraisKeys.all, 'list'] as const,
  list: (params: FichasCadastraisListParams) => [...fichasCadastraisKeys.lists(), params] as const,
  metrics: () => [...fichasCadastraisKeys.all, 'metrics'] as const,
};
