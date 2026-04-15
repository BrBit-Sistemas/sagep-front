import type { ValidacoesListParams } from '../types';

export const validacoesKeys = {
  all: ['fichas-cadastrais-validacoes'] as const,
  lists: () => [...validacoesKeys.all, 'list'] as const,
  list: (params: ValidacoesListParams) => [...validacoesKeys.lists(), params] as const,
  details: () => [...validacoesKeys.all, 'detail'] as const,
  detail: (fichaId: string) => [...validacoesKeys.details(), fichaId] as const,
  metrics: () => [...validacoesKeys.all, 'metrics'] as const,
};
