import type { ProfissaoListParams } from 'src/features/profissoes/types';

export const profissaoKeys = {
  all: ['profissoes'] as const,
  list: (params: ProfissaoListParams) => [...profissaoKeys.all, params] as const,
};
