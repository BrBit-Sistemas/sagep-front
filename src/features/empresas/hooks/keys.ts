import type { EmpresaListParams } from 'src/features/empresas/types';

export const empresaKeys = {
  all: ['empresas'] as const,
  list: (params: EmpresaListParams) => [...empresaKeys.all, params] as const,
};
