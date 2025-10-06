import type { EmpresaListParams } from 'src/features/empresas/types';

import { useQuery, queryOptions } from '@tanstack/react-query';

import { empresaKeys } from './keys';
import { empresaService } from '../data';

export const listEmpresaQueryOptions = (params: EmpresaListParams) =>
  queryOptions({
    queryKey: empresaKeys.list(params),
    queryFn: () => empresaService.paginate(params),
  });

export const useEmpresaList = (params: EmpresaListParams) =>
  useQuery(listEmpresaQueryOptions(params));
