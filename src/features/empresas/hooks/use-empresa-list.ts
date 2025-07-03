import type { PaginatedParams } from 'src/types';

import { useQuery, queryOptions } from '@tanstack/react-query';

import { empresaKeys } from './keys';
import { empresaService } from '../data';

export const listEmpresaQueryOptions = (params: PaginatedParams) =>
  queryOptions({
    queryKey: empresaKeys.list(params),
    queryFn: () => empresaService.paginate(params),
  });

export const useEmpresaList = (params: PaginatedParams) =>
  useQuery(listEmpresaQueryOptions(params));
